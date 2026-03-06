"use client";

import { useState, useCallback } from "react";

type MintStatus = "idle" | "minting" | "success" | "error";

interface MintResult {
  mintTxHash: string;
  tokenId: string | null;
  explorerUrl: string;
  alreadyMinted?: boolean;
}

export function useMintBadge() {
  const [status, setStatus] = useState<MintStatus>("idle");
  const [data, setData] = useState<MintResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(async (wallet: string, badgeId: string) => {
    setStatus("minting");
    setData(null);
    setError(null);

    try {
      const res = await fetch("/api/mint-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, badgeId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Mint failed");
      }

      setData(json);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { mint, status, data, error, reset };
}
