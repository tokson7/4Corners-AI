import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createOrUpdateUser } from '@/lib/services/user-service'

/**
 * Auth Callback Handler
 * 
 * This route is called after successful sign-in (including OAuth).
 * It ensures the user exists in the database and triggers welcome emails.
 * 
 * This handles the edge case where OAuth sign-in creates a Clerk account
 * but doesn't immediately trigger our auto-create flow.
 */
export async function GET(request: Request) {
  console.log('🔐 [AUTH-CALLBACK] Processing authentication callback...')
  
  try {
    // Get the current user from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      console.error('❌ [AUTH-CALLBACK] No authenticated user found')
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    console.log('✅ [AUTH-CALLBACK] Clerk user found:', clerkUser.id)

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )

    if (!primaryEmail) {
      console.error('❌ [AUTH-CALLBACK] No primary email found')
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    })

    if (existingUser) {
      console.log('👤 [AUTH-CALLBACK] User already exists in database')
      // User exists, just redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // User doesn't exist - create and send welcome emails
    console.log('✨ [AUTH-CALLBACK] Creating new user and sending welcome emails...')
    
    await createOrUpdateUser({
      clerkId: clerkUser.id,
      email: primaryEmail.emailAddress,
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      plan: 'free',
    })

    console.log('✅ [AUTH-CALLBACK] User created successfully')
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
    
  } catch (error) {
    console.error('❌ [AUTH-CALLBACK] Error:', error)
    // On error, still redirect to dashboard (user is authenticated in Clerk)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
