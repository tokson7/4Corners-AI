"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Palette, Type, Box, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

const coreFeatures = [
  {
    icon: Palette,
    title: "AI Color System",
    description: "Psychology-based color palettes with accessibility checks and semantic meaning.",
    bullets: [
      "Primary, secondary, accent colors",
      "Automatic shade generation (50–900)",
      "WCAG AA contrast validation",
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Type,
    title: "Typography Intelligence",
    description: "Professionally paired fonts with modular type scales.",
    bullets: [
      "Heading + body pairing",
      "Modular scale",
      "Line heights & font weights",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Box,
    title: "Component Generator",
    description: "Ready-to-use UI components generated from your design tokens.",
    bullets: [
      "Buttons, inputs, cards, modals",
      "React, Tailwind, CSS support",
      "Consistent spacing & radius",
    ],
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: Download,
    title: "Export System",
    description: "Export your system directly into your codebase.",
    bullets: [
      "CSS variables",
      "Tailwind config",
      "Component files",
      "ZIP download",
    ],
    gradient: "from-green-500 to-emerald-500",
  },
];

const steps = [
  {
    number: "1",
    title: "Describe Brand",
    description: "Tell us about your brand, industry, and target audience",
    link: "/generate",
  },
  {
    number: "2",
    title: "AI Processing",
    description: "Our AI analyzes your brand and generates a complete design system",
    link: "/generate",
  },
  {
    number: "3",
    title: "Review System",
    description: "Review colors, typography, and components before exporting",
    link: "/generate",
  },
  {
    number: "4",
    title: "Export",
    description: "Download your design system in your preferred format",
    link: "/generate",
  },
];

export default function FeaturesPage() {
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
              className="text-center mb-20"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Everything you need to build a design system — instantly
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                4Corners AI turns brand ideas into production-ready design systems.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Generate Your Design System
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Core Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-20"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
                Core Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="glass rounded-2xl p-8 hover:glass-strong transition-all"
                    >
                      <div
                        className={cn(
                          "inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br mb-6",
                          feature.gradient
                        )}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-heading text-2xl font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* How Features Connect to Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <Link
                    key={index}
                    href={step.link}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      className="glass rounded-2xl p-6 hover:glass-strong transition-all h-full text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-heading text-xl font-bold mb-4">
                        {step.number}
                      </div>
                      <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-12 max-w-3xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Start building your design system
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Generate a complete design system in seconds, not weeks.
                </p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity text-lg"
                >
                  Generate Your Design System
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
