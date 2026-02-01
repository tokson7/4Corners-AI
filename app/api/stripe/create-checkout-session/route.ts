import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe, STRIPE_PLANS, PlanType } from '@/lib/stripe/config';
import { prisma } from '@/lib/prisma';
import { getAppBaseUrl } from '@/lib/utils/url';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('[Stripe Checkout] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to subscribe' },
        { status: 401 }
      );
    }

    const { plan } = await request.json();
    console.log('[Stripe Checkout] Request for plan:', plan);
    
    if (!plan || !(plan in STRIPE_PLANS)) {
      console.error('[Stripe Checkout] Invalid plan requested:', plan);
      return NextResponse.json(
        { error: 'Invalid plan', message: 'Please select a valid subscription plan' },
        { status: 400 }
      );
    }

    const selectedPlan = STRIPE_PLANS[plan as PlanType];
    
    // Validate Stripe configuration
    if (!selectedPlan.priceId || selectedPlan.priceId.startsWith('price_YOUR_')) {
      console.error('[Stripe Checkout] Missing or invalid Stripe Price ID for plan:', plan);
      return NextResponse.json(
        { 
          error: 'Configuration error',
          message: 'Stripe payment is not configured yet. Please contact support.',
          details: 'Missing price ID configuration'
        },
        { status: 503 }
      );
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.error('[Stripe Checkout] User not found in database:', userId);
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found' },
        { status: 404 }
      );
    }

    console.log('[Stripe Checkout] Creating session for user:', user.email);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${getAppBaseUrl()}/dashboard?payment=success`,
      cancel_url: `${getAppBaseUrl()}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    });

    console.log('[Stripe Checkout] Session created:', session.id);
    console.log('[Stripe Checkout] Checkout URL:', session.url);

    if (!session.url) {
      console.error('[Stripe Checkout] No URL returned from Stripe');
      return NextResponse.json(
        { 
          error: 'Stripe error',
          message: 'Failed to generate checkout URL',
          details: 'Stripe did not return a checkout URL'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      success: true 
    });
  } catch (error: any) {
    console.error('[Stripe Checkout] Error:', error);
    console.error('[Stripe Checkout] Error message:', error.message);
    console.error('[Stripe Checkout] Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
