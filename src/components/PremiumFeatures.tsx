import React from "react";
import { useMainlayer } from "../hooks/useMainlayer";

interface PremiumFeaturesProps {
  walletAddress: string | null;
}

/**
 * Renders premium dashboard features gated behind a Mainlayer subscription.
 */
export function PremiumFeatures({ walletAddress }: PremiumFeaturesProps) {
  const { isPremium, loading, error, subscribe, status } = useMainlayer(walletAddress);

  if (!walletAddress) {
    return (
      <div className="premium-gate">
        <p>Connect your wallet to access premium features.</p>
      </div>
    );
  }

  if (loading) {
    return <div aria-live="polite">Checking subscription…</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!isPremium) {
    return (
      <div className="premium-gate">
        <h3>Unlock Premium Features</h3>
        <p>Get real-time analytics, advanced charts, and priority support.</p>
        <button onClick={() => subscribe("pro")}>
          Subscribe with Mainlayer
        </button>
      </div>
    );
  }

  return (
    <div className="premium-features">
      <h3>Premium Dashboard</h3>
      <p>Plan: <strong>{status?.plan ?? "Pro"}</strong></p>
      <ul>
        <li>Real-time portfolio analytics</li>
        <li>Advanced charting tools</li>
        <li>Priority customer support</li>
        <li>API access (unlimited requests)</li>
      </ul>
    </div>
  );
}
