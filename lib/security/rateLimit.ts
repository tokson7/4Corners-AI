/**
 * Production-Grade Rate Limiting
 * Different limits for free vs authenticated users
 */

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Rate limit storage (in-memory, TODO: Use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  free: {
    requests: 10,
    window: 60 * 1000, // 1 minute
  },
  authenticated: {
    requests: 30,
    window: 60 * 1000, // 1 minute
  },
} as const;

/**
 * Check rate limit for a request
 * Returns success status and remaining requests
 */
export async function checkRateLimit(
  req: NextRequest,
  options?: {
    identifier?: string;
    limit?: number;
    window?: number;
  }
): Promise<{
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}> {
  // Get identifier (user ID or IP address)
  let identifier: string;
  
  if (options?.identifier) {
    identifier = options.identifier;
  } else {
    // Try to get user ID from token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.id) {
      identifier = `user:${token.id}`;
    } else {
      // Fall back to IP address
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
      identifier = `ip:${ip}`;
    }
  }

  // Determine rate limit based on authentication status
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token?.id;
  
  const limit = options?.limit ?? (isAuthenticated ? RATE_LIMITS.authenticated.requests : RATE_LIMITS.free.requests);
  const window = options?.window ?? (isAuthenticated ? RATE_LIMITS.authenticated.window : RATE_LIMITS.free.window);

  const now = Date.now();
  const key = `${identifier}:${limit}:${window}`;
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // Create new record or reset expired one
    const newRecord = {
      count: 1,
      resetAt: now + window,
    };
    rateLimitStore.set(key, newRecord);
    
    // Clean up old records periodically
    if (rateLimitStore.size > 10000) {
      cleanupExpiredRecords();
    }
    
    return {
      success: true,
      remaining: limit - 1,
      resetAt: newRecord.resetAt,
      limit,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      limit,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);

  return {
    success: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
    limit,
  };
}

/**
 * Clean up expired rate limit records
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get rate limit info for a request (without incrementing)
 */
export async function getRateLimitInfo(
  req: NextRequest
): Promise<{
  remaining: number;
  resetAt: number;
  limit: number;
}> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token?.id;
  
  const limit = isAuthenticated ? RATE_LIMITS.authenticated.requests : RATE_LIMITS.free.requests;
  const window = isAuthenticated ? RATE_LIMITS.authenticated.window : RATE_LIMITS.free.window;

  let identifier: string;
  if (token?.id) {
    identifier = `user:${token.id}`;
  } else {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
    identifier = `ip:${ip}`;
  }

  const key = `${identifier}:${limit}:${window}`;
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (!record || now > record.resetAt) {
    return {
      remaining: limit,
      resetAt: now + window,
      limit,
    };
  }

  return {
    remaining: Math.max(0, limit - record.count),
    resetAt: record.resetAt,
    limit,
  };
}

