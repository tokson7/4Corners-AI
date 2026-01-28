import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Team, TeamMember } from "@/lib/types/team";
import { teamsStore, userTeamMap } from "@/lib/storage/teamStorage";

/**
 * POST /api/teams
 * Create a new team
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a team
    const existingTeamId = userTeamMap.get(token.id as string);
    if (existingTeamId) {
      return NextResponse.json(
        { error: "User already belongs to a team" },
        { status: 400 }
      );
    }

    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const owner: TeamMember = {
      userId: token.id as string,
      email: token.email as string,
      name: token.name as string | null,
      image: token.image as string | null,
      role: "owner",
      joinedAt: now,
    };

    const team: Team = {
      id: teamId,
      name: name.trim(),
      ownerId: token.id as string,
      members: [owner],
      plan: "free",
      createdAt: now,
      updatedAt: now,
    };

    teamsStore.set(teamId, team);
    userTeamMap.set(token.id as string, teamId);

    // TODO: Save to database

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Failed to create team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/teams
 * Get user's team
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.id as string;
    const teamId = userTeamMap.get(userId);

    if (!teamId) {
      return NextResponse.json({
        success: true,
        team: null,
      });
    }

    const team = teamsStore.get(teamId);
    if (!team) {
      return NextResponse.json({
        success: true,
        team: null,
      });
    }

    // Find user's role in team
    const member = team.members.find((m) => m.userId === userId);
    if (!member) {
      return NextResponse.json({
        success: true,
        team: null,
      });
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
