import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/rbac";

/**
 * GET /api/admin/metrics
 * Admin-only endpoint for system metrics
 */
export async function GET(req: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(req);

    // TODO: Fetch system metrics
    // For now, return placeholder
    return NextResponse.json({
      success: true,
      metrics: {
        apiCalls: 0,
        errorRate: 0,
        averageResponseTime: 0,
        // ... more metrics
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin access required")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to fetch metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

