/**
 * Analytics Event Tracking
 * Centralized, non-blocking event tracking system
 */

import type { AnalyticsEvent, AnalyticsEventPayload } from "./events";

/**
 * Check if analytics is enabled
 * Disabled in development mode
 */
function isAnalyticsEnabled(): boolean {
  // Disable in development
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  // Can be explicitly disabled via environment variable
  if (process.env.ANALYTICS_ENABLED === "false") {
    return false;
  }

  return true;
}

/**
 * Track an analytics event
 * Non-blocking, fire-and-forget
 */
export async function trackEvent(
  eventName: AnalyticsEvent,
  payload: AnalyticsEventPayload
): Promise<void> {
  // Skip tracking if disabled
  if (!isAnalyticsEnabled()) {
    return;
  }

  // Ensure timestamp is set
  const eventPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  // Fire and forget - don't block execution
  fetch("/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: eventName,
      payload: eventPayload,
    }),
  }).catch((error) => {
    // Silently fail - analytics should never break the app
    console.warn("Analytics tracking failed:", error);
  });
}

/**
 * Track event on server side
 * For use in API routes and server components
 */
export async function trackEventServer(
  eventName: AnalyticsEvent,
  payload: AnalyticsEventPayload
): Promise<void> {
  // Skip tracking if disabled
  if (!isAnalyticsEnabled()) {
    return;
  }

  try {
    // In server context, we can directly store or send to analytics service
    // For now, we'll use the same API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/analytics/track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: eventName,
          payload: {
            ...payload,
            timestamp: payload.timestamp || new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn("Analytics tracking failed:", response.status);
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.warn("Analytics tracking failed:", error);
  }
}
