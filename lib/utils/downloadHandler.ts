/**
 * Frontend Download Handler
 * Handles downloading design system packages as ZIP files
 */

import { generateExportPackage, type ExportOptions } from "@/lib/exporters/packageGenerator";
import type { ColorPaletteResponse, TypographySystem } from "@/lib/types/designSystem";
import type { GeneratedComponent } from "@/lib/generators/enhancedComponentGenerator";
import type { DesignSystemData } from "@/store/useDesignSystemStore";
import type { DesignSystem } from "@/lib/exporters/cssExporter";

// Re-export for backward compatibility
export type PackageOptions = ExportOptions;

// Union type for both input formats
type DesignSystemInput = DesignSystemData | DesignSystem | any;

/**
 * Convert store DesignSystemData to ColorPaletteResponse format
 */
function convertToColorPalette(storeData: DesignSystemInput): ColorPaletteResponse {
  // Handle DesignSystemData format (arrays of shades)
  if (storeData.colors?.primary?.shades && Array.isArray(storeData.colors.primary.shades)) {
    const primaryShades: Record<string, string> = {};
    storeData.colors.primary.shades.forEach((shade: any) => {
      primaryShades[shade.value] = shade.hex;
    });

    const secondaryShades: Record<string, string> = {};
    storeData.colors?.secondary?.shades?.forEach((shade: any) => {
      secondaryShades[shade.value] = shade.hex;
    });

    const accentShades: Record<string, string> = {};
    storeData.colors?.accent?.shades?.forEach((shade: any) => {
      accentShades[shade.value] = shade.hex;
    });

    const neutrals: Record<string, string> = {};
    storeData.colors?.neutrals?.forEach((neutral: any) => {
      neutrals[neutral.value] = neutral.hex;
    });

    // Use type assertion to bypass strict type checking
    // The exporter handles partial data gracefully
    return {
      primary: {
        name: 'Primary',
        main: storeData.colors?.primary?.hex || '#6366f1',
        shades: primaryShades,
      },
      secondary: {
        name: 'Secondary',
        main: storeData.colors?.secondary?.hex || '#8b5cf6',
        shades: secondaryShades,
      },
      accent: {
        name: 'Accent',
        main: storeData.colors?.accent?.hex || '#f59e0b',
        shades: accentShades,
      },
      semantic: storeData.colors?.semantic || {
        success: { main: '#22c55e', shades: {} },
        warning: { main: '#f59e0b', shades: {} },
        error: { main: '#ef4444', shades: {} },
        info: { main: '#3b82f6', shades: {} },
      },
      neutrals,
      accessibility: {
        primaryOnWhite: { ratio: 4.5, AA: true, AAA: false },
        primaryOnBlack: { ratio: 4.5, AA: true, AAA: false },
      },
    } as unknown as ColorPaletteResponse;
  }
  
  // Handle DesignSystem format (already has record shades)
  return {
    primary: storeData.colors?.primary || { name: 'Primary', main: '#6366f1', shades: {} },
    secondary: storeData.colors?.secondary || { name: 'Secondary', main: '#8b5cf6', shades: {} },
    accent: storeData.colors?.accent || { name: 'Accent', main: '#f59e0b', shades: {} },
    semantic: storeData.colors?.semantic || {
      success: { main: '#22c55e', shades: {} },
      warning: { main: '#f59e0b', shades: {} },
      error: { main: '#ef4444', shades: {} },
      info: { main: '#3b82f6', shades: {} },
    },
    neutrals: storeData.colors?.neutrals || {},
    accessibility: {
      primaryOnWhite: { ratio: 4.5, AA: true, AAA: false },
      primaryOnBlack: { ratio: 4.5, AA: true, AAA: false },
    },
  } as unknown as ColorPaletteResponse;
}

/**
 * Handle download of design system package
 * @param designSystem - The design system data from store
 * @param options - Package generation options
 * @param fileName - Optional custom file name (default: "design-system.zip")
 */
export async function handleDownload(
  designSystem: DesignSystemInput,
  options: ExportOptions = { css: true, tailwind: true },
  fileName: string = "design-system.zip"
): Promise<void> {
  try {
    // Convert store data to export format
    const palette = convertToColorPalette(designSystem);
    const typography = designSystem.typography as TypographySystem;
    const components = (designSystem.components || null) as GeneratedComponent[] | null;
    
    // Step 1: Generate ZIP package
    const zipBlob = await generateExportPackage(
      palette,
      typography,
      components,
      options,
      designSystem.name || 'design-system'
    );

    // Step 2: Create object URL
    const url = URL.createObjectURL(zipBlob);

    // Step 3: Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download package:", error);
    throw new Error("Failed to generate or download package");
  }
}

/**
 * Handle download with loading state callback
 * @param designSystem - The design system data
 * @param options - Package generation options
 * @param fileName - Optional custom file name
 * @param onLoading - Callback for loading state
 */
export async function handleDownloadWithLoading(
  designSystem: DesignSystemInput,
  options: ExportOptions = { css: true, tailwind: true },
  fileName: string = "design-system.zip",
  onLoading?: (loading: boolean) => void
): Promise<void> {
  try {
    onLoading?.(true);
    await handleDownload(designSystem, options, fileName);
  } catch (error) {
    throw error;
  } finally {
    onLoading?.(false);
  }
}

/**
 * Get download file size estimate (in MB)
 * This is a rough estimate for UI purposes
 */
export function getEstimatedFileSize(options?: ExportOptions): string {
  // Rough estimate: ~50KB base + ~5KB per component + ~10KB per framework
  let size = 50; // Base size in KB

  if (options?.css) size += 10;
  if (options?.tailwind) size += 15;
  if (options?.react) size += 20;
  if (options?.vue) size += 20;
  if (options?.figma) size += 5;
  if (options?.scss) size += 10;
  if (options?.includeComponents) size += 200;

  const sizeInMB = size / 1024;
  return sizeInMB < 1 ? `${Math.round(size)} KB` : `${sizeInMB.toFixed(2)} MB`;
}
