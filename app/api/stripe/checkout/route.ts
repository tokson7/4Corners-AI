import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/utils/auth";
import { stripe, STRIPE_PLANS } from "@/lib/stripe/config";
import { trackEventServer } from "@/lib/analytics/trackEvent";

export async function POST(req: NextRequest) {
  try {
    // Check authentication using Clerk
    const user = await requireUser();

    const body = await req.json();
    const { priceId, plan } = body;

    // Validate plan
    if (!plan || !["pro", "team"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Get price ID from STRIPE_PLANS
    const planKey = plan === "team" ? "enterprise" : "pro";
    const selectedPriceId = priceId || STRIPE_PLANS[planKey]?.priceId;
    if (!selectedPriceId) {
      return NextResponse.json(
        { error: "Price ID not configured" },
        { status: 500 }
      );
    }

    // Get origin URL for redirects
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        plan,
      },
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    // Track upgrade initiated (non-blocking)
    trackEventServer("plan_upgraded", {
      userId: user.id,
      plan: plan as "pro" | "team",
      timestamp: new Date().toISOString(),
      fromPlan: "free", // TODO: Get actual current plan
      toPlan: plan as "pro" | "team",
    }).catch(() => {});

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
