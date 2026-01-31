import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateDesignSystem } from '@/lib/ai/design-generator';
import { logger, setRequestContext, generateRequestId, logApiRequest, logApiResponse, logApiError, logGenerationEvent } from '@/lib/logger';
import { applyRateLimit, generateRateLimit } from '@/lib/rate-limit';
import { canUserGenerate, getUserQualityTier, QUALITY_TIERS } from '@/lib/generation/quality-tiers';
import type { GenerationTier } from '@/lib/ai/design-generator';

/**
 * POST /api/generate-design-system
 * Generate a complete design system from a brand description
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  let body: any;
  let tier: string = 'basic';
  let brandDescription: string = '';
  
  // Apply rate limiting first
  const rateLimitResult = await applyRateLimit(request, generateRateLimit, 'generate-design-system');
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }
  
  try {
    // Check authentication
    const { userId } = await auth();
    
    // Set logging context
    setRequestContext({ requestId, userId: userId || undefined });
    
    // Log request start
    logApiRequest('POST', '/api/generate-design-system', {
      userAgent: request.headers.get('user-agent') || 'unknown',
    });
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to generate design systems',
        },
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Request body must be valid JSON',
        },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const parsedBody = body;
    brandDescription = parsedBody.brandDescription;
    tier = parsedBody.tier || 'basic';

    // Validate tier
    if (!['basic', 'professional', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Invalid tier. Must be basic, professional, or enterprise',
        },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate input
    if (!brandDescription || typeof brandDescription !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Brand description is required',
        },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (brandDescription.length < 10 || brandDescription.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Brand description must be between 10 and 500 characters',
        },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check user credits
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
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User account not found.',
        },
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🔍 [GENERATE] User check:', {
      email: user.email,
      plan: user.plan,
      credits: user.credits,
      freeUsed: user.freeGenerationsUsed,
      freeLimit: user.freeGenerationsLimit,
    });

    // Check if user can generate using free trial system
    const accessCheck = canUserGenerate(user);
    
    if (!accessCheck.canGenerate) {
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
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get quality tier and config
    const qualityTier = accessCheck.tier!;
    const tierConfig = QUALITY_TIERS[qualityTier];
    
    console.log('✅ [GENERATE] Access granted:', {
      tier: qualityTier,
      config: tierConfig.description,
      freeTrialsRemaining: accessCheck.freeTrialsRemaining,
    });

    // Generate design system using AI
    logGenerationEvent('start', qualityTier, undefined, {
      brandDescription: brandDescription.substring(0, 100),
      userCredits: user.credits,
      tier: qualityTier,
      configUsed: tierConfig.description,
    });

    let result;
    try {
      // Use quality tier from free trial system
      result = await generateDesignSystem(brandDescription, qualityTier as GenerationTier);
      
      logGenerationEvent('complete', qualityTier, undefined, {
        componentsGenerated: 0,
        colorsGenerated: Object.keys(result.colors || {}).length,
      });
    } catch (error: any) {
      // Re-throw errors to be handled by outer catch
      throw error;
    }

    // Save design system to database
    const designSystem = await prisma.designSystem.create({
      data: {
        userId: user.id,
        name: `${qualityTier.charAt(0).toUpperCase() + qualityTier.slice(1)} Design System - ${new Date().toLocaleDateString()}`,
        description: brandDescription,
        tier: qualityTier,
        colors: result.colors as any,
        typography: result.typography as any,
        components: [],
        metadata: {
          qualityTier,
          isFreeTrialGeneration: accessCheck.freeTrialsRemaining !== undefined,
        },
      },
    });

    // Deduct credits or increment free trial usage
    const isAdmin = user.email === 'zaridze2909@gmail.com';
    const isFreeTrialGeneration = accessCheck.freeTrialsRemaining !== undefined;
    
    if (!isAdmin) {
      if (isFreeTrialGeneration) {
        // Increment free trial counter
        await prisma.user.update({
          where: { id: user.id },
          data: {
            freeGenerationsUsed: { increment: 1 },
          },
        });
        
        const newRemaining = user.freeGenerationsLimit - user.freeGenerationsUsed - 1;
        console.log('🆓 [GENERATE] Free trial used. Remaining:', newRemaining);
      } else {
        // Deduct paid credit
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: { decrement: 1 },
          },
        });
        
        console.log('💳 [GENERATE] Credit deducted. New balance:', user.credits - 1);
      }
    } else {
      console.log('👑 [GENERATE] Admin user - no charge');
    }

    // Track usage in metrics
    await prisma.usageMetrics.create({
      data: {
        userId: user.id,
        action: 'generate_design_system',
        creditsUsed: isFreeTrialGeneration ? 0 : 1,
        success: true,
        designSystemId: designSystem.id,
        metadata: {
          tier: qualityTier,
          aiProvider: result.metadata?.aiProvider || 'openai',
          isFreeTrialUser: isFreeTrialGeneration,
          isAdmin,
        } as any,
      },
    });

    // Calculate remaining credits/trials
    const newFreeRemaining = isFreeTrialGeneration 
      ? user.freeGenerationsLimit - user.freeGenerationsUsed - 1
      : undefined;

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          id: designSystem.id,
          colors: result.colors,
          typography: result.typography,
          components: [],
          metadata: {
            tier: qualityTier,
          },
          credits: {
            remaining: !isFreeTrialGeneration ? user.credits - 1 : undefined,
          },
        },
        generationInfo: {
          tier: qualityTier,
          quality: tierConfig.description,
          isFreeTrialUser: isFreeTrialGeneration,
          freeTrialsRemaining: newFreeRemaining,
          creditsRemaining: !isFreeTrialGeneration ? user.credits - 1 : undefined,
        },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    // Log successful response
    logApiResponse('POST', '/api/generate-design-system', 200, Date.now() - startTime, {
      tier: qualityTier,
      tokensUsed: result.metadata.tokenCount,
      componentsGenerated: result.components?.length || 0,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logApiError('POST', '/api/generate-design-system', error, {
      duration,
      tier: tier || 'unknown',
      brandDescription: brandDescription?.substring(0, 100) || 'unknown',
      errorCode: error.code,
    });

    // Handle specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database conflict',
          message: 'A conflict occurred while saving your design system',
        },
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (error.code?.startsWith('P')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'A database error occurred. Please try again later',
        },
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later',
      },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
