'use client'

import { useState } from 'react'
import { DesignSystemDisplay } from './DesignSystemDisplay'
import { ColorWaveLoader } from './ColorWaveLoader'
import type { GeneratedComponent } from '@/lib/generators/enhancedComponentGenerator'

export default function GeneratorForm() {
  const [brandDescription, setBrandDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedSystem, setGeneratedSystem] = useState<any>(null)
  const [components, setComponents] = useState<GeneratedComponent[] | null>(null)

  const handleGenerate = async () => {
    if (!brandDescription.trim()) {
      setError('Please describe your brand')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedSystem(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error('⏱️ [Client] Request timeout after 60 seconds')
      controller.abort()
    }, 60000)

    try {
      console.log('🎨 [Client] Starting generation...')
      console.log('📝 [Client] Brand:', brandDescription.substring(0, 50))
      console.log('🎯 [Client] Tier: professional (default)')

      const response = await fetch('/api/generate/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandDescription,
          tier: 'professional',
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log('📡 [Client] Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ [Client] HTTP error:', response.status)
        console.error('❌ [Client] Error data:', errorData)
        throw new Error(errorData.error || `HTTP error ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ [Client] Generation successful!')
      console.log('📊 [Client] Design system received')
      
      // Show results on same page
      setGeneratedSystem(data.designSystem)
      
      // Generate components from design tokens
      console.log('🧩 [Client] Generating components...')
      try {
        const componentsResponse = await fetch('/api/generate-components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            palette: data.designSystem.colors,
            typography: data.designSystem.typography,
          }),
        })
        
        if (componentsResponse.ok) {
          const componentsData = await componentsResponse.json()
          console.log('✅ [Client] Components generated:', componentsData.count)
          setComponents(componentsData.components)
        } else {
          const errorData = await componentsResponse.json().catch(() => ({}))
          console.error('⚠️ [Client] Component generation failed:', {
            status: componentsResponse.status,
            error: errorData.error || 'Unknown error',
            details: errorData.details
          })
        }
      } catch (compError) {
        console.error('❌ [Client] Component generation error:', compError)
        console.error('Error details:', compError instanceof Error ? compError.message : String(compError))
        // Don't fail the whole generation if components fail
      }
      
      // Scroll to results after a short delay
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)

    } catch (error: any) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        console.error('⏱️ [Client] Request timeout after 60 seconds')
        setError('Request timeout. The generation is taking longer than expected. Please try again.')
      } else {
        console.error('❌ [Client] Generation error:', error)
        setError(error.message || 'AI generation failed')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Generation Form */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Tell us about your brand
          </h1>
        </div>

        <textarea
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}
          placeholder="Describe your brand, product, or company. Include industry, target audience, and personality...

Example: Modern fintech app for Gen Z focused on simplicity and trust"
          className="w-full min-h-[160px] px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none resize-none text-lg"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !brandDescription.trim()}
          className={`
            w-full py-5 px-8 rounded-xl font-bold text-white text-xl
            transition-all duration-300
            ${isGenerating || !brandDescription.trim()
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
            }
          `}
        >
          {isGenerating ? 'Generating...' : 'Generate Design System'}
        </button>

        {/* Animated Color Squares Loading */}
        {isGenerating && <ColorWaveLoader />}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Generated Results */}
      {generatedSystem && (
        <div id="results" className="space-y-8 scroll-mt-8">
          <div className="text-center space-y-2">
            <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
              <span className="text-green-400 font-semibold">✨ Generation Complete!</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Your Design System
            </h2>
            <p className="text-purple-200 max-w-2xl mx-auto">
              Generated for: <span className="text-white font-semibold">{brandDescription}</span>
            </p>
          </div>
          
          <DesignSystemDisplay 
            designSystem={generatedSystem}
            brandDescription={brandDescription}
            components={components}
          />
        </div>
      )}

      {/* Example Systems */}
      {!generatedSystem && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Example Design Systems
            </h2>
            <p className="text-purple-200">
              See what others have created
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example 1: Tech Startup */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg" />
                <div>
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Tech Startup</h3>
                  <p className="text-sm text-purple-200">Modern & Innovative</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-blue-500 shadow" />
                <div className="w-8 h-8 rounded bg-blue-400 shadow" />
                <div className="w-8 h-8 rounded bg-cyan-500 shadow" />
                <div className="w-8 h-8 rounded bg-purple-500 shadow" />
              </div>
              <p className="text-xs text-purple-300 font-semibold">
                Inter + Space Grotesk
              </p>
            </div>

            {/* Example 2: Eco Brand */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg" />
                <div>
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Eco Brand</h3>
                  <p className="text-sm text-purple-200">Sustainable & Natural</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-green-600 shadow" />
                <div className="w-8 h-8 rounded bg-green-500 shadow" />
                <div className="w-8 h-8 rounded bg-emerald-500 shadow" />
                <div className="w-8 h-8 rounded bg-lime-500 shadow" />
              </div>
              <p className="text-xs text-purple-300 font-semibold">
                Crimson + Open Sans
              </p>
            </div>

            {/* Example 3: Fashion Brand */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
                <div>
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Fashion Brand</h3>
                  <p className="text-sm text-purple-200">Elegant & Trendy</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-purple-600 shadow" />
                <div className="w-8 h-8 rounded bg-purple-500 shadow" />
                <div className="w-8 h-8 rounded bg-pink-500 shadow" />
                <div className="w-8 h-8 rounded bg-rose-500 shadow" />
              </div>
              <p className="text-xs text-purple-300 font-semibold">
                Playfair + Lato
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
