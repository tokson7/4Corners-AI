'use client'

export default function AnimatedCubeLogo() {
  return (
    <div className="w-12 h-12 relative">
      {/* Animated container */}
      <div className="absolute inset-0 animate-float">
        {/* SVG Isometric Cube with 3 lines per face */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3))' }}
        >
          {/* Top Face - with 3 lines */}
          <g>
            {/* Top face base (transparent glassmorphism) */}
            <path
              d="M50 20 L80 35 L50 50 L20 35 Z"
              fill="rgba(139, 92, 246, 0.15)"
              stroke="rgba(139, 92, 246, 0.4)"
              strokeWidth="1"
            />
            
            {/* 3 horizontal lines on top face */}
            <line x1="35" y1="30" x2="65" y2="30" stroke="#06B6D4" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <line x1="35" y1="37" x2="65" y2="37" stroke="#3B82F6" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <line x1="35" y1="44" x2="65" y2="44" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
          </g>

          {/* Left Face - with 3 lines */}
          <g>
            {/* Left face base (transparent glassmorphism) */}
            <path
              d="M20 35 L20 65 L50 80 L50 50 Z"
              fill="rgba(99, 102, 241, 0.12)"
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="1"
            />
            
            {/* 3 horizontal lines on left face (angled) */}
            <line x1="25" y1="47" x2="45" y2="57" stroke="#06B6D4" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
            <line x1="25" y1="54" x2="45" y2="64" stroke="#3B82F6" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
            <line x1="25" y1="61" x2="45" y2="71" stroke="#8B5CF6" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
          </g>

          {/* Right Face - with 3 lines */}
          <g>
            {/* Right face base (transparent glassmorphism) */}
            <path
              d="M50 50 L50 80 L80 65 L80 35 Z"
              fill="rgba(167, 139, 250, 0.18)"
              stroke="rgba(167, 139, 250, 0.4)"
              strokeWidth="1"
            />
            
            {/* 3 horizontal lines on right face (angled) */}
            <line x1="55" y1="47" x2="75" y2="57" stroke="#06B6D4" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <line x1="55" y1="54" x2="75" y2="64" stroke="#3B82F6" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <line x1="55" y1="61" x2="75" y2="71" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
          </g>

          {/* Subtle edge highlights for depth */}
          <path d="M50 20 L80 35" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
          <path d="M50 20 L20 35" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
          <path d="M50 80 L50 50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
        </svg>

        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 blur-lg opacity-30 -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  )
}
