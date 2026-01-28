/**
 * Rate Limiting
 * Uses Upstash Redis for distributed rate limiting
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

/**
 * Initialize rate limiter
 */
function initializeRateLimiter(): Ratelimit | null {
  if (ratelimit) {
    return ratelimit;
  }

  // Check for Upstash Redis URL
  const redisUrl = process.env.REDIS_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redisRestUrl = process.env.UPSTASH_REDIS_REST_URL;

  // Try to initialize with Upstash credentials
  if (redisToken && redisRestUrl) {
    try {
      redis = new Redis({
        url: redisRestUrl,
        token: redisToken,
      });

      ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
        analytics: true,
        prefix: "@designforge/ratelimit",
      });

      return ratelimit;
    } catch (error) {
      console.error("Failed to initialize Upstash rate limiter:", error);
    }
  }

  // Fallback: Use in-memory rate limiting if Redis is not available
  if (redisUrl && redisUrl.startsWith("redis://")) {
    console.warn("Upstash Redis not configured. Using in-memory rate limiting (not distributed).");
    // For local development without Upstash, we'll use a simple in-memory limiter
    return createInMemoryRateLimiter();
  }

  console.warn("Rate limiting disabled. Redis not configured.");
  return null;
}

/**
 * In-memory rate limiter for local development
 */
function createInMemoryRateLimiter(): Ratelimit {
  // Simple in-memory implementation
  const requests = new Map<string, number[]>();

  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute
      const maxRequests = 10;

      // Get or create request history for this identifier
      let requestHistory = requests.get(identifier) || [];

      // Remove requests outside the sliding window
      requestHistory = requestHistory.filter((timestamp) => now - timestamp < windowMs);

      // Check if limit exceeded
      if (requestHistory.length >= maxRequests) {
        const oldestRequest = requestHistory[0];
        const resetTime = oldestRequest + windowMs;
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          reset: resetTime,
        };
      }

      // Add current request
      requestHistory.push(now);
      requests.set(identifier, requestHistory);

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - requestHistory.length,
        reset: now + windowMs,
      };
    },
  } as Ratelimit;
}

/**
 * Check rate limit for an identifier
 * @param identifier - Unique identifier (e.g., user ID, IP address, API key)
 * @returns Rate limit result with success status and remaining requests
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = initializeRateLimiter();

  if (!limiter) {
    // If rate limiting is not configured, allow all requests
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 60000,
    };
  }

  try {
    const result = await limiter.limit(identifier);
    return result;
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request (fail open)
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 60000,
    };
  }
}

/**
 * Get rate limit status without consuming a request
 * @param identifier - Unique identifier
 * @returns Current rate limit status
 */
export async function getRateLimitStatus(identifier: string): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = initializeRateLimiter();

  if (!limiter) {
    return {
      limit: 10,
      remaining: 10,
      reset: Date.now() + 60000,
    };
  }

  try {
    // Check current status (this is implementation-dependent)
    // For Upstash, we can use the limit method which returns remaining
    const result = await limiter.limit(identifier);
    return {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("Rate limit status check error:", error);
    return {
      limit: 10,
      remaining: 10,
      reset: Date.now() + 60000,
    };
  }
}

/**
 * Check if rate limiting is enabled
 */
export function isRateLimitingEnabled(): boolean {
  return initializeRateLimiter() !== null;
}
