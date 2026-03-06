"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Activity,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

/* ─── Activity types ─── */
type ActivityType = "mint" | "query" | "verify";

interface ActivityRow {
  id: string;
  type: ActivityType;
  badge: {
    name: string;
    image: string;
    tier: string;
  };
  user: {
    address: string;
    ens?: string;
  };
  chain: string;
  txHash: string;
  timestamp: string;
  timeAgo: string;
  sxtCost?: number;
  points?: number;
  status: "confirmed" | "pending";
}

/* ─── Mock activity data ─── */
const activityData: ActivityRow[] = [
  {
    id: "1",
    type: "mint",
    badge: { name: "Whale Activity", image: "/cards/whale_activity.png", tier: "Legendary" },
    user: { address: "0x1a2B...9f4E", ens: "whale.eth" },
    chain: "Base",
    txHash: "0xab12...ef34",
    timestamp: "2025-03-04T18:32:00Z",
    timeAgo: "2 min ago",
    points: 1000,
    status: "confirmed",
  },
  {
    id: "2",
    type: "verify",
    badge: { name: "The Etherean", image: "/cards/etherean (2).png", tier: "Intermediate" },
    user: { address: "0x7c3D...2aB1" },
    chain: "Ethereum",
    txHash: "0xcd56...7890",
    timestamp: "2025-03-04T18:28:00Z",
    timeAgo: "6 min ago",
    sxtCost: 23,
    status: "confirmed",
  },
  {
    id: "3",
    type: "query",
    badge: { name: "Gas Guzzler", image: "/cards/gas_guzzler.png", tier: "Intermediate" },
    user: { address: "0x4eF8...1cD3", ens: "degen.eth" },
    chain: "Ethereum",
    txHash: "0xef78...12ab",
    timestamp: "2025-03-04T18:25:00Z",
    timeAgo: "9 min ago",
    status: "confirmed",
  },
  {
    id: "4",
    type: "mint",
    badge: { name: "Diamond Hands", image: "/cards/diamond_hands.png", tier: "Veteran" },
    user: { address: "0x9aB2...5eF7" },
    chain: "Base",
    txHash: "0x3456...cdef",
    timestamp: "2025-03-04T18:20:00Z",
    timeAgo: "14 min ago",
    points: 800,
    status: "confirmed",
  },
  {
    id: "5",
    type: "verify",
    badge: { name: "NFT Flipper", image: "/cards/nft_flipper (2).png", tier: "Intermediate" },
    user: { address: "0x2dC4...8aE6", ens: "flipper.eth" },
    chain: "Ethereum",
    txHash: "0x7890...abcd",
    timestamp: "2025-03-04T18:15:00Z",
    timeAgo: "19 min ago",
    sxtCost: 23,
    status: "confirmed",
  },
  {
    id: "6",
    type: "query",
    badge: { name: "Base Bull", image: "/cards/base_bull.png", tier: "Intermediate" },
    user: { address: "0x6fA1...3bC9" },
    chain: "Base",
    txHash: "0xabcd...ef01",
    timestamp: "2025-03-04T18:10:00Z",
    timeAgo: "24 min ago",
    status: "confirmed",
  },
  {
    id: "7",
    type: "mint",
    badge: { name: "Opensea VIP", image: "/cards/opensea (2).png", tier: "Hard" },
    user: { address: "0x8eD5...7fA2", ens: "nftking.eth" },
    chain: "Ethereum",
    txHash: "0x2345...6789",
    timestamp: "2025-03-04T18:05:00Z",
    timeAgo: "29 min ago",
    points: 500,
    status: "confirmed",
  },
  {
    id: "8",
    type: "verify",
    badge: { name: "AVAX Bull", image: "/cards/avax_bull.jpg", tier: "Intermediate" },
    user: { address: "0x3cB8...9dE4" },
    chain: "Base",
    txHash: "0x8901...2345",
    timestamp: "2025-03-04T17:55:00Z",
    timeAgo: "39 min ago",
    sxtCost: 23,
    status: "confirmed",
  },
  {
    id: "9",
    type: "query",
    badge: { name: "Multichain Maximalist", image: "/cards/multi-chain.png", tier: "Hard" },
    user: { address: "0x5aE2...1fC7", ens: "multi.eth" },
    chain: "Ethereum",
    txHash: "0xbcde...f012",
    timestamp: "2025-03-04T17:48:00Z",
    timeAgo: "46 min ago",
    status: "confirmed",
  },
  {
    id: "10",
    type: "mint",
    badge: { name: "Rug Victim", image: "/cards/emn_rug.png", tier: "Intermediate" },
    user: { address: "0x1fD9...4eA3" },
    chain: "Ethereum",
    txHash: "0xdef0...1234",
    timestamp: "2025-03-04T17:40:00Z",
    timeAgo: "54 min ago",
    points: 300,
    status: "confirmed",
  },
  {
    id: "11",
    type: "verify",
    badge: { name: "Fine Art Collector", image: "/cards/art_blocks.png", tier: "Hard" },
    user: { address: "0x7bA6...2cD8", ens: "artlover.eth" },
    chain: "Ethereum",
    txHash: "0x4567...89ab",
    timestamp: "2025-03-04T17:32:00Z",
    timeAgo: "1h ago",
    sxtCost: 23,
    status: "confirmed",
  },
  {
    id: "12",
    type: "mint",
    badge: { name: "The Memecoiner", image: "/cards/memecoin.png", tier: "Hard" },
    user: { address: "0x9eC3...5fB1" },
    chain: "Base",
    txHash: "0x6789...cdef",
    timestamp: "2025-03-04T17:20:00Z",
    timeAgo: "1h ago",
    points: 500,
    status: "confirmed",
  },
  {
    id: "13",
    type: "query",
    badge: { name: "Ethereum Villager", image: "/cards/2.png", tier: "Beginner" },
    user: { address: "0x2aF7...8dE5", ens: "newbie.eth" },
    chain: "Ethereum",
    txHash: "0x0123...4567",
    timestamp: "2025-03-04T17:10:00Z",
    timeAgo: "1h ago",
    status: "confirmed",
  },
  {
    id: "14",
    type: "verify",
    badge: { name: "The Validator", image: "/cards/eth_steak.png", tier: "Intermediate" },
    user: { address: "0x4dB1...6cA9" },
    chain: "Ethereum",
    txHash: "0x89ab...cde0",
    timestamp: "2025-03-04T16:55:00Z",
    timeAgo: "2h ago",
    sxtCost: 23,
    status: "confirmed",
  },
  {
    id: "15",
    type: "mint",
    badge: { name: "NFT Upper Class", image: "/cards/nft_20k.png", tier: "Legendary" },
    user: { address: "0x6eA4...0bF2", ens: "richlist.eth" },
    chain: "Base",
    txHash: "0xcdef...0123",
    timestamp: "2025-03-04T16:40:00Z",
    timeAgo: "2h ago",
    points: 1000,
    status: "confirmed",
  },
];

