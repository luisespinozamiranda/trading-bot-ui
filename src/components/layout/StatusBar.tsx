import { useAccountSnapshot } from '@/api/hooks/useAccountSnapshot'
import { useLiveStatus } from '@/api/hooks/useLiveStatus'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function StatusBar() {
  const { data: account, isError: accountError } = useAccountSnapshot()
  const { data: liveStatus } = useLiveStatus()

  const dailyPnl = account ? account.totalEquity - (account.availableCash + account.unrealizedPnl) : 0

  return (
    <footer className="flex items-center justify-between h-7 px-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[10px] font-mono">
      <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
        <span>
          Equity:{' '}
          <span className="text-[var(--color-text-primary)]">
            {account ? formatCurrency(account.totalEquity) : '--'}
          </span>
        </span>
        <span>
          Open:{' '}
          <span className="text-[var(--color-text-primary)]">
            {liveStatus?.openPositions ?? 0}
          </span>
        </span>
        {account && (
          <span>
            Unrealized:{' '}
            <span
              className={
                account.unrealizedPnl >= 0
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-danger)]'
              }
            >
              {formatCurrency(account.unrealizedPnl)}
            </span>
          </span>
        )}
        {dailyPnl !== 0 && (
          <span>
            Daily:{' '}
            <span
              className={
                dailyPnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
              }
            >
              {formatPercent((dailyPnl / (account?.totalEquity ?? 1)) * 100)}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
        <span className={accountError ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}>
          {accountError ? 'API Disconnected' : 'API Connected'}
        </span>
      </div>
    </footer>
  )
}
