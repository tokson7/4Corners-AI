/**
 * Enhanced Component Generator Using Templates
 * Generates production-ready UI components using template system
 */

import type { ColorPaletteResponse, TypographySystem } from '@/lib/types/designSystem';
import {
  generateReactButton,
  generateVueButton,
  generateSvelteButton,
  generateHTMLButton,
  generateCSSButton,
  generateReactCard,
  generateVueCard,
  generateSvelteCard,
  generateHTMLCard,
  generateCSSCard,
  generateReactInput,
  generateVueInput,
  generateSvelteInput,
  generateHTMLInput,
  generateCSSInput,
  generateReactAlert,
  generateVueAlert,
  generateSvelteAlert,
  generateHTMLAlert,
  generateCSSAlert,
} from './templates';

export interface ComponentCode {
  react: string;
  vue: string;
  svelte: string;
  html: string;
  css: string;
}

export interface GeneratedComponent {
  name: string;
  variant: string;
  description: string;
  category: 'button' | 'card' | 'input' | 'alert';
  code: ComponentCode;
}

/**
 * Helper function to get typography with safe fallbacks
 */
function getTypographyWithFallbacks(typography: TypographySystem | any) {
  const scale = typography?.scale || {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  };
  
  const weights = typography?.weights || {
    regular: 400,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  return { scale, weights };
}

/**
 * Helper function to safely access color shades
 */
function getColorShade(shades: any, shade: number | string, fallback: string): string {
  if (!shades) return fallback;
  return shades[shade] || shades[String(shade)] || fallback;
}

/**
 * Ensure we get a light background color for cards
 * Falls back to white if neutrals are not light enough
 */
function getSafeCardBackground(palette: ColorPaletteResponse): string {
  const neutral50 = palette.neutrals?.[50];
  if (!neutral50) return '#ffffff';
  
  // Check if the color is actually light (brightness > 200)
  const hex = neutral50.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If it's not light enough, use white
  return brightness > 200 ? neutral50 : '#ffffff';
}

/**
 * Ensure we get a dark text color for cards
 * Falls back to dark gray if neutrals are not dark enough
 */
function getSafeCardText(palette: ColorPaletteResponse): string {
  const neutral900 = palette.neutrals?.[900];
  if (!neutral900) return '#111827';
  
  // Check if the color is actually dark (brightness < 100)
  const hex = neutral900.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If it's not dark enough, use dark gray
  return brightness < 100 ? neutral900 : '#111827';
}

/**
 * Generate button variants with design tokens
 */
export function generateButtonVariants(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  // Get typography with safe fallbacks
  const { scale, weights } = getTypographyWithFallbacks(typography);

  console.log('🔧 [ButtonGen] Typography scale:', scale);
  console.log('🔧 [ButtonGen] Typography weights:', weights);

  const variants = [
    {
      variant: 'primary',
      description: 'Primary action button with brand colors',
      styles: {
        backgroundColor: palette.primary.main,
        color: '#ffffff',
        hoverBg: getColorShade(palette.primary.shades, 600, palette.primary.main),
        activeBg: getColorShade(palette.primary.shades, 700, palette.primary.main),
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: scale.base,
        fontWeight: String(weights.semibold || 600),
      },
    },
    {
      variant: 'secondary',
      description: 'Secondary action button',
      styles: {
        backgroundColor: palette.secondary.main,
        color: '#ffffff',
        hoverBg: getColorShade(palette.secondary.shades, 600, palette.secondary.main),
        activeBg: getColorShade(palette.secondary.shades, 700, palette.secondary.main),
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: scale.base,
        fontWeight: String(weights.semibold || 600),
      },
    },
    {
      variant: 'outline',
      description: 'Outlined button with transparent background',
      styles: {
        backgroundColor: 'transparent',
        color: palette.primary.main,
        hoverBg: getColorShade(palette.primary.shades, 50, '#f5f3ff'),
        activeBg: getColorShade(palette.primary.shades, 100, '#ede9fe'),
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: scale.base,
        fontWeight: String(weights.semibold || 600),
        border: `2px solid ${palette.primary.main}`,
      },
    },
    {
      variant: 'ghost',
      description: 'Ghost button with minimal styling',
      styles: {
        backgroundColor: 'transparent',
        color: palette.primary.main,
        hoverBg: getColorShade(palette.primary.shades, 50, '#f5f3ff'),
        activeBg: getColorShade(palette.primary.shades, 100, '#ede9fe'),
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: scale.base,
        fontWeight: String(weights.semibold || 600),
      },
    },
  ];

  return variants.map((v) => ({
    name: `${capitalize(v.variant)} Button`,
    variant: v.variant,
    description: v.description,
    category: 'button' as const,
    code: {
      react: generateReactButton(v.variant, v.styles, palette, typography),
      vue: generateVueButton(v.variant, v.styles, palette, typography),
      svelte: generateSvelteButton(v.variant, v.styles, palette, typography),
      html: generateHTMLButton(v.variant, v.styles, palette, typography),
      css: generateCSSButton(v.variant, v.styles, palette, typography),
    },
  }));
}

/**
 * Generate card variants with design tokens
 */
export function generateCardVariants(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  const variants = [
    {
      variant: 'default',
      description: 'Standard card with subtle shadow',
      styles: {
        backgroundColor: getSafeCardBackground(palette),
        color: getSafeCardText(palette),
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: `2px solid ${palette.neutrals[300] || '#d1d5db'}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
    {
      variant: 'elevated',
      description: 'Card with prominent shadow for emphasis',
      styles: {
        backgroundColor: getSafeCardBackground(palette),
        color: getSafeCardText(palette),
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
    {
      variant: 'outlined',
      description: 'Card with border and no shadow',
      styles: {
        backgroundColor: 'transparent',
        color: palette.neutrals[50] || '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: `2px solid ${palette.neutrals[300] || '#d1d5db'}`,
      },
    },
  ];

  return variants.map((v) => ({
    name: `${capitalize(v.variant)} Card`,
    variant: v.variant,
    description: v.description,
    category: 'card' as const,
    code: {
      react: generateReactCard(v.variant, v.styles, palette, typography),
      vue: generateVueCard(v.variant, v.styles, palette, typography),
      svelte: generateSvelteCard(v.variant, v.styles, palette, typography),
      html: generateHTMLCard(v.variant, v.styles, palette, typography),
      css: generateCSSCard(v.variant, v.styles, palette, typography),
    },
  }));
}

/**
 * Generate input variants with design tokens
 */
export function generateInputVariants(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  const { scale, weights } = getTypographyWithFallbacks(typography);

  const variants = [
    {
      variant: 'default',
      description: 'Standard text input field',
      styles: {
        backgroundColor: palette.neutrals[50] || '#ffffff',
        color: palette.neutrals[900] || '#111827',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: `2px solid ${palette.neutrals[400] || '#9ca3af'}`,
        focusBorder: `2px solid ${palette.primary.main}`,
        fontSize: scale.base,
        fontWeight: String(weights.regular || 400),
      },
    },
    {
      variant: 'filled',
      description: 'Input with filled background',
      styles: {
        backgroundColor: palette.neutrals[100] || '#f3f4f6',
        color: palette.neutrals[900] || '#111827',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: '2px solid transparent',
        focusBorder: `2px solid ${palette.primary.main}`,
        fontSize: scale.base,
        fontWeight: String(weights.regular || 400),
      },
    },
  ];

  return variants.map((v) => ({
    name: `${capitalize(v.variant)} Input`,
    variant: v.variant,
    description: v.description,
    category: 'input' as const,
    code: {
      react: generateReactInput(v.variant, v.styles, palette, typography),
      vue: generateVueInput(v.variant, v.styles, palette, typography),
      svelte: generateSvelteInput(v.variant, v.styles, palette, typography),
      html: generateHTMLInput(v.variant, v.styles, palette, typography),
      css: generateCSSInput(v.variant, v.styles, palette, typography),
    },
  }));
}

/**
 * Generate alert variants with design tokens
 */
export function generateAlertVariants(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  const { scale, weights } = getTypographyWithFallbacks(typography);

  const variants = [
    {
      variant: 'success',
      description: 'Success message alert',
      styles: {
        backgroundColor: `${palette.semantic.success.main}30`,
        color: getColorShade(palette.semantic.success.shades, 900, '#065f46'),
        padding: '1rem 1.25rem',
        borderRadius: '0.5rem',
        border: `2px solid ${palette.semantic.success.main}80`,
        fontSize: scale.sm,
        fontWeight: String(weights.medium || 500),
      },
    },
    {
      variant: 'error',
      description: 'Error message alert',
      styles: {
        backgroundColor: `${palette.semantic.error.main}30`,
        color: getColorShade(palette.semantic.error.shades, 900, '#7f1d1d'),
        padding: '1rem 1.25rem',
        borderRadius: '0.5rem',
        border: `2px solid ${palette.semantic.error.main}80`,
        fontSize: scale.sm,
        fontWeight: String(weights.medium || 500),
      },
    },
    {
      variant: 'warning',
      description: 'Warning message alert',
      styles: {
        backgroundColor: `${palette.semantic.warning.main}30`,
        color: getColorShade(palette.semantic.warning.shades, 900, '#78350f'),
        padding: '1rem 1.25rem',
        borderRadius: '0.5rem',
        border: `2px solid ${palette.semantic.warning.main}80`,
        fontSize: scale.sm,
        fontWeight: String(weights.medium || 500),
      },
    },
    {
      variant: 'info',
      description: 'Informational alert',
      styles: {
        backgroundColor: `${palette.semantic.info.main}30`,
        color: getColorShade(palette.semantic.info.shades, 900, '#1e3a8a'),
        padding: '1rem 1.25rem',
        borderRadius: '0.5rem',
        border: `2px solid ${palette.semantic.info.main}80`,
        fontSize: scale.sm,
        fontWeight: String(weights.medium || 500),
      },
    },
  ];

  return variants.map((v) => ({
    name: `${capitalize(v.variant)} Alert`,
    variant: v.variant,
    description: v.description,
    category: 'alert' as const,
    code: {
      react: generateReactAlert(v.variant, v.styles, palette, typography),
      vue: generateVueAlert(v.variant, v.styles, palette, typography),
      svelte: generateSvelteAlert(v.variant, v.styles, palette, typography),
      html: generateHTMLAlert(v.variant, v.styles, palette, typography),
      css: generateCSSAlert(v.variant, v.styles, palette, typography),
    },
  }));
}

/**
 * Generate all components at once
 */
export function generateAllComponentsWithTemplates(
  palette: ColorPaletteResponse,
  typography: TypographySystem
): GeneratedComponent[] {
  try {
    console.log('🔧 [ComponentGen] Starting component generation...');
    console.log('🎨 [ComponentGen] Palette keys:', Object.keys(palette));
    console.log('📝 [ComponentGen] Typography keys:', Object.keys(typography));
    
    const buttons = generateButtonVariants(palette, typography);
    console.log(`✅ [ComponentGen] Generated ${buttons.length} button variants`);
    
    const cards = generateCardVariants(palette, typography);
    console.log(`✅ [ComponentGen] Generated ${cards.length} card variants`);
    
    const inputs = generateInputVariants(palette, typography);
    console.log(`✅ [ComponentGen] Generated ${inputs.length} input variants`);
    
    const alerts = generateAlertVariants(palette, typography);
    console.log(`✅ [ComponentGen] Generated ${alerts.length} alert variants`);
    
    const allComponents = [
      ...buttons,
      ...cards,
      ...inputs,
      ...alerts,
    ];
    
    console.log(`🎉 [ComponentGen] Total components generated: ${allComponents.length}`);
    return allComponents;
  } catch (error) {
    console.error('❌ [ComponentGen] Error generating components:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    throw error;
  }
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
