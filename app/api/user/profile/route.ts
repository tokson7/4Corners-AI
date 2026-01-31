import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'

const isDev = process.env.NODE_ENV === 'development'

/**
 * GET /api/user/profile
 * 
 * Fetch the authenticated user's profile data including:
 * - Basic info (name, email, image)
 * - Plan and credits
 * - Design systems count
 * - Account created date
 * 
 * @returns User profile with statistics
 */
export async function GET() {
  try {
    const user = await requireUser()
    
    const userWithStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        plan: true,
        credits: true,
        freeGenerationsUsed: true,
        freeGenerationsLimit: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            designSystems: true,
          },
        },
      },
    })
    
    if (!userWithStats) {
      if (isDev) {
        console.error('❌ [PROFILE] User not found in database')
      }
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'User profile not found in database'
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: userWithStats.id,
        email: userWithStats.email,
        name: userWithStats.firstName && userWithStats.lastName 
          ? `${userWithStats.firstName} ${userWithStats.lastName}`.trim() 
          : userWithStats.firstName || userWithStats.lastName || 'User',
        firstName: userWithStats.firstName,
        lastName: userWithStats.lastName,
        plan: userWithStats.plan,
        credits: userWithStats.credits,
        freeGenerationsUsed: userWithStats.freeGenerationsUsed,
        freeGenerationsLimit: userWithStats.freeGenerationsLimit,
        designSystemsCount: userWithStats._count.designSystems,
        createdAt: userWithStats.createdAt,
        updatedAt: userWithStats.updatedAt,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    if (isDev) {
      console.error('❌ [PROFILE] Error:', error)
    }
    
    // Handle authentication errors
    if (error instanceof Error && (error.message.includes('Unauthorized') || error.message.includes('Authentication required'))) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          message: 'Please sign in to view your profile'
        },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profile',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
