/**
 * Color Generator Tests
 * Tests for color generation and WCAG compliance
 */

import {
  generateColorShades,
  generateComplementaryColors,
  checkAccessibility,
  generateSemanticColors,
  generateNeutralGrays,
  generatePrimaryColor,
  analyzeBrandDescription,
} from "../ai/colorGenerator";
import { hexToHSL } from "../utils/colorUtils";

// Helper to access internal hexToHsl from colorGenerator if needed
// For now, we'll use the public hexToHSL from colorUtils

describe("Color Generator", () => {
  describe("generateColorShades", () => {
    it("should generate all shade levels (50-900)", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);

      expect(shades).toHaveProperty("50");
      expect(shades).toHaveProperty("100");
      expect(shades).toHaveProperty("200");
      expect(shades).toHaveProperty("300");
      expect(shades).toHaveProperty("400");
      expect(shades).toHaveProperty("500");
      expect(shades).toHaveProperty("600");
      expect(shades).toHaveProperty("700");
      expect(shades).toHaveProperty("800");
      expect(shades).toHaveProperty("900");
    });

    it("should generate valid hex colors", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);

      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(shades).forEach((hex) => {
        expect(hex).toMatch(hexPattern);
      });
    });

    it("should have 500 as the base color", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);

      expect(shades["500"]).toBe(baseColor);
    });

    it("should generate lighter shades for 50-400", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);
      const baseHSL = hexToHSL(baseColor);

      const lightShades = [shades["50"], shades["100"], shades["200"], shades["300"], shades["400"]];
      lightShades.forEach((hex) => {
        const hsl = hexToHSL(hex);
        expect(hsl.l).toBeGreaterThan(baseHSL.l);
      });
    });

    it("should generate darker shades for 600-900", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);
      const baseHSL = hexToHSL(baseColor);

      const darkShades = [shades["600"], shades["700"], shades["800"], shades["900"]];
      darkShades.forEach((hex) => {
        const hsl = hexToHSL(hex);
        expect(hsl.l).toBeLessThan(baseHSL.l);
      });
    });

    it("should maintain hue across all shades", () => {
      const baseColor = "#6366F1";
      const shades = generateColorShades(baseColor);
      const baseHSL = hexToHSL(baseColor);

      Object.values(shades).forEach((hex) => {
        const hsl = hexToHSL(hex);
        // Allow small variance in hue (within 5 degrees)
        const hueDiff = Math.abs(hsl.h - baseHSL.h);
        expect(hueDiff).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("WCAG AA Compliance", () => {
    it("should check contrast ratio correctly", () => {
      const white = "#FFFFFF";
      const black = "#000000";

      const result = checkAccessibility(white, black);
      expect(result.ratio).toBeGreaterThan(20); // White on black has very high contrast
      expect(result.wcagAA).toBe(true);
      expect(result.wcagAAA).toBe(true);
    });

    it("should detect WCAG AA compliance (4.5:1)", () => {
      const foreground = "#000000";
      const background = "#FFFFFF";

      const result = checkAccessibility(foreground, background);
      expect(result.wcagAA).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it("should detect WCAG AAA compliance (7:1)", () => {
      const foreground = "#000000";
      const background = "#FFFFFF";

      const result = checkAccessibility(foreground, background);
      expect(result.wcagAAA).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(7);
    });

    it("should fail WCAG AA for low contrast colors", () => {
      const foreground = "#CCCCCC";
      const background = "#DDDDDD";

      const result = checkAccessibility(foreground, background);
      expect(result.wcagAA).toBe(false);
      expect(result.ratio).toBeLessThan(4.5);
    });

    it("should validate semantic colors meet WCAG AA", () => {
      const semantic = generateSemanticColors();
      const white = "#FFFFFF";
      const black = "#000000";

      // Test success color
      const successOnWhite = checkAccessibility(semantic.success, white);
      const whiteOnSuccess = checkAccessibility(white, semantic.success);
      expect(successOnWhite.wcagAA || whiteOnSuccess.wcagAA).toBe(true);

      // Test error color
      const errorOnWhite = checkAccessibility(semantic.error, white);
      const whiteOnError = checkAccessibility(white, semantic.error);
      expect(errorOnWhite.wcagAA || whiteOnError.wcagAA).toBe(true);

      // Test warning color
      const warningOnWhite = checkAccessibility(semantic.warning, white);
      const whiteOnWarning = checkAccessibility(white, semantic.warning);
      expect(warningOnWhite.wcagAA || whiteOnWarning.wcagAA).toBe(true);

      // Test info color
      const infoOnWhite = checkAccessibility(semantic.info, white);
      const whiteOnInfo = checkAccessibility(white, semantic.info);
      expect(infoOnWhite.wcagAA || whiteOnInfo.wcagAA).toBe(true);
    });
  });

  describe("generateComplementaryColors", () => {
    it("should generate secondary and accent colors", () => {
      const primary = "#6366F1";
      const result = generateComplementaryColors(primary);

      expect(result).toHaveProperty("secondary");
      expect(result).toHaveProperty("accent");
      expect(result.secondary).toMatch(/^#[0-9A-F]{6}$/i);
      expect(result.accent).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should generate different colors from primary", () => {
      const primary = "#6366F1";
      const result = generateComplementaryColors(primary);

      expect(result.secondary).not.toBe(primary);
      expect(result.accent).not.toBe(primary);
      expect(result.secondary).not.toBe(result.accent);
    });
  });

  describe("generateSemanticColors", () => {
    it("should generate all semantic colors", () => {
      const semantic = generateSemanticColors();

      expect(semantic).toHaveProperty("success");
      expect(semantic).toHaveProperty("error");
      expect(semantic).toHaveProperty("warning");
      expect(semantic).toHaveProperty("info");
    });

    it("should generate valid hex colors", () => {
      const semantic = generateSemanticColors();
      const hexPattern = /^#[0-9A-F]{6}$/i;

      expect(semantic.success).toMatch(hexPattern);
      expect(semantic.error).toMatch(hexPattern);
      expect(semantic.warning).toMatch(hexPattern);
      expect(semantic.info).toMatch(hexPattern);
    });
  });

  describe("generateNeutralGrays", () => {
    it("should generate all neutral shades", () => {
      const primary = "#6366F1";
      const neutrals = generateNeutralGrays(primary);

      expect(neutrals).toHaveProperty("50");
      expect(neutrals).toHaveProperty("100");
      expect(neutrals).toHaveProperty("200");
      expect(neutrals).toHaveProperty("300");
      expect(neutrals).toHaveProperty("400");
      expect(neutrals).toHaveProperty("500");
      expect(neutrals).toHaveProperty("600");
      expect(neutrals).toHaveProperty("700");
      expect(neutrals).toHaveProperty("800");
      expect(neutrals).toHaveProperty("900");
    });

    it("should generate valid hex colors", () => {
      const primary = "#6366F1";
      const neutrals = generateNeutralGrays(primary);
      const hexPattern = /^#[0-9A-F]{6}$/i;

      Object.values(neutrals).forEach((hex) => {
        expect(hex).toMatch(hexPattern);
      });
    });

    it("should generate lighter to darker progression", () => {
      const primary = "#6366F1";
      const neutrals = generateNeutralGrays(primary);

      const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
      const lightnessValues = shades.map((shade) => hexToHSL(neutrals[shade as keyof typeof neutrals]).l);

      // Check that lightness decreases as shade number increases
      for (let i = 0; i < lightnessValues.length - 1; i++) {
        expect(lightnessValues[i]).toBeGreaterThanOrEqual(lightnessValues[i + 1]);
      }
    });
  });

  describe("generatePrimaryColor", () => {
    it("should generate primary color with reasoning", async () => {
      const analysis = await analyzeBrandDescription("Modern fintech app");
      const result = generatePrimaryColor(analysis);

      expect(result).toHaveProperty("hex");
      expect(result).toHaveProperty("reasoning");
      expect(result.hex).toMatch(/^#[0-9A-F]{6}$/i);
      expect(result.reasoning).toBeTruthy();
    });

    it("should select appropriate color for finance industry", async () => {
      const analysis = await analyzeBrandDescription("Financial technology platform");
      const result = generatePrimaryColor(analysis);

      // Finance typically uses blue
      const hsl = hexToHSL(result.hex);
      expect(hsl.h).toBeGreaterThanOrEqual(180);
      expect(hsl.h).toBeLessThanOrEqual(270);
    });
  });

  describe("analyzeBrandDescription", () => {
    it("should extract industry from description", async () => {
      const analysis = await analyzeBrandDescription("Modern fintech app for banking");
      expect(analysis.industry).toBeTruthy();
      expect(typeof analysis.industry).toBe("string");
    });

    it("should extract tone from description", async () => {
      const analysis = await analyzeBrandDescription("Trustworthy financial platform");
      expect(analysis.tone).toBeTruthy();
      expect(typeof analysis.tone).toBe("string");
    });

    it("should extract emotions from description", async () => {
      const analysis = await analyzeBrandDescription("Innovative and secure banking app");
      expect(Array.isArray(analysis.emotions)).toBe(true);
      expect(analysis.emotions.length).toBeGreaterThan(0);
    });

    it("should extract keywords from description", async () => {
      const analysis = await analyzeBrandDescription("Modern fintech app");
      expect(Array.isArray(analysis.keywords)).toBe(true);
    });
  });

  describe("Contrast Ratio Calculations", () => {
    it("should calculate correct contrast ratio for black on white", () => {
      const result = checkAccessibility("#000000", "#FFFFFF");
      expect(result.ratio).toBeCloseTo(21, 1); // Maximum contrast
    });

    it("should calculate correct contrast ratio for white on black", () => {
      const result = checkAccessibility("#FFFFFF", "#000000");
      expect(result.ratio).toBeCloseTo(21, 1); // Maximum contrast
    });

    it("should return ratio >= 1.0 for any color pair", () => {
      const color1 = "#FF0000";
      const color2 = "#00FF00";
      const result = checkAccessibility(color1, color2);
      expect(result.ratio).toBeGreaterThanOrEqual(1.0);
    });

    it("should return same ratio regardless of order", () => {
      const color1 = "#6366F1";
      const color2 = "#FFFFFF";
      const result1 = checkAccessibility(color1, color2);
      const result2 = checkAccessibility(color2, color1);
      expect(result1.ratio).toBe(result2.ratio);
    });
  });
});
