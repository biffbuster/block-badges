"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

function Sparkle({
  className,
  size = 24,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 1, 0],
        scale: [0.3, 1.2, 1, 1.2, 0.3],
        rotate: [0, 90, 180],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
        fill="url(#sparkle-grad)"
      />
      <defs>
        <radialGradient id="sparkle-grad">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

export default function CardLegends() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Full-width glass card container */}
      <div className="max-w-[1500px] mx-auto">
        <div
          className="relative rounded-3xl p-10 sm:p-14 overflow-hidden"
          style={{
            background: "rgba(12, 12, 30, 0.5)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Inner glow effects on the glass card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-orange/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-amber/[0.03] rounded-full blur-3xl pointer-events-none" />
          {/* Subtle shimmer border highlight */}
          <div className="absolute inset-0 rounded-3xl shimmer opacity-30 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center gap-16">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 max-w-lg"
            >
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-6">
                Meet Your
                <br />
                <span className="gradient-text">Card Legends!</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Get up close with the rarest onchain achievement cards. Discover
                exclusive tiers, pull legendary badges, and show off your crypto
                journey. New drops are coming — these are cards you won&apos;t
                want to miss!
              </p>
              <button className="group px-7 py-3.5 text-sm font-bold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all flex items-center gap-2">
                Open Packs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Right — stacked cards with sparkles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 flex justify-center"
            >
              <div className="relative w-[480px] h-[520px]">
                {/* Sparkles — larger and brighter */}
                <Sparkle
                  className="absolute -top-6 right-14"
                  size={32}
                  delay={0}
                />
                <Sparkle
                  className="absolute top-10 -right-8"
                  size={38}
                  delay={0.6}
                />
                <Sparkle
                  className="absolute top-1/3 -left-10"
                  size={28}
                  delay={1.2}
                />
                <Sparkle
                  className="absolute bottom-16 right-2"
                  size={34}
                  delay={1.8}
                />
                <Sparkle
                  className="absolute -top-4 left-16"
                  size={22}
                  delay={0.4}
                />
                <Sparkle
                  className="absolute bottom-4 left-6"
                  size={36}
                  delay={2.2}
                />
                <Sparkle
                  className="absolute top-2/3 -right-6"
                  size={26}
                  delay={1.0}
                />
                <Sparkle
                  className="absolute top-1/2 left-1/2"
                  size={20}
                  delay={1.5}
                />

                {/* Back card */}
                <motion.div
                  className="absolute top-0 right-0 w-[320px] card-3d"
                  animate={{ rotate: 8 }}
                  whileHover={{ rotate: 4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src="/cards/card_03.png"
                    alt="Happy Lending"
                    width={320}
                    height={448}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Front card */}
                <motion.div
                  className="absolute top-12 left-0 w-[320px] card-3d z-10"
                  animate={{ rotate: -6 }}
                  whileHover={{ rotate: -2, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src="/cards/art_blocks.png"
                    alt="Fine Art Collector"
                    width={320}
                    height={448}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Ambient glow behind cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-orange/[0.08] rounded-full blur-3xl pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
