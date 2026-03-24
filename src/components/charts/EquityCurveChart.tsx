import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { EquityPoint } from '@/api/types'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

interface EquityCurveChartProps {
  data: EquityPoint[]
  initialCapital: number
  finalCapital: number
}

export default function EquityCurveChart({ data, initialCapital }: EquityCurveChartProps) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
        No equity curve data available
      </div>
    )
  }

  const chartData = data.map((point) => ({
    date: format(new Date(point.timestamp), 'MM/dd'),
    capital: point.capital,
    drawdown: point.drawdownPercent,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'var(--color-text-primary)',
            }}
            formatter={(value) => [formatCurrency(Number(value)), 'Capital']}
          />
          <ReferenceLine
            y={initialCapital}
            stroke="var(--color-text-muted)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="capital"
            stroke="var(--color-accent)"
            fill="url(#capitalGradient)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
