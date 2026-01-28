'use client';

/**
 * Design System Card Component
 * 
 * Displays a saved design system as a card with:
 * - Color preview
 * - Name and description
 * - Public/private badge
 * - Creation date
 * - Delete button
 * - Hover effects
 */

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, ExternalLink, Eye, Loader2, Sparkles, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesignSystemCardProps {
  system: {
    id: string;
    name: string;
    description?: string | null;
    colors: any;
    isPublic: boolean;
    tier?: string; // 'basic' or 'professional' (premium)
    createdAt: string;
  };
  onDelete?: () => void;
}

// Tier badge configuration
const TIER_BADGES = {
  basic: {
    color: 'gray',
    label: 'Basic',
    icon: Sparkles,
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-300',
    borderClass: 'border-gray-500/30',
  },
  professional: {
    color: 'purple',
    label: 'Premium',
    icon: Crown,
    bgClass: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/30',
  },
} as const;

export function DesignSystemCard({ system, onDelete }: DesignSystemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract primary color from the system
  const primaryColor = 
    system.colors?.primary?.main || 
    system.colors?.primary?.['500'] || 
    system.colors?.primary || 
    '#8B5CF6';

  // Get tier badge configuration
  const tier = (system.tier || 'basic') as keyof typeof TIER_BADGES;
  const badge = TIER_BADGES[tier];
  const BadgeIcon = badge.icon;

  // Format date
  const formattedDate = new Date(system.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${system.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      const res = await fetch(`/api/design-systems/${system.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      // Notify parent component
      onDelete?.();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete design system');
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/dashboard/designs/${system.id}`} className="block h-full">
        <div className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group relative h-full flex flex-col">
          
          {/* Tier Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`
              px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
              border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}
            `}>
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-red-500/20 disabled:opacity-50 z-10"
            title="Delete design system"
            aria-label="Delete design system"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          {/* Color Preview */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl shadow-lg flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
              aria-label="Primary color preview"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-purple-400 transition-colors truncate">
                {system.name}
              </h3>
              {system.isPublic && (
                <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                  <Eye className="w-3 h-3" />
                  Public
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {system.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
              {system.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-white/5">
            <span>{formattedDate}</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
