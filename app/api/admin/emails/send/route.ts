import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { sendEmail } from '@/lib/email/resend'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { recipient, userId, subject, message } = await req.json()

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    let emailsToSend: string[] = []

    if (recipient === 'all') {
      // Get all user emails
      const users = await prisma.user.findMany({
        select: { email: true },
      })
      emailsToSend = users.map((u: { email: string }) => u.email)
    } else if (recipient === 'user' && userId) {
      emailsToSend = [userId] // userId is actually the email in this case
    } else {
      return NextResponse.json(
        { error: 'Invalid recipient configuration' },
        { status: 400 }
      )
    }

    if (emailsToSend.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      )
    }

    // Send emails
    const results = await Promise.all(
      emailsToSend.map((email) =>
        sendEmail({
          to: email,
          subject,
          html: message,
        })
      )
    )

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      total: emailsToSend.length,
    })
  } catch (error: any) {
    console.error('Failed to send emails:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    )
  }
}
