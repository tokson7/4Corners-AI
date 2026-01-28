import { auth as clerkAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await clerkAuth()
    if (!userId) return false

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, banned: true },
    })

    return user?.role === 'ADMIN' && !user.banned
  } catch (error) {
    console.error('Admin check failed:', error)
    return false
  }
}

/**
 * Get current admin user
 */
export async function getAdminUser() {
  try {
    const { userId } = await clerkAuth()
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        banned: true,
      },
    })

    if (user?.role !== 'ADMIN' || user.banned) return null
    
    return {
      ...user,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.email
    }
  } catch (error) {
    console.error('Get admin user failed:', error)
    return null
  }
}

/**
 * Require admin access
 */
export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
}

/**
 * Log admin action
 */
export async function logAdminAction(
  action: string,
  targetId?: string,
  details?: any
) {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) return

    await prisma.adminLog.create({
      data: {
        adminId: adminUser.id,
        action,
        targetId,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}
