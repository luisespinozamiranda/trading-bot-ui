import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  action?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({ message, action, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <Inbox size={48} className="text-[var(--color-text-muted)] mb-4" />
      <p className="text-sm text-[var(--color-text-secondary)] mb-3">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  )
}
