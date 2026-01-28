import { auth, currentUser } from '@clerk/nextjs/server'
import { getUserByClerkId, ensureUserExists } from '@/lib/services/user-service'
import { User } from '@/lib/prisma'

/**
 * Authentication Utilities
 * 
 * Helper functions for authentication and user management in API routes.
 */

/**
 * Get the current authenticated user from database
 * 
 * This function:
 * 1. Gets the Clerk userId from session
 * 2. Fetches the corresponding User from database
 * 3. Returns user or null if not authenticated
 * 
 * Use this in API routes that require authentication.
 * 
 * @returns User record or null if not authenticated
 * 
 * @example
 * ```ts
 * export async function GET() {
 *   const user = await getCurrentUser()
 *   if (!user) {
 *     return new Response('Unauthorized', { status: 401 })
 *   }
 *   // Use user.id, user.credits, etc.
 * }
 * ```
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await getUserByClerkId(userId)
  return user
}

/**
 * Get the current authenticated user or throw error
 * 
 * This function is similar to getCurrentUser but throws an error
 * if the user is not authenticated, making it easier to use in
 * routes that require authentication.
 * 
 * @returns User record
 * @throws Error if not authenticated
 * 
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   try {
 *     const user = await requireUser()
 *     // User is guaranteed to exist here
 *   } catch (error) {
 *     return new Response('Unauthorized', { status: 401 })
 *   }
 * }
 * ```
 */
export async function requireUser(): Promise<User> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Authentication required. Please sign in again.')
  }

  const user = await getUserByClerkId(userId)

  if (!user) {
    // Try to get user from Clerk and create database record
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      throw new Error('Unauthorized - user not found in Clerk')
    }

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )

    if (!primaryEmail) {
      throw new Error('User has no primary email')
    }

    // Create user in database
    const newUser = await ensureUserExists(userId, primaryEmail.emailAddress)
    return newUser
  }
  
  return user
}

/**
 * Get or create current user
 * 
 * This function ensures the Clerk user has a database record.
 * Useful for handling cases where webhook might have failed.
 * 
 * @returns User record
 * @throws Error if not authenticated
 * 
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   const user = await getOrCreateCurrentUser()
 *   // User is guaranteed to exist in database
 * }
 * ```
 */
export async function getOrCreateCurrentUser(): Promise<User> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized - user not authenticated')
  }

  // Try to get existing user
  let user = await getUserByClerkId(userId)

  if (!user) {
    // User doesn't exist in database, fetch from Clerk and create
    const clerkUser = await currentUser()

    if (!clerkUser) {
      throw new Error('Unable to fetch user from Clerk')
    }

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )

    if (!primaryEmail) {
      throw new Error('User has no primary email')
    }

    // Create user in database
    user = await ensureUserExists(userId, primaryEmail.emailAddress)
  }

  return user
}

/**
 * Check if user has sufficient credits
 * 
 * @param user User record
 * @param required Required credits
 * @returns true if user has sufficient credits
 */
export function hasCredits(user: User, required: number): boolean {
  return user.credits >= required
}

/**
 * Check if user is on a specific plan
 * 
 * @param user User record
 * @param plan Plan to check
 * @returns true if user is on the specified plan
 */
export function isOnPlan(user: User, plan: string): boolean {
  return user.plan.toLowerCase() === plan.toLowerCase()
}

/**
 * Check if user is on free plan
 * 
 * @param user User record
 * @returns true if user is on free plan
 */
export function isFreePlan(user: User): boolean {
  return isOnPlan(user, 'free')
}

/**
 * Check if user is on pro plan or higher
 * 
 * @param user User record
 * @returns true if user is on pro or enterprise plan
 */
export function isProOrHigher(user: User): boolean {
  return isOnPlan(user, 'pro') || isOnPlan(user, 'enterprise')
}

/**
 * Get credits required for an action
 * 
 * @param action Action type
 * @returns Number of credits required
 */
export function getCreditsRequired(action: string): number {
  const creditMap: Record<string, number> = {
    generate_colors: 1,
    generate_typography: 1,
    generate_components: 2,
    generate_full_system: 3,
    export_code: 1,
    ai_refine: 1,
  }

  return creditMap[action] || 1
}

/**
 * Create a standardized unauthorized response
 * 
 * @returns Response with 401 status
 */
export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Unauthorized - please sign in',
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

/**
 * Create a standardized insufficient credits response
 * 
 * @param required Required credits
 * @param available Available credits
 * @returns Response with 402 status
 */
export function insufficientCreditsResponse(
  required: number,
  available: number
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Insufficient credits',
      details: {
        required,
        available,
        shortfall: required - available,
      },
    }),
    {
      status: 402,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
