import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmailTemplate } from '@/lib/email/templates/welcome'
import { AdminNewUserTemplate } from '@/lib/email/templates/admin-new-user'

export async function GET() {
  console.log('\n🧪 ===== EMAIL TEST API CALLED =====')
  console.log('Environment variables check:')
  console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? `SET (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '❌ NOT SET')
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  
  try {
    console.log('\n📧 Test 1: Sending welcome email...')
    const welcomeResult = await sendEmail({
      to: 'zaridze2909@gmail.com',
      subject: '🧪 Test Welcome Email - 4Corners AI',
      html: WelcomeEmailTemplate({
        userName: 'Test User',
        userEmail: 'zaridze2909@gmail.com',
      }),
    })
    console.log('Welcome email result:', welcomeResult)

    console.log('\n📧 Test 2: Sending admin notification...')
    const adminResult = await sendEmail({
      to: 'zaridze2909@gmail.com',
      subject: '🧪 Test Admin Notification - 4 Corners AI',
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
    console.log('Admin email result:', adminResult)

    console.log('===== TEST COMPLETE =====\n')

    return NextResponse.json({
      success: true,
      message: 'Test emails sent! Check your inbox at zaridze2909@gmail.com',
      results: {
        welcome: welcomeResult,
        admin: adminResult,
      },
      env: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error: any) {
    console.error('❌ Test email failed with exception:', error)
    console.log('===== TEST FAILED =====\n')
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error,
    }, { status: 500 })
  }
}
