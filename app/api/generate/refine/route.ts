import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { getUserCredits, deductCredits, CREDIT_COSTS } from "@/lib/credits/creditTracker";
import { trackEventServer } from "@/lib/analytics/trackEvent";
import {
  regenerateWithConstraints,
  compareDesignVersions,
  type RefinementConstraints,
} from "@/lib/ai/advancedGeneration";
import { createVersion, getVersion } from "@/lib/ai/versioning";
import type { DesignSystem } from "@/lib/types/designSystem";
import { validateRefinementInstruction, validatePayloadSize } from "@/lib/security/inputSanitization";
import { getOpenAIKey } from "@/lib/security/apiKeySafety";

/**
 * POST /api/generate/refine
 * Refine an existing design system with constraints
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(req);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You have exceeded the rate limit of ${rateLimit.limit} requests per minute. Please try again later.`,
          resetAt: rateLimit.resetAt,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
          },
        }
      );
    }

    // Validate API key
    try {
      getOpenAIKey();
    } catch (error) {
      console.error('OpenAI API key validation failed:', error);
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Credit check
    const creditCheck = await getUserCredits(req);
    if (!creditCheck.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cost = CREDIT_COSTS.GENERATE_FULL_SYSTEM; // Same cost as full generation
    if (!creditCheck.canAfford(cost)) {
      await trackEventServer("credit_balance_depleted", {
        userId: creditCheck.userId,
        lastAction: "refine_design",
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${cost} credits but only have ${creditCheck.credits?.balance || 0}. Upgrade your plan for more credits.`,
          required: cost,
          balance: creditCheck.credits?.balance || 0,
        },
        { status: 402 }
      );
    }

    // Parse and validate payload
    let body: any;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Validate payload size
    const payloadValidation = validatePayloadSize(body, 1024 * 500); // 500KB max for design systems
    if (!payloadValidation.valid) {
      return NextResponse.json(
        { error: payloadValidation.error },
        { status: 400 }
      );
    }

    const {
      previousDesign,
      userInstruction,
      constraints,
      parentVersionId,
    } = body;

    // Validation
    if (!previousDesign) {
      return NextResponse.json(
        { error: "Previous design system is required" },
        { status: 400 }
      );
    }

    // Validate and sanitize user instruction if provided
    let sanitizedInstruction: string | undefined;
    if (userInstruction) {
      const instructionValidation = validateRefinementInstruction(userInstruction);
      if (!instructionValidation.valid) {
        return NextResponse.json(
          { error: instructionValidation.error },
          { status: 400 }
        );
      }
      sanitizedInstruction = instructionValidation.sanitized;
    }

    // Parse constraints
    const refinementConstraints: RefinementConstraints = constraints || {};

    // If user instruction is provided, try to extract constraints from it
    if (sanitizedInstruction && !constraints) {
      const extractedConstraints = extractConstraintsFromInstruction(sanitizedInstruction);
      Object.assign(refinementConstraints, extractedConstraints);
    }

    // Refine the design (use sanitized instruction)
    const { refinedDesign, explanation } = await regenerateWithConstraints(
      previousDesign as DesignSystem,
      refinementConstraints,
      sanitizedInstruction
    );

    // Compare versions
    const comparison = compareDesignVersions(
      previousDesign as DesignSystem,
      refinedDesign
    );

    // Create version (use sanitized instruction)
    const version = createVersion(
      creditCheck.userId,
      refinedDesign,
      sanitizedInstruction || "Refined design system",
      parentVersionId
    );

    // Deduct credits
    const creditResult = await deductCredits(req, cost, "refine_design");
    if (!creditResult.success) {
      console.warn("Failed to deduct credits for refinement:", creditResult.error);
    }

    // Track event
    // TODO: Fix analytics event types
    // await trackEventServer("design_system_generated", {
    //   userId: creditCheck.userId,
    //   creditsUsed: cost,
    //   timestamp: new Date().toISOString(),
    // });

    return NextResponse.json({
      success: true,
      refinedDesign,
      version: {
        id: version.id,
        version: version.version,
        timestamp: version.timestamp,
        changes: version.changes,
      },
      comparison,
      explanation,
    });
  } catch (error) {
    console.error("Failed to refine design system:", error);
    return NextResponse.json(
      {
        error: "Failed to refine design system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Extract constraints from user instruction (simple rule-based parsing)
 */
function extractConstraintsFromInstruction(
  instruction: string
): Partial<RefinementConstraints> {
  const lowerInstruction = instruction.toLowerCase();
  const constraints: Partial<RefinementConstraints> = {};

  // Check for keep constraints
  if (lowerInstruction.includes("keep primary") || lowerInstruction.includes("keep primary color")) {
    constraints.keepPrimaryColor = true;
  }
  if (lowerInstruction.includes("keep secondary") || lowerInstruction.includes("keep secondary color")) {
    constraints.keepSecondaryColor = true;
  }
  if (lowerInstruction.includes("keep typography") || lowerInstruction.includes("keep fonts")) {
    constraints.keepTypography = true;
  }

  // Check for improvement constraints
  if (lowerInstruction.includes("accessibility") || lowerInstruction.includes("accessible")) {
    constraints.improveAccessibility = true;
  }

  // Check for tone adjustments
  if (lowerInstruction.includes("playful") || lowerInstruction.includes("fun")) {
    constraints.adjustTone = "more playful";
  } else if (lowerInstruction.includes("professional") || lowerInstruction.includes("corporate")) {
    constraints.adjustTone = "more professional";
  } else if (lowerInstruction.includes("modern") || lowerInstruction.includes("contemporary")) {
    constraints.adjustTone = "more modern";
  } else if (lowerInstruction.includes("classic") || lowerInstruction.includes("traditional")) {
    constraints.adjustTone = "more classic";
  }

  // Extract specific changes
  const specificChanges: string[] = [];
  if (lowerInstruction.includes("darker")) specificChanges.push("make darker");
  if (lowerInstruction.includes("lighter")) specificChanges.push("make lighter");
  if (lowerInstruction.includes("more contrast")) specificChanges.push("increase contrast");
  if (lowerInstruction.includes("less contrast")) specificChanges.push("decrease contrast");

  if (specificChanges.length > 0) {
    constraints.specificChanges = specificChanges;
  }

  return constraints;
}

/**
 * GET /api/generate/refine
 * Get suggestions for a design system
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const designSystemJson = searchParams.get("designSystem");

    if (!designSystemJson) {
      return NextResponse.json(
        { error: "Design system is required" },
        { status: 400 }
      );
    }

    try {
      const designSystem = JSON.parse(designSystemJson) as DesignSystem;
      const { suggestImprovements } = await import("@/lib/ai/advancedGeneration");
      const result = await suggestImprovements(designSystem);

      return NextResponse.json({
        success: true,
        suggestions: result.suggestions,
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid design system format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to get suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}

