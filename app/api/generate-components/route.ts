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
      hasPalette: !!palette,
      hasTypography: !!typography,
    });
    
    // Deep log for debugging
    if (palette) {
      console.log('🎨 [COMPONENTS] Palette structure:', {
        hasPrimary: !!palette.primary,
        hasSecondary: !!palette.secondary,
        hasAccent: !!palette.accent,
        hasSemantic: !!palette.semantic,
        hasNeutrals: !!palette.neutrals,
        hasNeutral: !!(palette as any).neutral,
        primaryMain: palette.primary?.main || 'N/A',
        neutralsType: palette.neutrals ? typeof palette.neutrals : (palette as any).neutral ? 'has neutral' : 'none',
      });
    }
    
    if (typography) {
      console.log('📝 [COMPONENTS] Typography structure:', {
        hasScale: !!(typography as any).scale,
        hasTypeScale: !!(typography as any).typeScale,
        hasFontPairs: !!(typography as any).fontPairs,
        hasFonts: !!(typography as any).fonts,
        hasWeights: !!(typography as any).weights,
      });
    }

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

    // Add fonts structure if missing
    if (typography && !typography.fonts) {
      console.log('🔧 [COMPONENTS] Adding default fonts structure');
      const typographyAny = typography as any;
      
      // Try to extract fonts from fontPairs if available
      if (typographyAny.fontPairs && typographyAny.fontPairs[0]) {
        const pair = typographyAny.fontPairs[0];
        typography = {
          ...typography,
          fonts: {
            heading: pair.heading?.family || 'Inter, sans-serif',
            body: pair.body?.family || 'Inter, sans-serif',
            mono: 'Fira Code, monospace',
          },
        };
      } else {
        // Use defaults
        typography = {
          ...typography,
          fonts: {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif',
            mono: 'Fira Code, monospace',
          },
        };
      }
    }

    // Add other required typography properties if missing
    if (typography && !typography.lineHeights) {
      typography = {
        ...typography,
        lineHeights: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.75,
        },
      };
    }

    if (typography && !typography.letterSpacing) {
      typography = {
        ...typography,
        letterSpacing: {
          tight: '-0.025em',
          normal: '0',
          wide: '0.025em',
        },
      };
    }

    if (typography && !typography.googleFontsUrl) {
      typography = {
        ...typography,
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      };
    }

    if (typography && !typography.personality) {
      typography = {
        ...typography,
        personality: 'Modern and clean',
      };
    }

    // Transform palette if it has old structure (neutral instead of neutrals)
    if (palette && !palette.neutrals && (palette as any).neutral) {
      console.log('🔧 [COMPONENTS] Transforming palette structure (neutral → neutrals)');
      const paletteAny = palette as any;
      const neutral = paletteAny.neutral;
      
      // Handle different neutral structures
      if (neutral.shades) {
        // If neutral has shades property (ColorPalette structure from AI)
        // Extract hex values from shade objects
        const extractedShades: Record<string, string> = {};
        for (const [key, value] of Object.entries(neutral.shades)) {
          if (typeof value === 'string') {
            extractedShades[key] = value;
          } else if (value && typeof value === 'object' && 'hex' in value) {
            extractedShades[key] = (value as any).hex;
          }
        }
        palette = {
          ...palette,
          neutrals: extractedShades as any,
        };
      } else if (typeof neutral[50] === 'string' || typeof neutral['50'] === 'string') {
        // Already in correct format
        palette = {
          ...palette,
          neutrals: neutral,
        };
      } else if (neutral[50]?.hex || neutral['50']?.hex) {
        // Shades are objects with hex property
        const extractedShades: Record<string, string> = {};
        for (const [key, value] of Object.entries(neutral)) {
          if (typeof value === 'string') {
            extractedShades[key] = value;
          } else if (value && typeof value === 'object' && 'hex' in value) {
            extractedShades[key] = (value as any).hex;
          }
        }
        palette = {
          ...palette,
          neutrals: extractedShades as any,
        };
      } else {
        console.warn('⚠️ [COMPONENTS] Unknown neutral structure, using defaults');
        palette = {
          ...palette,
          neutrals: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
          } as any,
        };
      }
    }
    
    // Ensure neutrals exist with fallback
    if (!palette.neutrals) {
      console.warn('⚠️ [COMPONENTS] No neutrals found, using defaults');
      palette = {
        ...palette,
        neutrals: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        } as any,
      };
    }

    console.log('🧩 [COMPONENTS] After transformation:', {
      hasScale: !!typography.scale,
      hasWeights: !!typography.weights,
      hasFonts: !!typography.fonts,
      hasNeutrals: !!palette.neutrals,
      hasPrimary: !!palette.primary,
      fontsValue: typography.fonts ? JSON.stringify(typography.fonts) : 'undefined',
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
