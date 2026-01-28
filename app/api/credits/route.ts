import { NextRequest, NextResponse } from "next/server";
import { getCreditStats } from "@/lib/credits/creditTracker";

/**
 * GET /api/credits
 * Get current user's credit statistics
 */
export async function GET(req: NextRequest) {
  try {
    const stats = await getCreditStats(req);

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
    console.error("Failed to get credit stats:", error);
    return NextResponse.json(
      { error: "Failed to get credit statistics" },
      { status: 500 }
    );
  }
}
