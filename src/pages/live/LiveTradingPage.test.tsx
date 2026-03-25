import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import LiveTradingPage from './LiveTradingPage'

vi.mock('@/api/hooks/useLiveStatus', () => ({
  useLiveStatus: () => ({
    data: { running: false, symbol: 'BTCUSDT', interval: '1d', currentCapital: 10000, openPositions: 0 },
    isLoading: false,
  }),
}))

vi.mock('@/api/hooks/useLiveTrades', () => ({
  useTotalSummary: () => ({
    data: { entries: 24, exits: 23, wins: 14, winRate: 60.9, totalPnl: 2450.23, currentCapital: 12450 },
  }),
}))

vi.mock('@/api/hooks/mutations/useLiveMutations', () => ({
  useStartLiveTrading: () => ({ mutate: vi.fn(), isPending: false }),
  useStopLiveTrading: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('LiveTradingPage', () => {
  it('renders page title', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Live Trading')).toBeInTheDocument()
  })

  it('renders engine section', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Engine')).toBeInTheDocument()
  })

  it('shows stopped status', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('STOPPED')).toBeInTheDocument()
  })

  it('shows start button when stopped', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Start Engine')).toBeInTheDocument()
  })

  it('renders configuration fields when stopped', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByDisplayValue('BTCUSDT')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1d')).toBeInTheDocument()
  })

  it('renders summary metrics', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Total Entries')).toBeInTheDocument()
    expect(screen.getByText('Total Exits')).toBeInTheDocument()
    expect(screen.getByText('Win Rate')).toBeInTheDocument()
    expect(screen.getByText('Total P/L')).toBeInTheDocument()
  })

  it('renders trade logs link', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Trade Decision Logs')).toBeInTheDocument()
  })

  it('renders daily summary link', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('Daily Summaries')).toBeInTheDocument()
  })
})
