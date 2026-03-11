"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCheckAchievement } from "@/hooks/useCheckAchievement";
import { useMintBadge } from "@/hooks/useMintBadge";
import { useVerifyBadgeOnChain, type VerifyStep } from "@/hooks/useVerifyBadgeOnChain";
import { formatEther } from "viem";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Trophy,
  Clock,
  ExternalLink,
  Gem,
  Wallet,
  Database,
  Fingerprint,
  Layers,
} from "lucide-react";

/* ─── Card data (synced with achievements page) ─── */
const allCards = [
  {
    id: "etherean",
    achievementId: "diamond-hands",
    name: "The Etherean",
    description: "A true Ethereum native. Present since the early days, weathering every fork and every bear market.",
    lore: "They were there when the genesis block was forged — watching the world computer flicker to life in a dimly lit chatroom. Through The DAO hack, through the ice age, through the merge itself. While others fled to faster chains, this wallet never wavered. The Etherean doesn't chase trends. They are the trend.",
    image: "/cards/etherean (2).png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 300,
    glowColor: "#60a5fa",
    tier: "Intermediate",
  },
  {
    id: "gas-guzzler",
    achievementId: "gas-guzzler",
    name: "Gas Guzzler",
    description: "Spent over 10 ETH in total gas fees. A true power user who never hesitates to transact.",
    lore: "While others waited for gas to drop, this wallet hit send anyway. 200 gwei? Ship it. 500 gwei during an NFT mint? Barely flinched. Over 10 ETH burned to the void — a monument to urgency, impatience, and the belief that time is always more expensive than gas.",
    image: "/cards/gas_guzzler.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 300,
    glowColor: "#f97316",
    tier: "Intermediate",
  },
  {
    id: "nft-flipper",
    achievementId: "nft-collector",
    name: "NFT Flipper",
    description: "Bought and sold 50+ NFTs across marketplaces. Always hunting the next 10x.",
    lore: "Floor price alerts at 3am. Sniping bots on standby. This wallet moves through NFT markets like a shark through shallow water — always circling, always watching the charts. 50+ flips and counting. Some were rugs. Most were profit. All were a rush.",
    image: "/cards/nft_flipper (2).png",
    category: "NFT",
    chain: "Ethereum",
    points: 300,
    glowColor: "#8b5cf6",
    tier: "Intermediate",
  },
  {
    id: "multichain",
    achievementId: "multichain-explorer",
    name: "Multichain Maximalist",
    description: "Active on 3+ different chains. A true cross-chain explorer bridging every ecosystem.",
    lore: "One chain was never enough. They bridged to Polygon on a Tuesday, aped into Avalanche by Thursday, and was farming on Arbitrum before the weekend. Three chains, three cultures, one wallet address cutting across every ecosystem like a digital nomad with no home and every home.",
    image: "/cards/multi-chain.png",
    category: "Multi",
    chain: "Multi",
    points: 500,
    glowColor: "#60a5fa",
    tier: "Hard",
  },
  {
    id: "opensea",
    achievementId: "nft-collector",
    name: "Opensea VIP",
    description: "Top-tier OpenSea trader. Bought an NFT before 2021.",
    lore: "The OpenSea activity feed tells the story — a blur of bids, listings, and last-second snipes. This wallet has seen collections moon and rug in the same hour. The blue checkmark crowd knows this address. The whales nod when it enters a collection.",
    image: "/cards/opensea (2).png",
    category: "NFT",
    chain: "Ethereum",
    points: 500,
    glowColor: "#22d3ee",
    tier: "Hard",
  },
  {
    id: "art-blocks",
    achievementId: "nft-collector",
    name: "Fine Art Collector",
    description: "Hold 3 or more Art Blocks items in your wallet.",
    lore: "When the mint went live, this wallet was already there — refreshing, waiting for that one perfect output. Not every mint is a Fidenza, but every mint is a gamble on beauty. Generative art isn't collected; it's discovered. And this collector has an eye that algorithms envy.",
    image: "/cards/art_blocks.png",
    category: "NFT",
    chain: "Ethereum",
    points: 500,
    glowColor: "#4ade80",
    tier: "Hard",
  },
  {
    id: "liquidated",
    achievementId: "defi-degen",
    name: "Liquidated",
    description: "Get liquidated at least once. A rite of passage in DeFi.",
    lore: "The health factor hit zero and the liquidation bots didn't hesitate. In seconds, collateral was seized, positions unwound, and the notification pinged like a death knell. But this wallet didn't quit. It re-deposited, re-leveraged, and came back swinging. Getting liquidated isn't a failure — it's a graduation ceremony.",
    image: "/cards/card_01.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 300,
    glowColor: "#ef4444",
    tier: "Intermediate",
  },
  {
    id: "rookie-predictor",
    achievementId: "defi-degen",
    name: "Rookie Predictor",
    description: "Place one wager on Polymarket. Every oracle starts somewhere.",
    lore: "The first prediction is always the hardest — not because of the odds, but because of the commitment. This wallet stepped into Polymarket, read the spreads, and put skin in the game. Right or wrong, the act of predicting onchain is a declaration: the future is worth betting on.",
    image: "/cards/card_02.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 100,
    glowColor: "#4ade80",
    tier: "Beginner",
  },
  {
    id: "happy-lending",
    achievementId: "defi-degen",
    name: "Happy Lending",
    description: "Lend at least 1 ETH on Aave. Making your assets work while you sleep.",
    lore: "While degens chased 10,000% APY farms, this wallet chose the steady path. 1 ETH deposited into Aave, earning yield block by block, compounding silently in the background. No rugs, no impermanent loss — just clean, honest DeFi. The lending pool welcomes patient capital.",
    image: "/cards/card_03.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 300,
    glowColor: "#c084fc",
    tier: "Intermediate",
  },
  {
    id: "rug-victim",
    achievementId: "defi-degen",
    name: "Rug Victim",
    description: "Still holding the rugged $EMN (Eminence) token. A scar that tells a story.",
    lore: "The protocol promised 10,000% APY. The smart contract had other plans. When the exploit hit, most wallets went silent forever. But not this one. It came back — scarred, wiser, and still degen enough to farm the next pool. You can't kill what the rug already tried to destroy.",
    image: "/cards/emn_rug.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 300,
    glowColor: "#3b82f6",
    tier: "Intermediate",
  },
  {
    id: "validator",
    achievementId: "diamond-hands",
    name: "The Validator",
    description: "Stake at least 1 ETH for over 365 days. Securing the network with conviction.",
    lore: "They locked their ETH before withdrawals were even guaranteed. A leap of faith into the Beacon Chain — ETH committed to securing the network, earning yield one epoch at a time. While traders chased pumps, this wallet chose patience, conviction, and compound interest.",
    image: "/cards/eth_steak.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 300,
    glowColor: "#60a5fa",
    tier: "Intermediate",
  },
  {
    id: "memecoiner",
    achievementId: "defi-degen",
    name: "The Memecoiner",
    description: "Hold $PEPE, $BOBO, $DOGE, or WIF for over 365 days. True memecoin conviction.",
    lore: "PEPE. DOGE. SHIB. BONK. And six others you've never heard of. This wallet treats Uniswap like a casino and the token list like a slot machine. Memecoins held for over a year — some to zero, some to Valhalla. The only strategy? Ape first, read the contract never.",
    image: "/cards/memecoin.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 500,
    glowColor: "#e879f9",
    tier: "Hard",
  },
  {
    id: "nft-upper-class",
    achievementId: "nft-collector",
    name: "NFT Upper Class",
    description: "Make $20K profit in one NFT trade. The upper echelon of digital collectors.",
    lore: "Twenty thousand dollars from a single flip. While most traders scratched for 0.1 ETH profits, this wallet swung for the fences and connected. Timing, taste, and a little bit of luck — the trifecta that separates the upper class from the floor sweepers. The profit is real. The flex is eternal.",
    image: "/cards/nft_20k.png",
    category: "NFT",
    chain: "Ethereum",
    points: 1000,
    glowColor: "#f59e0b",
    tier: "Legendary",
  },
  {
    id: "base-bull",
    achievementId: "defi-degen",
    name: "Base Bull",
    description: "Have at least 100 transactions on the Base chain. Average Base User.",
    lore: "Coinbase said \"come onchain\" and this wallet said \"bet.\" 100+ transactions on Base — swapping, minting, bridging, vibing. While Ethereum maxis debated L2 legitimacy, this address was already deep in the blue-pilled ecosystem, stacking transactions like they were going out of style.",
    image: "/cards/base_bull.png",
    category: "Multi",
    chain: "Base",
    points: 300,
    glowColor: "#0052FF",
    tier: "Intermediate",
  },
  {
    id: "avax-bull",
    achievementId: "defi-degen",
    name: "AVAX Bull",
    description: "Have at least 100 transactions on Avalanche C-Chain. Red coin good.",
    lore: "The red coin called and this wallet answered. 100+ transactions on the C-Chain — farming Trader Joe, bridging through the Avalanche bridge, and collecting subnets like Infinity Stones. Fast finality, low fees, and the unshakable belief that the mountain will outlast the hype.",
    image: "/cards/avax_bull.jpg",
    category: "Multi",
    chain: "Avalanche",
    points: 300,
    glowColor: "#E84142",
    tier: "Intermediate",
  },
  {
    id: "diamond-hands",
    achievementId: "diamond-hands",
    name: "Diamond Hands",
    description: "Hold 1 BTC for 3 years minimum. HODL.",
    lore: "Three years. One Bitcoin. Zero sells. Through halving cycles and regulatory FUD, through exchange collapses and Twitter panics — this wallet held. The original HODL meme wasn't a joke; it was a prophecy. And this address is living proof that patience is the ultimate alpha.",
    image: "/cards/diamond_hands.png",
    category: "Ethereum",
    chain: "Bitcoin",
    points: 800,
    glowColor: "#e2e8f0",
    tier: "Veteran",
  },
  {
    id: "whale-activity",
    achievementId: "whale-alert",
    name: "Whale Activity",
    description: "Hold at least 100 ETH. Swimming with the whales.",
    lore: "When this wallet moves, the market watches. 100+ ETH sitting in a single address — enough to shift liquidity pools and make block explorers light up. Whale Alert bots fire. Discord channels buzz. This isn't just a holder; this is a force of nature swimming in the deep end of the chain.",
    image: "/cards/whale_activity.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 1000,
    glowColor: "#38bdf8",
    tier: "Legendary",
  },
  {
    id: "ethereum-villager",
    achievementId: "ethereum-villager",
    name: "Ethereum Villager",
    description: "Exploring the Ether. Make at least 5 transactions on Ethereum mainnet.",
    lore: "Every journey begins with a single transaction. Five sends into the void — maybe a swap, a transfer, a failed mint at 3am. It doesn't matter what they were. What matters is this wallet showed up, paid the gas, and left its mark on the world computer. The village welcomes you.",
    image: "/cards/2.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 100,
    glowColor: "#60a5fa",
    tier: "Beginner",
  },
  {
    id: "the-contributor",
    achievementId: "the-contributor",
    name: "The Contributor",
    description: "Smart Contract Deployer. Deploy one contract on Ethereum mainnet.",
    lore: "While everyone else was trading, this wallet was building. A smart contract deployed to mainnet — bytecode committed to the world computer forever. Builders don't just use the chain. They become part of it.",
    image: "/cards/3.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 100,
    glowColor: "#f59e0b",
    tier: "Beginner",
  },
  {
    id: "sandwichd",
    achievementId: "defi-degen",
    name: "Sandwich'd",
    description: "Got sandwich attacked by an MEV bot. Welcome to the dark forest.",
    lore: "The swap looked clean — good price, low slippage, nothing unusual. Then the block landed and reality hit: frontrun, backrun, sandwiched. An MEV bot extracted value with surgical precision, and this wallet paid the invisible tax. But now you know. The dark forest has teeth, and you've felt them.",
    image: "/cards/8.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 100,
    glowColor: "#84cc16",
    tier: "Beginner",
  },
  {
    id: "data-wrangler",
    achievementId: "defi-degen",
    name: "Data Wrangler",
    description: "Spend at least 25 SXT to run an onchain query. A true data explorer.",
    lore: "Most people trust what the block explorer shows them. Not this wallet. It went deeper — spending SXT to run a verified onchain query through Space and Time, demanding cryptographic proof that the data is real. In a world of fake numbers and manipulated feeds, the Data Wrangler trusts math, not middlemen.",
    image: "/cards/9.png",
    category: "Multi",
    chain: "Base",
    points: 100,
    glowColor: "#a78bfa",
    tier: "Beginner",
  },
  {
    id: "bullseye",
    achievementId: "nft-collector",
    name: "Bullseye",
    description: "Sold a BAYC within 10% of its all-time high. Perfect market timing.",
    lore: "Timing the top is a myth — unless you actually do it. This wallet sold a Bored Ape within 10% of the collection's all-time high. While diamond hands held into the abyss and paper hands sold too early, this trader hit the bullseye. Luck? Skill? It doesn't matter. The chart doesn't lie.",
    image: "/cards/10.png",
    category: "NFT",
    chain: "Ethereum",
    points: 1000,
    glowColor: "#3b82f6",
    tier: "Legendary",
  },
  {
    id: "base-builder",
    achievementId: "contract-deployer",
    name: "Base Builder",
    description: "Deploy a smart contract on Base mainnet. Building the onchain future.",
    lore: "The L2 revolution needed builders, and this wallet answered the call. A smart contract deployed to Base mainnet — bytecode committed to Coinbase's vision of bringing the world onchain. While others debated which L2 would win, this developer was already shipping code and stacking deployments.",
    image: "/cards/base_builder_card.png",
    category: "Multi",
    chain: "Base",
    points: 300,
    glowColor: "#0052FF",
    tier: "Intermediate",
  },
  {
    id: "squiggler",
    achievementId: "nft-collector",
    name: "Squiggler",
    description: "Hold one Chromie Squiggle by Snowfro. The crown jewel of generative art.",
    lore: "Before the 10K PFP craze, before the metaverse hype, there were Squiggles. A single algorithm by Snowfro generating infinite beauty from simple curves. This wallet holds one — a piece of Art Blocks genesis history. It's not just an NFT; it's a statement that generative art is the purest form of onchain creativity.",
    image: "/cards/11.png",
    category: "NFT",
    chain: "Ethereum",
    points: 800,
    glowColor: "#ec4899",
    tier: "Veteran",
  },
];

