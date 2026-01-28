import { prisma } from '@/lib/prisma'
import { Users, FileText, Sparkles, TrendingUp, Shield, Ban } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  try {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))
    const weekAgo = new Date(now.setDate(now.getDate() - 7))

    // Add timeout to each query
    const queryTimeout = 10000 // 10 seconds

    const [
      totalUsers,
      totalDesigns,
      todayUsers,
      todayDesigns,
      adminUsers,
      bannedUsers,
      weekUsers,
      featuredDesigns,
      activeDesigns,
    ] = await Promise.race([
      Promise.all([
        prisma.user.count(),
        prisma.designSystem.count(),
        prisma.user.count({
          where: { createdAt: { gte: today } },
        }),
        prisma.designSystem.count({
          where: { createdAt: { gte: today } },
        }),
        prisma.user.count({
          where: { role: 'ADMIN' },
        }),
        prisma.user.count({
          where: { banned: true },
        }),
        prisma.user.count({
          where: { createdAt: { gte: weekAgo } },
        }),
        prisma.designSystem.count({
          where: { featured: true },
        }),
        prisma.designSystem.count({
          where: { status: 'ACTIVE' },
        }),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), queryTimeout)
      ),
    ]) as [number, number, number, number, number, number, number, number, number]

    return {
      totalUsers,
      totalDesigns,
      todayUsers,
      todayDesigns,
      adminUsers,
      bannedUsers,
      weekUsers,
      featuredDesigns,
      activeDesigns,
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    // Return default values instead of crashing
    return {
      totalUsers: 0,
      totalDesigns: 0,
      todayUsers: 0,
      todayDesigns: 0,
      adminUsers: 0,
      bannedUsers: 0,
      weekUsers: 0,
      featuredDesigns: 0,
      activeDesigns: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: `+${stats.todayUsers} today`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/users',
    },
    {
      title: 'Design Systems',
      value: stats.totalDesigns,
      change: `+${stats.todayDesigns} today`,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/designs',
    },
    {
      title: 'New Users (7d)',
      value: stats.weekUsers,
      change: 'Last 7 days',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/analytics',
    },
    {
      title: 'Credits Used',
      value: stats.totalDesigns * 3,
      change: 'Approximate',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      link: '/admin/analytics',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-purple-300">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-purple-300 mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-white mb-2">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-green-400">{stat.change}</p>
            </Link>
          )
        })}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Admin Users</p>
              <p className="text-2xl font-bold text-white">{stats.adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <Ban className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-300">Banned Users</p>
              <p className="text-2xl font-bold text-white">{stats.bannedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <Users className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-medium text-white mb-1">Manage Users</h3>
            <p className="text-sm text-purple-300">View and manage all users</p>
          </Link>
          <Link
            href="/admin/designs"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <FileText className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-medium text-white mb-1">Design Systems</h3>
            <p className="text-sm text-purple-300">Moderate content</p>
          </Link>
          <Link
            href="/admin/analytics"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-medium text-white mb-1">Analytics</h3>
            <p className="text-sm text-purple-300">View detailed stats</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
