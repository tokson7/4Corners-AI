/**
 * Subscription and Feature Gating Utilities
 */

export type SubscriptionPlan = "free" | "pro" | "team";

/**
 * Get effective plan for user (checks team membership)
 * TODO: Integrate with team API to get team plan
 */
export async function getEffectivePlan(
  userPlan: SubscriptionPlan | null,
  teamPlan?: SubscriptionPlan | null
): Promise<SubscriptionPlan> {
  // Team plan takes precedence
  if (teamPlan && teamPlan !== "free") {
    return teamPlan;
  }
  return userPlan || "free";
}

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  status: "active" | "canceled" | "past_due" | "trialing";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(
  subscription: SubscriptionStatus | null,
  requiredPlan: SubscriptionPlan
): boolean {
  if (!subscription) return requiredPlan === "free";

  const planHierarchy: Record<SubscriptionPlan, number> = {
    free: 0,
    pro: 1,
    team: 2,
  };

  // Check if subscription is active
  if (subscription.status !== "active" && subscription.status !== "trialing") {
    return requiredPlan === "free";
  }

  return planHierarchy[subscription.plan] >= planHierarchy[requiredPlan];
}

/**
 * Check if user can export
 */
export function canExport(subscription: SubscriptionStatus | null): boolean {
  return hasFeatureAccess(subscription, "pro");
}

/**
 * Check if user can access advanced components
 */
export function canAccessAdvancedComponents(
  subscription: SubscriptionStatus | null
): boolean {
  return hasFeatureAccess(subscription, "pro");
}

/**
 * Check if user has unlimited generations
 */
export function hasUnlimitedGenerations(
  subscription: SubscriptionStatus | null
): boolean {
  return hasFeatureAccess(subscription, "pro");
}

/**
 * Get generation limit for user
 */
export function getGenerationLimit(
  subscription: SubscriptionStatus | null
): number {
  if (hasUnlimitedGenerations(subscription)) {
    return Infinity;
  }
  return 5; // Free tier limit
}
