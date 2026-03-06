"use client";

import { useState, useMemo, useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import { base } from "wagmi/chains";
import PrivyLoginButton from "@/components/ui/PrivyLoginButton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Shield,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Layers,
  Crown,
} from "lucide-react";

/* ─── Inline SVG chain icons ─── */
function PolygonIcon() {
  return (
    <svg viewBox="0 0 38.4 33.5" className="w-full h-full" fill="currentColor">
      <path d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6.4-2.4 0l-4.3-2.6c-.7-.4-1.2-1.2-1.2-2.1v-5c0-.8.4-1.6 1.2-2.1l4.3-2.5c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V7c0-.8-.4-1.6-1.2-2.1l-8-4.7c-.7-.4-1.6-.4-2.4 0L1.2 4.8C.4 5.2 0 6 0 6.8v9.4c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l5.5-3.2 3.8-2.2 5.5-3.2c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v5c0 .8-.4 1.6-1.2 2.1l-4.2 2.5c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V21l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l8.1-4.7c.7-.4 1.2-1.2 1.2-2.1V17c0-.8-.4-1.6-1.2-2.1L29 10.2z" />
    </svg>
  );
}

function BitcoinIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
      <path d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm7.2 18.8c-.7 2.8-3.3 3.8-5.7 3.9l-.8 3.2-1.9-.5.8-3c-.3-.1-.7-.2-1-.3l-.8 3-1.9-.5.8-3.2c-.3-.1-.6-.1-.9-.2l-2.6-.6.5-2s1.3.3 1.3.3c.6.2.8-.2.9-.5l1-4 .2.1-.2-.1.7-2.9c0-.4-.1-.8-.8-1 0 0-1.3-.3-1.3-.3l.4-1.8 2.7.7.8-3.1 1.9.5-.8 3c.3.1.7.2 1 .3l.8-3 1.9.5-.8 3.2c2.2.8 3.7 2 3.4 4.2-.2 1.7-1.3 2.5-2.6 2.8.9.5 1.5 1.3 1.2 2.8zm-2.4-4.6c.2-1.7-1.8-2-3.1-2.3l-.6 2.5c1.3.3 3.5.8 3.7-.5v.3zm-1.3 4.2c.2-1.9-2.2-2.2-3.5-2.5l-.7 2.7c1.3.3 4 .8 4.2-.5v.3z" />
    </svg>
  );
}

function BaseIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
      <circle cx="16" cy="16" r="16" />
      <path d="M15.9 5.5a10.5 10.5 0 1 0 0 21c3.7 0 6.9-1.9 8.8-4.8H18v-3h9.2a10.5 10.5 0 0 0-11.3-13.2z" fill="#060611" />
    </svg>
  );
}

function AvalancheIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
      <circle cx="16" cy="16" r="16" />
      <path d="M20.6 21h2.6c.4 0 .7-.2.9-.5s.2-.7 0-1L17 8.2c-.2-.3-.5-.5-.9-.5s-.7.2-.9.5l-2 3.6c-.2.3-.2.7 0 1l5.5 7.7c.2.3.5.5.9.5zm-7.8 0h-3.6c-.4 0-.7-.2-.9-.5-.2-.3-.2-.7 0-1l5.3-9.3c.2-.3.5-.5.9-.5s.7.2.9.5l1.6 2.8c.2.3.2.7 0 1L12.7 21h.1z" fill="#060611" />
    </svg>
  );
}

/* ─── Chain definitions ─── */
const chains = [
  { id: "all", name: "All Chains", color: "#f97316" },
  { id: "ethereum", name: "Ethereum", color: "#627EEA" },
  { id: "polygon", name: "Polygon", color: "#8247E5" },
  { id: "base", name: "Base", color: "#0052FF" },
  { id: "arbitrum", name: "Arbitrum", color: "#28A0F0" },
  { id: "optimism", name: "Optimism", color: "#FF0420" },
  { id: "zksync", name: "ZKsync", color: "#8B8DFC" },
  { id: "sui", name: "Sui", color: "#6FBCF0" },
  { id: "bitcoin", name: "Bitcoin", color: "#F7931A" },
  { id: "avalanche", name: "Avalanche", color: "#E84142" },
];

