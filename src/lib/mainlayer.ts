import MainlayerSDK from "@mainlayer/sdk";

const apiKey = process.env.REACT_APP_MAINLAYER_API_KEY;

if (!apiKey) {
  console.warn(
    "[Mainlayer] REACT_APP_MAINLAYER_API_KEY not set. " +
    "Subscription features will not work."
  );
}

const mainlayer = new MainlayerSDK({
  apiKey: apiKey ?? "",
});

export interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  expiresAt: string | null;
  status?: "active" | "trialing" | "past_due" | "cancelled";
}

/**
 * Check subscription status for a wallet address.
 *
 * @param walletAddress The Solana wallet address to check
 * @returns Subscription status including active state and plan details
 * @throws Error if the API call fails
 *
 * @example
 * const status = await checkSubscription("BxPr....");
 * if (status.active) {
 *   console.log(`User has ${status.plan} plan`);
 * }
 */
export async function checkSubscription(
  walletAddress: string
): Promise<SubscriptionStatus> {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const result = await mainlayer.subscriptions.check({ customer: walletAddress });
    return {
      active: result.status === "active" || result.status === "trialing",
      plan: result.plan ?? null,
      expiresAt: result.current_period_end ?? null,
      status: result.status,
    };
  } catch (error) {
    console.error("[Mainlayer] Subscription check failed:", error);
    throw new Error(
      `Failed to check subscription: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create a checkout URL for subscribing to a plan.
 *
 * @param walletAddress The customer's wallet address
 * @param planId The plan ID to subscribe to
 * @returns Hosted checkout URL
 * @throws Error if checkout creation fails
 *
 * @example
 * const url = await createCheckoutUrl("BxPr...", "pro-monthly");
 * window.location.href = url; // Redirect user to checkout
 */
export async function createCheckoutUrl(
  walletAddress: string,
  planId: string
): Promise<string> {
  if (!walletAddress || !planId) {
    throw new Error("Wallet address and plan ID are required");
  }

  try {
    const session = await mainlayer.checkout.create({
      customer: walletAddress,
      plan: planId,
      success_url: `${window.location.origin}/dashboard?subscribed=true`,
      cancel_url: `${window.location.origin}/dashboard`,
    });

    if (!session.url) {
      throw new Error("No checkout URL returned");
    }

    return session.url;
  } catch (error) {
    console.error("[Mainlayer] Checkout creation failed:", error);
    throw new Error(
      `Failed to create checkout: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Check if Mainlayer is properly configured.
 */
export function isConfigured(): boolean {
  return !!apiKey;
}

export default mainlayer;
