import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GenerationTier, TIER_CONFIGS } from '@/types/design-system'

// Re-export for convenience
export type { GenerationTier } from '@/types/design-system'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface DesignSystemPrompt {
  brandDescription: string
  industry?: string
  personality?: string
  preferences?: {
    colorScheme?: 'vibrant' | 'muted' | 'pastel' | 'dark' | 'light'
    modernityLevel?: 'traditional' | 'balanced' | 'modern' | 'futuristic'
    accessibility?: 'AA' | 'AAA'
  }
}

export interface GeneratedDesignSystem {
  colors: {
    primary: ColorPalette
    secondary: ColorPalette
    accent: ColorPalette
    semantic: {
      success: ColorPalette
      error: ColorPalette
      warning: ColorPalette
      info: ColorPalette
    }
    neutral: ColorPalette
  }
  typography: {
    fontPairs: FontPairing[]
    typeScale: TypeScale
    recommendations: string[]
  }
  metadata: {
    generatedAt: string
    aiProvider: string
    tier?: GenerationTier
    tokensUsed?: number
    brandSummary?: string
    creativeSeed?: number
  }
}

export interface ColorPalette {
  name: string
  main: string
  shades: {
    [key: string]: ColorShade
  }
  description?: string
}

export interface ColorShade {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  contrast: {
    white: number
    black: number
    accessible: 'AAA' | 'AA' | 'fail'
  }
}

export interface FontPairing {
  id: string
  name: string
  heading: {
    family: string
    weights: number[]
    fallback: string
  }
  body: {
    family: string
    weights: number[]
    fallback: string
  }
  description: string
  useCase: string
}

