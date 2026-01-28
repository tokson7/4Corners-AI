"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-subtle -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

      <div className="flex items-center justify-center min-h-screen px-6 py-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              Sign in to 4Corners AI
            </h1>
            <p className="text-muted-foreground">
              Access your generated design systems and continue where you left off.
            </p>
          </motion.div>

          {/* Clerk Sign In Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <SignIn
              afterSignInUrl="/api/auth/callback"
              afterSignUpUrl="/api/auth/callback"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "glass rounded-2xl shadow-2xl border border-white/10",
                  headerTitle: "font-heading text-2xl font-bold text-foreground",
                  headerSubtitle: "text-muted-foreground",
                  socialButtonsBlockButton:
                    "glass-strong border border-white/20 text-foreground hover:bg-white/10 transition-colors",
                  formButtonPrimary:
                    "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity",
                  formFieldInput:
                    "glass-strong border border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500",
                  formFieldLabel: "text-foreground",
                  footerActionLink: "text-purple-400 hover:text-purple-300",
                  identityPreviewText: "text-foreground",
                  identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
                  formResendCodeLink: "text-purple-400 hover:text-purple-300",
                  otpCodeFieldInput:
                    "glass-strong border border-white/20 text-foreground focus:ring-2 focus:ring-purple-500",
                  // ✅ HIDE CLERK BRANDING
                  footer: "hidden",
                  footerAction: "hidden",
                  badge: "hidden",
                },
                variables: {
                  colorPrimary: "#8B5CF6",
                  colorText: "hsl(210, 40%, 98%)",
                  colorTextSecondary: "hsl(215, 20.2%, 65.1%)",
                  colorBackground: "hsl(222.2, 84%, 4.9%)",
                  colorInputBackground: "rgba(255, 255, 255, 0.1)",
                  colorInputText: "hsl(210, 40%, 98%)",
                  borderRadius: "0.5rem",
                },
              }}
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
            />
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center space-y-2"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

