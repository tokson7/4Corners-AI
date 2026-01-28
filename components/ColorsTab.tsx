"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Lock, LockOpen, Edit2, Copy, Check } from "lucide-react";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ColorShade {
  value: string;
  hex: string;
}

interface ColorSection {
  name: string;
  hex: string;
  displayName: string;
  psychology: string;
  shades: ColorShade[];
  locked: boolean;
}

const generateShades = (baseHex: string, name: string): ColorShade[] => {
  // Simplified shade generation - in real app, this would use color manipulation
  const shades: { [key: string]: string } = {
    "50": "#EEF2FF",
    "100": "#E0E7FF",
    "200": "#C7D2FE",
    "300": "#A5B4FC",
    "400": "#818CF8",
    "500": baseHex,
    "600": "#4F46E5",
    "700": "#4338CA",
    "800": "#3730A3",
    "900": "#312E81",
  };
  
  return Object.entries(shades).map(([value, hex]) => ({ value, hex }));
};

const initialColors: ColorSection[] = [
  {
    name: "primary",
    hex: "#6366F1",
    displayName: "Indigo",
    psychology: "Trust, Innovation, Technology",
    shades: generateShades("#6366F1", "Indigo"),
    locked: false,
  },
  {
    name: "secondary",
    hex: "#8B5CF6",
    displayName: "Purple",
    psychology: "Creativity, Luxury, Ambition",
    shades: generateShades("#8B5CF6", "Purple"),
    locked: false,
  },
  {
    name: "accent",
    hex: "#EC4899",
    displayName: "Pink",
    psychology: "Energy, Playfulness, Modernity",
    shades: generateShades("#EC4899", "Pink"),
    locked: false,
  },
];

