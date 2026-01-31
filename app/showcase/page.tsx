"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Palette, Type, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";

interface ShowcaseExample {
  id: string;
  name: string;
  industry: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  brandDescription: string;
}

const showcaseExamples: ShowcaseExample[] = [
  {
    id: "fintech-pro",
    name: "FinTech Pro",
    industry: "Finance",
    description: "Trustworthy and professional design system for financial applications",
    primaryColor: "#1E40AF",
    secondaryColor: "#3B82F6",
    accentColor: "#10B981",
    brandDescription: "Modern fintech app for Gen Z focused on simplicity and trust",
  },
  {
    id: "ecolife",
    name: "EcoLife",
    industry: "Sustainability",
    description: "Fresh and natural design system for eco-friendly brands",
    primaryColor: "#059669",
    secondaryColor: "#10B981",
    accentColor: "#84CC16",
    brandDescription: "Sustainable lifestyle brand focused on environmental consciousness",
  },
  {
    id: "healthcare-plus",
    name: "HealthCare+",
    industry: "Healthcare",
    description: "Calm and trustworthy design system for medical applications",
    primaryColor: "#14B8A6",
    secondaryColor: "#3B82F6",
    accentColor: "#10B981",
    brandDescription: "Healthcare platform prioritizing patient care and accessibility",
  },
  {
    id: "creativehub",
    name: "CreativeHub",
    industry: "Creative",
    description: "Bold and imaginative design system for creative professionals",
    primaryColor: "#8B5CF6",
    secondaryColor: "#A855F7",
    accentColor: "#EC4899",
    brandDescription: "Creative agency focused on innovation and artistic expression",
  },
  {
    id: "fooddash",
    name: "FoodDash",
    industry: "Food Delivery",
    description: "Energetic and friendly design system for food delivery apps",
    primaryColor: "#F97316",
    secondaryColor: "#F59E0B",
    accentColor: "#EF4444",
    brandDescription: "Food delivery platform focused on speed and customer satisfaction",
  },
  {
    id: "gaming-arena",
    name: "Gaming Arena",
    industry: "Gaming",
    description: "Vibrant and dynamic design system for gaming platforms",
    primaryColor: "#A855F7",
    secondaryColor: "#EC4899",
    accentColor: "#F59E0B",
    brandDescription: "Gaming platform for competitive esports and casual players",
  },
];

