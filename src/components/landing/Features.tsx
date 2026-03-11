"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        fill="url(#feat-sparkle-grad)"
      />
      <defs>
        <radialGradient id="feat-sparkle-grad">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const sqlRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [typedLines, setTypedLines] = useState(0);

  // Code lines for the IDE typing animation (13 lines — fits on screen)
  const codeLines: React.ReactNode[] = [
    <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">SxTSDK</span> <span className="text-[#89ddff]">=</span> <span className="text-[#c792ea]">await</span> <span className="text-[#82aaff]">import</span><span className="text-[#89ddff]">(</span><span className="text-[#c3e88d]">&quot;sxt-proof-of-sql-sdk&quot;</span><span className="text-[#89ddff]">)</span><span className="text-[#636380]">;</span></>,
    <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">client</span> <span className="text-[#89ddff]">=</span> <span className="text-[#c792ea]">new</span> <span className="text-[#ffcb6b]">SxTSDK.SxTClient</span><span className="text-[#89ddff]">(</span><span className="text-[#82aaff]">apiUrl</span><span className="text-[#636380]">,</span> <span className="text-[#82aaff]">apiKey</span><span className="text-[#89ddff]">)</span><span className="text-[#636380]">;</span></>,
    null,
    <><span className="text-[#636380]">{"// Verify ETH staking for badge"}</span></>,
    <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">query</span> <span className="text-[#89ddff]">=</span> <span className="text-[#c3e88d]">`</span><span className="text-[#f78c6c] font-bold">SELECT</span></>,
    <><span className="text-[#eeffff]">{"  "}DEPOSITOR_ADDRESS</span><span className="text-[#636380]">,</span></>,
    <><span className="text-[#eeffff]">{"  "}</span><span className="text-[#ffcb6b]">SUM</span><span className="text-[#89ddff]">(</span><span className="text-[#eeffff]">AMOUNT</span><span className="text-[#89ddff]">)</span> <span className="text-[#f78c6c] font-bold">AS</span> <span className="text-[#82aaff]">STAKED</span></>,
    <><span className="text-[#f78c6c] font-bold">FROM</span> <span className="text-[#ffcb6b]">ETHEREUM</span><span className="text-[#89ddff]">.</span><span className="text-[#ffcb6b]">BEACON_DEPOSITS</span></>,
    <><span className="text-[#f78c6c] font-bold">WHERE</span> <span className="text-[#eeffff]">DEPOSITOR_ADDRESS</span> <span className="text-[#89ddff]">=</span> <span className="text-[#c3e88d]">&apos;0x7a16ff...f3d2&apos;</span></>,
    <><span className="text-[#f78c6c] font-bold">HAVING</span> <span className="text-[#82aaff]">STAKED</span> <span className="text-[#89ddff]">&gt;=</span> <span className="text-[#f78c6c]">32000000000</span><span className="text-[#c3e88d]">`</span><span className="text-[#636380]">;</span></>,
    null,
    <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">result</span> <span className="text-[#89ddff]">=</span> <span className="text-[#c792ea]">await</span> <span className="text-[#82aaff]">client</span><span className="text-[#89ddff]">.</span><span className="text-[#ffcb6b]">queryAndVerify</span><span className="text-[#89ddff]">(</span><span className="text-[#82aaff]">query</span><span className="text-[#89ddff]">)</span><span className="text-[#636380]">;</span></>,
    <><span className="text-[#636380]">{"// ✓ ZK proof verified — badge unlocked"}</span></>,
  ];

  // Typing animation loop
  useEffect(() => {
    let line = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const typeLine = () => {
      line++;
      setTypedLines(line);
      if (line < codeLines.length) {
        timeout = setTimeout(typeLine, 100 + Math.random() * 120);
      } else {
        timeout = setTimeout(() => {
          line = 0;
          setTypedLines(0);
          timeout = setTimeout(typeLine, 600);
        }, 4000);
      }
    };
    timeout = setTimeout(typeLine, 800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !sectionRef.current ||
        !cardRef.current ||
        !overlayRef.current ||
        !lockRef.current ||
        !sqlRef.current ||
        !textRef.current
      )
        return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: "bottom bottom",
          end: "+=2800",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Phase 0: Dead zone (0% → 10%)

      // Phase 1: SQL panel slides in (10% → 22%)
      tl.fromTo(
        sqlRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 0.12 },
        0.10
      );

      // Phase 2: Hold SQL visible (22% → 42%)

      // Phase 3: SQL fades out (42% → 52%)
      tl.to(sqlRef.current, { opacity: 0, x: -40, duration: 0.10 }, 0.42);

      // Phase 4: Badge spins, lock fades, overlay fades — badge revealed
      tl.to(
        cardRef.current,
        { rotateY: 360, duration: 0.23, ease: "power2.inOut" },
        0.52
      );
      tl.to(lockRef.current, { opacity: 0, scale: 0.5, duration: 0.06 }, 0.54);
      tl.to(overlayRef.current, { opacity: 0, duration: 0.08 }, 0.55);

      // Phase 5: Featured card text slides in (72% → 87%)
      tl.fromTo(
        textRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.15 },
        0.72
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf([
        cardRef.current,
        overlayRef.current,
        lockRef.current,
        sqlRef.current,
        textRef.current,
      ]);
    };
  }, []);

  return (
    <section ref={sectionRef}>
      <div
        ref={pinWrapRef}
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-28"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3 block">
              Your Collection Awaits
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Collect your Block Badges
              <br />
              <span className="gradient-text">and flex on your friends.</span>
            </h2>
          </motion.div>

          {/* Card + Side panels layout */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
            {/* Left — Large card with 3D flip */}
            <div className="relative flex-shrink-0 lg:ml-20" style={{ perspective: "1200px" }}>
              {/* Sparkles around the card */}
              <Sparkle className="absolute -top-8 -left-6 z-20" size={36} delay={0} />
              <Sparkle className="absolute -top-4 right-10 z-20" size={28} delay={0.5} />
              <Sparkle className="absolute top-1/4 -right-10 z-20" size={40} delay={1.0} />
              <Sparkle className="absolute bottom-20 -left-8 z-20" size={32} delay={1.5} />
              <Sparkle className="absolute -bottom-4 right-4 z-20" size={24} delay={2.0} />
              <Sparkle className="absolute top-1/2 -left-12 z-20" size={30} delay={0.8} />

              {/* Ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-orange/[0.08] rounded-full blur-[80px] pointer-events-none" />

{/* Badge 3D flip — front / edge / back */}
              <div
                ref={cardRef}
                className="relative z-[1] w-[420px] sm:w-[500px] md:w-[560px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ── Front face ── */}
                <div style={{ backfaceVisibility: "hidden" }}>
                  <Image
                    src="/badges/validator.png"
                    alt="ETH Validator"
                    width={560}
                    height={560}
                    className="w-full h-auto object-contain"
                    style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 10px 24px rgba(96,165,250,0.25))" }}
                    priority
                  />
                  {/* Shine streak */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      WebkitMaskImage: "url(/badges/validator.png)",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage: "url(/badges/validator.png)",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  >
                    <div
                      className="absolute top-[-20%] bottom-[-20%] badge-shine-streak"
                      style={{
                        width: "25%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.12) 80%, transparent)",
                        transform: "skewX(-15deg)",
                      }}
                    />
                  </div>
                  {/* Dark overlay — masked to badge shape, fades out on scroll */}
                  <div
                    ref={overlayRef}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    style={{
                      WebkitMaskImage: "url(/badges/validator.png)",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage: "url(/badges/validator.png)",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      background: "radial-gradient(ellipse at center, rgba(6,6,17,0.97) 0%, rgba(6,6,17,0.92) 100%)",
                    }}
                  >
                    <div
                      ref={lockRef}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-zinc-500" />
                      </div>
                      <span className="text-sm text-zinc-500 font-medium">
                        Verify to unlock
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Edge layers — gives coin-like thickness ── */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={`edge-${i}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transform: `translateZ(${-i}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Image
                      src="/badges/validator.png"
                      alt=""
                      width={560}
                      height={560}
                      className="w-full h-auto object-contain"
                      style={{
                        filter: "brightness(0.15) drop-shadow(0 0 1px rgba(120,120,140,0.4))",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))}

                {/* ── Back face ── */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg) translateZ(7px)",
                  }}
                >
                  <Image
                    src="/badges/badge_back.png"
                    alt="Block Badges"
                    width={560}
                    height={560}
                    className="w-full h-auto object-contain"
                    style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.8))" }}
                  />
                </div>
              </div>
            </div>

            {/* Right — SQL panel (shows first) then Featured card text (shows after spin) */}
            <div className="relative max-w-xl w-full min-h-[520px] lg:-translate-y-8 lg:-translate-x-20">
              {/* SQL verification panel */}
              <div
                ref={sqlRef}
                className="absolute inset-0"
                style={{ opacity: 0 }}
              >
                <Sparkle className="absolute -top-8 right-4" size={26} delay={0.2} />
                <Sparkle className="absolute top-1/3 -right-6" size={30} delay={1.0} />
                <Sparkle className="absolute -bottom-4 left-8" size={22} delay={1.6} />
                <Sparkle className="absolute bottom-1/4 -right-10" size={34} delay={0.7} />

                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent-orange mb-4 px-3 py-1 rounded-full border border-accent-orange/20 bg-accent-orange/5">
                  Proof of SQL
                </span>
                <h3 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-[1.1]">
                  Verified by
                  <br />
                  <span className="gradient-text">Zero-Knowledge Proof</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-6 text-lg">
                  Each badge is unlocked by a ZK-verified SQL query through the
                  SxT Proof of SQL SDK. The cryptographic proof guarantees the query
                  ran correctly against untampered blockchain data.
                </p>

                {/* Glassmorphic dark mode IDE */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(13, 13, 24, 0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    boxShadow:
                      "0 24px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                    transform: "perspective(1200px) rotateY(-1deg) rotateX(1deg)",
                  }}
                >
                  {/* Title bar */}
                  <div
                    className="flex items-center justify-between px-5 py-3 border-b"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                      background: "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono tracking-wide">
                      Space and Time
                    </span>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logos/sxt.svg"
                        alt="SxT"
                        width={60}
                        height={16}
                        className="h-3.5 w-auto object-contain opacity-25"
                      />
                    </div>
                  </div>

                  {/* File tab */}
                  <div
                    className="px-4 py-1.5 border-b"
                    style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                  >
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono text-zinc-400 rounded-md"
                      style={{ background: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <span className="text-yellow-500/80">js</span> verify_badge.js
                    </span>
                  </div>

                  {/* Code body with line numbers + typing animation */}
                  <div className="flex font-mono text-[12.5px] leading-[1.9]">
                    {/* Line numbers */}
                    <div
                      className="py-5 pl-4 pr-3 text-right select-none flex-shrink-0"
                      style={{ color: "rgba(255, 255, 255, 0.15)" }}
                    >
                      {codeLines.map((_, i) => (
                        <div key={i} style={{ opacity: i < typedLines ? 0.6 : 0.15, transition: "opacity 0.15s" }}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {/* Separator */}
                    <div className="w-px my-3 flex-shrink-0" style={{ background: "rgba(255, 255, 255, 0.06)" }} />
                    {/* Code with typing */}
                    <div className="py-5 pl-4 pr-5 overflow-x-auto flex-1">
                      {codeLines.map((line, i) => (
                        <div
                          key={i}
                          style={{
                            opacity: i < typedLines ? 1 : 0,
                            transition: "opacity 0.12s ease",
                          }}
                        >
                          {line || <>&nbsp;</>}
                          {i === typedLines - 1 && (
                            <span
                              className="inline-block w-[2px] h-[1.1em] bg-zinc-400 ml-0.5 align-middle"
                              style={{ animation: "cursor-blink 1s step-end infinite" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status bar */}
                  <div
                    className="flex items-center justify-between px-5 py-2.5 border-t"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                      background: "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
                      <span className="text-[11px] text-zinc-500 font-mono">
                        ZK proof verified &middot; badge unlocked
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      Proof of SQL &middot; Space and Time
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured card description (appears after spin) */}
              <div ref={textRef} className="absolute inset-0" style={{ opacity: 0 }}>
                <Sparkle className="absolute -top-10 right-0" size={26} delay={0.3} />
                <Sparkle className="absolute top-1/3 -right-8" size={34} delay={1.2} />
                <Sparkle className="absolute bottom-10 -left-6" size={22} delay={1.8} />
                <Sparkle className="absolute -bottom-6 right-1/3" size={28} delay={2.4} />

                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent-orange mb-4 px-3 py-1 rounded-full border border-accent-orange/20 bg-accent-orange/5">
                  Featured Badge
                </span>
                <h3 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-[1.1]">
                  ETH Validator
                  <br />
                  <span className="gradient-text">Badge Unlocked</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                  The backbone of Ethereum. This badge proves you secured the network —
                  staking 32 ETH, validating blocks, and earning rewards while keeping
                  the chain alive. ZK-verified through Proof of SQL.
                </p>
                {/* ZK confirmation snippet */}
                <div
                  className="mb-8 rounded-xl overflow-hidden font-mono text-[11px] leading-[1.8]"
                  style={{
                    background: "rgba(13, 13, 24, 0.8)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="px-4 py-3">
                    <div><span className="text-green-400">&#10003;</span> <span className="text-zinc-500">Query verified by</span> <span className="text-[#ffcb6b]">Space and Time</span> <span className="text-zinc-500">ZK Proof of SQL</span></div>
                    <div><span className="text-green-400">&#10003;</span> <span className="text-zinc-500">Cryptographic proof:</span> <span className="text-[#c3e88d]">0x8f3a...c7d1</span></div>
                    <div><span className="text-green-400">&#10003;</span> <span className="text-zinc-500">Badge minted to</span> <span className="text-[#82aaff]">0x7a16ff...f3d2</span></div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10 mb-8" />

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    Ethereum Mainnet
                  </span>
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange">
                    Legendary
                  </span>
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    ZK Verified
                  </span>
                </div>
                <div className="flex items-center gap-8 text-sm text-zinc-500">
                  <div>
                    <span className="text-2xl font-bold text-white block">847</span>
                    Holders
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <span className="text-2xl font-bold text-white block">Top 5%</span>
                    Rarity
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <span className="text-2xl font-bold text-white block">100</span>
                    Points
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
