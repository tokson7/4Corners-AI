import { prisma } from '@/lib/prisma'

/**
 * Log an admin action to the database
 * @param adminId - The ID of the admin performing the action
 * @param action - The action being performed (e.g., 'banned_user', 'deleted_design')
 * @param targetId - Optional ID of the target entity (user, design, etc.)
 * @param details - Optional additional details about the action
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetId?: string | null,
  details?: Record<string, any>
) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        targetId,
        details: details || {},
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
    // Don't throw - logging shouldn't break the main action
  }
}

/**
 * Get the current admin's user ID from the session
 * This is a helper to extract admin ID from Clerk auth
 */
export async function getCurrentAdminId(): Promise<string | null> {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('Failed to get current admin ID:', error)
    return null
  }
}
