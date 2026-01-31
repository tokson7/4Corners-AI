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
      main: '#8b5cf6',
      shades: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
    },
    secondary: {
      name: 'Secondary',
      main: '#10b981',
      shades: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
    },
    accent: {
      name: 'Accent',
      main: '#f59e0b',
      shades: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
    },
    neutrals: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    semantic: {
      success: {
        main: '#10b981',
        shades: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      error: {
        main: '#ef4444',
        shades: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      warning: {
        main: '#f59e0b',
        shades: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      info: {
        main: '#3b82f6',
        shades: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
    accessibility: {
      primaryOnWhite: { ratio: 4.5, AA: true, AAA: false },
      primaryOnBlack: { ratio: 7.2, AA: true, AAA: true },
    },
  }

  const sampleTypography = {
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'Fira Code, monospace',
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    weights: {
      regular: 400,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code&display=swap',
    personality: 'Modern and clean',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 pt-20">
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
