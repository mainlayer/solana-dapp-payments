# solana-dapp-payments
![CI](https://github.com/mainlayer/solana-dapp-payments/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

DeFi dashboard React app where premium features are gated behind a Mainlayer subscription. Connect your wallet — free features work immediately, premium unlocks via Mainlayer.

## Install

```bash
npm install @mainlayer/sdk
```

## Quickstart

```typescript
import { useMainlayer } from "./src/hooks/useMainlayer";

function Dashboard({ wallet }: { wallet: string }) {
  const { isPremium, subscribe, loading } = useMainlayer(wallet);

  if (!isPremium) {
    return <button onClick={() => subscribe("pro")}>Unlock Premium</button>;
  }
  return <PremiumDashboard />;
}
```

Set your environment variable:

```bash
REACT_APP_MAINLAYER_API_KEY=ml_your_key_here
```

## Features

- `useMainlayer(wallet)` — React hook for subscription state
- `PremiumFeatures` — drop-in gated component
- Checkout redirect via Mainlayer hosted page

📚 [mainlayer.fr](https://mainlayer.fr)
