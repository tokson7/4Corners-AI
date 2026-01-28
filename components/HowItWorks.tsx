"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Describe Your Brand",
    description: "Input text",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Generates System",
    description: "Processing animation",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    icon: Download,
    title: "Export & Use",
    description: "Download / Copy",
    gradient: "from-purple-500 to-blue-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your design system in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 -z-10" style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }} />
              )}

              <div className={cn(
                "glass rounded-2xl p-8 text-center",
                "hover:glass-strong transition-all",
                "group relative"
              )}>
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={cn(
                    "w-12 h-12 rounded-full bg-gradient-to-br",
                    step.gradient,
                    "flex items-center justify-center text-white font-heading font-bold text-lg",
                    "shadow-lg group-hover:scale-110 transition-transform"
                  )}>
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className={cn(
                  "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br",
                  step.gradient,
                  "mb-6 group-hover:scale-110 transition-transform mt-4"
                )}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Processing animation for step 2 */}
                {index === 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                )}

                {/* Input text preview for step 1 */}
                {index === 0 && (
                  <div className="mt-6 glass rounded-lg p-3 text-left">
                    <div className="h-2 w-3/4 rounded bg-gradient-to-r from-purple-500/30 to-blue-500/30 mb-2" />
                    <div className="h-2 w-full rounded bg-gradient-to-r from-purple-500/30 to-blue-500/30 mb-2" />
                    <div className="h-2 w-2/3 rounded bg-gradient-to-r from-purple-500/30 to-blue-500/30" />
                  </div>
                )}

                {/* Download/Copy icons for step 3 */}
                {index === 2 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -4 }}
                      className="glass rounded-lg p-3 cursor-pointer"
                    >
                      <Download className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, y: -4 }}
                      className="glass rounded-lg p-3 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
