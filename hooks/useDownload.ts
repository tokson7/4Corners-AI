/**
 * React Hook for Download Handler
 * Provides download functionality with loading state
 */

import { useState, useCallback } from "react";
import { handleDownload, handleDownloadWithLoading } from "@/lib/utils/downloadHandler";
import type { DesignSystem } from "@/lib/exporters/cssExporter";
import type { PackageOptions } from "@/lib/exporters/packageGenerator";
import type { DesignSystemData, ExportOptions } from "@/store/useDesignSystemStore";

export interface UseDownloadReturn {
  download: (designSystem: DesignSystem | DesignSystemData, options?: PackageOptions, fileName?: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for handling design system package downloads
 */
export function useDownload(): UseDownloadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(
    async (
      designSystem: DesignSystem,
      options?: PackageOptions,
      fileName: string = "design-system.zip"
    ) => {
      try {
        setError(null);
        await handleDownloadWithLoading(designSystem, options, fileName, setIsLoading);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Download failed");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    download: download as any,
    isLoading,
    error,
  };
}
