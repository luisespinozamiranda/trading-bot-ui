import { cn } from '@/lib/utils'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface PnlDisplayProps {
  value: number
  type?: 'currency' | 'percent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function PnlDisplay({
  value,
  type = 'currency',
  size = 'md',
  className,
}: PnlDisplayProps) {
  const formatted = type === 'currency' ? formatCurrency(value) : formatPercent(value)
  const prefix = value > 0 && type === 'currency' ? '+' : ''

  return (
    <span
      className={cn(
        'font-mono font-medium',
        value > 0 && 'text-[var(--color-success)]',
        value < 0 && 'text-[var(--color-danger)]',
        value === 0 && 'text-[var(--color-text-secondary)]',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-lg',
        className,
      )}
    >
      {prefix}{formatted}
    </span>
  )
}
