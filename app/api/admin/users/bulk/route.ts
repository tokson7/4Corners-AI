import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { userIds, action, value } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      )
    }

    let result
    const details: any = {
      userIds,
      count: userIds.length,
    }

    switch (action) {
      case 'add_credits':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'Valid positive credit amount is required' },
            { status: 400 }
          )
        }
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { credits: { increment: value } },
        })
        details.amount = value
        await logAdminAction('bulk_credits', undefined, details)
        break

      case 'remove_credits':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'Valid positive credit amount is required' },
            { status: 400 }
          )
        }
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { credits: { decrement: value } },
        })
        details.amount = -value
        await logAdminAction('bulk_credits', undefined, details)
        break

      case 'ban':
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { banned: true },
        })
        await logAdminAction('bulk_ban', undefined, details)
        break

      case 'unban':
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { banned: false },
        })
        details.action = 'unban'
        await logAdminAction('bulk_ban', undefined, details)
        break

      case 'delete':
        // Get user emails before deleting for logging
        const usersToDelete = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { email: true },
        })
        details.emails = usersToDelete.map((u: { email: string }) => u.email)

        result = await prisma.user.deleteMany({
          where: { id: { in: userIds } },
        })
        await logAdminAction('bulk_delete', undefined, details)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: add_credits, remove_credits, ban, unban, or delete' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      affected: result?.count || 0,
      message: `Successfully processed ${action} for ${userIds.length} user(s)`,
    })
  } catch (error: any) {
    console.error('Bulk user action error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
