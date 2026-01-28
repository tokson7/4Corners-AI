/**
 * Shared TypeScript Types for Design System
 * Used by both frontend and backend for type safety
 */

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
 * Primary color with metadata
 */
export interface PrimaryColor {
  name: string;
  main: string;
  shades: ColorShades;
  reasoning?: string;
  emotions?: string[];
}

/**
 * Secondary color
 */
export interface SecondaryColor {
  name: string;
  main: string;
  shades: ColorShades;
}

/**
 * Accent color
 */
export interface AccentColor {
  name: string;
  main: string;
  shades: ColorShades;
}

/**
 * Semantic color with shades
 */
export interface SemanticColor {
  main: string;
  shades: ColorShades;
}

/**
 * Semantic colors collection
 */
export interface SemanticColors {
  success: SemanticColor;
  error: SemanticColor;
  warning: SemanticColor;
  info: SemanticColor;
}

/**
 * Neutral grays (50-900)
 */
export interface Neutrals {
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
 * WCAG accessibility check result
 */
export interface AccessibilityCheck {
  ratio: number;
  AA: boolean;
  AAA: boolean;
}

/**
 * Accessibility report
 */
export interface AccessibilityReport {
  primaryOnWhite: AccessibilityCheck;
  primaryOnBlack: AccessibilityCheck;
}

/**
 * Complete color palette response
 */
export interface ColorPaletteResponse {
  primary: PrimaryColor;
  secondary: SecondaryColor;
  accent: AccentColor;
  semantic: SemanticColors;
  neutrals: Neutrals;
  accessibility: AccessibilityReport;
}

/**
 * Typography system from generator
 */
export interface TypographySystem {
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  scale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  weights: Record<string, number>;
  lineHeights: Record<string, number>;
  letterSpacing: Record<string, string>;
  googleFontsUrl: string;
  personality: string;
}

/**
 * Full API response structure
 */
export interface ColorGenerationResponse {
  success: boolean;
  palette: ColorPaletteResponse;
  typography?: TypographySystem;
}

/**
 * Complete Design System structure
 * Used for versioning and refinement
 */
export interface DesignSystem {
  colors?: {
    primary?: {
      main: string;
      shades?: ColorShades;
      name?: string;
      reasoning?: string;
      emotions?: string[];
    };
    secondary?: {
      main: string;
      shades?: ColorShades;
      name?: string;
    };
    accent?: {
      main: string;
      shades?: ColorShades;
      name?: string;
    };
    semantic?: SemanticColors;
    neutrals?: Neutrals;
    accessibility?: AccessibilityReport;
  };
  typography?: {
    heading?: {
      font: string;
    };
    body?: {
      font: string;
    };
  };
  components?: Array<{
    name: string;
    code?: string;
  }>;
  spacing?: Record<string, string>;
}
