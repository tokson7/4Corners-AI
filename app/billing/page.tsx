"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Download,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useTeam } from "@/lib/hooks/useTeam";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceId: string;
  amount: number;
  amountFormatted: string;
  status: string;
  date: string;
  periodStart: string | null;
  periodEnd: string | null;
  downloadUrl: string | null;
  description: string;
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: string;
}

export default function BillingPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();
  const { team, userRole, isLoading: teamLoading } = useTeam();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTeam, setIsTeam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/signin?callbackUrl=/billing");
    }
  }, [isAuthenticated, userLoading, router]);

  // Fetch billing history
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchBilling = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if user wants to view team billing
        const teamId = team && (userRole === "owner" || userRole === "admin") ? team.id : null;
        const url = teamId
          ? `/api/billing/history?teamId=${teamId}`
          : "/api/billing/history";

        const response = await fetch(url);
        
        // Check if response is ok and has content
        if (!response.ok) {
          let errorMessage = "Failed to fetch billing history";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        // Check if response has content before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }

        const text = await response.text();
        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);
        setInvoices(data.invoices || []);
        setSubscription(data.subscription);
        setIsTeam(data.isTeam || false);
      } catch (err) {
        console.error("Failed to fetch billing:", err);
        setError(err instanceof Error ? err.message : "Failed to load billing history");
        // Set empty state on error
        setInvoices([]);
        setSubscription(null);
        setIsTeam(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBilling();
  }, [isAuthenticated, user, team, userRole]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "open":
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "void":
      case "uncollectible":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      case "open":
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";
      case "void":
      case "uncollectible":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      default:
        return "bg-white/10 text-muted-foreground border-white/10";
    }
  };

  if (userLoading || teamLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-4xl font-bold mb-2">Billing & Invoices</h1>
                <p className="text-muted-foreground">
                  {isTeam
                    ? `View billing history for ${team?.name || "your team"}`
                    : "View your billing history and manage your subscription"}
                </p>
              </div>
              {team && (userRole === "owner" || userRole === "admin") && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Team Billing</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Current Subscription */}
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-2">Current Subscription</h2>
                  <p className="text-muted-foreground">
                    {subscription.plan} Plan
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium capitalize">{subscription.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Period</p>
                  <p className="font-medium">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="font-medium">
                    {subscription.cancelAtPeriodEnd
                      ? "Cancels at period end"
                      : "Active"}
                  </p>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">
                    Your subscription will cancel on{" "}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. You&apos;ll continue
                    to have access until then.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Manage Subscription
                </Link>
              </div>
            </motion.div>
          )}

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold">Billing History</h2>
              {invoices.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Loading billing history...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No invoices yet</p>
                <p className="text-sm text-muted-foreground">
                  Your invoices will appear here once you subscribe to a plan.
                </p>
                <Link
                  href="/pricing"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  View Pricing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="glass-strong rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-white/5">
                            <FileText className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-semibold">
                              {invoice.description}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Invoice #{invoice.invoiceId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(invoice.date).toLocaleDateString()}
                          </div>
                          {invoice.periodStart && invoice.periodEnd && (
                            <div className="text-muted-foreground">
                              {new Date(invoice.periodStart).toLocaleDateString()} -{" "}
                              {new Date(invoice.periodEnd).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-heading text-xl font-bold mb-1">
                            {invoice.amountFormatted}
                          </p>
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border",
                              getStatusBadge(invoice.status)
                            )}
                          >
                            {getStatusIcon(invoice.status)}
                            <span className="capitalize">{invoice.status}</span>
                          </div>
                        </div>

                        {invoice.downloadUrl && (
                          <a
                            href={invoice.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg glass hover:bg-white/10 text-foreground transition-colors"
                            aria-label="Download invoice"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

