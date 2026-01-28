import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/utils/auth";

/**
 * GET /api/design-systems/[id]
 * 
 * Fetch a specific design system by ID.
 * Users can only access their own systems (no sharing).
 * 
 * @param req Request object
 * @param params Route parameters with design system ID
 * @returns Design system data
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await requireUser();
    const systemId = id;

    // Fetch design system (only if owned by user)
    const system = await prisma.designSystem.findFirst({
      where: {
        id: systemId,
        userId: user.id, // Ensure user owns this system
      },
    });

    if (!system) {
      return NextResponse.json(
        { error: "Design system not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      system,
    });
  } catch (error) {
    console.error("Failed to fetch design system:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch design system" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/design-systems/[id]
 * 
 * Update a design system.
 * Users can only update their own systems.
 * 
 * @param req Request with updated data
 * @param params Route parameters with design system ID
 * @returns Updated design system
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await requireUser();
    const systemId = id;
    const body = await req.json();

    // Update design system (only if owned by user)
    const system = await prisma.designSystem.updateMany({
      where: {
        id: systemId,
        userId: user.id, // Ensure user owns this system
      },
      data: {
        name: body.name,
        description: body.description,
        colors: body.colors,
        typography: body.typography,
        components: body.components,
        theme: body.theme,
        tags: body.tags,
        updatedAt: new Date(),
      },
    });

    if (system.count === 0) {
      return NextResponse.json(
        { error: "Design system not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch updated system
    const updatedSystem = await prisma.designSystem.findUnique({
      where: { id: systemId },
    });

    return NextResponse.json({
      success: true,
      system: updatedSystem,
    });
  } catch (error) {
    console.error("Failed to update design system:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update design system" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/design-systems/[id]
 * 
 * Delete a design system.
 * Users can only delete their own systems.
 * 
 * @param req Request object
 * @param params Route parameters with design system ID
 * @returns Success message
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await requireUser();
    const systemId = id;

    // Delete design system (only if owned by user)
    const system = await prisma.designSystem.deleteMany({
      where: {
        id: systemId,
        userId: user.id, // Ensure user owns this system
      },
    });

    if (system.count === 0) {
      return NextResponse.json(
        { error: "Design system not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Design system deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete design system:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete design system" },
      { status: 500 }
    );
  }
}
