import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * DEV-ONLY: Reset a wallet's badge so you can re-test the unlock flow.
 *
 * POST /api/dev/reset-badge
 * Body: { wallet: "0x...", badgeId?: "ethereum-villager" }
 *
 * - If badgeId provided → deletes that one BadgeMint
 * - If badgeId omitted  → deletes ALL BadgeMints for that wallet
 *
 * Remove this file before deploying to production.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { wallet, badgeId } = (await req.json()) as {
    wallet?: string;
    badgeId?: string;
  };

  if (!wallet) {
    return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
  }

  const normalizedWallet = wallet.toLowerCase();

  const dbWallet = await prisma.wallet.findUnique({
    where: { address: normalizedWallet },
  });

  if (!dbWallet) {
    return NextResponse.json({ error: "Wallet not found in DB" }, { status: 404 });
  }

  if (badgeId) {
    const deleted = await prisma.badgeMint.deleteMany({
      where: { walletId: dbWallet.id, badgeId },
    });
    return NextResponse.json({
      reset: true,
      wallet: normalizedWallet,
      badgeId,
      deletedCount: deleted.count,
    });
  }

  const deleted = await prisma.badgeMint.deleteMany({
    where: { walletId: dbWallet.id },
  });
  return NextResponse.json({
    reset: true,
    wallet: normalizedWallet,
    badgeId: "ALL",
    deletedCount: deleted.count,
  });
}
