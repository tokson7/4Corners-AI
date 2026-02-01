/**
 * Stripe Configuration
 * Server-side Stripe instance for payment processing
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

/**
 * Stripe instance for server-side operations
 * Used for creating checkout sessions, managing subscriptions, and webhook handling
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
  appInfo: {
    name: 'DesignForge AI',
    version: '1.0.0',
  },
});

/**
 * Price IDs from Stripe Dashboard
 * These must match the products created in your Stripe account
 */
export const STRIPE_PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_ID_BASIC || '',
  professional: process.env.STRIPE_PRICE_ID_PRO || '',
  enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
} as const;

/**
 * Plan configuration
 * Maps plan names to their Stripe price IDs and features
 */
export const PLAN_CONFIG = {
  free: {
    name: 'Free',
    priceId: null,
    price: 0,
    interval: null,
    credits: 10,
    features: [
      '10 generations per month',
      'Basic color palettes',
      'Standard typography',
      'Community support',
    ],
  },
  basic: {
    name: 'Basic',
    priceId: STRIPE_PRICE_IDS.basic,
    price: 9,
    interval: 'month' as const,
    credits: 50,
    features: [
      '50 generations per month',
      'Advanced color palettes',
      'Premium typography',
      'Priority support',
      'Export to Figma',
    ],
  },
  professional: {
    name: 'Professional',
    priceId: STRIPE_PRICE_IDS.professional,
    price: 29,
    interval: 'month' as const,
    credits: 200,
    features: [
      '200 generations per month',
      'All color palettes',
      'All typography options',
      'Priority support',
      'Export to all formats',
      'API access',
      'Custom branding',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    priceId: STRIPE_PRICE_IDS.enterprise,
    price: 99,
    interval: 'month' as const,
    credits: 1000,
    features: [
      'Unlimited generations',
      'All premium features',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration',
      'Advanced analytics',
      'SLA guarantee',
    ],
  },
} as const;

export type PlanType = keyof typeof PLAN_CONFIG;
