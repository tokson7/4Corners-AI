import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import Stripe from "stripe";
import { verifyStripeWebhook, validateWebhookPayload, checkWebhookReplay } from "@/lib/security/webhookSecurity";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // Verify webhook signature
  const verification = await verifyStripeWebhook(body, signature);
  if (!verification.valid) {
    return NextResponse.json(
      { error: verification.error || "Webhook verification failed" },
      { status: 400 }
    );
  }

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Stripe SDK verifies signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Validate webhook payload
  const payloadValidation = validateWebhookPayload(event);
  if (!payloadValidation.valid) {
    return NextResponse.json(
      { error: payloadValidation.error || "Invalid webhook payload" },
      { status: 400 }
    );
  }

  // Check for replay attacks
  const replayCheck = checkWebhookReplay(event.id);
  if (replayCheck.isReplay) {
    console.warn(`Replay attack detected: ${event.id}`);
    return NextResponse.json(
      { error: "Webhook already processed" },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      const teamId = session.metadata?.teamId;

      if (userId && plan) {
        // TODO: Update user subscription in database
        // If team plan, update team subscription instead of user
        // if (plan === "team" && teamId) {
        //   await updateTeamSubscription(teamId, {
        //     plan: "team",
        //     stripeCustomerId: session.customer as string,
        //     stripeSubscriptionId: session.subscription as string,
        //     status: "active",
        //   });
        // } else {
        //   await updateUserSubscription(userId, {
        //     plan,
        //     stripeCustomerId: session.customer as string,
        //     stripeSubscriptionId: session.subscription as string,
        //     status: "active",
        //   });
        // }
        console.log(`Subscription created for ${teamId ? `team ${teamId}` : `user ${userId}`} with plan ${plan}`);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        // TODO: Update subscription status in database
        // await updateSubscriptionStatus(subscriptionId, "active");
        console.log(`Invoice paid for subscription ${subscriptionId}`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const subscriptionId = subscription.id;

      if (subscriptionId) {
        // TODO: Update subscription status in database
        // await updateSubscriptionStatus(subscriptionId, "canceled");
        console.log(`Subscription canceled: ${subscriptionId}`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const subscriptionId = subscription.id;
      const status = subscription.status;

      if (subscriptionId) {
        // TODO: Update subscription status in database
        // await updateSubscriptionStatus(subscriptionId, status);
        console.log(`Subscription updated: ${subscriptionId} - ${status}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
