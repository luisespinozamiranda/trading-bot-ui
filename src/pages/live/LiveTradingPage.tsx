import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Play, Square, FileText, Calendar, ArrowRight, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import MetricCard from '@/components/trading/MetricCard'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import { useLiveStatus } from '@/api/hooks/useLiveStatus'
import { useTotalSummary } from '@/api/hooks/useLiveTrades'
import { useStartLiveTrading, useStopLiveTrading, useReloadStrategies } from '@/api/hooks/mutations/useLiveMutations'
import { formatCurrency } from '@/lib/utils'
import type { EngineDetail } from '@/api/types'

function EngineTable({ engines }: { engines: EngineDetail[] }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
          <th className="text-left py-2 font-medium">Symbol</th>
          <th className="text-left py-2 font-medium">Interval</th>
          <th className="text-left py-2 font-medium">Strategy</th>
          <th className="text-center py-2 font-medium">Status</th>
          <th className="text-center py-2 font-medium">Position</th>
        </tr>
      </thead>
      <tbody>
        {engines.map((engine) => (
          <EngineRow key={`${engine.symbol}-${engine.interval}`} engine={engine} />
        ))}
      </tbody>
    </table>
  )
}

function EngineRow({ engine }: { engine: EngineDetail }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
      <td className="py-2 font-mono text-[var(--color-text-primary)]">{engine.symbol}</td>
      <td className="py-2 text-[var(--color-text-secondary)]">{engine.interval}</td>
      <td className="py-2 text-[var(--color-text-secondary)]">{engine.strategyName}</td>
      <td className="py-2 text-center">
        <StatusBadge status={engine.running ? 'RUNNING' : 'STOPPED'} />
      </td>
      <td className="py-2 text-center">
        <span className={engine.hasOpenPosition ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}>
          {engine.hasOpenPosition ? 'OPEN' : '--'}
        </span>
      </td>
    </tr>
  )
}

function WsIndicator({ connected }: { connected: boolean }) {
  const Icon = connected ? Wifi : WifiOff
  const color = connected ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
  const label = connected ? 'WS Connected' : 'WS Disconnected'

  return (
    <span className={`flex items-center gap-1 text-xs ${color}`}>
      <Icon size={12} /> {label}
    </span>
  )
}

function EngineEmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-[var(--color-text-muted)]">
        No active strategy assignments.
      </p>
      <Link
        to="/strategies/active"
        className="text-xs text-[var(--color-accent)] hover:underline mt-2 inline-block"
      >
        Go to Active Strategies to assign strategies.
      </Link>
    </div>
  )
}

interface EngineToggleButtonProps {
  running: boolean
  isPending: boolean
  onStart: () => void
  onStop: () => void
}

function EngineToggleButton({ running, isPending, onStart, onStop }: EngineToggleButtonProps) {
  if (running) {
    return (
      <button
        onClick={onStop}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-danger)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Square size={14} /> Stop Engine
      </button>
    )
  }

  return (
    <button
      onClick={onStart}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-success)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      <Play size={14} /> Start Engine
    </button>
  )
}

interface ReloadButtonProps {
  isPending: boolean
  onReload: () => void
}

function ReloadButton({ isPending, onReload }: ReloadButtonProps) {
  return (
    <button
      onClick={onReload}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
    >
      <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} /> Reload Strategies
    </button>
  )
}

interface EngineControlPanelProps {
  status: {
    managerRunning: boolean
    wsConnected: boolean
    totalEquity: number
    cashBalance: number
    engines: EngineDetail[]
  } | undefined
  isPending: boolean
  reloadPending: boolean
  onStart: () => void
  onStop: () => void
  onReload: () => void
}

function EngineControlPanel({ status, isPending, reloadPending, onStart, onStop, onReload }: EngineControlPanelProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Engine</h2>
          <StatusBadge status={status?.managerRunning ? 'RUNNING' : 'STOPPED'} />
          <WsIndicator connected={status?.wsConnected ?? false} />
        </div>
        <div className="flex items-center gap-2">
          {status?.managerRunning && (
            <ReloadButton isPending={reloadPending} onReload={onReload} />
          )}
          <EngineToggleButton
            running={status?.managerRunning ?? false}
            isPending={isPending}
            onStart={onStart}
            onStop={onStop}
          />
        </div>
      </div>

      {status?.managerRunning && (
        <div className="mb-4 flex items-center gap-6 text-sm">
          <span className="text-[var(--color-text-secondary)]">
            Equity: <span className="font-mono text-[var(--color-text-primary)]">{formatCurrency(status.totalEquity)}</span>
          </span>
          <span className="text-[var(--color-text-secondary)]">
            Cash: <span className="font-mono text-[var(--color-text-primary)]">{formatCurrency(status.cashBalance)}</span>
          </span>
          <span className="text-[var(--color-text-secondary)]">
            Open: <span className="font-mono text-[var(--color-text-primary)]">{status.engines.filter(e => e.hasOpenPosition).length}</span>
          </span>
        </div>
      )}

      {status?.engines?.length ? (
        <EngineTable engines={status.engines} />
      ) : (
        <EngineEmptyState />
      )}
    </div>
  )
}

export default function LiveTradingPage() {
  const { data: status, isLoading } = useLiveStatus()
  const { data: summary } = useTotalSummary()
  const startMutation = useStartLiveTrading()
  const stopMutation = useStopLiveTrading()
  const reloadMutation = useReloadStrategies()

  function handleStart() {
    startMutation.mutate(undefined, {
      onSuccess: () => toast.success('Trading engine started'),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleStop() {
    stopMutation.mutate(undefined, {
      onSuccess: () => toast.success('Trading engine stopped'),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleReload() {
    reloadMutation.mutate(undefined, {
      onSuccess: (res) => toast.success(`Reloaded: ${res.reloaded}, Added: ${res.added}, Removed: ${res.removed}`),
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

      <EngineControlPanel
        status={status}
        isPending={status?.managerRunning ? stopMutation.isPending : startMutation.isPending}
        reloadPending={reloadMutation.isPending}
        onStart={handleStart}
        onStop={handleStop}
        onReload={handleReload}
      />

      {status?.managerRunning && (
        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Total Equity" value={status.totalEquity} format="currency" trend="neutral" />
          <MetricCard label="Cash Balance" value={status.cashBalance} format="currency" trend="neutral" />
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Entries" value={summary.entries} format="integer" trend="neutral" />
          <MetricCard label="Total Exits" value={summary.exits} format="integer" trend="neutral" />
          <MetricCard label="Win Rate" value={summary.winRate} format="percent" trend="neutral" subtitle={`${summary.wins} wins`} />
          <MetricCard label="Total P/L" value={summary.totalPnl} format="currency" />
        </div>
      )}

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
