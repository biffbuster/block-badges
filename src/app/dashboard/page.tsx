"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, Flame, Crown, Clock, Users, Star, Shield, Sparkles, ExternalLink, Zap, ChevronUp, CalendarCheck, Activity, Copy, Check, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ─── Tier config (T1–T5) ─── */
const tierConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  T1: {
    label: "T1",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
    border: "rgba(74,222,128,0.3)",
    glow: "rgba(74,222,128,0.15)",
  },
  T2: {
    label: "T2",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
    glow: "rgba(96,165,250,0.15)",
  },
  T3: {
    label: "T3",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    glow: "rgba(245,158,11,0.15)",
  },
  T4: {
    label: "T4",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.3)",
    glow: "rgba(192,132,252,0.15)",
  },
  T5: {
    label: "T5",
    color: "#f97316",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.4)",
    glow: "rgba(249,115,22,0.25)",
  },
};

function TierLabel({ tier }: { tier: string }) {
  const t = tierConfig[tier] ?? tierConfig.T1;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm"
      style={{
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: `0 0 10px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        textShadow: `0 0 8px ${t.glow}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
      />
      {t.label}
    </span>
  );
}

/* ─── Card carousel images for the hero ─── */
const heroCarouselCards = [
  { src: "/cards/whale_activity.png", alt: "Whale Activity" },
  { src: "/cards/diamond_hands.png", alt: "Diamond Hands" },
  { src: "/cards/gas_guzzler.png", alt: "Gas Guzzler" },
  { src: "/cards/base_bull.png", alt: "Base Bull" },
  { src: "/cards/memecoin.png", alt: "Memecoiner" },
  { src: "/cards/8.png", alt: "Sandwich'd" },
  { src: "/cards/9.png", alt: "Data Wrangler" },
  { src: "/cards/10.png", alt: "Bullseye" },
  { src: "/cards/11.png", alt: "Squiggler" },
  { src: "/cards/nft_flipper (2).png", alt: "NFT Flipper" },
  { src: "/cards/eth_steak.png", alt: "ETH Steak" },
  { src: "/cards/art_blocks.png", alt: "Art Blocks" },
];

/* ─── Trending cards (6 in the loop) — live achievements ─── */
const trendingCards = [
  {
    id: "whale-activity",
    name: "Whale Activity",
    description: "Hold at least 100 ETH.",
    image: "/cards/whale_activity.png",
    tier: "T5",
    color: "#38bdf8",
    hot: true,
    wallet: "0x1a2B...9f3E",
    username: "whalegod.eth",
    time: "12 min ago",
  },
  {
    id: "diamond-hands",
    name: "Diamond Hands",
    description: "Hold 1 BTC for 3 years minimum.",
    image: "/cards/diamond_hands.png",
    tier: "T4",
    color: "#e2e8f0",
    hot: false,
    wallet: "0x7dC4...2aB1",
    username: "hodlking",
    time: "30 min ago",
  },
  {
    id: "gas-guzzler",
    name: "Gas Guzzler",
    description: "Spend over 10 ETH in gas on Ethereum mainnet.",
    image: "/cards/gas_guzzler.png",
    tier: "T2",
    color: "#f97316",
    hot: true,
    wallet: "0xaE91...4cD8",
    username: "gasburner.eth",
    time: "1 hr ago",
  },
  {
    id: "nft-upper-class",
    name: "NFT Upper Class",
    description: "Make $20K profit in one NFT trade.",
    image: "/cards/nft_20k.png",
    tier: "T5",
    color: "#f59e0b",
    hot: false,
    wallet: "0x3bF2...8eA5",
    username: "nftwhale",
    time: "2 hrs ago",
  },
  {
    id: "memecoiner",
    name: "The Memecoiner",
    description: "Hold $PEPE, $BOBO, $DOGE, or WIF for over 365 days.",
    image: "/cards/memecoin.png",
    tier: "T3",
    color: "#e879f9",
    hot: true,
    wallet: "0xf4D7...1bC3",
    username: "pepelord.eth",
    time: "3 hrs ago",
  },
  {
    id: "bullseye",
    name: "Bullseye",
    description: "Sold a BAYC 10% from the top.",
    image: "/cards/10.png",
    tier: "T5",
    color: "#3b82f6",
    hot: true,
    wallet: "0x82eA...5dF9",
    username: "apesniper",
    time: "5 hrs ago",
  },
];

/* ─── Popular badges row (4 cards) ─── */
const popularBadges = [
  { id: "etherean", name: "The Etherean", image: "/cards/etherean (2).png", badge: "/badges/opensea_badge.png", tier: "T2", color: "#60a5fa", description: "Hold at least one ETH.", chain: "Ethereum" },
  { id: "multichain", name: "Multichain Maximalist", image: "/cards/multi-chain.png", badge: "/badges/25.png", tier: "T3", color: "#60a5fa", description: "Used 5 different blockchains.", chain: "Multi" },
  { id: "opensea", name: "Opensea VIP", image: "/cards/opensea (2).png", badge: "/badges/4.png", tier: "T3", color: "#22d3ee", description: "Bought an NFT before 2021.", chain: "Ethereum" },
  { id: "art-blocks", name: "Fine Art Collector", image: "/cards/art_blocks.png", badge: "/badges/21.png", tier: "T3", color: "#4ade80", description: "Hold 3 or more Art Blocks items.", chain: "Ethereum" },
];

/* ─── Recent activity feed data ─── */
const recentActivity = [
  { badge: "Whale Activity", image: "/cards/whale_activity.png", wallet: "0x1a2B...9f3E", username: "whalegod.eth", time: "12m", tier: "T5" },
  { badge: "Diamond Hands", image: "/cards/diamond_hands.png", wallet: "0x7dC4...2aB1", username: "hodlking", time: "30m", tier: "T4" },
  { badge: "Gas Guzzler", image: "/cards/gas_guzzler.png", wallet: "0xaE91...4cD8", username: "gasburner.eth", time: "1h", tier: "T2" },
  { badge: "The Etherean", image: "/cards/etherean (2).png", wallet: "0xfB23...7aC2", username: "ethmaxi", time: "2h", tier: "T2" },
  { badge: "Base Bull", image: "/cards/base_bull.png", wallet: "0x4eD1...9bF6", username: "basedking.eth", time: "3h", tier: "T2" },
  { badge: "NFT Upper Class", image: "/cards/nft_20k.png", wallet: "0x3bF2...8eA5", username: "nftwhale", time: "5h", tier: "T5" },
  { badge: "Opensea VIP", image: "/cards/opensea (2).png", wallet: "0xc7A3...6dE2", username: "earlybird", time: "6h", tier: "T3" },
  { badge: "The Memecoiner", image: "/cards/memecoin.png", wallet: "0xf4D7...1bC3", username: "pepelord.eth", time: "8h", tier: "T3" },
  { badge: "Fine Art Collector", image: "/cards/art_blocks.png", wallet: "0x9eB5...3fA7", username: "artmaxi", time: "10h", tier: "T3" },
  { badge: "Rug Victim", image: "/cards/emn_rug.png", wallet: "0x2dF8...7cE1", username: "rugpull.eth", time: "12h", tier: "T2" },
  { badge: "Multichain Max", image: "/cards/multi-chain.png", wallet: "0x5aG2...8hB4", username: "bridgelord", time: "14h", tier: "T3" },
  { badge: "The Validator", image: "/cards/eth_steak.png", wallet: "0x8kL9...2mN6", username: "stakoor.eth", time: "16h", tier: "T2" },
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/* ─── XP / Level system ─── */
const LEVELS = [
  { level: 1, title: "Newcomer", xpRequired: 0 },
  { level: 2, title: "Explorer", xpRequired: 150 },
  { level: 3, title: "Apprentice", xpRequired: 400 },
  { level: 4, title: "Pathfinder", xpRequired: 750 },
  { level: 5, title: "Veteran", xpRequired: 1200 },
  { level: 6, title: "Elite", xpRequired: 1800 },
  { level: 7, title: "Champion", xpRequired: 2500 },
  { level: 8, title: "Legend", xpRequired: 3500 },
  { level: 9, title: "Mythic", xpRequired: 5000 },
  { level: 10, title: "Onchain God", xpRequired: 7000 },
];

function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const xpIntoLevel = xp - current.xpRequired;
  const xpForNextLevel = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min(xpIntoLevel / xpForNextLevel, 1) : 1;
  return { current, next, progress, xpIntoLevel, xpForNextLevel };
}

function canCheckInToday(lastCheckIn: string | null): boolean {
  if (!lastCheckIn) return true;
  const last = new Date(lastCheckIn);
  const now = new Date();
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  );
}

