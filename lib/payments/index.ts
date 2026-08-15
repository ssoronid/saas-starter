// Payments contract — app code always imports from here.
// This build ships without a payments provider. The functions stay exported so
// existing call sites keep compiling; swap in a payments-* extension to enable
// billing.

export const paymentsConfigured = false;

export type CheckoutOptions = {
  team: { id: number } | null;
  priceId: string;
};

export async function createCheckoutSession(_options: CheckoutOptions): Promise<never> {
  throw new Error('No payments provider configured for this project.');
}

export async function createCustomerPortalSession(
  _team: { id: number } | null
): Promise<{ url: string }> {
  throw new Error('No payments provider configured for this project.');
}

export async function handleSubscriptionChange(_event: unknown): Promise<void> {
  // No provider — nothing to reconcile.
}

export async function getStripePrices(): Promise<never[]> {
  return [];
}

export async function getStripeProducts(): Promise<never[]> {
  return [];
}
