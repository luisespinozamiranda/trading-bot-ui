import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import MetricCard from '@/components/trading/MetricCard'
import PnlDisplay from '@/components/trading/PnlDisplay'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EquityCurveChart from '@/components/charts/EquityCurveChart'
import { useBacktestById } from '@/api/hooks/useBacktestResults'
import { formatPrice, formatCurrency, formatDuration } from '@/lib/utils'
import { format } from 'date-fns'

export default function BacktestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: result, isLoading } = useBacktestById(id)

  if (isLoading) return <LoadingSkeleton variant="card" count={8} />
  if (!result) return <p className="text-sm text-[var(--color-text-secondary)]">Backtest not found</p>

  function exportCsv() {
    if (!result) return
    const header = 'Direction,Entry Price,Exit Price,Net %,Net $,Entry Time,Exit Time,Duration\n'
    const rows = result.trades.map((t) =>
      `${t.direction},${t.entryPrice},${t.exitPrice},${t.netProfitPercent.toFixed(2)},${t.netProfitAmount.toFixed(2)},${t.entryTime},${t.exitTime},${formatDuration(t.durationSeconds)}`,
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.experimentName || result.id}_trades.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={result.experimentName || result.id}
        subtitle={`${result.symbol} / ${result.timeframe} - ${format(new Date(result.executedAt), 'yyyy-MM-dd HH:mm')}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/backtest/results"
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </Link>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Net Profit" value={result.netProfitPercent} format="percent" subtitle={formatCurrency(result.netProfitDollar)} />
        <MetricCard label="Win Rate" value={result.winRate} format="percent" trend="neutral" subtitle={`${result.winningTrades}W / ${result.losingTrades}L`} />
        <MetricCard label="Profit Factor" value={result.profitFactor} format="decimal" trend="neutral" />
        <MetricCard label="Max Drawdown" value={result.maxDrawdown} format="percent" trend="negative" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Sharpe Ratio" value={result.sharpeRatio} format="decimal" trend="neutral" />
        <MetricCard label="Sortino Ratio" value={result.sortinoRatio} format="decimal" trend="neutral" />
        <MetricCard label="Expectancy" value={result.expectancy} format="currency" />
        <MetricCard label="Total Fees" value={result.totalFees} format="currency" trend="negative" />
      </div>

      {/* Equity Curve */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Equity Curve</h2>
        <EquityCurveChart
          data={result.equityCurve ?? []}
          initialCapital={result.initialCapital}
          finalCapital={result.finalCapital}
        />
      </div>

      {/* Trade List */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Trades ({result.totalTrades})
          </h2>
        </div>
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-2 font-medium">#</th>
                <th className="text-left p-2 font-medium">Direction</th>
                <th className="text-right p-2 font-medium">Entry</th>
                <th className="text-right p-2 font-medium">Exit</th>
                <th className="text-right p-2 font-medium">Net %</th>
                <th className="text-right p-2 font-medium">Net $</th>
                <th className="text-left p-2 font-medium">Entry Time</th>
                <th className="text-left p-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {result.trades.map((trade, i) => (
                <tr key={i} className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                  <td className="p-2 text-[var(--color-text-muted)]">{i + 1}</td>
                  <td className="p-2 text-left font-medium text-[var(--color-text-primary)]">{trade.direction}</td>
                  <td className="p-2 text-right font-mono text-[var(--color-text-primary)]">{formatPrice(trade.entryPrice)}</td>
                  <td className="p-2 text-right font-mono text-[var(--color-text-primary)]">{formatPrice(trade.exitPrice)}</td>
                  <td className="p-2 text-right"><PnlDisplay value={trade.netProfitPercent} type="percent" size="sm" /></td>
                  <td className="p-2 text-right"><PnlDisplay value={trade.netProfitAmount} size="sm" /></td>
                  <td className="p-2 font-mono text-[var(--color-text-muted)]">{format(new Date(trade.entryTime), 'MM/dd HH:mm')}</td>
                  <td className="p-2 text-[var(--color-text-muted)]">{formatDuration(trade.durationSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
