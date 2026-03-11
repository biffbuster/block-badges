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
              className="flex-1 max-w-xl"
            >
              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-6">
                <span className="text-white">Proof-Of-</span><span className="gradient-text">Achievement</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Flex your historic moments onchain with style. Discover and explore
                a variety of achievements, and unlock them by verifying query is
                accurate and data is untampered. Powered by Space and Time&apos;s
                ZK-proven queries. New drops each week! Start unlocking badges and
                begin your journey!
              </p>
              <button className="group px-7 py-3.5 text-sm font-bold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all flex items-center gap-2">
                View Badges
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Right — stacked badges with sparkles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 flex justify-end"
            >
              <div className="relative w-[520px] h-[560px]" style={{ perspective: "1200px" }}>
                {/* Sparkles */}
                <Sparkle className="absolute -top-6 right-14" size={32} delay={0} />
                <Sparkle className="absolute top-10 -right-8" size={38} delay={0.6} />
                <Sparkle className="absolute top-1/3 -left-10" size={28} delay={1.2} />
                <Sparkle className="absolute bottom-16 right-2" size={34} delay={1.8} />
                <Sparkle className="absolute -top-4 left-16" size={22} delay={0.4} />
                <Sparkle className="absolute bottom-4 left-6" size={36} delay={2.2} />
                <Sparkle className="absolute top-2/3 -right-6" size={26} delay={1.0} />
                <Sparkle className="absolute top-1/2 left-1/2" size={20} delay={1.5} />

                {/* Back badge */}
                <motion.div
                  className="absolute top-0 right-0 w-[400px]"
                  animate={{ rotate: 8 }}
                  whileHover={{ rotate: 4, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <Image
                      src="/badges/diamond_hands.png"
                      alt="Diamond Hands"
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute inset-0 shimmer opacity-40 rounded-full pointer-events-none" />
                  </div>
                </motion.div>

                {/* Front badge — slow 3D oscillating turn */}
                <motion.div
                  className="absolute top-8 left-0 w-[420px] z-10"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    rotateY: [0, 18, 0, -18, 0],
                    rotate: -6,
                  }}
                  transition={{
                    rotateY: {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: { duration: 0 },
                  }}
                >
                  <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                    <Image
                      src="/badges/art_collector.png"
                      alt="Fine Art Collector"
                      width={420}
                      height={420}
                      className="w-full h-auto object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute inset-0 shimmer opacity-40 rounded-full pointer-events-none" />
                  </div>
                </motion.div>

                {/* Ambient glow behind badges */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-orange/[0.08] rounded-full blur-3xl pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
