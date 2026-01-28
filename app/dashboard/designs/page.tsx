'use client';

/**
 * All Design Systems Page
 * 
 * Displays all saved design systems with:
 * - Search functionality
 * - Filter by public/private
 * - Grid layout
 * - Empty states
 * - Create new CTA
 */

import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DesignSystemCard } from '@/components/dashboard/DesignSystemCard';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

interface DesignSystem {
  id: string;
  name: string;
  description?: string | null;
  colors: any;
  isPublic: boolean;
  createdAt: string;
}

export default function DesignsPage() {
  const [systems, setSystems] = useState<DesignSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const res = await fetch('/api/design-systems');
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSystems(data.systems || []);
        }
      }
    } catch (error) {
      setSystems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter systems based on search and filter
  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'public' ? system.isPublic :
      !system.isPublic;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your design systems...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="fixed inset-0 gradient-subtle -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Design Systems
              </h1>
              <p className="text-muted-foreground mt-2">
                {systems.length} design system{systems.length !== 1 ? 's' : ''} created
              </p>
            </div>

            <Link href="/generate">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create New
              </motion.button>
            </Link>
          </motion.div>

          {/* Search & Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search design systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/10 
                         focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                         transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-3 glass rounded-xl border border-white/10 
                       focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                       transition-all text-foreground cursor-pointer"
            >
              <option value="all">All Systems</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </motion.div>

          {/* Grid or Empty State */}
          <AnimatePresence mode="wait">
            {filteredSystems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  {searchQuery ? (
                    <Search className="w-10 h-10 text-purple-400" />
                  ) : (
                    <Plus className="w-10 h-10 text-purple-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {searchQuery 
                    ? 'No matching systems' 
                    : systems.length === 0 
                      ? 'No design systems yet'
                      : 'No systems match this filter'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Try a different search term or clear filters' 
                    : 'Create your first design system to get started'}
                </p>
                {!searchQuery && systems.length === 0 && (
                  <Link href="/generate">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Generate Design System
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredSystems.map((system, index) => (
                  <motion.div
                    key={system.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <DesignSystemCard 
                      system={system} 
                      onDelete={fetchSystems}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
