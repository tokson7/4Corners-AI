import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import { GenerationTier, TIER_CONFIGS } from '@/types/design-system'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmailTemplate } from '@/lib/email/templates/welcome'
import { AdminNewUserTemplate } from '@/lib/email/templates/admin-new-user'

/**
 * User Service
 * 
 * Handles all user-related database operations with idempotent logic.
 * Acts as the single source of truth for user management.
 */

export interface CreateUserInput {
  clerkId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  plan?: string
}

export interface UpdateUserInput {
  email?: string
  firstName?: string | null
  lastName?: string | null
  plan?: string
  credits?: number
}

/**
 * Create or update user in database (IDEMPOTENT)
 * 
 * This function is idempotent - it can be called multiple times with the
 * same data without creating duplicates or causing errors.
 * 
 * @param input User data from Clerk
 * @returns User record from database
 */
export async function createOrUpdateUser(
  input: CreateUserInput
): Promise<User> {
  const { clerkId, email, firstName, lastName, plan = 'free' } = input

  try {
    // Try to find existing user by clerkId
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (existingUser) {
      // User already exists - update if needed
      console.log('👤 User already exists, updating:', clerkId)
      
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          firstName,
          lastName,
          // Don't override plan if user was upgraded
          ...(existingUser.plan === 'free' && plan && { plan }),
        },
      })

      return updatedUser
    }

    // User doesn't exist - create new record
    console.log('✨ Creating new user:', clerkId)
    
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        plan,
        credits: 10, // Default free tier credits
      },
    })

    // Send welcome and admin notification emails (async, don't block)
    sendNewUserEmails(newUser).catch(error => {
      console.error('⚠️  Failed to send new user emails:', error)
    })

    return newUser
  } catch (error) {
    // Handle unique constraint violations gracefully
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string }
      
      // P2002 = Unique constraint violation
      if (prismaError.code === 'P2002') {
        console.log('🔄 Unique constraint violation, fetching existing user')
        
        // Race condition: user was created between our check and insert
        // Fetch and return the existing user
        const existingUser = await prisma.user.findUnique({
          where: { clerkId },
        })

        if (existingUser) {
          return existingUser
        }
      }
    }

    // Re-throw unexpected errors
    console.error('❌ Error in createOrUpdateUser:', error)
    throw error
  }
}

/**
 * Get user by Clerk ID
 * 
 * @param clerkId Clerk user ID
 * @returns User record or null if not found
 */
export async function getUserByClerkId(
  clerkId: string
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { clerkId },
  })
}

/**
 * Get user by email
 * 
 * @param email User email address
 * @returns User record or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

/**
 * Update user
 * 
 * @param clerkId Clerk user ID
 * @param data Data to update
 * @returns Updated user record
 */
export async function updateUser(
  clerkId: string,
  data: UpdateUserInput
): Promise<User> {
  return prisma.user.update({
    where: { clerkId },
    data,
  })
}

/**
 * Check if user has sufficient credits for a tier
 * 
 * @param clerkId Clerk user ID
 * @param tier Generation tier (basic, professional, enterprise)
 * @returns True if user has enough credits, false otherwise
 */
export async function checkCredits(
  clerkId: string,
  tier: GenerationTier
): Promise<boolean> {
  const user = await getUserByClerkId(clerkId)
  
  if (!user) {
    console.warn(`⚠️  [CREDITS] User not found: ${clerkId}`)
    return false
  }
  
  const required = TIER_CONFIGS[tier].credits
  const hasEnough = user.credits >= required
  
  console.log(`💳 [CREDITS] Check for user ${clerkId}:`)
  console.log(`   Tier: ${tier.toUpperCase()}`)
  console.log(`   Required: ${required}`)
  console.log(`   Available: ${user.credits}`)
  console.log(`   Result: ${hasEnough ? '✅ PASS' : '❌ FAIL'}`)
  
  return hasEnough
}

/**
 * Deduct credits from user
 * 
 * @param clerkId Clerk user ID
 * @param amount Amount of credits to deduct
 * @returns Updated user record
 * @throws Error if user has insufficient credits
 */
export async function deductCredits(
  clerkId: string,
  amount: number
): Promise<User> {
  console.log(`💳 [CREDITS] Deducting ${amount} credits from user ${clerkId}...`)
  
  // Get current user
  const user = await getUserByClerkId(clerkId)

  if (!user) {
    console.error(`❌ [CREDITS] User not found: ${clerkId}`)
    throw new Error('User not found')
  }

  console.log(`💳 [CREDITS] Current balance: ${user.credits}`)

  if (user.credits < amount) {
    console.error(`❌ [CREDITS] Insufficient credits: need ${amount}, have ${user.credits}`)
    throw new Error(
      `Insufficient credits. Required: ${amount}, Available: ${user.credits}`
    )
  }

  // Deduct credits
  const updatedUser = await prisma.user.update({
    where: { clerkId },
    data: {
      credits: {
        decrement: amount,
      },
    },
  })
  
  console.log(`✅ [CREDITS] Deducted ${amount} credits successfully`)
  console.log(`💳 [CREDITS] New balance: ${updatedUser.credits}`)
  
  return updatedUser
}

