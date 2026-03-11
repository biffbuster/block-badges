"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Sparkles, Mail, KeyRound, User, Database, Lock as LockIcon, Zap, Globe } from "lucide-react";

/* ─── Sparkle animation ─── */
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
        fill="url(#hiw-sparkle)"
      />
      <defs>
        <radialGradient id="hiw-sparkle">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════
   Step 1 Visual — Sign In / Create Account
   ═══════════════════════════════════════════════ */
function Step1Visual() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-orange-500/[0.07] rounded-full blur-3xl" />

      {/* Sign-in card graphic */}
      <div
        className="relative w-[160px] rounded-xl p-3.5 space-y-2"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(249,115,22,0.12)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(249,115,22,0.06)",
        }}
      >
        {/* Avatar */}
        <div className="flex justify-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(249,115,22,0.12)", border: "1.5px solid rgba(249,115,22,0.25)" }}
          >
            <User className="w-3.5 h-3.5 text-accent-orange" />
          </div>
        </div>
        <div className="text-center text-[10px] font-bold text-white">Sign In</div>
        <div className="text-center text-[8px] text-zinc-600 -mt-1.5">or create an account</div>

        {/* Email mock */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Mail className="w-2.5 h-2.5 text-zinc-600" />
          <span className="text-[8px] text-zinc-600">you@email.com</span>
        </div>

        {/* Button */}
        <div className="px-2 py-1 rounded-md bg-gradient-to-r from-accent-orange to-accent-amber text-white text-[9px] font-bold text-center">
          Continue
        </div>

        {/* Divider */}
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <span className="text-[7px] text-zinc-600">or</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        {/* Social row */}
        <div className="flex items-center justify-center gap-1.5">
          {[
            { label: "G", color: "#ea4335" },
            { label: "X", color: "#1d9bf0" },
            { label: "key", color: "#f97316" },
          ].map((opt) => (
            <div
              key={opt.label}
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: `${opt.color}10`, border: `1px solid ${opt.color}20` }}
            >
              {opt.label === "key" ? (
                <KeyRound className="w-2.5 h-2.5" style={{ color: opt.color }} />
              ) : (
                <span className="text-[8px] font-bold" style={{ color: opt.color }}>{opt.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 2 Visual — Card with Run button
   ═══════════════════════════════════════════════ */
function Step2Visual() {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/[0.08] rounded-full blur-3xl" />

      <div className="relative">
        {/* Badge (locked) */}
        <motion.div
          animate={{ rotate: -3 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-[150px] relative"
        >
          <Image
            src="/badges/gas_guzzler.png"
            alt="Gas Guzzler"
            width={150}
            height={150}
            className="w-full h-auto object-contain"
            style={{ filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 30px rgba(59,130,246,0.08))" }}
          />
          {/* Lock overlay — masked to badge shape */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              WebkitMaskImage: "url(/badges/gas_guzzler.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url(/badges/gas_guzzler.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              background: "radial-gradient(ellipse at center, rgba(6,6,17,0.95) 0%, rgba(6,6,17,0.88) 100%)",
            }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <LockIcon className="w-5 h-5 text-zinc-500" />
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Locked</span>
            </div>
          </div>
        </motion.div>

        {/* Run button */}
        <motion.div
          className="absolute -right-12 top-1/2 -translate-y-1/2"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "0 0 20px rgba(59,130,246,0.25), 0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Run
          </div>
          <div className="absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2 w-3 h-[2px] bg-blue-500/30" />
        </motion.div>

        {/* SQL hint */}
        <div
          className="absolute -left-4 -bottom-3 text-[8px] font-mono px-2 py-1 rounded-md"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.12)", color: "#60a5fa" }}
        >
          SELECT * FROM ...
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 3 Visual — ZK SQL terminal
   ═══════════════════════════════════════════════ */
function Step3Visual() {
  const lines = [
    { text: "sxt query --verify", color: "#a855f7" },
    { text: '  "SELECT COUNT(*)', color: "#4ade80" },
    { text: "   FROM ETH.TXS", color: "#4ade80" },
    { text: "   WHERE ADDR = $1\"", color: "#4ade80" },
    { text: "", color: "" },
    { text: "ZK-SNARK generating...", color: "#f59e0b" },
    { text: "Proof verified \u2713", color: "#22c55e" },
  ];

  return (
    <div className="relative flex items-center justify-center h-full px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-purple-500/[0.07] rounded-full blur-3xl" />

      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: "#0a0a1a", border: "1px solid rgba(168,85,247,0.12)", boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 25px rgba(168,85,247,0.06)" }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="text-[8px] text-zinc-600 ml-1 font-mono">sxt-terminal</span>
        </div>
        <div className="p-3 font-mono text-[10px] leading-relaxed space-y-0.5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12 }}
            >
              {line.text ? (
                <span style={{ color: line.color }}>{line.text}</span>
              ) : (
                <span>&nbsp;</span>
              )}
            </motion.div>
          ))}
          <motion.span
            className="inline-block w-1.5 h-3 bg-purple-400/70 ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 4 Visual — Badge card with sparkles & glow
   ═══════════════════════════════════════════════ */
function Step4Visual() {
  return (
    <div className="relative flex items-center justify-center h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-green-500/[0.06] rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-accent-amber/[0.08] rounded-full blur-2xl" />

      <Sparkle className="absolute top-6 right-6" size={22} delay={0} />
      <Sparkle className="absolute top-12 left-5" size={18} delay={0.5} />
      <Sparkle className="absolute bottom-8 right-8" size={26} delay={1.0} />
      <Sparkle className="absolute bottom-14 left-6" size={16} delay={1.5} />
      <Sparkle className="absolute top-1/3 right-3" size={20} delay={0.8} />

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Light beam */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          style={{
            width: "200px",
            height: "280px",
            background: "linear-gradient(to top, rgba(34,197,94,0.12) 0%, rgba(249,115,22,0.06) 40%, transparent 80%)",
            filter: "blur(20px)",
          }}
        />

        <div className="w-[150px] relative">
          <Image
            src="/badges/happy_lending.png"
            alt="Happy Lending"
            width={150}
            height={150}
            className="w-full h-auto object-contain"
            style={{ filter: "drop-shadow(0 0 40px rgba(34,197,94,0.12)) drop-shadow(0 16px 48px rgba(0,0,0,0.5))" }}
          />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", boxShadow: "0 0 12px rgba(34,197,94,0.2)" }}
        >
          <Sparkles className="w-3 h-3 text-green-400" />
          <span className="text-[10px] font-bold text-green-400">Unlocked</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Step config ─── */
const stepVisuals = [Step1Visual, Step2Visual, Step3Visual, Step4Visual];

const stepData = [
  {
    step: "01",
    title: "Sign In or Create Account",
    color: "#f97316",
    description: "Sign in via email, social, or wallet. Read-only — we never request keys or permissions.",
  },
  {
    step: "02",
    title: "Select & Run ZK SQL",
    color: "#3b82f6",
    description: "Pick an achievement card and run a verified SQL query against 100 TB+ of indexed blockchain data.",
  },
  {
    step: "03",
    title: "Proof of SQL Verification",
    color: "#a855f7",
    description: "A ZK-SNARK proof is generated proving the data and SQL logic are correct — trustlessly.",
  },
  {
    step: "04",
    title: "Unlock Your Badge",
    color: "#22c55e",
    description: "If you qualify, your collectible card is unlocked — backed by cryptographic proof.",
  },
];

/* ─── Main component ─── */
export default function HowItWorks({ showOverview = true }: { showOverview?: boolean }) {
  return (
    <section id="how-it-works" className="relative pt-6 sm:pt-8 pb-28 sm:pb-36 px-6 overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-accent-orange/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ─── Cloud banner ─── */}
        {showOverview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-hidden rounded-2xl mb-16 sm:mb-20 border border-white/[0.06]"
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
                <h2 className="font-display text-2xl sm:text-3xl text-white mb-2 tracking-tight">
                  Block Badges
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                  ZK-verified onchain achievement cards powered by Space and Time. Prove what your wallet did with cryptographic proof, not screenshots.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs">
                  <span className="text-emerald-400/80">&#10003;</span>
                  <span className="text-zinc-300">Proof of SQL</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs">
                  <span className="text-blue-400/80">&#9671;</span>
                  <span className="text-zinc-300">Base Mainnet</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs">
                  <span className="text-amber-400/80">&#9733;</span>
                  <span className="text-zinc-300">Soulbound</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Block Badge overview / mission ─── */}
        {showOverview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20 sm:mb-28"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              <span className="gradient-text">Overview</span>
            </h2>

            <div className="max-w-3xl mx-auto space-y-5 text-zinc-400 text-base sm:text-lg leading-relaxed">
              <p>
                Block Badges turns your raw onchain history into collectible, verifiable achievement cards.
                Every badge is backed by a ZK SQL query that runs against real blockchain data indexed
                by <span className="text-white font-medium">Space and Time</span>. No screenshots. No
                self-reported stats. Just cold, hard, cryptographically proven facts about what your
                wallet actually did.
              </p>
              <p>
                The whole thing lives on <span className="text-white font-medium">Base</span>. You pick a badge,
                hit verify, and a Proof of SQL query fires off against SXT&apos;s indexed chain data. The result
                comes back with a ZK-SNARK attached, so nobody can fake it, edit it, or argue about it. If the
                proof checks out, your badge gets minted as a soulbound token straight to your wallet.
              </p>
              <p>
                Think of it like onchain credential flexing, except every flex is mathematically verified. Held
                100 ETH? Prove it. Survived three bear markets? There&apos;s a badge for that. Spent a small fortune
                on gas? Yeah, we track that too. Your wallet tells a story and Block Badges lets you collect the
                highlights.
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── Section header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-amber mb-3 block">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-5">
            Trustless Verification,{" "}
            <span className="gradient-text">One Click</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed">
            Block Badges uses Space and Time&apos;s Proof of SQL, a ZK-SNARK protocol that
            cryptographically proves query results are correct and untampered.
          </p>
        </motion.div>

        {/* ─── 4 Step cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepData.map((step, i) => {
            const Visual = stepVisuals[i];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12 }}
                className="group flex flex-col"
              >
                {/* ── Step label + title ABOVE the card ── */}
                <div className="mb-3 px-1">
                  <span
                    className="font-display text-2xl sm:text-3xl block"
                    style={{ color: step.color }}
                  >
                    Step {step.step}
                  </span>
                  <h3 className="text-[15px] font-bold text-white leading-snug mt-1">
                    {step.title}
                  </h3>
                </div>

                {/* ── Glass card with visual only ── */}
                <div
                  className="relative rounded-3xl overflow-hidden flex-shrink-0"
                  style={{
                    background: "rgba(12, 12, 30, 0.5)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid ${step.color}12`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${step.color}12 0%, transparent 70%)` }}
                  />
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}40, transparent)`,
                      boxShadow: `0 0 10px ${step.color}20`,
                    }}
                  />
                  {/* Shimmer */}
                  <div className="absolute inset-0 rounded-3xl shimmer opacity-10 pointer-events-none" />

                  {/* Visual area */}
                  <div
                    className="relative h-[300px] overflow-hidden"
                    style={{
                      background: `radial-gradient(ellipse at 50% 70%, ${step.color}06 0%, transparent 70%)`,
                    }}
                  >
                    <Visual />
                  </div>
                </div>

                {/* ── Description BELOW the card ── */}
                <div className="pt-4 px-1">
                  <p className="text-[12px] text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Video section with description ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-24"
        >
          {/* Small description above video */}
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl sm:text-3xl text-white mb-3">
              See It <span className="gradient-text">In Action</span>
            </h3>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Watch how Block Badges verifies your onchain achievements in real time
              using Space and Time&apos;s Proof of SQL.
            </p>
          </div>

          {/* Glass video container */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(12, 12, 30, 0.5)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-orange/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-accent-blue/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl shimmer opacity-20 pointer-events-none" />

            <div className="p-2 sm:p-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://pub-622badb2718449348539acc019fd4887.r2.dev/block_badge_demo.mov" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Proof of SQL explainer ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-28 sm:mt-36"
        >
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-amber mb-3 block">
              The Tech Behind It
            </span>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-5">
              What Is <span className="gradient-text">Proof of SQL</span>?
            </h3>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed">
              Proof of SQL is a ZK-SNARK protocol built by Space and Time. It lets anyone
              run a SQL query against blockchain data and get back a cryptographic proof that
              the result is legit. No middlemen. No trusting a server. Just math.
            </p>
          </div>

          {/* Explainer cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div
              className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(12, 12, 30, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl shimmer opacity-5 pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center mb-5">
                  <Database className="w-5 h-5 text-accent-orange" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">Indexed Chain Data</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Space and Time indexes every transaction, transfer, and event across
                  major blockchains like Ethereum, Base, Polygon, Bitcoin, and more.
                  All that data sits in tamper-proof tables, ready to be queried.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(12, 12, 30, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl shimmer opacity-5 pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <LockIcon className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">ZK-SNARK Proof</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  When you run a query, Proof of SQL generates a zero-knowledge proof
                  alongside the result. This proof mathematically guarantees the data
                  wasn&apos;t tampered with, fabricated, or cherry-picked. What you see is
                  what actually happened onchain.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(12, 12, 30, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl shimmer opacity-5 pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">Verified On Base</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  The proof gets verified on Base mainnet through SXT&apos;s Query Router
                  smart contract. If the math checks out, your badge is minted as a
                  soulbound token straight to your wallet. Fully trustless, fully onchain,
                  no one can dispute it.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Globe className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">
                Powered by{" "}
                <a
                  href="https://spaceandtime.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Space and Time
                </a>
                {" "}&middot; Supporting 10+ blockchains &middot; Sub-second ZK proofs
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
