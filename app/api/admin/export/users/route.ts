import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const userIds = searchParams.get('userIds')?.split(',').filter(Boolean)

    // Build where clause for filtering
    const where: any = userIds ? { id: { in: userIds } } : {}

    const users = await prisma.user.findMany({
      where,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        credits: true,
        plan: true,
        banned: true,
        createdAt: true,
        _count: { select: { designSystems: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    await logAdminAction('exported_users', undefined, {
      format,
      count: users.length,
      filtered: !!userIds,
    })

    if (format === 'csv') {
      const csv = [
        'Email,Name,Role,Credits,Plan,Status,Designs Count,Joined Date',
        ...users.map((u: any) => {
          const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No name'
          const status = u.banned ? 'Banned' : 'Active'
          const joinDate = new Date(u.createdAt).toLocaleDateString()
          return `"${u.email}","${name}",${u.role},${u.credits},${u.plan},${status},${u._count.designSystems},"${joinDate}"`
        }),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="users-export-${Date.now()}.csv"`,
        },
      })
    }

    // JSON format
    return new NextResponse(JSON.stringify(users, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="users-export-${Date.now()}.json"`,
      },
    })
  } catch (error: any) {
    console.error('Export users error:', error)
    return NextResponse.json(
      { error: error.message || 'Export failed' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
