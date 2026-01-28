'use client';

/**
 * Dashboard Homepage
 * 
 * Shows:
 * - User stats (credits, designs created)
 * - Recent design systems (max 5)
 * - Quick actions
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, Plus, Sparkles, FileText, Zap } from 'lucide-react';
import { DesignSystemCard } from '@/components/dashboard/DesignSystemCard';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

interface DesignSystem {
  id: string;
  name: string;
  description?: string | null;
  brandDescription?: string | null;
  colors: any;
  isPublic: boolean;
  featured: boolean;
  status: string;
  createdAt: string;
}

interface UserStats {
  credits: number;
  designSystemsCount: number;
  createdAt?: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [recentSystems, setRecentSystems] = useState<DesignSystem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both APIs in parallel for 2x faster loading
        const [systemsRes, statsRes] = await Promise.all([
          fetch('/api/design-systems?limit=5'),
          fetch('/api/user/profile')
        ]);
        
        // Process systems response
        if (systemsRes.ok) {
          const systemsData = await systemsRes.json();
          if (systemsData.success) {
            setRecentSystems(systemsData.systems || []);
          }
        }

        // Process stats response
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setUserStats({
              credits: statsData.user.credits || 0,
              designSystemsCount: statsData.user.designSystemsCount || 0,
              createdAt: statsData.user.createdAt
            });
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setRecentSystems([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Check if user is new (created within last 24 hours)
  // Default to true while loading to show "Welcome" instead of "Welcome back"
  const isNewUser = userStats?.createdAt 
    ? new Date().getTime() - new Date(userStats.createdAt).getTime() < 24 * 60 * 60 * 1000
    : true; // Default to new user while loading to avoid "Welcome back" flicker

  const handleSystemDeleted = () => {
    // Refresh data after deletion
    setRecentSystems(prev => {
      const newSystems = prev.slice(0, -1);
      return newSystems;
    });
    if (userStats) {
      setUserStats(prev => prev ? { ...prev, designSystemsCount: prev.designSystemsCount - 1 } : null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="fixed inset-0 gradient-subtle -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {isNewUser ? 'Welcome' : 'Welcome back'}, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              {isNewUser 
                ? "Let's create your first amazing design system!" 
                : "Ready to create amazing design systems?"}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Credits Card */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">AI Credits</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : userStats?.credits || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Available credits</p>
            </div>

            {/* Design Systems Card */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground">Design Systems</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : recentSystems.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Created so far</p>
            </div>

            {/* Quick Action Card */}
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
              <Link href="/generate" className="block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                    Create New
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate a new design system with AI
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-400 group-hover:gap-3 transition-all">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Design Systems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Design Systems</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading ? 'Loading...' : `Showing recent ${Math.min(recentSystems.length, 5)}`}
                </p>
              </div>
              
              {recentSystems.length > 0 && (
                <Link href="/dashboard/designs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 glass rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass rounded-2xl p-6 border border-white/10 animate-pulse">
                    <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
                    <div className="h-6 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : recentSystems.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-12 border border-white/10 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  No design systems yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven&apos;t created any design systems yet. Start by generating your first one with AI!
                </p>
                <Link href="/generate">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Design System
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              // Design Systems Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentSystems.map((system, index) => (
                  <motion.div
                    key={system.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DesignSystemCard 
                      system={system} 
                      onDelete={handleSystemDeleted}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
