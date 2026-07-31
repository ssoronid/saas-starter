// Payments contract — app code always imports from here.
// Swap this file (via a payments-* extension) to change providers without touching the app.
export {
  createCheckoutSession,
  createCustomerPortalSession,
  handleSubscriptionChange,
  getStripePrices,
  getStripeProducts,
} from './stripe';