/* ─── Badge image map ─── */
const badgeImages: Record<string, string> = {
  "etherean": "/badges/etheran.png",
  "gas-guzzler": "/badges/gas_guzzler.png",
  "nft-flipper": "/badges/nft_flipper.png",
  "multichain": "/badges/multichain_madness.png",
  "opensea": "/badges/opensea_badge.png",
  "art-blocks": "/badges/art_collector.png",
  "liquidated": "/badges/liquidated.png",
  "rookie-predictor": "/badges/rookie_predictor.png",
  "happy-lending": "/badges/happy_lending.png",
  "rug-victim": "/badges/rug_victi.png",
  "validator": "/badges/validator.png",
  "memecoiner": "/badges/memecoiner.png",
  "nft-upper-class": "/badges/nft_upper_class.png",
  "base-bull": "/badges/base_bull.png",
  "avax-bull": "/badges/avax_bull.png",
  "diamond-hands": "/badges/diamond_hands.png",
  "whale-activity": "/badges/whale_activity.png",
  "ethereum-villager": "/badges/vallager.png",
  "the-contributor": "/badges/contributor.png",
  "sandwichd": "/badges/sandwichd.png",
  "data-wrangler": "/badges/data_wrangler.png",
  "bullseye": "/badges/bullseye.png",
  "base-builder": "/badges/base_builder.png",
  "squiggler": "/badges/squiggler.png",
};