function ChainLogo({ chainId }: { chainId: string }) {
  switch (chainId) {
    case "ethereum":
      return <Image src="/logos/ethereum.png" alt="" width={20} height={20} className="object-contain w-full h-full" />;
    case "polygon":
      return <PolygonIcon />;
    case "sui":
      return <Image src="/logos/sui.webp" alt="" width={20} height={20} className="object-contain w-full h-full" />;
    case "optimism":
      return <Image src="/logos/optimism.webp" alt="" width={20} height={20} className="object-contain w-full h-full" />;
    case "arbitrum":
      return <Image src="/logos/arbitrum.png" alt="" width={20} height={20} className="object-contain w-full h-full" />;
    case "zksync":
      return <Image src="/logos/zksync.png" alt="" width={20} height={20} className="object-contain w-full h-full" />;
    case "bitcoin":
      return <BitcoinIcon />;
    case "base":
      return <BaseIcon />;
    case "avalanche":
      return <AvalancheIcon />;
    default:
      return null;
  }
}

/* ─── Card data ─── */
const tierConfig: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  Beginner: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.3)", glow: "rgba(74,222,128,0.15)" },
  Intermediate: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)", glow: "rgba(96,165,250,0.15)" },
  Hard: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", glow: "rgba(245,158,11,0.15)" },
  Veteran: { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)", glow: "rgba(192,132,252,0.15)" },
  Legendary: { color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.4)", glow: "rgba(249,115,22,0.25)" },
};

