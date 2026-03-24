import { cn } from '@/lib/utils'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import type { ReactNode } from 'react'

type Format = 'currency' | 'percent' | 'decimal' | 'integer' | 'raw'

interface MetricCardProps {
  label: string
  value: number | string | null
  format?: Format
  icon?: ReactNode
  trend?: 'positive' | 'negative' | 'neutral'
  subtitle?: string
  className?: string
}

function formatValue(value: number | string | null, format: Format): string {
  if (value === null || value === undefined) return '--'
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency': return formatCurrency(value)
    case 'percent': return formatPercent(value)
    case 'decimal': return formatNumber(value)
    case 'integer': return Math.round(value).toLocaleString()
    case 'raw': return String(value)
  }
}

function getTrendColor(value: number | string | null, trend?: 'positive' | 'negative' | 'neutral'): string {
  if (trend === 'neutral') return 'text-[var(--color-text-primary)]'
  if (trend === 'positive') return 'text-[var(--color-success)]'
  if (trend === 'negative') return 'text-[var(--color-danger)]'

  if (typeof value !== 'number') return 'text-[var(--color-text-primary)]'
  if (value > 0) return 'text-[var(--color-success)]'
  if (value < 0) return 'text-[var(--color-danger)]'
  return 'text-[var(--color-text-primary)]'
}

export default function MetricCard({
  label,
  value,
  format = 'raw',
  icon,
  trend,
  subtitle,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-[var(--color-text-muted)]">{icon}</span>}
      </div>
      <div
        className={cn(
          'text-2xl font-bold font-mono tracking-tight',
          getTrendColor(value, trend),
        )}
      >
        {formatValue(value, format)}
      </div>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p>
      )}
    </div>
  )
}
