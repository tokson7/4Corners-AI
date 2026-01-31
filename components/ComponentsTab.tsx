"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, Code2 } from "lucide-react";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { cn } from "@/lib/utils";

interface Component {
  id: string;
  name: string;
  preview: React.ReactNode;
  code: string;
}

// Default components (fallback)
const defaultComponents: Component[] = [
  {
    id: "button",
    name: "Button",
    preview: (
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
          Primary Button
        </button>
        <button className="px-4 py-2 rounded-lg glass border-2 border-white/40 text-foreground font-medium hover:bg-white/20 transition-colors shadow-md">
          Secondary Button
        </button>
        <button className="px-4 py-2 rounded-lg text-purple-400 font-medium hover:bg-purple-500/10 transition-colors">
          Text Button
        </button>
      </div>
    ),
    code: `<button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
  Primary Button
</button>`,
  },
  {
    id: "input",
    name: "Input",
    preview: (
      <div className="space-y-3 w-full">
        <input
          type="text"
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-black/50"
        />
        <input
          type="text"
          placeholder="Disabled input"
          disabled
          className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/30 text-muted-foreground/50 cursor-not-allowed"
        />
      </div>
    ),
    code: `<input
  type="text"
  placeholder="Enter your email"
  className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-black/50"
/>`,
  },
  {
    id: "card",
    name: "Card",
    preview: (
      <div className="glass rounded-xl p-6 w-full">
        <h3 className="font-heading text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-sm text-muted-foreground">
          This is a sample card component with glassmorphism effect.
        </p>
      </div>
    ),
    code: `<div className="glass rounded-xl p-6">
  <h3 className="font-heading text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">
    Card content goes here.
  </p>
</div>`,
  },
  {
    id: "modal",
    name: "Modal",
    preview: (
      <div className="relative w-full">
        <div className="glass-strong rounded-xl p-6 w-full border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold">Modal Title</h3>
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Modal content goes here.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg glass text-foreground text-sm font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Confirm
            </button>
          </div>
        </div>
      </div>
    ),
    code: `<div className="glass-strong rounded-xl p-6 border border-white/20">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-heading text-lg font-semibold">Modal Title</h3>
    <button className="p-1 rounded hover:bg-white/10">
      <X className="w-4 h-4" />
    </button>
  </div>
  <p className="text-sm text-muted-foreground mb-4">
    Modal content goes here.
  </p>
  <div className="flex gap-2">
    <button className="px-4 py-2 rounded-lg glass text-foreground">
      Cancel
    </button>
    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      Confirm
    </button>
  </div>
</div>`,
  },
  {
    id: "alert",
    name: "Alert",
    preview: (
      <div className="space-y-2 w-full">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-medium">Success: Operation completed successfully</p>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium">Error: Something went wrong</p>
        </div>
      </div>
    ),
    code: `<div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
  <p className="text-sm text-green-400 font-medium">
    Success: Operation completed successfully
  </p>
</div>`,
  },
  {
    id: "badge",
    name: "Badge",
    preview: (
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
          Default
        </span>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
          Info
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
          Success
        </span>
        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
          Error
        </span>
      </div>
    ),
    code: `<span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
  Badge
</span>`,
  },
];

export default function ComponentsTab() {
  const designSystem = useDesignSystemStore((state) => state.designSystem);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Use components from design system if available, otherwise use defaults
  const components = useMemo(() => {
    if (designSystem?.components && designSystem.components.length > 0) {
      // Map design system components to Component format with proper preview rendering
      return designSystem.components.map((comp: any, index: number) => {
        // Render generated HTML/CSS as preview
        const renderGeneratedPreview = () => {
          if (comp.code?.html && comp.code?.css) {
            // Combine HTML and CSS for preview
            return (
              <div
                className="w-full"
                dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      ${comp.code.css}
                      /* Override any inherited dark theme styles */
                      .default-card, .elevated-card, .outlined-card {
                        color: inherit !important;
                      }
                      .default-card *, .elevated-card *, .outlined-card * {
                        color: inherit !important;
                      }
                    </style>
                    ${comp.code.html}
                  `,
                }}
              />
            );
          }
          
          // Fallback to default preview if no HTML/CSS
          const defaultComp = defaultComponents.find((dc) => 
            dc.name.toLowerCase() === comp.name.toLowerCase() ||
            comp.name.toLowerCase().includes(dc.name.toLowerCase())
          );
          return defaultComp?.preview || <div>Preview for {comp.name}</div>;
        };

        return {
          id: comp.name.toLowerCase().replace(/\s+/g, "-"),
          name: comp.name,
          preview: renderGeneratedPreview(),
          code: comp.code?.react || comp.code?.html || comp.code || 'No code available',
        };
      });
    }
    return defaultComponents;
  }, [designSystem]);

  const copyCode = (code: string, componentId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(componentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCodeModal = (component: Component) => {
    setSelectedComponent(component);
  };

  const closeCodeModal = () => {
    setSelectedComponent(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="mb-4">
              <h3 className="font-heading text-lg font-semibold mb-4">{component.name}</h3>
              <div className="min-h-[120px] flex items-center justify-center">
                {component.preview}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openCodeModal(component)}
                className="flex-1 px-3 py-2 rounded-lg glass-strong hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-sm font-medium text-foreground flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                View Code
              </button>
              <button
                onClick={() => copyCode(component.code, component.id)}
                className="px-3 py-2 rounded-lg glass-strong hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
              >
                {copiedId === component.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Code Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCodeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] z-50"
            >
              <div className="glass-strong rounded-2xl p-6 border border-white/20 m-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-semibold">
                    {selectedComponent.name} Code
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(selectedComponent.code, selectedComponent.id)}
                      className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    >
                      {copiedId === selectedComponent.id ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={closeCodeModal}
                      className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 overflow-auto max-h-[60vh]">
                  <pre className="text-sm text-foreground font-mono">
                    <code>{selectedComponent.code}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
