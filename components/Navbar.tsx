'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import AnimatedCubeLogo from './AnimatedCubeLogo'

export function Navbar() {
  const pathname = usePathname()
  
  // Hide navbar in admin panel
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <AnimatedCubeLogo />
            <span className="text-xl font-bold text-white">4Corners AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-purple-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/showcase" className="text-purple-300 hover:text-white transition-colors">
              Showcase
            </Link>
            <Link href="/pricing" className="text-purple-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
