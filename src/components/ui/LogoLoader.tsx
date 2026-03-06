"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LogoLoaderProps {
  /** Minimum display time in ms */
  minDuration?: number;
  /** Called when loader finishes */
  onComplete?: () => void;
}

export default function LogoLoader({
  minDuration = 2000,
  onComplete,
}: LogoLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, minDuration);
    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#060611" }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Subtle radial glow behind logo */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo — dim version (always visible underneath) */}
            <div className="relative">
              <Image
                src="/logos/block_badges_light.png"
                alt="Block Badges"
                width={400}
                height={160}
                className="h-[120px] w-auto object-contain brightness-[2] contrast-[1.2]"
                style={{ opacity: 0.15 }}
                priority
              />

              {/* Logo — bright version (clip-path reveal) */}
              <motion.div
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{
                  duration: 1.2,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.3,
                }}
              >
                <Image
                  src="/logos/block_badges_light.png"
                  alt=""
                  width={400}
                  height={160}
                  className="h-[120px] w-auto object-contain brightness-[2] contrast-[1.2]"
                  priority
                  aria-hidden
                />
              </motion.div>
            </div>

            {/* Loading bar */}
            <div className="w-48 h-[2px] rounded-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #f97316, #f59e0b, #f97316)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: (minDuration - 400) / 1000,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </div>

            {/* Shimmer text */}
            <motion.p
              className="text-xs text-zinc-600 font-mono tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Verifying onchain...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
