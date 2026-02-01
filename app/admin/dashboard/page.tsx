"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Zap,
  AlertCircle,
  Clock,
  Activity,
  Users,
  FileText,
  Loader2,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import PageTransition from "@/components/PageTransition";

interface UsageMetrics {
  totalGenerations: number;
  generationsPerDay: Array<{ date: string; count: number }>;
  averageGenerationTime: number;
  byType: Record<string, number>;
  successRate: number;
  errorRate: number;
}

interface AIMetrics {
  totalRequests: number;
  requestsPerDay: Array<{ date: string; count: number }>;
  totalTokensUsed: number;
  averageTokensPerRequest: number;
  errorRate: number;
  byModel: Record<string, number>;
  averageResponseTime: number;
}

interface PerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  byEndpoint: Record<string, { count: number; avgDuration: number; errorRate: number }>;
  errorRate: number;
}

interface DropOffPoint {
  step: string;
  users: number;
  dropOffRate: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();
  const [metrics, setMetrics] = useState<{
    usage: UsageMetrics;
    ai: AIMetrics;
    performance: PerformanceMetrics;
    dropOffPoints: DropOffPoint[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  // Check admin access
  const checkAdminAccess = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.status === 403) {
        router.push("/dashboard");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to verify admin access");
      }
    } catch (err) {
      console.error("Admin access check failed:", err);
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/signin?callbackUrl=/admin/dashboard");
      return;
    }

    // Check if user is admin (this would come from the API)
    if (!userLoading && isAuthenticated) {
      checkAdminAccess();
    }
  }, [userLoading, isAuthenticated, user, router, checkAdminAccess]);

  // Fetch metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/analytics?days=${days}`);
        if (!response.ok) {
          if (response.status === 403) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Failed to fetch metrics");
        }

        const data = await response.json();
        setMetrics(data.metrics);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setError(err instanceof Error ? err.message : "Failed to load metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [isAuthenticated, days, router]);

  if (userLoading || isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">System analytics and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Usage Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="font-heading text-2xl font-bold">Usage Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Total Generations</span>
                </div>
                <p className="text-3xl font-bold">{metrics.usage.totalGenerations.toLocaleString()}</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Avg Generation Time</span>
                </div>
                <p className="text-3xl font-bold">{metrics.usage.averageGenerationTime}ms</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                </div>
                <p className="text-3xl font-bold">{metrics.usage.successRate.toFixed(1)}%</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                </div>
                <p className="text-3xl font-bold">{metrics.usage.errorRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Generations by Type */}
            <div className="mb-6">
              <h3 className="font-heading text-lg font-semibold mb-4">Generations by Type</h3>
              <div className="space-y-2">
                {Object.entries(metrics.usage.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-lg glass-strong">
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-muted-foreground">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Generations */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Daily Generations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {metrics.usage.generationsPerDay.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 rounded-lg glass-strong">
                    <span className="text-sm text-muted-foreground">{day.date}</span>
                    <span className="font-medium">{day.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="font-heading text-2xl font-bold">AI Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Total Requests</span>
                </div>
                <p className="text-3xl font-bold">{metrics.ai.totalRequests.toLocaleString()}</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Total Tokens</span>
                </div>
                <p className="text-3xl font-bold">{metrics.ai.totalTokensUsed.toLocaleString()}</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">Avg Tokens/Request</span>
                </div>
                <p className="text-3xl font-bold">{metrics.ai.averageTokensPerRequest.toLocaleString()}</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                </div>
                <p className="text-3xl font-bold">{metrics.ai.averageResponseTime}ms</p>
              </div>
            </div>

            {/* Requests by Model */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Requests by Model</h3>
              <div className="space-y-2">
                {Object.entries(metrics.ai.byModel).map(([model, count]) => (
                  <div key={model} className="flex items-center justify-between p-3 rounded-lg glass-strong">
                    <span className="font-medium">{model}</span>
                    <span className="text-muted-foreground">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-green-400" />
              <h2 className="font-heading text-2xl font-bold">Performance Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Total Requests</span>
                </div>
                <p className="text-3xl font-bold">{metrics.performance.totalRequests.toLocaleString()}</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                </div>
                <p className="text-3xl font-bold">{metrics.performance.averageResponseTime}ms</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">P95 Response Time</span>
                </div>
                <p className="text-3xl font-bold">{metrics.performance.p95ResponseTime}ms</p>
              </div>

              <div className="glass-strong rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                </div>
                <p className="text-3xl font-bold">{metrics.performance.errorRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Performance by Endpoint */}
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Performance by Endpoint</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-sm font-semibold">Endpoint</th>
                      <th className="text-right p-3 text-sm font-semibold">Requests</th>
                      <th className="text-right p-3 text-sm font-semibold">Avg Duration</th>
                      <th className="text-right p-3 text-sm font-semibold">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(metrics.performance.byEndpoint).map(([endpoint, stats]) => (
                      <tr key={endpoint} className="border-b border-white/5">
                        <td className="p-3 text-sm font-mono">{endpoint}</td>
                        <td className="p-3 text-sm text-right">{stats.count.toLocaleString()}</td>
                        <td className="p-3 text-sm text-right">{stats.avgDuration}ms</td>
                        <td className="p-3 text-sm text-right">
                          <span className={stats.errorRate > 5 ? "text-red-400" : "text-green-400"}>
                            {stats.errorRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Drop-off Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="font-heading text-2xl font-bold">Generator Flow Drop-offs</h2>
            </div>

            <div className="space-y-2">
              {metrics.dropOffPoints.map((point, index) => (
                <div key={point.step} className="flex items-center justify-between p-4 rounded-lg glass-strong">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{point.step}</p>
                      <p className="text-sm text-muted-foreground">{point.users.toLocaleString()} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{point.dropOffRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">drop-off</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

