import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateDesignSystem, validateAPIKey } from '@/lib/ai/design-generator';
import { logger, setRequestContext, generateRequestId, logApiRequest, logApiResponse, logApiError, logGenerationEvent } from '@/lib/logger';
import { applyRateLimit, generateRateLimit } from '@/lib/rate-limit';
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

    // Check OpenAI API key
    if (!validateAPIKey()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration error',
          message: 'AI service is not configured. Please contact support.',
        },
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check usage limits
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let usageMetrics = await prisma.usageMetrics.findUnique({
      where: {
        userId_month: {
          userId,
          month: startOfMonth,
        },
      },
    });

    // Create metrics if don't exist
    if (!usageMetrics) {
      usageMetrics = await prisma.usageMetrics.create({
        data: {
          userId,
          month: startOfMonth,
          generationsUsed: 0,
          generationLimit: 10, // Free tier default
        },
      });
    }

    // Check if user has exceeded limit
    if (usageMetrics.generationsUsed >= usageMetrics.generationLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limit exceeded',
          message: `You've reached your monthly limit of ${usageMetrics.generationLimit} generations. Upgrade your plan for more.`,
        },
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate design system using AI
    logGenerationEvent('start', tier as string, undefined, {
      brandDescription: brandDescription.substring(0, 100),
      usageMetrics: {
        used: usageMetrics.generationsUsed,
        limit: usageMetrics.generationLimit,
      },
    });
    
    // Add 60-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      logger.warn({
        context: 'api-timeout',
        userId,
        tier,
        timeout: 60000,
        message: 'Aborting generation after 60 seconds',
      });
      controller.abort();
    }, 60000); // 60 seconds

    let result;
    try {
      result = await generateDesignSystem(brandDescription, tier as GenerationTier, controller.signal);
      clearTimeout(timeoutId);
      
      logGenerationEvent('complete', tier as string, result.metadata.generationTime, {
        tokenCount: result.metadata.tokenCount,
        componentsGenerated: 0, // DesignSystemResult doesn't have components
        colorsGenerated: Object.keys(result.colors || {}).length,
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout specifically
      if (error.name === 'AbortError') {
        logger.error({
          context: 'api-timeout-error',
          userId,
          tier,
          duration: Date.now() - startTime,
          message: 'Request timeout after 60 seconds',
        });
        return NextResponse.json(
          {
            success: false,
            error: 'Request timeout',
            message: 'Generation took too long and was cancelled. Please try again with a simpler description.',
          },
          {
            status: 408,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Re-throw other errors to be handled by outer catch
      throw error;
    }

    // Save design system to database
    const designSystem = await prisma.designSystem.create({
      data: {
        userId,
        name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Design System - ${new Date().toLocaleDateString()}`,
        description: brandDescription,
        colors: result.colors,
        typography: result.typography,
        components: [],
      },
    });

    // Increment usage counter
    await prisma.usageMetrics.update({
      where: { id: usageMetrics.id },
      data: {
        generationsUsed: usageMetrics.generationsUsed + 1,
      },
    });

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
            tier,
            generationTime: result.metadata.generationTime,
            tokensUsed: result.metadata.tokenCount,
            responseSize: result.metadata.responseSize,
          },
          usageMetrics: {
            used: usageMetrics.generationsUsed + 1,
            limit: usageMetrics.generationLimit,
            remaining: usageMetrics.generationLimit - (usageMetrics.generationsUsed + 1),
          },
        },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    // Log successful response
    logApiResponse('POST', '/api/generate-design-system', 200, Date.now() - startTime, {
      tier,
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
