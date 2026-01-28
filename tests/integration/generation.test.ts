import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateDesignSystem } from '@/lib/ai/design-generator'
import type { GenerationTier } from '@/lib/ai/design-generator'

describe('Design System Generation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Tier Generation', () => {
    it('generates design system successfully', async () => {
      const result = await generateDesignSystem(
        'Modern tech startup focused on AI and automation',
        'basic'
      )

      // Verify structure
      expect(result).toBeDefined()
      expect(result.colors).toBeDefined()
      expect(result.typography).toBeDefined()
      expect(result.metadata).toBeDefined()

      // Verify metadata
      expect(result.metadata.tier).toBe('basic')
      expect(result.metadata.tokenCount).toBeGreaterThan(0)
      expect(result.metadata.generationTime).toBeGreaterThan(0)
      expect(result.metadata.responseSize).toBeGreaterThan(0)
    })

    it('completes in under 5 seconds for basic tier', async () => {
      const start = Date.now()
      
      await generateDesignSystem('Simple e-commerce brand', 'basic')
      
      const duration = Date.now() - start
      expect(duration).toBeLessThan(5000)
    })

    it('generates consistent color structure', async () => {
      const result = await generateDesignSystem('Healthcare startup', 'basic')
      
      expect(result.colors).toHaveProperty('primary')
      expect(result.colors).toHaveProperty('secondary')
      expect(result.colors.primary).toHaveProperty('shades')
      expect(result.colors.secondary).toHaveProperty('shades')
    })

    it('generates valid typography system', async () => {
      const result = await generateDesignSystem('Fintech company', 'basic')
      
      expect(result.typography).toHaveProperty('fontPairs')
      expect(Array.isArray(result.typography.fontPairs)).toBe(true)
      expect(result.typography.fontPairs.length).toBeGreaterThan(0)
      
      const firstPair = result.typography.fontPairs[0]
      expect(firstPair).toHaveProperty('name')
      expect(firstPair).toHaveProperty('heading')
      expect(firstPair).toHaveProperty('body')
    })
  })

  describe('Professional Tier Generation', () => {
    it('completes in under 12 seconds for professional tier', async () => {
      const start = Date.now()
      
      await generateDesignSystem('Enterprise SaaS platform', 'professional')
      
      const duration = Date.now() - start
      expect(duration).toBeLessThan(12000)
    })

    it('uses higher token count for professional tier', async () => {
      const result = await generateDesignSystem('Creative agency', 'professional')
      
      expect(result.metadata.tier).toBe('professional')
      expect(result.metadata.tokenCount).toBeGreaterThan(1000)
    })
  })

  describe('Enterprise Tier Generation', () => {
    it('completes in under 18 seconds for enterprise tier', async () => {
      const start = Date.now()
      
      await generateDesignSystem('Fortune 500 corporation', 'enterprise')
      
      const duration = Date.now() - start
      expect(duration).toBeLessThan(18000)
    })

    it('generates comprehensive design system for enterprise', async () => {
      const result = await generateDesignSystem('Global enterprise', 'enterprise')
      
      expect(result.metadata.tier).toBe('enterprise')
      expect(result.metadata.tokenCount).toBeGreaterThan(2000)
      expect(result.colors).toBeDefined()
      expect(result.typography).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('handles invalid tier gracefully', async () => {
      await expect(
        generateDesignSystem('Test brand', 'invalid' as GenerationTier)
      ).rejects.toThrow()
    })

    it('handles empty brand description', async () => {
      await expect(
        generateDesignSystem('', 'basic')
      ).rejects.toThrow()
    })

    it('handles API timeout', async () => {
      // Mock a timeout scenario
      const mockOpenAI = vi.mocked(global.fetch)
      mockOpenAI.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 1000)
        )
      )

      await expect(
        generateDesignSystem('Test timeout', 'basic')
      ).rejects.toThrow()
    })
  })

  describe('Performance Benchmarks', () => {
    it('maintains consistent performance across multiple generations', async () => {
      const iterations = 3
      const durations: number[] = []

      for (let i = 0; i < iterations; i++) {
        const start = Date.now()
        await generateDesignSystem(`Test brand ${i}`, 'basic')
        durations.push(Date.now() - start)
      }

      // Check that all generations complete within expected time
      durations.forEach(duration => {
        expect(duration).toBeLessThan(5000)
      })

      // Check that performance doesn't degrade significantly
      const avgDuration = durations.reduce((a, b) => a + b) / durations.length
      const maxVariation = Math.max(...durations) - Math.min(...durations)
      
      expect(maxVariation).toBeLessThan(avgDuration * 0.5) // Within 50% of average
    })
  })

  describe('Content Quality', () => {
    it('generates contextually appropriate colors', async () => {
      const healthcareResult = await generateDesignSystem('Healthcare clinic', 'basic')
      const techResult = await generateDesignSystem('Tech startup', 'basic')
      
      // Both should have valid color structures
      expect(healthcareResult.colors).toBeDefined()
      expect(techResult.colors).toBeDefined()
      
      // Colors should be different for different contexts
      expect(JSON.stringify(healthcareResult.colors)).not.toBe(
        JSON.stringify(techResult.colors)
      )
    })

    it('generates appropriate typography for brand context', async () => {
      const result = await generateDesignSystem('Luxury fashion brand', 'basic')
      
      expect(result.typography.fontPairs).toBeDefined()
      expect(result.typography.fontPairs.length).toBeGreaterThan(0)
      
      const fontPair = result.typography.fontPairs[0]
      expect(typeof fontPair.name).toBe('string')
      expect(fontPair.name.length).toBeGreaterThan(0)
    })
  })
})