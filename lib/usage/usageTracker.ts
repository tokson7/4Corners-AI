/**
 * Usage Tracking System
 * Tracks AI generation usage per user with monthly limits
 */

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import type { SubscriptionStatus } from "@/lib/subscription";

/**
 * Usage limit configuration per plan
 */
export const USAGE_LIMITS = {
  free: 3, // 3 generations per month
  pro: 50, // 50 generations per month
  team: Infinity, // Unlimited
} as const;

/**
 * Usage record structure
 */
export interface UsageRecord {
  userId: string;
  generationCount: number;
  resetDate: string; // ISO date string for next reset
  lastGenerationDate?: string; // ISO date string
}

// In-memory storage (TODO: Replace with database)
const usageStore: Map<string, UsageRecord> = new Map();

/**
 * Get current month's reset date (first day of next month)
 */
function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

/**
 * Check if usage record needs to be reset (monthly cycle)
 */
function shouldResetUsage(record: UsageRecord): boolean {
  const resetDate = new Date(record.resetDate);
  const now = new Date();
  return now >= resetDate;
}

/**
 * Get or create usage record for user
 */
function getUsageRecord(userId: string): UsageRecord {
  let record = usageStore.get(userId);

  // Create new record if doesn't exist
  if (!record) {
    record = {
      userId,
      generationCount: 0,
      resetDate: getNextResetDate(),
    };
    usageStore.set(userId, record);
    return record;
  }

  // Reset if monthly cycle has passed
  if (shouldResetUsage(record)) {
    record = {
      userId,
      generationCount: 0,
      resetDate: getNextResetDate(),
    };
    usageStore.set(userId, record);
  }

  return record;
}

/**
 * Get user's current usage status
 */
export async function getUserUsage(
  req: NextRequest
): Promise<{
  userId: string | null;
  usage: UsageRecord | null;
  limit: number;
  remaining: number;
  canGenerate: boolean;
}> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token?.id) {
      return {
        userId: null,
        usage: null,
        limit: 0,
        remaining: 0,
        canGenerate: false,
      };
    }

    const userId = token.id as string;
    const usage = getUsageRecord(userId);

    // Get user's subscription plan (default to free)
    // TODO: Fetch actual subscription from database
    const plan: keyof typeof USAGE_LIMITS = "free"; // Placeholder
    const limit = USAGE_LIMITS[plan];

    const remaining = limit === Infinity 
      ? Infinity 
      : Math.max(0, limit - usage.generationCount);

    const canGenerate = limit === Infinity || usage.generationCount < limit;

    return {
      userId,
      usage,
      limit,
      remaining,
      canGenerate,
    };
  } catch (error) {
    console.error("Failed to get user usage:", error);
    return {
      userId: null,
      usage: null,
      limit: 0,
      remaining: 0,
      canGenerate: false,
    };
  }
}

/**
 * Increment usage count for user
 */
export async function incrementUsage(
  req: NextRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = token.id as string;
    const usage = getUsageRecord(userId);

    // Check limit before incrementing
    // TODO: Get actual subscription plan from database
    const plan: keyof typeof USAGE_LIMITS = "free"; // Placeholder
    const limit = USAGE_LIMITS[plan];

    if (limit !== Infinity && usage.generationCount >= limit) {
      return {
        success: false,
        error: "Usage limit reached. Upgrade your plan to continue generating.",
      };
    }

    // Increment usage
    usage.generationCount += 1;
    usage.lastGenerationDate = new Date().toISOString();
    usageStore.set(userId, usage);

    // TODO: Save to database

    return { success: true };
  } catch (error) {
    console.error("Failed to increment usage:", error);
    return { success: false, error: "Failed to track usage" };
  }
}

/**
 * Get usage statistics for a user (for dashboard)
 */
export async function getUsageStats(
  req: NextRequest
): Promise<{
  generationCount: number;
  limit: number;
  remaining: number;
  resetDate: string;
  canGenerate: boolean;
} | null> {
  try {
    const usageData = await getUserUsage(req);
    
    if (!usageData.userId || !usageData.usage) {
      return null;
    }

    return {
      generationCount: usageData.usage.generationCount,
      limit: usageData.limit,
      remaining: usageData.remaining === Infinity ? Infinity : usageData.remaining,
      resetDate: usageData.usage.resetDate,
      canGenerate: usageData.canGenerate,
    };
  } catch (error) {
    console.error("Failed to get usage stats:", error);
    return null;
  }
}

/**
 * Reset usage for a user (admin function, for testing)
 */
export function resetUserUsage(userId: string): void {
  usageStore.delete(userId);
}
