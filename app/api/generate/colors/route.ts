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
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { canUserGenerate, QUALITY_TIERS } from '@/lib/generation/quality-tiers'

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
            ? validationError.issues 
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
    console.log('💳 Step 3.5: Authenticating user and checking access...')
    
    const { userId } = await auth()
    
    if (!userId) {
      console.error('❌ No user ID - authentication required')
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

    // Fetch user with free trial fields
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        plan: true,
        credits: true,
        freeGenerationsUsed: true,
        freeGenerationsLimit: true,
      },
    })

    if (!user) {
      console.error('❌ User not found in database')
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          details: 'User account not found in database',
        },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ User authenticated:', user.email)
    console.log(`   Plan: ${user.plan}`)
    console.log(`   Credits: ${user.credits}`)
    console.log(`   Free trials used: ${user.freeGenerationsUsed}/${user.freeGenerationsLimit}`)

    // Check if user can generate using free trial system
    const accessCheck = canUserGenerate(user)
    
    if (!accessCheck.canGenerate) {
      console.error(`❌ Access denied: ${accessCheck.reason}`)
      return NextResponse.json(
        {
          success: false,
          error: 'LIMIT_REACHED',
          message: accessCheck.reason,
          freeTrialsRemaining: 0,
          upgradeRequired: true,
        },
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const qualityTier = accessCheck.tier!
    const isFreeTrialGeneration = accessCheck.freeTrialsRemaining !== undefined
    const isAdmin = user.email === 'zaridze2909@gmail.com'

    console.log('✅ Access granted')
    console.log(`   Quality tier: ${qualityTier}`)
    console.log(`   Free trial: ${isFreeTrialGeneration}`)
    console.log(`   Free trials remaining: ${accessCheck.freeTrialsRemaining || 'N/A'}`)
    
    const tier = validated.tier as GenerationTier
    const tierConfig = TIER_CONFIGS[tier]
    
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

    // Step 4.5: Deduct credits or increment free trial usage
    console.log('💳 Step 4.5: Processing usage...')
    
    if (!isAdmin) {
      if (isFreeTrialGeneration) {
        // Increment free trial counter
        await prisma.user.update({
          where: { id: user.id },
          data: {
            freeGenerationsUsed: { increment: 1 },
          },
        })
        
        const newRemaining = user.freeGenerationsLimit - user.freeGenerationsUsed - 1
        console.log(`✅ Free trial used. Remaining: ${newRemaining}`)
      } else {
        // Deduct paid credit
        try {
          await deductCredits(user.id, tierConfig.credits)
          const remainingCredits = user.credits - tierConfig.credits
          console.log(`✅ Credits deducted: ${tierConfig.credits}`)
          console.log(`   Remaining credits: ${remainingCredits}`)
        } catch (creditError) {
          console.error('❌ Failed to deduct credits:', creditError)
          console.warn('⚠️  Generation succeeded but credit deduction failed')
        }
      }
    } else {
      console.log('👑 Admin user - no charge')
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
    let remainingCredits = user.credits
    let creditsUsed = 0
    
    if (!isAdmin) {
      if (isFreeTrialGeneration) {
        remainingCredits = user.credits // Free trial doesn't use credits
        creditsUsed = 0
      } else {
        remainingCredits = user.credits - tierConfig.credits
        creditsUsed = tierConfig.credits
      }
    }
    
    console.log('✅ ============================================')
    console.log(`✅ GENERATION COMPLETE in ${duration}ms`)
    console.log(`✅ Tier: ${tier.toUpperCase()}`)
    console.log(`✅ AI Provider: ${designSystem.metadata.aiProvider}`)
    console.log(`✅ Colors: ${totalShades} shades across ${colorPaletteCount} palettes`)
    console.log(`✅ Typography: ${fontPairsCount} curated pairings`)
    console.log(`✅ Estimated variations: ${totalShades * fontPairsCount}+`)
    
    if (isAdmin) {
      console.log(`👑 Admin - No charges applied`)
    } else if (isFreeTrialGeneration) {
      console.log(`🆓 Free trial used (${accessCheck.freeTrialsRemaining! - 1} remaining)`)
    } else {
      console.log(`💳 Credits used: ${creditsUsed}`)
      console.log(`💳 Credits remaining: ${remainingCredits}`)
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
          used: creditsUsed,
          remaining: remainingCredits,
        },
        freeTrialsRemaining: isFreeTrialGeneration ? accessCheck.freeTrialsRemaining! - 1 : undefined,
        stats: {
          generationTime: duration,
          colorPalettes: colorPaletteCount,
          totalShades,
          fontPairings: fontPairsCount,
          possibleVariations: totalShades * fontPairsCount,
        },
        aiGenerated: true,
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