export interface TypeScale {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
  '8xl': string
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export async function generateDesignSystem(
  promptOrString: DesignSystemPrompt | string,
  tier: GenerationTier = 'basic'
): Promise<GeneratedDesignSystem> {
  // Handle both string and object inputs
  const prompt: DesignSystemPrompt = typeof promptOrString === 'string'
    ? { brandDescription: promptOrString }
    : promptOrString

  console.log('🎨 [AI GENERATOR] Starting design system generation...')
  console.log('🎨 [AI GENERATOR] Brand:', prompt.brandDescription)
  console.log(`🎨 [AI GENERATOR] Tier: ${tier.toUpperCase()}`)

  const provider = process.env.AI_PROVIDER || 'openai'
  console.log('🎨 [AI GENERATOR] Provider selected:', provider)

  if (!openai && !anthropic && !genAI) {
    throw new Error('No AI provider configured. Add GOOGLE_AI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to .env.local')
  }

  if (provider === 'gemini') {
    if (!genAI) {
      throw new Error('Gemini selected but GOOGLE_AI_API_KEY not configured')
    }
    console.log('🎨 [AI GENERATOR] Using Gemini 2.5 Flash (Google AI) - FREE!')
    return generateWithGemini(prompt)
  } else if (provider === 'anthropic') {
    if (!anthropic) {
      throw new Error('Anthropic selected but ANTHROPIC_API_KEY not configured')
    }
    console.log('🎨 [AI GENERATOR] Using Claude (Anthropic)')
    return generateWithClaude(prompt)
  } else if (provider === 'openai') {
    if (!openai) {
      throw new Error('OpenAI selected but OPENAI_API_KEY not configured')
    }
    console.log(`🎨 [AI GENERATOR] Using GPT-3.5 Turbo (OpenAI) - ${tier.toUpperCase()} tier`)
    return generateWithOpenAI(prompt, tier)
  } else {
    throw new Error(`Unknown AI provider: ${provider}`)
  }
}

// ============================================
// PROMPT GENERATION FUNCTIONS
// ============================================

function getBasicSystemPrompt(): string {
  return `You are a world-class design system architect and brand strategist.

CRITICAL: You MUST return ONLY valid JSON using this EXACT structure. ANY deviation will cause system failure.

MANDATORY JSON STRUCTURE - NO SUBSTITUTIONS ALLOWED:
{
  "colors": {
    "primary": { "name": "Color Name", "main": "#HEX", "shades": { "50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"} } },
    "secondary": { "name": "Color Name", "main": "#HEX", "shades": {...same 11 shades...} },
    "accent": { "name": "Color Name", "main": "#HEX", "shades": {...same 11 shades...} },
    "semantic": {
      "success": { "name": "Success", "main": "#HEX", "shades": {...same 11 shades...} },
      "error": { "name": "Error", "main": "#HEX", "shades": {...same 11 shades...} },
      "warning": { "name": "Warning", "main": "#HEX", "shades": {...same 11 shades...} },
      "info": { "name": "Info", "main": "#HEX", "shades": {...same 11 shades...} }
    },
    "neutral": { "name": "Neutral", "main": "#HEX", "shades": {...same 11 shades...} }
  },
  "typography": {
    "fontPairs": [
      { "id": "pair-1", "name": "Modern Professional", "heading": {"family": "Inter", "weights": [600, 700, 800], "fallback": "sans-serif"}, "body": {"family": "Inter", "weights": [400, 500, 600], "fallback": "sans-serif"}, "description": "Clean and modern", "useCase": "SaaS applications" }
    ],
    "typeScale": {
      "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem", 
      "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", 
      "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem"
    },
    "recommendations": ["Use heading font for titles", "Use body font for content"]
  }
}

KEY REQUIREMENTS - MEMORIZE THESE:
1. Top-level key MUST be "colors" (NOT "colorPalettes")
2. Typography key MUST be "typography" (NOT separate keys)
3. Font array MUST be "fontPairs" (NOT "fontPairings")
4. Type scale MUST be inside "typography" object
5. All shades MUST be objects with "hex" property: {"hex": "#HEX"}
6. ALL 11 shades required: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

COLOR CREATIVITY:
- AVOID generic colors: #3B82F6, #8B5CF6, #EC4899, #10B981
- Healthcare: Calming teals (#2D8B8B), soft corals (#FF8566)
- Gaming: Electric cyan (#00D9FF), neon magenta (#FF006E)
- Fintech: Trust navy (#1E3A5F), confidence teal (#008B8B)
- E-commerce: Vibrant orange (#FF6B35), energetic red (#E63946)

Generate creative, brand-appropriate colors while STRICTLY following the structure above.`
}

// Enterprise tier removed - Professional is now the premium tier

function getBasicPrompt(prompt: DesignSystemPrompt): string {
  const creativeSeed = Date.now() + Math.random()
  
  return `Brand: ${prompt.brandDescription}
${prompt.industry ? `Industry: ${prompt.industry}` : ''}
${prompt.personality ? `Personality: ${prompt.personality}` : ''}

Generate a design system using the EXACT JSON structure specified in the system prompt.

STRUCTURE CHECKLIST (verify before returning):
✓ Root has "colors" object (NOT "colorPalettes")
✓ Root has "typography" object (NOT separate keys)
✓ Typography contains "fontPairs" array (NOT "fontPairings")
✓ Typography contains "typeScale" object
✓ Typography contains "recommendations" array
✓ All color palettes have "shades" object with 11 entries (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
✓ Each shade is object with "hex" property: {"hex": "#HEX"}

CONTENT REQUIREMENTS:
- 8 color palettes (primary, secondary, accent, semantic: success/error/warning/info, neutral)
- 10 unique font pairings
- Complete type scale (xs to 8xl)
- Creative, brand-appropriate colors (avoid generic #3B82F6, #8B5CF6, #EC4899, #10B981)

CREATIVE SEED: ${creativeSeed}

Return ONLY the JSON object, no explanations.`
}

// ============================================
// OPENAI GENERATION
// ============================================

async function generateWithOpenAI(
  prompt: DesignSystemPrompt,
  tier: GenerationTier = 'basic'
): Promise<GeneratedDesignSystem> {
  if (!openai) {
    throw new Error('OpenAI not configured')
  }

  // Get prompts (same system prompt for both tiers, customized user prompt)
  const systemPrompt = getBasicSystemPrompt()
  const userPrompt = getBasicPrompt(prompt)

  const config = TIER_CONFIGS[tier]

  try {
    console.log(`🎨 [OPENAI] Generating ${tier.toUpperCase()} tier design system...`)
    console.log(`📊 [OPENAI] Expected: ${config.colorPalettes} palettes, ${config.fontPairings} fonts`)
    console.log(`⏱️  [OPENAI] Estimated time: ${config.estimatedTime}`)
    
    // Validate API key exists
    if (!openai) {
      throw new Error('OpenAI client not initialized - check OPENAI_API_KEY in .env.local')
    }
    
    // Token limits per tier (GPT-3.5-turbo max: 4096)
    const maxTokens = tier === 'professional' ? 3500 : 2500
    const temperature = tier === 'professional' ? 1.2 : 1.4
    
    console.log(`📊 [OPENAI] Max tokens: ${maxTokens}`)
    console.log(`📊 [OPENAI] Temperature: ${temperature}`)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature, // Tier-optimized for quality and completeness
      max_tokens: maxTokens, // GPT-3.5-turbo max is 4096
    })

