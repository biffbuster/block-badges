"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Achievement, tierColors, tierLabels } from "@/lib/achievements";
import { useAccount } from "wagmi";
import { useCheckAchievement } from "@/hooks/useCheckAchievement";
import { Shield, Check, X as XIcon, Loader2 } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
  style?: React.CSSProperties;
  className?: string;
  enableHover?: boolean;
  showVerify?: boolean;
}

const META_IDS = new Set(["chain-immortal", "multichain-explorer"]);

export default function AchievementCard({
  achievement,
  style,
  className = "",
  enableHover = true,
  showVerify = false,
}: AchievementCardProps) {
  const [flipped, setFlipped] = useState(false);
  const color = tierColors[achievement.tier];
  const { address, isConnected } = useAccount();
  const { check, status, data, error, reset } = useCheckAchievement();
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const isMeta = META_IDS.has(achievement.id);
  const canVerify = showVerify && isConnected && !isMeta;

  useEffect(() => {
    if (status === "loading") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === "loading" || !address) return;
    reset();
    check(address, achievement.id);
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: "1000px", ...style }}
      onClick={() => enableHover && setFlipped(!flipped)}
      whileHover={enableHover ? { scale: 1.05, y: -8 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="relative w-[220px] h-[310px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: `0 0 30px ${color}20, 0 8px 32px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${color}15 0%, #1a1a24 40%, #1a1a24 60%, ${color}10 100%)`,
              border: `1px solid ${color}40`,
            }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer rounded-2xl opacity-40" />

          <div className="relative h-full flex flex-col items-center justify-between p-5">
            {/* Tier badge */}
            <div className="self-end">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  color,
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                }}
              >
                {tierLabels[achievement.tier]}
              </span>
            </div>

            {/* Icon */}
            <div className="text-6xl my-2 drop-shadow-lg">
              {achievement.icon}
            </div>

            {/* Info */}
            <div className="text-center space-y-2 flex-1 flex flex-col justify-end">
              <h3 className="text-base font-bold text-white leading-tight">
                {achievement.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {achievement.description}
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span
                  className="text-xs font-bold"
                  style={{ color }}
                >
                  {achievement.points} pts
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-xs text-zinc-500">
                  {achievement.chain}
                </span>
              </div>
            </div>
          </div>

          {/* Verify overlay */}
          {canVerify && (
            <div className="absolute bottom-0 left-0 right-0 p-3" style={{ backfaceVisibility: "hidden" }}>
              {status === "idle" && (
                <button
                  onClick={handleVerify}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                  style={{ background: `${color}30`, border: `1px solid ${color}50` }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Verify with ZK Proof
                </button>
              )}
              {status === "loading" && (
                <div
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying... {elapsed}s
                </div>
              )}
              {status === "success" && data && (
                <div
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: data.qualified ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${data.qualified ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                    color: data.qualified ? "#22c55e" : "#ef4444",
                  }}
                >
                  {data.qualified ? (
                    <><Check className="w-3.5 h-3.5" /> Qualified!</>
                  ) : (
                    <><XIcon className="w-3.5 h-3.5" /> Not Qualified</>
                  )}
                </div>
              )}
              {status === "error" && (
                <button
                  onClick={handleVerify}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                  title={error ?? ""}
                >
                  <XIcon className="w-3.5 h-3.5" />
                  Failed — Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `0 0 30px ${color}20, 0 8px 32px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "#12121a",
              border: `1px solid ${color}40`,
            }}
          />
          <div className="relative h-full flex flex-col p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{achievement.icon}</span>
              <span className="text-xs font-bold text-white">
                SQL Query
              </span>
            </div>
            <div className="flex-1 rounded-lg bg-black/40 p-3 border border-white/5">
              <pre className="text-[10px] text-accent-purple font-mono leading-relaxed whitespace-pre-wrap break-all">
                {achievement.query}
              </pre>
            </div>
            <p className="text-[10px] text-zinc-500 mt-3 text-center">
              Verified with SXT Proof of SQL
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
