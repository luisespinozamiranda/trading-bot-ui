import { useId } from 'react'
import { cn } from '@/lib/utils'

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  suffix?: string
  className?: string
}

export default function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = '',
  className,
}: ParameterSliderProps) {
  const id = useId()

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs text-[var(--color-text-secondary)]">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 text-right text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
          />
          {suffix && (
            <span className="text-[10px] text-[var(--color-text-muted)]">{suffix}</span>
          )}
        </div>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-[var(--color-surface)] accent-[var(--color-accent)]"
      />
    </div>
  )
}
