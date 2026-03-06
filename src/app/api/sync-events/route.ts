import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  BADGE_VERIFIER_ABI,
  BADGE_VERIFIER_ADDRESS,
  BADGE_TYPE_NAMES,
  BLOCK_BADGE_ABI,
  BLOCK_BADGE_ADDRESS,
  getPublicClient,
} from "@/lib/contract";
import { decodeEventLog } from "viem";

export const maxDuration = 60;

// Sync BadgeVerified events from the BadgeVerifier contract
// and BadgeMinted events from the BlockBadge contract.
// This keeps the Neon DB in sync with on-chain state.

const SYNC_BLOCK_RANGE = BigInt(5000); // How many blocks to scan per call

export async function POST() {
  try {
    if (!BADGE_VERIFIER_ADDRESS || !BLOCK_BADGE_ADDRESS) {
      return NextResponse.json(
        { error: "Contract addresses not configured" },
        { status: 503 }
      );
    }

    const publicClient = getPublicClient();
    const currentBlock = await publicClient.getBlockNumber();

    // Determine start block: look back SYNC_BLOCK_RANGE blocks
    const fromBlock =
      currentBlock > SYNC_BLOCK_RANGE
        ? currentBlock - SYNC_BLOCK_RANGE
        : BigInt(0);

    // Fetch BadgeVerified events
    const verifiedLogs = await publicClient.getLogs({
      address: BADGE_VERIFIER_ADDRESS,
      event: {
        type: "event",
        name: "BadgeVerified",
        inputs: [
          { name: "wallet", type: "address", indexed: true },
          { name: "badgeTypeId", type: "uint256", indexed: true },
          { name: "qualified", type: "bool", indexed: false },
          { name: "queryId", type: "bytes32", indexed: false },
        ],
      },
      fromBlock,
      toBlock: currentBlock,
    });

    // Fetch BadgeMinted events
    const mintedLogs = await publicClient.getLogs({
      address: BLOCK_BADGE_ADDRESS,
      event: {
        type: "event",
        name: "BadgeMinted",
        inputs: [
          { name: "to", type: "address", indexed: true },
          { name: "tokenId", type: "uint256", indexed: true },
          { name: "badgeTypeId", type: "uint256", indexed: true },
        ],
      },
      fromBlock,
      toBlock: currentBlock,
    });

    let synced = 0;

    // Process BadgeVerified events
    for (const log of verifiedLogs) {
      try {
        const decoded = decodeEventLog({
          abi: BADGE_VERIFIER_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== "BadgeVerified") continue;

        const args = decoded.args as unknown as {
          wallet: string;
          badgeTypeId: bigint;
          qualified: boolean;
          queryId: string;
        };

        const wallet = args.wallet.toLowerCase();
        const badgeTypeId = Number(args.badgeTypeId);
        const badgeId = BADGE_TYPE_NAMES[badgeTypeId];

        if (!badgeId) continue;

        // Upsert wallet
        const dbWallet = await prisma.wallet.upsert({
          where: { address: wallet },
          update: {},
          create: { address: wallet },
        });

        // Upsert badge mint record
        await prisma.badgeMint.upsert({
          where: {
            walletId_badgeId: {
              walletId: dbWallet.id,
              badgeId,
            },
          },
          update: {
            qualified: args.qualified,
            status: args.qualified ? "PROVING" : "FAILED",
            zkpayTxHash: log.transactionHash,
            chainId: 8453,
          },
          create: {
            walletId: dbWallet.id,
            badgeId,
            qualified: args.qualified,
            status: args.qualified ? "PROVING" : "FAILED",
            zkpayTxHash: log.transactionHash,
            chainId: 8453,
          },
        });

        synced++;
      } catch {
        // Skip events we can't decode
      }
    }

    // Process BadgeMinted events
    for (const log of mintedLogs) {
      try {
        const decoded = decodeEventLog({
          abi: BLOCK_BADGE_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== "BadgeMinted") continue;

        const args = decoded.args as unknown as {
          to: string;
          tokenId: bigint;
          badgeTypeId: bigint;
        };

        const wallet = args.to.toLowerCase();
        const badgeTypeId = Number(args.badgeTypeId);
        const badgeId = BADGE_TYPE_NAMES[badgeTypeId];

        if (!badgeId) continue;

        // Upsert wallet
        const dbWallet = await prisma.wallet.upsert({
          where: { address: wallet },
          update: {},
          create: { address: wallet },
        });

        // Update badge mint record to MINTED
        await prisma.badgeMint.upsert({
          where: {
            walletId_badgeId: {
              walletId: dbWallet.id,
              badgeId,
            },
          },
          update: {
            status: "MINTED",
            qualified: true,
            tokenId: args.tokenId,
            mintTxHash: log.transactionHash,
            mintedAt: new Date(),
            chainId: 8453,
          },
          create: {
            walletId: dbWallet.id,
            badgeId,
            qualified: true,
            status: "MINTED",
            tokenId: args.tokenId,
            mintTxHash: log.transactionHash,
            mintedAt: new Date(),
            chainId: 8453,
          },
        });

        synced++;
      } catch {
        // Skip events we can't decode
      }
    }

    return NextResponse.json({
      synced,
      fromBlock: fromBlock.toString(),
      toBlock: currentBlock.toString(),
      verifiedEvents: verifiedLogs.length,
      mintedEvents: mintedLogs.length,
    });
  } catch (error) {
    console.error("Sync events failed:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
