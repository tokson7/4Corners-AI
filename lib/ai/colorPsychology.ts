/**
 * Color Psychology Database
 * 
 * Maps colors to emotions, industries, and personality traits based on
 * established color psychology principles. Used for AI-powered color
 * recommendations in design system generation.
 */

/**
 * Color information with psychological associations
 */
export interface ColorInfo {
  /** Primary color in HEX format */
  primaryColor: string;
  /** Emotional associations */
  emotions: string[];
  /** Industries this color is suitable for */
  industries: string[];
  /** Reasoning for color choice */
  reasoning: string;
  /** Personality traits associated with the color */
  personality: string;
}

/**
 * Color psychology database
 * 
 * Based on established color psychology research:
 * - Blue: Trust, stability, professionalism
 * - Indigo: Innovation, technology, sophistication
 * - Green: Growth, nature, sustainability
 * - Purple: Creativity, luxury, wisdom
 * - Orange: Energy, enthusiasm, warmth
 * - Red: Passion, urgency, excitement
 * - Teal: Balance, healing, tranquility
 * - Pink: Playfulness, youth, creativity
 */
export const colorPsychology: Record<string, ColorInfo> = {
  blue: {
    primaryColor: '#3B82F6',
    emotions: ['trust', 'calm', 'professional', 'secure', 'reliable', 'stable'],
    industries: ['finance', 'technology', 'healthcare', 'corporate'],
    reasoning: 'Blue conveys trust, stability, and professionalism. It is the most universally trusted color and is associated with reliability, security, and corporate responsibility.',
    personality: 'reliable, secure, innovative, trustworthy, professional',
  },
  indigo: {
    primaryColor: '#6366F1',
    emotions: ['innovation', 'modern', 'forward-thinking', 'sophisticated', 'tech-savvy'],
    industries: ['technology', 'startups', 'software'],
    reasoning: 'Indigo represents cutting-edge technology and innovation. It combines the trust of blue with the creativity of purple, making it ideal for tech companies and startups.',
    personality: 'tech-savvy, modern, sophisticated, innovative, forward-thinking',
  },
  green: {
    primaryColor: '#10B981',
    emotions: ['growth', 'health', 'sustainability', 'fresh', 'natural', 'balanced'],
    industries: ['eco', 'food', 'wellness', 'nature'],
    reasoning: 'Green symbolizes growth, nature, and sustainability. It is associated with health, freshness, and environmental consciousness, making it perfect for eco-friendly and wellness brands.',
    personality: 'natural, fresh, balanced, eco-conscious, healthy, sustainable',
  },
  purple: {
    primaryColor: '#8B5CF6',
    emotions: ['creative', 'luxury', 'wisdom', 'premium', 'imaginative', 'artistic'],
    industries: ['creative', 'beauty', 'education', 'luxury'],
    reasoning: 'Purple evokes creativity, luxury, and sophistication. Historically associated with royalty and wisdom, it appeals to creative industries and premium brands.',
    personality: 'imaginative, premium, artistic, creative, sophisticated, wise',
  },
  orange: {
    primaryColor: '#F97316',
    emotions: ['energy', 'enthusiasm', 'friendly', 'bold', 'warm', 'adventurous'],
    industries: ['food', 'fitness', 'entertainment', 'retail'],
    reasoning: 'Orange brings energy, enthusiasm, and warmth. It stimulates appetite and creates excitement, making it ideal for food, fitness, and entertainment brands.',
    personality: 'energetic, friendly, adventurous, bold, warm, enthusiastic',
  },
  red: {
    primaryColor: '#EF4444',
    emotions: ['passion', 'urgency', 'bold', 'exciting', 'dynamic', 'powerful'],
    industries: ['food', 'entertainment', 'sports', 'emergency'],
    reasoning: 'Red creates urgency, passion, and excitement. It increases heart rate and appetite, making it powerful for food brands, entertainment, and calls to action.',
    personality: 'bold, passionate, dynamic, exciting, powerful, urgent',
  },
  teal: {
    primaryColor: '#14B8A6',
    emotions: ['balance', 'calm', 'healing', 'modern', 'tranquil', 'refreshing'],
    industries: ['healthcare', 'wellness', 'spa', 'meditation'],
    reasoning: 'Teal combines the trust of blue with the growth of green. It represents balance, healing, and tranquility, perfect for healthcare and wellness industries.',
    personality: 'balanced, healing, tranquil, modern, refreshing, calm',
  },
  pink: {
    primaryColor: '#EC4899',
    emotions: ['playful', 'youthful', 'creative', 'modern', 'vibrant', 'compassionate'],
    industries: ['beauty', 'fashion', 'lifestyle', 'creative'],
    reasoning: 'Pink represents creativity, youth, and modern appeal. It is associated with compassion, playfulness, and femininity, making it ideal for beauty and fashion brands.',
    personality: 'playful, youthful, vibrant, creative, modern, compassionate',
  },
};

