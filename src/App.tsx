import React, { useState } from "react";
import { PremiumFeatures } from "./components/PremiumFeatures";

/**
 * Main app: simulates wallet connection and renders the premium features gate.
 * In a real app, replace `mockWallet` with your wallet adapter (e.g. Wallet Adapter).
 */
export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);

  const connectWallet = () => {
    // Replace with real wallet adapter connection
    setWallet("FakeWallet111111111111111111111111111111111");
  };

  const disconnectWallet = () => setWallet(null);

  return (
    <div className="app">
      <header>
        <h1>DeFi Dashboard</h1>
        {wallet ? (
          <div>
            <span title={wallet}>
              {wallet.slice(0, 4)}…{wallet.slice(-4)}
            </span>
            <button onClick={disconnectWallet}>Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      <main>
        <section>
          <h2>Portfolio Overview</h2>
          <p>Free tier: basic portfolio tracking available for all users.</p>
        </section>

        <section>
          <h2>Premium Features</h2>
          <PremiumFeatures walletAddress={wallet} />
        </section>
      </main>
    </div>
  );
}
