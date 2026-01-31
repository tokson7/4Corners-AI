import { NextRequest, NextResponse } from "next/server";
import {
  generateAllComponents,
  type GeneratedComponent,
} from "@/lib/generators/componentGenerator";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validatePayloadSize } from "@/lib/security/inputSanitization";
import { getOpenAIKey } from "@/lib/security/apiKeySafety";
import { getToken } from "next-auth/jwt";
import { trackEventServer } from "@/lib/analytics/trackEvent";

// Type aliases for compatibility
type ComponentType = string;
type ComponentFramework = string;
type DesignSystem = any;

const PRIORITY_COMPONENTS: ComponentType[] = [
  "button",
  "input",
  "card",
  "modal",
  "alert",
  "badge",
];

const ADDITIONAL_COMPONENTS: ComponentType[] = [
  "select",
  "checkbox",
  "radio",
  "switch",
  "textarea",
  "table",
  "tabs",
  "accordion",
];

const ALL_COMPONENTS: ComponentType[] = [
  ...PRIORITY_COMPONENTS,
  ...ADDITIONAL_COMPONENTS,
];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(request);
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

    // Parse and validate payload
    let body: any;
    try {
      body = await request.json();
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
    const { designSystem, components, frameworks } = body;

    // Validate design system
    if (!designSystem || typeof designSystem !== "object") {
      return NextResponse.json(
        { error: "designSystem is required and must be an object" },
        { status: 400 }
      );
    }

    // Validate required design system fields
    if (
      !designSystem.colors ||
      !designSystem.colors.primary ||
      !designSystem.colors.secondary ||
      !designSystem.colors.accent ||
      !designSystem.colors.semantic
    ) {
      return NextResponse.json(
        {
          error:
            "designSystem.colors must include primary, secondary, accent, and semantic colors",
        },
        { status: 400 }
      );
    }

    if (!designSystem.typography || !designSystem.typography.heading || !designSystem.typography.body) {
      return NextResponse.json(
        {
          error: "designSystem.typography must include heading and body fonts",
        },
        { status: 400 }
      );
    }

    // Default spacing if not provided
    const spacing = designSystem.spacing || {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    };

    // Build complete design system
    const completeDesignSystem: DesignSystem = {
      colors: {
        primary: designSystem.colors.primary,
        secondary: designSystem.colors.secondary,
        accent: designSystem.colors.accent,
        semantic: {
          success: designSystem.colors.semantic?.success || "#10B981",
          error: designSystem.colors.semantic?.error || "#EF4444",
          warning: designSystem.colors.semantic?.warning || "#F59E0B",
          info: designSystem.colors.semantic?.info || "#3B82F6",
        },
      },
      typography: {
        heading: designSystem.typography.heading,
        body: designSystem.typography.body,
      },
      spacing,
    };

    // Determine which components to generate
    const componentsToGenerate: ComponentType[] = components
      ? (Array.isArray(components) ? components : [components])
      : ALL_COMPONENTS;

    // Validate component names
    for (const comp of componentsToGenerate) {
      if (!ALL_COMPONENTS.includes(comp)) {
        return NextResponse.json(
          { error: `Invalid component: ${comp}. Valid components: ${ALL_COMPONENTS.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Determine which frameworks to generate
    const frameworksToGenerate: ComponentFramework[] = frameworks
      ? (Array.isArray(frameworks) ? frameworks : [frameworks])
      : ["react", "vue", "html", "tailwind"];

    // Validate framework names
    const validFrameworks: ComponentFramework[] = ["react", "vue", "html", "tailwind"];
    for (const fw of frameworksToGenerate) {
      if (!validFrameworks.includes(fw)) {
        return NextResponse.json(
          { error: `Invalid framework: ${fw}. Valid frameworks: ${validFrameworks.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Generate components
    const generatedComponents: Array<{
      component: ComponentType;
      framework: ComponentFramework;
      code: string;
      name: string;
    }> = [];

    // TODO: Implement component generation
    // These functions don't exist yet in componentGenerator.ts
    
    for (const component of componentsToGenerate) {
      // Stub implementation - return basic structure
      for (const framework of frameworksToGenerate) {
        generatedComponents.push({
          component: component as any,
          framework: framework as any,
          code: `// ${component} component for ${framework} - generation not implemented yet`,
          name: component,
        });
      }
    }

    // Organize by component
    const organizedComponents: Record<
      ComponentType,
      Record<ComponentFramework, { code: string; name: string }>
    > = {} as any;

    for (const gen of generatedComponents) {
      if (!organizedComponents[gen.component]) {
        organizedComponents[gen.component] = {} as any;
      }
      organizedComponents[gen.component][gen.framework] = {
        code: gen.code,
        name: gen.name,
      };
    }

    // Build response
    const response = {
      components: organizedComponents,
      summary: {
        totalComponents: componentsToGenerate.length,
        totalFormats: generatedComponents.length,
        frameworks: frameworksToGenerate,
        components: componentsToGenerate,
      },
      designSystem: completeDesignSystem,
    };

    // Track analytics event (non-blocking)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.id) {
      trackEventServer("components_generated", {
        userId: token.id as string,
        plan: "free", // TODO: Get from subscription
        timestamp: new Date().toISOString(),
        componentCount: componentsToGenerate.length,
        frameworks: frameworksToGenerate,
        creditsUsed: 0, // Component generation doesn't use credits yet
      }).catch(() => {});
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Component generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate components",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Returns available components and frameworks
 */
export async function GET() {
  return NextResponse.json(
    {
      availableComponents: {
        priority: PRIORITY_COMPONENTS,
        additional: ADDITIONAL_COMPONENTS,
        all: ALL_COMPONENTS,
      },
      availableFrameworks: ["react", "vue", "html", "tailwind"],
      usage: {
        method: "POST",
        body: {
          designSystem: {
            colors: {
              primary: "string (hex)",
              secondary: "string (hex)",
              accent: "string (hex)",
              semantic: {
                success: "string (hex)",
                error: "string (hex)",
                warning: "string (hex)",
                info: "string (hex)",
              },
            },
            typography: {
              heading: "string (font name)",
              body: "string (font name)",
            },
            spacing: {
              xs: "string (optional)",
              sm: "string (optional)",
              md: "string (optional)",
              lg: "string (optional)",
              xl: "string (optional)",
            },
          },
          components: "array of component names (optional, defaults to all)",
          frameworks: "array of framework names (optional, defaults to all)",
        },
      },
    },
    { status: 200 }
  );
}
