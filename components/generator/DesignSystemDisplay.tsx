'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ComponentShowcase } from '@/components/ComponentShowcase'
import type { GeneratedComponent } from '@/lib/generators/enhancedComponentGenerator'

export function DesignSystemDisplay({ 
  designSystem,
  brandDescription,
  components
}: { 
  designSystem: any
  brandDescription: string
  components: GeneratedComponent[] | null
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'components'>('colors')

  // Save to Dashboard
  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    
    try {
      console.log('💾 [Save] Starting save to dashboard...')
      console.log('🎨 [Save] Design system to save:', {
        colorsCount: Object.keys(designSystem.colors || {}).length,
        colorsStructure: JSON.stringify(designSystem.colors, null, 2).substring(0, 500),
        typographyCount: designSystem.typography?.fontPairs?.length || 0,
        typographyStructure: JSON.stringify(designSystem.typography, null, 2).substring(0, 500)
      })
      
      const response = await fetch('/api/design-systems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandDescription.slice(0, 50) || 'Untitled Design System',
          description: brandDescription,
          colors: designSystem.colors,
          typography: designSystem.typography,
          components: components || [], // Include generated components
          metadata: designSystem.metadata || {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save')
      }

      const data = await response.json()
      console.log('✅ [Save] Design system saved:', data.id)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('❌ [Save] Failed:', error)
      setError(error.message || 'Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Export as CSS
  const handleExport = () => {
    setIsExporting(true)
    setError(null)

    try {
      console.log('📥 [Export] Generating CSS...')
      
      // Generate CSS
      const css = generateCSS(designSystem)
      
      // Create blob and download
      const blob = new Blob([css], { type: 'text/css' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `design-system-${Date.now()}.css`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log('✅ [Export] CSS downloaded successfully')
    } catch (error: any) {
      console.error('❌ [Export] Failed:', error)
      setError('Failed to export. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Generate CSS from design system
  const generateCSS = (ds: any): string => {
    let css = `/* Design System - Generated ${new Date().toLocaleDateString()} */\n\n`
    
    // CSS Variables
    css += `:root {\n`
    
    // Colors
    css += `  /* Colors */\n`
    Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
      // Handle semantic colors (nested structure)
      if (paletteName === 'semantic' && palette && typeof palette === 'object') {
        Object.entries(palette).forEach(([semanticName, semanticPalette]: [string, any]) => {
          if (semanticPalette.shades) {
            Object.entries(semanticPalette.shades).forEach(([shade, color]: [string, any]) => {
              const hex = color.hex || color
              css += `  --color-${semanticName}-${shade}: ${hex};\n`
            })
          }
        })
      } else if (palette.shades) {
        // Regular palette
        Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
          const hex = color.hex || color
          css += `  --color-${paletteName}-${shade}: ${hex};\n`
        })
      }
    })
    
    css += `\n`
    
    // Typography
    css += `  /* Typography */\n`
    if (ds.typography?.typeScale) {
      Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
        css += `  --font-size-${size}: ${value};\n`
      })
    }
    
    css += `}\n\n`
    
    // Utility Classes for Colors
    css += `/* Color Utility Classes */\n`
    Object.entries(ds.colors || {}).forEach(([paletteName, palette]: [string, any]) => {
      // Handle semantic colors
      if (paletteName === 'semantic' && palette && typeof palette === 'object') {
        Object.entries(palette).forEach(([semanticName, semanticPalette]: [string, any]) => {
          if (semanticPalette.shades) {
            Object.entries(semanticPalette.shades).forEach(([shade, color]: [string, any]) => {
              const hex = color.hex || color
              css += `.bg-${semanticName}-${shade} { background-color: ${hex}; }\n`
              css += `.text-${semanticName}-${shade} { color: ${hex}; }\n`
              css += `.border-${semanticName}-${shade} { border-color: ${hex}; }\n`
            })
          }
        })
      } else if (palette.shades) {
        // Regular palette
        Object.entries(palette.shades).forEach(([shade, color]: [string, any]) => {
          const hex = color.hex || color
          css += `.bg-${paletteName}-${shade} { background-color: ${hex}; }\n`
          css += `.text-${paletteName}-${shade} { color: ${hex}; }\n`
          css += `.border-${paletteName}-${shade} { border-color: ${hex}; }\n`
        })
      }
    })
    
    css += `\n/* Typography Utility Classes */\n`
    if (ds.typography?.typeScale) {
      Object.entries(ds.typography.typeScale).forEach(([size, value]) => {
        css += `.text-${size} { font-size: ${value}; }\n`
      })
    }
    
    // Font family utilities
    css += `\n/* Font Family Classes */\n`
    if (ds.typography?.fontPairs && ds.typography.fontPairs.length > 0) {
      const firstPair = ds.typography.fontPairs[0]
      if (firstPair.heading?.family) {
        css += `.font-heading { font-family: "${firstPair.heading.family}", ${firstPair.heading.fallback || 'sans-serif'}; }\n`
      }
      if (firstPair.body?.family) {
        css += `.font-body { font-family: "${firstPair.body.family}", ${firstPair.body.fallback || 'sans-serif'}; }\n`
      }
    }
    
    return css
  }

  // Copy hex to clipboard
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
      .then(() => {
        // Could add a toast notification here
        console.log('📋 Copied to clipboard:', hex)
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
      })
  }

  return (
    <div className="space-y-12">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => setActiveTab('colors')}
          className={`
            px-6 py-3 font-semibold rounded-lg transition-all
            ${
              activeTab === 'colors'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-purple-200 hover:bg-white/10'
            }
          `}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`
            px-6 py-3 font-semibold rounded-lg transition-all
            ${
              activeTab === 'typography'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-purple-200 hover:bg-white/10'
            }
          `}
        >
          Typography
        </button>
        {components && components.length > 0 && (
          <button
            onClick={() => setActiveTab('components')}
            className={`
              px-6 py-3 font-semibold rounded-lg transition-all
              ${
                activeTab === 'components'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-purple-200 hover:bg-white/10'
              }
            `}
          >
            Components ({components.length})
          </button>
        )}
      </div>

      {/* Components Tab */}
      {activeTab === 'components' && components && components.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">UI Components</h3>
            <p className="text-purple-200">
              Production-ready components generated from your design tokens
            </p>
          </div>
          <ComponentShowcase components={components} />
        </div>
      )}

      {/* Colors Section */}
      {activeTab === 'colors' && (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Color Palettes</h3>
        
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(designSystem.colors || {}).map(([key, palette]: [string, any]) => {
            // Skip semantic nested structure, render at top level
            if (key === 'semantic' && palette && typeof palette === 'object') {
              return Object.entries(palette).map(([semanticKey, semanticPalette]: [string, any]) => (
                <div key={`${key}-${semanticKey}`} className="space-y-3">
                  <h4 className="text-lg font-semibold text-white capitalize">
                    {semanticKey}
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {semanticPalette.shades && Object.entries(semanticPalette.shades).map(([shade, color]: [string, any]) => (
                      <div
                        key={shade}
                        className="flex-shrink-0 group cursor-pointer"
                        onClick={() => copyToClipboard(color.hex || color)}
                        title="Click to copy"
                      >
                        <div
                          className="w-20 h-20 rounded-lg border border-white/10 shadow-lg transition-transform hover:scale-105"
                          style={{ backgroundColor: color.hex || color }}
                        />
                        <p className="text-xs text-center mt-2 text-purple-200">
                          {shade}
                        </p>
                        <p className="text-xs text-center text-purple-300 font-mono">
                          {color.hex || color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }

            // Regular palette rendering
            return (
              <div key={key} className="space-y-3">
                <h4 className="text-lg font-semibold text-white capitalize">
                  {key}
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {palette.shades && Object.entries(palette.shades).map(([shade, color]: [string, any]) => (
                    <div
                      key={shade}
                      className="flex-shrink-0 group cursor-pointer"
                      onClick={() => copyToClipboard(color.hex || color)}
                      title="Click to copy"
                    >
                      <div
                        className="w-20 h-20 rounded-lg border border-white/10 shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: color.hex || color }}
                      />
                      <p className="text-xs text-center mt-2 text-purple-200">
                        {shade}
                      </p>
                      <p className="text-xs text-center text-purple-300 font-mono">
                        {color.hex || color}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}

      {/* Typography Section */}
      {activeTab === 'typography' && designSystem.typography?.fontPairs && designSystem.typography.fontPairs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Typography</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designSystem.typography.fontPairs.slice(0, 6).map((pair: any, i: number) => (
              <div
                key={pair.id || i}
                className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 transition-all"
              >
                <h4 className="font-bold text-white mb-2">{pair.name}</h4>
                <p className="text-sm text-purple-200 mb-4">{pair.description}</p>
                <div className="space-y-2">
                  <p className="text-purple-300 text-sm">
                    Heading: <span className="text-white font-semibold">{pair.heading?.family || 'Sans Serif'}</span>
                  </p>
                  <p className="text-purple-300 text-sm">
                    Body: <span className="text-white">{pair.body?.family || 'Sans Serif'}</span>
                  </p>
                </div>
                {pair.useCase && (
                  <p className="text-xs text-purple-300 mt-3 italic">
                    {pair.useCase}
                  </p>
                )}
              </div>
            ))}
          </div>

          {designSystem.typography.fontPairs.length > 6 && (
            <p className="text-center text-purple-300 text-sm">
              + {designSystem.typography.fontPairs.length - 6} more font pairings
            </p>
          )}
        </div>
      )}

      {/* Actions - always visible */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`
            px-8 py-3 font-semibold rounded-lg transition-all shadow-lg
            ${isSaving
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30'
            }
            text-white
          `}
        >
          {isSaving ? 'Saving...' : 'Save to Dashboard'}
        </button>
        
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`
            px-8 py-3 font-semibold rounded-lg transition-all
            ${isExporting
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-white/10 hover:bg-white/20'
            }
            text-white
          `}
        >
          {isExporting ? 'Exporting...' : 'Export CSS'}
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
        >
          Generate Another
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-purple-300 text-sm">
        💡 Click any color swatch to copy its hex code
      </p>
    </div>
  )
}
