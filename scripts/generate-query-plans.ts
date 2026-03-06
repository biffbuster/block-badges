/**
 * generate-query-plans.ts
 *
 * For each verifiable badge in achievements.ts:
 * 1. Replace {wallet} → $1 in SQL template
 * 2. Call SXT RPC `commitments_v1_evmProofPlan` to get hex plan
 * 3. Output plans for storing in contract via `setBadgeQueryPlan()`
 *
 * Usage: npx tsx scripts/generate-query-plans.ts
 */

// Badge definitions — matches BADGE_TYPE_IDS in contract.ts
const badges: {
  id: string;
  badgeTypeId: number;
  sql: string;
}[] = [
  {
    id: "etherean",
    badgeTypeId: 1,
    sql: `SELECT COUNT(*) as qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND TIME_STAMP <= CURRENT_DATE - 365 LIMIT 1`,
  },
  {
    id: "gas-guzzler",
    badgeTypeId: 2,
    sql: `SELECT SUM(TRANSACTION_FEE) AS total_gas_spent FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND BLOCK_NUMBER > 19000000`,
  },
  {
    id: "nft-flipper",
    badgeTypeId: 3,
    sql: `SELECT COUNT(*) as nft_count FROM ETHEREUM.ERC721_EVT_TRANSFER WHERE TOPIC_2 = $1`,
  },
  {
    id: "multichain",
    badgeTypeId: 4,
    sql: `SELECT COUNT(DISTINCT TO_ADDRESS) as unique_contracts FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1`,
  },
  {
    id: "opensea",
    badgeTypeId: 5,
    sql: `SELECT COUNT(*) as nft_count FROM ETHEREUM.ERC721_EVT_TRANSFER WHERE TOPIC_2 = $1`,
  },
  {
    id: "art-blocks",
    badgeTypeId: 6,
    sql: `SELECT COUNT(*) as nft_count FROM ETHEREUM.ERC721_EVT_TRANSFER WHERE TOPIC_2 = $1`,
  },
  {
    id: "card-01",
    badgeTypeId: 7,
    sql: `SELECT COUNT(*) as qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND TIME_STAMP <= CURRENT_DATE - 365 LIMIT 1`,
  },
  {
    id: "card-02",
    badgeTypeId: 8,
    sql: `SELECT COUNT(*) as qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND BLOCK_NUMBER <= 1000000 LIMIT 1`,
  },
  {
    id: "emn-rug",
    badgeTypeId: 9,
    sql: `SELECT COUNT(DISTINCT TO_ADDRESS) as unique_contracts FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1`,
  },
  {
    id: "eth-steak",
    badgeTypeId: 10,
    sql: `SELECT COUNT(*) as qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND TIME_STAMP <= CURRENT_DATE - 365 LIMIT 1`,
  },
  {
    id: "memecoin",
    badgeTypeId: 11,
    sql: `SELECT COUNT(DISTINCT TO_ADDRESS) as unique_contracts FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1`,
  },
  {
    id: "nft-20k",
    badgeTypeId: 12,
    sql: `SELECT COUNT(*) as nft_count FROM ETHEREUM.ERC721_EVT_TRANSFER WHERE TOPIC_2 = $1`,
  },
  {
    id: "contract-deployer",
    badgeTypeId: 13,
    sql: `SELECT COUNT(*) as qualifies FROM ETHEREUM.TRANSACTIONS WHERE FROM_ADDRESS = $1 AND TO_ADDRESS = '' LIMIT 1`,
  },
];

const RPC_URL = "https://rpc.testnet.sxt.network";

interface RpcResponse {
  jsonrpc: string;
  id: number;
  result?: string;
  error?: { code: number; message: string };
}

async function getEvmProofPlan(sql: string): Promise<string> {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "commitments_v1_evmProofPlan",
      params: [sql],
    }),
  });

  const data = (await response.json()) as RpcResponse;

  if (data.error) {
    throw new Error(`RPC error for SQL: ${data.error.message}`);
  }

  return data.result ?? "";
}

async function main() {
  console.log("Generating EVM proof plans for badges...\n");

  const plans: { id: string; badgeTypeId: number; plan: string }[] = [];

  for (const badge of badges) {
    try {
      console.log(`[${badge.badgeTypeId}] ${badge.id}: querying proof plan...`);
      const plan = await getEvmProofPlan(badge.sql);
      plans.push({ id: badge.id, badgeTypeId: badge.badgeTypeId, plan });
      console.log(`  OK: ${plan.substring(0, 40)}...`);
    } catch (err) {
      console.error(
        `  FAIL: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      plans.push({ id: badge.id, badgeTypeId: badge.badgeTypeId, plan: "" });
    }
  }

  // Output forge script-style calls
  console.log("\n\n=== Forge Script Calls ===\n");
  for (const p of plans) {
    if (p.plan) {
      console.log(
        `verifier.configureBadge(${p.badgeTypeId}, hex"${p.plan.replace("0x", "")}", ${getThreshold(p.id)}, 0);`
      );
    }
  }

  // Output JSON for programmatic use
  console.log("\n\n=== JSON Output ===\n");
  console.log(
    JSON.stringify(
      plans.map((p) => ({
        badgeTypeId: p.badgeTypeId,
        id: p.id,
        plan: p.plan,
        threshold: getThreshold(p.id),
      })),
      null,
      2
    )
  );
}

function getThreshold(badgeId: string): number {
  const thresholds: Record<string, number> = {
    etherean: 1, // qualifies > 0
    "gas-guzzler": 1, // total_gas_spent >= 10 ETH (raw value compared in wei)
    "nft-flipper": 10, // nft_count >= 10
    multichain: 20, // unique_contracts >= 20
    opensea: 10, // nft_count >= 10
    "art-blocks": 10, // nft_count >= 10
    "card-01": 1, // qualifies > 0
    "card-02": 1, // qualifies > 0
    "emn-rug": 20, // unique_contracts >= 20
    "eth-steak": 1, // qualifies > 0
    memecoin: 20, // unique_contracts >= 20
    "nft-20k": 20000, // nft_count >= 20000
    "contract-deployer": 1, // qualifies > 0
  };
  return thresholds[badgeId] ?? 1;
}

main().catch(console.error);
