'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartData {
  name: string
  value: number
  fill: string
}

interface CreditsUsageChartProps {
  data: ChartData[]
}

export default function CreditsUsageChart({ data }: CreditsUsageChartProps) {
  const COLORS = ['#ef4444', '#10b981']

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / (data[0].value + data[1].value)) * 100).toFixed(0)
    return `${percent}%`
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Credits Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any) => `${value?.toLocaleString() || 0} credits`}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-purple-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
