import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/waitlist
 * Add email to API waitlist
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Check if already on waitlist
    const existing = await prisma.apiWaitlist.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'You are already on the waitlist' },
        { status: 400 }
      );
    }
    
    // Add to waitlist
    await prisma.apiWaitlist.create({
      data: {
        email: email.toLowerCase().trim(),
        source: 'website',
      }
    });
    
    // TODO: Send confirmation email (implement later)
    // await sendWaitlistConfirmation(email)
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist'
    });
    
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist
 * Get waitlist count
 */
export async function GET() {
  try {
    const count = await prisma.apiWaitlist.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
