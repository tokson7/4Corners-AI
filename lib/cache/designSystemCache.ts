/**
 * Design System Cache
 * Redis caching with TTL for generated design systems
 */

// Only import Redis on the server side
let Redis: any = null;
if (typeof window === "undefined") {
  try {
    Redis = require("@upstash/redis").Redis;
  } catch (error) {
    // Redis not available, caching will be disabled
  }
}

let redis: any = null;

/**
 * Initialize Redis client
 */
function initializeRedis(): any | null {
  // Only run on server side
  if (typeof window !== "undefined") {
    return null;
  }

  if (redis) {
    return redis;
  }

  if (!Redis) {
    return null;
  }

  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redisRestUrl = process.env.UPSTASH_REDIS_REST_URL;

  if (redisToken && redisRestUrl) {
    try {
      redis = new Redis({
        url: redisRestUrl,
        token: redisToken,
      });
      return redis;
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
    }
  }

  return null;
}

/**
 * Generate cache key from brand description
 */
function generateCacheKey(brandDescription: string, industry?: string, audience?: string): string {
  const key = `design-system:${brandDescription}:${industry || ""}:${audience || ""}`;
  // Create hash for consistent key length
  return Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Cache design system with TTL
 * @param brandDescription - Brand description
 * @param designSystem - Generated design system
 * @param ttl - Time to live in seconds (default: 1 hour)
 */
export async function cacheDesignSystem(
  brandDescription: string,
  designSystem: any,
  ttl: number = 3600,
  industry?: string,
  audience?: string
): Promise<void> {
  // Only cache on server side
  if (typeof window !== "undefined") {
    return;
  }

  const client = initializeRedis();
  if (!client) {
    return; // No Redis, skip caching
  }

  try {
    const key = generateCacheKey(brandDescription, industry, audience);
    await client.setex(key, ttl, JSON.stringify(designSystem));
  } catch (error) {
    console.error("Failed to cache design system:", error);
  }
}

/**
 * Get cached design system
 * @param brandDescription - Brand description
 * @returns Cached design system or null
 */
export async function getCachedDesignSystem(
  brandDescription: string,
  industry?: string,
  audience?: string
): Promise<any | null> {
  // Only check cache on server side
  if (typeof window !== "undefined") {
    return null;
  }

  const client = initializeRedis();
  if (!client) {
    return null;
  }

  try {
    const key = generateCacheKey(brandDescription, industry, audience);
    const cached = await client.get(key);
    
    if (cached && typeof cached === "string") {
      return JSON.parse(cached);
    }
    
    return null;
  } catch (error) {
    console.error("Failed to get cached design system:", error);
    return null;
  }
}

/**
 * Invalidate cache for a design system
 */
export async function invalidateCache(
  brandDescription: string,
  industry?: string,
  audience?: string
): Promise<void> {
  // Only invalidate on server side
  if (typeof window !== "undefined") {
    return;
  }

  const client = initializeRedis();
  if (!client) {
    return;
  }

  try {
    const key = generateCacheKey(brandDescription, industry, audience);
    await client.del(key);
  } catch (error) {
    console.error("Failed to invalidate cache:", error);
  }
}

/**
 * Clear all design system caches
 */
export async function clearAllCaches(): Promise<void> {
  // Only clear on server side
  if (typeof window !== "undefined") {
    return;
  }

  const client = initializeRedis();
  if (!client) {
    return;
  }

  try {
    const keys = await client.keys("design-system:*");
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("Failed to clear caches:", error);
  }
}
