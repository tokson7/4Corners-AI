'use client'

import { Twitter, Linkedin, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  
  const handleShare = async (platform: string) => {
    const shareUrl = `https://designforge.ai${url}`
    
    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      )
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      )
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60">Share:</span>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4 text-white/80" />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-white/80" />
      </button>
      {canShare && (
        <button
          onClick={() => handleShare('native')}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4 text-white/80" />
        </button>
      )}
    </div>
  )
}
