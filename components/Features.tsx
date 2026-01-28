"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    emoji: "🎨",
    title: "AI Color Generation",
    description: "Smart color palettes based on psychology and brand identity",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    emoji: "🔤",
    title: "Typography Pairing",
    description: "Perfect font combinations powered by design theory",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    emoji: "🧩",
    title: "Component Library",
    description: "Export ready-to-use components in React, Vue, or plain CSS",
    gradient: "from-purple-500 to-blue-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create and maintain world-class design systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "glass rounded-2xl p-8",
                "hover:glass-strong transition-all",
                "group cursor-pointer text-center"
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br",
                  feature.gradient,
                  "mb-6 group-hover:scale-110 transition-transform text-3xl"
                )}
              >
                {feature.emoji}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
