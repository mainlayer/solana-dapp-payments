import { useState, useEffect, useCallback, useRef } from "react";
import {
  checkSubscription,
  createCheckoutUrl,
  SubscriptionStatus,
} from "../lib/mainlayer";

interface UseMainlayerReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  isPremium: boolean;
  subscribe: (planId: string) => Promise<void>;
  refresh: () => Promise<void>;
  daysUntilExpiry?: number;
}

/**
 * React hook for managing Mainlayer subscription state.
 *
 * Automatically checks subscription status when wallet connects,
 * provides methods to subscribe or refresh, and exposes premium tier status.
 *
 * @param walletAddress The connected wallet address (or null if disconnected)
 * @returns Subscription state and control methods
 *
 * @example
 * const { isPremium, subscribe, loading } = useMainlayer(walletAddress);
 *
 * if (isPremium) {
 *   return <PremiumFeatures />;
 * }
 *
 * return (
 *   <button onClick={() => subscribe("pro")}>
 *     Upgrade to Premium
 *   </button>
 * );
 */
export function useMainlayer(walletAddress: string | null): UseMainlayerReturn {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setStatus(null);
      return;
    }

    // Cancel previous requests
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await checkSubscription(walletAddress);
      setStatus(result);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        const message =
          err instanceof Error ? err.message : "Failed to check subscription";
        console.error("[useMainlayer] Error:", message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh, walletAddress]);

  const subscribe = useCallback(
    async (planId: string) => {
      if (!walletAddress) {
        throw new Error("No wallet connected. Please connect a wallet first.");
      }
      if (!planId) {
        throw new Error("Plan ID is required");
      }

      try {
        const url = await createCheckoutUrl(walletAddress, planId);
        // Redirect to checkout
        window.location.href = url;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create checkout";
        console.error("[useMainlayer] Subscribe error:", message);
        throw new Error(message);
      }
    },
    [walletAddress]
  );

  const daysUntilExpiry = status?.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(status.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : undefined;

  return {
    status,
    loading,
    error,
    isPremium: status?.active ?? false,
    subscribe,
    refresh,
    daysUntilExpiry,
  };
}
