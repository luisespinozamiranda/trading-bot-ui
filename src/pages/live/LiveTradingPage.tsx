import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Play, Square, FileText, Calendar, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import MetricCard from '@/components/trading/MetricCard'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import { useLiveStatus } from '@/api/hooks/useLiveStatus'
import { useTotalSummary } from '@/api/hooks/useLiveTrades'
import { useStartLiveTrading, useStopLiveTrading } from '@/api/hooks/mutations/useLiveMutations'
import { SYMBOLS, INTERVALS } from '@/lib/constants'

export default function LiveTradingPage() {
  const { data: status, isLoading } = useLiveStatus()
  const { data: summary } = useTotalSummary()
  const startMutation = useStartLiveTrading()
  const stopMutation = useStopLiveTrading()

  const [symbol, setSymbol] = useState<string>(SYMBOLS[0])
  const [interval, setInterval] = useState<string>(INTERVALS[5])
  const [capital, setCapital] = useState(10000)

  function handleStart() {
    startMutation.mutate(
      { symbol, interval, initialCapital: capital },
      {
        onSuccess: () => toast.success('Trading engine started'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleStop() {
    stopMutation.mutate(undefined, {
      onSuccess: () => toast.success('Trading engine stopped'),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Trading"
        subtitle="Paper trading engine control center"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/live/trades" className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors">
              <FileText size={14} /> Trade Logs
            </Link>
            <Link to="/live/daily" className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors">
              <Calendar size={14} /> Daily Summary
            </Link>
          </div>
        }
      />

      {/* Engine Control */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Engine</h2>
            <StatusBadge status={status?.running ? 'RUNNING' : 'STOPPED'} />
          </div>
          {status?.running ? (
            <button
              onClick={handleStop}
              disabled={stopMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-danger)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Square size={14} /> Stop Engine
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-success)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Play size={14} /> Start Engine
            </button>
          )}
        </div>

        {!status?.running && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-text-secondary)]">Symbol</label>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="block w-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-3 py-2">
                {SYMBOLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-text-secondary)]">Interval</label>
              <select value={interval} onChange={(e) => setInterval(e.target.value)} className="block w-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-3 py-2">
                {INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-text-secondary)]">Initial Capital</label>
              <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="block w-full text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-3 py-2" />
            </div>
          </div>
        )}

        {status?.running && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Symbol</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{status.symbol}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Interval</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{status.interval}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Open Positions</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{status.openPositions}</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Entries" value={summary.entries} format="integer" trend="neutral" />
          <MetricCard label="Total Exits" value={summary.exits} format="integer" trend="neutral" />
          <MetricCard label="Win Rate" value={summary.winRate} format="percent" trend="neutral" subtitle={`${summary.wins} wins`} />
          <MetricCard label="Total P/L" value={summary.totalPnl} format="currency" />
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/live/trades" className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 hover:bg-[var(--color-surface)] transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Trade Decision Logs</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Full audit trail of every trade decision</p>
            </div>
            <ArrowRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
        </Link>
        <Link to="/live/daily" className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 hover:bg-[var(--color-surface)] transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Daily Summaries</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Day-by-day performance breakdown</p>
            </div>
            <ArrowRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
