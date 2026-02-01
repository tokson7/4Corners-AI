// lib/stripe/config.ts
import Stripe from 'stripe';

// Validate Stripe configuration
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_YOUR_')) {
  console.warn('[Stripe Config] ⚠️  STRIPE_SECRET_KEY is not configured properly');
  console.warn('[Stripe Config] Payments will not work until you add real Stripe keys');
  console.warn('[Stripe Config] Get your keys from: https://dashboard.stripe.com/test/apikeys');
}

// Initialize Stripe even with dummy key to prevent crashes
export const stripe = new Stripe(stripeSecretKey || 'sk_test_dummy', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Pricing configuration
export const STRIPE_PLANS = {
  basic: {
    name: 'Basic',
    priceId: process.env.STRIPE_PRICE_ID_BASIC || '',
    price: 9,
    credits: 50,
    features: ['50 generations/month', 'Basic components', 'Email support'],
  },
  pro: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRICE_ID_PRO || '',
    price: 29,
    credits: 200,
    features: ['200 generations/month', 'All components', 'Priority support', 'Custom exports'],
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
    price: 99,
    credits: 1000,
    features: ['1000 generations/month', 'Custom components', '24/7 support', 'API access', 'White-label'],
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;
