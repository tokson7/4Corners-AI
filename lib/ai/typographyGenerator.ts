/**
 * Typography Generation System
 * 
 * Production-grade typography generator with intelligent font pairing.
 * Uses rule-based font selection with personality matching for consistent,
 * beautiful typography systems.
 * 
 * Features:
 * - Personality-based font pairing
 * - Modular type scale (1.25 ratio)
 * - Google Fonts integration
 * - Industry-specific recommendations
 */

/**
 * Font pairing interface
 */
export interface FontPairing {
  heading: string;
  body: string;
  mono: string;
}

/**
 * Type scale interface with standard sizes
 */
export interface TypeScale {
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
}

/**
 * Complete typography system interface
 */
export interface TypographySystem {
  fonts: FontPairing;
  scale: TypeScale;
  weights: Record<string, number>;
  lineHeights: Record<string, number>;
  letterSpacing: Record<string, string>;
  googleFontsUrl: string;
  personality: string;
}

/**
 * Font pairing option
 */
interface FontPairingOption {
  heading: string;
  body: string;
  description?: string;
}

/**
 * Curated font pairing database organized by personality
 * 
 * Each pairing is carefully selected for:
 * - Visual harmony
 * - Contrast between heading and body
 * - Readability at various sizes
 * - Google Fonts availability
 */
const FONT_PAIRINGS: Record<string, FontPairingOption[]> = {
  corporate: [
    {
      heading: 'Playfair Display',
      body: 'Inter',
      description: 'Classic elegance with modern clarity',
    },
    {
      heading: 'Merriweather',
      body: 'Open Sans',
      description: 'Professional and highly readable',
    },
    {
      heading: 'Lora',
      body: 'Roboto',
      description: 'Traditional serif with clean sans-serif',
    },
    {
      heading: 'Source Serif Pro',
      body: 'Source Sans Pro',
      description: 'Harmonious serif-sans pair',
    },
  ],
  modern: [
    {
      heading: 'Space Grotesk',
      body: 'Inter',
      description: 'Contemporary geometric with versatile sans',
    },
    {
      heading: 'Poppins',
      body: 'DM Sans',
      description: 'Friendly geometric with clean body text',
    },
    {
      heading: 'Montserrat',
      body: 'Work Sans',
      description: 'Urban sans-serif pairing',
    },
    {
      heading: 'Plus Jakarta Sans',
      body: 'Inter',
      description: 'Modern rounded with classic readability',
    },
  ],
  creative: [
    {
      heading: 'Bebas Neue',
      body: 'Lato',
      description: 'Bold condensed with friendly sans',
    },
    {
      heading: 'Raleway',
      body: 'Nunito',
      description: 'Elegant thin with rounded body',
    },
    {
      heading: 'Righteous',
      body: 'Open Sans',
      description: 'Distinctive display with neutral body',
    },
    {
      heading: 'Fredoka',
      body: 'Quicksand',
      description: 'Playful rounded pairing',
    },
  ],
  elegant: [
    {
      heading: 'Cormorant Garamond',
      body: 'Crimson Text',
      description: 'Refined serif harmony',
    },
    {
      heading: 'Playfair Display',
      body: 'Lora',
      description: 'Luxurious double-serif pairing',
    },
    {
      heading: 'Libre Baskerville',
      body: 'Crimson Pro',
      description: 'Classic book typography',
    },
    {
      heading: 'Cinzel',
      body: 'Fauna One',
      description: 'Sophisticated and timeless',
    },
  ],
  technical: [
    {
      heading: 'IBM Plex Sans',
      body: 'Inter',
      description: 'Technical precision with clarity',
    },
    {
      heading: 'Roboto',
      body: 'Roboto',
      description: 'Unified system font approach',
    },
    {
      heading: 'Inter',
      body: 'Inter',
      description: 'Single-font system for consistency',
    },
    {
      heading: 'Red Hat Display',
      body: 'Red Hat Text',
      description: 'Purpose-built display and text pair',
    },
  ],
  minimal: [
    {
      heading: 'Inter',
      body: 'Inter',
      description: 'Clean single-font system',
    },
    {
      heading: 'DM Sans',
      body: 'DM Sans',
      description: 'Geometric minimalism',
    },
    {
      heading: 'Work Sans',
      body: 'Work Sans',
      description: 'Versatile and understated',
    },
  ],
  playful: [
    {
      heading: 'Quicksand',
      body: 'Nunito',
      description: 'Friendly rounded pairing',
    },
    {
      heading: 'Fredoka',
      body: 'Varela Round',
      description: 'Fun and approachable',
    },
    {
      heading: 'Comfortaa',
      body: 'Open Sans',
      description: 'Soft geometric with neutral body',
    },
  ],
};

/**
 * Industry to personality mapping
 * Suggests personality based on industry if not explicitly provided
 */
