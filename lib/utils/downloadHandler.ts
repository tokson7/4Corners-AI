/**
 * Frontend Download Handler
 * Handles downloading design system packages as ZIP files
 */

import { generateZIPPackage } from "@/lib/exporters/packageGenerator";
import type { DesignSystem } from "@/lib/exporters/cssExporter";
import type { PackageOptions } from "@/lib/exporters/packageGenerator";
import type { DesignSystemData } from "@/store/useDesignSystemStore";

/**
 * Convert store DesignSystemData to exporter DesignSystem format
 */
function convertDesignSystem(storeData: DesignSystemData): DesignSystem {
  // Convert shades arrays to records
  const primaryShades: Record<string, string> = {};
  storeData.colors.primary.shades.forEach((shade) => {
    primaryShades[shade.value] = shade.hex;
  });

  const secondaryShades: Record<string, string> = {};
  storeData.colors.secondary.shades.forEach((shade) => {
    secondaryShades[shade.value] = shade.hex;
  });

  const accentShades: Record<string, string> = {};
  storeData.colors.accent.shades.forEach((shade) => {
    accentShades[shade.value] = shade.hex;
  });

  const neutrals: Record<string, string> = {};
  storeData.colors.neutrals.forEach((neutral) => {
    neutrals[neutral.value] = neutral.hex;
  });

  return {
    colors: {
      primary: {
        hex: storeData.colors.primary.hex,
        shades: primaryShades,
      },
      secondary: {
        hex: storeData.colors.secondary.hex,
        shades: secondaryShades,
      },
      accent: {
        hex: storeData.colors.accent.hex,
        shades: accentShades,
      },
      semantic: storeData.colors.semantic,
      neutrals,
    },
    typography: storeData.typography,
    spacing: storeData.spacing,
  };
}

/**
 * Handle download of design system package
 * @param designSystem - The design system to package (can be store format or exporter format)
 * @param options - Package generation options
 * @param fileName - Optional custom file name (default: "design-system.zip")
 */
export async function handleDownload(
  designSystem: DesignSystem | DesignSystemData,
  options?: PackageOptions,
  fileName: string = "design-system.zip"
): Promise<void> {
  try {
    // Convert if needed (check if it's store format)
    const convertedSystem: DesignSystem =
      "colors" in designSystem && Array.isArray(designSystem.colors.primary.shades)
        ? convertDesignSystem(designSystem as DesignSystemData)
        : (designSystem as DesignSystem);

    // Step 1: Generate ZIP package
    const zipBlob = await generateZIPPackage(convertedSystem, options);

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
 * @param designSystem - The design system to package (can be store format or exporter format)
 * @param options - Package generation options
 * @param fileName - Optional custom file name
 * @param onLoading - Callback for loading state
 */
export async function handleDownloadWithLoading(
  designSystem: DesignSystem | DesignSystemData,
  options?: PackageOptions,
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
export function getEstimatedFileSize(designSystem: DesignSystem, options?: PackageOptions): string {
  // Rough estimate: ~50KB base + ~5KB per component + ~10KB per framework
  let size = 50; // Base size in KB

  if (options?.includeCSS !== false) size += 10;
  if (options?.includeTailwind !== false) size += 15;
  if (options?.includeReact !== false) size += 20;
  if (options?.includeVue !== false) size += 20;
  if (options?.includeFigma !== false) size += 5;
  if (options?.includeComponents !== false) size += 200; // All components

  const sizeInMB = size / 1024;
  return sizeInMB < 1 ? `${Math.round(size)} KB` : `${sizeInMB.toFixed(2)} MB`;
}
