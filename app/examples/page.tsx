"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ExampleDetailModal from "@/components/ExampleDetailModal";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

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
  category: string;
}

const exampleDesignSystems: ExampleDesignSystem[] = [
  {
    id: "fintech-pro",
    name: "FinTech Pro",
    description: "Corporate blue design system for financial technology platforms",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#10B981",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Input", "Card", "Modal", "Table", "Chart"],
    category: "Finance",
  },
  {
    id: "ecolife",
    name: "EcoLife",
    description: "Sustainable green design system for eco-friendly brands",
    colors: {
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#F59E0B",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Card", "Badge", "Alert", "Progress"],
    category: "Sustainability",
  },
  {
    id: "healthcare-plus",
    name: "HealthCare+",
    description: "Medical blue design system for healthcare applications",
    colors: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#10B981",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Input", "Card", "Modal", "Alert", "Form"],
    category: "Healthcare",
  },
  {
    id: "creativehub",
    name: "CreativeHub",
    description: "Bold purple design system for creative agencies",
    colors: {
      primary: "#8B5CF6",
      secondary: "#A78BFA",
      accent: "#EC4899",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Card", "Badge", "Modal", "Gallery"],
    category: "Creative",
  },
  {
    id: "fooddelivery",
    name: "FoodDelivery",
    description: "Fresh orange design system for food delivery platforms",
    colors: {
      primary: "#F59E0B",
      secondary: "#FB923C",
      accent: "#EF4444",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Card", "Badge", "Modal", "Rating"],
    category: "Food",
  },
  {
    id: "gaming-arena",
    name: "Gaming Arena",
    description: "Neon purple design system for gaming platforms",
    colors: {
      primary: "#A855F7",
      secondary: "#C084FC",
      accent: "#EC4899",
    },
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
    },
    components: ["Button", "Card", "Badge", "Modal", "Progress", "Leaderboard"],
    category: "Gaming",
  },
];

export default function ExamplesPage() {
  const [selectedExample, setSelectedExample] = useState<ExampleDesignSystem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (example: ExampleDesignSystem) => {
    setSelectedExample(example);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-subtle -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />
      
      <PageTransition>
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Design System Examples
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore real-world design systems generated with 4Corners AI
              </p>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exampleDesignSystems.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="glass rounded-2xl overflow-hidden hover:glass-strong transition-all h-full flex flex-col">
                    {/* Preview Image */}
                    <div
                      className="w-full h-48 relative"
                      style={{
                        background: `linear-gradient(135deg, ${example.colors.primary} 0%, ${example.colors.secondary} 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 rounded-full glass text-xs font-medium text-white backdrop-blur-md">
                          {example.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <h3 className="font-heading text-xl font-semibold mb-2">
                          {example.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {example.description}
                        </p>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex gap-2 mb-4">
                        <div
                          className="w-8 h-8 rounded-lg shadow-md border-2 border-white/20"
                          style={{ backgroundColor: example.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-8 h-8 rounded-lg shadow-md border-2 border-white/20"
                          style={{ backgroundColor: example.colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-8 h-8 rounded-lg shadow-md border-2 border-white/20"
                          style={{ backgroundColor: example.colors.accent }}
                          title="Accent"
                        />
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(example)}
                        className="mt-auto w-full px-4 py-2 rounded-lg glass-strong border border-white/20 text-foreground font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <div className="glass-strong rounded-2xl p-8 inline-block">
                <h2 className="font-heading text-2xl font-bold mb-4">
                  Ready to Create Your Own?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Generate a custom design system tailored to your brand in seconds
                </p>
                <a
                  href="/generate"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Start Generating
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>

      {/* Detail Modal */}
      <ExampleDetailModal
        example={selectedExample}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </main>
  );
}
