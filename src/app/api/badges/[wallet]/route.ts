import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { achievements } from "@/lib/achievements";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

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
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dbWallet) {
    return NextResponse.json({ wallet: normalizedWallet, badges: [] });
  }

  const badges = dbWallet.badges.map((mint) => {
    const achievement = achievements.find((a) => a.id === mint.badgeId);
    return {
      achievementId: mint.badgeId,
      name: achievement?.name ?? mint.badgeId,
      description: achievement?.description ?? "",
      icon: achievement?.icon ?? "",
      tier: achievement?.tier ?? "beginner",
      points: achievement?.points ?? 0,
      chain: achievement?.chain ?? "Unknown",
      unlockedAt: mint.createdAt,
      mintStatus: mint.status,
      mintTxHash: mint.mintTxHash,
      tokenId: mint.tokenId ? mint.tokenId.toString() : null,
    };
  });

  return NextResponse.json({ wallet: normalizedWallet, badges });
}
