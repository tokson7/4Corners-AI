'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 3.99,
    credits: 50,
    features: [
      '50 AI generations per month',
      'Basic color palettes',
      'Typography pairing',
      'Email support',
      'Export to CSS/Tailwind',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 9.99,
    credits: 200,
    popular: true,
    features: [
      '200 AI generations per month',
      'Advanced color palettes',
      'Premium typography',
      'Component library',
      'Priority support',
      'Export to Figma/React/Vue',
      'Custom branding',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    credits: 1000,
    features: [
      '1000 AI generations per month',
      'Unlimited team members',
      'API access',
      'White-label option',
      '24/7 dedicated support',
      'Custom integrations',
      'Advanced analytics',
      'Priority feature requests',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/pricing');
      return;
    }

    setLoading(planId);

    try {
      console.log('[Pricing] Starting checkout for plan:', planId);
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      console.log('[Pricing] Response status:', response.status);
      const data = await response.json();
      console.log('[Pricing] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        console.log('[Pricing] Redirecting to checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error('[Pricing] No URL in response:', data);
        throw new Error(data.message || 'No checkout URL received');
      }
    } catch (error: any) {
      console.error('[Pricing] Subscription error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="animate-fast-fade-in">
            <h1 className="text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Start creating beautiful design systems with AI. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-xl border ${
                plan.popular ? 'border-purple-500' : 'border-purple-500/20'
              } rounded-2xl p-8 hover:border-purple-400 transition-all`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-purple-300">/month</span>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  {plan.credits} credits per month
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-purple-100">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? 'Loading...' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
