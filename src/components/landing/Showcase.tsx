"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const rowOneCards = [
  { src: "/cards/gas_guzzler.png", badge: "/badges/gas_guzzler.png", name: "Gas Guzzler" },
  { src: "/cards/multi-chain.png", badge: "/badges/multichain_madness.png", name: "Multichain Maximalist" },
  { src: "/cards/nft_flipper (2).png", badge: "/badges/nft_flipper.png", name: "NFT Flipper" },
  { src: "/cards/opensea (2).png", badge: "/badges/opensea_badge.png", name: "Opensea VIP" },
  { src: "/cards/art_blocks.png", badge: "/badges/art_collector.png", name: "Fine Art Collector" },
  { src: "/cards/card_01.png", badge: "/badges/liquidated.png", name: "Liquidated" },
  { src: "/cards/memecoin.png", badge: "/badges/memecoiner.png", name: "The Memecoiner" },
  { src: "/cards/base_bull.png", badge: "/badges/base_bull.png", name: "Base Bull" },
  { src: "/cards/diamond_hands.png", badge: "/badges/diamond_hands.png", name: "Diamond Hands" },
  { src: "/cards/2.png", badge: "/badges/vallager.png", name: "Ethereum Villager" },
  { src: "/cards/8.png", badge: "/badges/sandwichd.png", name: "Sandwich'd" },
  { src: "/cards/base_builder_card.png", badge: "/badges/base_builder.png", name: "Base Builder" },
  { src: "/cards/10.png", badge: "/badges/bullseye.png", name: "Bullseye" },
];

const rowTwoCards = [
  { src: "/cards/card_02.png", badge: "/badges/rookie_predictor.png", name: "Rookie Predictor" },
  { src: "/cards/card_03.png", badge: "/badges/happy_lending.png", name: "Happy Lending" },
  { src: "/cards/etherean (2).png", badge: "/badges/etheran.png", name: "The Etherean" },
  { src: "/cards/emn_rug.png", badge: "/badges/rug_victi.png", name: "Rug Victim" },
  { src: "/cards/nft_20k.png", badge: "/badges/nft_upper_class.png", name: "NFT Upper Class" },
  { src: "/cards/eth_steak.png", badge: "/badges/validator.png", name: "The Validator" },
  { src: "/cards/avax_bull.jpg", badge: "/badges/avax_bull.png", name: "AVAX Bull" },
  { src: "/cards/whale_activity.png", badge: "/badges/whale_activity.png", name: "Whale Activity" },
  { src: "/cards/3.png", badge: "/badges/contributor.png", name: "The Contributor" },
  { src: "/cards/9.png", badge: "/badges/data_wrangler.png", name: "Data Wrangler" },
  { src: "/cards/11.png", badge: "/badges/squiggler.png", name: "Squiggler" },
];

function CardItem({ card }: { card: { src: string; badge: string; name: string } }) {
  return (
    <div className="flex-shrink-0 group cursor-pointer">
      <div className="relative w-[300px] sm:w-[320px] transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-105">
        {/* Dimmed & blurred card background */}
        <div className="card-3d overflow-hidden">
          <Image
            src={card.src}
            alt={card.name}
            width={320}
            height={448}
            className="w-full h-auto object-cover opacity-[0.22] blur-[3px] scale-105"
          />
        </div>

        {/* Badge overlay — centered, with shimmer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[110%] h-auto">
            <Image
              src={card.badge}
              alt={`${card.name} badge`}
              width={320}
              height={320}
              className="w-full h-auto object-contain drop-shadow-[0_0_28px_rgba(249,115,22,0.3)] group-hover:drop-shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all duration-300 group-hover:scale-110"
            />
            {/* Shimmer shine across badge */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div className="shimmer absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Name label at bottom */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center z-10">
          <span className="text-[11px] font-bold text-white/80 tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm group-hover:bg-accent-orange/10 group-hover:border-accent-orange/20 group-hover:text-white transition-all duration-300">
            {card.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Showcase() {
  /* Triple the arrays so the strip is wide enough to never show a gap
     during the 50% translate loop */
  const r1 = [...rowOneCards, ...rowOneCards, ...rowOneCards];
  const r2 = [...rowTwoCards, ...rowTwoCards, ...rowTwoCards];

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

      {/* Row 1 — scrolls left, seamless loop */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 showcase-loop-left">
          {r1.map((card, i) => (
            <CardItem key={`r1-${i}`} card={card} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right, seamless loop */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 showcase-loop-right">
          {r2.map((card, i) => (
            <CardItem key={`r2-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