/**
 * Deduct credits for a specific tier
 * 
 * @param clerkId Clerk user ID
 * @param tier Generation tier
 * @returns Updated user record
 * @throws Error if user has insufficient credits
 */
export async function deductCreditsForTier(
  clerkId: string,
  tier: GenerationTier
): Promise<User> {
  const amount = TIER_CONFIGS[tier].credits
  console.log(`💳 [CREDITS] Deducting credits for ${tier.toUpperCase()} tier (${amount} credits)`)
  return deductCredits(clerkId, amount)
}

/**
 * Add credits to user
 * 
 * @param clerkId Clerk user ID
 * @param amount Amount of credits to add
 * @returns Updated user record
 */
export async function addCredits(
  clerkId: string,
  amount: number
): Promise<User> {
  return prisma.user.update({
    where: { clerkId },
    data: {
      credits: {
        increment: amount,
      },
    },
  })
}

/**
 * Update user plan
 * 
 * @param clerkId Clerk user ID
 * @param plan New plan (free, pro, enterprise)
 * @param creditsToAdd Credits to add with the new plan
 * @returns Updated user record
 */
export async function updateUserPlan(
  clerkId: string,
  plan: string,
  creditsToAdd: number = 0
): Promise<User> {
  return prisma.user.update({
    where: { clerkId },
    data: {
      plan,
      credits: {
        increment: creditsToAdd,
      },
    },
  })
}

/**
 * Get user with design systems
 * 
 * @param clerkId Clerk user ID
 * @returns User with design systems or null
 */
export async function getUserWithDesignSystems(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      designSystems: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

/**
 * Get user with usage metrics
 * 
 * @param clerkId Clerk user ID
 * @param limit Number of metrics to return
 * @returns User with usage metrics or null
 */
export async function getUserWithUsageMetrics(
  clerkId: string,
  limit: number = 10
) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      usageMetrics: {
        orderBy: { createdAt: 'desc' },
        take: limit,
      },
    },
  })
}

/**
 * Delete user (cascades to design systems and usage metrics)
 * 
 * @param clerkId Clerk user ID
 * @returns Deleted user record
 */
export async function deleteUser(clerkId: string): Promise<User> {
  return prisma.user.delete({
    where: { clerkId },
  })
}

/**
 * Send welcome and admin notification emails for new user
 * 
 * This function sends:
 * 1. Welcome email to user
 * 2. Admin notification to zaridze2909@gmail.com
 * 
 * @param user Newly created user
 */
async function sendNewUserEmails(user: User): Promise<void> {
  try {
    // Get platform stats
    const totalUsers = await prisma.user.count()
    const usersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })

    // 1. Send welcome email to user
    console.log('📧 [AUTO-CREATE] Sending welcome email to:', user.email)
    try {
      await sendEmail({
        to: user.email,
        subject: `🎨 Welcome to 4Corners AI - Your 3 Free Credits Await!`,
        html: WelcomeEmailTemplate({
          userName: user.firstName || user.lastName || 'there',
          userEmail: user.email,
        }),
      })
      console.log('✅ [AUTO-CREATE] Welcome email sent successfully')
    } catch (error) {
      console.error('❌ [AUTO-CREATE] Failed to send welcome email:', error)
    }

    // 2. Send notification to admin
    console.log('📧 [AUTO-CREATE] Sending admin notification to: zaridze2909@gmail.com')
    try {
      await sendEmail({
        to: 'zaridze2909@gmail.com',
        subject: '🎉 New User Registered on 4 Corners AI',
        html: AdminNewUserTemplate({
          userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
          userEmail: user.email,
          userId: user.clerkId,
          registrationDate: new Date().toLocaleString('en-US', {
            dateStyle: 'long',
            timeStyle: 'short',
          }),
          totalUsers,
          usersToday,
        }),
      })
      console.log('✅ [AUTO-CREATE] Admin notification sent successfully')
    } catch (error) {
      console.error('❌ [AUTO-CREATE] Failed to send admin notification:', error)
    }
  } catch (error) {
    console.error('❌ [AUTO-CREATE] Error in sendNewUserEmails:', error)
    throw error
  }
}

/**
 * Ensure user exists in database
 * 
 * This is a helper function to be called at the start of API routes
 * to ensure the Clerk user has a corresponding database record.
 * 
 * @param clerkId Clerk user ID
 * @param email User email (optional, for creation if needed)
 * @returns User record
 */
export async function ensureUserExists(
  clerkId: string,
  email?: string
): Promise<User> {
  let user = await getUserByClerkId(clerkId)

  if (!user && email) {
    // Create user if doesn't exist
    user = await createOrUpdateUser({
      clerkId,
      email,
      plan: 'free',
    })
  }

  if (!user) {
    throw new Error('User not found and could not be created')
  }

  return user
}
