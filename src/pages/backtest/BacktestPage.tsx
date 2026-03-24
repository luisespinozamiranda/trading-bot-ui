import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Play, History } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import ParameterSlider from '@/components/trading/ParameterSlider'
import { useRunBinanceBacktest } from '@/api/hooks/mutations/useBacktestMutations'
import { useBacktestResults } from '@/api/hooks/useBacktestResults'
import { SYMBOLS, INTERVALS, STRATEGIES, STRATEGY_DISPLAY_NAMES, DEFAULT_BACKTEST_PARAMS } from '@/lib/constants'
import type { StrategyName } from '@/lib/constants'
import { formatPercent } from '@/lib/utils'
import { format } from 'date-fns'

export default function BacktestPage() {
  const navigate = useNavigate()
  const runBacktest = useRunBinanceBacktest()
  const { data: history } = useBacktestResults()

  const [symbol, setSymbol] = useState<string>(SYMBOLS[0])
  const [interval, setInterval] = useState<string>(INTERVALS[5])
  const [strategy, setStrategy] = useState<string>(STRATEGIES[0])
  const [experimentName, setExperimentName] = useState('')
  const [params, setParams] = useState({ ...DEFAULT_BACKTEST_PARAMS })

  function updateParam(key: string, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  function handleRun() {
    const name = experimentName || `${symbol.toLowerCase()}_${strategy}_${Date.now()}`
    runBacktest.mutate(
      {
        symbol,
        interval,
        strategyName: strategy,
        experimentName: name,
        candleLimit: params.candleLimit,
        initialCapital: params.initialCapital,
        smaPeriod: params.smaPeriod,
        rsiPeriod: params.rsiPeriod,
        rsiThreshold: params.rsiThreshold,
        takeProfitPercent: params.takeProfitPercent,
        stopLossPercent: params.stopLossPercent,
        feePercent: params.feePercent,
        slippagePercent: params.slippagePercent,
        spreadPercent: params.spreadPercent,
        riskPerTradePercent: params.riskPerTradePercent,
      },
      {
        onSuccess: (result) => {
          toast.success('Backtest completed')
          navigate(`/backtest/${result.id}`)
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backtest Lab"
        subtitle="Configure and run strategy backtests"
        actions={
          <Link
            to="/backtest/results"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg transition-colors"
          >
            <History size={14} /> All Results
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Configuration</h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[var(--color-text-secondary)]">Symbol</label>
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="block w-full text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5">
                  {SYMBOLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[var(--color-text-secondary)]">Interval</label>
                <select value={interval} onChange={(e) => setInterval(e.target.value)} className="block w-full text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5">
                  {INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[var(--color-text-secondary)]">Strategy</label>
                <select value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyName)} className="block w-full text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5">
                  {STRATEGIES.map((s) => <option key={s} value={s}>{STRATEGY_DISPLAY_NAMES[s as StrategyName]}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[var(--color-text-secondary)]">Experiment Name (optional)</label>
              <input
                type="text"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                placeholder="e.g. btc_daily_v4"
                className="block w-full text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5 placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </div>

          {/* Indicators */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Indicators</h2>
            <ParameterSlider label="SMA Period" value={params.smaPeriod} min={5} max={200} step={5} onChange={(v) => updateParam('smaPeriod', v)} />
            <ParameterSlider label="RSI Period" value={params.rsiPeriod} min={2} max={50} step={1} onChange={(v) => updateParam('rsiPeriod', v)} />
            <ParameterSlider label="RSI Threshold" value={params.rsiThreshold} min={10} max={70} step={1} onChange={(v) => updateParam('rsiThreshold', v)} />
          </div>

          {/* Risk Management */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Risk Management</h2>
            <ParameterSlider label="Take Profit" value={params.takeProfitPercent} min={0.5} max={20} step={0.5} suffix="%" onChange={(v) => updateParam('takeProfitPercent', v)} />
            <ParameterSlider label="Stop Loss" value={params.stopLossPercent} min={0.5} max={10} step={0.5} suffix="%" onChange={(v) => updateParam('stopLossPercent', v)} />
            <ParameterSlider label="Risk per Trade" value={params.riskPerTradePercent} min={0.5} max={5} step={0.1} suffix="%" onChange={(v) => updateParam('riskPerTradePercent', v)} />
          </div>

          {/* Costs & Data */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Costs & Data</h2>
            <ParameterSlider label="Fee" value={params.feePercent} min={0} max={0.5} step={0.01} suffix="%" onChange={(v) => updateParam('feePercent', v)} />
            <ParameterSlider label="Slippage" value={params.slippagePercent} min={0} max={0.2} step={0.01} suffix="%" onChange={(v) => updateParam('slippagePercent', v)} />
            <ParameterSlider label="Candle Limit" value={params.candleLimit} min={30} max={1000} step={10} onChange={(v) => updateParam('candleLimit', v)} />
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-text-secondary)]">Initial Capital</label>
              <input
                type="number"
                value={params.initialCapital}
                onChange={(e) => updateParam('initialCapital', Number(e.target.value))}
                className="block w-full text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded px-2 py-1.5"
              />
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={runBacktest.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            {runBacktest.isPending ? 'Running...' : 'Run Backtest'}
          </button>
        </div>

        {/* History Sidebar */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Recent Backtests
          </h2>
          <div className="space-y-2">
            {(history ?? []).slice(0, 15).map((r) => (
              <Link
                key={r.id}
                to={`/backtest/${r.id}`}
                className="flex items-center justify-between p-2 rounded hover:bg-[var(--color-surface)] transition-colors"
              >
                <div>
                  <div className="text-xs font-medium text-[var(--color-text-primary)]">
                    {r.experimentName || r.id}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">
                    {r.symbol} {r.timeframe} - {format(new Date(r.executedAt), 'MM/dd HH:mm')}
                  </div>
                </div>
                <span className={`text-xs font-mono font-medium ${r.netProfitPercent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  {formatPercent(r.netProfitPercent)}
                </span>
              </Link>
            ))}
            {!history?.length && (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-4">
                No backtests yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
