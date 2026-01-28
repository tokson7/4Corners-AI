import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { stripe } from "@/lib/stripe/client";

/**
 * GET /api/billing/history
 * Fetch billing history (invoices) for the authenticated user or team
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.id as string;
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    // Check if this is team billing
    if (teamId) {
      // Verify user is team owner/admin
      const { teamsStore, userTeamMap } = await import("@/lib/storage/teamStorage");
      const userTeamId = userTeamMap.get(userId);
      
      if (userTeamId !== teamId) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }

      const team = teamsStore.get(teamId);
      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 404 }
        );
      }

      const member = team.members.find((m) => m.userId === userId);
      if (!member || (member.role !== "owner" && member.role !== "admin")) {
        return NextResponse.json(
          { error: "Only team owners and admins can view billing" },
          { status: 403 }
        );
      }

      // Fetch team invoices
      if (!team.stripeCustomerId) {
        return NextResponse.json({
          success: true,
          invoices: [],
          subscription: null,
        });
      }

      const [invoices, subscriptions] = await Promise.all([
        stripe.invoices.list({
          customer: team.stripeCustomerId,
          limit: 100,
        }),
        stripe.subscriptions.list({
          customer: team.stripeCustomerId,
          limit: 1,
        }),
      ]);

      const formattedInvoices = invoices.data.map((invoice) => ({
        id: invoice.id,
        invoiceId: invoice.number || invoice.id,
        amount: invoice.amount_paid,
        amountFormatted: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: invoice.currency.toUpperCase(),
        }).format(invoice.amount_paid / 100),
        status: invoice.status,
        date: new Date(invoice.created * 1000).toISOString(),
        periodStart: invoice.period_start
          ? new Date(invoice.period_start * 1000).toISOString()
          : null,
        periodEnd: invoice.period_end
          ? new Date(invoice.period_end * 1000).toISOString()
          : null,
        downloadUrl: invoice.hosted_invoice_url || invoice.invoice_pdf || null,
        description: invoice.description || invoice.lines.data[0]?.description || "Subscription",
      }));

      const currentSubscription = subscriptions.data[0]
        ? {
            id: subscriptions.data[0].id,
            status: subscriptions.data[0].status,
            currentPeriodStart: new Date(
              subscriptions.data[0].current_period_start * 1000
            ).toISOString(),
            currentPeriodEnd: new Date(
              subscriptions.data[0].current_period_end * 1000
            ).toISOString(),
            cancelAtPeriodEnd: subscriptions.data[0].cancel_at_period_end,
            plan: subscriptions.data[0].items.data[0]?.price?.nickname || "Team",
          }
        : null;

      return NextResponse.json({
        success: true,
        invoices: formattedInvoices,
        subscription: currentSubscription,
        isTeam: true,
        teamId,
      });
    }

    // User billing (individual)
    // TODO: Fetch user's Stripe customer ID from database
    // For now, we'll check if user has a subscription stored
    // In production, you'd fetch from your database using userId
    let stripeCustomerId: string | null = null;

    // Try to get customer ID from subscription status
    // This is a placeholder - in production, fetch from database
    // For now, return empty if no customer ID found
    if (!stripeCustomerId) {
      return NextResponse.json({
        success: true,
        invoices: [],
        subscription: null,
        isTeam: false,
      });
    }

    const [invoices, subscriptions] = await Promise.all([
      stripe.invoices.list({
        customer: stripeCustomerId,
        limit: 100,
      }),
      stripe.subscriptions.list({
        customer: stripeCustomerId,
        limit: 1,
      }),
    ]);

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      invoiceId: invoice.number || invoice.id,
      amount: invoice.amount_paid,
      amountFormatted: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.currency.toUpperCase(),
      }).format(invoice.amount_paid / 100),
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000).toISOString()
        : null,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000).toISOString()
        : null,
      downloadUrl: invoice.hosted_invoice_url || invoice.invoice_pdf || null,
      description: invoice.description || invoice.lines.data[0]?.description || "Subscription",
    }));

    const currentSubscription = subscriptions.data[0]
      ? {
          id: subscriptions.data[0].id,
          status: subscriptions.data[0].status,
          currentPeriodStart: new Date(
            subscriptions.data[0].current_period_start * 1000
          ).toISOString(),
          currentPeriodEnd: new Date(
            subscriptions.data[0].current_period_end * 1000
          ).toISOString(),
          cancelAtPeriodEnd: subscriptions.data[0].cancel_at_period_end,
          plan: subscriptions.data[0].items.data[0]?.price?.nickname || "Pro",
        }
      : null;

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
      subscription: currentSubscription,
      isTeam: false,
    });
  } catch (error) {
    console.error("Failed to fetch billing history:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 }
    );
  }
}

