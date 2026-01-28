'use client'

import { useEffect, useState } from 'react'
import UserGrowthChart from './charts/UserGrowthChart'
import DesignActivityChart from './charts/DesignActivityChart'
import CreditsUsageChart from './charts/CreditsUsageChart'

interface ChartData {
  userGrowth: Array<{ date: string; users: number }>
  designActivity: Array<{ date: string; designs: number }>
  creditsUsage: Array<{ name: string; value: number; fill: string }>
  heatmapData: Array<any>
}

export default function AnalyticsCharts() {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch('/api/admin/analytics/charts')
        if (!response.ok) {
          throw new Error('Failed to fetch chart data')
        }
        const chartData = await response.json()
        setData(chartData)
      } catch (err: any) {
        console.error('Error fetching chart data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300">Loading charts...</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300">Loading charts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-slate-900 border border-red-500/50 rounded-xl p-6 mb-8">
        <p className="text-red-400">Failed to load charts: {error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserGrowthChart data={data.userGrowth} />
        <DesignActivityChart data={data.designActivity} />
      </div>

      {/* Credits Chart */}
      <div className="mb-8">
        <CreditsUsageChart data={data.creditsUsage} />
      </div>
    </>
  )
}