const INDUSTRY_PERSONALITY_MAP: Record<string, string> = {
  finance: 'corporate',
  banking: 'corporate',
  legal: 'corporate',
  insurance: 'corporate',
  consulting: 'corporate',
  
  technology: 'modern',
  software: 'modern',
  saas: 'modern',
  startup: 'modern',
  fintech: 'modern',
  
  design: 'creative',
  marketing: 'creative',
  advertising: 'creative',
  media: 'creative',
  entertainment: 'creative',
  
  fashion: 'elegant',
  luxury: 'elegant',
  beauty: 'elegant',
  jewelry: 'elegant',
  hospitality: 'elegant',
  
  engineering: 'technical',
  science: 'technical',
  research: 'technical',
  developer: 'technical',
  analytics: 'technical',
  
  lifestyle: 'playful',
  food: 'playful',
  beverage: 'playful',
  gaming: 'playful',
  
  wellness: 'minimal',
  healthcare: 'minimal',
  medical: 'minimal',
};

/**
 * Monospace font options
 * Used for code blocks and technical content
 */
const MONO_FONTS = [
  'Fira Code',
  'JetBrains Mono',
  'Source Code Pro',
  'IBM Plex Mono',
  'Roboto Mono',
];

/**
 * Select font pairing based on personality
 * 
 * @param personality - Brand personality (corporate, modern, creative, etc.)
 * @param industry - Optional industry for better personality inference
 * @returns Font pairing object
 */
function selectFontPairing(personality: string, industry?: string): FontPairing {
  // Normalize personality
  let normalizedPersonality = personality.toLowerCase().trim();
  
  // If personality not recognized, try to infer from industry
  if (!FONT_PAIRINGS[normalizedPersonality] && industry) {
    const inferredPersonality = INDUSTRY_PERSONALITY_MAP[industry.toLowerCase().trim()];
    if (inferredPersonality) {
      normalizedPersonality = inferredPersonality;
    }
  }
  
  // Default to modern if still not recognized
  if (!FONT_PAIRINGS[normalizedPersonality]) {
    normalizedPersonality = 'modern';
  }
  
  // Select random pairing from the personality category
  const pairings = FONT_PAIRINGS[normalizedPersonality];
  const selectedPairing = pairings[Math.floor(Math.random() * pairings.length)];
  
  // Select random monospace font
  const monoFont = MONO_FONTS[Math.floor(Math.random() * MONO_FONTS.length)];
  
  return {
    heading: selectedPairing.heading,
    body: selectedPairing.body,
    mono: monoFont,
  };
}

/**
 * Generate modular type scale
 * 
 * Uses Major Third ratio (1.25) for harmonious progression.
 * Base size is 16px (1rem) - web standard.
 * 
 * Formula: size = base × ratio^n
 * 
 * @returns Type scale object with all sizes in rem units
 */
function generateTypeScale(): TypeScale {
  const baseSize = 16; // pixels
  const ratio = 1.25; // Major Third
  
  // Calculate sizes
  const sizes = {
    xs: baseSize * Math.pow(ratio, -2), // 10.24px ≈ 0.64rem
    sm: baseSize * Math.pow(ratio, -1), // 12.8px = 0.8rem
    base: baseSize, // 16px = 1rem
    lg: baseSize * ratio, // 20px = 1.25rem
    xl: baseSize * Math.pow(ratio, 2), // 25px = 1.5625rem
    '2xl': baseSize * Math.pow(ratio, 3), // 31.25px ≈ 1.953rem
    '3xl': baseSize * Math.pow(ratio, 4), // 39.06px ≈ 2.441rem
    '4xl': baseSize * Math.pow(ratio, 5), // 48.83px ≈ 3.052rem
    '5xl': baseSize * Math.pow(ratio, 6), // 61.04px ≈ 3.815rem
    '6xl': baseSize * Math.pow(ratio, 7), // 76.29px ≈ 4.768rem
  };
  
  // Convert to rem and round to 3 decimal places
  return {
    xs: `${(sizes.xs / 16).toFixed(3)}rem`,
    sm: `${(sizes.sm / 16).toFixed(3)}rem`,
    base: `${(sizes.base / 16).toFixed(3)}rem`,
    lg: `${(sizes.lg / 16).toFixed(3)}rem`,
    xl: `${(sizes.xl / 16).toFixed(3)}rem`,
    '2xl': `${(sizes['2xl'] / 16).toFixed(3)}rem`,
    '3xl': `${(sizes['3xl'] / 16).toFixed(3)}rem`,
    '4xl': `${(sizes['4xl'] / 16).toFixed(3)}rem`,
    '5xl': `${(sizes['5xl'] / 16).toFixed(3)}rem`,
    '6xl': `${(sizes['6xl'] / 16).toFixed(3)}rem`,
  };
}

/**
 * Generate Google Fonts URL for font pairing
 * 
 * Includes multiple weights for flexibility:
 * - Body text: 400, 500, 600
 * - Headings: 600, 700, 800
 * 
 * @param fonts - Font pairing object
 * @returns Google Fonts API URL
 */
