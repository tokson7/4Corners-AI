import { NextResponse } from 'next/server'

// SVG for the cube logo - same as AnimatedCubeLogo component
const cubeSVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
  <!-- Top Face with 3 lines -->
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <g filter="url(#shadow)">
    <!-- Top Face -->
    <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="rgba(139, 92, 246, 0.15)" stroke="rgba(139, 92, 246, 0.4)" stroke-width="1"/>
    <line x1="35" y1="30" x2="65" y2="30" stroke="#06B6D4" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="35" y1="37" x2="65" y2="37" stroke="#3B82F6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="35" y1="44" x2="65" y2="44" stroke="#8B5CF6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    
    <!-- Left Face -->
    <path d="M20 35 L20 65 L50 80 L50 50 Z" fill="rgba(99, 102, 241, 0.12)" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1"/>
    <line x1="25" y1="47" x2="45" y2="57" stroke="#06B6D4" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="25" y1="54" x2="45" y2="64" stroke="#3B82F6" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="25" y1="61" x2="45" y2="71" stroke="#8B5CF6" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    
    <!-- Right Face -->
    <path d="M50 50 L50 80 L80 65 L80 35 Z" fill="rgba(167, 139, 250, 0.18)" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1"/>
    <line x1="55" y1="47" x2="75" y2="57" stroke="#06B6D4" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="55" y1="54" x2="75" y2="64" stroke="#3B82F6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="55" y1="61" x2="75" y2="71" stroke="#8B5CF6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    
    <!-- Edge highlights -->
    <path d="M50 20 L80 35" stroke="rgba(255, 255, 255, 0.2)" stroke-width="0.5"/>
    <path d="M50 20 L20 35" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.5"/>
    <path d="M50 80 L50 50" stroke="rgba(255, 255, 255, 0.1)" stroke-width="0.5"/>
  </g>
</svg>`

export async function GET() {
  return new NextResponse(cubeSVG, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
