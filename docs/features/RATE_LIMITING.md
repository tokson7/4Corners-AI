# Rate Limiting Implementation

DesignForge AI implements rate limiting on expensive API endpoints to prevent abuse and ensure fair usage for all users.

## Overview

Rate limiting is implemented using [Upstash Redis](https://upstash.com/) with a sliding window algorithm, providing:

- **Distributed rate limiting** across multiple instances
- **Low latency** with edge-compatible Redis
- **Analytics** for monitoring usage patterns
- **Graceful degradation** if Redis is unavailable

## Rate Limits

### API Endpoints

| Endpoint | Rate Limit | Window | Purpose |
|----------|-----------|--------|---------|
| `/api/generate-design-system` | 5 requests | 1 minute | AI generation is expensive |
| `/api/design-systems` (POST) | 20 requests | 1 minute | Database writes |
| Default (other endpoints) | 100 requests | 1 minute | General API usage |

### Rate Limit Headers

All API responses include rate limit information in headers:

```
X-RateLimit-Limit: 5          # Maximum requests allowed
X-RateLimit-Remaining: 3      # Requests remaining in window
X-RateLimit-Reset: 1643723400 # Unix timestamp when limit resets
Retry-After: 42               # Seconds until you can retry (on 429 only)
```

## Setup

### 1. Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Click "Create Database"
3. Choose:
   - **Name**: `designforge-ratelimit`
   - **Type**: Regional (for better latency)
   - **Region**: Choose closest to your deployment
4. Copy the **REST URL** and **REST TOKEN**

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token_here"
```

### 3. Deploy

The rate limiting will automatically activate when environment variables are configured. If Redis is not configured, the system gracefully falls back to allowing all requests (useful for development).

## Implementation Details

### Rate Limiter Configuration

Located in `lib/rate-limit.ts`:

```typescript
// 5 requests per minute for AI generation
export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'designforge_generate',
});

// 20 requests per minute for design system operations
export const designSystemRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: true,
  prefix: 'designforge_design_systems',
});
```

### IP Address Detection

Rate limits are applied per IP address, detected from:

1. `x-forwarded-for` header (preferred, for proxied requests)
2. `x-real-ip` header (fallback)
3. `'anonymous'` (if no IP available)

### Usage Example

```typescript
import { applyRateLimit, generateRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(
    request, 
    generateRateLimit, 
    'my-endpoint'
  );
  
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }
  
  // Continue with your logic...
}
```

## Response Format

### Success (200-299)

Normal API response with rate limit headers.

### Rate Limited (429)

```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again after 42 seconds.",
  "retryAfter": 42,
  "limit": 5,
  "remaining": 0,
  "reset": "2026-01-28T10:30:00.000Z"
}
```

## Monitoring

Rate limiting includes built-in analytics. Check logs for:

```json
{
  "level": "info",
  "message": "Rate limit check passed",
  "endpoint": "generate-design-system",
  "ip": "192.168...",
  "limit": 5,
  "remaining": 3,
  "reset": "2026-01-28T10:30:00.000Z"
}
```

When limits are exceeded:

```json
{
  "level": "warn",
  "message": "Rate limit exceeded",
  "endpoint": "generate-design-system",
  "ip": "192.168...",
  "limit": 5,
  "remaining": 0,
  "reset": "2026-01-28T10:30:00.000Z"
}
```

## Error Handling

The rate limiter includes comprehensive error handling:

- **Redis unavailable**: Falls back to allowing requests (logged as warning)
- **Network errors**: Allows request to continue
- **Configuration errors**: Logs error and continues

This ensures the API remains available even if rate limiting infrastructure fails.

## Development

### Local Development Without Redis

For local development without Upstash Redis:

1. Don't set the Redis environment variables
2. Rate limiting will log a warning and allow all requests
3. This makes development easier while maintaining production protection

### Testing Rate Limits

To test rate limits locally with Redis:

```bash
# Set up Upstash Redis (free tier available)
# Add credentials to .env.local

# Make multiple requests quickly
curl -X POST http://localhost:3000/api/generate-design-system \
  -H "Content-Type: application/json" \
  -d '{"brandDescription": "test", "tier": "basic"}'

# After 5 requests in 1 minute, you'll get a 429 response
```

## Best Practices

### For API Consumers

1. **Check rate limit headers** in responses
2. **Implement exponential backoff** when receiving 429
3. **Cache responses** where appropriate
4. **Use webhooks** instead of polling when possible

### For API Developers

1. **Set appropriate limits** based on resource costs
2. **Use different prefixes** for different endpoints
3. **Monitor analytics** to adjust limits over time
4. **Log rate limit events** for security monitoring

## Customization

### Adjusting Rate Limits

Edit `lib/rate-limit.ts` to change limits:

```typescript
// Increase to 10 requests per minute
export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'designforge_generate',
});

// Change to per-hour limit
export const hourlyLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  analytics: true,
  prefix: 'designforge_hourly',
});
```

### Per-User Rate Limits

To implement per-user limits instead of per-IP:

```typescript
// In your API route
const { userId } = await auth();
const identifier = userId || ip; // Use userId if available

const { success } = await ratelimit.limit(identifier);
```

## Security Considerations

1. **IP Spoofing**: Headers like `x-forwarded-for` can be spoofed. Ensure your reverse proxy (Vercel, Cloudflare) sets these correctly.

2. **Multiple IPs**: Users behind NAT or using VPNs may share IPs, affecting legitimate users.

3. **DDoS Protection**: Rate limiting helps but isn't a complete DDoS solution. Use additional protection (Cloudflare, WAF) for production.

4. **Privacy**: IP addresses are partially logged for debugging. Ensure compliance with privacy regulations.

## Troubleshooting

### Rate Limiting Not Working

1. Check environment variables are set correctly
2. Verify Upstash Redis is accessible
3. Check logs for rate limiting errors
4. Ensure headers are being set by your proxy

### False Positives

If legitimate users are being rate limited:

1. Increase rate limits in `lib/rate-limit.ts`
2. Consider per-user limits instead of per-IP
3. Implement allowlisting for trusted IPs
4. Review analytics to understand usage patterns

### High Redis Costs

1. Review and optimize rate limit configurations
2. Consider longer time windows with higher limits
3. Disable analytics if not needed
4. Use Upstash's free tier for low traffic

## Related Documentation

- [Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [API Architecture](../architecture/README.md)
- [Testing Rate Limits](../testing/README.md)
- [Environment Setup](../setup/README.md)