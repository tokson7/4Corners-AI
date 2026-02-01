import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/prisma';
import { getAppBaseUrl } from '@/lib/utils/url';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to manage your subscription' },
        { status: 401 }
      );
    }

    // Fetch user with stripeCustomerId if available
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found' },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // FAST PATH: Use cached stripeCustomerId if available
    if (!customerId) {
      // SLOW PATH: Look up customer by email (only first time)
      console.log('[PORTAL] No cached stripeCustomerId, looking up by email...');
      
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return NextResponse.json(
          { 
            error: 'No subscription found', 
            message: 'You don\'t have an active subscription yet. Subscribe to a plan to access the billing portal.',
            redirectTo: '/pricing',
          },
          { status: 404 }
        );
      }

      customerId = customers.data[0].id;

      // Cache the stripeCustomerId for future requests (critical performance optimization)
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });

      console.log('[PORTAL] Cached stripeCustomerId for future requests');
    }

    // Create portal session with timeout protection
    const sessionPromise = stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppBaseUrl()}/dashboard`,
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stripe API timeout')), 8000)
    );

    const session = await Promise.race([sessionPromise, timeoutPromise]) as any;

    return NextResponse.json({ 
      url: session.url,
      success: true,
    });
  } catch (error: any) {
    console.error('[PORTAL] Error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Unable to create portal session. Please contact support.' },
        { status: 400 }
      );
    }

    if (error.message === 'Stripe API timeout') {
      return NextResponse.json(
        { error: 'Timeout', message: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create portal session', message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
