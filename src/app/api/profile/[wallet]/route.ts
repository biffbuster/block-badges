import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Tier } from "@/lib/achievements";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

const TIER_THRESHOLDS: { min: number; tier: Tier }[] = [
  { min: 5000, tier: "veteran" },
  { min: 2000, tier: "hard" },
  { min: 800, tier: "intermediate" },
  { min: 200, tier: "easy" },
  { min: 0, tier: "beginner" },
];

function computeTier(points: number): Tier {
  return TIER_THRESHOLDS.find((t) => points >= t.min)?.tier ?? "beginner";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  const { wallet } = await params;

  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  const normalizedWallet = wallet.toLowerCase();

  const dbWallet = await prisma.wallet.findUnique({
    where: { address: normalizedWallet },
    include: {
      badges: {
        where: { qualified: true },
      },
    },
  });

  if (!dbWallet) {
    return NextResponse.json({
      wallet: normalizedWallet,
      totalUnlocked: 0,
      totalPoints: 0,
      tier: "beginner" as Tier,
      firstSeen: null,
      unlockedBadgeIds: [],
    });
  }

  // Import achievements to calculate points
  const { achievements } = await import("@/lib/achievements");
  const pointsMap = new Map(achievements.map((a) => [a.id, a.points]));

  const totalPoints = dbWallet.badges.reduce(
    (sum, u) => sum + (pointsMap.get(u.badgeId) ?? 0),
    0
  );

  return NextResponse.json({
    wallet: normalizedWallet,
    totalUnlocked: dbWallet.badges.length,
    totalPoints,
    tier: computeTier(totalPoints),
    firstSeen: dbWallet.firstSeen,
    unlockedBadgeIds: dbWallet.badges.map((u) => u.badgeId),
  });
}
