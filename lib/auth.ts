import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current auth session (Clerk)
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user (Clerk)
 */
export async function getCurrentUser() {
  return await currentUser();
}
