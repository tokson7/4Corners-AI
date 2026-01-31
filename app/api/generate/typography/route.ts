import { NextRequest, NextResponse } from "next/server";
import {
  generateTypographySystem,
} from "@/lib/ai/typographyGenerator";
import type { BrandAnalysis } from "@/lib/ai/colorGenerator";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validatePayloadSize } from "@/lib/security/inputSanitization";
import { getOpenAIKey } from "@/lib/security/apiKeySafety";
import { getToken } from "next-auth/jwt";
import { trackEventServer } from "@/lib/analytics/trackEvent";

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
    const payloadValidation = validatePayloadSize(body, 1024 * 50); // 50KB max
    if (!payloadValidation.valid) {
      return NextResponse.json(
        { error: payloadValidation.error },
        { status: 400 }
      );
    }
    const { brandAnalysis } = body;

    if (!brandAnalysis || typeof brandAnalysis !== "object") {
      return NextResponse.json(
        { error: "brandAnalysis is required and must be an object" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!brandAnalysis.industry || !brandAnalysis.tone || !brandAnalysis.emotions) {
      return NextResponse.json(
        { error: "brandAnalysis must include industry, tone, and emotions" },
        { status: 400 }
      );
    }

    // Generate typography system
    const typographySystem = generateTypographySystem(brandAnalysis.tone || 'modern', brandAnalysis.industry);

    // Generate CSS variables
    const cssVariables = generateCSSVariables(typographySystem);

    // Generate Tailwind config
    const tailwindConfig = generateTailwindConfig(typographySystem);

    // Generate CSS classes
    const cssClasses = generateCSSClasses(typographySystem);

    // Build response
    const response = {
      system: typographySystem,
      css: {
        variables: cssVariables,
        classes: cssClasses,
        googleFontsUrl: typographySystem.googleFontsUrl,
      },
      tailwind: tailwindConfig,
      pairing: {
        heading: typographySystem.fonts.heading,
        body: typographySystem.fonts.body,
        mono: typographySystem.fonts.mono,
        description: getPairingDescription(typographySystem),
      },
    };

    // Track analytics event (non-blocking)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.id) {
      trackEventServer("typography_generated", {
        userId: token.id as string,
        plan: "free", // TODO: Get from subscription
        timestamp: new Date().toISOString(),
        headingFont: typographySystem.fonts.heading,
        bodyFont: typographySystem.fonts.body,
        creditsUsed: 0, // Typography generation doesn't use credits yet
      }).catch(() => {});
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Typography generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate typography system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Generate CSS variables for typography system
 */
function generateCSSVariables(system: ReturnType<typeof generateTypographySystem>): string {
  const { fonts, scale, lineHeights, weights } = system;

  let css = `:root {\n`;
  css += `  /* Font Families */\n`;
  css += `  --font-heading: '${fonts.heading}', sans-serif;\n`;
  css += `  --font-body: '${fonts.body}', sans-serif;\n`;
  if (fonts.mono) {
    css += `  --font-mono: '${fonts.mono}', monospace;\n`;
  }

  css += `\n  /* Type Scale */\n`;
  for (const [key, value] of Object.entries(scale)) {
    css += `  --font-size-${key}: ${value};\n`;
  }

  css += `\n  /* Line Heights */\n`;
  for (const [key, value] of Object.entries(lineHeights)) {
    css += `  --line-height-${key}: ${value};\n`;
  }

  css += `\n  /* Font Weights */\n`;
  for (const [key, value] of Object.entries(weights)) {
    css += `  --font-weight-${key}: ${value};\n`;
  }

  css += `}\n`;

  return css;
}

/**
 * Generate Tailwind config for typography system
 */
function generateTailwindConfig(system: ReturnType<typeof generateTypographySystem>): object {
  const { fonts, scale, lineHeights, weights } = system;

  return {
    theme: {
      extend: {
        fontFamily: {
          heading: [`var(--font-heading)`, "sans-serif"],
          body: [`var(--font-body)`, "sans-serif"],
          ...(fonts.mono && { mono: [`var(--font-mono)`, "monospace"] }),
        },
        fontSize: {
          xs: [scale.xs, { lineHeight: lineHeights.tight || '1.25' }],
          sm: [scale.sm, { lineHeight: lineHeights.normal || '1.5' }],
          base: [scale.base, { lineHeight: lineHeights.normal || '1.5' }],
          lg: [scale.lg, { lineHeight: lineHeights.normal || '1.5' }],
          xl: [scale.xl, { lineHeight: lineHeights.relaxed || '1.75' }],
          "2xl": [scale["2xl"], { lineHeight: lineHeights.relaxed || '1.75' }],
          "3xl": [scale["3xl"], { lineHeight: lineHeights.tight || '1.25' }],
          "4xl": [scale["4xl"], { lineHeight: lineHeights.tight || '1.25' }],
          "5xl": [scale["5xl"], { lineHeight: lineHeights.tight || '1.25' }],
          "6xl": [scale["6xl"], { lineHeight: lineHeights.tight || '1.25' }],
        },
        lineHeight: lineHeights,
        fontWeight: weights,
      },
    },
  };
}

/**
 * Generate CSS classes for typography
 */
function generateCSSClasses(system: ReturnType<typeof generateTypographySystem>): string {
  const { fonts, scale, lineHeights, weights } = system;

  let css = `/* Typography Classes */\n\n`;

  // Heading styles
  css += `.font-heading {\n`;
  css += `  font-family: var(--font-heading);\n`;
  css += `}\n\n`;

  // Body styles
  css += `.font-body {\n`;
  css += `  font-family: var(--font-body);\n`;
  css += `}\n\n`;

  if (fonts.mono) {
    css += `.font-mono {\n`;
    css += `  font-family: var(--font-mono);\n`;
    css += `}\n\n`;
  }

  // Heading sizes
  css += `/* Heading Sizes */\n`;
  css += `.text-h1 {\n`;
  css += `  font-size: var(--font-size-5xl);\n`;
  css += `  line-height: var(--line-height-tight);\n`;
  css += `  font-weight: var(--font-weight-bold);\n`;
  css += `  font-family: var(--font-heading);\n`;
  css += `}\n\n`;

  css += `.text-h2 {\n`;
  css += `  font-size: var(--font-size-4xl);\n`;
  css += `  line-height: var(--line-height-tight);\n`;
  css += `  font-weight: var(--font-weight-bold);\n`;
  css += `  font-family: var(--font-heading);\n`;
  css += `}\n\n`;

  css += `.text-h3 {\n`;
  css += `  font-size: var(--font-size-3xl);\n`;
  css += `  line-height: var(--line-height-tight);\n`;
  css += `  font-weight: var(--font-weight-semibold);\n`;
  css += `  font-family: var(--font-heading);\n`;
  css += `}\n\n`;

  css += `.text-h4 {\n`;
  css += `  font-size: var(--font-size-2xl);\n`;
  css += `  line-height: var(--line-height-normal);\n`;
  css += `  font-weight: var(--font-weight-semibold);\n`;
  css += `  font-family: var(--font-heading);\n`;
  css += `}\n\n`;

  // Body styles
  css += `/* Body Styles */\n`;
  css += `.text-body-lg {\n`;
  css += `  font-size: var(--font-size-lg);\n`;
  css += `  line-height: var(--line-height-relaxed);\n`;
  css += `  font-family: var(--font-body);\n`;
  css += `}\n\n`;

  css += `.text-body {\n`;
  css += `  font-size: var(--font-size-base);\n`;
  css += `  line-height: var(--line-height-normal);\n`;
  css += `  font-family: var(--font-body);\n`;
  css += `}\n\n`;

  css += `.text-body-sm {\n`;
  css += `  font-size: var(--font-size-sm);\n`;
  css += `  line-height: var(--line-height-normal);\n`;
  css += `  font-family: var(--font-body);\n`;
  css += `}\n\n`;

  css += `.text-caption {\n`;
  css += `  font-size: var(--font-size-xs);\n`;
  css += `  line-height: var(--line-height-normal);\n`;
  css += `  font-family: var(--font-body);\n`;
  css += `}\n`;

  return css;
}

/**
 * Get pairing description
 */
function getPairingDescription(system: ReturnType<typeof generateTypographySystem>): string {
  const { fonts } = system;
  let desc = `${fonts.heading} for headings and ${fonts.body} for body text`;
  if (fonts.mono) {
    desc += `, with ${fonts.mono} for code`;
  }
  return desc;
}