const allCards = [
  {
    id: "etherean",
    name: "The Etherean",
    description: "Hold at least one ETH.",
    image: "/cards/etherean (2).png",
    category: "Ethereum",
    chain: "ethereum",
    points: 300,
    glowColor: "#60a5fa",
    tier: "Intermediate",
  },
  {
    id: "gas-guzzler",
    name: "Gas Guzzler",
    description: "Spend over 10 ETH in gas on Ethereum mainnet.",
    image: "/cards/gas_guzzler.png",
    category: "Ethereum",
    chain: "ethereum",
    points: 300,
    glowColor: "#f97316",
    tier: "Intermediate",
  },
  {
    id: "nft-flipper",
    name: "NFT Flipper",
    description: "Bought and sold at least 50 NFTs.",
    image: "/cards/nft_flipper (2).png",
    category: "NFT",
    chain: "ethereum",
    points: 300,
    glowColor: "#8b5cf6",
    tier: "Intermediate",
  },
  {
    id: "multichain",
    name: "Multichain Maximalist",
    description: "Used 5 different blockchains.",
    image: "/cards/multi-chain.png",
    category: "Multi",
    chain: "multi",
    points: 500,
    glowColor: "#60a5fa",
    tier: "Hard",
  },
  {
    id: "opensea",
    name: "Opensea VIP",
    description: "Bought an NFT before 2021.",
    image: "/cards/opensea (2).png",
    category: "NFT",
    chain: "ethereum",
    points: 500,
    glowColor: "#22d3ee",
    tier: "Hard",
  },
  {
    id: "art-blocks",
    name: "Fine Art Collector",
    description: "Hold 3 or more Art Blocks items in your wallet.",
    image: "/cards/art_blocks.png",
    category: "NFT",
    chain: "ethereum",
    points: 500,
    glowColor: "#4ade80",
    tier: "Hard",
  },
  {
    id: "liquidated",
    name: "Liquidated",
    description: "Get liquidated 1 time(s).",
    image: "/cards/card_01.png",
    category: "DeFi",
    chain: "ethereum",
    points: 300,
    glowColor: "#ef4444",
    tier: "Intermediate",
  },
  {
    id: "rookie-predictor",
    name: "Rookie Predictor",
    description: "Place one wager on Polymarket.",
    image: "/cards/card_02.png",
    category: "DeFi",
    chain: "ethereum",
    points: 100,
    glowColor: "#4ade80",
    tier: "Beginner",
  },
  {
    id: "happy-lending",
    name: "Happy Lending",
    description: "Lend at least 1 ETH on Aave (Ethereum mainnet).",
    image: "/cards/card_03.png",
    category: "DeFi",
    chain: "ethereum",
    points: 300,
    glowColor: "#c084fc",
    tier: "Intermediate",
  },
  {
    id: "rug-victim",
    name: "Rug Victim",
    description: "Still holding the rugged $EMN (Eminence) token.",
    image: "/cards/emn_rug.png",
    category: "DeFi",
    chain: "ethereum",
    points: 300,
    glowColor: "#3b82f6",
    tier: "Intermediate",
  },
  {
    id: "validator",
    name: "The Validator",
    description: "Stake at least 1 ETH for over 365 days.",
    image: "/cards/eth_steak.png",
    category: "Ethereum",
    chain: "ethereum",
    points: 300,
    glowColor: "#60a5fa",
    tier: "Intermediate",
  },
  {
    id: "memecoiner",
    name: "The Memecoiner",
    description: "Hold $PEPE, $BOBO, $DOGE, or WIF for over 365 days.",
    image: "/cards/memecoin.png",
    category: "DeFi",
    chain: "ethereum",
    points: 500,
    glowColor: "#e879f9",
    tier: "Hard",
  },
  {
    id: "nft-upper-class",
    name: "NFT Upper Class",
    description: "Make $20K profit in one NFT trade.",
    image: "/cards/nft_20k.png",
    category: "NFT",
    chain: "ethereum",
    points: 1000,
    glowColor: "#f59e0b",
    tier: "Legendary",
  },
  {
    id: "base-bull",
    name: "Base Bull",
    description: "Have at least 100 transactions on the Base chain.",
    image: "/cards/base_bull.png",
    category: "Multi",
    chain: "base",
    points: 300,
    glowColor: "#0052FF",
    tier: "Intermediate",
  },
  {
    id: "avax-bull",
    name: "AVAX Bull",
    description: "Have at least 100 transactions on Avalanche C-Chain.",
    image: "/cards/avax_bull.jpg",
    category: "Multi",
    chain: "avalanche",
    points: 300,
    glowColor: "#E84142",
    tier: "Intermediate",
  },
  {
    id: "diamond-hands",
    name: "Diamond Hands",
    description: "Hold 1 BTC for 3 years minimum.",
    image: "/cards/diamond_hands.png",
    category: "Ethereum",
    chain: "bitcoin",
    points: 800,
    glowColor: "#e2e8f0",
    tier: "Veteran",
  },
  {
    id: "whale-activity",
    name: "Whale Activity",
    description: "Hold at least 100 ETH.",
    image: "/cards/whale_activity.png",
    category: "Ethereum",
    chain: "ethereum",
    points: 1000,
    glowColor: "#38bdf8",
    tier: "Legendary",
  },
  {
    id: "ethereum-villager",
    name: "Ethereum Villager",
    description: "Make at least 5 transactions on Ethereum mainnet.",
    image: "/cards/2.png",
    category: "Ethereum",
    chain: "ethereum",
    points: 100,
    glowColor: "#60a5fa",
    tier: "Beginner",
  },
  {
    id: "the-contributor",
    name: "The Contributor",
    description: "Deploy one contract on Ethereum mainnet.",
    image: "/cards/3.png",
    category: "Ethereum",
    chain: "ethereum",
    points: 100,
    glowColor: "#f59e0b",
    tier: "Beginner",
  },
  {
    id: "sandwichd",
    name: "Sandwich'd",
    description: "Get sandwich'd by an MEV bot.",
    image: "/cards/8.png",
    category: "DeFi",
    chain: "ethereum",
    points: 100,
    glowColor: "#84cc16",
    tier: "Beginner",
  },
  {
    id: "data-wrangler",
    name: "Data Wrangler",
    description: "Spend at least 25 SXT to run an onchain query.",
    image: "/cards/9.png",
    category: "Multi",
    chain: "base",
    points: 100,
    glowColor: "#a78bfa",
    tier: "Beginner",
  },
  {
    id: "bullseye",
    name: "Bullseye",
    description: "Sold a BAYC 10% from the top.",
    image: "/cards/10.png",
    category: "NFT",
    chain: "ethereum",
    points: 1000,
    glowColor: "#3b82f6",
    tier: "Legendary",
  },
  {
    id: "base-builder",
    name: "Base Builder",
    description: "Deploy a smart contract on Base mainnet.",
    image: "/cards/base_builder_card.png",
    category: "Multi",
    chain: "base",
    points: 300,
    glowColor: "#0052FF",
    tier: "Intermediate",
  },
  {
    id: "squiggler",
    name: "Squiggler",
    description: "Hold one Squiggle by Snowfro in your wallet.",
    image: "/cards/11.png",
    category: "NFT",
    chain: "ethereum",
    points: 800,
    glowColor: "#ec4899",
    tier: "Veteran",
  },
];

