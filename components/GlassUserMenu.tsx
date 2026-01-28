'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import { Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

export function GlassUserMenu() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full ring-2 ring-purple-400/50 hover:ring-purple-400/80 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-400/70"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {user.imageUrl ? (
          <Image 
            src={user.imageUrl} 
            alt={user.fullName || 'User'} 
            width={40} 
            height={40}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {user.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Card */}
          <div className="absolute right-0 top-12 z-50 w-80">
            {/* Glass Card with 3 Color Bars */}
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
              {/* Background Gradient Bars */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Purple Bar */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-br from-purple-600/40 to-purple-800/40" />
                {/* Blue Bar */}
                <div className="absolute top-1/3 left-0 right-0 h-1/3 bg-gradient-to-br from-blue-600/40 to-blue-800/40" />
                {/* Pink Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-br from-pink-600/40 to-pink-800/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-5 bg-slate-900/30">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="h-12 w-12 rounded-full ring-2 ring-purple-400/50 overflow-hidden flex-shrink-0">
                    {user.imageUrl ? (
                      <Image 
                        src={user.imageUrl} 
                        alt={user.fullName || 'User'} 
                        width={48} 
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base truncate">
                      {user.fullName || user.firstName || 'User'}
                    </p>
                    <p className="text-purple-200 font-medium text-sm truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="mt-3 space-y-1">
                  {/* Manage Account */}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      window.location.href = '/dashboard/settings'
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 transition-all duration-200"
                  >
                    <Settings className="w-5 h-5 text-white" />
                    <span>Manage Account</span>
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      signOut()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold hover:bg-red-500/20 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
