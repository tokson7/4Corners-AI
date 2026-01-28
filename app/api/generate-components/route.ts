/**
 * Simple Component Generator API
 * 
 * Generates production-ready UI components using existing design tokens.
 * No AI required - uses algorithmic generation based on color and typography.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';
import { generateAllComponentsWithTemplates } from '@/lib/generators/enhancedComponentGenerator';

interface ComponentGenerationRequest {
  palette: ColorPaletteResponse;
  typography: TypographySystem;
}

export async function POST(req: NextRequest) {
  try {
    const body: ComponentGenerationRequest = await req.json();
    let { palette, typography } = body;

    console.log('🧩 [COMPONENTS] Starting component generation...');
    console.log('🧩 [COMPONENTS] Raw data received:', {
      paletteKeys: palette ? Object.keys(palette) : [],
      typographyKeys: typography ? Object.keys(typography) : [],
    });

    if (!palette || !typography) {
      console.error('❌ [COMPONENTS] Missing required fields');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: palette and typography',
        },
        { status: 400 }
      );
    }

    // Transform typography if it has old structure (typeScale instead of scale)
    if (typography && !typography.scale && (typography as any).typeScale) {
      console.log('🔧 [COMPONENTS] Transforming typography structure (typeScale → scale)');
      typography = {
        ...typography,
        scale: (typography as any).typeScale,
      };
    }

    // Add default weights if missing
    if (typography && !typography.weights) {
      console.log('🔧 [COMPONENTS] Adding default typography weights');
      typography = {
        ...typography,
        weights: {
          regular: 400,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
      };
    }

    // Transform palette if it has old structure (neutral instead of neutrals)
    if (palette && !palette.neutrals && (palette as any).neutral) {
      console.log('🔧 [COMPONENTS] Transforming palette structure (neutral → neutrals)');
      const paletteAny = palette as any;
      palette = {
        ...palette,
        neutrals: paletteAny.neutral.shades || paletteAny.neutral,
      };
    }

    console.log('🧩 [COMPONENTS] After transformation:', {
      hasScale: !!typography.scale,
      hasWeights: !!typography.weights,
      hasNeutrals: !!palette.neutrals,
      hasPrimary: !!palette.primary,
    });

    // Generate all components using the enhanced template-based generator
    const components = generateAllComponentsWithTemplates(palette, typography);

    console.log(`✅ [COMPONENTS] Generated ${components.length} component variants!`);
    console.log(`📊 [COMPONENTS] Categories: buttons, cards, inputs, alerts`);

    return NextResponse.json({
      success: true,
      components,
      count: components.length,
    });
  } catch (error) {
    console.error('❌ [COMPONENTS] Generation failed:', error);
    console.error('❌ [COMPONENTS] Error stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ [COMPONENTS] Error message:', error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate components',
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
