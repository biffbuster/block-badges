import { createPublicClient, createWalletClient, http, type Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

// ─── Badge Type ID Mapping ──────────────────────────────────
// Sequential IDs shared between contract + Next.js.
// Contract uses uint256 (1–17), frontend uses string card IDs.
export const BADGE_TYPE_IDS: Record<string, number> = {
  etherean: 1,
  "gas-guzzler": 2,
  "nft-flipper": 3,
  multichain: 4,
  opensea: 5,
  "art-blocks": 6,
  "card-01": 7,
  "card-02": 8,
  "emn-rug": 9,
  "eth-steak": 10,
  memecoin: 11,
  "nft-20k": 12,
  "contract-deployer": 13,
  "base-bull": 14,
  "avax-bull": 15,
  "diamond-hands": 16,
  "whale-activity": 17,
  "ethereum-villager": 18,
  "the-contributor": 19,
} as const;

// Reverse lookup: type ID → card ID
export const BADGE_TYPE_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(BADGE_TYPE_IDS).map(([k, v]) => [v, k])
);

// ─── BlockBadge ABI (only what we need) ─────────────────────
export const BLOCK_BADGE_ABI: Abi = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "badgeTypeId", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasBadge",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minter",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BadgeMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "badgeTypeId", type: "uint256", indexed: true },
    ],
  },
] as const;

// ─── BadgeVerifier ABI (only what we need) ──────────────────
export const BADGE_VERIFIER_ABI: Abi = [
  {
    type: "function",
    name: "verifyBadge",
    inputs: [{ name: "badgeTypeId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "QUERY_PAYMENT",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingQueries",
    inputs: [{ name: "queryId", type: "bytes32" }],
    outputs: [
      { name: "wallet", type: "address" },
      { name: "badgeTypeId", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BadgeVerified",
    inputs: [
      { name: "wallet", type: "address", indexed: true },
      { name: "badgeTypeId", type: "uint256", indexed: true },
      { name: "qualified", type: "bool", indexed: false },
      { name: "queryId", type: "bytes32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "QuerySubmitted",
    inputs: [
      { name: "wallet", type: "address", indexed: true },
      { name: "badgeTypeId", type: "uint256", indexed: true },
      { name: "queryId", type: "bytes32", indexed: false },
    ],
  },
] as const;

// ─── ERC-20 ABI (for SXT token approve) ─────────────────────
export const ERC20_ABI: Abi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

// ─── Contract Addresses ─────────────────────────────────────
export const BLOCK_BADGE_ADDRESS = process.env
  .BLOCK_BADGE_ADDRESS as `0x${string}`;

export const BADGE_VERIFIER_ADDRESS = process.env
  .BADGE_VERIFIER_ADDRESS as `0x${string}`;

// SXT contract addresses on Base mainnet
export const SXT_TOKEN_ADDRESS =
  "0xE6Bfd33F52d82Ccb5b37E16D3dD81f9FFDAbB195" as const;

export const QUERY_ROUTER_ADDRESS =
  "0x220a7036a815a1Bd4A7998fb2BCE608581fA2DbB" as const;

// ─── Viem Clients ────────────────────────────────────────────

const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";

export function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });
}

export function getMinterWalletClient() {
  const privateKey = process.env.MINTER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("MINTER_PRIVATE_KEY not set");
  }
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: base,
    transport: http(rpcUrl),
  });
}
