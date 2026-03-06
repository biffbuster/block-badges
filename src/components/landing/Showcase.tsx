"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const rowOneCards = [
  { src: "/cards/gas_guzzler.png", name: "Gas Guzzler" },
  { src: "/cards/multi-chain.png", name: "Multichain Maximalist" },
  { src: "/cards/nft_flipper (2).png", name: "NFT Flipper" },
  { src: "/cards/opensea (2).png", name: "Opensea VIP" },
  { src: "/cards/art_blocks.png", name: "Fine Art Collector" },
  { src: "/cards/card_01.png", name: "Liquidated" },
  { src: "/cards/memecoin.png", name: "The Memecoiner" },
  { src: "/cards/base_bull.png", name: "Base Bull" },
  { src: "/cards/diamond_hands.png", name: "Diamond Hands" },
  { src: "/cards/2.png", name: "Ethereum Villager" },
  { src: "/cards/8.png", name: "Sandwich'd" },
  { src: "/cards/base_builder_card.png", name: "Base Builder" },
  { src: "/cards/10.png", name: "Bullseye" },
];

const rowTwoCards = [
  { src: "/cards/card_02.png", name: "Rookie Predictor" },
  { src: "/cards/card_03.png", name: "Happy Lending" },
  { src: "/cards/etherean (2).png", name: "The Etherean" },
  { src: "/cards/emn_rug.png", name: "Rug Victim" },
  { src: "/cards/nft_20k.png", name: "NFT Upper Class" },
  { src: "/cards/eth_steak.png", name: "The Validator" },
  { src: "/cards/avax_bull.jpg", name: "AVAX Bull" },
  { src: "/cards/whale_activity.png", name: "Whale Activity" },
  { src: "/cards/3.png", name: "The Contributor" },
  { src: "/cards/9.png", name: "Data Wrangler" },
  { src: "/cards/11.png", name: "Squiggler" },
];

function CardItem({ card }: { card: { src: string; name: string } }) {
  return (
    <div className="flex-shrink-0 group cursor-pointer">
      <div className="card-3d w-[300px] sm:w-[320px] transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_8px_32px_rgba(249,115,22,0.15),0_16px_48px_rgba(0,0,0,0.5)]">
        <Image
          src={card.src}
          alt={card.name}
          width={320}
          height={448}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}

export default function Showcase() {
  return (
    <section id="showcase" className="relative py-36 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3 block">
            The Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Browse the Deck
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Every card is a ZK-verified trophy backed by Proof of SQL.
            Gotta catch &apos;em all.
          </p>
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-6">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-showcase-left">
          {[...rowOneCards, ...rowOneCards].map((card, i) => (
            <CardItem key={`r1-${i}`} card={card} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-showcase-right">
          {[...rowTwoCards, ...rowTwoCards].map((card, i) => (
            <CardItem key={`r2-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
