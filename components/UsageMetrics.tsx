import { motion } from "framer-motion";
import { Zap, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageMetricsProps {
  creditsUsed?: number;
  creditsTotal?: number;
  designsCreated?: number;
  className?: string;
}

/**
 * UsageMetrics Component
 * 
 * Displays user's current usage statistics in a clean, visual format.
 * 
 * Features:
 * - Credit usage with progress bar
 * - Designs created counter
 * - Responsive grid layout
 * - Animated progress indicators
 * - Glass morphism design
 * 
 * @example
 * ```tsx
 * <UsageMetrics 
 *   creditsUsed={25}
 *   creditsTotal={100}
 *   designsCreated={5}
 * />
 * ```
 */
export function UsageMetrics({
  creditsUsed = 0,
  creditsTotal = 100,
  designsCreated = 0,
  className,
}: UsageMetricsProps) {
  // Calculate usage percentage for progress bar
  const usagePercentage = creditsTotal > 0 
    ? Math.min(100, (creditsUsed / creditsTotal) * 100)
    : 0;

  // Calculate remaining credits
  const creditsRemaining = Math.max(0, creditsTotal - creditsUsed);

  // Determine credit status color
  const getCreditStatusColor = () => {
    const remaining = creditsRemaining / creditsTotal;
    if (remaining > 0.5) return "text-green-400";
    if (remaining > 0.2) return "text-yellow-400";
    return "text-red-400";
  };

  // Determine progress bar color
  const getProgressBarColor = () => {
    const remaining = creditsRemaining / creditsTotal;
    if (remaining > 0.5) return "from-green-500 to-emerald-500";
    if (remaining > 0.2) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {/* AI Credits Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 -z-10" />

        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Zap className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
        </div>

        {/* Credits Display */}
        <div className="mb-4">
          <h3 className="font-heading text-3xl font-bold mb-1">
            <span className={getCreditStatusColor()}>{creditsRemaining}</span>
            <span className="text-muted-foreground text-2xl"> / {creditsTotal}</span>
          </h3>
          <p className="text-sm text-muted-foreground">AI Credits Available</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full bg-gradient-to-r transition-all duration-300",
                getProgressBarColor()
              )}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {creditsUsed} used
            </span>
            <span className={cn("font-medium", getCreditStatusColor())}>
              {usagePercentage.toFixed(0)}% used
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {creditsRemaining <= 10 && creditsRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
          >
            <p className="text-xs text-yellow-400 font-medium">
              ⚠️ Running low on credits. Consider upgrading your plan.
            </p>
          </motion.div>
        )}

        {creditsRemaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <p className="text-xs text-red-400 font-medium">
              🚫 No credits remaining. Upgrade to continue generating.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Designs Created Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 -z-10" />

        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">All time</span>
          </div>
        </div>

        {/* Designs Count Display */}
        <div className="mb-4">
          <h3 className="font-heading text-3xl font-bold mb-1 text-foreground">
            {designsCreated}
          </h3>
          <p className="text-sm text-muted-foreground">Designs Created</p>
        </div>

        {/* Visual Indicator */}
        <div className="space-y-2">
          {designsCreated === 0 ? (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground text-center">
                🎨 Create your first design system to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: Math.min(10, designsCreated) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30"
                />
              ))}
              {designsCreated > 10 && (
                <div className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    +{designsCreated - 10}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Milestone Messages */}
        {designsCreated >= 10 && designsCreated < 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
          >
            <p className="text-xs text-purple-400 font-medium">
              🎉 Great progress! You&apos;ve created {designsCreated} designs.
            </p>
          </motion.div>
        )}

        {designsCreated >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
          >
            <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-medium">
              🏆 Design Master! {designsCreated} designs created and counting!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