const categories = ["All", "Ethereum", "NFT", "DeFi", "Multi"];
const categoryIcons: Record<string, string> = {
  All: "\u{1F525}",
  Ethereum: "\u22A0",
  NFT: "\u{1F3A8}",
  DeFi: "\u{1F3E6}",
  Multi: "\u{1F30D}",
};

/* ─── Tier Badge ─── */
function TierBadge({ tier }: { tier: string }) {
  const t = tierConfig[tier] ?? tierConfig.Beginner;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
      style={{
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: `0 0 12px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
      />
      {tier}
    </span>
  );
}

/* ─── Card Component ─── */
function DashboardCard({
  card,
  view,
}: {
  card: (typeof allCards)[0];
  view: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <Link href={`/achievements/card/${card.id}`}>
        <motion.div
          className="flex items-center gap-6 glass rounded-2xl p-4 group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          style={{
            boxShadow: `0 0 20px ${card.glowColor}10`,
            border: `1px solid ${card.glowColor}20`,
          }}
        >
          <div className="card-3d w-20 flex-shrink-0">
            <Image
              src={card.image}
              alt={card.name}
              width={80}
              height={112}
              className="w-full h-auto"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{card.name}</h3>
            <p className="text-sm text-zinc-400 line-clamp-1">{card.description}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <TierBadge tier={card.tier} />
            <span className="text-[10px] text-zinc-500 font-mono">{card.category}</span>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/achievements/card/${card.id}`}>
      <motion.div
        className="relative group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${card.glowColor}25 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* 3D card frame */}
        <div
          className="card-3d relative"
          style={{
            boxShadow: `
              0 2px 0 0 rgba(255,255,255,0.08),
              0 -2px 0 0 rgba(0,0,0,0.4),
              0 8px 24px rgba(0,0,0,0.6),
              0 16px 48px rgba(0,0,0,0.4),
              0 0 30px ${card.glowColor}15,
              inset 0 1px 0 rgba(255,255,255,0.12),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          <Image
            src={card.image}
            alt={card.name}
            width={400}
            height={560}
            className="w-full h-auto"
          />
        </div>

        {/* Card info below */}
        <div className="mt-4 px-1">
          <h3 className="text-sm font-bold text-white leading-tight mb-1.5">
            {card.name}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
            {card.description}
          </p>
          <div className="flex items-center justify-between">
            <TierBadge tier={card.tier} />
            <span className="text-[10px] text-zinc-600 font-mono">{card.category}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Chain Carousel ─── */
function ChainCarousel({
  activeChain,
  onSelect,
}: {
  activeChain: string;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 }}
      className="relative mb-5"
    >
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1 py-1"
      >
        {chains.map((chain) => {
          const isActive = activeChain === chain.id;
          const isAll = chain.id === "all";

          return (
            <button
              key={chain.id}
              onClick={() => onSelect(chain.id)}
              className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group"
              style={{
                background: isActive
                  ? `${chain.color}12`
                  : "rgba(255,255,255,0.02)",
                border: isActive
                  ? `1px solid ${chain.color}40`
                  : "1px solid rgba(255,255,255,0.04)",
                boxShadow: isActive
                  ? `0 0 20px ${chain.color}18, 0 0 40px ${chain.color}08`
                  : "none",
              }}
            >
              {/* Logo */}
              <div
                className="w-5 h-5 flex items-center justify-center transition-all duration-300"
                style={{
                  color: chain.color,
                  opacity: isActive ? 1 : 0.3,
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${chain.color}80)`
                    : `drop-shadow(0 0 3px ${chain.color}20)`,
                }}
              >
                {isAll ? (
                  <Layers className="w-4 h-4" />
                ) : (
                  <ChainLogo chainId={chain.id} />
                )}
              </div>

              {/* Name */}
              <span
                className="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                style={{
                  color: isActive ? chain.color : "#52525b",
                }}
              >
                {chain.name}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="chain-dot"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: chain.color }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function DashboardPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const onCorrectChain = chainId === base.id;

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeChain, setActiveChain] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch =
        search === "" ||
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || card.category === activeCategory;
      const matchesChain =
        activeChain === "all" ||
        card.chain === activeChain ||
        card.chain === "multi";
      return matchesSearch && matchesCategory && matchesChain;
    });
  }, [search, activeCategory, activeChain]);

  return (
    <DashboardLayout>
          {/* Not connected */}
          {!isConnected && (
            <div className="flex flex-col items-center gap-6 py-32">
              <Shield className="w-12 h-12 text-accent-orange/40" />
              <p className="text-zinc-500 text-lg">
                Connect your wallet to Base to start verifying badges
              </p>
              <PrivyLoginButton />
            </div>
          )}

          {/* Connected but wrong chain */}
          {isConnected && !onCorrectChain && (
            <div className="flex flex-col items-center gap-6 py-32">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <p className="text-yellow-400 text-sm font-medium">
                  Please switch to{" "}
                  <span className="text-white font-bold">Base</span>{" "}
                  testnet
                </p>
              </div>
              <PrivyLoginButton />
            </div>
          )}

          {/* Connected on correct chain */}
          {isConnected && onCorrectChain && (
            <>
              {/* Hero banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl mb-8 border border-white/[0.06]"
              >
                {/* Video background (same as hero) */}
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
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-bg-primary/70" />
                  {/* Vignette edges */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060611_100%)]" />
                </div>

                {/* Content */}
                <div className="relative z-10 px-8 sm:px-10 pt-10 pb-8">
                  {/* Crown icon */}
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-5">
                    <Crown className="w-5 h-5 text-amber-400/70" />
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-5 tracking-tight">
                    All Cards
                  </h1>

                  {/* Stat pills */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-zinc-500">Collected</span>
                      <span className="text-white font-semibold">0 / {allCards.length}</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-zinc-500">Chains</span>
                      <span className="text-white font-semibold">{chains.length - 1}</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-emerald-400/80 text-xs">&#10003;</span>
                      <span className="text-zinc-300">ZK Verified</span>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-zinc-600">
                    Powered by Space and Time &middot; Proof of SQL
                  </p>
                </div>
              </motion.div>

              {/* Chain carousel */}
              <ChainCarousel
                activeChain={activeChain}
                onSelect={setActiveChain}
              />

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl glass-strong">
                  <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3.5 rounded-xl glass-strong text-zinc-400 hover:text-white transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm">(0)</span>
                </button>
              </motion.div>

              {/* Category pills + view toggle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-10"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                      style={
                        activeCategory === cat
                          ? {
                              background: "rgba(255,255,255,0.12)",
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.2)",
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              color: "#a1a1aa",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }
                      }
                    >
                      <span className="text-sm">{categoryIcons[cat]}</span>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setView("grid")}
                    className="p-2.5 rounded-lg transition-colors"
                    style={{
                      background: view === "grid" ? "rgba(255,255,255,0.1)" : "transparent",
                      color: view === "grid" ? "#fff" : "#71717a",
                    }}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="p-2.5 rounded-lg transition-colors"
                    style={{
                      background: view === "list" ? "rgba(255,255,255,0.1)" : "transparent",
                      color: view === "list" ? "#fff" : "#71717a",
                    }}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Card grid / list */}
              <AnimatePresence mode="wait">
                {view === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filtered.map((card, i) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <DashboardCard card={card} view="grid" />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    {filtered.map((card, i) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <DashboardCard card={card} view="list" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-zinc-600 text-lg">No cards found for this chain yet</p>
                  <p className="text-zinc-700 text-sm mt-2">More badges coming soon</p>
                </div>
              )}
            </>
          )}
    </DashboardLayout>
  );
}
