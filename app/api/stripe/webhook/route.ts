import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update user subscription using existing schema (no Stripe fields)
        if (session.metadata?.userId) {
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              plan: session.metadata.plan || 'free',
            },
          });
        }
        
        console.log('✅ Subscription created:', session.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Add credits to user account by email (no stripeCustomerId in schema)
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        
        if (customer && !customer.deleted && 'email' in customer && customer.email) {
          const user = await prisma.user.findUnique({
            where: { email: customer.email },
          });

          if (user) {
            // Determine credits based on plan
            let creditsToAdd = 50; // basic
            if (user.plan === 'pro' || user.plan === 'professional') creditsToAdd = 200;
            if (user.plan === 'enterprise') creditsToAdd = 1000;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                credits: { increment: creditsToAdd },
              },
            });
            
            console.log(`✅ Added ${creditsToAdd} credits to user ${user.email}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get customer email to find user
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && 'email' in customer && customer.email) {
          await prisma.user.updateMany({
            where: { email: customer.email },
            data: {
              plan: 'free',
              credits: 10, // Reset to free tier credits
            },
          });
          
          console.log('✅ Subscription cancelled:', subscription.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

