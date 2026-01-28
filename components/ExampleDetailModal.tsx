"use client";

import { motion } from "framer-motion";
import { X, Palette, Type, Box } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface ExampleDesignSystem {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  components: string[];
}

interface ExampleDetailModalProps {
  example: ExampleDesignSystem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExampleDetailModal({
  example,
  isOpen,
  onClose,
}: ExampleDetailModalProps) {
  if (!example) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={example.name}>
      <div className="space-y-6">
        <p className="text-muted-foreground">{example.description}</p>

        {/* Colors Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading text-lg font-semibold">Color Palette</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div
                className="w-full h-24 rounded-lg shadow-lg border-2 border-white/20 mb-2"
                style={{ backgroundColor: example.colors.primary }}
              />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs font-mono text-muted-foreground">
                {example.colors.primary}
              </p>
            </div>
            <div>
              <div
                className="w-full h-24 rounded-lg shadow-lg border-2 border-white/20 mb-2"
                style={{ backgroundColor: example.colors.secondary }}
              />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs font-mono text-muted-foreground">
                {example.colors.secondary}
              </p>
            </div>
            <div>
              <div
                className="w-full h-24 rounded-lg shadow-lg border-2 border-white/20 mb-2"
                style={{ backgroundColor: example.colors.accent }}
              />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs font-mono text-muted-foreground">
                {example.colors.accent}
              </p>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading text-lg font-semibold">Typography</h3>
          </div>
          <div className="glass rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heading</p>
              <p className="font-heading text-2xl font-bold">
                {example.typography.heading}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body</p>
              <p className="font-sans text-base">
                {example.typography.body}
              </p>
            </div>
          </div>
        </div>

        {/* Components Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Box className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading text-lg font-semibold">Components</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {example.components.map((component, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full glass text-sm font-medium"
              >
                {component}
              </span>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <h3 className="font-heading text-lg font-semibold mb-4">Live Preview</h3>
          <div className="glass rounded-lg p-6 space-y-4">
            <button
              className="px-4 py-2 rounded-lg text-white font-medium transition-opacity"
              style={{
                background: `linear-gradient(to right, ${example.colors.primary}, ${example.colors.secondary})`,
              }}
            >
              Sample Button
            </button>
            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: `${example.colors.primary}30`,
                backgroundColor: `${example.colors.primary}10`,
              }}
            >
              <h4 className="font-heading font-semibold mb-2">Sample Card</h4>
              <p className="text-sm text-muted-foreground">
                This is how components look with this design system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
