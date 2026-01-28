'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartData {
  date: string
  designs: number
}

interface DesignActivityChartProps {
  data: ChartData[]
}

export default function DesignActivityChart({ data }: DesignActivityChartProps) {
  // Color gradient for bars
  const colors = ['#a78bfa', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065']

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Design Activity (Last 7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
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
            cursor={{ fill: 'rgba(167, 139, 250, 0.1)' }}
          />
          <Bar
            dataKey="designs"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
