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

    // Get user to check their credits and plan
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true, plan: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User account not found',
        },
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate generation limit based on plan
    const generationLimit = user.plan === 'professional' ? 100 : 10;

    // Get current month start
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count usage metrics for this month
    const queryStart = Date.now();
    const usageCount = await prisma.usageMetrics.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
        action: 'generate_design_system',
        success: true,
      },
    });
    
    logDatabaseQuery('COUNT', 'usageMetrics', Date.now() - queryStart, {
      count: usageCount,
    });

    const remaining = Math.max(0, generationLimit - usageCount);
    const percentUsed = Math.round((usageCount / generationLimit) * 100);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          used: usageCount,
          limit: generationLimit,
          remaining,
          percentUsed,
          month: startOfMonth,
          resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    logApiResponse('GET', '/api/user/usage', 200, Date.now() - startTime, {
      used: usageCount,
      limit: generationLimit,
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
