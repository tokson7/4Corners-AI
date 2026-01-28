import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    const designIds = searchParams.get('designIds')?.split(',').filter(Boolean)

    // Build where clause for filtering
    const where: any = designIds ? { id: { in: designIds } } : {}

    const designs = await prisma.designSystem.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    await logAdminAction('exported_designs', undefined, {
      format,
      count: designs.length,
      filtered: !!designIds,
    })

    if (format === 'csv') {
      const csv = [
        'Name,Description,Creator Email,Featured,Status,Created Date,Colors Count,Typography',
        ...designs.map((d: any) => {
          const creator = d.user.email
          const createdDate = new Date(d.createdAt).toLocaleDateString()
          const colorsCount = d.colors ? Object.keys(d.colors as any).length : 0
          const typography = d.typography ? JSON.stringify(d.typography).substring(0, 50) : 'N/A'
          return `"${d.name || 'Untitled'}","${d.brandDescription || 'No description'}","${creator}",${d.featured},${d.status},"${createdDate}",${colorsCount},"${typography}..."`
        }),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="designs-export-${Date.now()}.csv"`,
        },
      })
    }

    // JSON format (default for designs - better for preserving structure)
    return new NextResponse(JSON.stringify(designs, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="designs-export-${Date.now()}.json"`,
      },
    })
  } catch (error: any) {
    console.error('Export designs error:', error)
    return NextResponse.json(
      { error: error.message || 'Export failed' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
