import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    // New filter parameters
    const roles = searchParams.get('roles')?.split(',').filter(Boolean) || []
    const statuses = searchParams.get('statuses')?.split(',').filter(Boolean) || []
    const plans = searchParams.get('plans')?.split(',').filter(Boolean) || []
    const minCredits = searchParams.get('minCredits')
    const maxCredits = searchParams.get('maxCredits')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Role filter
    if (roles.length > 0) {
      where.role = { in: roles }
    }

    // Status filter (active/banned)
    if (statuses.length > 0) {
      if (statuses.includes('active') && !statuses.includes('banned')) {
        where.banned = false
      } else if (statuses.includes('banned') && !statuses.includes('active')) {
        where.banned = true
      }
      // If both selected, don't filter by banned status
    }

    // Plan filter
    if (plans.length > 0) {
      where.plan = { in: plans }
    }

    // Credits range filter
    if (minCredits || maxCredits) {
      where.credits = {}
      if (minCredits) {
        where.credits.gte = parseInt(minCredits)
      }
      if (maxCredits) {
        where.credits.lte = parseInt(maxCredits)
      }
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          banned: true,
          credits: true,
          plan: true,
          createdAt: true,
          _count: {
            select: { designSystems: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin users API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
