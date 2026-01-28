import { getOrCreateCurrentUser } from '@/lib/utils/auth'

/**
 * GET /api/user/me
 * 
 * Get the current authenticated user's data from the database.
 * 
 * This endpoint automatically creates a user record if it doesn't exist yet
 * (in case webhook hasn't fired or failed).
 * 
 * Returns:
 * - User data: id, clerkId, email, firstName, lastName, plan, credits
 * - Timestamps: createdAt, updatedAt
 * 
 * @returns User record from database
 */
export async function GET() {
  try {
    // Get or create user (handles case where webhook might have failed)
    const user = await getOrCreateCurrentUser()

    // Return user data (exclude sensitive fields if any)
    return Response.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
        credits: user.credits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)

    // Check if error is authentication-related
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return Response.json(
        {
          success: false,
          error: 'Unauthorized - please sign in',
        },
        { status: 401 }
      )
    }

    // Generic error response
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch user data',
      },
      { status: 500 }
    )
  }
}