export default function ColorsTab() {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  
  // Memoize semantic colors calculation
  const semanticColors = useMemo(() => {
    return designSystem?.colors
      ? [
          { name: "Success", hex: designSystem.colors.semantic.success, displayName: "Green" },
          { name: "Error", hex: designSystem.colors.semantic.error, displayName: "Red" },
          { name: "Warning", hex: designSystem.colors.semantic.warning, displayName: "Amber" },
          { name: "Info", hex: designSystem.colors.semantic.info, displayName: "Blue" },
        ]
      : [
          { name: "Success", hex: "#10B981", displayName: "Green" },
          { name: "Error", hex: "#EF4444", displayName: "Red" },
          { name: "Warning", hex: "#F59E0B", displayName: "Amber" },
          { name: "Info", hex: "#3B82F6", displayName: "Blue" },
        ];
  }, [designSystem?.colors?.semantic]);

  // Memoize neutral grays calculation
  const neutralGrays = useMemo(() => {
    return designSystem?.colors?.neutrals || [
      { value: "50", hex: "#F9FAFB" },
      { value: "100", hex: "#F3F4F6" },
      { value: "200", hex: "#E5E7EB" },
      { value: "300", hex: "#D1D5DB" },
      { value: "400", hex: "#9CA3AF" },
      { value: "500", hex: "#6B7280" },
      { value: "600", hex: "#4B5563" },
      { value: "700", hex: "#374151" },
      { value: "800", hex: "#1F2937" },
      { value: "900", hex: "#111827" },
    ];
  }, [designSystem?.colors?.neutrals]);
  const [colors, setColors] = useState<ColorSection[]>(() => {
    // Use placeholder data from store if available, otherwise use initial colors
    if (designSystem?.colors) {
      return [
        {
          name: "primary",
          hex: designSystem.colors.primary.hex,
          displayName: designSystem.colors.primary.name,
          psychology: designSystem.colors.primary.psychology,
          shades: designSystem.colors.primary.shades,
          locked: false,
        },
        {
          name: "secondary",
          hex: designSystem.colors.secondary.hex,
          displayName: designSystem.colors.secondary.name,
          psychology: designSystem.colors.secondary.psychology,
          shades: designSystem.colors.secondary.shades,
          locked: false,
        },
        {
          name: "accent",
          hex: designSystem.colors.accent.hex,
          displayName: designSystem.colors.accent.name,
          psychology: designSystem.colors.accent.psychology,
          shades: designSystem.colors.accent.shades,
          locked: false,
        },
      ];
    }
    return initialColors;
  });
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const { toasts, success, removeToast } = useToast();

  // Update colors when design system changes
  useEffect(() => {
    if (designSystem?.colors) {
      setColors([
        {
          name: "primary",
          hex: designSystem.colors.primary.hex,
          displayName: designSystem.colors.primary.name,
          psychology: designSystem.colors.primary.psychology,
          shades: designSystem.colors.primary.shades,
          locked: colors.find((c) => c.name === "primary")?.locked || false,
        },
        {
          name: "secondary",
          hex: designSystem.colors.secondary.hex,
          displayName: designSystem.colors.secondary.name,
          psychology: designSystem.colors.secondary.psychology,
          shades: designSystem.colors.secondary.shades,
          locked: colors.find((c) => c.name === "secondary")?.locked || false,
        },
        {
          name: "accent",
          hex: designSystem.colors.accent.hex,
          displayName: designSystem.colors.accent.name,
          psychology: designSystem.colors.accent.psychology,
          shades: designSystem.colors.accent.shades,
          locked: colors.find((c) => c.name === "accent")?.locked || false,
        },
      ]);
    }
  }, [designSystem]);

  const handleLock = (colorName: string) => {
    setColors((prev) =>
      prev.map((color) =>
        color.name === colorName ? { ...color, locked: !color.locked } : color
      )
    );
  };

  const handleRegenerate = (colorName: string) => {
    if (colors.find((c) => c.name === colorName)?.locked) return;
    
    // In real app, this would regenerate the color
    // For now, we'll just show a visual feedback
    console.log(`Regenerating ${colorName}`);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    success("Copied!");
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const ColorSectionComponent = ({ color }: { color: ColorSection }) => (
    <div className="glass rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl shadow-lg border-2 border-white/20"
            style={{ backgroundColor: color.hex }}
          />
          <div>
            <h3 className="font-heading text-xl font-semibold mb-1 capitalize">
              {color.name} Color
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">
                {color.hex}
              </span>
              <button
                onClick={() => copyToClipboard(color.hex)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {copiedHex === color.hex ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-sm font-medium text-foreground">{color.displayName}</p>
            <p className="text-xs text-muted-foreground">{color.psychology}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRegenerate(color.name)}
            disabled={color.locked}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all",
              color.locked
                ? "glass text-muted-foreground cursor-not-allowed"
                : "glass-strong hover:bg-white/10 text-foreground"
            )}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleLock(color.name)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all",
              color.locked
                ? "bg-purple-500/20 border border-purple-500/30 text-purple-400"
                : "glass-strong hover:bg-white/10 text-foreground"
            )}
          >
            {color.locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <LockOpen className="w-4 h-4" />
            )}
          </button>
          <button className="px-3 py-2 rounded-lg glass-strong hover:bg-white/10 text-foreground transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shades */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Shades</h4>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {color.shades.map((shade) => (
            <motion.div
              key={shade.value}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group cursor-pointer"
            >
              <div
                className="w-full h-16 rounded-lg shadow-md border border-white/10 mb-2"
                style={{ backgroundColor: shade.hex }}
              />
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {shade.value}
                </p>
                <button
                  onClick={() => copyToClipboard(shade.hex)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  {shade.hex}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Primary, Secondary, Accent Colors */}
        {colors.map((color) => (
          <ColorSectionComponent key={color.name} color={color} />
        ))}

        {/* Semantic Colors */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading text-xl font-semibold mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {semanticColors.map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className="w-full h-20 rounded-lg shadow-md border-2 border-white/20 mb-3"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-sm font-semibold mb-1">{color.name}</p>
                <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Grays */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading text-xl font-semibold mb-4">Neutral Grays</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {neutralGrays.map((gray) => (
              <div key={gray.value} className="text-center">
                <div
                  className="w-full h-16 rounded-lg shadow-md border border-white/10 mb-2"
                  style={{ backgroundColor: gray.hex }}
                />
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {gray.value}
                </p>
                <p className="text-xs font-mono text-muted-foreground">{gray.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Check */}
        {(designSystem as any)?.accessibility && (
          <div className="glass rounded-xl p-6">
            <h3 className="font-heading text-xl font-semibold mb-4">Accessibility Check</h3>
            <div className="space-y-4">
              {/* Primary on White */}
              {(designSystem as any).accessibility.primaryOnWhite && (
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-sm font-medium text-foreground">Primary on White</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground">
                      {((designSystem as any).accessibility.primaryOnWhite.ratio as number).toFixed(2)}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        (designSystem as any).accessibility.primaryOnWhite.AA
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}
                    >
                      AA {(designSystem as any).accessibility.primaryOnWhite.AA ? "Pass" : "Fail"}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        (designSystem as any).accessibility.primaryOnWhite.AAA
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}
                    >
                      AAA {(designSystem as any).accessibility.primaryOnWhite.AAA ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary on Black */}
              {(designSystem as any).accessibility.primaryOnBlack && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-foreground">Primary on Black</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground">
                      {((designSystem as any).accessibility.primaryOnBlack.ratio as number).toFixed(2)}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        (designSystem as any).accessibility.primaryOnBlack.AA
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}
                    >
                      AA {(designSystem as any).accessibility.primaryOnBlack.AA ? "Pass" : "Fail"}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        (designSystem as any).accessibility.primaryOnBlack.AAA
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}
                    >
                      AAA {(designSystem as any).accessibility.primaryOnBlack.AAA ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Live Preview */}
      <div className="lg:col-span-1">
        <div className="glass rounded-xl p-6 sticky top-8">
          <h3 className="font-heading text-lg font-semibold mb-4">Live Preview</h3>
          
          {/* Sample Button */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Button</p>
            <button
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(to right, ${colors[0].hex}, ${colors[1].hex})`,
              }}
            >
              Sample Button
            </button>
          </div>

          {/* Sample Card */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Card</p>
            <div
              className="glass-strong rounded-lg p-4 border"
              style={{ borderColor: `${colors[0].hex}30` }}
            >
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-sm text-muted-foreground">
                This is a sample card preview using your color system.
              </p>
            </div>
          </div>

          {/* Sample Form */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Form</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Input field"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                style={{ "--tw-ring-color": colors[0].hex } as React.CSSProperties}
              />
              <button
                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-opacity"
                style={{
                  backgroundColor: colors[0].hex,
                  color: "white",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
