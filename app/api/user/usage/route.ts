import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger, setRequestContext, generateRequestId, logApiRequest, logApiResponse, logApiError, logDatabaseQuery } from '@/lib/logger';

/**
 * GET /api/user/usage
 * Get current month's usage metrics for the authenticated user
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  try {
    const { userId } = await auth();
    
    // Set logging context
    setRequestContext({ requestId, userId: userId || undefined });
    
    // Log request start
    logApiRequest('GET', '/api/user/usage');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be signed in to view usage metrics',
        },
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get current month start
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get or create usage metrics
    const queryStart = Date.now();
    let usageMetrics = await prisma.usageMetrics.findUnique({
      where: {
        userId_month: {
          userId,
          month: startOfMonth,
        },
      },
    });
    
    logDatabaseQuery('SELECT', 'usageMetrics', Date.now() - queryStart, {
      found: !!usageMetrics,
    });

    if (!usageMetrics) {
      // Create default metrics for free tier
      const createStart = Date.now();
      usageMetrics = await prisma.usageMetrics.create({
        data: {
          userId,
          month: startOfMonth,
          generationsUsed: 0,
          generationLimit: 10, // Free tier default
        },
      });
      
      logDatabaseQuery('CREATE', 'usageMetrics', Date.now() - createStart, {
        userId,
        generationLimit: 10,
      });
    }

    const remaining = usageMetrics.generationLimit - usageMetrics.generationsUsed;
    const percentUsed = Math.round((usageMetrics.generationsUsed / usageMetrics.generationLimit) * 100);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          used: usageMetrics.generationsUsed,
          limit: usageMetrics.generationLimit,
          remaining: Math.max(0, remaining),
          percentUsed,
          month: usageMetrics.month,
          resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    logApiResponse('GET', '/api/user/usage', 200, Date.now() - startTime, {
      used: usageMetrics.generationsUsed,
      limit: usageMetrics.generationLimit,
      percentUsed,
    });
    
    return response;
  } catch (error: any) {
    logApiError('GET', '/api/user/usage', error, {
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch usage metrics. Please try again later',
      },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
