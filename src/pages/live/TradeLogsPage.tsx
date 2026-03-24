import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/trading/StatusBadge'
import PnlDisplay from '@/components/trading/PnlDisplay'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useLiveTrades } from '@/api/hooks/useLiveTrades'
import { formatPrice, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

export default function TradeLogsPage() {
  const { data: trades, isLoading } = useLiveTrades()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filterAction, setFilterAction] = useState<string>('ALL')

  const filtered = (trades ?? [])
    .filter((t) => filterAction === 'ALL' || t.action === filterAction)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (isLoading) return <LoadingSkeleton variant="table" count={10} />

  return (
    <div className="space-y-4">
      <PageHeader
        title="Trade Decision Logs"
        subtitle={`${trades?.length ?? 0} decisions recorded`}
        actions={
          <Link to="/live" className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
        }
      />

      <div className="flex items-center gap-3">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
        >
          <option value="ALL">All Actions</option>
          <option value="BUY">BUY Only</option>
          <option value="SELL">SELL Only</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState message="No trade logs yet" />
      ) : (
        <div className="space-y-1">
          {filtered.map((trade) => (
            <div key={trade.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                className="w-full flex items-center gap-4 p-3 text-xs hover:bg-[var(--color-surface)] transition-colors"
              >
                {expandedId === trade.id ? <ChevronDown size={14} className="text-[var(--color-text-muted)]" /> : <ChevronRight size={14} className="text-[var(--color-text-muted)]" />}
                <span className="font-mono text-[var(--color-text-secondary)] w-14">
                  {format(new Date(trade.timestamp), 'HH:mm')}
                </span>
                <span className="text-[var(--color-text-primary)] w-20">{trade.symbol}</span>
                <StatusBadge status={trade.action} />
                <span className="font-mono text-[var(--color-text-primary)] w-24 text-right">
                  {formatPrice(trade.price)}
                </span>
                <span className="font-mono text-[var(--color-text-secondary)] w-16 text-right">
                  {trade.quantity.toFixed(4)}
                </span>
                <span className="w-20 text-right">
                  {trade.action === 'SELL' ? (
                    <PnlDisplay value={trade.pnlPercent} type="percent" size="sm" />
                  ) : (
                    <span className="text-[var(--color-text-muted)]">--</span>
                  )}
                </span>
                <span className="w-20 text-right">
                  {trade.action === 'SELL' ? (
                    <PnlDisplay value={trade.pnlAmount} size="sm" />
                  ) : (
                    <span className="text-[var(--color-text-muted)]">--</span>
                  )}
                </span>
                <span className="text-[var(--color-text-muted)] ml-auto">
                  {trade.exitReason ?? ''}
                </span>
              </button>

              {expandedId === trade.id && (
                <div className="px-10 pb-3 space-y-2 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)] pt-2 whitespace-pre-wrap leading-relaxed">
                    {trade.decisionSummary}
                  </p>
                  <div className="flex gap-6 text-[10px] text-[var(--color-text-muted)]">
                    <span>Position Size: {formatCurrency(trade.positionSize)}</span>
                    <span>Commission: {formatCurrency(trade.commission)}</span>
                    <span>Capital Before: {formatCurrency(trade.capitalBefore)}</span>
                    <span>Capital After: {formatCurrency(trade.capitalAfter)}</span>
                    <span>Trade ID: {trade.tradeId}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
