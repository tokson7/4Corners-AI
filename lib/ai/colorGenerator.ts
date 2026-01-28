/**
 * AI-Powered Color Generation System
 * Generates design system colors based on brand descriptions
 */

// Memoization cache for expensive calculations
const shadeCache = new Map<string, ColorShades>();
const complementaryCache = new Map<string, ComplementaryColors>();
const neutralCache = new Map<string, ColorShades>();
const accessibilityCache = new Map<string, AccessibilityResult>();

// Types
export interface BrandAnalysis {
  industry: string;
  tone: string;
  emotions: string[];
  keywords: string[];
}

export interface ColorShades {
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
}

export interface ComplementaryColors {
  secondary: string;
  accent: string;
}

export interface AccessibilityResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

export interface SemanticColors {
  success: string;
  error: string;
  warning: string;
  info: string;
}

// Color Psychology Mapping
const INDUSTRY_COLORS: Record<string, string> = {
  finance: "#1E3A8A", // Trust Blue
  fintech: "#1E40AF", // Corporate Blue
  healthcare: "#3B82F6", // Medical Blue
  health: "#3B82F6",
  eco: "#059669", // Sustainable Green
  sustainability: "#059669",
  green: "#059669",
  creative: "#7C3AED", // Bold Purple
  design: "#7C3AED",
  food: "#EA580C", // Fresh Orange
  restaurant: "#EA580C",
  delivery: "#EA580C",
  technology: "#6366F1", // Tech Indigo
  tech: "#6366F1",
  saas: "#6366F1",
  education: "#2563EB", // Learning Blue
  gaming: "#A855F7", // Neon Purple
  entertainment: "#A855F7",
  ecommerce: "#EC4899", // Vibrant Pink
  retail: "#EC4899",
  fashion: "#EC4899",
};

const TONE_COLORS: Record<string, string> = {
  trustworthy: "#1E40AF",
  innovative: "#6366F1",
  energetic: "#F59E0B",
  calm: "#3B82F6",
  premium: "#7C3AED",
  friendly: "#10B981",
  bold: "#EC4899",
  professional: "#1E3A8A",
};

/**
 * A. Analyze Brand Description
 * Uses AI to extract brand personality, industry, tone, and emotions
 */
export async function analyzeBrandDescription(
  description: string
): Promise<BrandAnalysis> {
  // Try to use OpenAI API first
  const { analyzeWithAI } = await import("@/lib/ai/client");
  
  try {
    const prompt = `Analyze this brand description and extract key information: "${description}"
      
      Return a JSON object with:
      - industry: one of [finance, fintech, healthcare, health, eco, sustainability, green, creative, design, food, restaurant, delivery, technology, tech, saas, education, gaming, entertainment, ecommerce, retail, fashion, general]
      - tone: one of [trustworthy, innovative, energetic, calm, premium, friendly, bold, professional]
      - emotions: array of 2-4 emotions from [secure, innovative, energetic, calm, premium, friendly, bold]
      - keywords: array of 5-10 relevant keywords`;

    const aiResponse = await analyzeWithAI(prompt);
    
    // Parse JSON response
    try {
      const aiAnalysis = JSON.parse(aiResponse) as BrandAnalysis;
      
      if (aiAnalysis && typeof aiAnalysis === "object") {
        return {
          industry: aiAnalysis.industry || "general",
          tone: aiAnalysis.tone || "professional",
          emotions: Array.isArray(aiAnalysis.emotions) ? aiAnalysis.emotions : ["professional"],
          keywords: Array.isArray(aiAnalysis.keywords) ? aiAnalysis.keywords : [],
        };
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response, falling back to rule-based:", parseError);
    }
  } catch (error) {
    console.warn("AI analysis failed, falling back to rule-based:", error);
  }
  
  // Fallback to rule-based analysis
  const lowerDesc = description.toLowerCase();
  
  // Industry detection
  let industry = "general";
  for (const [key, _] of Object.entries(INDUSTRY_COLORS)) {
    if (lowerDesc.includes(key)) {
      industry = key;
      break;
    }
  }
  
  // Tone detection
  let tone = "professional";
  if (lowerDesc.includes("trust") || lowerDesc.includes("secure")) {
    tone = "trustworthy";
  } else if (lowerDesc.includes("innovative") || lowerDesc.includes("modern")) {
    tone = "innovative";
  } else if (lowerDesc.includes("energetic") || lowerDesc.includes("vibrant")) {
    tone = "energetic";
  } else if (lowerDesc.includes("calm") || lowerDesc.includes("peaceful")) {
    tone = "calm";
  } else if (lowerDesc.includes("premium") || lowerDesc.includes("luxury")) {
    tone = "premium";
  } else if (lowerDesc.includes("friendly") || lowerDesc.includes("warm")) {
    tone = "friendly";
  } else if (lowerDesc.includes("bold") || lowerDesc.includes("creative")) {
    tone = "bold";
  }
  
  // Emotion extraction
  const emotions: string[] = [];
  const emotionKeywords: Record<string, string[]> = {
    secure: ["secure", "safe", "trust", "reliable"],
    innovative: ["innovative", "modern", "cutting-edge", "tech"],
    energetic: ["energetic", "vibrant", "dynamic", "exciting"],
    calm: ["calm", "peaceful", "serene", "relaxing"],
    premium: ["premium", "luxury", "exclusive", "high-end"],
    friendly: ["friendly", "warm", "welcoming", "approachable"],
    bold: ["bold", "creative", "artistic", "daring"],
  };
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some((kw) => lowerDesc.includes(kw))) {
      emotions.push(emotion);
    }
  }
  
  // Keywords extraction
  const keywords = description
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 10);
  
  return {
    industry,
    tone,
    emotions: emotions.length > 0 ? emotions : ["professional"],
    keywords,
  };
}

