import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// GET single design
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const design = await prisma.designSystem.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    })

    if (!design) {
      return NextResponse.json(
        { error: 'Design system not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(design)
  } catch (error: any) {
    console.error('Get design error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH update design
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { featured, status } = body

    // Get current design state
    const currentDesign = await prisma.designSystem.findUnique({
      where: { id: params.id },
      select: { featured: true, status: true, name: true },
    })

    const updates: any = {}
    if (typeof featured === 'boolean') updates.featured = featured
    if (status) updates.status = status

    const design = await prisma.designSystem.update({
      where: { id: params.id },
      data: updates,
    })

    // Log specific actions
    if (typeof featured === 'boolean' && currentDesign && featured !== currentDesign.featured) {
      await logAdminAction(
        featured ? 'featured_design' : 'unfeatured_design',
        params.id,
        { name: currentDesign.name }
      )
    }

    if (status && currentDesign && status !== currentDesign.status) {
      await logAdminAction('changed_status', params.id, {
        name: currentDesign.name,
        oldStatus: currentDesign.status,
        newStatus: status,
      })
    }

    return NextResponse.json(design)
  } catch (error: any) {
    console.error('Update design error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE design
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const design = await prisma.designSystem.findUnique({
      where: { id: params.id },
      select: { name: true },
    })

    await prisma.designSystem.delete({
      where: { id: params.id },
    })

    await logAdminAction('deleted_design', params.id, {
      name: design?.name,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete design error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
