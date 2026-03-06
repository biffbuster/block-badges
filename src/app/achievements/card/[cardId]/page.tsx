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
  Link as LinkIcon,
  Clock,
  ExternalLink,
  Gem,
  Wallet,
} from "lucide-react";

/* ─── Card data (same source of truth as dashboard) ─── */
const allCards = [
  {
    id: "etherean",
    achievementId: "diamond-hands",
    name: "The Etherean",
    description:
      "A true Ethereum native. Present since the early days, weathering every fork and every bear market.",
    lore: "They were there when the genesis block was forged — watching the world computer flicker to life in a dimly lit chatroom. Through The DAO hack, through the ice age, through the merge itself. While others fled to faster chains, this wallet never wavered. The Etherean doesn't chase trends. They are the trend.",
    image: "/cards/etherean.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 500,
    glowColor: "#60a5fa",
    tier: "Veteran",
  },
  {
    id: "gas-guzzler",
    achievementId: "gas-guzzler",
    name: "Gas Guzzler",
    description:
      "Spent over 10 ETH in total gas fees. A true power user who never hesitates to transact.",
    lore: "While others waited for gas to drop, this wallet hit send anyway. 200 gwei? Ship it. 500 gwei during an NFT mint? Barely flinched. Over 10 ETH burned to the void — a monument to urgency, impatience, and the belief that time is always more expensive than gas.",
    image: "/cards/gas_guzzler.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 400,
    glowColor: "#f97316",
    tier: "Hard",
  },
  {
    id: "nft-flipper",
    achievementId: "nft-collector",
    name: "NFT Flipper",
    description:
      "Bought and sold 50+ NFTs across marketplaces. Always hunting the next 10x.",
    lore: "Floor price alerts at 3am. Sniping bots on standby. This wallet moves through NFT markets like a shark through shallow water — always circling, always watching the charts. 50+ flips and counting. Some were rugs. Most were profit. All were a rush.",
    image: "/cards/nft_flipper.png",
    category: "NFT",
    chain: "Ethereum",
    points: 350,
    glowColor: "#f43f5e",
    tier: "Intermediate",
  },
  {
    id: "multichain",
    achievementId: "multichain-explorer",
    name: "Multichain Maximalist",
    description:
      "Active on 3+ different chains. A true cross-chain explorer bridging every ecosystem.",
    lore: "One chain was never enough. They bridged to Polygon on a Tuesday, aped into Avalanche by Thursday, and was farming on Arbitrum before the weekend. Three chains, three cultures, one wallet address cutting across every ecosystem like a digital nomad with no home and every home.",
    image: "/cards/multi-chain.png",
    category: "Multi",
    chain: "Multi",
    points: 350,
    glowColor: "#c084fc",
    tier: "Intermediate",
  },
  {
    id: "opensea",
    achievementId: "nft-collector",
    name: "OpenSea VIP",
    description:
      "Top-tier OpenSea trader with 100+ transactions on the leading NFT marketplace.",
    lore: "The OpenSea activity feed tells the story — 100+ transactions, a blur of bids, listings, and last-second snipes. This wallet has seen collections moon and rug in the same hour. The blue checkmark crowd knows this address. The whales nod when it enters a collection.",
    image: "/cards/opensea.png",
    category: "NFT",
    chain: "Ethereum",
    points: 500,
    glowColor: "#22d3ee",
    tier: "Hard",
  },
  {
    id: "art-blocks",
    achievementId: "nft-collector",
    name: "Art Blocks Collector",
    description:
      "Minted from Art Blocks — a true generative art connoisseur with impeccable taste.",
    lore: "When the mint went live, this wallet was already there — refreshing, waiting for that one perfect output. Not every mint is a Fidenza, but every mint is a gamble on beauty. Generative art isn't collected; it's discovered. And this collector has an eye that algorithms envy.",
    image: "/cards/art_blocks.png",
    category: "NFT",
    chain: "Ethereum",
    points: 450,
    glowColor: "#a78bfa",
    tier: "Hard",
  },
  {
    id: "card-01",
    achievementId: "diamond-hands",
    name: "Diamond Hands",
    description:
      "Held ETH for 365+ days without selling. Unshakeable conviction through every cycle.",
    lore: "365 days. Through the crashes that made headlines and the pumps that filled Twitter. This wallet watched its balance drop 80% and didn't touch the sell button. Not once. Diamond hands aren't born — they're forged in the fire of unrealized losses and the quiet faith that the future is onchain.",
    image: "/cards/card_01.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 500,
    glowColor: "#38bdf8",
    tier: "Hard",
  },
  {
    id: "card-02",
    achievementId: "genesis-walker",
    name: "Genesis Walker",
    description:
      "Wallet active before block 1,000,000. An OG who witnessed Ethereum's earliest days.",
    lore: "Before DeFi had a name. Before NFTs were a concept. Before the merge was even a dream. This wallet was already transacting in the first million blocks — back when Ethereum was an experiment and the world hadn't yet noticed the revolution humming in the background.",
    image: "/cards/card_02.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 1000,
    glowColor: "#4ade80",
    tier: "Veteran",
  },
  {
    id: "emn-rug",
    achievementId: "defi-degen",
    name: "Rug Survivor",
    description:
      "Survived a major protocol exploit and lived to tell the tale. Battle-hardened DeFi veteran.",
    lore: "The protocol promised 10,000% APY. The smart contract had other plans. When the exploit hit, most wallets went silent forever. But not this one. It came back — scarred, wiser, and still degen enough to farm the next pool. You can't kill what the rug already tried to destroy.",
    image: "/cards/emn_rug.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 300,
    glowColor: "#fb923c",
    tier: "Intermediate",
  },
  {
    id: "eth-steak",
    achievementId: "diamond-hands",
    name: "ETH Staker",
    description:
      "Staked ETH on the Beacon Chain. Securing the network and earning yield since the merge.",
    lore: "They locked their ETH before withdrawals were even guaranteed. A leap of faith into the Beacon Chain — 32 ETH committed to securing the network, earning yield one epoch at a time. While traders chased pumps, this wallet chose patience, conviction, and compound interest.",
    image: "/cards/eth_steak.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 400,
    glowColor: "#f59e0b",
    tier: "Hard",
  },
  {
    id: "memecoin",
    achievementId: "defi-degen",
    name: "Memecoin Degen",
    description:
      "Traded 10+ memecoins. No token too risky, no ape too fast. Pure degen energy.",
    lore: "PEPE. DOGE. SHIB. BONK. And six others you've never heard of. This wallet treats Uniswap like a casino and the token list like a slot machine. 10+ memecoins traded — some to zero, some to Valhalla. The only strategy? Ape first, read the contract never.",
    image: "/cards/memecoin.png",
    category: "DeFi",
    chain: "Ethereum",
    points: 200,
    glowColor: "#facc15",
    tier: "Easy",
  },
  {
    id: "nft-20k",
    achievementId: "nft-collector",
    name: "20K NFT Club",
    description:
      "Collected 20,000+ NFTs. An absolute whale of the NFT ecosystem with a legendary vault.",
    lore: "Twenty thousand digital artifacts. Free mints, blue chips, forgotten airdrops, and pieces that haven't been looked at since 2021. This vault is a museum, a graveyard, and a treasure chest all at once. Somewhere in those 20K tokens is a piece worth more than the rest combined.",
    image: "/cards/nft_20k.png",
    category: "NFT",
    chain: "Ethereum",
    points: 1000,
    glowColor: "#e879f9",
    tier: "Veteran",
  },
  {
    id: "contract-deployer",
    achievementId: "contract-deployer",
    name: "Contract Deployer",
    description:
      "Deployed a smart contract to mainnet. A builder, not just a user — shaping the chain itself.",
    lore: "While everyone else was trading, this wallet was building. A smart contract deployed to mainnet — bytecode committed to the world computer forever. It could be a token, a protocol, a game, or something the world hasn't seen yet. Builders don't just use the chain. They become part of it.",
    image: "/cards/card_01.png",
    category: "Ethereum",
    chain: "Ethereum",
    points: 300,
    glowColor: "#34d399",
    tier: "Intermediate",
  },
  {
    id: "base-bull",
    achievementId: "defi-degen",
    name: "Base Bull",
    description:
      "Have at least 100 transactions on the Base chain. Average Base User.",
    lore: "Coinbase said \"come onchain\" and this wallet said \"bet.\" 100+ transactions on Base — swapping, minting, bridging, vibing. While Ethereum maxis debated L2 legitimacy, this address was already deep in the blue-pilled ecosystem, stacking transactions like they were going out of style.",
    image: "/cards/base_bull.png",
    category: "Multi",
    chain: "Base",
    points: 150,
    glowColor: "#0052FF",
    tier: "Easy",
  },
  {
    id: "avax-bull",
    achievementId: "defi-degen",
    name: "AVAX Bull",
    description:
      "Have at least 100 transactions on Avalanche C-Chain. Red coin good.",
    lore: "The red coin called and this wallet answered. 100+ transactions on the C-Chain — farming Trader Joe, bridging through the Avalanche bridge, and collecting subnets like Infinity Stones. Fast finality, low fees, and the unshakable belief that the mountain will outlast the hype.",
    image: "/cards/avax_bull.png",
    category: "Multi",
    chain: "Avalanche",
    points: 150,
    glowColor: "#E84142",
    tier: "Easy",
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
    points: 500,
    glowColor: "#e2e8f0",
    tier: "Hard",
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
    tier: "Veteran",
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
];

const tierColors: Record<string, string> = {
  Beginner: "#22c55e",
  Easy: "#3b82f6",
  Intermediate: "#eab308",
  Hard: "#f97316",
  Veteran: "#ef4444",
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
      <DashboardLayout>
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
    <DashboardLayout>
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
          <div className="grid grid-cols-1 lg:grid-cols-[580px_1fr] gap-16 items-start">
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

              {/* Card frame with 3D tilt */}
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="card-3d relative overflow-hidden cursor-pointer"
                style={{
                  transition: "transform 0.15s ease-out, box-shadow 0.4s ease",
                  transformStyle: "preserve-3d",
                  boxShadow: isHovered
                    ? `
                      0 2px 0 0 rgba(255,255,255,0.1),
                      0 -2px 0 0 rgba(0,0,0,0.4),
                      0 20px 60px rgba(0,0,0,0.7),
                      0 40px 100px rgba(0,0,0,0.5),
                      0 0 80px ${card.glowColor}25,
                      0 0 120px ${card.glowColor}10,
                      inset 0 1px 0 rgba(255,255,255,0.15),
                      inset 0 -1px 0 rgba(0,0,0,0.3)
                    `
                    : `
                      0 2px 0 0 rgba(255,255,255,0.08),
                      0 -2px 0 0 rgba(0,0,0,0.4),
                      0 12px 40px rgba(0,0,0,0.6),
                      0 24px 80px rgba(0,0,0,0.4),
                      0 0 60px ${card.glowColor}${isUnlocked ? "30" : "10"},
                      inset 0 1px 0 rgba(255,255,255,0.12),
                      inset 0 -1px 0 rgba(0,0,0,0.3)
                    `,
                }}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  width={580}
                  height={812}
                  className="w-full h-auto"
                  priority
                  style={{
                    filter: isUnlocked
                      ? "none"
                      : "grayscale(0.6) brightness(0.5)",
                    transition: "filter 0.8s ease-out",
                  }}
                />

                {/* Glare effect on hover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isHovered ? 0.15 : 0,
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                  }}
                />

                {/* Lock overlay when not unlocked */}
                {!isUnlocked && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={false}
                    animate={{
                      opacity: status === "success" && data?.qualified ? 0 : 1,
                    }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(6,6,17,0.7) 0%, rgba(6,6,17,0.4) 100%)",
                    }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-2xl glass flex items-center justify-center"
                        style={{
                          border: `1px solid ${card.glowColor}30`,
                          boxShadow: `0 0 30px ${card.glowColor}15`,
                        }}
                      >
                        <Lock
                          className="w-9 h-9"
                          style={{ color: card.glowColor }}
                        />
                      </div>
                      <span className="text-sm text-zinc-500 font-medium">
                        ZK Proof Required
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Unlocked shimmer sweep */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, ${card.glowColor}30 50%, transparent 60%)`,
                    }}
                  />
                )}
              </div>

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
              className="flex flex-col items-end text-right"
            >
              {/* Tier + Chain pills */}
              <div className="flex items-center gap-2.5 flex-wrap justify-end">
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

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl text-white tracking-tight leading-tight mt-5">
                {card.name}
              </h1>

              {/* Storyline / Lore */}
              <p className="text-zinc-400 text-base leading-relaxed max-w-xl mt-4 italic">
                {card.lore}
              </p>

              {/* ─── Requirement glass card ─── */}
              <div
                className="w-full rounded-2xl p-7 text-right mt-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                  border: `1px solid ${card.glowColor}20`,
                  boxShadow: `0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 80px ${card.glowColor}08`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2.5 justify-end mb-4">
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
              <div className="flex items-center gap-4 flex-wrap justify-end mt-6">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-semibold text-sm">
                    {card.points}
                  </span>
                  <span className="text-zinc-500 text-sm">pts</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                  <Shield className="w-4 h-4 text-accent-orange" />
                  <span className="text-zinc-300 text-sm">Proof of SQL</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-zinc-300 text-sm">SXT Chain</span>
                </div>
              </div>

              {/* ─── Run button / Status ─── */}
              <div className="flex flex-col gap-4 mt-6 mb-8 w-full items-end">
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
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass w-full justify-end"
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
              <div className="w-full flex justify-end">
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

              {/* Verification details (shown after any result) */}
              {status === "success" && data && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl p-5 glass-strong"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-medium">
                    Verification Details
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500 text-xs">Status</span>
                      <p className="text-white font-medium mt-0.5">
                        {data.verified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs">Qualified</span>
                      <p
                        className="font-medium mt-0.5"
                        style={{
                          color: data.qualified ? "#4ade80" : "#ef4444",
                        }}
                      >
                        {data.qualified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs">
                        Commitment Scheme
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        HyperKZG
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs">
                        Proof Engine
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        Proof of SQL
                      </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
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
                      <Image
                        src={rc.image}
                        alt={rc.name}
                        width={200}
                        height={280}
                        className="w-full h-auto"
                        style={{
                          filter: "grayscale(0.5) brightness(0.6)",
                          transition: "filter 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          ((e.target as HTMLImageElement).style.filter =
                            "grayscale(0.2) brightness(0.8)")
                        }
                        onMouseOut={(e) =>
                          ((e.target as HTMLImageElement).style.filter =
                            "grayscale(0.5) brightness(0.6)")
                        }
                      />
                      {/* Bottom label */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
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
