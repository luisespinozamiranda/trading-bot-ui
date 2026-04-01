import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import LiveTradingPage from './LiveTradingPage'

vi.mock('@/api/hooks/useLiveStatus', () => ({
  useLiveStatus: () => ({
    data: {
      managerRunning: false,
      wsConnected: false,
      totalEquity: 10000,
      cashBalance: 10000,
      openPositions: 0,
      engines: [],
    },
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
  useReloadStrategies: () => ({ mutate: vi.fn(), isPending: false }),
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

  it('shows empty state when no engines', () => {
    renderWithProviders(<LiveTradingPage />)
    expect(screen.getByText('No active strategy assignments.')).toBeInTheDocument()
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
