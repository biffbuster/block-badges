"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Flame, Crown, Clock, Users, Star, Shield, Sparkles, ExternalLink } from "lucide-react";
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
  { id: "etherean", name: "The Etherean", image: "/cards/etherean (2).png", tier: "T2", color: "#60a5fa", description: "Hold at least one ETH.", chain: "Ethereum" },
  { id: "multichain", name: "Multichain Maximalist", image: "/cards/multi-chain.png", tier: "T3", color: "#60a5fa", description: "Used 5 different blockchains.", chain: "Multi" },
  { id: "opensea", name: "Opensea VIP", image: "/cards/opensea (2).png", tier: "T3", color: "#22d3ee", description: "Bought an NFT before 2021.", chain: "Ethereum" },
  { id: "art-blocks", name: "Fine Art Collector", image: "/cards/art_blocks.png", tier: "T3", color: "#4ade80", description: "Hold 3 or more Art Blocks items.", chain: "Ethereum" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
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
                      className="flex items-center gap-4 w-[340px] p-3 rounded-2xl cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
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

                  <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end min-h-[320px]">
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

                  <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end min-h-[320px]">
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

            {/* Badge row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {popularBadges.map((badge) => (
                <Link
                  key={badge.id}
                  href={`/achievements/card/${badge.id}`}
                  className="group"
                >
                  {/* Glass card — image only */}
                  <div
                    className="relative rounded-2xl p-2.5 cursor-pointer group-hover:-translate-y-1 transition-transform duration-300"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center, ${badge.color}10 0%, transparent 70%)`,
                      }}
                    />
                    <div className="card-3d relative">
                      <Image
                        src={badge.image}
                        alt={badge.name}
                        width={200}
                        height={280}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Info outside component */}
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
                background: "rgba(12, 12, 30, 0.5)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Glow effects */}
              <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#38bdf8]/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-orange/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl shimmer opacity-20 pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-32 p-10 sm:p-14">
                {/* Left — Huge card image with hover tilt */}
                <div className="flex-shrink-0 flex justify-center">
                  <div className="relative group/card">
                    {/* Ambient glow behind card */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover/card:scale-110"
                      style={{ background: "rgba(56, 189, 248, 0.10)" }}
                    />
                    <div
                      className="card-3d w-[380px] sm:w-[460px] relative cursor-pointer transition-all duration-300 group-hover/card:scale-[1.03]"
                      style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.3s ease, box-shadow 0.4s ease",
                        boxShadow: `
                          0 2px 0 0 rgba(255,255,255,0.08),
                          0 -2px 0 0 rgba(0,0,0,0.4),
                          0 20px 60px rgba(0,0,0,0.6),
                          0 40px 100px rgba(0,0,0,0.4),
                          0 0 80px rgba(56,189,248,0.15)
                        `,
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        e.currentTarget.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -10}deg) rotateY(${(x - 0.5) * 10}deg) scale(1.03)`;
                        e.currentTarget.style.boxShadow = `
                          0 2px 0 0 rgba(255,255,255,0.1),
                          0 -2px 0 0 rgba(0,0,0,0.4),
                          0 25px 70px rgba(0,0,0,0.7),
                          0 50px 120px rgba(0,0,0,0.5),
                          0 0 100px rgba(56,189,248,0.25),
                          0 0 160px rgba(56,189,248,0.1),
                          inset 0 1px 0 rgba(255,255,255,0.15)
                        `;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
                        e.currentTarget.style.boxShadow = `
                          0 2px 0 0 rgba(255,255,255,0.08),
                          0 -2px 0 0 rgba(0,0,0,0.4),
                          0 20px 60px rgba(0,0,0,0.6),
                          0 40px 100px rgba(0,0,0,0.4),
                          0 0 80px rgba(56,189,248,0.15)
                        `;
                      }}
                    >
                      <Image
                        src="/cards/9.png"
                        alt="Data Wrangler"
                        width={580}
                        height={812}
                        className="w-full h-auto object-cover"
                        priority
                      />
                      {/* Glare on hover */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-[0.12] transition-opacity duration-300"
                        style={{
                          background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right — Info panel */}
                <div className="flex-1 max-w-xl flex flex-col pl-0 lg:pl-6">
                  {/* Tier + Chain pills */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                      style={{
                        color: "#4ade80",
                        background: "rgba(74,222,128,0.15)",
                        border: "1px solid rgba(74,222,128,0.4)",
                        boxShadow: "0 0 12px rgba(74,222,128,0.1)",
                      }}
                    >
                      Tier 1
                    </span>
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                      style={{
                        color: "#8b5cf6",
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        boxShadow: "0 0 12px rgba(139,92,246,0.1)",
                      }}
                    >
                      Multi-Chain
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
                    Data Wrangler
                  </h2>

                  {/* Lore */}
                  <p className="text-zinc-400 text-base leading-relaxed italic mb-6">
                    Power to the provers. Run an on-chain query verified by
                    Proof of SQL and prove your data mastery.
                  </p>

                  {/* Requirement glass card */}
                  <div
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      boxShadow: "0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 80px rgba(56,189,248,0.06)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#38bdf8" }}>
                        Requirement
                      </span>
                      <Shield className="w-4 h-4" style={{ color: "#38bdf8", opacity: 0.8 }} />
                    </div>
                    <p
                      className="font-display text-lg sm:text-xl leading-snug tracking-tight"
                      style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Spend at least 25 SXT to run an on-chain query.
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 flex-wrap mb-6">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-white font-semibold text-sm">127</span>
                      <span className="text-zinc-500 text-xs">holders</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-white font-semibold text-sm">1,000</span>
                      <span className="text-zinc-500 text-xs">pts</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                      <Shield className="w-4 h-4 text-accent-orange" />
                      <span className="text-zinc-300 text-sm">Proof of SQL</span>
                    </div>
                  </div>

                  {/* SXT info */}
                  <div
                    className="rounded-xl p-4 mb-6"
                    style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.15)" }}
                  >
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Verifying this badge costs <span className="text-white font-semibold">$SXT</span> tokens.
                      The SXT Query Router deposits ~100 SXT, consumes ~23 for the ZK proof, and refunds the rest.
                      You need SXT in your wallet on Base before you can verify.
                    </p>
                  </div>

                  {/* Buy SXT button */}
                  <a
                    href="https://app.uniswap.org/swap?outputCurrency=0xE6Bf895C4e9a6E53F16d3863eCF50217a8f195&chain=base"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 w-full px-10 py-4 text-base font-bold rounded-2xl text-white overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
                      boxShadow: "0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)",
                        boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)",
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl shimmer opacity-30 pointer-events-none" />
                    <span className="relative flex items-center gap-3">
                      <Image
                        src="/logos/sxt.svg"
                        alt="SXT"
                        width={24}
                        height={24}
                        className="w-5 h-5 object-contain brightness-[3]"
                      />
                      Buy $SXT
                      <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
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
                  { id: "eth-steak", name: "ETH Steak", image: "/cards/eth_steak.png", tier: "T2" },
                  { id: "rug-victim", name: "Rug Victim", image: "/cards/emn_rug.png", tier: "T2" },
                  { id: "whale-activity-2", name: "Whale Activity", image: "/cards/whale_activity.png", tier: "T5" },
                  { id: "etherean-2", name: "The Etherean", image: "/cards/etherean (2).png", tier: "T2" },
                  { id: "gas-guzzler-2", name: "Gas Guzzler", image: "/cards/gas_guzzler.png", tier: "T2" },
                  { id: "diamond-hands-2", name: "Diamond Hands", image: "/cards/diamond_hands.png", tier: "T4" },
                  { id: "nft-upper-class-2", name: "NFT Upper Class", image: "/cards/nft_20k.png", tier: "T5" },
                  { id: "memecoiner-2", name: "The Memecoiner", image: "/cards/memecoin.png", tier: "T3" },
                  { id: "opensea-2", name: "Opensea VIP", image: "/cards/opensea (2).png", tier: "T3" },
                  { id: "art-blocks-2", name: "Fine Art Collector", image: "/cards/art_blocks.png", tier: "T3" },
                  { id: "base-bull-2", name: "Base Bull", image: "/cards/base_bull.png", tier: "T2" },
                  { id: "multichain-2", name: "Multichain Maximalist", image: "/cards/multi-chain.png", tier: "T3" },
                  { id: "eth-steak-2", name: "ETH Steak", image: "/cards/eth_steak.png", tier: "T2" },
                  { id: "rug-victim-2", name: "Rug Victim", image: "/cards/emn_rug.png", tier: "T2" },
                ].map((badge) => (
                  <Link
                    key={badge.id}
                    href={`/achievements/card/${badge.id}`}
                    className="flex-shrink-0 group"
                  >
                    <div
                      className="relative rounded-2xl p-2.5 w-[260px] cursor-pointer group-hover:-translate-y-2 transition-transform duration-300"
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
    </DashboardLayout>
  );
}
