"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does ChainTitles verify achievements?",
    answer:
      "Each achievement maps to a SQL query run against Space and Time's indexed blockchain data (100+ TB across 10 chains). The query result comes with a Proof of SQL — a ZK-SNARK that cryptographically proves both that the data wasn\u2019t tampered with and that the SQL executed correctly. Verification happens locally in your browser via WASM.",
  },
  {
    question: "What is Proof of SQL and why does it matter?",
    answer:
      "Proof of SQL is Space and Time's sub-second ZK proof system. Unlike traditional APIs where you trust the server, a single Proof of SQL simultaneously verifies data integrity (untampered tables) and computational correctness (correct SQL execution). This means your badges are cryptographic attestations, not just cosmetic claims.",
  },
  {
    question: "Is my wallet address stored or shared?",
    answer:
      "No. Your wallet address is only used server-side in the SQL query to check your onchain activity. We don't store wallet addresses or any personal data. The query runs, the proof is verified, and the result is returned — that's it.",
  },
  {
    question: "Can I mint my achievements as NFTs?",
    answer:
      "Coming soon. Space and Time has on-chain verifier contracts deployed on Ethereum mainnet that can verify Proof of SQL results for less than 150k gas. This means your badges can become fully on-chain NFTs with built-in ZK verification.",
  },
  {
    question: "What blockchains are supported?",
    answer:
      "SXT indexes data from Ethereum, Bitcoin, Polygon, Base, Arbitrum, Optimism, ZKsync Era, Avalanche, Sui, and Aptos — all from genesis block to real-time finality. Most achievements currently target Ethereum, with multi-chain badges in development.",
  },
  {
    question: "How are new achievements added?",
    answer:
      "Each achievement is a SQL query template. Adding a new one is as simple as writing a new SQL query against SXT\u2019s indexed tables. SXT\u2019s Smart Contract Indexing (SCI) automatically decodes events from any verified contract, so we can create achievements for any protocol.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-semibold text-white group-hover:text-accent-orange transition-colors pr-4">
          {faq.question}
        </span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-accent-orange/30 transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 text-accent-orange" />
          ) : (
            <Plus className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-400 leading-relaxed pb-5 pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-amber mb-3 block">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white">
            Got Questions?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="glass rounded-2xl px-6 sm:px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