    let content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content generated by AI')
    }

    console.log('✅ [OPENAI] Response received, parsing...')
    console.log('📝 [DEBUG] Raw content length:', content.length)
    console.log('📝 [DEBUG] First 500 chars:', content.substring(0, 500))
    
    // CRITICAL: Hard truncate if response is too large
    if (content.length > 20000) {
      console.warn(`⚠️  [OPENAI] Response WAY too large: ${content.length} chars. HARD TRUNCATING to 20000.`)
      // Find the last complete JSON object within 20000 chars
      const truncated = content.substring(0, 20000)
      const lastBrace = truncated.lastIndexOf('}')
      if (lastBrace > 1000) {
        content = truncated.substring(0, lastBrace + 1)
        console.log(`🔧 [TRUNCATE] Hard truncated to ${content.length} chars`)
      }
    }
    
    // Check if response is too large (indicates AI didn't follow instructions)
    if (content.length > 15000) {
      console.warn(`⚠️  [OPENAI] Response too large: ${content.length} chars. Expected < 15000.`)
      console.warn(`⚠️  [OPENAI] AI likely generated verbose descriptions.`)
    }
    
    // Clean and parse JSON with robust error handling
    let generated
    try {
      generated = JSON.parse(content)
    } catch (parseError) {
      console.error('❌ [OPENAI] Initial JSON parse failed:', parseError)
      console.error('📝 [DEBUG] Last 500 chars:', content.substring(content.length - 500))
      
      // Try to fix common JSON issues
      console.log('🔧 [OPENAI] Attempting JSON cleanup...')
      let cleanedContent = content
      
      // Remove any trailing incomplete text
      const lastBrace = content.lastIndexOf('}')
      if (lastBrace > 0 && lastBrace < content.length - 10) {
        console.log(`🔧 [CLEANUP] Truncating ${content.length - lastBrace - 1} trailing chars`)
        cleanedContent = content.substring(0, lastBrace + 1)
      }
      
      // Try parsing again
      try {
        generated = JSON.parse(cleanedContent)
        console.log('✅ [OPENAI] JSON parsed successfully after cleanup')
      } catch (secondError) {
        console.error('❌ [OPENAI] JSON parse failed even after cleanup')
        throw new Error(`Failed to parse AI response as JSON. The AI may have generated malformed output. ${parseError}`)
      }
    }
    
    console.log('📝 [DEBUG] Parsed structure keys:', Object.keys(generated))
    console.log('📝 [DEBUG] Has colors?', !!generated.colors)
    console.log('📝 [DEBUG] Has typography?', !!generated.typography)
    if (generated.colors) {
      console.log('📝 [DEBUG] Color keys:', Object.keys(generated.colors))
    }

    // VALIDATE AND NORMALIZE STRUCTURE (defense in depth)
    generated = validateAndNormalizeAIResponse(generated)

    // Enrich with calculated color data
    console.log('🎨 [OPENAI] Enriching color data with calculations...')
    const enriched = enrichColorData(generated)

    // Validation passed - both tiers work reliably

    console.log('✅ [OPENAI] Generation complete!')
    console.log(`📊 [STATS] Colors: ${countColors(enriched)}, Fonts: ${enriched.typography.fontPairs?.length || 0}`)

    return {
      ...enriched,
      metadata: {
        generatedAt: new Date().toISOString(),
        aiProvider: 'openai',
        tier,
        tokensUsed: completion.usage?.total_tokens,
        brandSummary: prompt.brandDescription,
      },
    }
  } catch (error) {
    console.error(`❌ [OPENAI] ${tier} generation failed:`, error)
    
    // Log detailed error information for debugging
    if (error && typeof error === 'object') {
      console.error('❌ [OPENAI] Error details:', {
        message: (error as any).message,
        status: (error as any).status,
        statusText: (error as any).statusText,
        code: (error as any).code,
        type: (error as any).type,
        param: (error as any).param,
        error: (error as any).error,
      })
      
      // Log response data if available
      if ((error as any).response) {
        console.error('❌ [OPENAI] Response data:', (error as any).response.data)
      }
      
      // Provide helpful error messages for common issues
      if ((error as any).code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check OPENAI_API_KEY in .env.local')
      }
      
      if ((error as any).code === 'insufficient_quota') {
        throw new Error('OpenAI quota exceeded. Please check your OpenAI account billing.')
      }
      
      if ((error as any).code === 'invalid_value' && (error as any).param === 'max_tokens') {
        throw new Error('Invalid max_tokens: GPT-3.5-turbo max is 4096. Using 3500 for professional, 2500 for basic.')
      }
      
      if ((error as any).status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please wait a moment and try again.')
      }
      
      if ((error as any).status >= 500) {
        throw new Error('OpenAI service temporarily unavailable. Please try again in a moment.')
      }
    }
    
    // Throw with actual error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`OpenAI Error (${tier} tier): ${errorMessage}`)
  }
}

