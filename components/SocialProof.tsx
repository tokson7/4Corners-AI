"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Placeholder company logos - using gradient boxes with text
const companies = [
  { name: "TechCorp", gradient: "from-blue-500 to-cyan-500" },
  { name: "DesignLab", gradient: "from-purple-500 to-pink-500" },
  { name: "InnovateCo", gradient: "from-indigo-500 to-purple-500" },
  { name: "StudioX", gradient: "from-pink-500 to-rose-500" },
  { name: "CreativeHub", gradient: "from-cyan-500 to-blue-500" },
  { name: "PixelForge", gradient: "from-purple-500 to-blue-500" },
];

export default function SocialProof() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-lg text-muted-foreground mb-8">
            Trusted by 10,000+ designers and developers
          </p>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "glass rounded-xl p-6",
                  "hover:glass-strong transition-all",
                  "flex items-center justify-center",
                  "group cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-full h-12 rounded-lg bg-gradient-to-br",
                    company.gradient,
                    "flex items-center justify-center",
                    "opacity-60 group-hover:opacity-100 transition-opacity"
                  )}
                >
                  <span className="text-white font-heading font-semibold text-sm">
                    {company.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