/* ─── Tier styling ─── */
const tierColors: Record<string, { color: string; bg: string; border: string }> = {
  Beginner: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.3)" },
  Intermediate: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)" },
  Hard: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  Veteran: { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
  Legendary: { color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.4)" },
};

const chainColors: Record<string, string> = {
  Ethereum: "#627EEA",
  Base: "#0052FF",
};

const filterOptions = [
  { id: "all", label: "All Activity" },
  { id: "mint", label: "Mints" },
];

/* ─── Main Page ─── */
export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return activityData.filter((row) => {
      const matchesFilter = activeFilter === "all" || row.type === activeFilter;
      const matchesSearch =
        search === "" ||
        row.badge.name.toLowerCase().includes(search.toLowerCase()) ||
        row.user.address.toLowerCase().includes(search.toLowerCase()) ||
        (row.user.ens && row.user.ens.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <DashboardLayout>
      {/* ─── Cloud Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-8 border border-white/[0.06]"
      >
        {/* Video background */}
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
        <div className="relative z-10 px-8 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent-orange/80" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
                Activity
              </h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Live feed of badge mints, ZK queries, and on-chain verifications across all chains.
            </p>
          </div>

        </div>
      </motion.div>

      {/* ─── Filters + Search ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
      >
        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
              style={
                activeFilter === f.id
                  ? {
                      background: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      color: "#a1a1aa",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl glass-strong sm:max-w-xs ml-auto">
          <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search badge or wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white text-xs placeholder:text-zinc-600 outline-none"
          />
        </div>
      </motion.div>

      {/* ─── Table ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12, 12, 30, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-6 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span>Badge</span>
          <span className="text-center">User</span>
          <span className="text-center">Chain</span>
          <span className="text-center">Time</span>
          <span className="text-center">Tx</span>
        </div>

        {/* Table rows */}
        <AnimatePresence mode="popLayout">
          {filtered.map((row, i) => {
            const tier = tierColors[row.badge.tier] ?? tierColors.Beginner;
            const chain = chainColors[row.chain] ?? "#a1a1aa";

            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-6 px-6 py-4 items-center group hover:bg-white/[0.03] transition-colors duration-200 cursor-default"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {/* Badge — image + name + tier */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-[60px] rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.06]">
                    <Image
                      src={row.badge.image}
                      alt={row.badge.name}
                      width={48}
                      height={68}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {row.badge.name}
                    </p>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: tier.color }}
                    >
                      {row.badge.tier}
                    </span>
                  </div>
                </div>

                {/* User */}
                <div className="min-w-0 text-center">
                  {row.user.ens ? (
                    <>
                      <p className="text-sm text-white font-medium truncate">{row.user.ens}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{row.user.address}</p>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-300 font-mono truncate">{row.user.address}</p>
                  )}
                </div>

                {/* Chain */}
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: chain, boxShadow: `0 0 6px ${chain}60` }}
                  />
                  <span className="text-xs text-zinc-400">{row.chain}</span>
                </div>

                {/* Time */}
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span className="text-xs text-zinc-500">{row.timeAgo}</span>
                </div>

                {/* Tx link */}
                <div className="text-center">
                  <a
                    href={`https://basescan.org/tx/${row.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-300 font-mono transition-colors"
                  >
                    {row.txHash.slice(0, 6)}...
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/60" />
                    <span className="text-[10px] text-emerald-500/60">Confirmed</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-600 text-sm">No activity found</p>
            <p className="text-zinc-700 text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-3.5 flex items-center justify-between"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span className="text-[11px] text-zinc-600">
            Showing {filtered.length} of {activityData.length} events
          </span>
          <span className="text-[11px] text-zinc-600">
            Powered by Space and Time &middot; Proof of SQL
          </span>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
