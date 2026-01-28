import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/design-systems/[id]/share
 * 
 * Sharing functionality is not enabled yet.
 * Returns 403 Forbidden as per product requirements.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Forbidden",
      message: "Sharing functionality is not enabled yet" 
    },
    { status: 403 }
  );
}

/**
 * GET /api/design-systems/[id]/share
 * 
 * Sharing functionality is not enabled yet.
 * Returns 403 Forbidden as per product requirements.
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Forbidden",
      message: "Sharing functionality is not enabled yet" 
    },
    { status: 403 }
  );
}
