import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get daily stats
    const dailyStats = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const [newUsers, newDesigns, activeUsers] = await Promise.all([
        prisma.user.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
        prisma.designSystem.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
        prisma.user.count({
          where: {
            banned: false,
          },
        }),
      ])

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        newUsers,
        newDesigns,
        activeUsers,
        totalCreditsUsed: newDesigns * 3,
      })
    }

    // Reverse to get oldest to newest
    dailyStats.reverse()

    await logAdminAction('exported_analytics', undefined, {
      format,
      days,
      recordsCount: dailyStats.length,
    })

    if (format === 'csv') {
      const csv = [
        'Date,New Users,New Designs,Active Users,Credits Used',
        ...dailyStats.map((stat) =>
          `"${stat.date}",${stat.newUsers},${stat.newDesigns},${stat.activeUsers},${stat.totalCreditsUsed}`
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="analytics-export-${Date.now()}.csv"`,
        },
      })
    }

    // JSON format
    return new NextResponse(JSON.stringify(dailyStats, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="analytics-export-${Date.now()}.json"`,
      },
    })
  } catch (error: any) {
    console.error('Export analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Export failed' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
