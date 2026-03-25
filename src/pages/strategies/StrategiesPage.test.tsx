import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import StrategiesPage from './StrategiesPage'

vi.mock('@/api/hooks/useStrategies', () => ({
  useStrategies: () => ({
    data: [
      {
        id: 1, symbol: 'BTCUSDT', interval: '1d', strategyName: 'rsi_crossover',
        smaPeriod: 50, rsiPeriod: 14, rsiThreshold: 45, takeProfitPct: 8, stopLossPct: 3,
        trainProfitPct: 45.2, testProfitPct: 23.1, profitFactor: 1.87,
        sharpeRatio: 1.45, maxDrawdown: -12.4, winRate: 58.3,
        trainTrades: 120, testTrades: 35, score: 8.45,
        status: 'VALIDATED', createdAt: '2024-03-20',
      },
      {
        id: 2, symbol: 'ETHUSDT', interval: '1d', strategyName: 'trend_pullback',
        smaPeriod: 200, rsiPeriod: 14, rsiThreshold: 30, takeProfitPct: 4, stopLossPct: 2,
        trainProfitPct: 38.1, testProfitPct: 19.5, profitFactor: 1.62,
        sharpeRatio: 1.12, maxDrawdown: -8.7, winRate: 52.1,
        trainTrades: 95, testTrades: 28, score: 7.12,
        status: 'DEPLOYED', createdAt: '2024-03-18',
      },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/api/hooks/mutations/useStrategyMutations', () => ({
  useDeployStrategy: () => ({ mutate: vi.fn(), isPending: false }),
  useRejectStrategy: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('StrategiesPage', () => {
  it('renders page title', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('Strategy Management')).toBeInTheDocument()
  })

  it('renders strategy count', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('2 optimized strategies')).toBeInTheDocument()
  })

  it('renders both strategies', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getAllByText('BTCUSDT').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ETHUSDT').length).toBeGreaterThan(0)
  })

  it('renders strategy names', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('rsi_crossover')).toBeInTheDocument()
    expect(screen.getByText('trend_pullback')).toBeInTheDocument()
  })

  it('renders status badges', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('VALIDATED')).toBeInTheDocument()
    expect(screen.getByText('DEPLOYED')).toBeInTheDocument()
  })

  it('renders filter dropdowns', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByDisplayValue('All Symbols')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument()
  })

  it('renders Active Assignments link', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('Active Assignments')).toBeInTheDocument()
  })

  it('renders table headers', () => {
    renderWithProviders(<StrategiesPage />)
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('Strategy')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })
})
