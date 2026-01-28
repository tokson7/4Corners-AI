'use client'

import { useState, useEffect } from 'react'

type ScrollDirection = 'up' | 'down' | 'top'

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('top')
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      // Check if at top (within 100px)
      const atTop = scrollY < 100
      setIsAtTop(atTop)

      // Ignore small movements (< 10px noise reduction)
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false
        return
      }

      if (scrollY < 100) {
        // At top of page
        setScrollDirection('top')
      } else if (scrollY > lastScrollY) {
        // Scrolling down
        setScrollDirection('down')
      } else if (scrollY < lastScrollY) {
        // Scrolling up
        setScrollDirection('up')
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    // Passive listener for better scroll performance
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { scrollDirection, isAtTop }
}
