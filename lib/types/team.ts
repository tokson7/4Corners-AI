/**
 * Team Account Types
 * Defines team structure, roles, and permissions
 */

export type TeamRole = "owner" | "admin" | "member";

export type SubscriptionPlan = "free" | "pro" | "team";

export interface TeamMember {
  userId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: TeamRole;
  joinedAt: string;
  invitedBy?: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  plan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

/**
 * Check if user has permission to perform action
 */
export function hasTeamPermission(
  userRole: TeamRole | null,
  requiredRole: TeamRole
): boolean {
  if (!userRole) return false;

  const roleHierarchy: Record<TeamRole, number> = {
    member: 0,
    admin: 1,
    owner: 2,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can invite members
 */
export function canInviteMembers(role: TeamRole | null): boolean {
  return hasTeamPermission(role, "admin");
}

/**
 * Check if user can remove members
 */
export function canRemoveMembers(role: TeamRole | null): boolean {
  return hasTeamPermission(role, "admin");
}

/**
 * Check if user can manage billing
 */
export function canManageBilling(role: TeamRole | null): boolean {
  return hasTeamPermission(role, "owner");
}
