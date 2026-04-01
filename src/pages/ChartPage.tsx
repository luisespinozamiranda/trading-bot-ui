import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import CandlestickChart from '@/components/charts/CandlestickChart'
import { useLiveTrades } from '@/api/hooks/useLiveTrades'
import { SYMBOLS, INTERVALS } from '@/lib/constants'

function SelectorBar({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[]
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <SelectorButton
          key={opt}
          label={opt}
          active={opt === selected}
          onClick={() => onSelect(opt)}
        />
      ))}
    </div>
  )
}

function SelectorButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const base = 'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors'
  const style = active
    ? 'bg-[var(--color-accent)] text-white'
    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'

  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      {label}
    </button>
  )
}

function MarkerToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  const Icon = enabled ? Eye : EyeOff
  const style = enabled
    ? 'bg-[var(--color-accent)] text-white'
    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'

  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${style}`}
      onClick={onToggle}
    >
      <Icon size={14} /> Markers
    </button>
  )
}

export default function ChartPage() {
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0])
  const [interval, setInterval] = useState<string>(INTERVALS[3])
  const [showMarkers, setShowMarkers] = useState(false)
  const { data: trades } = useLiveTrades()

  return (
    <div className="space-y-4">
      <PageHeader title="Chart" subtitle="Candlestick chart with technical indicators" />

      <div className="flex items-center gap-4 flex-wrap">
        <SelectorBar options={SYMBOLS} selected={symbol} onSelect={setSymbol} />
        <SelectorBar options={INTERVALS} selected={interval} onSelect={setInterval} />
        <MarkerToggle enabled={showMarkers} onToggle={() => setShowMarkers((v) => !v)} />
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <CandlestickChart
          symbol={symbol}
          interval={interval}
          trades={trades}
          showMarkers={showMarkers}
          height={500}
        />
      </div>
    </div>
  )
}