function getGoogleFontsUrl(fonts: FontPairing): string {
  const baseUrl = 'https://fonts.googleapis.com/css2';
  
  // Font families with weights
  const families: string[] = [];
  
  // Heading font (bold weights)
  families.push(
    `family=${encodeURIComponent(fonts.heading)}:wght@600;700;800`
  );
  
  // Body font (regular to semi-bold)
  // Only add if different from heading
  if (fonts.body !== fonts.heading) {
    families.push(
      `family=${encodeURIComponent(fonts.body)}:wght@400;500;600`
    );
  } else {
    // Same font for heading and body, combine weights
    families[0] = `family=${encodeURIComponent(fonts.heading)}:wght@400;500;600;700;800`;
  }
  
  // Monospace font
  families.push(
    `family=${encodeURIComponent(fonts.mono)}:wght@400;500;600`
  );
  
  // Combine with display=swap for better performance
  return `${baseUrl}?${families.join('&')}&display=swap`;
}

/**
 * Get standard font weights
 * 
 * @returns Font weight mapping
 */
function getStandardWeights(): Record<string, number> {
  return {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };
}

/**
 * Get standard line heights
 * 
 * Optimized for readability:
 * - Tight: For headings
 * - Normal: For body text
 * - Relaxed: For long-form content
 * 
 * @returns Line height mapping
 */
function getStandardLineHeights(): Record<string, number> {
  return {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  };
}

/**
 * Get standard letter spacing
 * 
 * @returns Letter spacing mapping in em units
 */
function getStandardLetterSpacing(): Record<string, string> {
  return {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  };
}

/**
 * Generate complete typography system
 * 
 * Creates a production-ready typography system with:
 * - Personality-matched font pairing
 * - Modular type scale
 * - Standard weights, line heights, and letter spacing
 * - Google Fonts integration URL
 * 
 * @param brandPersonality - Brand personality (corporate, modern, creative, elegant, technical, minimal, playful)
 * @param industry - Optional industry for better personality inference
 * @returns Complete typography system
 * 
 * @example
 * ```typescript
 * const typography = generateTypographySystem('modern', 'technology');
 * console.log(typography.fonts.heading); // "Space Grotesk"
 * console.log(typography.fonts.body); // "Inter"
 * console.log(typography.scale.base); // "1.000rem"
 * ```
 */
export function generateTypographySystem(
  brandPersonality: string,
  industry?: string
): TypographySystem {
  // Select fonts based on personality and industry
  const fonts = selectFontPairing(brandPersonality, industry);
  
  // Generate modular type scale
  const scale = generateTypeScale();
  
  // Get standard values
  const weights = getStandardWeights();
  const lineHeights = getStandardLineHeights();
  const letterSpacing = getStandardLetterSpacing();
  
  // Generate Google Fonts URL
  const googleFontsUrl = getGoogleFontsUrl(fonts);
  
  // Determine final personality used
  let normalizedPersonality = brandPersonality.toLowerCase().trim();
  if (!FONT_PAIRINGS[normalizedPersonality] && industry) {
    normalizedPersonality = INDUSTRY_PERSONALITY_MAP[industry.toLowerCase().trim()] || 'modern';
  }
  if (!FONT_PAIRINGS[normalizedPersonality]) {
    normalizedPersonality = 'modern';
  }
  
  return {
    fonts,
    scale,
    weights,
    lineHeights,
    letterSpacing,
    googleFontsUrl,
    personality: normalizedPersonality,
  };
}

/**
 * Get available personality categories
 * 
 * @returns Array of available personality names
 */
export function getAvailablePersonalities(): string[] {
  return Object.keys(FONT_PAIRINGS);
}

/**
 * Get font pairing description
 * 
 * @param personality - Brand personality
 * @returns Description of font pairings for this personality
 */
export function getPersonalityDescription(personality: string): string {
  const normalizedPersonality = personality.toLowerCase().trim();
  
  const descriptions: Record<string, string> = {
    corporate: 'Professional, trustworthy, and established. Perfect for finance, legal, and traditional business.',
    modern: 'Contemporary, clean, and forward-thinking. Ideal for tech, startups, and innovative brands.',
    creative: 'Bold, unique, and expressive. Great for design agencies, studios, and artistic ventures.',
    elegant: 'Refined, luxurious, and sophisticated. Best for fashion, beauty, and premium brands.',
    technical: 'Precise, systematic, and functional. Suited for engineering, science, and developer tools.',
    minimal: 'Simple, clean, and focused. Perfect for wellness, healthcare, and content-first products.',
    playful: 'Fun, friendly, and approachable. Ideal for lifestyle, food, and consumer brands.',
  };
  
  return descriptions[normalizedPersonality] || descriptions.modern;
}

/**
 * Convert type scale to Tailwind CSS configuration
 * 
 * Useful for integrating with Tailwind's theme configuration.
 * 
 * @param scale - Type scale object
 * @returns Tailwind-compatible fontSize configuration
 */
export function convertToTailwindConfig(scale: TypeScale): Record<string, string> {
  return {
    xs: scale.xs,
    sm: scale.sm,
    base: scale.base,
    lg: scale.lg,
    xl: scale.xl,
    '2xl': scale['2xl'],
    '3xl': scale['3xl'],
    '4xl': scale['4xl'],
    '5xl': scale['5xl'],
    '6xl': scale['6xl'],
  };
}
