import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/rbac";
import { getAllMetrics } from "@/lib/admin/analytics";

/**
 * GET /api/admin/analytics
 * Admin-only endpoint for viewing analytics
 */
export async function GET(req: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(req);

    // Get days parameter
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    // Collect all metrics
    const metrics = getAllMetrics(days);

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin access required")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

