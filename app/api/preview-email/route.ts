import { NextResponse } from 'next/server'
import { WelcomeEmailTemplate } from '@/lib/email/templates/welcome'

export async function GET() {
  const html = WelcomeEmailTemplate({
    userName: 'John Doe',
    userEmail: 'john@example.com',
  })

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
