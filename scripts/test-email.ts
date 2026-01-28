/**
 * Email Testing Script
 * 
 * Run this to test if emails are working correctly:
 * npx tsx scripts/test-email.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmailTemplate } from '@/lib/email/templates/welcome'
import { AdminNewUserTemplate } from '@/lib/email/templates/admin-new-user'

async function testEmails() {
  console.log('🧪 Testing Email System...\n')

  // Test 1: Welcome Email
  console.log('📧 Test 1: Sending Welcome Email to zaridze2909@gmail.com')
  const welcomeResult = await sendEmail({
    to: 'zaridze2909@gmail.com',
    subject: '🧪 TEST: Welcome Email',
    html: WelcomeEmailTemplate({
      userName: 'Test User',
      userEmail: 'zaridze2909@gmail.com',
    }),
  })

  console.log('Result:', welcomeResult)
  console.log('\n---\n')

  // Test 2: Admin Notification Email
  console.log('📧 Test 2: Sending Admin Notification to zaridze2909@gmail.com')
  const adminResult = await sendEmail({
    to: 'zaridze2909@gmail.com',
    subject: '🧪 TEST: Admin Notification',
    html: AdminNewUserTemplate({
      userName: 'Test User',
      userEmail: 'test@example.com',
      userId: 'user_test123',
      registrationDate: new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      totalUsers: 15,
      usersToday: 3,
    }),
  })

  console.log('Result:', adminResult)
  console.log('\n---\n')

  // Summary
  console.log('📊 Test Summary:')
  console.log('  Welcome Email:', welcomeResult.success ? '✅ SUCCESS' : '❌ FAILED')
  console.log('  Admin Email:', adminResult.success ? '✅ SUCCESS' : '❌ FAILED')
  
  if (!welcomeResult.success || !adminResult.success) {
    console.log('\n⚠️  Some emails failed. Check the errors above.')
    console.log('\nCommon issues:')
    console.log('  1. RESEND_API_KEY not set or invalid')
    console.log('  2. Email address not verified in Resend (for test domain)')
    console.log('  3. Rate limiting (free tier has limits)')
    console.log('\nTo fix:')
    console.log('  1. Check .env.local has RESEND_API_KEY')
    console.log('  2. Verify email in Resend dashboard: https://resend.com/emails')
    console.log('  3. Check Resend logs for detailed errors')
  } else {
    console.log('\n✅ All emails sent successfully!')
    console.log('   Check your inbox at: zaridze2909@gmail.com')
  }
}

testEmails().catch(console.error)
