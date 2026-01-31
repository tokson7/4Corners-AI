// lib/generation/quality-tiers.ts

export type QualityTier = 'starter' | 'basic' | 'professional' | 'enterprise';

export interface GenerationConfig {
  tier: QualityTier;
  maxTokens: number;
  temperature: number;
  colorCount: number;
  fontPairings: number;
  description: string;
}

export const QUALITY_TIERS: Record<QualityTier, GenerationConfig> = {
  // Free trial tier (lower quality than Basic)
  starter: {
    tier: 'starter',
    maxTokens: 1500,           // Very limited
    temperature: 0.7,          // Less creative
    colorCount: 30,            // 30 colors only (vs 88 Basic)
    fontPairings: 3,           // 3 font pairs (vs 10 Basic)
    description: 'Starter - Free Trial',
  },
  
  // Basic paid tier (original)
  basic: {
    tier: 'basic',
    maxTokens: 2500,
    temperature: 1.4,
    colorCount: 88,
    fontPairings: 10,
    description: 'Basic - Paid',
  },
  
  // Professional paid tier
  professional: {
    tier: 'professional',
    maxTokens: 3000,
    temperature: 1.2,
    colorCount: 225,
    fontPairings: 20,
    description: 'Professional - Paid',
  },
  
  // Enterprise paid tier
  enterprise: {
    tier: 'enterprise',
    maxTokens: 3500,
    temperature: 0.9,
    colorCount: 300,
    fontPairings: 50,
    description: 'Enterprise - Paid',
  },
};

// Determine which tier user has access to
export function getUserQualityTier(
  user: {
    plan: string;
    credits: number;
    freeGenerationsUsed: number;
    freeGenerationsLimit: number;
    email: string;
  }
): QualityTier {
  // Admin email - always get best quality (enterprise)
  if (user.email === 'zaridze2909@gmail.com') {
    return 'enterprise';
  }
  
  // Paid users - return their plan tier
  if (user.plan === 'enterprise' && user.credits > 0) {
    return 'enterprise';
  }
  
  if (user.plan === 'professional' && user.credits > 0) {
    return 'professional';
  }
  
  if (user.plan === 'basic' && user.credits > 0) {
    return 'basic';
  }
  
  // Free trial users - check if they have free generations left
  if (user.freeGenerationsUsed < user.freeGenerationsLimit) {
    return 'starter';
  }
  
  // No credits, no free trials left - deny access
  throw new Error('NO_CREDITS');
}

// Check if user can generate
export function canUserGenerate(
  user: {
    plan: string;
    credits: number;
    freeGenerationsUsed: number;
    freeGenerationsLimit: number;
    email: string;
  }
): {
  canGenerate: boolean;
  tier: QualityTier | null;
  reason?: string;
  freeTrialsRemaining?: number;
} {
  // Admin - always allowed
  if (user.email === 'zaridze2909@gmail.com') {
    return {
      canGenerate: true,
      tier: 'enterprise',
    };
  }
  
  // Paid users with credits
  if (user.credits > 0) {
    const tier = getUserQualityTier(user);
    return {
      canGenerate: true,
      tier,
    };
  }
  
  // Free trial users
  const remaining = user.freeGenerationsLimit - user.freeGenerationsUsed;
  if (remaining > 0) {
    return {
      canGenerate: true,
      tier: 'starter',
      freeTrialsRemaining: remaining,
    };
  }
  
  // No access
  return {
    canGenerate: false,
    tier: null,
    reason: 'Out of free trials and credits. Please upgrade to continue.',
  };
}
