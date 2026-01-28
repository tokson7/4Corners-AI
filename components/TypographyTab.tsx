"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { useToast } from "@/hooks/useToast";

interface TypographyPreview {
  name: string;
  size: string;
  weight: string;
  fontFamily: "heading" | "body";
  sampleText: string;
}

const headingStyles: TypographyPreview[] = [
  {
    name: "H1",
    size: "48px",
    weight: "Bold",
    fontFamily: "heading",
    sampleText: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "H2",
    size: "36px",
    weight: "Bold",
    fontFamily: "heading",
    sampleText: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "H3",
    size: "24px",
    weight: "Semibold",
    fontFamily: "heading",
    sampleText: "The quick brown fox jumps over the lazy dog",
  },
];

const bodyStyles: TypographyPreview[] = [
  {
    name: "Body Large",
    size: "18px",
    weight: "Regular",
    fontFamily: "body",
    sampleText: "The quick brown fox jumps over the lazy dog. This is a longer sample text to demonstrate how the body large font looks in a paragraph format.",
  },
  {
    name: "Body",
    size: "16px",
    weight: "Regular",
    fontFamily: "body",
    sampleText: "The quick brown fox jumps over the lazy dog. This is a longer sample text to demonstrate how the body font looks in a paragraph format.",
  },
  {
    name: "Body Small",
    size: "14px",
    weight: "Regular",
    fontFamily: "body",
    sampleText: "The quick brown fox jumps over the lazy dog. This is a longer sample text to demonstrate how the body small font looks in a paragraph format.",
  },
  {
    name: "Caption",
    size: "12px",
    weight: "Regular",
    fontFamily: "body",
    sampleText: "The quick brown fox jumps over the lazy dog",
  },
];

export default function TypographyTab() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const TypographyPreviewCard = ({ style }: { style: TypographyPreview }) => {
    const fontClass = style.fontFamily === "heading" ? "font-heading" : "font-sans";
    const weightClass =
      style.weight === "Bold"
        ? "font-bold"
        : style.weight === "Semibold"
        ? "font-semibold"
        : "font-normal";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 mb-4"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-semibold mb-1">{style.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{style.size}</span>
              <span>•</span>
              <span>{style.weight}</span>
              <span>•</span>
              <span className="capitalize">{style.fontFamily === "heading" ? "Space Grotesk" : "Inter"}</span>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(style.sampleText, style.name)}
            className="p-2 rounded-lg glass hover:glass-strong transition-all"
          >
            {copiedText === style.name ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <div
          className={cn(
            fontClass,
            weightClass,
            "text-foreground leading-relaxed"
          )}
          style={{ fontSize: style.size }}
        >
          {style.sampleText}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Heading Font Section */}
      <div>
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold mb-2">Heading Font</h2>
          <p className="text-muted-foreground">Space Grotesk</p>
        </div>
        <div className="space-y-4">
          {headingStyles.map((style) => (
            <TypographyPreviewCard key={style.name} style={style} />
          ))}
        </div>
      </div>

      {/* Body Font Section */}
      <div>
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold mb-2">Body Font</h2>
          <p className="text-muted-foreground">Inter</p>
        </div>
        <div className="space-y-4">
          {bodyStyles.map((style) => (
            <TypographyPreviewCard key={style.name} style={style} />
          ))}
        </div>
      </div>

      {/* Font Pairing Preview */}
      <div className="glass rounded-xl p-6 mt-8">
        <h3 className="font-heading text-xl font-semibold mb-4">Font Pairing Preview</h3>
        <div className="space-y-4">
          <div>
            <h1 className="font-heading text-5xl font-bold mb-2">
              Design System Heading
            </h1>
            <p className="font-sans text-base text-muted-foreground">
              This is how the heading and body fonts work together. The Space Grotesk
              heading provides strong visual hierarchy, while the Inter body text ensures
              excellent readability for longer content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
