"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroCards = [
  { src: "/cards/8.png", alt: "Sandwich'd", beam: "#84cc16" },
  { src: "/cards/gas_guzzler.png", alt: "Gas Guzzler", beam: "#f97316" },
  { src: "/cards/etherean (2).png", alt: "The Etherean", beam: "#60a5fa" },
  { src: "/cards/multi-chain.png", alt: "Multichain Maximalist", beam: "#c084fc" },
  { src: "/cards/opensea (2).png", alt: "Opensea VIP", beam: "#22d3ee" },
];

export default function Hero() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-36 pb-0 overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            maskImage:
              "linear-gradient(180deg, black 0%, black 40%, rgba(0,0,0,0.3) 65%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(180deg, black 0%, black 40%, rgba(0,0,0,0.3) 65%, transparent 85%)",
          }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-bg-primary/70" />
        {/* Dark vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030308_100%)]" />
      </div>

      {/* Subtle gradient accents for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top center warm glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-orange/[0.04] rounded-full blur-[120px]" />
        {/* Bottom center glow behind cards */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-accent-orange/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Social proof tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-10"
        >
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-accent-orange/20 border-2 border-bg-primary flex items-center justify-center">
              <Users className="w-3 h-3 text-accent-orange" />
            </div>
            <div className="w-7 h-7 rounded-full bg-accent-amber/20 border-2 border-bg-primary flex items-center justify-center text-[10px]">
              🔥
            </div>
            <div className="w-7 h-7 rounded-full bg-accent-blue/20 border-2 border-bg-primary flex items-center justify-center text-[10px]">
              ⛓️
            </div>
          </div>
          <span className="text-sm text-zinc-400">
            <span className="text-white font-semibold">+2,500</span> wallets
            already verified
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight leading-[0.95] mb-4"
        >
          <span className="text-white">Power to</span>
          <br />
          <span className="gradient-text">the Provers.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The first ZK-verified collectible card game for your onchain legacy.
          <br className="hidden sm:block" />
          Stack your deck, flex your badges, and prove it all cryptographically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center mb-6"
        >
          <Link
            href="/achievements"
            className="btn-liquid px-8 py-3 text-sm font-bold rounded-full text-white flex items-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" />
            View Dashboard
          </Link>
        </motion.div>

        {/* Powered by SxT badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex items-center justify-center"
        >
          <div className="sxt-badge group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] cursor-default">
            <span className="text-xs text-zinc-500">Powered by</span>
            <Image
              src="/logos/sxt.svg"
              alt="Space and Time"
              width={80}
              height={20}
              className="h-4 w-auto object-contain opacity-50 group-hover:opacity-70 transition-opacity"
            />
          </div>
        </motion.div>
      </div>

      {/* Fanned card images — large, well-spaced, like the reference */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full flex justify-center -mt-16"
      >
        <div className="relative h-[500px] sm:h-[580px] w-full max-w-7xl mx-auto flex items-end justify-center">
          {/* Glow behind cards */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-accent-orange/[0.06] rounded-full blur-3xl" />

          {heroCards.map((card, i) => {
            const total = heroCards.length;
            const mid = (total - 1) / 2;
            const offset = i - mid;
            const rotate = offset * 8;
            const translateX = offset * 170;
            const translateY = Math.abs(offset) * 35 + 40;
            const zIndex = total - Math.abs(Math.round(offset));
            const isHovered = hoveredCard === i;

            return (
              <motion.div
                key={card.alt}
                className="absolute origin-bottom"
                initial={false}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotate: rotate,
                }}
                whileHover={{
                  y: translateY - 30,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                style={{ zIndex: isHovered ? 20 : zIndex }}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Beam of light — centered behind card */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {/* Vertical beam */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          bottom: 0,
                          width: "600px",
                          height: "1400px",
                          background: `linear-gradient(to top, ${card.beam}80 0%, ${card.beam}50 10%, ${card.beam}30 30%, ${card.beam}15 55%, transparent 85%)`,
                          filter: "blur(45px)",
                          transform: "translateX(-50%)",
                        }}
                      />
                      {/* Glow behind card */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(ellipse at center, ${card.beam}40 0%, ${card.beam}15 40%, transparent 70%)`,
                          filter: "blur(25px)",
                          margin: "-48px",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="card-3d w-[280px] sm:w-[320px]">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={320}
                    height={448}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
