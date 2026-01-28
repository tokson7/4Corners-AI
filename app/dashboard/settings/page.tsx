'use client'

import { UserProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-purple-200">
            Manage your profile, security, and preferences
          </p>
        </div>

        {/* Clerk User Profile Component */}
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white/5 backdrop-blur-xl border border-purple-500/20 shadow-2xl",
              navbar: "bg-purple-900/30",
              navbarButton: "text-white hover:bg-purple-500/20",
              navbarButtonActive: "bg-purple-500/30 text-white",
              profileSection: "text-white",
              profileSectionTitle: "text-white",
              profileSectionContent: "text-purple-100",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
              formFieldLabel: "text-white",
              formFieldInput: "bg-white/10 border-purple-500/20 text-white",
              // ✅ HIDE ALL CLERK BRANDING
              badge: "hidden",
              footer: "hidden",
              footerAction: "hidden",
              organizationSwitcherPopoverFooter: "hidden",
              userButtonPopoverFooter: "hidden",
              userButtonPopoverCard__footer: "hidden",
            },
            variables: {
              colorPrimary: "#8B5CF6",
              colorText: "#FFFFFF",
              colorTextSecondary: "#E9D5FF",
              colorBackground: "transparent",
            }
          }}
        />
      </div>
    </div>
  )
}
