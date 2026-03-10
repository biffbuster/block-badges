import { NextRequest, NextResponse } from "next/server";
import { achievements } from "@/lib/achievements";
import { queryAndVerify } from "@/lib/sxt";
import { evaluateResult } from "@/lib/evaluators";
import { prisma } from "@/lib/db";
import { BADGE_TYPE_IDS } from "@/lib/contract";

export const maxDuration = 120;

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;
const META_ACHIEVEMENTS = new Set(["chain-immortal", "multichain-explorer"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, achievementId } = body as {
      wallet?: string;
      achievementId?: string;
    };

    if (!wallet || !WALLET_RE.test(wallet)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!achievementId) {
      return NextResponse.json(
        { error: "Missing achievementId" },
        { status: 400 }
      );
    }

    if (META_ACHIEVEMENTS.has(achievementId)) {
      return NextResponse.json(
        { error: "Meta-achievements cannot be verified individually" },
        { status: 400 }
      );
    }

    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    const normalizedWallet = wallet.toLowerCase();

    // Check DB for existing qualified unlock — return cached if found
    const existingWallet = await prisma.wallet.findUnique({
      where: { address: normalizedWallet },
      include: {
        badges: {
          where: { badgeId: achievementId, qualified: true },
          take: 1,
        },
      },
    });

    if (existingWallet?.badges[0]) {
      const cached = existingWallet.badges[0];
      return NextResponse.json({
        verified: true,
        qualified: true,
        cached: true,
        achievementId,
        achievementName: achievement.name,
        result: null,
        unlockedAt: cached.createdAt,
        mintable: cached.status !== "MINTED" && cached.status !== "MINTING",
        mintStatus: cached.status,
        mintTxHash: cached.mintTxHash ?? null,
        tokenId: cached.tokenId?.toString() ?? null,
      });
    }

    // Inject wallet address into SQL template
    const sql = achievement.query.replace(/\{wallet\}/g, normalizedWallet);

    const result = await queryAndVerify(sql);
    const qualified = evaluateResult(achievementId, result);

    // Ensure badge definition exists (auto-seed from achievements array)
    await prisma.badgeDefinition.upsert({
      where: { id: achievementId },
      update: {},
      create: {
        id: achievementId,
        name: achievement.name,
        description: achievement.description,
        sqlTemplate: achievement.query,
        chain: achievement.chain,
        category: achievement.chain,
        tier: achievement.tier,
        points: achievement.points,
      },
    });

    // Upsert wallet + achievement unlock
    const dbWallet = await prisma.wallet.upsert({
      where: { address: normalizedWallet },
      update: { lastSeen: new Date() },
      create: { address: normalizedWallet },
    });

    const badgeMint = await prisma.badgeMint.upsert({
      where: {
        walletId_badgeId: {
          walletId: dbWallet.id,
          badgeId: achievementId,
        },
      },
      update: {
        qualified,
        sqlQuery: sql,
        status: qualified ? "PROVING" : "FAILED",
      },
      create: {
        walletId: dbWallet.id,
        badgeId: achievementId,
        qualified,
        sqlQuery: sql,
        status: qualified ? "PROVING" : "FAILED",
      },
    });

    // Check if this badge has a contract type ID (is mintable onchain)
    const hasBadgeType = achievementId in BADGE_TYPE_IDS;

    return NextResponse.json({
      verified: true,
      qualified,
      achievementId,
      achievementName: achievement.name,
      result,
      unlockedAt: new Date(),
      mintable: qualified && hasBadgeType && badgeMint.status !== "MINTED",
      mintStatus: badgeMint.status,
      mintTxHash: badgeMint.mintTxHash ?? null,
      tokenId: badgeMint.tokenId?.toString() ?? null,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Achievement check failed:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { verified: false, error: message },
      { status: 500 }
    );
  }
}