/**
 * Industry to color mapping
 * 
 * Maps industry names to their recommended colors based on
 * color psychology and industry best practices.
 */
const industryColorMap: Record<string, string> = {
  // Finance & Corporate
  finance: 'blue',
  banking: 'blue',
  corporate: 'blue',
  business: 'blue',
  
  // Technology
  technology: 'indigo',
  tech: 'indigo',
  software: 'indigo',
  startup: 'indigo',
  startups: 'indigo',
  saas: 'indigo',
  it: 'indigo',
  
  // Healthcare & Wellness
  healthcare: 'teal',
  health: 'teal',
  wellness: 'teal',
  medical: 'teal',
  spa: 'teal',
  meditation: 'teal',
  therapy: 'teal',
  
  // Eco & Nature
  eco: 'green',
  environmental: 'green',
  sustainability: 'green',
  nature: 'green',
  organic: 'green',
  
  // Food & Beverage
  food: 'orange',
  restaurant: 'orange',
  cafe: 'orange',
  beverage: 'orange',
  dining: 'orange',
  
  // Creative & Education
  creative: 'purple',
  design: 'purple',
  education: 'purple',
  learning: 'purple',
  luxury: 'purple',
  premium: 'purple',
  
  // Beauty & Fashion
  beauty: 'pink',
  fashion: 'pink',
  cosmetics: 'pink',
  lifestyle: 'pink',
  style: 'pink',
  
  // Fitness & Sports
  fitness: 'orange',
  gym: 'orange',
  sports: 'red',
  athletic: 'red',
  
  // Entertainment
  entertainment: 'orange',
  media: 'orange',
  gaming: 'red',
  
  // Retail
  retail: 'orange',
  ecommerce: 'orange',
  shopping: 'orange',
};

/**
 * Get recommended color for an industry
 * 
 * Uses color psychology principles to recommend the most appropriate
 * color for a given industry. Falls back to blue (most trusted color)
 * if industry is not found.
 * 
 * @param industry - Industry name (case-insensitive)
 * @returns ColorInfo object with color recommendations
 * 
 * @example
 * getColorForIndustry('finance') // Returns blue color info
 * getColorForIndustry('technology') // Returns indigo color info
 * getColorForIndustry('unknown') // Returns blue (default)
 */
export function getColorForIndustry(industry: string): ColorInfo {
  if (!industry || typeof industry !== 'string') {
    return colorPsychology.blue;
  }
  
  const normalizedIndustry = industry.toLowerCase().trim();
  
  // Direct lookup in industry map
  const colorKey = industryColorMap[normalizedIndustry];
  
  if (colorKey && colorPsychology[colorKey]) {
    return colorPsychology[colorKey];
  }
  
  // Fallback: search for partial matches
  for (const [key, color] of Object.entries(industryColorMap)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
      return colorPsychology[color];
    }
  }
  
  // Default to blue (most trusted and versatile color)
  return colorPsychology.blue;
}

/**
 * Get all available colors
 * 
 * @returns Array of all ColorInfo objects
 */
export function getAllColors(): ColorInfo[] {
  return Object.values(colorPsychology);
}

/**
 * Get color by name
 * 
 * @param colorName - Color name (e.g., 'blue', 'purple')
 * @returns ColorInfo or undefined if not found
 */
export function getColorByName(colorName: string): ColorInfo | undefined {
  return colorPsychology[colorName.toLowerCase()];
}
