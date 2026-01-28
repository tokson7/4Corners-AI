"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check } from "lucide-react";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { useDownload } from "@/hooks/useDownload";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { canExport } from "@/lib/subscription";
import UpgradePrompt from "./UpgradePrompt";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { useUser } from "@/lib/hooks/useUser";

interface ExportFormat {
  id: keyof ReturnType<typeof useDesignSystemStore>["exportOptions"];
  label: string;
  pro?: boolean;
}

const exportFormats: ExportFormat[] = [
  { id: "cssVariables", label: "CSS Variables" },
  { id: "tailwindConfig", label: "Tailwind Config" },
  { id: "reactComponents", label: "React Components" },
  { id: "vueComponents", label: "Vue Components" },
  { id: "figmaTokens", label: "Figma Tokens", pro: true },
];

const sampleCSS = `:root {
  /* Primary Colors */
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-200: #C7D2FE;
  --color-primary-300: #A5B4FC;
  --color-primary-400: #818CF8;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  --color-primary-800: #3730A3;
  --color-primary-900: #312E81;

  /* Secondary Colors */
  --color-secondary-50: #F5F3FF;
  --color-secondary-100: #EDE9FE;
  --color-secondary-200: #DDD6FE;
  --color-secondary-300: #C4B5FD;
  --color-secondary-400: #A78BFA;
  --color-secondary-500: #8B5CF6;
  --color-secondary-600: #7C3AED;
  --color-secondary-700: #6D28D9;
  --color-secondary-800: #5B21B6;
  --color-secondary-900: #4C1D95;

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}`;

export default function ExportTab() {
  const { exportOptions, toggleExportOption, designSystem } = useDesignSystemStore();
  const [copied, setCopied] = useState(false);
  const { download, isLoading } = useDownload();
  const { success, error: showError } = useToast();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { user } = useUser();
  const canUserExport = canExport(subscription);

  const handleDownload = async () => {
    // Check if user can export
    if (!canUserExport) {
      showError("Upgrade required", "Export is a Pro feature. Please upgrade to continue.");
      return;
    }

    const selectedFormats = Object.entries(exportOptions).filter(([_, value]) => value);
    if (selectedFormats.length === 0) {
      showError("No formats selected", "Please select at least one format to export.");
      return;
    }

    if (!designSystem) {
      showError("No design system", "Please generate a design system first.");
      return;
    }

    try {
      // Track export initiated
      if (user?.id) {
        const exportFormats = Object.entries(exportOptions)
          .filter(([_, enabled]) => enabled)
          .map(([format]) => format);
        
        trackEvent("export_initiated", {
          userId: user.id,
          plan: subscription?.plan || "free",
          timestamp: new Date().toISOString(),
          exportFormats,
        }).catch(() => {});
      }

      // Map export options to package options
      const packageOptions = {
        includeCSS: exportOptions.cssVariables,
        includeTailwind: exportOptions.tailwindConfig,
        includeReact: exportOptions.reactComponents,
        includeVue: exportOptions.vueComponents,
        includeFigma: exportOptions.figmaTokens,
        includeComponents: exportOptions.reactComponents || exportOptions.vueComponents,
      };

      await download(designSystem, packageOptions, "design-system.zip");
      
      // Track export completed
      if (user?.id) {
        const exportFormats = Object.entries(exportOptions)
          .filter(([_, enabled]) => enabled)
          .map(([format]) => format);
        
        trackEvent("export_completed", {
          userId: user.id,
          plan: subscription?.plan || "free",
          timestamp: new Date().toISOString(),
          exportFormats,
          success: true,
        }).catch(() => {});
      }

      success("Download started", "Your design system package is being downloaded.");
    } catch (err) {
      // Track export failure
      if (user?.id) {
        const exportFormats = Object.entries(exportOptions)
          .filter(([_, enabled]) => enabled)
          .map(([format]) => format);
        
        trackEvent("export_completed", {
          userId: user.id,
          plan: subscription?.plan || "free",
          timestamp: new Date().toISOString(),
          exportFormats,
          success: false,
        }).catch(() => {});
      }

      showError("Download failed", err instanceof Error ? err.message : "Failed to download package.");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sampleCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show upgrade prompt if user can't export
  if (!subscriptionLoading && !canUserExport) {
    return (
      <div className="max-w-2xl mx-auto">
        <UpgradePrompt feature="Export" requiredPlan="pro" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Export Options */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">
            Export Your Design System
          </h2>
        </div>

        {/* Formats */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">Formats</h3>
          <div className="space-y-3">
            {exportFormats.map((format) => {
              const isChecked = exportOptions[format.id];
              return (
                <label
                  key={format.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    isChecked
                      ? "bg-purple-500/10 border border-purple-500/20"
                      : "hover:bg-white/5"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      // Prevent selecting premium formats if not subscribed
                      if (format.pro && !canUserExport) {
                        showError("Upgrade required", `${format.label} is a Pro feature. Please upgrade to access.`);
                        return;
                      }
                      toggleExportOption(format.id);
                    }}
                    disabled={format.pro && !canUserExport}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="flex-1 text-sm font-medium">
                    {format.label}
                  </span>
                  {format.pro && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      Pro
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {isLoading ? "Generating..." : "Download as ZIP"}
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="w-full px-4 py-3 rounded-lg glass-strong border border-white/20 text-foreground font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:col-span-2">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold">Preview</h3>
            <span className="text-xs text-muted-foreground">CSS Variables</span>
          </div>
          <div className="bg-black/40 rounded-lg p-4 overflow-auto max-h-[600px] border border-white/10">
            <pre className="text-sm text-foreground font-mono leading-relaxed">
              <code>{sampleCSS}</code>
            </pre>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Preview shows the generated CSS variables. Actual export will include all selected formats.
          </p>
        </div>
      </div>
    </div>
  );
}
