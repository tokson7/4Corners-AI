/**
 * Role-Based Access Control (RBAC)
 * Manages user roles and permissions
 */

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export type UserRole = "user" | "admin";

/**
 * Role permissions
 */
export const ROLE_PERMISSIONS = {
  user: [
    "generate:design-system",
    "export:design-system",
    "view:own-design-systems",
    "share:design-systems",
    "manage:own-team",
  ],
  admin: [
    "generate:design-system",
    "export:design-system",
    "view:own-design-systems",
    "share:design-systems",
    "manage:own-team",
    "view:analytics",
    "view:system-metrics",
    "manage:all-users",
    "manage:all-teams",
  ],
} as const;

/**
 * Get user role from token
 * Defaults to "user" if not specified
 */
export async function getUserRole(req: NextRequest): Promise<UserRole> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if user has admin role in token
  // In production, this would come from database
  const role = (token?.role as UserRole) || "user";
  
  // Validate role
  if (role !== "user" && role !== "admin") {
    return "user";
  }

  return role;
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
  req: NextRequest,
  permission: string
): Promise<boolean> {
  const role = await getUserRole(req);
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission as any);
}

/**
 * Require a specific permission (throws error if not granted)
 */
export async function requirePermission(
  req: NextRequest,
  permission: string
): Promise<void> {
  const hasAccess = await hasPermission(req, permission);
  if (!hasAccess) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
  const role = await getUserRole(req);
  return role === "admin";
}

/**
 * Require admin role (throws error if not admin)
 */
export async function requireAdmin(req: NextRequest): Promise<void> {
  const admin = await isAdmin(req);
  if (!admin) {
    throw new Error("Admin access required");
  }
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(req: NextRequest): Promise<string[]> {
  const role = await getUserRole(req);
  return [...ROLE_PERMISSIONS[role]];
}

