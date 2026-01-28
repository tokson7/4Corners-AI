"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Type, Move, Box, Download, Sparkles, Lightbulb, RefreshCw } from "lucide-react";
import ColorsTab from "./ColorsTab";
import TypographyTab from "./TypographyTab";
import ComponentsTab from "./ComponentsTab";
import ExportTab from "./ExportTab";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "spacing", label: "Spacing", icon: Move },
  { id: "components", label: "Components", icon: Box },
  { id: "export", label: "Export", icon: Download },
];

export default function ResultsPage() {
  const { designSystem, setDesignSystem } = useDesignSystemStore();
  const [activeTab, setActiveTab] = useState("colors");
  const [isRefining, setIsRefining] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGetSuggestions = async () => {
    if (!designSystem) return;
    
    try {
      const response = await fetch(
        `/api/generate/refine?designSystem=${encodeURIComponent(JSON.stringify(designSystem))}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Failed to get suggestions:", error);
    }
  };

  const handleRefine = async () => {
    if (!designSystem) return;
    
    const instruction = prompt("What would you like to improve? (e.g., 'Make it more playful', 'Improve accessibility', 'Keep primary color, change accents')");
    if (!instruction) return;

    setIsRefining(true);
    try {
      const response = await fetch("/api/generate/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousDesign: designSystem,
          userInstruction: instruction,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refinedDesign) {
          setDesignSystem(data.refinedDesign);
          alert(`Refined! ${data.explanation || "Changes applied."}`);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to refine design");
      }
    } catch (error) {
      console.error("Failed to refine:", error);
      alert("Failed to refine design");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Refinement Actions */}
      {designSystem && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleGetSuggestions}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-foreground text-sm font-medium transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            Get Suggestions
          </button>
          <button
            onClick={handleRefine}
            disabled={isRefining}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefining ? "animate-spin" : ""}`} />
            {isRefining ? "Refining..." : "Refine Design"}
          </button>
        </div>
      )}

      {/* Suggestions Panel */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Suggestions
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  suggestion.severity === "high"
                    ? "bg-red-500/10 border-red-500/20"
                    : suggestion.severity === "medium"
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <p className="text-sm text-foreground">{suggestion.suggestion}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {suggestion.category} • {suggestion.severity} priority
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Tabs */}
      <div className="glass rounded-xl p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap",
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "colors" && <ColorsTab />}

        {activeTab === "typography" && <TypographyTab />}

        {activeTab === "spacing" && (
          <div className="glass rounded-2xl p-8">
            <h3 className="font-heading text-2xl font-bold mb-6">Spacing</h3>
            <p className="text-muted-foreground">
              Spacing scale content will be displayed here.
            </p>
          </div>
        )}

        {activeTab === "components" && <ComponentsTab />}

        {activeTab === "export" && <ExportTab />}
      </motion.div>
    </div>
  );
}
