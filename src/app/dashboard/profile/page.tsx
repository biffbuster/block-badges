"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import PrivyLoginButton from "@/components/ui/PrivyLoginButton";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Crown,
  Shield,
  Copy,
  ExternalLink,
  Check,
  Trophy,
} from "lucide-react";

/* ─── All badges (same as achievements page) ─── */
const allBadges = [
  { id: "etherean", name: "The Etherean", badge: "/badges/etheran.png", image: "/cards/etherean (2).png", tier: "Intermediate", points: 300, glowColor: "#60a5fa", chain: "Ethereum" },
  { id: "gas-guzzler", name: "Gas Guzzler", badge: "/badges/gas_guzzler.png", image: "/cards/gas_guzzler.png", tier: "Intermediate", points: 300, glowColor: "#f97316", chain: "Ethereum" },
  { id: "nft-flipper", name: "NFT Flipper", badge: "/badges/nft_flipper.png", image: "/cards/nft_flipper (2).png", tier: "Intermediate", points: 300, glowColor: "#8b5cf6", chain: "Ethereum" },
  { id: "multichain", name: "Multichain Maximalist", badge: "/badges/multichain_madness.png", image: "/cards/multi-chain.png", tier: "Hard", points: 500, glowColor: "#60a5fa", chain: "Multi" },
  { id: "opensea", name: "Opensea VIP", badge: "/badges/opensea_badge.png", image: "/cards/opensea (2).png", tier: "Hard", points: 500, glowColor: "#22d3ee", chain: "Ethereum" },
  { id: "art-blocks", name: "Fine Art Collector", badge: "/badges/art_collector.png", image: "/cards/art_blocks.png", tier: "Hard", points: 500, glowColor: "#4ade80", chain: "Ethereum" },
  { id: "liquidated", name: "Liquidated", badge: "/badges/liquidated.png", image: "/cards/card_01.png", tier: "Intermediate", points: 300, glowColor: "#ef4444", chain: "Ethereum" },
  { id: "rookie-predictor", name: "Rookie Predictor", badge: "/badges/rookie_predictor.png", image: "/cards/card_02.png", tier: "Beginner", points: 100, glowColor: "#4ade80", chain: "Ethereum" },
  { id: "happy-lending", name: "Happy Lending", badge: "/badges/happy_lending.png", image: "/cards/card_03.png", tier: "Intermediate", points: 300, glowColor: "#c084fc", chain: "Ethereum" },
  { id: "rug-victim", name: "Rug Victim", badge: "/badges/rug_victi.png", image: "/cards/emn_rug.png", tier: "Intermediate", points: 300, glowColor: "#3b82f6", chain: "Ethereum" },
  { id: "validator", name: "The Validator", badge: "/badges/validator.png", image: "/cards/eth_steak.png", tier: "Intermediate", points: 300, glowColor: "#60a5fa", chain: "Ethereum" },
  { id: "memecoiner", name: "The Memecoiner", badge: "/badges/memecoiner.png", image: "/cards/memecoin.png", tier: "Hard", points: 500, glowColor: "#e879f9", chain: "Ethereum" },
  { id: "nft-upper-class", name: "NFT Upper Class", badge: "/badges/nft_upper_class.png", image: "/cards/nft_20k.png", tier: "Legendary", points: 1000, glowColor: "#f59e0b", chain: "Ethereum" },
  { id: "base-bull", name: "Base Bull", badge: "/badges/base_bull.png", image: "/cards/base_bull.png", tier: "Intermediate", points: 300, glowColor: "#0052FF", chain: "Base" },
  { id: "avax-bull", name: "AVAX Bull", badge: "/badges/avax_bull.png", image: "/cards/avax_bull.jpg", tier: "Intermediate", points: 300, glowColor: "#E84142", chain: "Avalanche" },
  { id: "diamond-hands", name: "Diamond Hands", badge: "/badges/diamond_hands.png", image: "/cards/diamond_hands.png", tier: "Veteran", points: 800, glowColor: "#e2e8f0", chain: "Bitcoin" },
  { id: "whale-activity", name: "Whale Activity", badge: "/badges/whale_activity.png", image: "/cards/whale_activity.png", tier: "Legendary", points: 1000, glowColor: "#38bdf8", chain: "Ethereum" },
  { id: "ethereum-villager", name: "Ethereum Villager", badge: "/badges/vallager.png", image: "/cards/2.png", tier: "Beginner", points: 100, glowColor: "#60a5fa", chain: "Ethereum" },
  { id: "the-contributor", name: "The Contributor", badge: "/badges/contributor.png", image: "/cards/3.png", tier: "Beginner", points: 100, glowColor: "#f59e0b", chain: "Ethereum" },
  { id: "sandwichd", name: "Sandwich'd", badge: "/badges/sandwichd.png", image: "/cards/8.png", tier: "Beginner", points: 100, glowColor: "#84cc16", chain: "Ethereum" },
  { id: "data-wrangler", name: "Data Wrangler", badge: "/badges/data_wrangler.png", image: "/cards/9.png", tier: "Beginner", points: 100, glowColor: "#a78bfa", chain: "Base" },
  { id: "bullseye", name: "Bullseye", badge: "/badges/bullseye.png", image: "/cards/10.png", tier: "Legendary", points: 1000, glowColor: "#3b82f6", chain: "Ethereum" },
  { id: "base-builder", name: "Base Builder", badge: "/badges/base_builder.png", image: "/cards/base_builder_card.png", tier: "Intermediate", points: 300, glowColor: "#0052FF", chain: "Base" },
  { id: "squiggler", name: "Squiggler", badge: "/badges/squiggler.png", image: "/cards/11.png", tier: "Veteran", points: 800, glowColor: "#ec4899", chain: "Ethereum" },
];

