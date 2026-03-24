import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default'

const STATUS_MAP: Record<string, BadgeVariant> = {
  DEPLOYED: 'success',
  VALIDATED: 'info',
  REJECTED: 'danger',
  RUNNING: 'success',
  STOPPED: 'default',
  FILLED: 'success',
  PENDING: 'warning',
  CANCELLED: 'default',
  BUY: 'success',
  SELL: 'danger',
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]',
  danger: 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]',
  warning: 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]',
  info: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-[var(--color-accent)]',
  default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_MAP[status] ?? 'default'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {status}
    </span>
  )
}
