"use client";

/**
 * Generator Page
 * 
 * Main page for AI-powered design system generation.
 * Uses the GeneratorForm component for a streamlined UX.
 */

import { motion } from "framer-motion";
import { GeneratorForm } from "@/components/generator";
import PageTransition from "@/components/PageTransition";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function GeneratePage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Animated Falling Stars Background */}
        <AnimatedBackground />

        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Generate Your
                </span>
                <br />
                <span className="text-foreground">Design System</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered color palettes, typography, and components based on your brand
              </p>
            </motion.header>

            {/* Generator Form */}
            <GeneratorForm />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
