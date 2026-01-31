"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, X, ChevronDown, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "Perfect for trying out 4Corners AI",
    features: [
      "5 AI generations per month",
      "Color & typography generation",
      "CSS variables export",
      "Basic component preview",
      "Community support",
    ],
    limitations: [
      "Limited to 5 generations",
      "No component code export",
      "No advanced exports",
    ],
    cta: "Start Free",
    ctaLink: "/generate",
    ctaVariant: "secondary" as const,
    popular: false,
    plan: undefined as undefined,
  },
  {
    name: "Pro",
    price: "$19",
    period: "month",
    description: "For professionals building production apps",
    features: [
      "Unlimited AI generations",
      "Full component generator",
      "Tailwind & React exports",
      "Vue & HTML/CSS exports",
      "Priority AI processing",
      "Email support",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    ctaLink: "/generate?upgrade=pro",
    ctaVariant: "primary" as const,
    popular: true,
    plan: "pro" as const,
  },
  {
    name: "Team",
    price: "$49",
    period: "month",
    description: "For teams collaborating on design systems",
    features: [
      "Everything in Pro",
      "Team access (up to 5 members)",
      "Shared design systems",
      "Figma tokens export",
      "Advanced customization",
      "Priority support",
      "Early feature access",
    ],
    limitations: [],
    cta: "Upgrade to Team",
    ctaLink: "/contact",
    ctaVariant: "secondary" as const,
    popular: false,
    plan: "team" as const,
  },
];

const featureComparison = [
  {
    feature: "AI Generations",
    free: "5 per month",
    pro: "Unlimited",
    team: "Unlimited",
  },
  {
    feature: "Color Generation",
    free: "✓",
    pro: "✓",
    team: "✓",
  },
  {
    feature: "Typography Generation",
    free: "✓",
    pro: "✓",
    team: "✓",
  },
  {
    feature: "Component Generator",
    free: "Preview only",
    pro: "Full access",
    team: "Full access",
  },
  {
    feature: "Export Formats",
    free: "CSS Variables",
    pro: "All formats",
    team: "All formats + Figma",
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Email",
    team: "Priority",
  },
];

const faqs = [
  {
    question: "Can I upgrade later?",
    answer:
      "Yes! You can upgrade from Free to Pro or Team at any time. Your existing design systems will be preserved, and you'll immediately gain access to all premium features.",
  },
  {
    question: "Do I own generated designs?",
    answer:
      "Absolutely. All design systems generated with 4Corners AI are yours to use, modify, and commercialize without restrictions. You have full ownership of the generated code and design tokens.",
  },
  {
    question: "Is this production-ready?",
    answer:
      "Yes! 4Corners AI generates production-ready code that follows industry best practices. All exports are ready to use in your projects, with proper TypeScript types, accessibility considerations, and responsive design patterns.",
  },
  {
    question: "What happens if I exceed my generation limit?",
    answer:
      "Free tier users will see a notification when they reach their limit. You can upgrade to Pro for unlimited generations, or wait until the next month for your limit to reset.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to Pro/Team features until the end of your billing period, and then your account will revert to Free tier.",
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useUser();
  const router = useRouter();

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleCheckout = async (plan: "pro" | "team") => {
    // If not authenticated, redirect to sign in
    if (!isAuthenticated) {
      router.push(`/signin?callbackUrl=/pricing&plan=${plan}`);
      return;
    }

    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="fixed inset-0 gradient-subtle -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Simple pricing for every stage
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Start free. Upgrade when you&apos;re ready to ship.
              </p>
            </motion.div>

            {/* Pricing Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
            >
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={cn(
                    "glass rounded-2xl p-8 relative",
                    tier.popular && "ring-2 ring-purple-500/50 glass-strong"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-heading text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-heading text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {tier.limitations.map((limitation, limitationIndex) => (
                      <li key={limitationIndex} className="flex items-start gap-2">
                        <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.name === "Free" ? (
                    <Link
                      href={tier.ctaLink}
                      className={cn(
                        "w-full px-6 py-3 rounded-lg font-medium transition-opacity flex items-center justify-center gap-2",
                        tier.ctaVariant === "primary"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                          : "glass-strong hover:bg-white/10 text-foreground"
                      )}
                    >
                      {tier.cta}
                      {tier.ctaVariant === "primary" && <ArrowRight className="w-5 h-5" />}
                    </Link>
                  ) : (
                    <button
                      onClick={() => tier.plan && handleCheckout(tier.plan)}
                      disabled={loadingPlan === tier.plan || authLoading}
                      className={cn(
                        "w-full px-6 py-3 rounded-lg font-medium transition-opacity flex items-center justify-center gap-2",
                        tier.ctaVariant === "primary"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 disabled:opacity-50"
                          : "glass-strong hover:bg-white/10 text-foreground disabled:opacity-50",
                        (loadingPlan === tier.plan || authLoading) && "cursor-not-allowed"
                      )}
                    >
                      {loadingPlan === tier.plan ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {tier.cta}
                          {tier.ctaVariant === "primary" && <ArrowRight className="w-5 h-5" />}
                        </>
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Comparison Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
                Compare Plans
              </h2>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 font-heading font-semibold">Feature</th>
                        <th className="text-center p-4 font-heading font-semibold">Free</th>
                        <th className="text-center p-4 font-heading font-semibold">Pro</th>
                        <th className="text-center p-4 font-heading font-semibold">Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureComparison.map((row, index) => (
                        <tr
                          key={index}
                          className={cn(
                            "border-b border-white/10",
                            index % 2 === 0 && "bg-white/5"
                          )}
                        >
                          <td className="p-4 font-medium">{row.feature}</td>
                          <td className="p-4 text-center text-sm text-muted-foreground">
                            {row.free}
                          </td>
                          <td className="p-4 text-center text-sm text-foreground">{row.pro}</td>
                          <td className="p-4 text-center text-sm text-foreground">{row.team}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    className="glass rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <span className="font-heading text-lg font-semibold pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </motion.div>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedFaq === index ? "auto" : 0,
                        opacity: expandedFaq === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center mt-20"
            >
              <div className="glass rounded-2xl p-12 max-w-3xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Start generating your design system for free. No credit card required.
                </p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-lg"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
