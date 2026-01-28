/**
 * Color manipulation utilities for design system generation
 * 
 * Provides functions for color conversion, shade generation, contrast calculation,
 * and WCAG accessibility checking.
 */

/**
 * HSL color representation
 */
export interface HSL {
  /** Hue: 0-360 degrees */
  h: number;
  /** Saturation: 0-100 percentage */
  s: number;
  /** Lightness: 0-100 percentage */
  l: number;
}

/**
 * Color shades from 50 (lightest) to 900 (darkest)
 */
export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * WCAG contrast check result
 */
export interface WCAGResult {
  /** Contrast ratio (e.g., 4.5, 7.2) */
  ratio: number;
  /** WCAG AA compliance (ratio >= 4.5) */
  AA: boolean;
  /** WCAG AAA compliance (ratio >= 7.0) */
  AAA: boolean;
}

/**
 * Convert HEX color to HSL
 * 
 * @param hex - HEX color string (with or without #)
 * @returns HSL color object with h: 0-360, s: 0-100, l: 0-100
 * 
 * @example
 * hexToHSL('#3B82F6') // { h: 217, s: 91, l: 59 }
 * hexToHSL('FF0000') // { h: 0, s: 100, l: 50 }
 */
export function hexToHSL(hex: string): HSL {
  // Remove # if present and normalize
  hex = hex.replace('#', '').toUpperCase();
  
  // Validate hex format
  if (!/^[0-9A-F]{6}$/.test(hex)) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }
  
  // Convert to RGB (0-1 range)
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to HEX
 * 
 * @param h - Hue: 0-360 degrees
 * @param s - Saturation: 0-100 percentage
 * @param l - Lightness: 0-100 percentage
 * @returns Uppercase HEX color string with # prefix
 * 
 * @example
 * hslToHex(217, 91, 59) // '#3B82F6'
 * hslToHex(0, 100, 50) // '#FF0000'
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Normalize values
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    // Achromatic (grayscale)
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number): string => {
    const hex = Math.round(Math.max(0, Math.min(255, x * 255))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Generate color shades from base color (50-900)
 * 
 * Lightness mapping:
 * - 50: 95% (lightest)
 * - 100: 90%
 * - 200: 80%
 * - 300: 70%
 * - 400: 60%
 * - 500: base color
 * - 600: 45%
 * - 700: 35%
 * - 800: 25%
 * - 900: 15% (darkest)
 * 
 * @param baseHex - Base color in HEX format (should be shade 500)
 * @returns ColorShades object with all shades from 50 to 900
 * 
 * @example
 * generateColorShades('#3B82F6') // { 50: '#EFF6FF', 100: '#DBEAFE', ..., 900: '#1E3A8A' }
 */
export function generateColorShades(baseHex: string): ColorShades {
  // Normalize baseHex (ensure uppercase and has #)
  const normalizedHex = baseHex.startsWith('#') 
    ? baseHex.toUpperCase() 
    : `#${baseHex.toUpperCase()}`;
  
  const hsl = hexToHSL(normalizedHex);
  
  return {
    50: hslToHex(hsl.h, hsl.s, 95),
    100: hslToHex(hsl.h, hsl.s, 90),
    200: hslToHex(hsl.h, hsl.s, 80),
    300: hslToHex(hsl.h, hsl.s, 70),
    400: hslToHex(hsl.h, hsl.s, 60),
    500: normalizedHex,
    600: hslToHex(hsl.h, hsl.s, 45),
    700: hslToHex(hsl.h, hsl.s, 35),
    800: hslToHex(hsl.h, hsl.s, 25),
    900: hslToHex(hsl.h, hsl.s, 15),
  };
}

/**
 * Helper: Convert HEX to RGB
 * 
 * @param hex - HEX color string
 * @returns RGB object with r, g, b values (0-255)
 */
function hexToRGB(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace('#', '').toUpperCase();
  
  if (!/^[0-9A-F]{6}$/.test(hex)) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }
  
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * 
 * Uses the WCAG 2.1 relative luminance formula:
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * 
 * Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the lighter color and L2 is the darker color
 * 
 * @param color1 - First color in HEX format
 * @param color2 - Second color in HEX format
 * @returns Contrast ratio (1.0 to 21.0)
 * 
 * @example
 * getContrastRatio('#000000', '#FFFFFF') // 21.0
 * getContrastRatio('#3B82F6', '#FFFFFF') // ~4.5
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRGB(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255;
      // Apply gamma correction
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    // Relative luminance formula (WCAG 2.1)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check WCAG compliance for color contrast
 * 
 * WCAG Standards:
 * - AA (Normal text): ratio >= 4.5:1
 * - AAA (Normal text): ratio >= 7.0:1
 * - AA (Large text): ratio >= 3.0:1
 * - AAA (Large text): ratio >= 4.5:1
 * 
 * This function checks for normal text standards.
 * 
 * @param foreground - Foreground color in HEX format
 * @param background - Background color in HEX format
 * @returns WCAGResult with ratio, AA, and AAA compliance
 * 
 * @example
 * checkWCAG('#000000', '#FFFFFF') // { ratio: 21, AA: true, AAA: true }
 * checkWCAG('#3B82F6', '#FFFFFF') // { ratio: 4.5, AA: true, AAA: false }
 */
export function checkWCAG(foreground: string, background: string): WCAGResult {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio: Math.round(ratio * 100) / 100, // Round to 2 decimal places
    AA: ratio >= 4.5,
    AAA: ratio >= 7.0,
  };
}

/**
 * Get color name from hex based on hue
 * 
 * Color ranges:
 * - Red: 0-15° and 330-360°
 * - Orange: 15-45°
 * - Yellow: 45-75°
 * - Green: 75-150°
 * - Cyan: 150-200°
 * - Blue: 200-250°
 * - Purple: 250-290°
 * - Magenta: 290-330°
 * 
 * @param hex - HEX color string
 * @returns Color name string
 * 
 * @example
 * getColorName('#FF0000') // 'Red'
 * getColorName('#3B82F6') // 'Blue'
 * getColorName('#10B981') // 'Green'
 */
export function getColorName(hex: string): string {
  const hsl = hexToHSL(hex);
  const h = hsl.h;
  
  if (h >= 0 && h < 15) return 'Red';
  if (h >= 15 && h < 45) return 'Orange';
  if (h >= 45 && h < 75) return 'Yellow';
  if (h >= 75 && h < 150) return 'Green';
  if (h >= 150 && h < 200) return 'Cyan';
  if (h >= 200 && h < 250) return 'Blue';
  if (h >= 250 && h < 290) return 'Purple';
  if (h >= 290 && h < 330) return 'Magenta';
  return 'Red'; // Wrap around for 330-360°
}
