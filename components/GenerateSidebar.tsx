"use client";

import { motion } from "framer-motion";
import { Sparkles, Check, Circle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDesignSystemStore } from "@/store/useDesignSystemStore";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Describe Brand" },
  { id: 2, label: "AI Processing" },
  { id: 3, label: "Review Results" },
  { id: 4, label: "Export" },
];

export default function GenerateSidebar() {
  const currentStep = useDesignSystemStore((state) => state.currentStep);
  
  const updatedSteps = steps.map((step) => ({
    ...step,
    completed: step.id < currentStep,
    active: step.id === currentStep,
  }));

  return (
    <aside className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 w-full lg:bg-background/95 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col relative z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            4Corners AI
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 p-6">
        <h2 className="font-heading text-lg font-semibold mb-6 text-muted-foreground">
          Progress
        </h2>
        <div className="space-y-4">
          {updatedSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                step.completed
                  ? "bg-purple-500/10 border border-purple-500/20"
                  : step.active
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : "hover:bg-white/5 transition-colors"
              )}
            >
              {step.completed ? (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : step.active ? (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Circle className="w-4 h-4 text-white fill-white" />
                  </motion.div>
                </div>
              ) : (
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                  <Circle className="w-3 h-3 text-muted-foreground/30" />
                </div>
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  step.completed || step.active
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.id}. {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="p-6 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
