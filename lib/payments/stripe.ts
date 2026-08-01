import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import {
  getStripeDataForTeam,
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription,
  upsertStripeData,
} from '@/lib/db/queries';

/** Payments stay dormant until a key is present, so the app deploys without one. */
export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set. Add it to enable payments.');
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }
  return stripeInstance;
}

// Constructed lazily: importing this module must not throw when the key is
// absent, or every route that touches payments would fail to build.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export async function createCheckoutSession({
  team,
  priceId,
}: {
  team: Team | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const existing = await getStripeDataForTeam(team.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: existing?.customerId ?? undefined,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
    subscription_data: { trial_period_days: 14 },
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team) {
  const existing = await getStripeDataForTeam(team.id);

  if (!existing?.customerId || !existing?.productId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(existing.productId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: { headline: 'Manage your subscription' },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
        payment_method_update: { enabled: true },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: existing.customerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateTeamSubscription(team.id, {
      subscriptionId: subscription.id,
      productId: plan?.product as string,
      planName: (plan?.product as Stripe.Product)?.name ?? null,
      subscriptionStatus: status,
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateTeamSubscription(team.id, {
      subscriptionId: null,
      productId: null,
      planName: null,
      subscriptionStatus: status,
    });
  }
}

export async function syncStripeCustomer(teamId: number, customerId: string) {
  await upsertStripeData(teamId, { customerId });
}

export async function getStripePrices() {
  if (!stripeConfigured) return [];

  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days,
  }));
}

export async function getStripeProducts() {
  if (!stripeConfigured) return [];

  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id,
  }));
}
