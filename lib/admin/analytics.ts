/**
 * Admin Analytics Collection
 * Collects and aggregates system metrics for admin dashboard
 */

// In-memory metrics storage (TODO: Replace with database/analytics service)
interface UsageMetric {
  timestamp: string;
  userId?: string;
  type: "colors" | "typography" | "components" | "refine" | "export";
  duration?: number; // milliseconds
  success: boolean;
  error?: string;
}

interface AIMetric {
  timestamp: string;
  provider: "openai";
  model: string;
  tokensUsed?: number;
  duration: number;
  success: boolean;
  error?: string;
}

interface PerformanceMetric {
  timestamp: string;
  endpoint: string;
  duration: number;
  statusCode: number;
}

const usageMetrics: UsageMetric[] = [];
const aiMetrics: AIMetric[] = [];
const performanceMetrics: PerformanceMetric[] = [];

/**
 * Record a usage metric
 */
export function recordUsageMetric(metric: Omit<UsageMetric, "timestamp">): void {
  usageMetrics.push({
    ...metric,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 10,000 metrics (prevent memory bloat)
  if (usageMetrics.length > 10000) {
    usageMetrics.shift();
  }
}

/**
 * Record an AI metric
 */
export function recordAIMetric(metric: Omit<AIMetric, "timestamp">): void {
  aiMetrics.push({
    ...metric,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 10,000 metrics
  if (aiMetrics.length > 10000) {
    aiMetrics.shift();
  }
}

/**
 * Record a performance metric
 */
export function recordPerformanceMetric(metric: Omit<PerformanceMetric, "timestamp">): void {
  performanceMetrics.push({
    ...metric,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 10,000 metrics
  if (performanceMetrics.length > 10000) {
    performanceMetrics.shift();
  }
}

/**
 * Collect usage metrics
 */
export function collectUsageMetrics(days: number = 30): {
  totalGenerations: number;
  generationsPerDay: Array<{ date: string; count: number }>;
  averageGenerationTime: number;
  byType: Record<string, number>;
  successRate: number;
  errorRate: number;
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentMetrics = usageMetrics.filter(
    (m) => new Date(m.timestamp) >= cutoffDate
  );

  const totalGenerations = recentMetrics.length;
  const successful = recentMetrics.filter((m) => m.success).length;
  const failed = recentMetrics.filter((m) => !m.success).length;

  // Group by day
  const byDay = new Map<string, number>();
  recentMetrics.forEach((m) => {
    const date = new Date(m.timestamp).toISOString().split("T")[0];
    byDay.set(date, (byDay.get(date) || 0) + 1);
  });

  const generationsPerDay = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate average generation time
  const metricsWithDuration = recentMetrics.filter((m) => m.duration !== undefined);
  const averageGenerationTime =
    metricsWithDuration.length > 0
      ? metricsWithDuration.reduce((sum, m) => sum + (m.duration || 0), 0) /
        metricsWithDuration.length
      : 0;

  // Group by type
  const byType: Record<string, number> = {};
  recentMetrics.forEach((m) => {
    byType[m.type] = (byType[m.type] || 0) + 1;
  });

  return {
    totalGenerations,
    generationsPerDay,
    averageGenerationTime: Math.round(averageGenerationTime),
    byType,
    successRate: totalGenerations > 0 ? (successful / totalGenerations) * 100 : 0,
    errorRate: totalGenerations > 0 ? (failed / totalGenerations) * 100 : 0,
  };
}

/**
 * Collect AI metrics
 */
export function collectAIMetrics(days: number = 30): {
  totalRequests: number;
  requestsPerDay: Array<{ date: string; count: number }>;
  totalTokensUsed: number;
  averageTokensPerRequest: number;
  errorRate: number;
  byModel: Record<string, number>;
  averageResponseTime: number;
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentMetrics = aiMetrics.filter(
    (m) => new Date(m.timestamp) >= cutoffDate
  );

  const totalRequests = recentMetrics.length;
  const failed = recentMetrics.filter((m) => !m.success).length;
  const successful = recentMetrics.filter((m) => m.success);

  // Group by day
  const byDay = new Map<string, number>();
  recentMetrics.forEach((m) => {
    const date = new Date(m.timestamp).toISOString().split("T")[0];
    byDay.set(date, (byDay.get(date) || 0) + 1);
  });

  const requestsPerDay = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate token usage
  const metricsWithTokens = recentMetrics.filter((m) => m.tokensUsed !== undefined);
  const totalTokensUsed = metricsWithTokens.reduce(
    (sum, m) => sum + (m.tokensUsed || 0),
    0
  );
  const averageTokensPerRequest =
    metricsWithTokens.length > 0
      ? totalTokensUsed / metricsWithTokens.length
      : 0;

  // Group by model
  const byModel: Record<string, number> = {};
  recentMetrics.forEach((m) => {
    byModel[m.model] = (byModel[m.model] || 0) + 1;
  });

  // Calculate average response time
  const averageResponseTime =
    recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
      : 0;

  return {
    totalRequests,
    requestsPerDay,
    totalTokensUsed,
    averageTokensPerRequest: Math.round(averageTokensPerRequest),
    errorRate: totalRequests > 0 ? (failed / totalRequests) * 100 : 0,
    byModel,
    averageResponseTime: Math.round(averageResponseTime),
  };
}

/**
 * Collect performance metrics
 */
export function collectPerformanceMetrics(days: number = 30): {
  totalRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  byEndpoint: Record<string, { count: number; avgDuration: number; errorRate: number }>;
  errorRate: number;
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentMetrics = performanceMetrics.filter(
    (m) => new Date(m.timestamp) >= cutoffDate
  );

  const totalRequests = recentMetrics.length;
  const errors = recentMetrics.filter((m) => m.statusCode >= 400).length;

  // Calculate percentiles
  const durations = recentMetrics.map((m) => m.duration).sort((a, b) => a - b);
  const p95Index = Math.floor(durations.length * 0.95);
  const p99Index = Math.floor(durations.length * 0.99);
  const p95ResponseTime = durations[p95Index] || 0;
  const p99ResponseTime = durations[p99Index] || 0;

  const averageResponseTime =
    recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
      : 0;

  // Group by endpoint
  const byEndpoint: Record<string, { count: number; durations: number[]; errors: number }> = {};
  recentMetrics.forEach((m) => {
    if (!byEndpoint[m.endpoint]) {
      byEndpoint[m.endpoint] = { count: 0, durations: [], errors: 0 };
    }
    byEndpoint[m.endpoint].count++;
    byEndpoint[m.endpoint].durations.push(m.duration);
    if (m.statusCode >= 400) {
      byEndpoint[m.endpoint].errors++;
    }
  });

  // Calculate averages and error rates per endpoint
  const endpointStats: Record<string, { count: number; avgDuration: number; errorRate: number }> = {};
  Object.entries(byEndpoint).forEach(([endpoint, data]) => {
    endpointStats[endpoint] = {
      count: data.count,
      avgDuration: Math.round(
        data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length
      ),
      errorRate: (data.errors / data.count) * 100,
    };
  });

  return {
    totalRequests,
    averageResponseTime: Math.round(averageResponseTime),
    p95ResponseTime: Math.round(p95ResponseTime),
    p99ResponseTime: Math.round(p99ResponseTime),
    byEndpoint: endpointStats,
    errorRate: totalRequests > 0 ? (errors / totalRequests) * 100 : 0,
  };
}

/**
 * Get drop-off points in generator flow
 */
export function getDropOffPoints(): {
  step: string;
  users: number;
  dropOffRate: number;
}[] {
  // This would track user progression through the generator
  // For now, return placeholder data
  return [
    { step: "Brand Input", users: 1000, dropOffRate: 0 },
    { step: "AI Processing", users: 850, dropOffRate: 15 },
    { step: "Review Results", users: 700, dropOffRate: 17.6 },
    { step: "Export", users: 500, dropOffRate: 28.6 },
  ];
}

/**
 * Get all metrics for admin dashboard
 */
export function getAllMetrics(days: number = 30) {
  return {
    usage: collectUsageMetrics(days),
    ai: collectAIMetrics(days),
    performance: collectPerformanceMetrics(days),
    dropOffPoints: getDropOffPoints(),
  };
}

