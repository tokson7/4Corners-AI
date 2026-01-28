'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'

export default function DesignTokensShowcase() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const colorTokens = [
    { name: 'Primary', value: '#8B5CF6', css: '--color-primary' },
    { name: 'Secondary', value: '#3B82F6', css: '--color-secondary' },
    { name: 'Accent', value: '#EC4899', css: '--color-accent' },
    { name: 'Success', value: '#10B981', css: '--color-success' },
    { name: 'Warning', value: '#F59E0B', css: '--color-warning' },
    { name: 'Error', value: '#EF4444', css: '--color-error' },
  ]

  const spacingTokens = [
    { name: 'xs', value: '4px', css: '--spacing-xs' },
    { name: 'sm', value: '8px', css: '--spacing-sm' },
    { name: 'md', value: '16px', css: '--spacing-md' },
    { name: 'lg', value: '24px', css: '--spacing-lg' },
    { name: 'xl', value: '32px', css: '--spacing-xl' },
    { name: '2xl', value: '48px', css: '--spacing-2xl' },
  ]

  const typographyTokens = [
    { name: 'Heading 1', size: '48px', weight: '700', css: '--font-h1' },
    { name: 'Heading 2', size: '36px', weight: '700', css: '--font-h2' },
    { name: 'Heading 3', size: '24px', weight: '600', css: '--font-h3' },
    { name: 'Body Large', size: '18px', weight: '400', css: '--font-body-lg' },
    { name: 'Body', size: '16px', weight: '400', css: '--font-body' },
    { name: 'Small', size: '14px', weight: '400', css: '--font-small' },
  ]

  const copyToClipboard = (value: string, name: string) => {
    navigator.clipboard.writeText(value)
    setCopiedToken(name)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24">
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
          <h1 className="text-4xl font-bold text-white mb-2">Design Tokens</h1>
          <p className="text-purple-200 text-lg">
            Centralized design tokens for colors, typography, spacing, and more
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* Color Tokens */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Color Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorTokens.map((token) => (
              <div 
                key={token.name}
                className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <div 
                  className="w-full h-24 rounded-lg mb-4 shadow-lg"
                  style={{ backgroundColor: token.value }}
                />
                <h3 className="text-white font-semibold text-lg mb-2">{token.name}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => copyToClipboard(token.value, token.name + '-hex')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg text-purple-200 hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-mono text-sm">{token.value}</span>
                    {copiedToken === token.name + '-hex' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(token.css, token.name + '-css')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg text-purple-200 hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-mono text-sm">{token.css}</span>
                    {copiedToken === token.name + '-css' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Tokens */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Spacing Tokens</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8">
            <div className="space-y-4">
              {spacingTokens.map((token) => (
                <div 
                  key={token.name}
                  className="flex items-center gap-6"
                >
                  <div className="w-32 text-purple-200 font-semibold">{token.name}</div>
                  <div 
                    className="bg-purple-500 h-8 rounded"
                    style={{ width: token.value }}
                  />
                  <div className="text-white font-mono">{token.value}</div>
                  <button
                    onClick={() => copyToClipboard(token.css, token.name)}
                    className="ml-auto text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {copiedToken === token.name ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography Tokens */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Typography Tokens</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 space-y-6">
            {typographyTokens.map((token) => (
              <div 
                key={token.name}
                className="border-b border-white/10 pb-6 last:border-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-200 font-semibold">{token.name}</span>
                  <div className="flex gap-4 text-sm text-purple-300">
                    <span>{token.size}</span>
                    <span>Weight: {token.weight}</span>
                  </div>
                </div>
                <p 
                  className="text-white mb-2"
                  style={{ fontSize: token.size, fontWeight: token.weight }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
                <button
                  onClick={() => copyToClipboard(token.css, token.name)}
                  className="text-purple-300 hover:text-purple-200 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="font-mono">{token.css}</span>
                  {copiedToken === token.name ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to create your own design system?
          </h3>
          <p className="text-purple-200 mb-6">
            Generate consistent design tokens in seconds with AI
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Start Generating
          </Link>
        </div>
      </div>
    </div>
  )
}
