import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Check if we're in a build environment or missing Redis config
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.UPSTASH_REDIS_REST_URL;
const hasRedisConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Initialize Redis client - will use environment variables
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
let redis: Redis;

if (hasRedisConfig) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (error) {
    // Only log if not at build time
    if (!isBuildTime) {
      logger.warn('Redis initialization failed, using mock', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    // Create a mock redis for development
    redis = {
      get: async () => null,
      set: async () => 'OK',
      incr: async () => 1,
      expire: async () => 1,
      eval: async () => null,
    } as any;
  }
} else {
  // Create a mock redis when config is missing (build time or development)
  redis = {
    get: async () => null,
    set: async () => 'OK',
    incr: async () => 1,
    expire: async () => 1,
    eval: async () => null,
  } as any;
}

// Rate limiters for different endpoints
export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: '4corners_generate',
});

export const designSystemRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
  prefix: '4corners_design_systems',
});

export const defaultRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute for other endpoints
  analytics: true,
  prefix: '4corners_default',
});

/**
 * Apply rate limiting to a request
 * @param request - The NextRequest object
 * @param ratelimit - The rate limiter to use
 * @param rateLimitName - Name of the rate limit for logging
 * @returns Object with success status and potential response
 */
export async function applyRateLimit(
  request: NextRequest,
  ratelimit: Ratelimit,
  rateLimitName: string = 'unknown'
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    // Extract IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
    
    logger.info('Checking rate limit', {
      endpoint: rateLimitName,
      ip: ip.substring(0, 8) + '...', // Log partial IP for privacy
      headers: {
        'x-forwarded-for': forwarded ? forwarded.substring(0, 15) + '...' : null,
        'x-real-ip': realIp ? realIp.substring(0, 8) + '...' : null,
      }
    });

    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    
    if (!success) {
      logger.warn('Rate limit exceeded', {
        endpoint: rateLimitName,
        ip: ip.substring(0, 8) + '...',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      });

      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again after ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
            limit,
            remaining,
            reset: new Date(reset).toISOString(),
          },
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        ),
      };
    }

    logger.info('Rate limit check passed', {
      endpoint: rateLimitName,
      ip: ip.substring(0, 8) + '...',
      limit,
      remaining,
      reset: new Date(reset).toISOString(),
    });

    return { success: true };
  } catch (error) {
    logger.error('Rate limiting error', {
      endpoint: rateLimitName,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // If rate limiting fails, allow the request to continue
    // This ensures the API doesn't break if Redis is unavailable
    return { success: true };
  }
}

/**
 * Middleware wrapper for rate limiting
 * @param ratelimit - The rate limiter to use
 * @param rateLimitName - Name for logging purposes
 */
export function withRateLimit(ratelimit: Ratelimit, rateLimitName: string) {
  return async function (request: NextRequest) {
    return applyRateLimit(request, ratelimit, rateLimitName);
  };
}

// Pre-configured rate limit functions for common use cases
export const withGenerateRateLimit = withRateLimit(generateRateLimit, 'generate');
export const withDesignSystemRateLimit = withRateLimit(designSystemRateLimit, 'design-systems');
export const withDefaultRateLimit = withRateLimit(defaultRateLimit, 'default');