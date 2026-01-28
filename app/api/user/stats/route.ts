import { requireUser } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/stats
 * 
 * Get the current user's statistics:
 * - Total design systems
 * - Total usage metrics
 * - Recent activity
 * 
 * @returns User statistics
 */
export async function GET() {
  try {
    const user = await requireUser()

    // Get counts and stats
    const [designSystemsCount, usageMetricsCount, recentDesignSystems] = await Promise.all([
      // Count total design systems
      prisma.designSystem.count({
        where: { userId: user.id },
      }),

      // Count total usage metrics
      prisma.usageMetrics.count({
        where: { userId: user.id },
      }),

      // Get recent design systems (last 5)
      prisma.designSystem.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    return Response.json({
      success: true,
      stats: {
        designSystemsCount,
        usageMetricsCount,
        recentDesignSystems,
      },
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return Response.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
