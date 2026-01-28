/**
 * Figma Design Tokens Exporter
 * 
 * Exports design tokens in Figma Tokens plugin format.
 * Compatible with the Figma Tokens plugin for easy import into Figma.
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';

/**
 * Export design tokens in Figma Tokens plugin format
 * 
 * Generates a JSON file compatible with the Figma Tokens plugin,
 * allowing designers to import the design system directly into Figma.
 * 
 * @param palette - Color palette with all color tokens
 * @param typography - Typography system with fonts and scales
 * @returns JSON string in Figma Tokens format
 */
export function exportFigmaTokens(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): string {
  const tokens = {
    $metadata: {
      generator: '4Corners AI',
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },

    colors: {
      primary: {
        $type: 'color',
        $description: 'Primary brand color palette',
        main: { $value: palette.primary.main },
        50: { $value: palette.primary.shades[50] },
        100: { $value: palette.primary.shades[100] },
        200: { $value: palette.primary.shades[200] },
        300: { $value: palette.primary.shades[300] },
        400: { $value: palette.primary.shades[400] },
        500: { $value: palette.primary.shades[500] },
        600: { $value: palette.primary.shades[600] },
        700: { $value: palette.primary.shades[700] },
        800: { $value: palette.primary.shades[800] },
        900: { $value: palette.primary.shades[900] },
      },

      secondary: {
        $type: 'color',
        $description: 'Secondary brand color palette',
        main: { $value: palette.secondary.main },
        ...Object.fromEntries(
          Object.entries(palette.secondary.shades).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },

      accent: {
        $type: 'color',
        $description: 'Accent color palette',
        main: { $value: palette.accent.main },
        ...Object.fromEntries(
          Object.entries(palette.accent.shades).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },

      semantic: {
        $description: 'Semantic colors for feedback and status',
        success: {
          $type: 'color',
          main: { $value: palette.semantic.success.main },
          ...Object.fromEntries(
            Object.entries(palette.semantic.success.shades).map(([key, value]) => [
              key,
              { $value: value }
            ])
          ),
        },
        error: {
          $type: 'color',
          main: { $value: palette.semantic.error.main },
          ...Object.fromEntries(
            Object.entries(palette.semantic.error.shades).map(([key, value]) => [
              key,
              { $value: value }
            ])
          ),
        },
        warning: {
          $type: 'color',
          main: { $value: palette.semantic.warning.main },
          ...Object.fromEntries(
            Object.entries(palette.semantic.warning.shades).map(([key, value]) => [
              key,
              { $value: value }
            ])
          ),
        },
        info: {
          $type: 'color',
          main: { $value: palette.semantic.info.main },
          ...Object.fromEntries(
            Object.entries(palette.semantic.info.shades).map(([key, value]) => [
              key,
              { $value: value }
            ])
          ),
        },
      },

      neutral: {
        $type: 'color',
        $description: 'Neutral gray scale',
        ...Object.fromEntries(
          Object.entries(palette.neutrals).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },
    },

    typography: {
      fontFamilies: {
        $type: 'fontFamily',
        heading: {
          $value: typography.fonts.heading,
          $description: 'Font family for headings and display text',
        },
        body: {
          $value: typography.fonts.body,
          $description: 'Font family for body text and paragraphs',
        },
        mono: {
          $value: typography.fonts.mono,
          $description: 'Font family for code and monospace text',
        },
      },

      fontSize: {
        $type: 'dimension',
        $description: 'Font size scale (modular scale 1.25)',
        ...Object.fromEntries(
          Object.entries(typography.scale).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },

      fontWeight: {
        $type: 'number',
        $description: 'Font weight values',
        ...Object.fromEntries(
          Object.entries(typography.weights).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },

      lineHeight: {
        $type: 'number',
        $description: 'Line height values',
        ...Object.fromEntries(
          Object.entries(typography.lineHeights).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },

      letterSpacing: {
        $type: 'dimension',
        $description: 'Letter spacing values',
        ...Object.fromEntries(
          Object.entries(typography.letterSpacing).map(([key, value]) => [
            key,
            { $value: value }
          ])
        ),
      },
    },
  };

  return JSON.stringify(tokens, null, 2);
}
