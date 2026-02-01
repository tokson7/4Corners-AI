import { prisma } from '@/lib/prisma'
import { Users, FileText, TrendingUp, Activity, Award, Clock } from 'lucide-react'
import AnalyticsExportButton from '@/components/admin/AnalyticsExportButton'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

async function getAnalytics() {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))

    const [
      totalUsers,
      totalDesigns,
      usersLast30Days,
      designsLast30Days,
      usersLast7Days,
      designsLast7Days,
      topUsers,
      recentActivity,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.designSystem.count(),

      // 30 days
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.designSystem.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // 7 days
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.designSystem.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // Top users by design count
      prisma.user.findMany({
        take: 5,
        orderBy: {
          designSystems: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          _count: {
            select: { designSystems: true },
          },
        },
      }),

      // Recent designs
      prisma.designSystem.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ])

    return {
      totalUsers,
      totalDesigns,
      usersLast30Days,
      designsLast30Days,
      usersLast7Days,
      designsLast7Days,
      topUsers,
      recentActivity,
      growthRate: {
        users: totalUsers > 0 ? ((usersLast7Days / totalUsers) * 100).toFixed(1) : 0,
        designs: totalDesigns > 0 ? ((designsLast7Days / totalDesigns) * 100).toFixed(1) : 0,
      },
    }
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return {
      totalUsers: 0,
      totalDesigns: 0,
      usersLast30Days: 0,
      designsLast30Days: 0,
      usersLast7Days: 0,
      designsLast7Days: 0,
      topUsers: [],
      recentActivity: [],
      growthRate: { users: 0, designs: 0 },
    }
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-purple-300">Platform statistics and insights</p>
        </div>
        <AnalyticsExportButton />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-green-400 text-sm font-medium">
              +{analytics.growthRate.users}%
            </span>
          </div>
          <h3 className="text-sm text-purple-300 mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalUsers}</p>
          <p className="text-xs text-purple-400">
            +{analytics.usersLast7Days} this week
          </p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-green-400 text-sm font-medium">
              +{analytics.growthRate.designs}%
            </span>
          </div>
          <h3 className="text-sm text-purple-300 mb-1">Design Systems</h3>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalDesigns}</p>
          <p className="text-xs text-purple-400">
            +{analytics.designsLast7Days} this week
          </p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-sm text-purple-300 mb-1">30-Day Growth</h3>
          <p className="text-3xl font-bold text-white mb-1">{analytics.usersLast30Days}</p>
          <p className="text-xs text-purple-400">New users</p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-sm text-purple-300 mb-1">Designs Created</h3>
          <p className="text-3xl font-bold text-white mb-1">{analytics.designsLast30Days}</p>
          <p className="text-xs text-purple-400">Last 30 days</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Top Users</h2>
          </div>

          <div className="space-y-3">
            {analytics.topUsers.length === 0 ? (
              <p className="text-purple-300 text-center py-8">No users yet</p>
            ) : (
              analytics.topUsers.map((user: any, idx: number) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || 'No name'}
                      </p>
                      <p className="text-sm text-purple-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {user._count.designSystems}
                    </p>
                    <p className="text-xs text-purple-400">designs</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          </div>

          <div className="space-y-3">
            {analytics.recentActivity.length === 0 ? (
              <p className="text-purple-300 text-center py-8">No activity yet</p>
            ) : (
              analytics.recentActivity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-medium">{activity.name}</p>
                    <span className="text-xs text-purple-400">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-purple-300">
                    Created by{' '}
                    {activity.user.firstName && activity.user.lastName
                      ? `${activity.user.firstName} ${activity.user.lastName}`
                      : activity.user.email}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm text-purple-300 mb-2">Average Designs per User</h3>
          <p className="text-3xl font-bold text-white">
            {analytics.totalUsers > 0
              ? (analytics.totalDesigns / analytics.totalUsers).toFixed(1)
              : 0}
          </p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm text-purple-300 mb-2">Weekly Active Users</h3>
          <p className="text-3xl font-bold text-white">{analytics.usersLast7Days}</p>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm text-purple-300 mb-2">Designs This Week</h3>
          <p className="text-3xl font-bold text-white">{analytics.designsLast7Days}</p>
        </div>
      </div>
    </div>
  )
}
