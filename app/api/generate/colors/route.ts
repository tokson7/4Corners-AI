/**
 * AI-Powered Design System Generation API
 * 
 * Enterprise-grade endpoint using GPT-4/Claude for generating complete design systems.
 * Generates 10,000+ possible variations with full color palettes, typography, and accessibility.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateDesignSystem } from '@/lib/ai/design-generator'
import { GenerationTier, TIER_CONFIGS } from '@/types/design-system'
import { requireUser } from '@/lib/utils/auth'
import { deductCredits } from '@/lib/services/user-service'

// ============================================
// REQUEST VALIDATION
// ============================================

const requestSchema = z.object({
  brandDescription: z.string().min(5, 'Brand description must be at least 5 characters'),
  industry: z.string().optional(),
  personality: z.string().optional(),
  tier: z.enum(['basic', 'professional']).optional().default('basic'),
  preferences: z
    .object({
      colorScheme: z.enum(['vibrant', 'muted', 'pastel', 'dark', 'light']).optional(),
      modernityLevel: z.enum(['traditional', 'balanced', 'modern', 'futuristic']).optional(),
      accessibility: z.enum(['AA', 'AAA']).optional(),
    })
    .optional(),
})

// ============================================
// MAIN API ENDPOINT
// ============================================

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  console.log('🎨 ============================================')
  console.log('🎨 AI-POWERED DESIGN SYSTEM GENERATION')
  console.log('🎨 ============================================')

  try {
    // Step 1: Parse and validate request
    console.log('📝 Step 1: Parsing request body...')
    let body
    try {
      body = await req.json()
      console.log('✅ Request body parsed')
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 2: Validate request schema
    console.log('🔍 Step 2: Validating request schema...')
    let validated
    try {
      validated = requestSchema.parse(body)
      console.log('✅ Validation passed')
      console.log('📝 Brand:', validated.brandDescription.substring(0, 50) + '...')
      console.log('📝 Industry:', validated.industry || 'not specified')
      console.log('📝 Personality:', validated.personality || 'auto-detect')
      console.log('📝 Tier:', validated.tier.toUpperCase())
      console.log('📝 Color Scheme:', validated.preferences?.colorScheme || 'auto')
      console.log('📝 Modernity:', validated.preferences?.modernityLevel || 'balanced')
      console.log('📝 Accessibility:', validated.preferences?.accessibility || 'AA')
    } catch (validationError) {
      console.error('❌ Validation failed:', validationError)
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationError instanceof z.ZodError 
            ? validationError.errors 
            : 'Invalid request format',
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 3: Check API key configuration
    console.log('🔑 Step 3: Checking AI provider configuration...')
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
    const provider = process.env.AI_PROVIDER || 'openai'

    if (!hasOpenAI && !hasAnthropic) {
      console.error('❌ No AI provider configured')
      return NextResponse.json(
        {
          success: false,
          error: 'AI generation not configured',
          details: 'Please add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env.local',
          fallback: true,
        },
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ AI provider configured:', provider)
    console.log(`   OpenAI: ${hasOpenAI ? '✅' : '❌'}`)
    console.log(`   Anthropic: ${hasAnthropic ? '✅' : '❌'}`)

    // Step 3.5: Authenticate user and check credits
    const tier = validated.tier as GenerationTier
    const tierConfig = TIER_CONFIGS[tier]
    
    console.log('💳 Step 3.5: Checking user credits...')
    console.log(`   Tier: ${tier.toUpperCase()}`)
    console.log(`   Cost: ${tierConfig.credits} credits`)
    console.log(`   Expected time: ${tierConfig.estimatedTime}`)
    console.log(`   Features: ${tierConfig.features.length} features`)
    
    // 🔥 TEST MODE: Skip authentication for testing
    const TEST_MODE = process.env.NODE_ENV === 'development'
    let user: any = null
    
    if (TEST_MODE) {
      console.log('⚡ TEST MODE ENABLED - Skipping authentication')
      console.log('⚡ This is for TESTING ONLY - auth will be required in production')
      user = {
        id: 'test-user',
        credits: 999, // Unlimited credits for testing
      }
    } else {
      try {
        user = await requireUser()
        console.log('✅ User authenticated:', user.id)
        console.log(`   Current credits: ${user.credits}`)
      } catch (authError) {
        console.error('❌ Authentication failed:', authError)
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            details: 'Please sign in to generate design systems',
          },
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Check if user has enough credits
      if (user.credits < tierConfig.credits) {
        console.error(`❌ Insufficient credits: need ${tierConfig.credits}, have ${user.credits}`)
        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient credits',
            details: `You need ${tierConfig.credits} credits but only have ${user.credits}`,
            required: tierConfig.credits,
            available: user.credits,
            tier,
          },
          { 
            status: 402, // Payment Required
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }
    
    console.log('✅ Credit check passed')

    // Step 4: Generate design system with AI
    console.log('🤖 Step 4: Generating design system with AI...')
    console.log(`   Provider: ${provider}`)
    console.log(`   Tier: ${tier.toUpperCase()}`)
    console.log(`   Expected time: ${tierConfig.estimatedTime}`)
    console.log(`   Expected palettes: ${tierConfig.colorPalettes}`)
    console.log(`   Expected fonts: ${tierConfig.fontPairings}`)
    
    const aiStartTime = Date.now()
    let designSystem
    
    try {
      designSystem = await generateDesignSystem(validated, tier)
      const aiDuration = Date.now() - aiStartTime
      console.log(`✅ AI generation complete in ${aiDuration}ms`)
      console.log(`   Tokens used: ${designSystem.metadata.tokensUsed || 'N/A'}`)
      console.log(`   Tier: ${designSystem.metadata.tier || tier}`)
    } catch (aiError) {
      console.error('❌ AI generation failed:', aiError)
      return NextResponse.json(
        {
          success: false,
          error: 'AI generation failed',
          details: aiError instanceof Error ? aiError.message : 'Unknown error',
        },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 4.5: Deduct credits
    console.log('💳 Step 4.5: Deducting credits...')
    if (TEST_MODE) {
      console.log('⚡ TEST MODE - Skipping credit deduction')
    } else {
      try {
        await deductCredits(user.id, tierConfig.credits)
        const remainingCredits = user.credits - tierConfig.credits
        console.log(`✅ Credits deducted: ${tierConfig.credits}`)
        console.log(`   Remaining credits: ${remainingCredits}`)
      } catch (creditError) {
        console.error('❌ Failed to deduct credits:', creditError)
        // Log but don't fail - generation already succeeded
        console.warn('⚠️  Generation succeeded but credit deduction failed')
      }
    }

    // Step 5: Validate generated data
    console.log('🔍 Step 5: Validating generated design system...')
    if (!designSystem.colors || !designSystem.typography) {
      console.error('❌ Invalid design system structure')
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid design system generated',
        },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Count total elements
    const colorPaletteCount = Object.keys(designSystem.colors).length
    const totalShades = colorPaletteCount * 11 // 11 shades per palette
    const fontPairsCount = designSystem.typography.fontPairs.length

    console.log('✅ Design system validated')
    console.log(`   Color palettes: ${colorPaletteCount}`)
    console.log(`   Total color shades: ${totalShades}`)
    console.log(`   Font pairings: ${fontPairsCount}`)
    console.log(`   Total variations: ${totalShades * fontPairsCount}+`)

    // Step 6: Return success response
    const duration = Date.now() - startTime
    const remainingCredits = TEST_MODE ? 999 : (user.credits - tierConfig.credits)
    console.log('✅ ============================================')
    console.log(`✅ GENERATION COMPLETE in ${duration}ms`)
    console.log(`✅ Tier: ${tier.toUpperCase()}`)
    console.log(`✅ AI Provider: ${designSystem.metadata.aiProvider}`)
    console.log(`✅ Colors: ${totalShades} shades across ${colorPaletteCount} palettes`)
    console.log(`✅ Typography: ${fontPairsCount} curated pairings`)
    console.log(`✅ Estimated variations: ${totalShades * fontPairsCount}+`)
    console.log(`💳 Credits used: ${TEST_MODE ? 0 : tierConfig.credits}`)
    console.log(`💳 Credits remaining: ${remainingCredits}`)
    if (TEST_MODE) {
      console.log('⚡ TEST MODE - Results NOT saved to database')
    }
    console.log('✅ ============================================')

    // DEBUG: Log the response structure being sent to client
    console.log('📤 [API] Sending response to client:')
    console.log('📤 [API] Response structure:', JSON.stringify({
      success: true,
      hasDesignSystem: !!designSystem,
      hasColors: !!designSystem?.colors,
      hasPrimary: !!designSystem?.colors?.primary,
      hasTypography: !!designSystem?.typography,
      colorKeys: designSystem?.colors ? Object.keys(designSystem.colors) : [],
      typographyKeys: designSystem?.typography ? Object.keys(designSystem.typography) : [],
    }, null, 2))
    
    console.log('📤 [API] Primary color sample:', designSystem?.colors?.primary?.name || 'N/A')
    console.log('📤 [API] Full design system (first 1000 chars):', 
      JSON.stringify(designSystem).substring(0, 1000) + '...')

    return NextResponse.json(
      {
        success: true,
        designSystem,
        tier,
        credits: {
          used: TEST_MODE ? 0 : tierConfig.credits,
          remaining: TEST_MODE ? 999 : (user.credits - tierConfig.credits),
        },
        stats: {
          generationTime: duration,
          colorPalettes: colorPaletteCount,
          totalShades,
          fontPairings: fontPairsCount,
          possibleVariations: totalShades * fontPairsCount,
        },
        aiGenerated: true,
        testMode: TEST_MODE,
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('💥 ============================================')
    console.error('💥 CATASTROPHIC ERROR')
    console.error('💥 ============================================')
    console.error('Error:', error)
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A')
    console.error(`Duration: ${duration}ms`)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined,
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
