export type Tier = "beginner" | "easy" | "intermediate" | "hard" | "veteran";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: Tier;
  points: number;
  chain: string;
  query: string;
}

export const tierColors: Record<Tier, string> = {
  beginner: "#22c55e",
  easy: "#3b82f6",
  intermediate: "#eab308",
  hard: "#f97316",
  veteran: "#ef4444",
};

export const tierLabels: Record<Tier, string> = {
  beginner: "Beginner",
  easy: "Easy",
  intermediate: "Intermediate",
  hard: "Hard",
  veteran: "Veteran",
};

export const achievements: Achievement[] = [
  {
    id: "diamond-hands",
    name: "Diamond Hands",
    description: "Held ETH for 365+ days without selling",
    icon: "\u{1F48E}",
    tier: "hard",
    points: 500,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as qualifies\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\n  AND TIME_STAMP <= CURRENT_DATE - 365\nLIMIT 1`,
  },
  {
    id: "whale-alert",
    name: "Whale Alert",
    description: "$1M+ in a single transaction",
    icon: "\u{1F40B}",
    tier: "veteran",
    points: 1000,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as qualifies\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\n  AND VALUE >= 1000000000000000000000000\nLIMIT 1`,
  },
  {
    id: "genesis-walker",
    name: "Genesis Walker",
    description: "Wallet active before block 1,000,000",
    icon: "\u{1F525}",
    tier: "veteran",
    points: 1000,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as qualifies\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\n  AND BLOCK_NUMBER <= 1000000\nLIMIT 1`,
  },
  {
    id: "defi-degen",
    name: "DeFi Degen",
    description: "Interacted with 20+ unique contracts",
    icon: "\u{1F3AF}",
    tier: "intermediate",
    points: 300,
    chain: "Ethereum",
    query: `SELECT COUNT(DISTINCT TO_ADDRESS) as unique_contracts\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'`,
  },
  {
    id: "chain-immortal",
    name: "Chain Immortal",
    description: "Unlocked 80+ achievements",
    icon: "\u{1F451}",
    tier: "veteran",
    points: 2000,
    chain: "Multi",
    query: `-- Meta achievement\n-- Verified by aggregating\n-- all other badge results`,
  },
  {
    id: "uniswap-og",
    name: "Uniswap V1 OG",
    description: "Used Uniswap before May 2020",
    icon: "\u{1F984}",
    tier: "hard",
    points: 500,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as qualifies\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\n  AND TO_ADDRESS = '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95'\n  AND BLOCK_NUMBER <= 10000000\nLIMIT 1`,
  },
  {
    id: "nft-collector",
    name: "NFT Collector",
    description: "Received 10+ NFTs",
    icon: "\u{1F3A8}",
    tier: "easy",
    points: 150,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as nft_count\nFROM ETHEREUM.ERC721_EVT_TRANSFER\nWHERE TOPIC_2 = '{wallet}'`,
  },
  {
    id: "gas-guzzler",
    name: "Gas Guzzler",
    description: "Spent 10+ ETH in total gas fees",
    icon: "\u{26FD}",
    tier: "hard",
    points: 400,
    chain: "Ethereum",
    query: `SELECT SUM(TRANSACTION_FEE) AS total_gas_spent FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = '{wallet}' AND BLOCK_NUMBER > 19000000`,
  },
  {
    id: "contract-deployer",
    name: "Contract Deployer",
    description: "Deployed a smart contract",
    icon: "\u{1F3D7}\uFE0F",
    tier: "intermediate",
    points: 300,
    chain: "Ethereum",
    query: `SELECT COUNT(*) as qualifies\nFROM ETHEREUM.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\n  AND TO_ADDRESS = ''\nLIMIT 1`,
  },
  {
    id: "ethereum-villager",
    name: "Ethereum Villager",
    description: "Made at least 5 transactions on Ethereum mainnet",
    icon: "\u{1F3E0}",
    tier: "beginner",
    points: 100,
    chain: "Ethereum",
    query: `SELECT COUNT(*) AS tx_count FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = '{wallet}' AND BLOCK_NUMBER > 20000000`,
  },
  {
    id: "the-contributor",
    name: "The Contributor",
    description: "Deployed a smart contract on Ethereum mainnet",
    icon: "\u{1F528}",
    tier: "beginner",
    points: 100,
    chain: "Ethereum",
    query: `SELECT COUNT(*) AS qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = '{wallet}' AND TO_ADDRESS = '' LIMIT 1`,
  },
  {
    id: "multichain-explorer",
    name: "Multichain Explorer",
    description: "Active on 3+ different chains",
    icon: "\u{1F30D}",
    tier: "intermediate",
    points: 350,
    chain: "Multi",
    query: `-- Run per chain:\nSELECT COUNT(*) as tx_count\nFROM POLYGON.TRANSACTIONS\nWHERE FROM_ADDRESS = '{wallet}'\nLIMIT 1`,
  },
];
