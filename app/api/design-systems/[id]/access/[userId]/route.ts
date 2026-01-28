import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/design-systems/[id]/access/[userId]
 * 
 * Access management (sharing) is not enabled yet.
 * Returns 403 Forbidden as per product requirements.
 */
export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Forbidden",
      message: "Sharing functionality is not enabled yet" 
    },
    { status: 403 }
  );
}
