import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/utils/auth';

/**
 * GET /api/design-systems/[id]/raw
 * 
 * Returns the raw JSON data of a design system for debugging
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const system = await prisma.designSystem.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        colors: true,
        typography: true,
        createdAt: true,
      },
    });

    if (!system) {
      return NextResponse.json(
        { error: 'Design system not found' },
        { status: 404 }
      );
    }

    // Return formatted JSON for easy reading
    return new NextResponse(
      JSON.stringify(
        {
          id: system.id,
          name: system.name,
          createdAt: system.createdAt,
          colorPalettes: system.colors ? Object.keys(system.colors as any).length : 0,
          colors: system.colors,
          typographyKeys: system.typography ? Object.keys(system.typography as any) : [],
          typography: system.typography,
        },
        null,
        2
      ),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Raw data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design system' },
      { status: 500 }
    );
  }
}
