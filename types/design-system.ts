// Generation Tiers (Enterprise removed - Professional is now premium)
export type GenerationTier = 'basic' | 'professional'

// Tier Configuration
export interface TierConfig {
  tier: GenerationTier
  colorPalettes: number
  colorShades: number
  fontPairings: number
  typeSizes: number
  credits: number
  estimatedTime: string
  features: string[]
}

// Tier Configurations
export const TIER_CONFIGS: Record<GenerationTier, TierConfig> = {
  basic: {
    tier: 'basic',
    colorPalettes: 8,
    colorShades: 11,
    fontPairings: 10,
    typeSizes: 12,
    credits: 1,
    estimatedTime: '3-5 seconds',
    features: [
      '88 color shades',
      '10 font pairings',
      'Basic type scale',
      'Perfect for MVPs',
    ],
  },
  professional: {
    tier: 'professional',
    colorPalettes: 12,
    colorShades: 11,
    fontPairings: 20,
    typeSizes: 16,
    credits: 3,
    estimatedTime: '8-12 seconds',
    features: [
      '132 color shades',
      '20 font pairings',
      'Extended type scale',
      'UI state colors',
      'Dark mode variations',
      'Advanced design tokens',
      'Enterprise-grade quality',
      'Production-ready',
    ],
  },
}

// Professional tier uses standard palettes and scales (no need for extended configs)
