import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useBacktestResults } from '@/api/hooks/useBacktestResults'
import { formatPercent, formatNumber, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

export default function BacktestResultsPage() {
  const { data: results, isLoading } = useBacktestResults()

  if (isLoading) return <LoadingSkeleton variant="table" count={10} />

  return (
    <div className="space-y-4">
      <PageHeader
        title="Backtest Results"
        subtitle={`${results?.length ?? 0} backtests`}
        actions={
          <Link
            to="/backtest"
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            New Backtest
          </Link>
        }
      />

      {!results?.length ? (
        <EmptyState message="No backtest results yet" action="Run your first backtest" onAction={() => {}} />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-3 font-medium">Experiment</th>
                <th className="text-left p-3 font-medium">Symbol</th>
                <th className="text-left p-3 font-medium">TF</th>
                <th className="text-right p-3 font-medium">Trades</th>
                <th className="text-right p-3 font-medium">Win Rate</th>
                <th className="text-right p-3 font-medium">Net Profit</th>
                <th className="text-right p-3 font-medium">Max DD</th>
                <th className="text-right p-3 font-medium">PF</th>
                <th className="text-right p-3 font-medium">Sharpe</th>
                <th className="text-right p-3 font-medium">Final Capital</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-center p-3 font-medium">View</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                  <td className="p-3 font-medium text-[var(--color-text-primary)]">{r.experimentName || r.id.slice(0, 8)}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{r.symbol}</td>
                  <td className="p-3"><StatusBadge status={r.timeframe} /></td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{r.totalTrades}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatPercent(r.winRate, 1)}</td>
                  <td className={`p-3 text-right font-mono font-medium ${r.netProfitPercent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                    {formatPercent(r.netProfitPercent)}
                  </td>
                  <td className="p-3 text-right font-mono text-[var(--color-danger)]">{formatPercent(r.maxDrawdown)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatNumber(r.profitFactor)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatNumber(r.sharpeRatio)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatCurrency(r.finalCapital)}</td>
                  <td className="p-3 text-[var(--color-text-muted)] font-mono">{format(new Date(r.executedAt), 'MM/dd HH:mm')}</td>
                  <td className="p-3 text-center">
                    <Link to={`/backtest/${r.id}`} className="p-1 rounded hover:bg-[var(--color-accent-muted)] text-[var(--color-accent)] transition-colors inline-flex">
                      <ExternalLink size={14} />
                    </Link>
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
