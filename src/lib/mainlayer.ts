import MainlayerSDK from "@mainlayer/sdk";

const mainlayer = new MainlayerSDK({
  apiKey: process.env.REACT_APP_MAINLAYER_API_KEY ?? "",
});

export interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export async function checkSubscription(walletAddress: string): Promise<SubscriptionStatus> {
  const result = await mainlayer.subscriptions.check({ customer: walletAddress });
  return {
    active: result.status === "active",
    plan: result.plan ?? null,
    expiresAt: result.current_period_end ?? null,
  };
}

export async function createCheckoutUrl(
  walletAddress: string,
  planId: string
): Promise<string> {
  const session = await mainlayer.checkout.create({
    customer: walletAddress,
    plan: planId,
    success_url: `${window.location.origin}/dashboard?subscribed=true`,
    cancel_url: `${window.location.origin}/dashboard`,
  });
  return session.url;
}

export default mainlayer;
