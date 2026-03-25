import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import BacktestPage from './BacktestPage'

vi.mock('@/api/hooks/mutations/useBacktestMutations', () => ({
  useRunBinanceBacktest: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/api/hooks/useBacktestResults', () => ({
  useBacktestResults: () => ({
    data: [
      {
        id: 'bt-001', symbol: 'BTCUSDT', timeframe: '1d',
        experimentName: 'btc_daily_v3', status: 'COMPLETED',
        totalTrades: 35, winningTrades: 20, losingTrades: 15,
        winRate: 57.1, netProfitPercent: 34.21, netProfitDollar: 3421,
        maxDrawdown: -12.4, profitFactor: 1.87, sharpeRatio: 1.45,
        sortinoRatio: 2.12, expectancy: 97.74,
        initialCapital: 10000, finalCapital: 13421, totalFees: 234,
        trades: [], equityCurve: [], executedAt: '2024-03-24T10:00:00',
      },
    ],
  }),
}))

describe('BacktestPage', () => {
  it('renders page title', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Backtest Lab')).toBeInTheDocument()
  })

  it('renders configuration section', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Configuration')).toBeInTheDocument()
  })

  it('renders symbol selector', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByDisplayValue('BTCUSDT')).toBeInTheDocument()
  })

  it('renders interval selector', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByDisplayValue('1d')).toBeInTheDocument()
  })

  it('renders strategy selector', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByDisplayValue('RSI Crossover')).toBeInTheDocument()
  })

  it('renders indicator sliders', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Indicators')).toBeInTheDocument()
    expect(screen.getByText('SMA Period')).toBeInTheDocument()
    expect(screen.getByText('RSI Period')).toBeInTheDocument()
    expect(screen.getByText('RSI Threshold')).toBeInTheDocument()
  })

  it('renders risk management sliders', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Risk Management')).toBeInTheDocument()
    expect(screen.getByText('Take Profit')).toBeInTheDocument()
    expect(screen.getByText('Stop Loss')).toBeInTheDocument()
    expect(screen.getByText('Risk per Trade')).toBeInTheDocument()
  })

  it('renders costs section', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Costs & Data')).toBeInTheDocument()
    expect(screen.getByText('Fee')).toBeInTheDocument()
    expect(screen.getByText('Slippage')).toBeInTheDocument()
  })

  it('renders run backtest button', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Run Backtest')).toBeInTheDocument()
  })

  it('renders backtest history', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('Recent Backtests')).toBeInTheDocument()
    expect(screen.getByText('btc_daily_v3')).toBeInTheDocument()
  })

  it('shows profit in history', () => {
    renderWithProviders(<BacktestPage />)
    expect(screen.getByText('+34.21%')).toBeInTheDocument()
  })
})
