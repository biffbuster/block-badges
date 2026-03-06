"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useReadContract,
  useAccount,
} from "wagmi";
import { parseEther, type Log } from "viem";
import {
  BADGE_VERIFIER_ABI,
  ERC20_ABI,
  BADGE_TYPE_IDS,
} from "@/lib/contract";

// ─── Addresses from env (client-accessible) ─────────────────
const SXT_TOKEN =
  (process.env.NEXT_PUBLIC_SXT_TOKEN_ADDRESS as `0x${string}`) ??
  "0xE6Bfd33F52d82Ccb5b37E16D3dD81f9FFDAbB195";

const BADGE_VERIFIER =
  (process.env.NEXT_PUBLIC_BADGE_VERIFIER_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";

const QUERY_PAYMENT = parseEther("100"); // 100 SXT

// ─── Types ───────────────────────────────────────────────────
export type VerifyStep =
  | "idle"
  | "approving"
  | "approve-confirming"
  | "submitting"
  | "submit-confirming"
  | "waiting-callback"
  | "verified"
  | "not-qualified"
  | "error";

interface VerifyResult {
  qualified: boolean;
  queryId: string | null;
  approveTxHash: string | null;
  verifyTxHash: string | null;
}

// ─── Hook ────────────────────────────────────────────────────
export function useVerifyBadgeOnChain() {
  const { address } = useAccount();
  const [step, setStep] = useState<VerifyStep>("idle");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [badgeTypeId, setBadgeTypeId] = useState<number | null>(null);

  // Track hashes for receipt waiting
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [verifyTxHash, setVerifyTxHash] = useState<`0x${string}` | undefined>();

  // Callback listener ref to prevent stale closures
  const waitingRef = useRef(false);

  // ─── Contract writes ────────────────────────────────────
  const {
    writeContract: writeApprove,
    isPending: _isApprovePending,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: writeVerify,
    isPending: _isVerifyPending,
    error: verifyError,
  } = useWriteContract();

  // ─── Transaction receipts ───────────────────────────────
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const { isSuccess: verifyConfirmed } = useWaitForTransactionReceipt({
    hash: verifyTxHash,
  });

  // ─── SXT balance ────────────────────────────────────────
  const { data: sxtBalance } = useReadContract({
    address: SXT_TOKEN,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // ─── Watch for BadgeVerified events ─────────────────────
  useWatchContractEvent({
    address: BADGE_VERIFIER,
    abi: BADGE_VERIFIER_ABI,
    eventName: "BadgeVerified",
    onLogs(logs: Log[]) {
      if (!waitingRef.current || !address) return;

      for (const log of logs) {
        // Decode the event - topics[1] is wallet (indexed), topics[2] is badgeTypeId (indexed)
        const eventWallet = log.topics[1];
        const paddedAddress = `0x${address.toLowerCase().slice(2).padStart(64, "0")}`;

        if (eventWallet?.toLowerCase() === paddedAddress.toLowerCase()) {
          waitingRef.current = false;

          // data contains: qualified (bool) + queryId (bytes32)
          const data = log.data;
          // qualified is the first 32 bytes (bool padded to 32 bytes)
          const qualifiedHex = data.slice(0, 66); // 0x + 64 chars
          const qualified = BigInt(qualifiedHex) !== BigInt(0);
          // queryId is the next 32 bytes
          const queryId = "0x" + data.slice(66, 130);

          setResult({
            qualified,
            queryId,
            approveTxHash: approveTxHash ?? null,
            verifyTxHash: verifyTxHash ?? null,
          });
          setStep(qualified ? "verified" : "not-qualified");
          return;
        }
      }
    },
  });

  // ─── Step transitions ───────────────────────────────────

  // After approve confirmed → submit verification
  useEffect(() => {
    if (approveConfirmed && step === "approve-confirming" && badgeTypeId !== null) {
      setStep("submitting");
      writeVerify(
        {
          address: BADGE_VERIFIER,
          abi: BADGE_VERIFIER_ABI,
          functionName: "verifyBadge",
          args: [BigInt(badgeTypeId)],
        },
        {
          onSuccess: (hash) => {
            setVerifyTxHash(hash);
            setStep("submit-confirming");
          },
          onError: (err) => {
            setError(err.message);
            setStep("error");
          },
        }
      );
    }
  }, [approveConfirmed, step, badgeTypeId, writeVerify]);

  // After verify confirmed → wait for callback
  useEffect(() => {
    if (verifyConfirmed && step === "submit-confirming") {
      waitingRef.current = true;
      setStep("waiting-callback");
    }
  }, [verifyConfirmed, step]);

  // Handle write errors
  useEffect(() => {
    if (approveError && step === "approving") {
      setError(approveError.message);
      setStep("error");
    }
  }, [approveError, step]);

  useEffect(() => {
    if (verifyError && step === "submitting") {
      setError(verifyError.message);
      setStep("error");
    }
  }, [verifyError, step]);

  // ─── Start verification ─────────────────────────────────
  const verify = useCallback(
    (cardId: string) => {
      if (!address) {
        setError("Wallet not connected");
        setStep("error");
        return;
      }

      const typeId = BADGE_TYPE_IDS[cardId];
      if (!typeId) {
        setError("Invalid badge ID");
        setStep("error");
        return;
      }

      // Reset state
      setError(null);
      setResult(null);
      setApproveTxHash(undefined);
      setVerifyTxHash(undefined);
      setBadgeTypeId(typeId);
      waitingRef.current = false;

      // Step 1: Approve SXT spend
      setStep("approving");
      writeApprove(
        {
          address: SXT_TOKEN,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [BADGE_VERIFIER, QUERY_PAYMENT],
        },
        {
          onSuccess: (hash) => {
            setApproveTxHash(hash);
            setStep("approve-confirming");
          },
          onError: (err) => {
            setError(err.message);
            setStep("error");
          },
        }
      );
    },
    [address, writeApprove]
  );

  // ─── Reset ──────────────────────────────────────────────
  const reset = useCallback(() => {
    setStep("idle");
    setResult(null);
    setError(null);
    setBadgeTypeId(null);
    setApproveTxHash(undefined);
    setVerifyTxHash(undefined);
    waitingRef.current = false;
  }, []);

  return {
    verify,
    step,
    result,
    error,
    reset,
    sxtBalance: sxtBalance as bigint | undefined,
    approveTxHash,
    verifyTxHash,
  };
}
