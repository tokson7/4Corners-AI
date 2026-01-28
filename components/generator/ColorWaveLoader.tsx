'use client'

import { useEffect, useState } from 'react'

const COLORS = [
  ['#8B5CF6', '#EC4899'], // Purple to Pink
  ['#06B6D4', '#3B82F6'], // Cyan to Blue
  ['#10B981', '#059669'], // Green to Emerald
  ['#F59E0B', '#EF4444'], // Amber to Red
  ['#EC4899', '#8B5CF6'], // Pink to Purple
  ['#3B82F6', '#06B6D4'], // Blue to Cyan
  ['#A855F7', '#EC4899'], // Purple variant
  ['#14B8A6', '#06B6D4'], // Teal to Cyan
  ['#F97316', '#EF4444'], // Orange to Red
]

export function ColorWaveLoader() {
  const [colors, setColors] = useState(COLORS)

  useEffect(() => {
    const interval = setInterval(() => {
      setColors(prev => {
        const newColors = [...prev]
        newColors.push(newColors.shift()!)
        return newColors
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-center py-12">
      {/* 3×3 Animated Color Grid - Clean, No Text */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const colorPair = colors[index % colors.length]
          
          return (
            <div
              key={index}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-500 animate-color-wave"
              style={{
                animationDelay: `${index * 0.15}s`,
                background: `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`,
                boxShadow: `0 4px 20px ${colorPair[0]}40`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
