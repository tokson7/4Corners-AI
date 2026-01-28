'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  ClipboardList,
  Sparkles,
  Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AnimatedCubeLogo from '@/components/AnimatedCubeLogo'

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Design Systems',
    href: '/admin/designs',
    icon: FileText,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Activity Logs',
    href: '/admin/logs',
    icon: ClipboardList,
  },
  {
    name: 'Emails',
    href: '/admin/emails',
    icon: Mail,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-900 border-r border-white/10 pt-5">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 px-6 mb-8">
            <AnimatedCubeLogo />
            <div>
              <h1 className="text-xl font-bold text-white">4Corners AI</h1>
              <p className="text-xs text-purple-400">Admin Panel</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Back to Site */}
          <div className="px-3 pb-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-200 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Back to Site
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
