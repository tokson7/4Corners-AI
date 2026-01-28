import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const action = searchParams.get('action') || ''
    const adminId = searchParams.get('adminId') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit
    const where: any = {}

    if (action) where.action = action
    if (adminId) where.adminId = adminId
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    const [logs, total, allAdmins] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminLog.count({ where }),
      prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, email: true, firstName: true, lastName: true },
      }),
    ])

    // Enrich logs with admin info and target info
    const enrichedLogs = await Promise.all(
      logs.map(async (log: any) => {
        const admin = await prisma.user.findUnique({
          where: { id: log.adminId },
          select: { email: true, firstName: true, lastName: true },
        })

        let targetInfo = null
        if (log.targetId) {
          // Try to get user info if target is a user
          const targetUser = await prisma.user.findUnique({
            where: { id: log.targetId },
            select: { email: true, firstName: true, lastName: true },
          })

          if (targetUser) {
            targetInfo = {
              type: 'user',
              email: targetUser.email,
              name: targetUser.firstName && targetUser.lastName
                ? `${targetUser.firstName} ${targetUser.lastName}`
                : null,
            }
          } else {
            // Try to get design system info
            const targetDesign = await prisma.designSystem.findUnique({
              where: { id: log.targetId },
              select: { name: true },
            })

            if (targetDesign) {
              targetInfo = {
                type: 'design',
                name: targetDesign.name,
              }
            }
          }
        }

        return {
          ...log,
          adminName: admin?.firstName && admin?.lastName
            ? `${admin.firstName} ${admin.lastName}`
            : admin?.email || 'Unknown Admin',
          adminEmail: admin?.email,
          targetInfo,
        }
      })
    )

    // Filter by search term if provided
    const filteredLogs = search
      ? enrichedLogs.filter((log: any) => {
          const searchLower = search.toLowerCase()
          return (
            log.action.toLowerCase().includes(searchLower) ||
            log.adminName.toLowerCase().includes(searchLower) ||
            log.adminEmail?.toLowerCase().includes(searchLower) ||
            log.targetInfo?.email?.toLowerCase().includes(searchLower) ||
            log.targetInfo?.name?.toLowerCase().includes(searchLower)
          )
        })
      : enrichedLogs

    return NextResponse.json({
      logs: filteredLogs,
      admins: allAdmins.map((admin: any) => ({
        id: admin.id,
        name: admin.firstName && admin.lastName
          ? `${admin.firstName} ${admin.lastName}`
          : admin.email,
        email: admin.email,
      })),
      pagination: {
        page,
        limit,
        total: search ? filteredLogs.length : total,
        pages: Math.ceil((search ? filteredLogs.length : total) / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin logs API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
