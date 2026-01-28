import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/utils/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    await requireUser()
    
    const body = await req.json()
    const { status, adminNotes } = body
    
    // Update submission
    const submission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(adminNotes && { adminNotes }),
      },
    })
    
    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
