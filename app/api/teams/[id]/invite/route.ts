import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Team, TeamMember, TeamInvitation } from "@/lib/types/team";
import { canInviteMembers } from "@/lib/types/team";
import { teamsStore, userTeamMap, invitationsStore } from "@/lib/storage/teamStorage";

/**
 * POST /api/teams/[id]/invite
 * Invite a member to the team
 */
export async function POST(
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

    // Check if user can invite members
    const member = team.members.find((m) => m.userId === token.id as string);
    if (!member || !canInviteMembers(member.role)) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, role = "member" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = team.members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a team member" },
        { status: 400 }
      );
    }

    // Create invitation
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation: TeamInvitation = {
      id: invitationId,
      teamId,
      email: email.toLowerCase(),
      role: role as "member" | "admin",
      invitedBy: token.id as string,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    invitationsStore.set(invitationId, invitation);

    // TODO: Send invitation email
    // TODO: Save to database

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitationId,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("Failed to invite member:", error);
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/teams/[id]/invite
 * Get pending invitations for team
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
    if (!member || !canInviteMembers(member.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get pending invitations
    const invitations = Array.from(invitationsStore.values())
      .filter((inv) => inv.teamId === teamId && !inv.acceptedAt)
      .filter((inv) => new Date(inv.expiresAt) > new Date())
      .map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      }));

    return NextResponse.json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error("Failed to get invitations:", error);
    return NextResponse.json(
      { error: "Failed to get invitations" },
      { status: 500 }
    );
  }
}