const tierColors: Record<string, string> = {
  Beginner: "#22c55e",
  Easy: "#3b82f6",
  Intermediate: "#eab308",
  Hard: "#f97316",
  Veteran: "#ef4444",
  Legendary: "#f97316",
};

const chainColors: Record<string, string> = {
  Ethereum: "#627EEA",
  Bitcoin: "#F7931A",
  Base: "#0052FF",
  Avalanche: "#E84142",
  Polygon: "#8247E5",
  Multi: "#c084fc",
};

/* ─── Celebration sparkle effect ─── */
/* ─── Floating stars around unlocked badge ─── */
function FloatingStars({ color }: { color: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 42 + Math.random() * 12; // % from center
        return {
          id: i,
          left: `${50 + Math.cos(angle) * radius}%`,
          top: `${50 + Math.sin(angle) * radius}%`,
          size: 3 + Math.random() * 5,
          delay: Math.random() * 3,
          duration: 2.5 + Math.random() * 2,
          driftX: (Math.random() - 0.5) * 20,
          driftY: (Math.random() - 0.5) * 20,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: s.left, top: s.top }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 1, 0],
            scale: [0.3, 1.2, 0.9, 1.1, 0.3],
            x: [0, s.driftX, -s.driftX * 0.5, s.driftX * 0.3, 0],
            y: [0, s.driftY, -s.driftY * 0.5, s.driftY * 0.3, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24">
            <path
              d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
              fill={color}
              style={{ filter: `drop-shadow(0 0 ${s.size}px ${color})` }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CelebrationEffect({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const angle = (i / 50) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const distance = 120 + Math.random() * 280;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: Math.random() * 1.2 + 0.4,
          delay: Math.random() * 0.4,
          duration: 1.2 + Math.random() * 0.8,
          rotation: Math.random() * 720 - 360,
          type: i % 5 === 0 ? "star" : i % 3 === 0 ? "circle" : "diamond",
        };
      }),
    []
  );

  const shimmerParticles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        startY: Math.random() * 200 - 100,
        delay: 0.3 + Math.random() * 1.2,
        duration: 1.5 + Math.random() * 1.5,
        size: Math.random() * 4 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {/* Bright central flash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: `radial-gradient(circle at center, white 0%, ${color}80 25%, ${color}20 50%, transparent 70%)`,
        }}
      />

      {/* Secondary pulse ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ width: 0, height: 0, opacity: 0.9 }}
        animate={{ width: 600, height: 600, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        style={{
          border: `2px solid ${color}`,
          boxShadow: `0 0 40px ${color}60, 0 0 80px ${color}30`,
        }}
      />

      {/* Third expanding ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ width: 0, height: 0, opacity: 0.6 }}
        animate={{ width: 800, height: 800, opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        style={{
          border: `1px solid ${color}80`,
          boxShadow: `0 0 20px ${color}40`,
        }}
      />

      {/* Burst particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, 1, 1, 0],
            scale: [0, p.scale * 1.5, p.scale, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        >
          {p.type === "star" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            >
              <path d="M12 0l2.4 7.2H22l-6 4.8 2.4 7.2L12 14.4 5.6 19.2 8 12 2 7.2h7.6z" />
            </svg>
          ) : p.type === "circle" ? (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: `radial-gradient(circle, white 0%, ${color} 60%)`,
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80`,
              }}
            />
          ) : (
            <div
              style={{
                width: 8,
                height: 8,
                background: color,
                transform: "rotate(45deg)",
                boxShadow: `0 0 6px ${color}, 0 0 12px ${color}60`,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Rising shimmer particles */}
      {shimmerParticles.map((s) => (
        <motion.div
          key={`shimmer-${s.id}`}
          className="absolute left-1/2 top-1/2"
          initial={{ x: s.x, y: s.startY, opacity: 0, scale: 0 }}
          animate={{
            y: s.startY - 300,
            opacity: [0, 0.9, 0.9, 0],
            scale: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: "easeOut",
          }}
          style={{
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            boxShadow: `0 0 ${s.size * 2}px ${color}, 0 0 ${s.size * 4}px ${color}60`,
          }}
        />
      ))}

      {/* Bright flash overlay that quickly fades */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ background: "white" }}
      />
    </div>
  );
}

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { check, status, data, error, reset } = useCheckAchievement();
  const {
    mint,
    status: mintStatus,
    data: mintData,
    error: _mintError,
    reset: resetMint,
  } = useMintBadge();
  const {
    verify: verifyOnChain,
    step: onChainStep,
    result: _onChainResult,
    error: onChainError,
    reset: resetOnChain,
    sxtBalance,
    approveTxHash: _onChainApproveTx,
    verifyTxHash: onChainVerifyTx,
  } = useVerifyBadgeOnChain();
  const [elapsed, setElapsed] = useState(0);
  const [onChainElapsed, setOnChainElapsed] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevUnlockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onChainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const cardId = params.cardId as string;
  const card = allCards.find((c) => c.id === cardId);

  // Related cards: same category or chain, excluding current card, max 4
  const relatedCards = allCards
    .filter(
      (c) =>
        c.id !== cardId &&
        (c.category === card?.category || c.chain === card?.chain)
    )
    .slice(0, 4);

  // Elapsed timer during loading
  useEffect(() => {
    if (status === "loading") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // On-chain elapsed timer
  useEffect(() => {
    const activeSteps: VerifyStep[] = ["approving", "approve-confirming", "submitting", "submit-confirming", "waiting-callback"];
    if (activeSteps.includes(onChainStep)) {
      setOnChainElapsed(0);
      onChainTimerRef.current = setInterval(() => setOnChainElapsed((s) => s + 1), 1000);
    } else {
      if (onChainTimerRef.current) clearInterval(onChainTimerRef.current);
    }
    return () => {
      if (onChainTimerRef.current) clearInterval(onChainTimerRef.current);
    };
  }, [onChainStep]);

  // Trigger celebration when badge unlocks
  const isCurrentlyUnlocked = status === "success" && !!data?.qualified;
  useEffect(() => {
    if (isCurrentlyUnlocked && !prevUnlockedRef.current) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
    prevUnlockedRef.current = isCurrentlyUnlocked;
  }, [isCurrentlyUnlocked]);

  // 3D tilt on mouse move
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    setIsHovered(false);
  }

  if (!card) {
    return (
      <DashboardLayout compact>
          <div className="text-center py-32">
            <p className="text-zinc-500 text-lg">Card not found</p>
            <Link
              href="/achievements"
              className="text-accent-orange hover:underline mt-4 inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
      </DashboardLayout>
    );
  }

  const tierColor = tierColors[card.tier] ?? card.glowColor;
  const chainColor = chainColors[card.chain] ?? "#a1a1aa";
  const isUnlocked = status === "success" && data?.qualified;
  const isFailed = status === "success" && !data?.qualified;
  const isOnChainVerified = onChainStep === "verified";

  function handleRun() {
    if (!address || !card) return;
    reset();
    resetMint();
    resetOnChain();
    check(address, card.achievementId);
  }

  function handleMint() {
    if (!address || !card) return;
    mint(address, card.id);
  }

  function handleVerifyOnChain() {
    if (!card) return;
    verifyOnChain(card.id);
  }

  // Check if badge is already minted from the verification response
  const checkData = data as (typeof data & { mintable?: boolean; mintStatus?: string; mintTxHash?: string | null; tokenId?: string | null }) | null;
  const isAlreadyMinted = checkData?.mintStatus === "MINTED" || mintStatus === "success" || isOnChainVerified;
  const explorerUrl = mintData?.explorerUrl
    || (onChainVerifyTx ? `https://basescan.org/tx/${onChainVerifyTx}` : null)
    || (checkData?.mintTxHash ? `https://basescan.org/tx/${checkData.mintTxHash}` : null);

  // Format SXT balance for display
  const sxtBalanceFormatted = sxtBalance ? formatEther(sxtBalance) : "0";
  const hasSufficientSxt = sxtBalance ? sxtBalance >= BigInt("100000000000000000000") : false;

  // Step label for on-chain verification
  const onChainStepLabel: Record<VerifyStep, string> = {
    idle: "",
    approving: "Approve SXT spend...",
    "approve-confirming": "Confirming approval...",
    submitting: "Submitting query to SXT...",
    "submit-confirming": "Confirming submission...",
    "waiting-callback": "Waiting for ZK proof callback...",
    verified: "Badge Verified & Minted!",
    "not-qualified": "Not qualified",
    error: "Verification failed",
  };

  return (
    <DashboardLayout compact>
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back</span>
            </button>
          </motion.div>

          {/* Main layout: Card left, Info right */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(400px,660px)_1fr] gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* ─── LEFT: Large card with 3D tilt ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative lg:sticky lg:top-28"
            >
              {/* Glow behind card */}
              <div
                className="absolute -inset-10 rounded-3xl pointer-events-none transition-all duration-500"
                style={{
                  background: `radial-gradient(ellipse at center, ${card.glowColor}${isHovered || isUnlocked ? "35" : "12"} 0%, transparent 70%)`,
                  filter: `blur(${isHovered ? 40 : 30}px)`,
                }}
              />

              {/* ─── Single badge — animates from locked to unlocked ─── */}
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="relative w-full sm:w-[85%] mx-auto cursor-pointer"
                style={{
                  transition: "transform 0.15s ease-out",
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.div
                  className="relative"
                  initial={false}
                  animate={{
                    filter: isUnlocked
                      ? `drop-shadow(0 16px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 50px ${card.glowColor}35)`
                      : "drop-shadow(0 8px 20px rgba(0,0,0,0.8)) grayscale(1) brightness(0.02)",
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src={badgeImages[card.id] || card.image}
                    alt={card.name}
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                  {/* Continuous shimmer overlay — full area, only when unlocked */}
                  {isUnlocked && (
                    <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                      <div className="shimmer absolute inset-0 opacity-50" />
                    </div>
                  )}
                </motion.div>

                {/* Floating stars — only when unlocked */}
                {isUnlocked && <FloatingStars color={card.glowColor} />}

                {/* Lock overlay — fades out on unlock */}
                <AnimatePresence>
                  {!isUnlocked && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center z-10"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                        }}
                      >
                        <Lock className="w-10 h-10 text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                      </div>
                      <p className="font-display text-lg tracking-tight mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        ZK Proof Required
                      </p>
                      <span className="text-xs text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        Click <span className="text-orange-400 font-semibold drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">Run</span> to verify
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Mobile card name — shown below badge on small screens */}
              <h2 className="lg:hidden font-display text-2xl text-white tracking-tight mt-5 text-center">
                {card.name}
              </h2>

              {/* Celebration sparkle burst on unlock */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CelebrationEffect color={card.glowColor} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ─── RIGHT: Info panel ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-start text-left lg:items-end lg:text-right"
            >
              {/* Tier + Chain pills */}
              <div className="flex items-center gap-2.5 flex-wrap justify-start lg:justify-end">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                  style={{
                    color: tierColor,
                    background: `${tierColor}15`,
                    border: `1px solid ${tierColor}30`,
                    boxShadow: `0 0 12px ${tierColor}10`,
                  }}
                >
                  {card.tier}
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                  style={{
                    color: chainColor,
                    background: `${chainColor}15`,
                    border: `1px solid ${chainColor}30`,
                    boxShadow: `0 0 12px ${chainColor}10`,
                  }}
                >
                  {card.chain}
                </span>
              </div>

              {/* Title — hidden on mobile when locked (shown below badge instead) */}
              <h1 className="hidden lg:block font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight mt-5">
                {card.name}
              </h1>

              {/* Storyline / Lore */}
              <p className="text-zinc-400 text-base leading-relaxed max-w-xl mt-4 italic">
                {card.lore}
              </p>

              {/* ─── Requirement glass card ─── */}
              <div
                className="w-full rounded-2xl p-5 sm:p-7 text-left lg:text-right mt-6 lg:mt-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                  border: `1px solid ${card.glowColor}20`,
                  boxShadow: `0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 80px ${card.glowColor}08`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2.5 justify-start lg:justify-end mb-4">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: card.glowColor }}
                  >
                    Requirement
                  </span>
                  <Shield
                    className="w-4 h-4"
                    style={{ color: card.glowColor, opacity: 0.8 }}
                  />
                </div>
                <p
                  className="font-display text-lg sm:text-xl leading-snug tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {card.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 flex-wrap justify-start lg:justify-end mt-6">
                <div
                  className="relative flex items-center gap-2.5 px-5 py-3 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 100%)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    boxShadow: "0 0 20px rgba(251,191,36,0.2), 0 0 60px rgba(251,191,36,0.1), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  {/* Bright glow underneath */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(251,191,36,0.5) 0%, rgba(245,158,11,0.2) 40%, transparent 70%)",
                      filter: "blur(8px)",
                    }}
                  />
                  <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                  <span className="text-white font-bold text-sm drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                    {card.points}
                  </span>
                  <span className="text-amber-300/70 text-sm font-medium">pts</span>
                </div>
                <a
                  href="https://docs.spaceandtime.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-xs text-zinc-500">Powered by</span>
                  <Image
                    src="/logos/sxt.svg"
                    alt="Space and Time"
                    width={80}
                    height={20}
                    className="h-4 w-auto object-contain opacity-50 hover:opacity-70 transition-opacity"
                  />
                </a>
              </div>

              {/* ─── Run button / Status ─── */}
              <div className="flex flex-col gap-4 mt-6 mb-8 w-full items-stretch lg:items-end">
                {!isConnected ? (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl glass">
                    <Shield className="w-5 h-5 text-zinc-500" />
                    <span className="text-zinc-400 text-sm">
                      Connect wallet to verify this badge
                    </span>
                  </div>
                ) : status === "idle" || status === "error" ? (
                  <>
                    <button
                      onClick={handleRun}
                      className="btn-liquid flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Zap className="w-5 h-5" />
                      Run
                    </button>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
                      >
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="text-red-300 text-sm">{error}</span>
                      </motion.div>
                    )}
                  </>
                ) : status === "loading" ? (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-xl glass-strong border border-white/[0.06]">
                    <Loader2 className="w-5 h-5 text-accent-orange animate-spin" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        Querying Space and Time...
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        ZK proof generation &amp; verification in progress
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{elapsed}s</span>
                    </div>
                  </div>
                ) : isUnlocked ? (
                  <div className="flex flex-col gap-4 w-full items-end">
                    {/* Verified banner */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 px-6 py-4 rounded-xl border w-full"
                      style={{
                        background: `${card.glowColor}08`,
                        borderColor: `${card.glowColor}30`,
                      }}
                    >
                      <CheckCircle2
                        className="w-6 h-6 flex-shrink-0"
                        style={{ color: card.glowColor }}
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">
                          ZK Verified — Badge Unlocked
                        </p>
                        <p className="text-zinc-400 text-xs mt-0.5">
                          Proof of SQL confirmed via Space and Time
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          color: card.glowColor,
                          background: `${card.glowColor}15`,
                        }}
                      >
                        +{card.points} pts
                      </div>
                    </motion.div>

                    {/* SXT Balance indicator */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass w-full justify-start lg:justify-end"
                    >
                      <Wallet className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-500 text-xs">SXT Balance:</span>
                      <span className={`text-sm font-mono font-semibold ${hasSufficientSxt ? "text-emerald-400" : "text-amber-400"}`}>
                        {Number(sxtBalanceFormatted).toFixed(2)} SXT
                      </span>
                      {!hasSufficientSxt && (
                        <span className="text-xs text-amber-400/60">(need 100)</span>
                      )}
                    </motion.div>

                    {/* On-Chain Verification / Mint Flow */}
                    {isAlreadyMinted || isOnChainVerified || mintData?.alreadyMinted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 px-6 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/8 w-full"
                      >
                        <Gem className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">
                            Badge Verified & Minted on Base
                          </p>
                          <p className="text-zinc-400 text-xs mt-0.5">
                            {mintData?.tokenId || checkData?.tokenId
                              ? `Token ID: ${mintData?.tokenId ?? checkData?.tokenId}`
                              : "On-chain ZK verified"}
                          </p>
                        </div>
                        {explorerUrl && (
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            BaseScan
                          </a>
                        )}
                      </motion.div>
                    ) : onChainStep !== "idle" && onChainStep !== "error" && onChainStep !== "not-qualified" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 px-6 py-4 rounded-xl glass-strong border border-white/[0.06] w-full"
                      >
                        <Loader2 className="w-5 h-5 text-accent-orange animate-spin" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {onChainStepLabel[onChainStep]}
                          </p>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {onChainStep === "waiting-callback"
                              ? "SXT Chain processing ZK proof (~30-120s)"
                              : "On-chain verification in progress"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-mono">{onChainElapsed}s</span>
                        </div>
                      </motion.div>
                    ) : onChainStep === "not-qualified" ? (
                      <div className="flex flex-col gap-3 w-full items-end">
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30 w-full"
                        >
                          <XCircle className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                          <span className="text-zinc-300 text-sm">On-chain verification: not qualified</span>
                        </motion.div>
                      </div>
                    ) : onChainStep === "error" ? (
                      <div className="flex flex-col gap-3 w-full items-end">
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
                        >
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-red-300 text-sm">{onChainError}</span>
                        </motion.div>
                        <button
                          onClick={handleVerifyOnChain}
                          disabled={!hasSufficientSxt}
                          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Shield className="w-5 h-5" />
                          Retry On-Chain Verify
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={handleVerifyOnChain}
                        disabled={!hasSufficientSxt}
                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Shield className="w-5 h-5" />
                        Verify On-Chain (~23 SXT)
                      </motion.button>
                    )}
                  </div>
                ) : isFailed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-red-500/5 border border-red-500/20">
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-red-300 font-semibold text-sm">
                          You Do Not Qualify
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          Your wallet doesn&apos;t meet the requirement for this badge
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRun}
                      className="btn-liquid flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base"
                    >
                      <Zap className="w-5 h-5" />
                      Try Again
                    </button>
                  </motion.div>
                ) : null}
              </div>

              {/* ZK verification explainer */}
              <div className="w-full flex justify-start lg:justify-end">
                <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
                  Every badge is verified using zero-knowledge proven data
                  powered by{" "}
                  <span className="text-zinc-400 font-medium">
                    Proof of SQL
                  </span>
                  . Your wallet&apos;s onchain activity is queried from Space
                  and Time&apos;s indexed blockchain data, and a ZK-SNARK is
                  generated to cryptographically prove the result is correct
                  — no trust required.
                </p>
              </div>

              {/* ─── NFT Metadata Traits (shown after successful run) ─── */}
              {status === "success" && data && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="w-full mt-2"
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center justify-between px-5 py-4"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-semibold text-white">Traits</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        TRAITS <span className="text-zinc-400">9</span>
                      </span>
                    </div>

                    {/* Traits grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
                      {/* Rarity */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Rarity</p>
                        <p className="text-sm font-semibold text-white mb-2.5">{card.tier}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ background: `${tierColor}20`, color: tierColor }}
                          >
                            {card.tier === "Legendary" ? "0.5%" : card.tier === "Veteran" ? "2%" : card.tier === "Hard" ? "8%" : card.tier === "Intermediate" ? "18%" : "35%"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">of holders</span>
                        </div>
                      </div>

                      {/* Total Minted */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Total Minted</p>
                        <p className="text-sm font-semibold text-white mb-2.5">
                          {card.tier === "Legendary" ? "12" : card.tier === "Veteran" ? "47" : card.tier === "Hard" ? "183" : card.tier === "Intermediate" ? "412" : "1,847"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>
                            {card.tier === "Legendary" ? "12" : card.tier === "Veteran" ? "47" : card.tier === "Hard" ? "183" : card.tier === "Intermediate" ? "412" : "1,847"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">badges</span>
                        </div>
                      </div>

                      {/* Mint Number */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Mint Number</p>
                        <p className="text-sm font-semibold text-white mb-2.5">
                          #{checkData?.tokenId ?? (mintData?.tokenId ?? "—")}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                            {checkData?.tokenId || mintData?.tokenId ? "Minted" : "Pending"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">on Base</span>
                        </div>
                      </div>

                      {/* SXT Spent */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">SXT Spent</p>
                        <p className="text-sm font-semibold text-white mb-2.5">~23 SXT</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                            23
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">SXT consumed</span>
                        </div>
                      </div>

                      {/* Query Result */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Query Result</p>
                        <p className="text-sm font-semibold text-white mb-2.5">{data.qualified ? "Qualified" : "Not Qualified"}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              background: data.qualified ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)",
                              color: data.qualified ? "#4ade80" : "#ef4444",
                            }}
                          >
                            {data.verified ? "Verified" : "Unverified"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">by SXT</span>
                        </div>
                      </div>

                      {/* ZK Proof */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">ZK Proof</p>
                        <p className="text-sm font-semibold text-white mb-2.5">HyperKZG</p>
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[10px] text-zinc-500 font-medium">Proof of SQL</span>
                        </div>
                      </div>

                      {/* Chain */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Chain</p>
                        <p className="text-sm font-semibold text-white mb-2.5">{card.chain}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ background: `${chainColor}15`, color: chainColor }}
                          >
                            {card.chain}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">network</span>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Category</p>
                        <p className="text-sm font-semibold text-white mb-2.5">{card.category}</p>
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[10px] text-zinc-500 font-medium">{card.category} badge</span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="px-4 py-4" style={{ background: "rgba(6,6,17,0.9)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Points</p>
                        <p className="text-sm font-semibold text-white mb-2.5">{card.points} pts</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                            +{card.points}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">earned</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ─── Related Cards ─── */}
          {relatedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-24"
            >
              <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-6">
                Related Cards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedCards.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/achievements/card/${rc.id}`}
                    className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 40px ${rc.glowColor}08`,
                    }}
                  >
                    {/* Glow on hover */}
                    <div
                      className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center, ${rc.glowColor}20 0%, transparent 70%)`,
                        filter: "blur(12px)",
                      }}
                    />
                    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] group-hover:border-white/[0.12] transition-colors">
                      {/* Blurry card backdrop */}
                      <Image
                        src={rc.image}
                        alt=""
                        width={200}
                        height={280}
                        className="w-full h-auto"
                        style={{ filter: "blur(6px) brightness(0.25)" }}
                      />
                      <div className="absolute inset-0 bg-[#060611]/40" />

                      {/* Badge overlay */}
                      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                        <div
                          className="relative w-[85%]"
                          style={{
                            filter: `drop-shadow(0 6px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 12px ${rc.glowColor}25)`,
                          }}
                        >
                          <Image
                            src={badgeImages[rc.id] || rc.image}
                            alt={rc.name}
                            width={200}
                            height={200}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>

                      {/* Bottom label */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8 z-20">
                        <p className="text-white text-xs font-semibold truncate">
                          {rc.name}
                        </p>
                        <p className="text-zinc-400 text-[10px] mt-0.5">
                          {rc.points} pts &middot; {rc.tier}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
    </DashboardLayout>
  );
}
