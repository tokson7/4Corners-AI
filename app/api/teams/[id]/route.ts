import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Team } from "@/lib/types/team";
import { hasTeamPermission } from "@/lib/types/team";
import { teamsStore, userTeamMap } from "@/lib/storage/teamStorage";

/**
 * GET /api/teams/[id]
 * Get team by ID
 */
export async function GET(
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

    // Check if user is a member
    const member = team.members.find((m) => m.userId === token.id as string);
    if (!member) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      team,
      userRole: member.role,
    });
  } catch (error) {
    console.error("Failed to get team:", error);
    return NextResponse.json(
      { error: "Failed to get team" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/teams/[id]
 * Update team (name, plan, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: teamId } = await params;
    const team = teamsStore.get(teamId);

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is owner
    const member = team.members.find((m) => m.userId === token.id as string);
    if (!member || !hasTeamPermission(member.role, "owner")) {
      return NextResponse.json(
        { error: "Only team owner can update team" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (name && typeof name === "string" && name.trim().length > 0) {
      team.name = name.trim();
      team.updatedAt = new Date().toISOString();
      teamsStore.set(teamId, team);
    }

    // TODO: Save to database

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Failed to update team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[id]
 * Delete team (owner only)
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

    // Check if user is owner
    if (team.ownerId !== token.id) {
      return NextResponse.json(
        { error: "Only team owner can delete team" },
        { status: 403 }
      );
    }

    // Remove team and user mappings
    teamsStore.delete(teamId);
    team.members.forEach((member) => {
      userTeamMap.delete(member.userId);
    });

    // TODO: Delete from database

    return NextResponse.json({
      success: true,
      message: "Team deleted",
    });
  } catch (error) {
    console.error("Failed to delete team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
