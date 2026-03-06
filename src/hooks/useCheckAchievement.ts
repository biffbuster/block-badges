"use client";

import { useState, useCallback } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface CheckResult {
  verified: boolean;
  qualified: boolean;
  achievementId: string;
  achievementName: string;
  result: unknown;
}

export function useCheckAchievement() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (wallet: string, achievementId: string) => {
    setStatus("loading");
    setData(null);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      let res: Response;
      try {
        res = await fetch("/api/check-achievement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet, achievementId }),
          signal: controller.signal,
        });
      } catch (err: unknown) {
        clearTimeout(timeout);
        if (err instanceof DOMException && err.name === "AbortError") {
          throw new Error("Request timed out after 60s");
        }
        throw err;
      }
      clearTimeout(timeout);

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Verification failed");
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

  return { check, status, data, error, reset };
}
