'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TypographyShowcase() {
  const fontPairings = [
    {
      name: 'Modern Professional',
      heading: { font: 'Inter', weight: '700' },
      body: { font: 'Inter', weight: '400' },
      description: 'Clean and professional for SaaS applications'
    },
    {
      name: 'Editorial Elegance',
      heading: { font: 'Playfair Display', weight: '700' },
      body: { font: 'Lato', weight: '400' },
      description: 'Sophisticated pairing for content-heavy sites'
    },
    {
      name: 'Tech Startup',
      heading: { font: 'Space Grotesk', weight: '700' },
      body: { font: 'Inter', weight: '400' },
      description: 'Contemporary and approachable for tech products'
    },
  ]

  const typeScale = [
    { name: 'Display', size: '64px', weight: '700' },
    { name: 'H1', size: '48px', weight: '700' },
    { name: 'H2', size: '36px', weight: '700' },
    { name: 'H3', size: '28px', weight: '600' },
    { name: 'H4', size: '24px', weight: '600' },
    { name: 'H5', size: '20px', weight: '600' },
    { name: 'Body Large', size: '18px', weight: '400' },
    { name: 'Body', size: '16px', weight: '400' },
    { name: 'Body Small', size: '14px', weight: '400' },
    { name: 'Caption', size: '12px', weight: '400' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/#showcase"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Typography System</h1>
          <p className="text-purple-200 text-lg">
            Consistent typography scales and font pairings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Type Scale */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Type Scale</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 space-y-8">
            {typeScale.map((type) => (
              <div key={type.name} className="border-b border-white/10 pb-6 last:border-0">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-purple-300 font-semibold">{type.name}</span>
                  <span className="text-purple-400 text-sm">
                    {type.size} / {type.weight}
                  </span>
                </div>
                <p 
                  className="text-white"
                  style={{ 
                    fontSize: type.size, 
                    fontWeight: type.weight,
                    lineHeight: '1.2'
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Font Pairings */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Font Pairings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {fontPairings.map((pairing) => (
              <div 
                key={pairing.name}
                className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <h3 className="text-white font-bold text-xl mb-3">{pairing.name}</h3>
                <p className="text-purple-200 text-sm mb-6">{pairing.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-purple-300 text-xs font-semibold mb-2">
                      HEADING
                    </div>
                    <p 
                      className="text-white text-2xl"
                      style={{ 
                        fontFamily: pairing.heading.font,
                        fontWeight: pairing.heading.weight
                      }}
                    >
                      Design Systems
                    </p>
                    <div className="text-purple-400 text-xs mt-1">
                      {pairing.heading.font} {pairing.heading.weight}
                    </div>
                  </div>

                  <div>
                    <div className="text-purple-300 text-xs font-semibold mb-2">
                      BODY TEXT
                    </div>
                    <p 
                      className="text-purple-100"
                      style={{ 
                        fontFamily: pairing.body.font,
                        fontWeight: pairing.body.weight
                      }}
                    >
                      Create beautiful and consistent typography for your applications.
                    </p>
                    <div className="text-purple-400 text-xs mt-1">
                      {pairing.body.font} {pairing.body.weight}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real-world Example */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">In Context</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              Typography Matters
            </h1>
            <h2 className="text-3xl font-semibold text-purple-300 mb-6">
              Create hierarchy and improve readability
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed mb-6">
              Good typography is invisible. It doesn&apos;t get noticed because it just works. 
              It creates a hierarchy, guides the reader&apos;s eye, and makes content more 
              accessible and enjoyable to read.
            </p>
            <p className="text-lg text-purple-200 leading-relaxed mb-4">
              With 4Corners AI, you can generate perfectly balanced typography systems 
              that include font pairings, size scales, and spacing that work harmoniously 
              together.
            </p>
            <p className="text-purple-300">
              Generate your typography system in seconds →
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Build your typography system
          </h3>
          <p className="text-purple-200 mb-6">
            AI-powered font pairing and type scale generation
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Start Creating
          </Link>
        </div>
      </div>
    </div>
  )
}
