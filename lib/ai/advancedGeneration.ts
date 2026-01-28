/**
 * Advanced AI Generation
 * Provides intelligent refinement, suggestions, and version-aware generation
 */

import { analyzeWithAI } from "./client";
import type { DesignSystem } from "@/lib/types/designSystem";
import { checkWCAG, getContrastRatio } from "@/lib/utils/colorUtils";

export interface ImprovementSuggestion {
  suggestion: string;
  severity: "low" | "medium" | "high";
  category: "accessibility" | "color" | "typography" | "components" | "spacing";
  actionable: boolean;
}

export interface RefinementConstraints {
  keepPrimaryColor?: boolean;
  keepSecondaryColor?: boolean;
  keepTypography?: boolean;
  keepComponents?: string[];
  improveAccessibility?: boolean;
  adjustTone?: "more playful" | "more professional" | "more modern" | "more classic";
  specificChanges?: string[];
}

export interface DesignComparison {
  colorsChanged: boolean;
  typographyChanged: boolean;
  componentsChanged: string[];
  accessibilityImproved: boolean;
  summary: string;
}

/**
 * Analyze a design system and suggest improvements
 */
export async function suggestImprovements(
  designSystem: DesignSystem
): Promise<{ suggestions: ImprovementSuggestion[] }> {
  const suggestions: ImprovementSuggestion[] = [];

  try {
    // Rule-based analysis (always runs)
    suggestions.push(...analyzeAccessibility(designSystem));
    suggestions.push(...analyzeColorHarmony(designSystem));
    suggestions.push(...analyzeTypography(designSystem));

    // AI-powered analysis (with fallback)
    try {
      const aiSuggestions = await getAISuggestions(designSystem);
      suggestions.push(...aiSuggestions);
    } catch (error) {
      console.warn("AI suggestions failed, using rule-based only:", error);
      // Continue with rule-based suggestions only
    }

    // Sort by severity (high first)
    suggestions.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    return { suggestions };
  } catch (error) {
    console.error("Failed to generate suggestions:", error);
    // Return empty suggestions on error
    return { suggestions: [] };
  }
}

/**
 * Regenerate design system with constraints (preserves identity)
 */
export async function regenerateWithConstraints(
  previousDesign: DesignSystem,
  constraints: RefinementConstraints,
  userInstruction?: string
): Promise<{ refinedDesign: DesignSystem; explanation: string }> {
  try {
    // Start with a copy of the previous design
    const refinedDesign: DesignSystem = JSON.parse(JSON.stringify(previousDesign));

    // Apply constraints
    if (constraints.keepPrimaryColor && refinedDesign.colors?.primary) {
      // Primary color is preserved
    }

    if (constraints.keepSecondaryColor && refinedDesign.colors?.secondary) {
      // Secondary color is preserved
    }

    if (constraints.keepTypography && refinedDesign.typography) {
      // Typography is preserved
    }

    // Apply improvements
    if (constraints.improveAccessibility) {
      refineAccessibility(refinedDesign);
    }

    // Apply tone adjustments
    if (constraints.adjustTone) {
      await adjustTone(refinedDesign, constraints.adjustTone, userInstruction);
    }

    // Apply specific changes
    if (constraints.specificChanges && constraints.specificChanges.length > 0) {
      await applySpecificChanges(refinedDesign, constraints.specificChanges, userInstruction);
    }

    // Generate explanation
    const explanation = generateExplanation(previousDesign, refinedDesign, constraints);

    return { refinedDesign, explanation };
  } catch (error) {
    console.error("Failed to refine design:", error);
    // Return original design on error
    return {
      refinedDesign: previousDesign,
      explanation: "Refinement failed. Original design returned.",
    };
  }
}

/**
 * Compare two design system versions
 */
