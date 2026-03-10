/**
 * SXT Gateway Proxy — executes SQL against MakeInfinite managed DB.
 *
 * Uses the Gateway (Secrets Proxy) endpoint which handles SxT Network auth
 * automatically via the API key. No ZK proof in this path — plain SQL results.
 *
 * When the SDK's queryAndVerify() ZK flow is fixed, swap back to it.
 */

const GATEWAY_URL = "https://proxy.api.makeinfinite.dev/v1/sql";

/** SxTResult mimics the shape the evaluators expect from the SDK */
export type SxTResult = Record<
  string,
  { Int?: number[]; BigInt?: string[]; VarChar?: string[]; Decimal75?: string[] }
>;

/**
 * Convert gateway JSON rows ([{COL: value}, ...]) to the SxTResult format
 * that evaluators already understand.
 */
function gatewayToSxTResult(rows: Record<string, unknown>[]): SxTResult {
  if (!rows.length) return {};
  const row = rows[0]; // queries return aggregate single-row results
  const result: SxTResult = {};

  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "number") {
      result[key] = { Int: [value] };
    } else if (typeof value === "string") {
      // Large numeric strings → BigInt, otherwise VarChar
      if (/^-?\d+$/.test(value)) {
        result[key] = { BigInt: [value] };
      } else {
        result[key] = { VarChar: [value] };
      }
    }
  }
  return result;
}

export async function queryAndVerify(sql: string): Promise<SxTResult> {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SXT] ═══ Starting gateway query ═══");
    console.log("[SXT] SQL:", sql.substring(0, 120));
  }

  const apiKey = process.env.SXT_API_KEY;
  if (!apiKey || apiKey === "your_sxt_api_key_here") {
    throw new Error("SXT_API_KEY is not configured in .env.local");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let resp: Response;
  try {
    resp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        apikey: apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ sqlText: sql }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("SXT query timed out after 60s");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`SXT Gateway error ${resp.status}: ${body}`);
  }

  const rows: Record<string, unknown>[] = await resp.json();
  const result = gatewayToSxTResult(rows);

  if (process.env.NODE_ENV !== "production") {
    console.log("[SXT] ═══ Query complete ═══");
    console.log("[SXT] Rows:", rows.length, "Result:", JSON.stringify(result));
  }
  return result;
}
