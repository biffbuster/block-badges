"use client";

import { useAccount, useChainId } from "wagmi";
import { base } from "wagmi/chains";
import PrivyLoginButton from "@/components/ui/PrivyLoginButton";
import { motion } from "framer-motion";
import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Crown,
  Shield,
  Lock,
  AlertTriangle,
  ChevronDown,
  Copy,
  ExternalLink,
} from "lucide-react";

/* ─── Beginner badges (locked) ─── */
const beginnerBadges = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first transaction on Ethereum mainnet.",
    image: "/cards/card_02.png",
    tier: "Beginner",
    points: 50,
    glowColor: "#22c55e",
    chain: "Ethereum",
  },
  {
    id: "token-holder",
    name: "Token Holder",
    description: "Hold any ERC-20 token in your wallet for 24 hours.",
    image: "/cards/eth_steak.png",
    tier: "Beginner",
    points: 50,
    glowColor: "#22c55e",
    chain: "Ethereum",
  },
  {
    id: "nft-newbie",
    name: "NFT Newbie",
    description: "Receive your first NFT from any collection.",
    image: "/cards/nft_flipper.png",
    tier: "Beginner",
    points: 75,
    glowColor: "#22c55e",
    chain: "Ethereum",
  },
];

/* ─── Locked Card Component ─── */
function LockedCard({
  badge,
  index,
}: {
  badge: (typeof beginnerBadges)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1 }}
      className="relative group"
    >
      {/* Card frame — heavily obscured */}
      <div className="card-3d relative overflow-hidden">
        <div
          style={{
            filter: "grayscale(1) brightness(0.15) blur(1.5px)",
            opacity: 0.2,
          }}
        >
          <Image
            src={badge.image}
            alt={badge.name}
            width={400}
            height={560}
            className="w-full h-auto"
          />
        </div>

        {/* Dark veil */}
        <div className="absolute inset-0 bg-[#060611]/60 pointer-events-none" />

        {/* Lock icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(12, 12, 30, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Lock className="w-6 h-6 text-zinc-600" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-medium">
            Locked
          </span>
        </div>

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
          }}
        />
      </div>

      {/* Card info — muted */}
      <div className="mt-4 px-1">
        <h3 className="text-sm font-bold text-zinc-600 leading-tight mb-1">
          {badge.name}
        </h3>
        <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
          {badge.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-700/60 bg-emerald-500/[0.04] border border-emerald-500/10">
            {badge.tier}
          </span>
          <span className="text-[10px] text-zinc-700 font-mono">
            {badge.points} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Profile Page ─── */
export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const onCorrectChain = chainId === base.id;

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const copyAddress = () => {
    if (address) navigator.clipboard.writeText(address);
  };

  return (
    <DashboardLayout>
          {/* Not connected */}
          {!isConnected && (
            <div className="flex flex-col items-center gap-6 py-32">
              <Shield className="w-12 h-12 text-accent-orange/40" />
              <p className="text-zinc-500 text-lg">
                Connect your wallet to view your profile
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
                  mainnet
                </p>
              </div>
              <PrivyLoginButton />
            </div>
          )}

          {/* Connected on correct chain */}
          {isConnected && onCorrectChain && (
            <>
              {/* ─── Hero Banner ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl mb-8 border border-white/[0.06]"
              >
                {/* Cloud background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 45% 40% at 75% 15%, rgba(148, 163, 184, 0.16) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 30% at 20% 22%, rgba(120, 130, 150, 0.12) 0%, transparent 65%),
                      radial-gradient(ellipse 30% 25% at 50% 10%, rgba(180, 190, 205, 0.09) 0%, transparent 70%),
                      radial-gradient(ellipse 25% 20% at 62% 6%, rgba(56, 189, 248, 0.10) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 25% at 85% 35%, rgba(100, 116, 139, 0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 80% 50% at 45% 55%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                      radial-gradient(ellipse 100% 30% at 50% 80%, rgba(249, 115, 22, 0.03) 0%, transparent 50%),
                      linear-gradient(180deg, #14142a 0%, #0e0e1e 40%, #080814 70%, #060611 100%)
                    `,
                  }}
                />

                {/* Grain texture */}
                <div
                  className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                  }}
                />

                {/* Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 80px 20px rgba(6,6,17,0.5)" }}
                />

                {/* Content */}
                <div className="relative z-10 px-8 sm:px-10 pt-10 pb-8">
                  {/* Crown + actions row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                      <Crown className="w-5 h-5 text-amber-400/70" />
                    </div>
                  </div>

                  {/* Wallet address as title */}
                  <div className="flex items-center gap-3 mb-5">
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                      {displayAddress}
                    </h1>
                    <button
                      onClick={copyAddress}
                      className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://basescan.org/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500 hover:text-zinc-300"
                      title="View on BaseScan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Stat pills */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-zinc-500">Collected</span>
                      <span className="text-white font-semibold">
                        0 / {beginnerBadges.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-zinc-500">Tier</span>
                      <span className="text-emerald-400 font-semibold">
                        Beginner
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg glass text-sm">
                      <span className="text-emerald-400/80 text-xs">
                        &#10003;
                      </span>
                      <span className="text-zinc-300">ZK Verified</span>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-zinc-600">
                    Base Mainnet &middot; Connected
                  </p>
                </div>
              </motion.div>

              {/* ─── Two-column layout ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* ── Left sidebar ── */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Total cards */}
                  <div className="glass rounded-2xl p-6 border border-white/[0.04]">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold">
                        {beginnerBadges.length}
                      </span>
                      <span className="text-zinc-300 text-sm font-medium">
                        Total Cards
                      </span>
                    </div>

                    {/* Beginner section */}
                    <div className="border-t border-white/5 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                            {beginnerBadges.length}
                          </span>
                          <span className="text-zinc-200 text-sm font-medium">
                            Beginner
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-600" />
                      </div>

                      {/* Badge list */}
                      {beginnerBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center justify-between py-2.5 border-t border-white/[0.03]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-700 text-xs w-4 text-center font-mono">
                              0
                            </span>
                            <span className="text-zinc-500 text-sm">
                              {badge.name}
                            </span>
                          </div>
                          <Lock className="w-3 h-3 text-zinc-700" />
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-600">Progress</span>
                        <span className="text-xs text-zinc-600">
                          0 / {beginnerBadges.length}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: "0%",
                            background:
                              "linear-gradient(90deg, #22c55e, #4ade80)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Right content — locked card grid ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {beginnerBadges.map((badge, i) => (
                    <LockedCard key={badge.id} badge={badge} index={i} />
                  ))}
                </motion.div>
              </div>
            </>
          )}
    </DashboardLayout>
  );
}
