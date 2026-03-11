import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  BADGE_TYPE_IDS,
  BLOCK_BADGE_ABI,
  BLOCK_BADGE_ADDRESS,
  getPublicClient,
  getMinterWalletClient,
} from "@/lib/contract";
import { decodeEventLog } from "viem";

export const maxDuration = 60;

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, badgeId } = body as {
      wallet?: string;
      badgeId?: string;
    };

    // ── Validate inputs ──────────────────────────────────
    if (!wallet || !WALLET_RE.test(wallet)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!badgeId || !(badgeId in BADGE_TYPE_IDS)) {
      return NextResponse.json(
        { error: "Invalid badge ID" },
        { status: 400 }
      );
    }

    if (!BLOCK_BADGE_ADDRESS) {
      return NextResponse.json(
        { error: "Contract not configured" },
        { status: 503 }
      );
    }

    const normalizedWallet = wallet.toLowerCase();
    const badgeTypeId = BADGE_TYPE_IDS[badgeId];

    // ── Check DB: must be qualified + not already minted ──
    const dbWallet = await prisma.wallet.findUnique({
      where: { address: normalizedWallet },
      include: {
        badges: {
          where: { badgeId },
          take: 1,
        },
      },
    });

    if (!dbWallet || !dbWallet.badges[0]) {
      return NextResponse.json(
        { error: "Badge not verified yet. Run verification first." },
        { status: 400 }
      );
    }

    const mintRecord = dbWallet.badges[0];

    if (!mintRecord.qualified) {
      return NextResponse.json(
        { error: "Wallet not qualified for this badge" },
        { status: 400 }
      );
    }

    if (mintRecord.status === "MINTED") {
      return NextResponse.json({
        alreadyMinted: true,
        mintTxHash: mintRecord.mintTxHash,
        tokenId: mintRecord.tokenId?.toString() ?? null,
        explorerUrl: mintRecord.mintTxHash
          ? `https://basescan.org/tx/${mintRecord.mintTxHash}`
          : null,
      });
    }

    if (mintRecord.status === "MINTING") {
      return NextResponse.json(
        { error: "Mint already in progress" },
        { status: 409 }
      );
    }

    // ── Set status to MINTING ────────────────────────────
    await prisma.badgeMint.update({
      where: { id: mintRecord.id },
      data: { status: "MINTING" },
    });

    // ── Call contract mint() via server wallet ───────────
    const publicClient = getPublicClient();
    const walletClient = getMinterWalletClient();

    let txHash: `0x${string}`;
    try {
      txHash = await walletClient.writeContract({
        address: BLOCK_BADGE_ADDRESS,
        abi: BLOCK_BADGE_ABI,
        functionName: "mint",
        args: [normalizedWallet as `0x${string}`, BigInt(badgeTypeId)],
      });
    } catch (err) {
      // Revert status on tx failure
      await prisma.badgeMint.update({
        where: { id: mintRecord.id },
        data: {
          status: "FAILED",
          error: err instanceof Error ? err.message : "Transaction failed",
        },
      });
      throw err;
    }

    // ── Wait for receipt ─────────────────────────────────
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    // ── Parse BadgeMinted event for tokenId ──────────────
    let tokenId: bigint | null = null;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: BLOCK_BADGE_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "BadgeMinted") {
          const args = decoded.args as unknown as {
            to: string;
            tokenId: bigint;
            badgeTypeId: bigint;
          };
          tokenId = args.tokenId;
          break;
        }
      } catch {
        // Not our event, skip
      }
    }

    // ── Update DB: MINTED ────────────────────────────────
    await prisma.badgeMint.update({
      where: { id: mintRecord.id },
      data: {
        status: "MINTED",
        mintTxHash: txHash,
        tokenId,
        mintedAt: new Date(),
        chainId: 8453, // Base mainnet
      },
    });

    return NextResponse.json({
      mintTxHash: txHash,
      tokenId: tokenId?.toString() ?? null,
      explorerUrl: `https://basescan.org/tx/${txHash}`,
    });
  } catch (error) {
    console.error("Mint badge failed:", error);
    return NextResponse.json({ error: "Minting failed" }, { status: 500 });
  }
}
