import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        designSystems: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            brandDescription: true,
            createdAt: true,
          },
        },
        _count: {
          select: { designSystems: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const { credits, role, banned } = body

    // Get current user state
    const currentUser = await prisma.user.findUnique({
      where: { id },
    })

    const updates: any = {}
    if (typeof credits === 'number') updates.credits = credits
    if (role) updates.role = role
    if (typeof banned === 'boolean') updates.banned = banned

    const user = await prisma.user.update({
      where: { id },
      data: updates,
    })

    // Log specific actions
    if (typeof credits === 'number' && currentUser) {
      const diff = credits - currentUser.credits
      if (diff > 0) {
        await logAdminAction('added_credits', id, {
          amount: diff,
          newTotal: credits,
        })
      } else if (diff < 0) {
        await logAdminAction('removed_credits', id, {
          amount: Math.abs(diff),
          newTotal: credits,
        })
      }
    }

    if (role && currentUser && role !== currentUser.role) {
      await logAdminAction('changed_role', id, {
        oldRole: currentUser.role,
        newRole: role,
      })
    }

    if (typeof banned === 'boolean' && currentUser && banned !== currentUser.banned) {
      await logAdminAction(banned ? 'banned_user' : 'unbanned_user', id, {
        reason: body.reason || 'No reason provided',
      })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Get user info before deleting
    const adminUser = await prisma.user.findUnique({
      where: { id },
      select: { clerkId: true, email: true },
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    await logAdminAction('deleted_user', id, {
      email: adminUser.email,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