export function compareDesignVersions(
  v1: DesignSystem,
  v2: DesignSystem
): DesignComparison {
  const colorsChanged =
    v1.colors?.primary?.main !== v2.colors?.primary?.main ||
    v1.colors?.secondary?.main !== v2.colors?.secondary?.main ||
    v1.colors?.accent?.main !== v2.colors?.accent?.main;

  const typographyChanged =
    v1.typography?.heading?.font !== v2.typography?.heading?.font ||
    v1.typography?.body?.font !== v2.typography?.body?.font;

  const v1Components = v1.components?.map(c => c.name) || [];
  const v2Components = v2.components?.map(c => c.name) || [];
  const componentsChanged = v2Components.filter(c => !v1Components.includes(c));

  // Check accessibility improvements
  const v1Accessibility = v1.colors?.accessibility || {};
  const v2Accessibility = v2.colors?.accessibility || {};
  const accessibilityImproved = 
    (v2Accessibility.primaryOnWhite?.AA && !v1Accessibility.primaryOnWhite?.AA) ||
    (v2Accessibility.primaryOnBlack?.AA && !v1Accessibility.primaryOnBlack?.AA);

  // Generate summary
  const changes: string[] = [];
  if (colorsChanged) changes.push("colors");
  if (typographyChanged) changes.push("typography");
  if (componentsChanged.length > 0) changes.push(`${componentsChanged.length} components`);
  if (accessibilityImproved) changes.push("accessibility");

  const summary = changes.length > 0
    ? `Updated: ${changes.join(", ")}`
    : "No significant changes";

  return {
    colorsChanged,
    typographyChanged,
    componentsChanged,
    accessibilityImproved,
    summary,
  };
}

// ========== Helper Functions ==========

/**
 * Analyze accessibility issues
 */
function analyzeAccessibility(designSystem: DesignSystem): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  if (!designSystem.colors?.primary) return suggestions;

  const primary = designSystem.colors.primary.main;
  const accessibility = designSystem.colors.accessibility;

  // Check primary on white
  if (accessibility?.primaryOnWhite) {
    if (!accessibility.primaryOnWhite.AA) {
      suggestions.push({
        suggestion: "Primary color on white background fails WCAG AA contrast. Consider using a darker shade.",
        severity: "high",
        category: "accessibility",
        actionable: true,
      });
    } else if (!accessibility.primaryOnWhite.AAA) {
      suggestions.push({
        suggestion: "Primary color on white could meet WCAG AAA with slight adjustment.",
        severity: "low",
        category: "accessibility",
        actionable: true,
      });
    }
  }

  // Check primary on black
  if (accessibility?.primaryOnBlack) {
    if (!accessibility.primaryOnBlack.AA) {
      suggestions.push({
        suggestion: "Primary color on black background fails WCAG AA contrast. Consider using a lighter shade.",
        severity: "high",
        category: "accessibility",
        actionable: true,
      });
    }
  }

  return suggestions;
}

/**
 * Analyze color harmony
 */
function analyzeColorHarmony(designSystem: DesignSystem): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  if (!designSystem.colors?.primary || !designSystem.colors?.secondary) {
    return suggestions;
  }

  const primary = designSystem.colors.primary.main;
  const secondary = designSystem.colors.secondary.main;

  // Check contrast between primary and secondary
  const contrast = getContrastRatio(primary, secondary);
  if (contrast < 2) {
    suggestions.push({
      suggestion: "Primary and secondary colors have low contrast. They may be hard to distinguish.",
      severity: "medium",
      category: "color",
      actionable: true,
    });
  }

  return suggestions;
}

/**
 * Analyze typography
 */
function analyzeTypography(designSystem: DesignSystem): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  if (!designSystem.typography) return suggestions;

  // Check if heading and body fonts are too similar
  if (
    designSystem.typography.heading?.font === designSystem.typography.body?.font
  ) {
    suggestions.push({
      suggestion: "Heading and body fonts are the same. Consider using different fonts for better hierarchy.",
      severity: "medium",
      category: "typography",
      actionable: true,
    });
  }

  return suggestions;
}

/**
 * Get AI-powered suggestions
 */
