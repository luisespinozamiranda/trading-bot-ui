import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Rocket, XCircle, ArrowUpDown } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useStrategies } from '@/api/hooks/useStrategies'
import { useDeployStrategy, useRejectStrategy } from '@/api/hooks/mutations/useStrategyMutations'
import { cn, formatPercent, formatNumber } from '@/lib/utils'
import { SYMBOLS } from '@/lib/constants'

type SortField = 'score' | 'testProfitPct' | 'sharpeRatio' | 'maxDrawdown' | 'winRate'

export default function StrategiesPage() {
  const { data: strategies, isLoading } = useStrategies()
  const deployMutation = useDeployStrategy()
  const rejectMutation = useRejectStrategy()

  const [filterSymbol, setFilterSymbol] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortAsc, setSortAsc] = useState(false)

  function handleDeploy(id: number) {
    deployMutation.mutate(id, {
      onSuccess: () => toast.success('Strategy deployed'),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleReject(id: number) {
    rejectMutation.mutate(id, {
      onSuccess: () => toast.success('Strategy rejected'),
      onError: (err) => toast.error(err.message),
    })
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const filtered = (strategies ?? [])
    .filter((s) => filterSymbol === 'ALL' || s.symbol === filterSymbol)
    .filter((s) => filterStatus === 'ALL' || s.status === filterStatus)
    .sort((a, b) => {
      const mul = sortAsc ? 1 : -1
      return (a[sortField] - b[sortField]) * mul
    })

  if (isLoading) return <LoadingSkeleton variant="table" count={8} />

  return (
    <div className="space-y-4">
      <PageHeader
        title="Strategy Management"
        subtitle={`${strategies?.length ?? 0} optimized strategies`}
        actions={
          <Link
            to="/strategies/active"
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Active Assignments
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterSymbol}
          onChange={(e) => setFilterSymbol(e.target.value)}
          className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="ALL">All Symbols</option>
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="ALL">All Status</option>
          <option value="VALIDATED">Validated</option>
          <option value="DEPLOYED">Deployed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState message="No strategies match your filters" />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-3 font-medium">Symbol</th>
                <th className="text-left p-3 font-medium">Strategy</th>
                <th className="text-left p-3 font-medium">Config</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 font-medium cursor-pointer text-right" onClick={() => toggleSort('testProfitPct')}>
                  <span className="inline-flex items-center gap-1">Test Profit <ArrowUpDown size={10} /></span>
                </th>
                <th className="p-3 font-medium cursor-pointer text-right" onClick={() => toggleSort('sharpeRatio')}>
                  <span className="inline-flex items-center gap-1">Sharpe <ArrowUpDown size={10} /></span>
                </th>
                <th className="p-3 font-medium cursor-pointer text-right" onClick={() => toggleSort('maxDrawdown')}>
                  <span className="inline-flex items-center gap-1">Max DD <ArrowUpDown size={10} /></span>
                </th>
                <th className="p-3 font-medium cursor-pointer text-right" onClick={() => toggleSort('winRate')}>
                  <span className="inline-flex items-center gap-1">Win Rate <ArrowUpDown size={10} /></span>
                </th>
                <th className="p-3 font-medium cursor-pointer text-right" onClick={() => toggleSort('score')}>
                  <span className="inline-flex items-center gap-1">Score <ArrowUpDown size={10} /></span>
                </th>
                <th className="p-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <td className="p-3 font-medium text-[var(--color-text-primary)]">{s.symbol}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{s.strategyName}</td>
                  <td className="p-3 text-[var(--color-text-muted)] font-mono">
                    SMA{s.smaPeriod} RSI&lt;{s.rsiThreshold} TP{s.takeProfitPct}% SL{s.stopLossPct}%
                  </td>
                  <td className="p-3"><StatusBadge status={s.status} /></td>
                  <td className={cn('p-3 text-right font-mono', s.testProfitPct >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]')}>
                    {formatPercent(s.testProfitPct)}
                  </td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatNumber(s.sharpeRatio)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-danger)]">{formatPercent(s.maxDrawdown)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatPercent(s.winRate, 1)}</td>
                  <td className="p-3 text-right font-mono font-bold text-[var(--color-accent)]">{formatNumber(s.score)}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {s.status !== 'DEPLOYED' && (
                        <button
                          onClick={() => handleDeploy(s.id)}
                          disabled={deployMutation.isPending}
                          className="p-1 rounded hover:bg-[var(--color-success-muted)] text-[var(--color-success)] transition-colors"
                          title="Deploy"
                        >
                          <Rocket size={14} />
                        </button>
                      )}
                      {s.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleReject(s.id)}
                          disabled={rejectMutation.isPending}
                          className="p-1 rounded hover:bg-[var(--color-danger-muted)] text-[var(--color-danger)] transition-colors"
                          title="Reject"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
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
