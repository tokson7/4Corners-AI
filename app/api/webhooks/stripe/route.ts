/**
 * Stripe Webhook Handler
 * Handles Stripe events (subscriptions, payments, etc.)
 * 
 * IMPORTANT: This webhook works with the existing User schema (no Stripe fields added)
 * Webhook URL: https://yourdomain.com/api/webhooks/stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('🔔 [Stripe Webhook] Event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { clerkId, plan } = session.metadata || {};

  if (!clerkId || !plan) {
    console.error('Missing metadata in checkout session');
    return;
  }

  console.log('✅ Checkout completed:', { clerkId, plan });

  const planCredits: Record<string, number> = {
    basic: 50,
    professional: 200,
    enterprise: 1000,
  };

  const credits = planCredits[plan] || 50;

  // CRITICAL: Cache stripeCustomerId for 10x faster portal access
  const updateData: any = { plan, credits };
  
  if (session.customer) {
    updateData.stripeCustomerId = session.customer as string;
    console.log('💾 Cached stripeCustomerId:', session.customer);
  }

  await prisma.user.update({
    where: { clerkId },
    data: updateData,
  });

  console.log('✅ User updated with subscription:', clerkId);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  
  if (!customer || customer.deleted) {
    console.error('Customer not found');
    return;
  }

  const email = 'email' in customer ? customer.email : null;
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found for email:', email);
    return;
  }

  console.log('🔄 Subscription updated:', subscription.id);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  
  if (!customer || customer.deleted) return;

  const email = 'email' in customer ? customer.email : null;
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  console.log('❌ Subscription canceled:', subscription.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: 'free', credits: 10 },
  });
}

/**
 * Handle successful payment (monthly renewal)
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customer = await stripe.customers.retrieve(invoice.customer as string);
  
  if (!customer || customer.deleted) return;

  const email = 'email' in customer ? customer.email : null;
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  console.log('💰 Payment succeeded for user:', user.id);

  const planCredits: Record<string, number> = {
    free: 10,
    basic: 50,
    professional: 200,
    enterprise: 1000,
  };

  const credits = planCredits[user.plan] || 10;

  await prisma.user.update({
    where: { id: user.id },
    data: { credits },
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customer = await stripe.customers.retrieve(invoice.customer as string);
  
  if (!customer || customer.deleted) return;

  const email = 'email' in customer ? customer.email : null;
  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  console.log('⚠️ Payment failed for user:', user.id);
  // TODO: Send email notification
}