// ============================================
// GEMINI GENERATION
// ============================================

async function generateWithGemini(
  prompt: DesignSystemPrompt
): Promise<GeneratedDesignSystem> {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash'
  })

  // Streamlined prompt - request only HEX (RGB/HSL calculated in code)
  const fullPrompt = `Generate a professional design system in valid JSON format.

BRAND: ${prompt.brandDescription}
${prompt.industry ? `INDUSTRY: ${prompt.industry}` : ''}
${prompt.personality ? `PERSONALITY: ${prompt.personality}` : ''}

REQUIREMENTS:
- Return ONLY valid JSON (no explanations, no markdown)
- Generate UNIQUE colors (avoid generic blues/purples)
- Include ALL 5 color palettes with ALL 11 shades each
- Include 3-5 font pairings
- Complete the ENTIRE response (do NOT truncate)

EXACT JSON STRUCTURE:
{
  "colors": {
    "primary": {
      "name": "Color Name",
      "main": "#HEX",
      "shades": {
        "50": {"hex": "#HEX"},
        "100": {"hex": "#HEX"},
        "200": {"hex": "#HEX"},
        "300": {"hex": "#HEX"},
        "400": {"hex": "#HEX"},
        "500": {"hex": "#HEX"},
        "600": {"hex": "#HEX"},
        "700": {"hex": "#HEX"},
        "800": {"hex": "#HEX"},
        "900": {"hex": "#HEX"},
        "950": {"hex": "#HEX"}
      }
    },
    "secondary": {"name": "Color Name", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}},
    "accent": {"name": "Color Name", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}},
    "semantic": {
      "success": {"name": "Success", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}},
      "error": {"name": "Error", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}},
      "warning": {"name": "Warning", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}},
      "info": {"name": "Info", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}}
    },
    "neutral": {"name": "Neutral", "main": "#HEX", "shades": {"50": {"hex": "#HEX"}, "100": {"hex": "#HEX"}, "200": {"hex": "#HEX"}, "300": {"hex": "#HEX"}, "400": {"hex": "#HEX"}, "500": {"hex": "#HEX"}, "600": {"hex": "#HEX"}, "700": {"hex": "#HEX"}, "800": {"hex": "#HEX"}, "900": {"hex": "#HEX"}, "950": {"hex": "#HEX"}}}
  },
  "typography": {
    "fontPairs": [
      {
        "id": "pair-1",
        "name": "Modern Professional",
        "heading": {"family": "Inter", "weights": [600, 700, 800]},
        "body": {"family": "Inter", "weights": [400, 500, 600]},
        "description": "Clean and modern",
        "useCase": "SaaS applications"
      }
    ],
    "typeScale": {
      "xs": "0.75rem", "sm": "0.875rem", "base": "1rem",
      "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem",
      "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem",
      "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem"
    },
    "recommendations": ["Use heading font for titles", "Use body font for content"]
  }
}

CRITICAL: Return complete JSON with ALL 11 shades for EACH of the 8 color palettes. Do NOT truncate!`

  try {
    console.log('🎨 [GEMINI] Sending request to Gemini 2.5 Flash...')
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: 0.9, // Lower for more reliable JSON
        maxOutputTokens: 8192, // Doubled to ensure complete response
      }
    })
    
    const response = result.response
    let text = response.text()
    
    console.log('✅ [GEMINI] Response received, parsing...')
    console.log('📝 [DEBUG] Raw response length:', text.length)
    console.log('📝 [DEBUG] First 200 chars:', text.substring(0, 200))
    
    // Aggressive cleanup for Gemini responses
    // Remove markdown code blocks
    text = text.replace(/```json\n?/gi, '')
    text = text.replace(/```\n?/g, '')
    
    // Remove any text before first {
    const firstBrace = text.indexOf('{')
    if (firstBrace > 0) {
      text = text.substring(firstBrace)
      console.log('🔧 [CLEANUP] Removed', firstBrace, 'chars before JSON')
    }
    
    // Remove any text after last }
    const lastBrace = text.lastIndexOf('}')
    if (lastBrace > 0 && lastBrace < text.length - 1) {
      text = text.substring(0, lastBrace + 1)
      console.log('🔧 [CLEANUP] Removed chars after JSON')
    }
    
    // Trim whitespace
    text = text.trim()
    
    console.log('📝 [DEBUG] Cleaned text length:', text.length)
    console.log('📝 [DEBUG] Cleaned first 200 chars:', text.substring(0, 200))
    
    // Try to parse
    let generated
    try {
      generated = JSON.parse(text)
      console.log('✅ [GEMINI] JSON parsed successfully')
    } catch (parseError) {
      console.error('❌ [GEMINI] JSON parse failed, attempting fix...')
      console.error('📝 [DEBUG] Parse error:', (parseError as Error).message)
      console.error('📝 [DEBUG] Failed text (first 500):', text.substring(0, 500))
      console.error('📝 [DEBUG] Failed text (last 500):', text.substring(Math.max(0, text.length - 500)))
      
      // Save full response for debugging
      console.error('📝 [DEBUG] Full response saved to console')
      
      throw new Error(`Failed to parse Gemini response as JSON: ${(parseError as Error).message}`)
    }

    // VALIDATE AND NORMALIZE STRUCTURE (defense in depth)
    generated = validateAndNormalizeAIResponse(generated)

    // Enrich with calculations
    console.log('🎨 [GEMINI] Enriching color data...')
    const enriched = enrichColorData(generated)

    console.log('✅ [GEMINI] Generation complete!')
    
    return {
      ...enriched,
      metadata: {
        generatedAt: new Date().toISOString(),
        aiProvider: 'gemini',
        brandSummary: prompt.brandDescription,
      },
    }
  } catch (error) {
    console.error('❌ [GEMINI] Generation failed:', error)
    
    if (error && typeof error === 'object') {
      console.error('❌ [GEMINI] Error details:', {
        message: (error as any).message,
        status: (error as any).status,
        code: (error as any).code,
      })
    }
    
    throw new Error(`Gemini Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ============================================
// CLAUDE GENERATION
// ============================================

async function generateWithClaude(
  prompt: DesignSystemPrompt
): Promise<GeneratedDesignSystem> {
  if (!anthropic) {
    throw new Error('Anthropic not configured')
  }

  const systemPrompt = `You are an expert design system architect. Generate a complete, production-ready design system.

Return ONLY valid JSON with this exact structure (no markdown, no explanations):
- Full 11-shade color palettes (50-950) for primary, secondary, accent, semantic (success/error/warning/info), and neutral colors
- 5-10 curated font pairings with real, widely available fonts
- Complete typography scale
- Professional descriptions and use cases

Be creative but professional. This will be used in production.`

  const userPrompt = buildUserPrompt(prompt)

  try {
    console.log('🎨 [CLAUDE] Sending request to Claude...')
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.9,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    console.log('✅ [CLAUDE] Response received, parsing...')
    
    // Claude might wrap JSON in code blocks, extract it
    let jsonText = content.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim()
    }
    
    const generated = JSON.parse(jsonText)

    // Enrich with calculated color data
    console.log('🎨 [CLAUDE] Enriching color data with calculations...')
    const enriched = enrichColorData(generated)

    return {
      ...enriched,
      metadata: {
        generatedAt: new Date().toISOString(),
        aiProvider: 'anthropic',
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        brandSummary: prompt.brandDescription,
      },
    }
  } catch (error) {
    console.error('❌ [CLAUDE] Generation failed:', error)
    
    // Log detailed error information for debugging
    if (error && typeof error === 'object') {
      console.error('❌ [CLAUDE] Error details:', {
        message: (error as any).message,
        status: (error as any).status,
        statusText: (error as any).statusText,
        code: (error as any).code,
        type: (error as any).type,
        error: (error as any).error,
      })
    }
    
    // Throw with actual error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Claude Error: ${errorMessage}`)
  }
}

