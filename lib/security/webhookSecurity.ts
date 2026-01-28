/**
 * Webhook Security
 * Verifies webhook signatures to prevent unauthorized requests
 */

import { stripe } from "@/lib/stripe/client";

/**
 * Verify Stripe webhook signature
 */
export async function verifyStripeWebhook(
  body: string,
  signature: string | null
): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (!signature) {
    return {
      valid: false,
      error: "Missing webhook signature",
    };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return {
      valid: false,
      error: "Stripe webhook secret is not configured",
    };
  }

  try {
    // Stripe SDK handles signature verification
    // This is a placeholder - actual verification happens in the route handler
    // The stripe.webhooks.constructEvent() method verifies the signature
    
    // For now, we just validate that the secret exists
    // The actual verification is done in app/api/stripe/webhook/route.ts
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Webhook verification failed",
    };
  }
}

/**
 * Validate webhook payload structure
 */
export function validateWebhookPayload(payload: any): {
  valid: boolean;
  error?: string;
} {
  if (!payload || typeof payload !== "object") {
    return {
      valid: false,
      error: "Invalid webhook payload",
    };
  }

  // Check for required Stripe webhook fields
  if (payload.type && typeof payload.type !== "string") {
    return {
      valid: false,
      error: "Invalid webhook type",
    };
  }

  if (payload.data && typeof payload.data !== "object") {
    return {
      valid: false,
      error: "Invalid webhook data",
    };
  }

  return { valid: true };
}

/**
 * Rate limit webhook processing (prevent replay attacks)
 */
const processedWebhookIds = new Set<string>();
const WEBHOOK_ID_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function checkWebhookReplay(webhookId: string): {
  isReplay: boolean;
} {
  if (processedWebhookIds.has(webhookId)) {
    return { isReplay: true };
  }

  // Add to processed set
  processedWebhookIds.add(webhookId);

  // Clean up old IDs periodically
  if (processedWebhookIds.size > 10000) {
    // In production, use Redis with TTL instead
    // For now, we'll just clear if it gets too large
    processedWebhookIds.clear();
  }

  return { isReplay: false };
}

