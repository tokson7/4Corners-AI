/**
 * Team Storage (Shared)
 * TODO: Replace with database
 */

import type { Team, TeamInvitation } from "@/lib/types/team";

// Shared in-memory storage
export const teamsStore: Map<string, Team> = new Map();
export const userTeamMap: Map<string, string> = new Map(); // userId -> teamId
export const invitationsStore: Map<string, TeamInvitation> = new Map();
