import type { SxTResult } from "./sxt";

/** Normalize column names to uppercase for consistent access */
function normalizeResult(result: SxTResult): SxTResult {
  const normalized: SxTResult = {};
  for (const [key, value] of Object.entries(result)) {
    normalized[key.toUpperCase()] = value;
  }
  return normalized;
}

/** Extract first Int value from a column */
function getInt(result: SxTResult, column: string): number {
  const col = result[column.toUpperCase()];
  if (col?.Int) return col.Int[0] ?? 0;
  if (col?.BigInt) return Number(col.BigInt[0] ?? "0");
  return 0;
}

/** Extract first BigInt value from a column as a native bigint */
export function getBigInt(result: SxTResult, column: string): bigint {
  const col = result[column.toUpperCase()];
  if (col?.BigInt) return BigInt(col.BigInt[0] ?? "0");
  if (col?.Int) return BigInt(col.Int[0] ?? 0);
  return BigInt(0);
}

/** Extract first numeric value as a float — handles Decimal75, BigInt, Int, VarChar */
function getDecimal(result: SxTResult, column: string): number {
  const col = result[column.toUpperCase()];
  if (!col) return 0;
  if (col.Decimal75) return Number(col.Decimal75[0] ?? "0");
  if (col.VarChar) return Number(col.VarChar[0] ?? "0");
  if (col.BigInt) return Number(col.BigInt[0] ?? "0");
  if (col.Int) return Number(col.Int[0] ?? 0);
  return 0;
}

type EvaluatorFn = (result: SxTResult) => boolean;

const evaluators: Record<string, EvaluatorFn> = {
  "diamond-hands": (r) => getInt(r, "QUALIFIES") > 0,
  "whale-alert": (r) => getInt(r, "QUALIFIES") > 0,
  "genesis-walker": (r) => getInt(r, "QUALIFIES") > 0,
  "defi-degen": (r) => getInt(r, "UNIQUE_CONTRACTS") >= 20,
  "uniswap-og": (r) => getInt(r, "QUALIFIES") > 0,
  "nft-collector": (r) => getInt(r, "NFT_COUNT") >= 10,
  "gas-guzzler": (r) => getBigInt(r, "TOTAL_GAS_SPENT") >= BigInt("10000000000000000000"), // 10 ETH in wei
  "contract-deployer": (r) => getInt(r, "QUALIFIES") > 0,
  "ethereum-villager": (r) => getInt(r, "TX_COUNT") >= 5,
  "the-contributor": (r) => getInt(r, "QUALIFIES") > 0,
};

export function evaluateResult(
  achievementId: string,
  rawResult: SxTResult
): boolean {
  const evaluator = evaluators[achievementId];
  if (!evaluator) return false;
  const result = normalizeResult(rawResult);
  return evaluator(result);
}