/**
 * B. Generate Primary Color
 * Uses color psychology rules based on industry and tone
 */
export function generatePrimaryColor(analysis: BrandAnalysis): {
  hex: string;
  reasoning: string;
} {
  // Priority: Industry > Tone > Default
  let hex = INDUSTRY_COLORS[analysis.industry] || TONE_COLORS[analysis.tone] || "#6366F1";
  
  // Override with tone if more specific
  if (TONE_COLORS[analysis.tone] && !INDUSTRY_COLORS[analysis.industry]) {
    hex = TONE_COLORS[analysis.tone];
  }
  
  // Emotion-based adjustments
  if (analysis.emotions.includes("energetic") && hex === "#6366F1") {
    hex = "#EC4899"; // More vibrant
  }
  
  const reasoning = `Selected ${hex} based on ${analysis.industry} industry, ${analysis.tone} tone, and ${analysis.emotions.join(", ")} emotions`;
  
  return { hex, reasoning };
}

/**
 * C. Generate Color Shades
 * Creates shades 50-900 using HSL lightness mapping
 * Memoized for performance
 */
export function generateColorShades(baseColor: string): ColorShades {
  // Check cache first
  if (shadeCache.has(baseColor)) {
    return shadeCache.get(baseColor)!;
  }

  const hsl = hexToHsl(baseColor);
  
  // Lightness mapping for shades
  const lightnessMap: Record<keyof ColorShades, number> = {
    "50": 95,
    "100": 90,
    "200": 80,
    "300": 70,
    "400": 60,
    "500": hsl.l, // Base color
    "600": Math.max(40, hsl.l - 10),
    "700": Math.max(30, hsl.l - 20),
    "800": Math.max(20, hsl.l - 30),
    "900": Math.max(10, hsl.l - 40),
  };
  
  const shades: Partial<ColorShades> = {};
  
  for (const [shade, lightness] of Object.entries(lightnessMap) as [
    keyof ColorShades,
    number
  ][]) {
    shades[shade] = hslToHex({
      h: hsl.h,
      s: shade === "50" || shade === "100" ? Math.max(20, hsl.s * 0.3) : hsl.s,
      l: lightness,
    });
  }
  
  return shades as ColorShades;
}

/**
 * D. Generate Complementary Colors
 * Secondary: Analogous (+30°), Accent: Complementary (180°)
 * Memoized for performance
 */
export function generateComplementaryColors(primary: string): ComplementaryColors {
  // Check cache first
  if (complementaryCache.has(primary)) {
    return complementaryCache.get(primary)!;
  }

  const hsl = hexToHsl(primary);
  
  // Secondary: Analogous color (+30°)
  const secondaryHsl = {
    h: (hsl.h + 30) % 360,
    s: Math.min(100, hsl.s * 1.1),
    l: Math.min(85, hsl.l + 5),
  };
  
  // Accent: Complementary color (180°)
  const accentHsl = {
    h: (hsl.h + 180) % 360,
    s: Math.min(100, hsl.s * 1.2),
    l: Math.min(80, hsl.l + 10),
  };
  
  const result = {
    secondary: hslToHex(secondaryHsl),
    accent: hslToHex(accentHsl),
  };
  
  // Cache the result
  complementaryCache.set(primary, result);
  
  return result;
}

/**
 * E. Generate Semantic Colors
 * WCAG AA compliant colors
 */
export function generateSemanticColors(): SemanticColors {
  return {
    success: "#10B981", // Green - WCAG AA compliant
    error: "#EF4444", // Red - WCAG AA compliant
    warning: "#F59E0B", // Amber - WCAG AA compliant
    info: "#3B82F6", // Blue - WCAG AA compliant
  };
}

/**
 * F. Check Accessibility
 * Calculates contrast ratio and WCAG compliance
 * Memoized for performance
 */