function XPTracker() {
  const [xp, setXp] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [checkInFlash, setCheckInFlash] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedXp = localStorage.getItem("bb_xp");
    const savedCheckIn = localStorage.getItem("bb_last_checkin");
    const savedStreak = localStorage.getItem("bb_streak");
    if (savedXp) setXp(parseInt(savedXp, 10));
    if (savedCheckIn) setLastCheckIn(savedCheckIn);
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    setMounted(true);
  }, []);

  const handleCheckIn = useCallback(() => {
    if (!canCheckInToday(lastCheckIn)) return;
    const newXp = xp + 25;
    const now = new Date().toISOString();

    // Calculate streak
    let newStreak = 1;
    if (lastCheckIn) {
      const last = new Date(lastCheckIn);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        last.getFullYear() === yesterday.getFullYear() &&
        last.getMonth() === yesterday.getMonth() &&
        last.getDate() === yesterday.getDate()
      ) {
        newStreak = streak + 1;
      }
    }

    setXp(newXp);
    setLastCheckIn(now);
    setStreak(newStreak);
    setCheckInFlash(true);
    localStorage.setItem("bb_xp", String(newXp));
    localStorage.setItem("bb_last_checkin", now);
    localStorage.setItem("bb_streak", String(newStreak));
    setTimeout(() => setCheckInFlash(false), 1500);
  }, [xp, lastCheckIn, streak]);

  if (!mounted) return null;

  const { current, next, progress, xpIntoLevel, xpForNextLevel } = getLevelInfo(xp);
  const canCheckIn = canCheckInToday(lastCheckIn);
  const progressPercent = Math.round(progress * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mt-6"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12, 12, 30, 0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(249, 115, 22, 0.15)",
          boxShadow: "0 0 40px rgba(249, 115, 22, 0.05), 0 0 80px rgba(249, 115, 22, 0.02)",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-[250px] h-[250px] bg-orange-500/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-5">
          {/* Single row: Title + XP info + progress + check-in */}
          <div className="flex items-center gap-4 sm:gap-6 mb-3">
            {/* Left: Level title inline */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <h3
                className="font-display text-lg tracking-tight whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #fdba74 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {current.title}
              </h3>
              <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Lv. {current.level}</span>
              {streak > 1 && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  {streak}d
                </span>
              )}
            </div>

            {/* Center: XP count */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-sm font-semibold text-orange-400">{xp.toLocaleString()}</span>
              <span className="text-xs text-zinc-600">XP</span>
              {next && (
                <span className="text-[11px] text-zinc-600 hidden sm:inline">&middot; {(next.xpRequired - xp).toLocaleString()} to Lv.{next.level}</span>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right: Check-in button (compact) */}
            <div className="relative flex-shrink-0">
              <AnimatePresence>
                {checkInFlash && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -28, scale: 1 }}
                    exit={{ opacity: 0, y: -44 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                  >
                    <span
                      className="text-sm font-bold whitespace-nowrap"
                      style={{
                        color: "#f97316",
                        textShadow: "0 0 10px rgba(249,115,22,0.6), 0 0 20px rgba(249,115,22,0.3)",
                      }}
                    >
                      +25 XP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleCheckIn}
                disabled={!canCheckIn}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                style={
                  canCheckIn
                    ? {
                        background: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.1) 100%)",
                        border: "1px solid rgba(249,115,22,0.35)",
                        boxShadow: "0 0 20px rgba(249,115,22,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                        color: "#fdba74",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "#52525b",
                      }
                }
              >
                {canCheckIn && (
                  <div className="absolute inset-0 rounded-xl shimmer opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
                )}
                <CalendarCheck className="w-3.5 h-3.5" />
                {canCheckIn ? "Check in" : "Done"}
                {canCheckIn && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(249,115,22,0.2)",
                      color: "#fb923c",
                    }}
                  >
                    +25
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* XP Progress bar */}
          {next && (
            <div>
              {/* Bar track */}
              <div
                className="relative h-2 rounded-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {/* Animated fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  style={{
                    background: "linear-gradient(90deg, #c2410c 0%, #ea580c 30%, #f97316 60%, #fb923c 100%)",
                    boxShadow: "0 0 12px rgba(249,115,22,0.5), 0 0 24px rgba(249,115,22,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      animation: "shimmer-sweep 2.5s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(253,186,116,0.5))",
                      boxShadow: "0 0 8px rgba(249,115,22,0.6)",
                    }}
                  />
                </motion.div>

                {[25, 50, 75].map((tick) => (
                  <div
                    key={tick}
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: `${tick}%`, background: "rgba(255,255,255,0.05)" }}
                  />
                ))}
              </div>

              {/* Bottom labels */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-zinc-600">
                  {xpIntoLevel} / {xpForNextLevel} XP
                </span>
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{
                    color: "#fb923c",
                    textShadow: "0 0 6px rgba(249,115,22,0.3)",
                  }}
                >
                  {progressPercent}%
                </span>
              </div>
            </div>
          )}

          {/* Max level state */}
          {!next && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}>
              <Crown className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-300 font-medium">Max level — Onchain God</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function generateReferralCode(addr: string | undefined): string {
  if (!addr) return "";
  const hash = addr.slice(2, 10).toUpperCase();
  return `BB-${hash}`;
}

