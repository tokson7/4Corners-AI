import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { createOrUpdateUser } from '@/lib/services/user-service'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmailTemplate } from '@/lib/email/templates/welcome'
import { AdminNewUserTemplate } from '@/lib/email/templates/admin-new-user'
import { prisma } from '@/lib/prisma'

/**
 * Clerk Webhook Handler
 * 
 * Syncs Clerk users with our database on user creation and updates.
 * 
 * Events handled:
 * - user.created: Creates a new User record in database
 * - user.updated: Updates existing User record
 * 
 * Setup instructions:
 * 1. Go to Clerk Dashboard → Webhooks
 * 2. Add endpoint: https://your-domain.com/api/webhooks/clerk
 * 3. Subscribe to: user.created, user.updated
 * 4. Copy signing secret to .env as CLERK_WEBHOOK_SECRET
 */

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in environment variables')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- missing svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred during verification', {
      status: 400,
    })
  }

  // Handle the webhook event
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      // Extract user data from Clerk event
      const { id, email_addresses, first_name, last_name } = evt.data

      // Get primary email
      const primaryEmail = email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )

      if (!primaryEmail) {
        console.error('No primary email found for user:', id)
        return new Response('No primary email found', { status: 400 })
      }

      // Create user in database (idempotent)
      const user = await createOrUpdateUser({
        clerkId: id,
        email: primaryEmail.email_address,
        firstName: first_name || null,
        lastName: last_name || null,
        plan: 'free',
      })

      console.log('✅ User created in database:', {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        plan: user.plan,
      })

      // Get platform stats
      const totalUsers = await prisma.user.count()
      const usersToday = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      })

      // Send welcome email to user
      console.log('📧 Sending welcome email to:', user.email)
      try {
        await sendEmail({
          to: user.email,
          subject: '🎨 Welcome to 4Corners AI - Your 3 Free Credits Await!',
          html: WelcomeEmailTemplate({
            userName: user.firstName || user.lastName || 'there',
            userEmail: user.email,
          }),
        })
        console.log('✅ Welcome email sent successfully')
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error)
        // Don't fail the webhook if email fails
      }

      // Send notification to admin
      console.log('📧 Sending admin notification to: zaridze2909@gmail.com')
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
        console.log('✅ Admin notification sent successfully')
      } catch (error) {
        console.error('❌ Failed to send admin notification:', error)
        // Don't fail the webhook if email fails
      }

      return new Response(
        JSON.stringify({ success: true, userId: user.id }),
        { status: 201 }
      )
    }

    if (eventType === 'user.updated') {
      // Extract user data from Clerk event
      const { id, email_addresses, first_name, last_name } = evt.data

      // Get primary email
      const primaryEmail = email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )

      if (!primaryEmail) {
        console.error('No primary email found for user:', id)
        return new Response('No primary email found', { status: 400 })
      }

      // Update user in database (idempotent)
      const user = await createOrUpdateUser({
        clerkId: id,
        email: primaryEmail.email_address,
        firstName: first_name || null,
        lastName: last_name || null,
      })

      console.log('✅ User updated in database:', {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
      })

      return new Response(
        JSON.stringify({ success: true, userId: user.id }),
        { status: 200 }
      )
    }

    // For other events, just return success
    return new Response(
      JSON.stringify({ success: true, message: 'Event received' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error handling webhook event:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    )
  }
}