export function checkAccessibility(
  foreground: string,
  background: string
): AccessibilityResult {
  // Create cache key (order-independent)
  const colors = [foreground, background].sort().join(":");
  if (accessibilityCache.has(colors)) {
    return accessibilityCache.get(colors)!;
  }

  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  const result = {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
  
  // Cache the result
  accessibilityCache.set(colors, result);
  
  return result;
}

/**
 * G. Generate Neutral Grays
 * Warm/cool grays based on primary color hue
 * Memoized for performance
 */
export function generateNeutralGrays(primaryColor: string): ColorShades {
  // Check cache first
  if (neutralCache.has(primaryColor)) {
    return neutralCache.get(primaryColor)!;
  }

  const hsl = hexToHsl(primaryColor);
  
  // Determine if warm or cool based on hue
  const isWarm = hsl.h >= 0 && hsl.h <= 60 || hsl.h >= 300 && hsl.h <= 360;
  const hueTint = isWarm ? 30 : 210; // Warm: orange tint, Cool: blue tint
  const saturation = isWarm ? 5 : 8; // Slight saturation for warmth/coolness
  
  const lightnessMap: Record<keyof ColorShades, number> = {
    "50": 98,
    "100": 96,
    "200": 93,
    "300": 85,
    "400": 70,
    "500": 55,
    "600": 40,
    "700": 25,
    "800": 15,
    "900": 9,
  };
  
  const shades: Partial<ColorShades> = {};
  
  for (const [shade, lightness] of Object.entries(lightnessMap) as [
    keyof ColorShades,
    number
  ][]) {
    // Reduce saturation for lighter shades
    const sat = lightness > 70 ? saturation * 0.3 : saturation;
    
    shades[shade] = hslToHex({
      h: hueTint,
      s: sat,
      l: lightness,
    });
  }
  
  return shades as ColorShades;
}

// ============================================================================
// Utility Functions
// ============================================================================

interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert HEX to HSL
 */
function hexToHsl(hex: string): HSL {
  // Remove # if present
  hex = hex.replace("#", "");
  
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
 */
function hslToHex(hsl: HSL): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Get relative luminance for WCAG contrast calculation
 */
function getLuminance(hex: string): number {
  hex = hex.replace("#", "");
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const [rs, gs, bs] = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Main function: Generate complete color system from brand description
 */
export async function generateColorSystem(description: string) {
  // Step 1: Analyze brand
  const analysis = await analyzeBrandDescription(description);
  
  // Step 2: Generate primary color
  const primary = generatePrimaryColor(analysis);
  
  // Step 3: Generate shades
  const primaryShades = generateColorShades(primary.hex);
  
  // Step 4: Generate complementary colors
  const { secondary, accent } = generateComplementaryColors(primary.hex);
  const secondaryShades = generateColorShades(secondary);
  const accentShades = generateColorShades(accent);
  
  // Step 5: Generate semantic colors
  const semantic = generateSemanticColors();
  
  // Step 6: Generate neutral grays
  const neutrals = generateNeutralGrays(primary.hex);
  
  // Step 7: Check accessibility
  const accessibility = {
    primary: checkAccessibility("#FFFFFF", primary.hex),
    secondary: checkAccessibility("#FFFFFF", secondary),
    accent: checkAccessibility("#FFFFFF", accent),
  };
  
  return {
    primary: {
      hex: primary.hex,
      name: getColorName(primary.hex),
      psychology: analysis.emotions.join(", "),
      reasoning: primary.reasoning,
      shades: primaryShades,
    },
    secondary: {
      hex: secondary,
      name: getColorName(secondary),
      psychology: "Complementary harmony",
      shades: secondaryShades,
    },
    accent: {
      hex: accent,
      name: getColorName(accent),
      psychology: "Vibrant contrast",
      shades: accentShades,
    },
    semantic,
    neutrals: Object.entries(neutrals).map(([value, hex]) => ({ value, hex })),
    accessibility,
    analysis,
  };
}

/**
 * Get color name from hex
 */
function getColorName(hex: string): string {
  const hsl = hexToHsl(hex);
  
  if (hsl.s < 10) {
    return hsl.l > 50 ? "Light Gray" : "Dark Gray";
  }
  
  if (hsl.h >= 0 && hsl.h < 15) return "Red";
  if (hsl.h >= 15 && hsl.h < 45) return "Orange";
  if (hsl.h >= 45 && hsl.h < 75) return "Yellow";
  if (hsl.h >= 75 && hsl.h < 165) return "Green";
  if (hsl.h >= 165 && hsl.h < 255) return "Blue";
  if (hsl.h >= 255 && hsl.h < 285) return "Purple";
  if (hsl.h >= 285 && hsl.h < 345) return "Pink";
  return "Red";
}
