/**
 * Example: check subscription status for a wallet.
 *
 * REACT_APP_MAINLAYER_API_KEY=ml_... npx ts-node examples/connect-wallet.ts
 */

import { checkSubscription } from "../src/lib/mainlayer";

async function main() {
  const wallet = process.env.DEMO_WALLET ?? "FakeWallet111111111111111111111111111111111";
  console.log(`Checking subscription for: ${wallet}`);
  const status = await checkSubscription(wallet);
  console.log("Active:", status.active);
  console.log("Plan:", status.plan);
  console.log("Expires:", status.expiresAt);
}

main().catch(console.error);
