import { NextRequest, NextResponse } from "next/server";
import { BADGE_TYPE_IDS } from "@/lib/contract";

// Badge metadata for ERC-721 tokenURI responses.
// This serves as the onchain metadata until we move to IPFS.
const BADGE_METADATA: Record<
  string,
  { name: string; description: string; image: string; tier: string; chain: string; points: number }
> = {
  etherean: {
    name: "The Etherean",
    description:
      "A true Ethereum native. Present since the early days, weathering every fork and every bear market.",
    image: "/cards/etherean.png",
    tier: "Veteran",
    chain: "Ethereum",
    points: 500,
  },
  "gas-guzzler": {
    name: "Gas Guzzler",
    description: "Spent over 10 ETH in total gas fees. A true power user.",
    image: "/cards/gas_guzzler.png",
    tier: "Hard",
    chain: "Ethereum",
    points: 400,
  },
  "nft-flipper": {
    name: "NFT Flipper",
    description: "Bought and sold 50+ NFTs across marketplaces.",
    image: "/cards/nft_flipper.png",
    tier: "Intermediate",
    chain: "Ethereum",
    points: 350,
  },
  multichain: {
    name: "Multichain Maximalist",
    description: "Active on 3+ different chains. A true cross-chain explorer.",
    image: "/cards/multi-chain.png",
    tier: "Intermediate",
    chain: "Multi",
    points: 350,
  },
  opensea: {
    name: "OpenSea VIP",
    description: "Top-tier OpenSea trader with 100+ transactions.",
    image: "/cards/opensea.png",
    tier: "Hard",
    chain: "Ethereum",
    points: 500,
  },
  "art-blocks": {
    name: "Art Blocks Collector",
    description: "Minted from Art Blocks — a true generative art connoisseur.",
    image: "/cards/art_blocks.png",
    tier: "Hard",
    chain: "Ethereum",
    points: 450,
  },
  "card-01": {
    name: "Diamond Hands",
    description: "Held ETH for 365+ days without selling.",
    image: "/cards/card_01.png",
    tier: "Hard",
    chain: "Ethereum",
    points: 500,
  },
  "card-02": {
    name: "Genesis Walker",
    description: "Wallet active before block 1,000,000.",
    image: "/cards/card_02.png",
    tier: "Veteran",
    chain: "Ethereum",
    points: 1000,
  },
  "emn-rug": {
    name: "Rug Survivor",
    description: "Survived a major protocol exploit. Battle-hardened DeFi veteran.",
    image: "/cards/emn_rug.png",
    tier: "Intermediate",
    chain: "Ethereum",
    points: 300,
  },
  "eth-steak": {
    name: "ETH Staker",
    description: "Staked ETH on the Beacon Chain. Securing the network.",
    image: "/cards/eth_steak.png",
    tier: "Hard",
    chain: "Ethereum",
    points: 400,
  },
  memecoin: {
    name: "Memecoin Degen",
    description: "Traded 10+ memecoins. Pure degen energy.",
    image: "/cards/memecoin.png",
    tier: "Easy",
    chain: "Ethereum",
    points: 200,
  },
  "nft-20k": {
    name: "20K NFT Club",
    description: "Collected 20,000+ NFTs. An absolute whale.",
    image: "/cards/nft_20k.png",
    tier: "Veteran",
    chain: "Ethereum",
    points: 1000,
  },
  "contract-deployer": {
    name: "Contract Deployer",
    description: "Deployed a smart contract to mainnet. A builder.",
    image: "/cards/card_01.png",
    tier: "Intermediate",
    chain: "Ethereum",
    points: 300,
  },
  "base-bull": {
    name: "Base Bull",
    description: "100+ transactions on the Base chain.",
    image: "/cards/base_bull.png",
    tier: "Easy",
    chain: "Base",
    points: 150,
  },
  "avax-bull": {
    name: "AVAX Bull",
    description: "100+ transactions on Avalanche C-Chain.",
    image: "/cards/avax_bull.png",
    tier: "Easy",
    chain: "Avalanche",
    points: 150,
  },
  "diamond-hands": {
    name: "Diamond Hands",
    description: "Hold 1 BTC for 3 years minimum. HODL.",
    image: "/cards/diamond_hands.png",
    tier: "Hard",
    chain: "Bitcoin",
    points: 500,
  },
  "whale-activity": {
    name: "Whale Activity",
    description: "Hold at least 100 ETH. Swimming with the whales.",
    image: "/cards/whale_activity.png",
    tier: "Veteran",
    chain: "Ethereum",
    points: 1000,
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ badgeId: string }> }
) {
  const { badgeId } = await params;

  const meta = BADGE_METADATA[badgeId];
  if (!meta) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  const badgeTypeId = BADGE_TYPE_IDS[badgeId] ?? 0;

  // Construct absolute image URL from the request
  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "https://chaintitles.xyz";
  const imageUrl = `${origin}${meta.image}`;

  // ERC-721 Metadata JSON Standard
  const metadata = {
    name: meta.name,
    description: meta.description,
    image: imageUrl,
    external_url: `${origin}/dashboard/card/${badgeId}`,
    attributes: [
      { trait_type: "Tier", value: meta.tier },
      { trait_type: "Chain", value: meta.chain },
      { trait_type: "Points", value: meta.points, display_type: "number" },
      { trait_type: "Badge Type ID", value: badgeTypeId, display_type: "number" },
      { trait_type: "Soulbound", value: "Yes" },
      { trait_type: "Verification", value: "Proof of SQL" },
    ],
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
