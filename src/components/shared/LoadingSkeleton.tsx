import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  variant?: 'card' | 'line' | 'table'
  count?: number
  className?: string
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-[var(--color-surface)]',
        className,
      )}
    />
  )
}

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'line') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonPulse key={i} className="h-4 w-full" />
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-1', className)}>
        <SkeletonPulse className="h-8 w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonPulse key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <SkeletonPulse className="h-3 w-20 mb-3" />
          <SkeletonPulse className="h-7 w-28" />
        </div>
      ))}
    </div>
  )
}
