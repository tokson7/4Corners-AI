"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const showcaseItems = [
  {
    title: "Design Tokens",
    description: "Centralized design tokens for colors, typography, spacing, and more.",
    href: "/showcase/design-tokens",
    preview: (
      <div className="space-y-4 p-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500" />
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500" />
        </div>
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
          <div className="h-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 w-3/4" />
        </div>
      </div>
    ),
  },
  {
    title: "Component Library",
    description: "Pre-built components ready to use in your applications.",
    href: "/showcase/components",
    preview: (
      <div className="space-y-4 p-6">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium">
            Button
          </div>
          <div className="px-4 py-2 rounded-lg glass text-sm font-medium">
            Button
          </div>
        </div>
        <div className="p-4 rounded-lg glass space-y-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
          <div className="h-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 w-2/3" />
        </div>
      </div>
    ),
  },
  {
    title: "Typography System",
    description: "Consistent typography scales and font pairings.",
    href: "/showcase/typography",
    preview: (
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20" />
          <div className="h-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 w-4/5" />
          <div className="h-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 w-3/4" />
        </div>
      </div>
    ),
  },
];

export default function Showcase() {
  return (
    <section id="showcase" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore what you can create with 4Corners AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "glass rounded-2xl overflow-hidden",
                  "hover:glass-strong transition-all group cursor-pointer"
                )}
              >
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-950/50 to-blue-950/50 p-6 border-t border-white/10">
                  {item.preview}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