function ReferralCard() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !address) return null;

  const code = generateReferralCode(address);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Background image with light overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/referral-bg.avif"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#060611]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060611]/80 via-transparent to-[#060611]/40" />
      </div>
      <div className="absolute inset-0 rounded-2xl shimmer opacity-15 pointer-events-none" />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 text-orange-400" />
          <h4 className="text-sm font-semibold text-white">Refer a friend</h4>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
          Share your code and earn bonus XP when friends join.
        </p>

        {/* Code + Copy */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-sm font-mono font-semibold text-orange-300 flex-1 truncate">
            {code}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
            style={
              copied
                ? {
                    color: "#4ade80",
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.2)",
                  }
                : {
                    color: "#fdba74",
                    background: "rgba(249,115,22,0.1)",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }
            }
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RightSidebar() {
  const { user } = usePrivy();
  const { address } = useAccount();
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedXp = localStorage.getItem("bb_xp");
    const savedStreak = localStorage.getItem("bb_streak");
    if (savedXp) setXp(parseInt(savedXp, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    setMounted(true);
  }, []);

  const displayName =
    user?.google?.name ||
    user?.twitter?.username ||
    user?.email?.address?.split("@")[0] ||
    (address ? truncateAddress(address) : "Anonymous");

  if (!mounted) return null;

  const { current, next, progress } = getLevelInfo(xp);
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="hidden xl:block w-[300px] flex-shrink-0 mt-4">
      <div className="space-y-5">
        {/* ─── Profile + XP ─── */}
        <div className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              {address && (
                <p className="text-[10px] text-zinc-600 font-mono">{truncateAddress(address)}</p>
              )}
            </div>
            {streak > 1 && (
              <span
                className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  color: "#f59e0b",
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                {streak}d streak
              </span>
            )}
          </div>

          {/* XP bar */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fdba74 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {current.title}
            </span>
            <span className="text-[10px] text-zinc-600">Lv. {current.level}</span>
            <span className="ml-auto text-[11px] text-orange-400 font-semibold tabular-nums">
              {xp.toLocaleString()} XP
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.03)" }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              style={{
                background: "linear-gradient(90deg, #c2410c, #ea580c, #f97316, #fb923c)",
                boxShadow: "0 0 8px rgba(249,115,22,0.4)",
              }}
            />
          </div>
          {next && (
            <p className="text-[10px] text-zinc-600 mt-1.5">
              {(next.xpRequired - xp).toLocaleString()} XP to {next.title}
            </p>
          )}
        </div>

        {/* ─── New Cards Weekly Promo ─── */}
        <Link
          href="/achievements"
          className="relative rounded-2xl overflow-hidden block group hover:-translate-y-0.5 transition-transform duration-300"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Cloud background — same as hero */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "rgba(12, 12, 30, 0.5)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          />
          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-accent-orange/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent-amber/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 rounded-2xl shimmer opacity-25 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4 p-3">
            {/* Card fills the section height */}
            <div className="flex-shrink-0 card-3d">
              <Image
                src="/cards/8.png"
                alt="Sandwich'd"
                width={120}
                height={168}
                className="w-[100px] h-auto rounded-lg"
                style={{
                  filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.5))",
                }}
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 py-1">
              <h3 className="font-display text-base text-white tracking-tight mb-1">
                New cards weekly
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
                Fresh badges every week.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 group-hover:text-orange-300 transition-colors font-medium">
                Browse
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>

        {/* ─── Referral Code ─── */}
        <ReferralCard />

        {/* ─── Activity Feed ─── */}
        <div className="pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-accent-orange" />
            <h4 className="text-sm font-semibold text-white">Recent Activity</h4>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-10 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.badge}
                    width={40}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.badge}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-zinc-500 truncate">{item.username}</span>
                    <span className="text-zinc-700 text-[8px]">&middot;</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{item.wallet}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <TierLabel tier={item.tier} />
                  <span className="text-[9px] text-zinc-700">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/activity"
            className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/[0.04] text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all activity
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedBadgeDisplay() {
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="relative">
        {/* Ambient glow behind badge */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(249, 115, 22, 0.12)" }}
        />
        <div
          className="relative w-[220px] sm:w-[280px] lg:w-[380px] cursor-pointer"
          style={{
            filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 30px rgba(249,115,22,0.15))",
            animation: "badge-float 3s ease-in-out infinite",
          }}
        >
          <Image
            src="/badges/17.png"
            alt="Sandwich'd"
            width={380}
            height={380}
            className="w-full h-auto object-contain"
            priority
          />
          {/* Shine streak clipped to badge silhouette */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              WebkitMaskImage: "url(/badges/17.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url(/badges/17.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          >
            {/* Thin moving streak */}
            <div
              className="absolute top-[-20%] bottom-[-20%] badge-shine-streak"
              style={{
                width: "25%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.12) 80%, transparent)",
                transform: "skewX(-15deg)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isConnected } = useAccount();

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {/* ─── Hero Glass Banner ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "rgba(12, 12, 30, 0.5)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Inner glow effects */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-orange/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-amber/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl shimmer opacity-30 pointer-events-none" />

              {/* Side-by-side: text left, carousel right */}
              <div className="relative flex flex-col lg:flex-row items-center">
                {/* Left — Logo + text + CTA */}
                <div className="relative z-10 flex-shrink-0 w-full lg:w-[45%] px-8 sm:px-10 py-8 sm:py-10">
                  <Image
                    src="/logos/block_badges_light.png"
                    alt="Block Badges"
                    width={600}
                    height={240}
                    className="h-[130px] w-auto object-contain brightness-[2] contrast-[1.2] mb-2 -mt-2"
                  />
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.1] mb-3">
                    Your <span className="gradient-text">Onchain Legacy</span>
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-md mb-5">
                    Prove your crypto history with ZK-verified collectible badges.
                    Every badge is backed by Proof of SQL — stack your deck,
                    climb the ranks, and flex your achievements.
                  </p>
                  <Link
                    href="/achievements"
                    className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all"
                  >
                    Browse All Badges
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Right — Card carousel, fades into text side */}
                <div className="relative flex-1 overflow-hidden py-6 lg:py-0">
                  {/* Left fade (towards text) */}
                  <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(12,12,30,1)] to-transparent z-10 pointer-events-none" />
                  {/* Right fade */}
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(12,12,30,0.9)] to-transparent z-10 pointer-events-none" />

                  <div className="flex gap-4 animate-hero-cards">
                    {[...heroCarouselCards, ...heroCarouselCards].map((card, i) => (
                      <motion.div
                        key={`hero-card-${i}`}
                        className="flex-shrink-0 card-3d"
                        whileHover={{ scale: 1.05, y: -6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Image
                          src={card.src}
                          alt={card.alt}
                          width={200}
                          height={280}
                          className="w-[170px] sm:w-[190px] h-auto object-cover rounded-xl"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── XP Tracker (signed-in only, hidden on xl where sidebar shows it) ─── */}
          {isConnected && <div className="xl:hidden"><XPTracker /></div>}

          {/* ─── Trending Achievements ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent-orange" />
                </div>
                <h3 className="font-display text-xl text-white">Trending Achievements</h3>
              </div>
              <Link
                href="/achievements"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Auto-scrolling carousel */}
            <div className="relative overflow-hidden">
              {/* Edge fades */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

              <div className="flex gap-4 animate-trending">
                {/* Duplicate the 6 cards for seamless loop */}
                {[...trendingCards, ...trendingCards].map((card, i) => (
                  <Link
                    key={`trending-${i}`}
                    href={`/achievements/card/${card.id}`}
                    className="flex-shrink-0"
                  >
                    <div
                      className="flex items-center gap-4 w-[280px] sm:w-[340px] p-3 rounded-2xl cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Card thumbnail */}
                      <div className="relative w-[72px] flex-shrink-0">
                        <div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"
                          style={{
                            background: `radial-gradient(ellipse at center, ${card.color}30 0%, transparent 70%)`,
                            filter: "blur(8px)",
                          }}
                        />
                        <div className="card-3d relative">
                          <Image
                            src={card.image}
                            alt={card.name}
                            width={72}
                            height={100}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {card.name}
                          </h4>
                          {card.hot && (
                            <Flame className="w-3.5 h-3.5 text-accent-orange flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[11px] text-zinc-400 font-medium truncate">
                            {card.username}
                          </span>
                          <span className="text-zinc-600 text-[10px]">·</span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            {card.wallet}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <TierLabel tier={card.tier} />
                          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                            <Clock className="w-3 h-3" />
                            {card.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── What's New ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl text-white">What&apos;s New</h3>
            </div>

            {/* Two side-by-side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NFTs Card */}
              <Link href="/achievements" className="block">
                <div
                  className="relative rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/cards/nft_screens.png"
                      alt=""
                      fill
                      className="object-cover object-center"
                    />
                    {/* Light overlay */}
                    <div className="absolute inset-0 bg-[#060611]/25" />
                    {/* Bottom fade into text area */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-[#060611] via-[#060611]/80 to-transparent" />
                    {/* Soft edge vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#060611_100%)]" />
                  </div>

                  <div className="absolute inset-0 rounded-3xl shimmer opacity-20 pointer-events-none" />

                  <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-end min-h-[240px] sm:min-h-[280px] md:min-h-[320px]">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 w-fit"
                      style={{
                        color: "#ffffff",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      New Collection
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-2">
                      <span className="gradient-text">NFTs</span>
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-4">
                      Collect and prove your NFT history with ZK-verified achievement badges.
                    </p>
                    <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5 w-fit">
                      Explore NFT badges
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Base Card */}
              <Link href="/achievements" className="block">
                <div
                  className="relative rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/cards/base_builder.png"
                      alt=""
                      fill
                      className="object-cover object-center"
                    />
                    {/* Light overlay */}
                    <div className="absolute inset-0 bg-[#060611]/25" />
                    {/* Bottom fade into text area */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-[#060611] via-[#060611]/80 to-transparent" />
                    {/* Soft edge vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#060611_100%)]" />
                  </div>

                  <div className="absolute inset-0 rounded-3xl shimmer opacity-20 pointer-events-none" />

                  <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-end min-h-[240px] sm:min-h-[280px] md:min-h-[320px]">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 w-fit"
                      style={{
                        color: "#ffffff",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      Featured Chain
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-2">
                      <span style={{ color: "#3b82f6" }}>Base</span>
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-4">
                      Earn Base chain badges and verify your on-chain achievements on Coinbase&apos;s L2.
                    </p>
                    <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5 w-fit">
                      Explore Base badges
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* ─── Popular Badges ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-display text-xl text-white">Popular Badges</h3>
              </div>
              <Link
                href="/achievements"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Badge row — card backdrop + badge overlay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularBadges.map((badge) => (
                <Link
                  key={badge.id}
                  href={`/achievements/card/${badge.id}`}
                  className="group"
                >
                  {/* Card with badge overlay */}
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer group-hover:-translate-y-1 transition-transform duration-300"
                    style={{
                      background: "#060611",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Full card visible behind */}
                    <div className="relative">
                      <Image
                        src={badge.image}
                        alt=""
                        width={200}
                        height={280}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="absolute inset-0 bg-[#060611]/70 rounded-lg" />
                    </div>

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center, ${badge.color}15 0%, transparent 70%)`,
                      }}
                    />

                    {/* Badge icon floating on top */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 p-3">
                      <div
                        className="relative w-[95%] overflow-hidden"
                        style={{
                          filter: `drop-shadow(0 8px 24px rgba(0,0,0,0.5)) drop-shadow(0 0 20px ${badge.color}20)`,
                          animation: "badge-float 3s ease-in-out infinite",
                        }}
                      >
                        <Image
                          src={badge.badge}
                          alt={badge.name}
                          width={200}
                          height={200}
                          className="w-full h-auto object-contain"
                        />
                        {/* Shine streak */}
                        <div
                          className="absolute inset-0 pointer-events-none overflow-hidden"
                          style={{
                            WebkitMaskImage: `url(${badge.badge})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskImage: `url(${badge.badge})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                          }}
                        >
                          <div
                            className="absolute top-[-20%] bottom-[-20%] badge-shine-streak"
                            style={{
                              width: "25%",
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.12) 80%, transparent)",
                              transform: "skewX(-15deg)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info outside */}
                  <div className="pt-3 px-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {badge.name}
                      </h4>
                      <TierLabel tier={badge.tier} />
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-1.5">
                      {badge.description}
                    </p>
                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                      {badge.chain}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ─── Featured Badge ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-14"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="font-display text-xl text-white">Featured Badge</h3>
            </div>

            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "#060611",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="relative flex flex-col lg:flex-row items-stretch">
                {/* Left — Card backdrop + Badge overlay */}
                <div className="relative flex-shrink-0 lg:w-[45%] p-5 sm:p-8 lg:p-10 overflow-hidden">
                  {/* Card image as faint backdrop */}
                  <div className="absolute inset-0">
                    <Image
                      src="/cards/8.png"
                      alt=""
                      fill
                      className="object-cover object-center scale-100"
                    />
                    <div className="absolute inset-0 bg-[#060611]/65" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060611]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060611]/40 via-transparent to-[#060611]/40" />
                  </div>
                  {/* Glow */}
                  <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-orange-500/[0.06] rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute inset-0 shimmer opacity-10 pointer-events-none" />

                  {/* Badge on top */}
                  <div className="relative z-10">
                    <FeaturedBadgeDisplay />
                  </div>
                </div>

                {/* Right — Info panel on dark bg */}
                <div className="flex-1 max-w-xl flex flex-col justify-between p-5 sm:p-8 lg:p-10">
                  <div>
                    {/* Tier + Chain pills */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          color: "#f59e0b",
                          background: "rgba(245,158,11,0.15)",
                          border: "1px solid rgba(245,158,11,0.4)",
                          boxShadow: "0 0 12px rgba(245,158,11,0.1)",
                        }}
                      >
                        Tier 3
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          color: "#60a5fa",
                          background: "rgba(96,165,250,0.15)",
                          border: "1px solid rgba(96,165,250,0.3)",
                          boxShadow: "0 0 12px rgba(96,165,250,0.1)",
                        }}
                      >
                        Ethereum
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                      Sandwich&apos;d
                    </h2>

                    {/* Lore */}
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed italic mb-5">
                      You got caught in the bread. A MEV bot sandwiched your trade
                      and you lived to tell the tale. Wear it with pride.
                    </p>

                    {/* Requirement glass card */}
                    <div
                      className="rounded-xl p-5 mb-5"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                        border: "1px solid rgba(249,115,22,0.2)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px rgba(249,115,22,0.04)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#f97316" }}>
                          Requirement
                        </span>
                        <Shield className="w-3.5 h-3.5" style={{ color: "#f97316", opacity: 0.8 }} />
                      </div>
                      <p
                        className="font-display text-sm sm:text-base leading-snug tracking-tight"
                        style={{
                          background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Get sandwich attacked by a MEV bot on Ethereum mainnet.
                      </p>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-white font-semibold text-xs">2,341</span>
                        <span className="text-zinc-500 text-[10px]">holders</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white font-semibold text-xs">500</span>
                        <span className="text-zinc-500 text-[10px]">pts</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass">
                        <Shield className="w-3.5 h-3.5 text-accent-orange" />
                        <span className="text-zinc-300 text-xs">Proof of SQL</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy SXT button — anchored to bottom */}
                  <a
                    href="https://app.uniswap.org/swap?outputCurrency=0xE6Bf895C4e9a6E53F16d3863eCF50217a8f195&chain=base"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-2.5 w-full px-8 py-3 text-sm font-bold rounded-xl text-white overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
                      boxShadow: "0 0 24px rgba(139, 92, 246, 0.35), 0 0 48px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)",
                        boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)",
                      }}
                    />
                    <div className="absolute inset-0 rounded-xl shimmer opacity-30 pointer-events-none" />
                    <span className="relative flex items-center gap-2.5">
                      <Image
                        src="/logos/sxt.svg"
                        alt="SXT"
                        width={20}
                        height={20}
                        className="w-4 h-4 object-contain brightness-[3]"
                      />
                      Buy $SXT
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Badges Showcase Carousel ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-14"
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent-orange" />
                  </div>
                  <h3 className="font-display text-xl text-white">Badges</h3>
                </div>
                <p className="text-zinc-500 text-sm ml-11">
                  Your wallet tells a story — earn the proof to back it up.
                </p>
              </div>
              <Link
                href="/achievements"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Auto-scrolling 4-card carousel */}
            <div className="relative overflow-hidden">
              {/* Edge fades */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

              <div className="flex gap-5 animate-showcase">
                {[
                  { id: "whale-activity", name: "Whale Activity", image: "/cards/whale_activity.png", tier: "T5" },
                  { id: "etherean", name: "The Etherean", image: "/cards/etherean (2).png", tier: "T2" },
                  { id: "gas-guzzler", name: "Gas Guzzler", image: "/cards/gas_guzzler.png", tier: "T2" },
                  { id: "diamond-hands", name: "Diamond Hands", image: "/cards/diamond_hands.png", tier: "T4" },
                  { id: "nft-upper-class", name: "NFT Upper Class", image: "/cards/nft_20k.png", tier: "T5" },
                  { id: "memecoiner", name: "The Memecoiner", image: "/cards/memecoin.png", tier: "T3" },
                  { id: "opensea", name: "Opensea VIP", image: "/cards/opensea (2).png", tier: "T3" },
                  { id: "art-blocks", name: "Fine Art Collector", image: "/cards/art_blocks.png", tier: "T3" },
                  { id: "base-bull", name: "Base Bull", image: "/cards/base_bull.png", tier: "T2" },
                  { id: "multichain", name: "Multichain Maximalist", image: "/cards/multi-chain.png", tier: "T3" },
                  { id: "validator", name: "The Validator", image: "/cards/eth_steak.png", tier: "T2" },
                  { id: "rug-victim", name: "Rug Victim", image: "/cards/emn_rug.png", tier: "T2" },
                  { id: "whale-activity", key: "whale-activity-2", name: "Whale Activity", image: "/cards/whale_activity.png", tier: "T5" },
                  { id: "etherean", key: "etherean-2", name: "The Etherean", image: "/cards/etherean (2).png", tier: "T2" },
                  { id: "gas-guzzler", key: "gas-guzzler-2", name: "Gas Guzzler", image: "/cards/gas_guzzler.png", tier: "T2" },
                  { id: "diamond-hands", key: "diamond-hands-2", name: "Diamond Hands", image: "/cards/diamond_hands.png", tier: "T4" },
                  { id: "nft-upper-class", key: "nft-upper-class-2", name: "NFT Upper Class", image: "/cards/nft_20k.png", tier: "T5" },
                  { id: "memecoiner", key: "memecoiner-2", name: "The Memecoiner", image: "/cards/memecoin.png", tier: "T3" },
                  { id: "opensea", key: "opensea-2", name: "Opensea VIP", image: "/cards/opensea (2).png", tier: "T3" },
                  { id: "art-blocks", key: "art-blocks-2", name: "Fine Art Collector", image: "/cards/art_blocks.png", tier: "T3" },
                  { id: "base-bull", key: "base-bull-2", name: "Base Bull", image: "/cards/base_bull.png", tier: "T2" },
                  { id: "multichain", key: "multichain-2", name: "Multichain Maximalist", image: "/cards/multi-chain.png", tier: "T3" },
                  { id: "validator", key: "validator-2", name: "The Validator", image: "/cards/eth_steak.png", tier: "T2" },
                  { id: "rug-victim", key: "rug-victim-2", name: "Rug Victim", image: "/cards/emn_rug.png", tier: "T2" },
                ].map((badge) => (
                  <Link
                    key={(badge as any).key || badge.id}
                    href={`/achievements/card/${badge.id}`}
                    className="flex-shrink-0 group"
                  >
                    <div
                      className="relative rounded-2xl p-2.5 w-[200px] sm:w-[240px] md:w-[260px] cursor-pointer group-hover:-translate-y-2 transition-transform duration-300"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="card-3d relative">
                        <Image
                          src={badge.image}
                          alt={badge.name}
                          width={240}
                          height={336}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="pt-3 px-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{badge.name}</h4>
                        <TierLabel tier={badge.tier} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        {isConnected && <RightSidebar />}
      </div>
    </DashboardLayout>
  );
}
