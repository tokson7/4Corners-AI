'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

interface ChartData {
  date: string
  users: number
}

interface UserGrowthChartProps {
  data: ChartData[]
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        User Growth (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#a78bfa"
            tick={{ fill: '#a78bfa', fontSize: 12 }}
          />
          <YAxis stroke="#a78bfa" tick={{ fill: '#a78bfa', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#a78bfa' }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#a78bfa"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
