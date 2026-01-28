"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const checklistItems = [
  { id: 1, label: "Analyzing brand personality", status: "completed" },
  { id: 2, label: "Generating color palette", status: "completed" },
  { id: 3, label: "Selecting typography", status: "processing" },
  { id: 4, label: "Creating component styles", status: "pending" },
  { id: 5, label: "Building documentation", status: "pending" },
];

export default function LoadingState() {
  const progress = 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold mb-2">
          🎨 Creating your design system...
        </h2>
      </div>

      {/* Checklist */}
      <div className="space-y-4 mb-8">
        {checklistItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg",
              item.status === "completed"
                ? "bg-green-500/10 border border-green-500/20"
                : item.status === "processing"
                ? "bg-purple-500/10 border border-purple-500/20"
                : "bg-white/5 border border-white/10"
            )}
          >
            {item.status === "completed" ? (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : item.status === "processing" ? (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>
            )}
            <span
              className={cn(
                "text-sm font-medium",
                item.status === "completed"
                  ? "text-foreground"
                  : item.status === "processing"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.status === "completed" && "✅ "}
              {item.status === "processing" && "🔄 "}
              {item.status === "pending" && "⏳ "}
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Estimated Time */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Estimated time: <span className="text-foreground font-medium">8 seconds</span>
        </p>
      </div>
    </motion.div>
  );
}