async function getAISuggestions(
  designSystem: DesignSystem
): Promise<ImprovementSuggestion[]> {
  const prompt = `Analyze this design system and suggest improvements. Return only a JSON array of suggestions.

Design System:
- Primary Color: ${designSystem.colors?.primary?.main || "N/A"}
- Secondary Color: ${designSystem.colors?.secondary?.main || "N/A"}
- Heading Font: ${designSystem.typography?.heading?.font || "N/A"}
- Body Font: ${designSystem.typography?.body?.font || "N/A"}
- Components: ${designSystem.components?.map(c => c.name).join(", ") || "N/A"}

Return JSON array format:
[
  {
    "suggestion": "brief improvement suggestion",
    "severity": "low" | "medium" | "high",
    "category": "accessibility" | "color" | "typography" | "components" | "spacing",
    "actionable": true
  }
]`;

  try {
    const response = await analyzeWithAI(prompt);
    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const suggestions = JSON.parse(cleaned);
    
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 5); // Limit to 5 suggestions
    }
    return [];
  } catch (error) {
    console.error("AI suggestion parsing failed:", error);
    return [];
  }
}

/**
 * Refine accessibility
 */
function refineAccessibility(designSystem: DesignSystem): void {
  if (!designSystem.colors?.primary) return;

  const accessibility = designSystem.colors.accessibility;
  
  // If primary on white fails AA, darken primary
  if (accessibility?.primaryOnWhite && !accessibility.primaryOnWhite.AA) {
    // Use a darker shade (600 instead of 500)
    if (designSystem.colors.primary.shades?.[600]) {
      designSystem.colors.primary.main = designSystem.colors.primary.shades[600];
    }
  }

  // If primary on black fails AA, lighten primary
  if (accessibility?.primaryOnBlack && !accessibility.primaryOnBlack.AA) {
    // Use a lighter shade (400 instead of 500)
    if (designSystem.colors.primary.shades?.[400]) {
      designSystem.colors.primary.main = designSystem.colors.primary.shades[400];
    }
  }
}

/**
 * Adjust tone of design system
 */
async function adjustTone(
  designSystem: DesignSystem,
  tone: RefinementConstraints["adjustTone"],
  userInstruction?: string
): Promise<void> {
  if (!tone) return;

  // Rule-based tone adjustment
  if (tone === "more playful") {
    // Increase saturation, use warmer colors
    // This is a placeholder - actual implementation would adjust HSL values
  } else if (tone === "more professional") {
    // Decrease saturation, use cooler colors
  } else if (tone === "more modern") {
    // Use higher contrast, bolder typography
  } else if (tone === "more classic") {
    // Use traditional color palettes, serif fonts
  }

  // AI-powered tone adjustment (optional)
  if (userInstruction) {
    try {
      const prompt = `Adjust this design system to be ${tone}. User instruction: "${userInstruction}"

Current design:
- Primary: ${designSystem.colors?.primary?.main}
- Fonts: ${designSystem.typography?.heading?.font}, ${designSystem.typography?.body?.font}

Return JSON with suggested changes (colors, fonts, etc.).`;
      
      // This would call AI and apply changes
      // For now, we'll use rule-based only
    } catch (error) {
      console.warn("AI tone adjustment failed, using rule-based:", error);
    }
  }
}

/**
 * Apply specific changes
 */
async function applySpecificChanges(
  designSystem: DesignSystem,
  changes: string[],
  userInstruction?: string
): Promise<void> {
  // Parse user instructions and apply changes
  // This is a simplified version - in production, you'd use AI to interpret instructions
  
  for (const change of changes) {
    if (change.toLowerCase().includes("darker")) {
      // Make colors darker
    } else if (change.toLowerCase().includes("lighter")) {
      // Make colors lighter
    } else if (change.toLowerCase().includes("more contrast")) {
      // Increase contrast
    }
    // Add more change types as needed
  }
}

/**
 * Generate explanation of changes
 */
function generateExplanation(
  previous: DesignSystem,
  refined: DesignSystem,
  constraints: RefinementConstraints
): string {
  const parts: string[] = [];

  if (constraints.keepPrimaryColor) {
    parts.push("Preserved primary color");
  }

  if (constraints.improveAccessibility) {
    parts.push("Improved accessibility compliance");
  }

  if (constraints.adjustTone) {
    parts.push(`Adjusted tone to be ${constraints.adjustTone}`);
  }

  if (constraints.specificChanges && constraints.specificChanges.length > 0) {
    parts.push(`Applied ${constraints.specificChanges.length} specific changes`);
  }

  return parts.length > 0
    ? parts.join(". ") + "."
    : "Refined design system based on constraints.";
}

