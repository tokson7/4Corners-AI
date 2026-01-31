import { Palette, Type, Grid3x3, GitBranch, Eye, Sparkles } from 'lucide-react'

interface BlogImagePlaceholderProps {
  category: string
  featured?: boolean
}

// Category-specific configuration
const categoryConfig: Record<string, {
  icon: any
  gradient: string
  meshColors: {
    top: string
    right: string
    bottom: string
  }
}> = {
  'Color Theory': {
    icon: Palette,
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    meshColors: {
      top: 'from-purple-400/40',
      right: 'from-pink-400/40',
      bottom: 'from-purple-600/40',
    }
  },
  'Typography': {
    icon: Type,
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    meshColors: {
      top: 'from-blue-400/40',
      right: 'from-cyan-400/40',
      bottom: 'from-blue-600/40',
    }
  },
  'Design Systems': {
    icon: Grid3x3,
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    meshColors: {
      top: 'from-green-400/40',
      right: 'from-emerald-400/40',
      bottom: 'from-green-600/40',
    }
  },
  'Workflow': {
    icon: GitBranch,
    gradient: 'from-orange-500 via-amber-500 to-orange-600',
    meshColors: {
      top: 'from-orange-400/40',
      right: 'from-amber-400/40',
      bottom: 'from-orange-600/40',
    }
  },
  'Accessibility': {
    icon: Eye,
    gradient: 'from-pink-500 via-rose-500 to-pink-600',
    meshColors: {
      top: 'from-pink-400/40',
      right: 'from-rose-400/40',
      bottom: 'from-pink-600/40',
    }
  },
}

export function BlogImagePlaceholder({ category, featured = false }: BlogImagePlaceholderProps) {
  // Get config or fallback to default
  const config = categoryConfig[category] || {
    icon: Sparkles,
    gradient: 'from-purple-500 via-blue-500 to-purple-600',
    meshColors: {
      top: 'from-purple-400/40',
      right: 'from-blue-400/40',
      bottom: 'from-purple-600/40',
    }
  }
  
  const IconComponent = config.icon
  const iconSize = featured ? 'w-32 h-32' : 'w-20 h-20'
  const height = featured ? 'h-80' : 'h-48'
  
  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden`}>
      {/* Base gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
      
      {/* Mesh gradient effect - multiple overlapping gradients */}
      <div className="absolute inset-0 opacity-60">
        {/* Top-left gradient */}
        <div className={`
          absolute top-0 left-0 w-full h-full 
          bg-gradient-to-br ${config.meshColors.top} 
          via-transparent to-transparent
        `} />
        
        {/* Top-right gradient */}
        <div className={`
          absolute top-0 right-0 w-full h-full 
          bg-gradient-to-bl ${config.meshColors.right} 
          via-transparent to-transparent
        `} />
        
        {/* Bottom-left gradient */}
        <div className={`
          absolute bottom-0 left-0 w-full h-full 
          bg-gradient-to-tr ${config.meshColors.bottom} 
          via-transparent to-transparent
        `} />
      </div>
      
      {/* Decorative blur circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      {/* Icon with glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Glow behind icon */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />
          {/* Icon */}
          <IconComponent className={`relative ${iconSize} text-white/30`} />
        </div>
      </div>
    </div>
  )
}
