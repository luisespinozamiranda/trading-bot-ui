import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useActiveStrategies, useStrategies } from '@/api/hooks/useStrategies'
import {
  useAssignStrategy,
  useDisableAssignment,
} from '@/api/hooks/mutations/useStrategyMutations'
import { SYMBOLS, INTERVALS } from '@/lib/constants'
import { format } from 'date-fns'

export default function ActiveStrategiesPage() {
  const { data: assignments, isLoading } = useActiveStrategies()
  const { data: strategies } = useStrategies()
  const assignMutation = useAssignStrategy()
  const disableMutation = useDisableAssignment()

  const [symbol, setSymbol] = useState<string>(SYMBOLS[0])
  const [interval, setInterval] = useState<string>(INTERVALS[5])
  const [strategyId, setStrategyId] = useState<number | ''>('')

  const deployedStrategies = (strategies ?? []).filter((s) => s.status === 'DEPLOYED')

  function handleAssign() {
    if (!strategyId) return
    assignMutation.mutate(
      { symbol, interval, strategyId: Number(strategyId) },
      {
        onSuccess: () => toast.success('Strategy assigned'),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleDisable(id: number) {
    disableMutation.mutate(id, {
      onSuccess: () => toast.success('Assignment removed'),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) return <LoadingSkeleton variant="table" count={4} />

  return (
    <div className="space-y-6">
      <PageHeader title="Active Assignments" subtitle="Manage which strategy runs on each symbol" />

      {/* Assign Form */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Assign Strategy
        </h2>
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-secondary)]">Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="block text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
            >
              {SYMBOLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-secondary)]">Interval</label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="block text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
            >
              {INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs text-[var(--color-text-secondary)]">Strategy</label>
            <select
              value={strategyId}
              onChange={(e) => setStrategyId(e.target.value ? Number(e.target.value) : '')}
              className="block w-full text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
            >
              <option value="">Select a strategy...</option>
              {deployedStrategies.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} {s.symbol} {s.strategyName} (Score: {s.score.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAssign}
            disabled={!strategyId || assignMutation.isPending}
            className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
          >
            Assign
          </button>
        </div>
      </div>

      {/* Assignments Table */}
      {!assignments?.length ? (
        <EmptyState message="No active assignments" />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-3 font-medium">Symbol</th>
                <th className="text-left p-3 font-medium">Interval</th>
                <th className="text-left p-3 font-medium">Strategy</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Assigned</th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <td className="p-3 font-medium text-[var(--color-text-primary)]">{a.symbol}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{a.interval}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">
                    #{a.strategyId} {a.strategyName}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={a.enabled ? 'DEPLOYED' : 'STOPPED'} />
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)] font-mono">
                    {format(new Date(a.assignedAt), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDisable(a.id)}
                      disabled={disableMutation.isPending}
                      className="p-1 rounded hover:bg-[var(--color-danger-muted)] text-[var(--color-danger)] transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
