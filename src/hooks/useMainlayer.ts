import { useState, useEffect, useCallback } from "react";
import { checkSubscription, createCheckoutUrl, SubscriptionStatus } from "../lib/mainlayer";

interface UseMainlayerReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  isPremium: boolean;
  subscribe: (planId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * React hook that wraps Mainlayer subscription state for a connected wallet.
 */
export function useMainlayer(walletAddress: string | null): UseMainlayerReturn {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setStatus(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await checkSubscription(walletAddress);
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check subscription");
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const subscribe = useCallback(
    async (planId: string) => {
      if (!walletAddress) {
        throw new Error("No wallet connected");
      }
      const url = await createCheckoutUrl(walletAddress, planId);
      window.location.href = url;
    },
    [walletAddress]
  );

  return {
    status,
    loading,
    error,
    isPremium: status?.active ?? false,
    subscribe,
    refresh,
  };
}
