"use client";

import { motion } from "framer-motion";
import { Twitter, Github } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AnimatedCubeLogo from "@/components/AnimatedCubeLogo";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Documentation", href: "/documentation" },
  { label: "API", href: "/api-access" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <AnimatedCubeLogo />
            <div>
              <span className="font-heading text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                4Corners AI
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                © 2026 4Corners AI
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-lg glass",
                  "hover:glass-strong transition-all",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
