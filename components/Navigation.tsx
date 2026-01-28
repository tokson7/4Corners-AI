"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { GlassUserMenu } from "./GlassUserMenu";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import AnimatedCubeLogo from "./AnimatedCubeLogo";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  
  // Auto-hide navigation on scroll
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isVisible = scrollDirection === 'up' || scrollDirection === 'top';
  
  // Hide navigation in admin panel (AFTER all hooks are called)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'transparent',
          willChange: 'transform',
        }}
        className="px-6 py-4"
      >
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "glass rounded-2xl px-6 py-4",
          "flex items-center justify-between"
        )}>
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background rounded-lg p-1 -m-1"
            aria-label="4Corners AI Home"
          >
            <AnimatedCubeLogo />
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              4Corners AI
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/features" 
              className={cn(
                "text-sm transition-colors",
                pathname === "/features" 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Features
            </Link>
            <Link 
              href="/showcase" 
              className={cn(
                "text-sm transition-colors",
                pathname === "/showcase" 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Showcase
            </Link>
            <Link 
              href="/pricing" 
              className={cn(
                "text-sm transition-colors",
                pathname === "/pricing" 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pricing
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            {!isLoaded ? (
              // Loading state - prevent layout shift
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg glass animate-pulse" />
                <div className="w-20 h-8 rounded-lg glass animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm transition-colors",
                    pathname === "/dashboard"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <GlassUserMenu />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2"
          >
            <div className="glass rounded-2xl p-4 space-y-3">
              <Link
                href="/features"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-sm transition-colors py-2",
                  pathname === "/features"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Features
              </Link>
              <Link
                href="/showcase"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-sm transition-colors py-2",
                  pathname === "/showcase"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Showcase
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-sm transition-colors py-2",
                  pathname === "/pricing"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Pricing
              </Link>
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </>
                  )}
                </button>
                {!isLoaded ? (
                  // Loading state - prevent layout shift
                  <div className="space-y-2">
                    <div className="w-full h-10 rounded-lg glass animate-pulse" />
                    <div className="w-full h-10 rounded-lg glass animate-pulse" />
                  </div>
                ) : isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block text-sm transition-colors py-2",
                        pathname === "/dashboard"
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Account</span>
                      <GlassUserMenu />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background rounded"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
