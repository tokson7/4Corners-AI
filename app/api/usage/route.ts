import { NextRequest, NextResponse } from "next/server";
import { getUsageStats } from "@/lib/usage/usageTracker";

/**
 * GET /api/usage
 * Get current user's usage statistics
 */
export async function GET(req: NextRequest) {
  try {
    const stats = await getUsageStats(req);

    if (!stats) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("Failed to get usage stats:", error);
    return NextResponse.json(
      { error: "Failed to get usage statistics" },
      { status: 500 }
    );
  }
}
