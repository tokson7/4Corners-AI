import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Team } from "@/lib/types/team";
import { canRemoveMembers } from "@/lib/types/team";
import { teamsStore, userTeamMap } from "@/lib/storage/teamStorage";

/**
 * DELETE /api/teams/[id]/members
 * Remove a member from the team
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: teamId } = await params;
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const team = teamsStore.get(teamId);

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user can remove members
    const currentMember = team.members.find((m) => m.userId === token.id as string);
    if (!currentMember || !canRemoveMembers(currentMember.role)) {
      return NextResponse.json(
        { error: "You don't have permission to remove members" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent removing owner
    if (userId === team.ownerId) {
      return NextResponse.json(
        { error: "Cannot remove team owner" },
        { status: 400 }
      );
    }

    // Prevent removing yourself if you're not owner
    if (userId === token.id && currentMember.role !== "owner") {
      return NextResponse.json(
        { error: "You cannot remove yourself. Ask an admin or owner to remove you." },
        { status: 400 }
      );
    }

    // Remove member
    const memberIndex = team.members.findIndex((m) => m.userId === userId);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    team.members.splice(memberIndex, 1);
    userTeamMap.delete(userId);
    team.updatedAt = new Date().toISOString();
    teamsStore.set(teamId, team);

    // TODO: Save to database

    return NextResponse.json({
      success: true,
      message: "Member removed",
      team,
    });
  } catch (error) {
    console.error("Failed to remove member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
