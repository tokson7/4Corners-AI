'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Code2, Eye, Sparkles } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { generateAllComponentsWithTemplates } from '@/lib/generators/enhancedComponentGenerator'
import type { GeneratedComponent } from '@/lib/generators/enhancedComponentGenerator'

type Framework = 'react' | 'vue' | 'svelte' | 'html'
type Category = 'button' | 'card' | 'input' | 'alert'
type ViewMode = 'preview' | 'code'

const categoryInfo: Record<Category, { name: string; icon: string; description: string }> = {
  button: {
    name: 'Buttons',
    icon: '🔘',
    description: 'Interactive buttons with multiple variants and states',
  },
  card: {
    name: 'Cards',
    icon: '🃏',
    description: 'Content containers with various styling options',
  },
  input: {
    name: 'Inputs',
    icon: '📝',
    description: 'Form input fields with labels and validation',
  },
  alert: {
    name: 'Alerts',
    icon: '🔔',
    description: 'Notification and message components',
  },
}

const frameworkInfo: Record<Framework, { name: string; color: string; lang: string }> = {
  react: { name: 'React', color: 'bg-blue-500', lang: 'tsx' },
  vue: { name: 'Vue', color: 'bg-green-500', lang: 'vue' },
  svelte: { name: 'Svelte', color: 'bg-orange-500', lang: 'svelte' },
  html: { name: 'HTML/CSS', color: 'bg-red-500', lang: 'html' },
}

// Generate sample components with demo design tokens
const generateSampleComponents = (): GeneratedComponent[] => {
  const samplePalette = {
    primary: {
      name: 'Primary',
      shades: {
        50: { hex: '#f5f3ff' },
        100: { hex: '#ede9fe' },
        200: { hex: '#ddd6fe' },
        300: { hex: '#c4b5fd' },
        400: { hex: '#a78bfa' },
        500: { hex: '#8b5cf6' },
        600: { hex: '#7c3aed' },
        700: { hex: '#6d28d9' },
        800: { hex: '#5b21b6' },
        900: { hex: '#4c1d95' },
      },
    },
    neutral: {
      name: 'Neutral',
      shades: {
        50: { hex: '#f9fafb' },
        100: { hex: '#f3f4f6' },
        200: { hex: '#e5e7eb' },
        300: { hex: '#d1d5db' },
        400: { hex: '#9ca3af' },
        500: { hex: '#6b7280' },
        600: { hex: '#4b5563' },
        700: { hex: '#374151' },
        800: { hex: '#1f2937' },
        900: { hex: '#111827' },
      },
    },
    semantic: {
      success: {
        name: 'Success',
        shades: {
          500: { hex: '#10b981' },
        },
      },
      error: {
        name: 'Error',
        shades: {
          500: { hex: '#ef4444' },
        },
      },
      warning: {
        name: 'Warning',
        shades: {
          500: { hex: '#f59e0b' },
        },
      },
      info: {
        name: 'Info',
        shades: {
          500: { hex: '#3b82f6' },
        },
      },
    },
  }

  const sampleTypography = {
    fontPairs: [
      {
        heading: { family: 'Inter', fallback: 'sans-serif' },
        body: { family: 'Inter', fallback: 'sans-serif' },
      },
    ],
    typeScale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  }

  return generateAllComponentsWithTemplates(samplePalette as any, sampleTypography as any)
}

export default function ComponentsShowcase() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react')
  const [selectedCategory, setSelectedCategory] = useState<Category>('button')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [components, setComponents] = useState<GeneratedComponent[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    // Generate sample components on mount
    const sampleComponents = generateSampleComponents()
    setComponents(sampleComponents)
  }, [])

  // Group components by category
  const componentsByCategory = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = []
    }
    acc[component.category].push(component)
    return acc
  }, {} as Record<string, GeneratedComponent[]>)

  const currentComponents = componentsByCategory[selectedCategory] || []

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/#showcase"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Component Library</h1>
              <p className="text-purple-200 text-lg">
                Production-ready components generated from design tokens
              </p>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
            >
              <Sparkles className="w-5 h-5" />
              Generate Your Own
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Category Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(categoryInfo) as Category[]).map((category) => {
              const info = categoryInfo[category]
              const count = componentsByCategory[category]?.length || 0
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left
                    ${
                      selectedCategory === category
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{info.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {info.name}
                  </h3>
                  <p className="text-sm text-purple-200 mb-2">
                    {info.description}
                  </p>
                  <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded">
                    {count} variants
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Framework Selector & View Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="flex gap-2">
            {(Object.keys(frameworkInfo) as Framework[]).map((framework) => {
              const info = frameworkInfo[framework]
              return (
                <button
                  key={framework}
                  onClick={() => setSelectedFramework(framework)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-all
                    ${
                      selectedFramework === framework
                        ? `${info.color} text-white shadow-lg`
                        : 'bg-white/5 text-purple-300 hover:bg-white/10'
                    }
                  `}
                >
                  {info.name}
                </button>
              )
            })}
          </div>
          
          <div className="flex gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`
                px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2
                ${
                  viewMode === 'preview'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:text-white'
                }
              `}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`
                px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2
                ${
                  viewMode === 'code'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:text-white'
                }
              `}
            >
              <Code2 className="w-4 h-4" />
              Code
            </button>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {currentComponents.map((component) => {
            const code = component.code[selectedFramework]
            const componentId = `${component.name}-${component.variant}-${selectedFramework}`
            
            return (
              <div
                key={componentId}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all"
              >
                {/* Component Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">
                      {component.variant}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {categoryInfo[component.category as Category]?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(code, componentId)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    title="Copy code"
                  >
                    {copiedId === componentId ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-300" />
                    )}
                  </button>
                </div>

                {/* Component Content */}
                <div className="p-6">
                  {viewMode === 'preview' ? (
                    <div className="p-8 bg-slate-900/50 rounded-lg border border-white/5 min-h-[200px] flex items-center justify-center">
                      <style dangerouslySetInnerHTML={{ __html: component.code.css }} />
                      <div dangerouslySetInnerHTML={{ __html: component.code.html }} />
                    </div>
                  ) : (
                    <div className="relative">
                      <SyntaxHighlighter
                        language={frameworkInfo[selectedFramework].lang}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          maxHeight: '300px',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* No Components Message */}
        {currentComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">
              No components available in this category yet.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Generate your component library
          </h3>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
            Create consistent, production-ready components automatically with your brand colors and typography.
            Get React, Vue, Svelte, and HTML/CSS code instantly.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}