// ============================================
// VALIDATION HELPERS
// ============================================

// Enterprise validation removed - only Basic and Professional tiers now

function countColors(system: any): number {
  let count = 0
  if (system.colors) {
    Object.values(system.colors).forEach((palette: any) => {
      if (palette && typeof palette === 'object') {
        if (palette.shades) {
          count += Object.keys(palette.shades).length
        }
        // Check for nested semantic colors
        if (palette.success || palette.error || palette.warning || palette.info) {
          Object.values(palette).forEach((semanticPalette: any) => {
            if (semanticPalette?.shades) {
              count += Object.keys(semanticPalette.shades).length
            }
          })
        }
      }
    })
  }
  return count
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function buildUserPrompt(prompt: DesignSystemPrompt): string {
  const parts = [
    `Generate a complete, professional design system for:`,
    ``,
    `BRAND: ${prompt.brandDescription}`,
  ]

  if (prompt.industry) {
    parts.push(`INDUSTRY: ${prompt.industry}`)
  }

  if (prompt.personality) {
    parts.push(`PERSONALITY: ${prompt.personality}`)
  }

  parts.push(``)
  parts.push(`REQUIREMENTS:`)

  if (prompt.preferences?.colorScheme) {
    parts.push(`- Color Scheme: ${prompt.preferences.colorScheme}`)
  }

  if (prompt.preferences?.modernityLevel) {
    parts.push(`- Design Style: ${prompt.preferences.modernityLevel}`)
  }

  const accessibility = prompt.preferences?.accessibility || 'AA'
  parts.push(`- Accessibility: WCAG ${accessibility} compliance required`)

  parts.push(``)
  parts.push(`DELIVERABLES:`)
  parts.push(`1. Full 11-shade color palettes (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) for:`)
  parts.push(`   - Primary color (brand color)`)
  parts.push(`   - Secondary color (complementary)`)
  parts.push(`   - Accent color (call-to-action)`)
  parts.push(`   - Semantic colors (success, error, warning, info)`)
  parts.push(`   - Neutral colors (gray scale)`)
  parts.push(``)
  parts.push(`2. 5-10 curated font pairings (heading + body combinations)`)
  parts.push(`   - Use real, widely available fonts (Google Fonts, system fonts)`)
  parts.push(`   - Provide multiple weight options`)
  parts.push(`   - Include descriptions and use cases`)
  parts.push(``)
  parts.push(`3. Complete typography scale (xs to 8xl)`)
  parts.push(``)
  parts.push(`4. Professional naming and descriptions for all elements`)
  parts.push(``)
  parts.push(`IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanations.`)

  return parts.join('\n')
}

/**
 * Validate and normalize AI response structure
 * Handles incorrect key names and transforms to expected structure
 */
function validateAndNormalizeAIResponse(response: any): any {
  console.log('🔍 [VALIDATION] Checking AI response structure...')
  
  // Handle incorrect top-level keys: colorPalettes → colors
  if (response.colorPalettes && !response.colors) {
    console.log('🔧 [TRANSFORM] Converting colorPalettes → colors')
    response.colors = response.colorPalettes
    delete response.colorPalettes
  }
  
  // Handle typography structure issues
  if (response.fontPairings && !response.typography) {
    console.log('🔧 [TRANSFORM] Creating typography object from separate keys')
    response.typography = {
      fontPairs: response.fontPairings,
      typeScale: response.typeScale || {},
      recommendations: response.recommendations || []
    }
    delete response.fontPairings
    delete response.typeScale
    delete response.recommendations
  }
  
  // Handle fontPairings vs fontPairs inside typography
  if (response.typography?.fontPairings && !response.typography?.fontPairs) {
    console.log('🔧 [TRANSFORM] Converting fontPairings → fontPairs')
    response.typography.fontPairs = response.typography.fontPairings
    delete response.typography.fontPairings
  }
  
  // Validate required structure exists
  if (!response.colors) {
    console.error('❌ [VALIDATION] Missing "colors" object')
    throw new Error('AI response missing "colors" object. Keys present: ' + Object.keys(response).join(', '))
  }
  
  if (!response.colors.primary) {
    console.error('❌ [VALIDATION] Missing "colors.primary"')
    console.error('📝 [DEBUG] Available color keys:', Object.keys(response.colors || {}).join(', '))
    throw new Error('AI response missing "colors.primary"')
  }
  
  if (!response.typography) {
    console.error('❌ [VALIDATION] Missing "typography" object')
    throw new Error('AI response missing "typography" object. Keys present: ' + Object.keys(response).join(', '))
  }
  
  if (!response.typography.fontPairs || !Array.isArray(response.typography.fontPairs)) {
    console.error('❌ [VALIDATION] Missing or invalid "typography.fontPairs" array')
    console.error('📝 [DEBUG] Typography keys:', Object.keys(response.typography || {}).join(', '))
    throw new Error('AI response missing "typography.fontPairs" array')
  }
  
  console.log('✅ [VALIDATION] Structure validated and normalized')
  console.log('📊 [VALIDATION] Color palettes:', Object.keys(response.colors).length)
  console.log('📊 [VALIDATION] Font pairs:', response.typography.fontPairs.length)
  
  return response
}

function enrichColorData(generated: any): any {
  console.log('🎨 [ENRICH] Processing color data...')
  
  // Process all color palettes
  const colorKeys = ['primary', 'secondary', 'accent', 'neutral']
  const semanticKeys = ['success', 'error', 'warning', 'info']

  colorKeys.forEach((colorKey) => {
    if (generated.colors[colorKey]?.shades) {
      generated.colors[colorKey].shades = enrichShades(
        generated.colors[colorKey].shades
      )
    }
  })

  // Process semantic colors
  if (generated.colors.semantic) {
    semanticKeys.forEach((semanticKey) => {
      if (generated.colors.semantic[semanticKey]?.shades) {
        generated.colors.semantic[semanticKey].shades = enrichShades(
          generated.colors.semantic[semanticKey].shades
        )
      }
    })
  }

  return generated
}

function enrichShades(shades: any): any {
  const enrichedShades: any = {}

  Object.keys(shades).forEach((shade) => {
    const hexValue = typeof shades[shade] === 'string' ? shades[shade] : shades[shade].hex
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`

    enrichedShades[shade] = {
      hex,
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex),
      contrast: calculateContrast(hex),
    }
  })

  return enrichedShades
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex)
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function calculateContrast(hex: string): {
  white: number
  black: number
  accessible: 'AAA' | 'AA' | 'fail'
} {
  const rgb = hexToRgb(hex)
  
  // Calculate relative luminance
  const luminance =
    (0.2126 * linearize(rgb.r) +
      0.7152 * linearize(rgb.g) +
      0.0722 * linearize(rgb.b))

  const contrastWithWhite = (1 + 0.05) / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / (0 + 0.05)

  // Determine accessibility level (using higher contrast)
  const maxContrast = Math.max(contrastWithWhite, contrastWithBlack)
  let accessible: 'AAA' | 'AA' | 'fail' = 'fail'
  if (maxContrast >= 7) accessible = 'AAA'
  else if (maxContrast >= 4.5) accessible = 'AA'

  return {
    white: Math.round(contrastWithWhite * 100) / 100,
    black: Math.round(contrastWithBlack * 100) / 100,
    accessible,
  }
}

function linearize(value: number): number {
  const v = value / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
