'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Zap,
  Code,
  RefreshCw,
  Shield,
  Webhook,
  FileJson,
  Check,
  CheckCircle,
  Mail,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export default function ApiAccessPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(247);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    // Fetch waitlist count
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count || 247))
      .catch(() => setWaitlistCount(247));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const features = [
    {
      icon: Zap,
      color: 'text-yellow-400',
      title: 'Instant Generation',
      description: 'Generate complete design systems in seconds via simple API calls. No UI interaction needed.'
    },
    {
      icon: Code,
      color: 'text-blue-400',
      title: 'RESTful API',
      description: 'Simple, well-documented REST endpoints. Works with any programming language or framework.'
    },
    {
      icon: RefreshCw,
      color: 'text-green-400',
      title: 'Batch Processing',
      description: 'Generate multiple design systems in parallel. Perfect for agencies managing multiple clients.'
    },
    {
      icon: Shield,
      color: 'text-purple-400',
      title: 'Enterprise Security',
      description: 'API keys, rate limiting, and enterprise-grade security. Your data is always protected.'
    },
    {
      icon: Webhook,
      color: 'text-pink-400',
      title: 'Webhook Support',
      description: 'Get notified when generations complete. Integrate seamlessly into your existing workflows.'
    },
    {
      icon: FileJson,
      color: 'text-cyan-400',
      title: 'Multiple Formats',
      description: 'Export in CSS, Tailwind, React, or raw JSON. Use the format that fits your stack.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic API',
      badge: 'For Testing',
      badgeColor: 'text-blue-400',
      price: '$9',
      period: '/month',
      rateLimit: '100 requests/month',
      features: [
        'All API endpoints',
        'CSS & Tailwind exports',
        'Email support',
        '99.9% uptime SLA'
      ],
      buttonText: 'Join Waitlist',
      highlighted: false
    },
    {
      name: 'Professional API',
      badge: 'Most Popular ⭐',
      badgeColor: 'text-purple-400',
      price: '$49',
      period: '/month',
      rateLimit: '1,000 requests/month',
      features: [
        'Everything in Basic',
        'React & Vue exports',
        'Webhook support',
        'Priority support',
        'Batch processing'
      ],
      buttonText: 'Join Waitlist',
      highlighted: true
    },
    {
      name: 'Enterprise API',
      badge: 'For Agencies',
      badgeColor: 'text-green-400',
      price: 'Custom',
      period: '',
      rateLimit: 'Unlimited requests',
      features: [
        'Everything in Pro',
        'Custom rate limits',
        'Dedicated support',
        'SLA guarantees',
        'Custom integrations',
        'Volume discounts'
      ],
      buttonText: 'Contact Sales',
      highlighted: false
    }
  ];

  const timeline = [
    {
      status: 'Completed ✓',
      statusColor: 'bg-green-500/20 text-green-400',
      phase: 'Q4 2024 - Foundation',
      description: 'Core API architecture designed. Database schema finalized. Authentication system implemented.'
    },
    {
      status: 'In Progress',
      statusColor: 'bg-blue-500/20 text-blue-400',
      phase: 'Q1 2025 - Development',
      description: 'Building REST endpoints. Implementing rate limiting. Creating TypeScript SDK. Writing documentation.'
    },
    {
      status: 'Upcoming',
      statusColor: 'bg-purple-500/20 text-purple-400',
      phase: 'Q2 2025 - Beta Launch',
      description: 'Private beta for waitlist members. Testing with early adopters. Gathering feedback and iterating.'
    },
    {
      status: 'Planned',
      statusColor: 'bg-gray-500/20 text-gray-400',
      phase: 'Q3 2025 - Public Launch',
      description: 'Full public release. All features available. Production-ready with SLA guarantees.'
    }
  ];

  const faqs = [
    {
      q: 'When will the API launch?',
      a: "We're targeting Q2 2025 for private beta and Q3 2025 for public launch. Waitlist members will get early access at least 30 days before public release."
    },
    {
      q: 'How much will it cost?',
      a: "Basic starts at $9/month for 100 requests. Professional is $49/month for 1,000 requests. Enterprise pricing is custom based on your needs. All waitlist members get 20% off for the first 3 months."
    },
    {
      q: 'Will there be a free tier?',
      a: "Yes! We'll offer a free tier with 10 requests/month for testing and personal projects. Perfect for developers who want to try before they buy."
    },
    {
      q: 'What authentication method do you use?',
      a: "API keys with Bearer token authentication. Enterprise customers can use OAuth 2.0. All connections are encrypted with TLS 1.3."
    },
    {
      q: 'Can I test the API before it launches?',
      a: "Absolutely! Waitlist members will get exclusive access to our private beta. You'll be able to test all endpoints and provide feedback before public launch."
    }
  ];

  const codeExample = `// Generate a design system
const response = await fetch('https://api.4cornersai.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Modern SaaS app for developers',
    tier: 'professional',
    formats: ['css', 'tailwind', 'react']
  })
});

const designSystem = await response.json();
// Returns complete design system in ~15 seconds`;

  const devFeatures = [
    'Type-safe TypeScript SDK',
    'Comprehensive documentation',
    'Interactive API playground',
    'Code examples in 5+ languages',
    'Webhooks for async processing',
    'Batch endpoints for scale',
    'Real-time generation status',
    'Automatic retries & error handling'
  ];

  return (
    <div className="min-h-screen">
      {/* Static Background - 0 Performance Cost */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-semibold mb-6">
            <Clock className="w-4 h-4" />
            Coming Q2 2025
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            4Corners AI API
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Generate professional design systems programmatically. Perfect for agencies, design tools, and developer workflows.
          </p>
          
          <p className="text-lg text-purple-300 mb-8">
            Be among the first to access our API. Join the waitlist to get notified when we launch.
          </p>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">What You&apos;ll Get</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl"
                >
                  <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-200 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Capabilities Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Code Example */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Simple & Powerful</h2>
              
              <div className="bg-slate-950/80 border border-white/10 rounded-xl p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-purple-100">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>

            {/* Right Column: Features List */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Built for Developers</h2>
              
              <ul className="space-y-3">
                {devFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-purple-200">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">API Pricing</h2>
          <p className="text-lg text-purple-200 text-center mb-12">
            Pay only for what you use. All tiers include full API access.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`backdrop-blur-xl bg-white/5 border ${
                  tier.highlighted ? 'border-purple-500' : 'border-white/10'
                } p-8 rounded-2xl hover:border-purple-500/50 transition-colors`}
              >
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                  tier.highlighted ? 'bg-purple-500/20 border border-purple-500' : 'bg-white/5'
                } ${tier.badgeColor}`}>
                  {tier.badge}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-purple-200">{tier.period}</span>}
                </div>
                
                <p className="text-purple-200 mb-6">{tier.rateLimit}</p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-purple-200">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                      : 'border border-white/20 hover:border-purple-500/50 text-white'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form - Main CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-purple-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Join the Waitlist</h2>
          
          <p className="text-xl text-purple-200 mb-8">
            Be the first to know when we launch. No spam, just updates on API development and early access.
          </p>
          
          {/* Benefits */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            {[
              'Early access before public launch',
              'Special pricing for waitlist members',
              'Exclusive API documentation preview'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-lg text-purple-200">
                <Check className="w-5 h-5 text-green-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 px-6 py-4 rounded-xl md:rounded-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full text-white font-semibold shadow-2xl shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </div>
              
              {error && (
                <p className="text-red-400 text-sm mt-4">{error}</p>
              )}
            </form>
          ) : (
            <div className="max-w-2xl mx-auto backdrop-blur-xl bg-green-500/10 border border-green-500/50 p-8 rounded-2xl">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-2xl font-semibold text-white mb-2">You&apos;re on the list!</p>
              <p className="text-green-200">Check your email for confirmation.</p>
            </div>
          )}

          <p className="text-sm text-purple-300 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
          
          <p className="text-sm text-purple-400 mt-2">
            Join {waitlistCount} developers already on the waitlist
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Development Roadmap</h2>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl"
              >
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${item.statusColor}`}>
                  {item.status}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{item.phase}</h3>
                
                <p className="text-purple-200 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-purple-400 flex-shrink-0 transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <p className="px-6 pb-6 text-purple-200 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
