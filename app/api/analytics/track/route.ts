import { NextRequest, NextResponse } from "next/server";
import type { AnalyticsEvent, AnalyticsEventPayload } from "@/lib/analytics/events";

/**
 * Analytics Event Storage
 * TODO: Replace with actual analytics service (PostHog, Mixpanel, Amplitude, etc.)
 */
interface StoredEvent {
  event: AnalyticsEvent;
  payload: AnalyticsEventPayload;
  receivedAt: string;
}

// In-memory storage (TODO: Replace with database or analytics service)
const eventStore: StoredEvent[] = [];

/**
 * POST /api/analytics/track
 * Track an analytics event
 */
export async function POST(req: NextRequest) {
  try {
    // Skip in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ success: true, message: "Analytics disabled in development" });
    }

    const body = await req.json();
    const { event, payload } = body;

    if (!event || !payload) {
      return NextResponse.json(
        { error: "Missing event or payload" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!payload.userId || !payload.timestamp) {
      return NextResponse.json(
        { error: "Missing required payload fields" },
        { status: 400 }
      );
    }

    // Store event (in production, send to analytics service)
    const storedEvent: StoredEvent = {
      event: event as AnalyticsEvent,
      payload: payload as AnalyticsEventPayload,
      receivedAt: new Date().toISOString(),
    };

    eventStore.push(storedEvent);

    // TODO: Send to analytics service (PostHog, Mixpanel, Amplitude, etc.)
    // Example:
    // await posthog.capture({
    //   distinctId: payload.userId,
    //   event: event,
    //   properties: payload,
    // });

    // Keep only last 1000 events in memory (for testing)
    if (eventStore.length > 1000) {
      eventStore.shift();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Always return success to avoid breaking user flow
    return NextResponse.json({ success: true });
  }
}

/**
 * GET /api/analytics/track
 * Get stored events (for testing/debugging only)
 * TODO: Remove in production or protect with admin auth
 */
export async function GET(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    events: eventStore,
    count: eventStore.length,
  });
}
