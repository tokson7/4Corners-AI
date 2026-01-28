"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const colorPalettes = [
  { colors: ["#8B5CF6", "#6366F1", "#EC4899"], delay: 0 },
  { colors: ["#3B82F6", "#06B6D4", "#8B5CF6"], delay: 0.2 },
  { colors: ["#EC4899", "#F59E0B", "#10B981"], delay: 0.4 },
  { colors: ["#6366F1", "#8B5CF6", "#EC4899"], delay: 0.6 },
  { colors: ["#06B6D4", "#3B82F6", "#8B5CF6"], delay: 0.8 },
];

const gradientOrbs = [
  { x: "10%", y: "20%", gradient: "from-purple-500/30 to-blue-500/30", delay: 0 },
  { x: "80%", y: "30%", gradient: "from-blue-500/30 to-purple-500/30", delay: 0.3 },
  { x: "20%", y: "70%", gradient: "from-pink-500/30 to-purple-500/30", delay: 0.6 },
  { x: "70%", y: "80%", gradient: "from-cyan-500/30 to-blue-500/30", delay: 0.9 },
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {gradientOrbs.map((orb, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              delay: orb.delay,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute w-72 h-72 rounded-full blur-3xl",
              `bg-gradient-to-br ${orb.gradient}`
            )}
            style={{
              left: orb.x,
              top: orb.y,
            }}
          />
        ))}
      </div>

      {/* Floating color palette cards */}
      <div className="absolute inset-0 pointer-events-none">
        {colorPalettes.map((palette, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              y: [0, -40, 0],
              x: [0, Math.sin(index) * 20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: palette.delay,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute glass-strong rounded-2xl p-4 shadow-2xl",
              "w-32 h-32"
            )}
            style={{
              left: `${10 + index * 20}%`,
              top: `${15 + (index % 3) * 30}%`,
            }}
          >
            <div className="flex flex-col gap-2 h-full">
              {palette.colors.map((color, colorIndex) => (
                <motion.div
                  key={colorIndex}
                  className="flex-1 rounded-lg"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Design Systems,
            </span>
            <br />
            <span className="text-foreground">Powered by AI</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/generate"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Generating
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/examples"
              className="px-8 py-4 rounded-xl glass-strong border border-white/20 text-foreground font-medium hover:bg-white/5 transition-colors"
            >
              View Examples
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
