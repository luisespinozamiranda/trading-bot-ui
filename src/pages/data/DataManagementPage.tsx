import { useState } from 'react'
import { toast } from 'sonner'
import { Download, RefreshCw } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useDataStatus } from '@/api/hooks/useDataStatus'
import { useBackfillData, useSyncData } from '@/api/hooks/mutations/useDataMutations'
import { SYMBOLS, INTERVALS } from '@/lib/constants'
import { formatCompactNumber } from '@/lib/utils'
import { format } from 'date-fns'

export default function DataManagementPage() {
  const { data: statuses, isLoading } = useDataStatus()
  const backfillMutation = useBackfillData()
  const syncMutation = useSyncData()

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([SYMBOLS[0]])
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([INTERVALS[5]])
  const [monthsBack, setMonthsBack] = useState(6)

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
  }

  function handleBackfill() {
    if (!selectedSymbols.length || !selectedIntervals.length) return
    backfillMutation.mutate(
      { symbols: selectedSymbols, intervals: selectedIntervals, monthsBack },
      {
        onSuccess: () => toast.success('Backfill completed'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleSync() {
    if (!selectedSymbols.length || !selectedIntervals.length) return
    syncMutation.mutate(
      { symbols: selectedSymbols, intervals: selectedIntervals },
      {
        onSuccess: () => toast.success('Sync completed'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />

  return (
    <div className="space-y-6">
      <PageHeader title="Data Management" subtitle="Backfill and sync market data from Binance" />

      {/* Controls */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-[var(--color-text-secondary)]">Symbols</label>
          <div className="flex gap-2">
            {SYMBOLS.map((s) => (
              <button
                key={s}
                onClick={() => toggleItem(selectedSymbols, s, setSelectedSymbols)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  selectedSymbols.includes(s)
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[var(--color-text-secondary)]">Intervals</label>
          <div className="flex gap-2">
            {INTERVALS.map((i) => (
              <button
                key={i}
                onClick={() => toggleItem(selectedIntervals, i, setSelectedIntervals)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  selectedIntervals.includes(i)
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-secondary)]">Months Back</label>
            <input
              type="number"
              value={monthsBack}
              min={1}
              max={24}
              onChange={(e) => setMonthsBack(Number(e.target.value))}
              className="block w-24 text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
            />
          </div>
          <button
            onClick={handleBackfill}
            disabled={backfillMutation.isPending || !selectedSymbols.length}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
          >
            <Download size={14} /> {backfillMutation.isPending ? 'Backfilling...' : 'Backfill'}
          </button>
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending || !selectedSymbols.length}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncMutation.isPending ? 'animate-spin' : ''} />
            {syncMutation.isPending ? 'Syncing...' : 'Sync Latest'}
          </button>
        </div>
      </div>

      {/* Data Status Table */}
      {!statuses?.length ? (
        <EmptyState message="No data available yet" action="Run a backfill" onAction={handleBackfill} />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-3 font-medium">Symbol</th>
                <th className="text-left p-3 font-medium">Interval</th>
                <th className="text-right p-3 font-medium">Candles</th>
                <th className="text-left p-3 font-medium">First</th>
                <th className="text-left p-3 font-medium">Last</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((s) => (
                <tr key={`${s.symbol}-${s.interval}`} className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                  <td className="p-3 font-medium text-[var(--color-text-primary)]">{s.symbol}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{s.interval}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-accent)]">{formatCompactNumber(s.totalCandles)}</td>
                  <td className="p-3 font-mono text-[var(--color-text-muted)]">{s.firstCandle ? format(new Date(s.firstCandle), 'yyyy-MM-dd') : '--'}</td>
                  <td className="p-3 font-mono text-[var(--color-text-muted)]">{s.lastCandle ? format(new Date(s.lastCandle), 'yyyy-MM-dd') : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