/* ─── Tier config ─── */
const tierConfig: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  Beginner: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.3)", glow: "rgba(74,222,128,0.15)" },
  Intermediate: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)", glow: "rgba(96,165,250,0.15)" },
  Hard: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", glow: "rgba(245,158,11,0.15)" },
  Veteran: { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)", glow: "rgba(192,132,252,0.15)" },
  Legendary: { color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.4)", glow: "rgba(249,115,22,0.25)" },
};

/* ─── Badge Card (earned) ─── */
function EarnedBadgeCard({ badge }: { badge: (typeof allBadges)[0] }) {
  const t = tierConfig[badge.tier] ?? tierConfig.Beginner;

  return (
    <Link href={`/achievements/card/${badge.id}`}>
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow behind on hover */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${badge.glowColor}20 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Card container */}
        <div
          className="relative rounded-2xl overflow-hidden px-4 pt-4 pb-4 flex flex-col items-center text-center"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${badge.glowColor}05`,
          }}
        >
          {/* Card art background — barely visible */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src={badge.image}
              alt=""
              width={400}
              height={560}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "blur(12px) brightness(0.28) saturate(0.7)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, transparent 20%, #060611 75%)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 30%, #060611 85%)" }}
            />
          </div>

          {/* Badge image */}
          <div
            className="relative w-[82%] mb-2 z-10"
            style={{
              filter: `drop-shadow(0 16px 32px rgba(0,0,0,0.7)) drop-shadow(0 6px 16px ${badge.glowColor}30)`,
            }}
          >
            <Image
              src={badge.badge}
              alt={badge.name}
              width={300}
              height={300}
              className="w-full h-auto object-contain"
            />
            {/* Shimmer */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div className="shimmer absolute inset-0 opacity-40" />
            </div>
          </div>

          {/* Ground shadow */}
          <div
            className="w-[55%] h-3 rounded-full mb-3 z-10"
            style={{
              background: `radial-gradient(ellipse at center, ${badge.glowColor}35 0%, transparent 70%)`,
              filter: "blur(6px)",
            }}
          />

          {/* Name */}
          <h3 className="font-display text-sm text-white tracking-tight mb-1 uppercase z-10 leading-tight">
            {badge.name}
          </h3>

          {/* Tier + Points */}
          <div className="flex items-center gap-2 z-10 mt-1">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                color: t.color,
                background: t.bg,
                border: `1px solid ${t.border}`,
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: t.color }}
              />
              {badge.tier}
            </span>
            <span className="text-[10px] text-amber-400 font-bold">{badge.points} pts</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Main Profile Page ─── */
export default function ProfilePage() {
  const { address } = useAccount();
  const { authenticated, user } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const displayName =
    user?.google?.name ||
    user?.twitter?.username ||
    user?.email?.address?.split("@")[0] ||
    (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Anonymous");

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // Fetch earned badges from API
  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`/api/badges/${address}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.badges && Array.isArray(data.badges)) {
          setEarnedIds(new Set(data.badges.map((b: { badgeId: string }) => b.badgeId)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [address]);

  const earnedBadges = allBadges.filter((b) => earnedIds.has(b.id));
  const totalPoints = earnedBadges.reduce((sum, b) => sum + b.points, 0);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      {/* Not signed in */}
      {!authenticated && (
        <div className="flex flex-col items-center gap-6 py-32">
          <Shield className="w-12 h-12 text-accent-orange/40" />
          <p className="text-zinc-500 text-lg">
            Sign in to view your profile
          </p>
          <PrivyLoginButton />
        </div>
      )}

      {/* Signed in */}
      {authenticated && (
        <>
          {/* ─── Hero Banner ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl mb-8 border border-white/[0.06]"
          >
            {/* Cloud background */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/hero-bg.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-bg-primary/70" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060611_100%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 sm:px-10 pt-10 pb-8">
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400/70" />
                </div>
              </div>

              {/* Name + wallet */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-2">
                {displayName}
              </h1>
              {address && (
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-sm text-zinc-500 font-mono">{displayAddress}</span>
                  <button
                    onClick={copyAddress}
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Stat pills */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                  <Trophy className="w-3.5 h-3.5 text-accent-orange" />
                  <span className="text-white font-semibold">{earnedBadges.length}</span>
                  <span className="text-zinc-500">badges earned</span>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                  <span className="text-amber-400 font-semibold">{totalPoints.toLocaleString()}</span>
                  <span className="text-zinc-500">points</span>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                  <span className="text-emerald-400/80 text-xs">&#10003;</span>
                  <span className="text-zinc-300">ZK Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Earned Badges Grid ─── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
            </div>
          ) : earnedBadges.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            >
              {earnedBadges.map((badge) => (
                <EarnedBadgeCard key={badge.id} badge={badge} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5 py-20"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.15)",
                }}
              >
                <Trophy className="w-8 h-8 text-orange-400/50" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl text-white mb-2">No badges earned yet</h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                  Head to the achievements page and verify your onchain activity to start earning badges.
                </p>
              </div>
              <Link
                href="/achievements"
                className="px-6 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all"
              >
                Browse Achievements
              </Link>
            </motion.div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
