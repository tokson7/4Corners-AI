import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/utils/auth";
import { deductCredits } from "@/lib/services/user-service";

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * GET /api/design-systems
 * 
 * Fetch all design systems for the authenticated user.
 * No sharing functionality - users only see their own systems.
 * 
 * Query params:
 * - limit: Optional number to limit results (e.g., ?limit=5 for recent systems)
 * 
 * @returns List of user's design systems
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // PERFORMANCE OPTIMIZATION: For dashboard preview (limit=5), fetch minimal data
    // Reduces payload from ~100KB to ~5KB per system (20x faster)
    const isDashboardPreview = limit !== undefined && limit <= 10;

    if (isDashboardPreview) {
      // FAST PATH: Minimal data for dashboard cards (using Prisma select for safety)
      const systems = await prisma.designSystem.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          description: true,
          colors: true,
          metadata: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          // Exclude large fields: components, typography, theme
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return NextResponse.json({
        success: true,
        systems,
      }, {
        headers: {
          'Cache-Control': 'private, max-age=10, stale-while-revalidate=30',
        },
      });
    }

    // FULL PATH: Complete data for detailed view
    const systems = await prisma.designSystem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        colors: true,
        typography: true,
        metadata: true,
        version: true,
        tags: true,
        isPublic: true,
        featured: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      systems,
    });
  } catch (error) {
    
    if (error instanceof Error && (error.message.includes("Unauthorized") || error.message.includes("Authentication required"))) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "Please sign in to view your design systems"
        },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch design systems",
        details: process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : "Unknown error")
          : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * POST /api/design-systems
 * 
 * Save a new design system for the authenticated user.
 * 
 * Requirements:
 * - Saves colors, typography, components (JSON)
 * - Links to userId via Clerk authentication
 * - Timestamp handled by Prisma @default(now())
 * - Deducts 1 credit atomically in transaction
 * - No sharing functionality
 * 
 * Transaction logic:
 * 1. Check user has credits
 * 2. Create design system
 * 3. Deduct 1 credit
 * 4. All or nothing (atomic)
 * 
 * @param req Request with design system data
 * @returns Created design system with remaining credits
 */
export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    console.log('💾 [SAVE] POST /api/design-systems - Request received')
    console.log('💾 [SAVE] Timestamp:', new Date().toISOString())
  }
  
  try {
    // Get authenticated user from Clerk
    const user = await requireUser();

    if (isDev) {
      console.log('✅ [SAVE] User authenticated:', user.id)
    }

    // Parse request body
    const body = await req.json();
    const { name, description, colors, typography, components, spacing } = body;

    if (isDev) {
      console.log('📝 [SAVE] Request body parsed')
      console.log('🎨 [SAVE] Colors received:', JSON.stringify(colors, null, 2))
      console.log('📝 [SAVE] Typography received:', JSON.stringify(typography, null, 2))
      console.log('🧩 [SAVE] Components received:', JSON.stringify(components, null, 2))
    }

    // Validate required fields
    if (!colors || !typography || !components) {
      if (isDev) {
        console.log('❌ [SAVE] Validation failed: Missing required fields')
      }
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields",
          details: "colors, typography, and components are required" 
        },
        { status: 400 }
      );
    }

    if (isDev) {
      console.log('💳 [SAVE] Starting transaction...')
    }

    // Atomic trans// action: Save design system + deduct credit
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      // 1. Get fresh user data within transaction
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          credits: true
        }
      });

      if (!currentUser) {
        throw new Error("User not found in transaction");
      }

      // 2. Check if user has sufficient credits
      if (currentUser.credits < 1) {
        throw new Error("Insufficient credits");
      }

      // 3. Create design system
      const designSystem = await tx.designSystem.create({
        data: {
          name: name || `Design System ${new Date().toLocaleDateString()}`,
          description: description || null,
          colors,
          typography,
          components,
          
          isPublic: false,
          version: "1.0.0",
          tags: [],
          userId: currentUser.id,
        },
      });

      // 4. Deduct 1 credit
      const updatedUser = await tx.user.update({
        where: { id: currentUser.id },
        data: { credits: { decrement: 1 } },
        select: { credits: true }
      });

      if (isDev) {
        console.log('✅ [SAVE] Design system created:', designSystem.id)
        console.log('🎨 [SAVE] Saved colors:', JSON.stringify(designSystem.colors, null, 2))
        console.log('📝 [SAVE] Saved typography:', JSON.stringify(designSystem.typography, null, 2))
        console.log('💳 [SAVE] Credits remaining:', updatedUser.credits)
      }

      // 5. Log usage metric
      await tx.usageMetrics.create({
        data: {
          userId: currentUser.id,
          action: "save_design_system",
          creditsUsed: 1,
          success: true,
          designSystemId: designSystem.id,
          metadata: {
            name: designSystem.name,
            timestamp: new Date().toISOString()
          },
        },
      });

      return { designSystem, updatedUser };
    }, {
      maxWait: 2000, // 2 seconds max wait
      timeout: 5000, // 5 seconds max execution
    });

    if (isDev) {
      console.log('✅ [SAVE] Transaction completed successfully!')
    }

    return NextResponse.json({
      success: true,
      system: result.designSystem,
      creditsRemaining: result.updatedUser.credits,
      message: "Design system saved successfully",
    });
  } catch (error) {
    if (isDev) {
      console.error('❌ [SAVE] Error:', error)
    }
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized") || error.message.includes("not authenticated")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Unauthorized",
            message: "Please sign in to save design systems" 
          },
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      if (error.message.includes("Insufficient credits")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Insufficient credits",
            message: "You need at least 1 credit to save a design system" 
          },
          { 
            status: 402,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to save design system",
        details: process.env.NODE_ENV === "development" 
          ? (error instanceof Error ? error.message : "Unknown error")
          : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
