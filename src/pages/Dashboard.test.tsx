import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import Dashboard from './Dashboard'

vi.mock('@/api/hooks/useAccountSnapshot', () => ({
  useAccountSnapshot: () => ({
    data: {
      totalEquity: 12450.23,
      availableCash: 8200.00,
      unrealizedPnl: 450.23,
      openPositions: [
        { symbol: 'BTCUSDT', quantity: 0.0148, entryPrice: 65123, currentPrice: 67234, unrealizedPnl: 31.24 },
      ],
      timestamp: '2024-03-24T14:00:00',
    },
    isLoading: false,
  }),
}))

vi.mock('@/api/hooks/useLiveStatus', () => ({
  useLiveStatus: () => ({
    data: { running: true, symbol: 'BTCUSDT', interval: '1d', currentCapital: 12450, openPositions: 1 },
  }),
}))

vi.mock('@/api/hooks/useLiveTrades', () => ({
  useLiveTrades: () => ({
    data: [
      {
        id: 1, tradeId: 't1', symbol: 'BTCUSDT', action: 'BUY', price: 65123,
        quantity: 0.0148, positionSize: 976.82, pnlPercent: 0, pnlAmount: 0,
        commission: 0.98, capitalBefore: 10000, capitalAfter: 10000,
        timestamp: '2024-03-24T10:15:00', exitReason: null, decisionSummary: 'RSI crossover',
      },
    ],
  }),
  useDailySummaries: () => ({
    data: [
      {
        date: '2024-03-24', tradesOpened: 1, tradesClosed: 0,
        realizedPnl: 0, totalEquity: 12450, dailyReturnPercent: 1.2, drawdownFromPeak: -0.5,
      },
    ],
  }),
}))

vi.mock('@/api/hooks/useStrategies', () => ({
  useEnabledStrategies: () => ({
    data: [
      { id: 1, symbol: 'BTCUSDT', interval: '1d', strategyId: 1, strategyName: 'rsi_crossover', enabled: true, assignedAt: '2024-03-20' },
    ],
  }),
}))

describe('Dashboard', () => {
  it('renders page title', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders portfolio metrics', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Total Equity')).toBeInTheDocument()
    expect(screen.getByText('Available Cash')).toBeInTheDocument()
    expect(screen.getByText('Unrealized P/L')).toBeInTheDocument()
  })

  it('renders equity value', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('$12,450.23')).toBeInTheDocument()
  })

  it('renders open positions section', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Open Positions')).toBeInTheDocument()
    const btcElements = screen.getAllByText('BTCUSDT')
    expect(btcElements.length).toBeGreaterThan(0)
  })

  it('renders engine status as running', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Engine Status')).toBeInTheDocument()
    expect(screen.getByText('RUNNING')).toBeInTheDocument()
  })

  it('renders active strategies', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Active Strategies')).toBeInTheDocument()
    expect(screen.getByText('rsi_crossover')).toBeInTheDocument()
  })

  it('renders recent trades section', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Recent Trades')).toBeInTheDocument()
    expect(screen.getByText('BUY')).toBeInTheDocument()
  })

  it('renders View All link', () => {
    renderWithProviders(<Dashboard />)
    const viewAllLinks = screen.getAllByText('View All')
    expect(viewAllLinks.length).toBeGreaterThan(0)
  })
})