export default function ShowcasePage() {
  const [selectedExample, setSelectedExample] = useState<ShowcaseExample | null>(null);
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "components">("colors");
  const router = useRouter();
  const { setBrandDescription, setIndustry } = useDesignSystemStore();

  const openModal = (example: ShowcaseExample) => {
    setSelectedExample(example);
    setActiveTab("colors");
  };

  const closeModal = () => {
    setSelectedExample(null);
  };

  // ESC key to close modal
  useEffect(() => {
    if (!selectedExample) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedExample]);

  // Body overflow management
  useEffect(() => {
    if (selectedExample) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedExample]);

  const handleGenerateSimilar = () => {
    if (selectedExample) {
      // Prefill the store with example data
      setBrandDescription(selectedExample.brandDescription);
      setIndustry(selectedExample.industry);
      // Navigate to generate page
      router.push("/generate");
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="fixed inset-0 gradient-subtle -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                See what 4Corners AI can create
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Real examples of AI-generated design systems for different industries.
              </p>
            </motion.div>

            {/* Showcase Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              {showcaseExamples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:glass-strong transition-all cursor-pointer group"
                  onClick={() => openModal(example)}
                >
                  {/* Visual Preview */}
                  <div className="mb-4">
                    <div
                      className="w-full h-32 rounded-xl mb-4 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${example.primaryColor} 0%, ${example.secondaryColor} 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-8 rounded-lg bg-white/20 backdrop-blur-sm" />
                        <div className="h-4 rounded-lg bg-white/10 backdrop-blur-sm mt-2 w-2/3" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${example.primaryColor}20`,
                          color: example.primaryColor,
                        }}
                      >
                        {example.industry}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                      {example.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {example.description}
                    </p>
                  </div>

                  {/* Color Palette Preview */}
                  <div className="flex gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: example.primaryColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: example.secondaryColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: example.accentColor }}
                    />
                  </div>

                  {/* View Details Button */}
                  <button className="w-full px-4 py-2 rounded-lg glass-strong hover:bg-white/10 text-foreground text-sm font-medium transition-colors">
                    View Details
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-12 max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-foreground mb-8">
                  Thousands of developers and designers use 4Corners AI to bootstrap products faster.
                </p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-lg"
                >
                  Create Your Design System
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Showcase Details Modal - Properly Centered */}
        <AnimatePresence>
          {selectedExample && (
            <>
              {/* Full-Screen Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />
              
              {/* Centered Modal Container with Flexbox */}
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-6xl max-h-[90vh] glass-strong rounded-2xl border border-white/20 overflow-hidden pointer-events-auto shadow-2xl"
                >
                  {/* Scrollable Content Area */}
                  <div className="p-8 max-h-[90vh] overflow-y-auto">
                    {/* Close Button - Fixed Position */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="mb-6 pr-12">
                      <h2 className="font-heading text-3xl font-bold mb-2">
                        {selectedExample.name}
                      </h2>
                      <p className="text-muted-foreground">{selectedExample.description}</p>
                    </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab("colors")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                      activeTab === "colors"
                        ? "text-foreground border-purple-500"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Colors
                  </button>
                  <button
                    onClick={() => setActiveTab("typography")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                      activeTab === "typography"
                        ? "text-foreground border-purple-500"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Typography
                  </button>
                  <button
                    onClick={() => setActiveTab("components")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors border-b-2",
                      activeTab === "components"
                        ? "text-foreground border-purple-500"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <Box className="w-4 h-4 inline mr-2" />
                    Components
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mb-6">
                  {activeTab === "colors" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-4">Color Palette</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="glass rounded-xl p-4">
                            <div
                              className="w-full h-24 rounded-lg mb-3 border-2 border-white/20"
                              style={{ backgroundColor: selectedExample.primaryColor }}
                            />
                            <p className="text-sm font-medium mb-1">Primary</p>
                            <p className="text-xs font-mono text-muted-foreground">
                              {selectedExample.primaryColor}
                            </p>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div
                              className="w-full h-24 rounded-lg mb-3 border-2 border-white/20"
                              style={{ backgroundColor: selectedExample.secondaryColor }}
                            />
                            <p className="text-sm font-medium mb-1">Secondary</p>
                            <p className="text-xs font-mono text-muted-foreground">
                              {selectedExample.secondaryColor}
                            </p>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div
                              className="w-full h-24 rounded-lg mb-3 border-2 border-white/20"
                              style={{ backgroundColor: selectedExample.accentColor }}
                            />
                            <p className="text-sm font-medium mb-1">Accent</p>
                            <p className="text-xs font-mono text-muted-foreground">
                              {selectedExample.accentColor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "typography" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-4">Typography System</h3>
                        <div className="glass rounded-xl p-6 space-y-4">
                          <div>
                            <h4 className="font-heading text-3xl font-bold mb-2">
                              Heading Font
                            </h4>
                            <p className="text-sm text-muted-foreground">Space Grotesk</p>
                          </div>
                          <div>
                            <h4 className="font-sans text-lg mb-2">Body Font</h4>
                            <p className="text-sm text-muted-foreground">Inter</p>
                          </div>
                          <div className="pt-4 border-t border-white/10">
                            <p className="font-heading text-2xl font-bold mb-2">
                              Design System Heading
                            </p>
                            <p className="font-sans text-base text-muted-foreground">
                              This is how the typography system looks in practice. The heading
                              font provides strong hierarchy while the body font ensures excellent
                              readability.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "components" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-4">Component Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Button Preview */}
                          <div className="glass rounded-xl p-6">
                            <p className="text-sm font-medium mb-3">Button</p>
                            <button
                              className="w-full px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                              style={{
                                background: `linear-gradient(to right, ${selectedExample.primaryColor}, ${selectedExample.secondaryColor})`,
                              }}
                            >
                              Primary Button
                            </button>
                          </div>

                          {/* Card Preview */}
                          <div className="glass rounded-xl p-6">
                            <p className="text-sm font-medium mb-3">Card</p>
                            <div
                              className="glass-strong rounded-lg p-4 border"
                              style={{
                                borderColor: `${selectedExample.primaryColor}30`,
                              }}
                            >
                              <h4 className="font-semibold mb-2">Card Title</h4>
                              <p className="text-sm text-muted-foreground">
                                Sample card component preview
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                    {/* Generate Similar Button */}
                    <div className="pt-6 border-t border-white/10">
                      <button
                        onClick={handleGenerateSimilar}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Generate Similar System
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
