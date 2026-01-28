/**
 * Credit-Based AI Usage System
 * Tracks and manages AI credits for users
 */

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import type { SubscriptionPlan } from "@/lib/subscription";

/**
 * Credit costs for different AI actions
 */
export const CREDIT_COSTS = {
  GENERATE_COLORS: 1, // Generate colors only
  GENERATE_FULL_SYSTEM: 3, // Generate full design system (colors + typography + components)
  EXPORT_ADVANCED: 2, // Export advanced formats (Figma, Vue, etc.)
} as const;

/**
 * Initial credit balance per plan
 */
export const INITIAL_CREDITS = {
  free: 5, // 5 credits to start
  pro: 100, // 100 credits per month (resets monthly)
  team: Infinity, // Unlimited credits
} as const;

/**
 * Credit record structure
 */
export interface CreditRecord {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  resetDate?: string; // For monthly reset (Pro plan)
  lastUpdated: string;
}

// In-memory storage (TODO: Replace with database)
const creditStore: Map<string, CreditRecord> = new Map();

/**
 * Get next month's reset date (first day of next month)
 */
function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

/**
 * Check if credit record needs monthly reset
 */
function shouldResetCredits(record: CreditRecord, plan: SubscriptionPlan): boolean {
  if (plan === "free" || plan === "team") {
    return false; // Free doesn't reset, Team is unlimited
  }
  
  if (!record.resetDate) {
    return false;
  }

  const resetDate = new Date(record.resetDate);
  const now = new Date();
  return now >= resetDate;
}

/**
 * Get or create credit record for user
 */
function getCreditRecord(userId: string, plan: SubscriptionPlan = "free"): CreditRecord {
  let record = creditStore.get(userId);

  // Create new record if doesn't exist
  if (!record) {
    const initialBalance = INITIAL_CREDITS[plan];
    record = {
      userId,
      balance: initialBalance === Infinity ? Infinity : initialBalance,
      totalEarned: initialBalance === Infinity ? Infinity : initialBalance,
      totalSpent: 0,
      resetDate: plan === "pro" ? getNextResetDate() : undefined,
      lastUpdated: new Date().toISOString(),
    };
    creditStore.set(userId, record);
    return record;
  }

  // Reset monthly credits for Pro plan
  if (shouldResetCredits(record, plan)) {
    const monthlyCredits = INITIAL_CREDITS.pro;
    record = {
      userId,
      balance: monthlyCredits,
      totalEarned: (record.totalEarned === Infinity ? 0 : record.totalEarned) + monthlyCredits,
      totalSpent: 0,
      resetDate: getNextResetDate(),
      lastUpdated: new Date().toISOString(),
    };
    creditStore.set(userId, record);
  }

  return record;
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(
  req: NextRequest
): Promise<{
  userId: string | null;
  credits: CreditRecord | null;
  plan: SubscriptionPlan;
  canAfford: (cost: number) => boolean;
}> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token?.id) {
      return {
        userId: null,
        credits: null,
        plan: "free",
        canAfford: () => false,
      };
    }

    const userId = token.id as string;
    
    // TODO: Fetch actual subscription plan from database
    const plan: SubscriptionPlan = "free"; // Placeholder
    const credits = getCreditRecord(userId, plan);

    const canAfford = (cost: number) => {
      if (credits.balance === Infinity) return true;
      return credits.balance >= cost;
    };

    return {
      userId,
      credits,
      plan,
      canAfford,
    };
  } catch (error) {
    console.error("Failed to get user credits:", error);
    return {
      userId: null,
      credits: null,
      plan: "free",
      canAfford: () => false,
    };
  }
}

/**
 * Deduct credits for an action
 */
export async function deductCredits(
  req: NextRequest,
  cost: number,
  action: string
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = token.id as string;
    
    // TODO: Fetch actual subscription plan from database
    const plan: SubscriptionPlan = "free"; // Placeholder
    const credits = getCreditRecord(userId, plan);

    // Check if user can afford the action
    if (credits.balance !== Infinity && credits.balance < cost) {
      return {
        success: false,
        error: `Insufficient credits. You need ${cost} credits but only have ${credits.balance}.`,
      };
    }

    // Deduct credits atomically
    if (credits.balance !== Infinity) {
      credits.balance -= cost;
      credits.totalSpent += cost;
    }
    credits.lastUpdated = new Date().toISOString();
    creditStore.set(userId, credits);

    // TODO: Save to database

    return {
      success: true,
      newBalance: credits.balance === Infinity ? Infinity : credits.balance,
    };
  } catch (error) {
    console.error("Failed to deduct credits:", error);
    return { success: false, error: "Failed to process credits" };
  }
}

/**
 * Get credit statistics for dashboard
 */
export async function getCreditStats(
  req: NextRequest
): Promise<{
  balance: number;
  totalEarned: number;
  totalSpent: number;
  resetDate?: string;
  plan: SubscriptionPlan;
} | null> {
  try {
    const creditData = await getUserCredits(req);
    
    if (!creditData.userId || !creditData.credits) {
      return null;
    }

    return {
      balance: creditData.credits.balance === Infinity ? Infinity : creditData.credits.balance,
      totalEarned: creditData.credits.totalEarned === Infinity ? Infinity : creditData.credits.totalEarned,
      totalSpent: creditData.credits.totalSpent,
      resetDate: creditData.credits.resetDate,
      plan: creditData.plan,
    };
  } catch (error) {
    console.error("Failed to get credit stats:", error);
    return null;
  }
}

/**
 * Add credits to user (for testing or rewards)
 */
export function addCredits(userId: string, amount: number): void {
  const record = creditStore.get(userId);
  if (record && record.balance !== Infinity) {
    record.balance += amount;
    record.totalEarned += amount;
    record.lastUpdated = new Date().toISOString();
    creditStore.set(userId, record);
  }
}

/**
 * Reset credits for a user (admin function)
 */
export function resetUserCredits(userId: string, plan: SubscriptionPlan = "free"): void {
  creditStore.delete(userId);
  getCreditRecord(userId, plan);
}
