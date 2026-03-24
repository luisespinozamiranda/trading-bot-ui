import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import PnlDisplay from '@/components/trading/PnlDisplay'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { useDailySummaries } from '@/api/hooks/useLiveTrades'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function DailySummaryPage() {
  const { data: summaries, isLoading } = useDailySummaries()

  if (isLoading) return <LoadingSkeleton variant="table" count={8} />

  const chartData = (summaries ?? []).map((s) => ({
    date: s.date,
    pnl: s.realizedPnl,
    returnPct: s.dailyReturnPercent,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Summaries"
        subtitle={`${summaries?.length ?? 0} trading days`}
        actions={
          <Link to="/live" className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
        }
      />

      {/* P/L Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Daily P/L</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', color: 'var(--color-text-primary)' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'P/L']}
                />
                <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      {!summaries?.length ? (
        <EmptyState message="No daily summaries yet" />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr className="text-[var(--color-text-muted)]">
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-right p-3 font-medium">Opened</th>
                <th className="text-right p-3 font-medium">Closed</th>
                <th className="text-right p-3 font-medium">Realized P/L</th>
                <th className="text-right p-3 font-medium">Daily Return</th>
                <th className="text-right p-3 font-medium">Equity</th>
                <th className="text-right p-3 font-medium">Drawdown</th>
              </tr>
            </thead>
            <tbody>
              {[...summaries].reverse().map((s) => (
                <tr key={s.date} className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                  <td className="p-3 font-mono text-[var(--color-text-primary)]">{s.date}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{s.tradesOpened}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{s.tradesClosed}</td>
                  <td className="p-3 text-right"><PnlDisplay value={s.realizedPnl} size="sm" /></td>
                  <td className="p-3 text-right"><PnlDisplay value={s.dailyReturnPercent} type="percent" size="sm" /></td>
                  <td className="p-3 text-right font-mono text-[var(--color-text-primary)]">{formatCurrency(s.totalEquity)}</td>
                  <td className="p-3 text-right font-mono text-[var(--color-danger)]">{formatPercent(s.drawdownFromPeak)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
