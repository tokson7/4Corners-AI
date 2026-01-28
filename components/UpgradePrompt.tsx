"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  feature: string;
  requiredPlan?: "pro" | "team";
  className?: string;
}

export default function UpgradePrompt({
  feature,
  requiredPlan = "pro",
  className,
}: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass rounded-xl p-6 border border-purple-500/20",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold mb-2">
            {feature} is a {requiredPlan === "pro" ? "Pro" : "Team"} feature
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to {requiredPlan === "pro" ? "Pro" : "Team"} to unlock {feature.toLowerCase()}{" "}
            and access all premium features.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to {requiredPlan === "pro" ? "Pro" : "Team"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
