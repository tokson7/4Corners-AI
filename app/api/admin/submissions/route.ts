import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/utils/auth'

export async function GET(req: NextRequest) {
  try {
    // Check authentication (admin only in production)
    // For now, just require user to be logged in
    await requireUser()
    
    // Get query params
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    
    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    
    // Fetch submissions
    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    })
    
    return NextResponse.json({
      success: true,
      submissions,
    })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
