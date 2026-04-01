import { Link } from 'react-router-dom'
import { TrendingUp, Wallet, BarChart3, Activity, ArrowRight } from 'lucide-react'
import MetricCard from '@/components/trading/MetricCard'
import PnlDisplay from '@/components/trading/PnlDisplay'
import StatusBadge from '@/components/trading/StatusBadge'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import PageHeader from '@/components/shared/PageHeader'
import { useAccountSnapshot } from '@/api/hooks/useAccountSnapshot'
import { useLiveStatus } from '@/api/hooks/useLiveStatus'
import { useLiveTrades, useTotalSummary } from '@/api/hooks/useLiveTrades'
import { useEnabledStrategies } from '@/api/hooks/useStrategies'
import { useDailySummaries } from '@/api/hooks/useLiveTrades'
import { formatCurrency, formatPrice } from '@/lib/utils'
import { format } from 'date-fns'

export default function Dashboard() {
  const { data: account, isLoading: loadingAccount } = useAccountSnapshot()
  const { data: liveStatus } = useLiveStatus()
  const { data: trades } = useLiveTrades()
  const { data: activeStrategies } = useEnabledStrategies()
  const { data: dailySummaries } = useDailySummaries()
  const { data: totalSummary } = useTotalSummary()

  const recentTrades = trades?.slice(-5).reverse() ?? []
  const todaySummary = dailySummaries?.at(-1)

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Portfolio overview and live trading status" />

      {loadingAccount ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Total Equity"
            value={account?.totalEquity ?? null}
            format="currency"
            icon={<Wallet size={16} />}
            trend="neutral"
          />
          <MetricCard
            label="Available Cash"
            value={account?.availableCash ?? null}
            format="currency"
            icon={<BarChart3 size={16} />}
            trend="neutral"
          />
          <MetricCard
            label="Unrealized P/L"
            value={account?.unrealizedPnl ?? null}
            format="currency"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            label="Today's Return"
            value={todaySummary?.dailyReturnPercent ?? null}
            format="percent"
            icon={<Activity size={16} />}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Open Positions */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Open Positions
            </h2>
            <span className="text-xs text-[var(--color-text-muted)]">
              {account?.openPositions?.length ?? 0} active
            </span>
          </div>
          {account?.openPositions?.length ? (
            <div className="space-y-2">
              {account.openPositions.map((pos) => (
                <div
                  key={pos.symbol}
                  className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {pos.symbol}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] ml-2">
                      {pos.quantity} @ {formatPrice(pos.entryPrice)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {formatPrice(pos.currentPrice)}
                    </div>
                    <PnlDisplay value={pos.unrealizedPnl} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
              No open positions
            </p>
          )}
        </div>

        {/* Engine Status & Active Strategies */}
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Engine Status
            </h2>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={liveStatus?.managerRunning ? 'RUNNING' : 'STOPPED'} />
                <StatusBadge status={liveStatus?.wsConnected ? 'WS' : 'WS OFF'} />
              </div>
              {liveStatus?.managerRunning && (
                <span className="text-sm font-mono text-[var(--color-text-primary)]">
                  {formatCurrency(liveStatus.totalEquity)}
                </span>
              )}
            </div>
            {liveStatus?.engines?.length ? (
              <div className="space-y-1">
                {liveStatus.engines.map((engine) => (
                  <div
                    key={`${engine.symbol}-${engine.interval}`}
                    className="flex items-center justify-between py-1 text-xs"
                  >
                    <span className="text-[var(--color-text-primary)]">
                      {engine.symbol} / {engine.interval}
                    </span>
                    <span className="text-[var(--color-text-secondary)]">
                      {engine.strategyName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] text-center">
                No engines running
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Active Strategies
              </h2>
              <Link
                to="/strategies/active"
                className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {activeStrategies?.length ? (
              <div className="space-y-2">
                {activeStrategies.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {s.symbol}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {s.strategyName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] py-2 text-center">
                No active strategies
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Recent Trades
          </h2>
          <Link
            to="/live/trades"
            className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {recentTrades.length ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Symbol</th>
                <th className="text-left py-2 font-medium">Action</th>
                <th className="text-right py-2 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">P/L</th>
                <th className="text-left py-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors"
                >
                  <td className="py-2 font-mono text-[var(--color-text-secondary)]">
                    {format(new Date(trade.timestamp), 'HH:mm')}
                  </td>
                  <td className="py-2 text-[var(--color-text-primary)]">{trade.symbol}</td>
                  <td className="py-2">
                    <StatusBadge status={trade.action} />
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--color-text-primary)]">
                    {formatPrice(trade.price)}
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--color-text-secondary)]">
                    {trade.quantity.toFixed(4)}
                  </td>
                  <td className="py-2 text-right">
                    {trade.action === 'SELL' ? (
                      <PnlDisplay value={trade.pnlPercent} type="percent" size="sm" />
                    ) : (
                      <span className="text-[var(--color-text-muted)]">--</span>
                    )}
                  </td>
                  <td className="py-2 text-[var(--color-text-secondary)]">
                    {trade.exitReason ?? '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
            No trades yet
          </p>
        )}
      </div>

      {/* Daily Summary */}
      {todaySummary && (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Trades Opened"
            value={todaySummary.tradesOpened}
            format="integer"
            trend="neutral"
          />
          <MetricCard
            label="Trades Closed"
            value={todaySummary.tradesClosed}
            format="integer"
            trend="neutral"
          />
          <MetricCard
            label="Realized P/L"
            value={todaySummary.realizedPnl}
            format="currency"
          />
          <MetricCard
            label="Drawdown from Peak"
            value={todaySummary.drawdownFromPeak}
            format="percent"
            trend="negative"
          />
        </div>
      )}

      {totalSummary && (
        <>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mt-2">
            Cumulative Performance
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Total Entries" value={totalSummary.entries} format="integer" trend="neutral" />
            <MetricCard label="Total Exits" value={totalSummary.exits} format="integer" trend="neutral" />
            <MetricCard label="Win Rate" value={totalSummary.winRate} format="percent" trend="neutral" subtitle={`${totalSummary.wins} wins`} />
            <MetricCard label="Cumulative P/L" value={totalSummary.totalPnl} format="currency" />
          </div>
        </>
      )}
    </div>
  )
}
