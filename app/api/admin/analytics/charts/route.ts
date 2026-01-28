import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function GET() {
  try {
    await requireAdmin()

    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get all users and designs from last 30 days
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    })

    const designs = await prisma.designSystem.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // Process user growth data (last 30 days)
    const userGrowthMap = new Map<string, number>()
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      userGrowthMap.set(dateKey, 0)
    }

    users.forEach((user: any) => {
      const dateKey = user.createdAt.toISOString().split('T')[0]
      if (userGrowthMap.has(dateKey)) {
        userGrowthMap.set(dateKey, (userGrowthMap.get(dateKey) || 0) + 1)
      }
    })

    const userGrowth = Array.from(userGrowthMap.entries())
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        users: count,
      }))
      .reverse()

    // Process design activity data (last 7 days)
    const designActivityMap = new Map<string, number>()
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      designActivityMap.set(dateKey, 0)
    }

    designs.forEach((design: any) => {
      const dateKey = design.createdAt.toISOString().split('T')[0]
      if (designActivityMap.has(dateKey)) {
        designActivityMap.set(dateKey, (designActivityMap.get(dateKey) || 0) + 1)
      }
    })

    const designActivity = Array.from(designActivityMap.entries())
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        designs: count,
      }))
      .reverse()

    // Get credits usage data
    const allUsers = await prisma.user.findMany({
      select: {
        credits: true,
      },
    })

    const totalCredits = allUsers.reduce((sum: number, user: any) => sum + user.credits, 0)
    const totalDesigns = await prisma.designSystem.count()
    const creditsUsed = totalDesigns * 3 // Each design costs 3 credits
    const creditsRemaining = totalCredits

    const creditsUsage = [
      { name: 'Used', value: creditsUsed, fill: '#ef4444' },
      { name: 'Remaining', value: creditsRemaining, fill: '#10b981' },
    ]

    // Get activity by day of week and hour
    const recentActivity = await prisma.designSystem.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // Create heatmap data
    const heatmapData: any[] = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (let hour = 0; hour < 24; hour++) {
      for (let day = 0; day < 7; day++) {
        heatmapData.push({
          hour,
          day: days[day],
          dayIndex: day,
          activity: 0,
        })
      }
    }

    recentActivity.forEach((item: any) => {
      const date = new Date(item.createdAt)
      const hour = date.getHours()
      const day = date.getDay()
      
      const index = heatmapData.findIndex(
        (d) => d.hour === hour && d.dayIndex === day
      )
      if (index !== -1) {
        heatmapData[index].activity += 1
      }
    })

    return NextResponse.json({
      userGrowth,
      designActivity,
      creditsUsage,
      heatmapData,
    })
  } catch (error: any) {
    console.error('Failed to fetch chart data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}
