import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import DataManagementPage from './DataManagementPage'

vi.mock('@/api/hooks/useDataStatus', () => ({
  useDataStatus: () => ({
    data: [
      { symbol: 'BTCUSDT', interval: '1d', totalCandles: 525960, firstCandle: '2023-01-01', lastCandle: '2024-03-24' },
      { symbol: 'ETHUSDT', interval: '1d', totalCandles: 365000, firstCandle: '2023-06-01', lastCandle: '2024-03-24' },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/api/hooks/mutations/useDataMutations', () => ({
  useBackfillData: () => ({ mutate: vi.fn(), isPending: false }),
  useSyncData: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('DataManagementPage', () => {
  it('renders page title', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getByText('Data Management')).toBeInTheDocument()
  })

  it('renders symbol selection buttons', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getAllByText('BTCUSDT').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ETHUSDT').length).toBeGreaterThan(0)
    expect(screen.getByText('SOLUSDT')).toBeInTheDocument()
  })

  it('renders interval selection buttons', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getAllByText('1d').length).toBeGreaterThan(0)
    expect(screen.getByText('1m')).toBeInTheDocument()
    expect(screen.getByText('1h')).toBeInTheDocument()
  })

  it('renders backfill button', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getByText('Backfill')).toBeInTheDocument()
  })

  it('renders sync button', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getByText('Sync Latest')).toBeInTheDocument()
  })

  it('renders data status table', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getByText('Candles')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Last')).toBeInTheDocument()
  })

  it('renders symbol data in table', () => {
    renderWithProviders(<DataManagementPage />)
    const btcElements = screen.getAllByText('BTCUSDT')
    expect(btcElements.length).toBeGreaterThanOrEqual(2) // button + table row
  })

  it('renders months back input', () => {
    renderWithProviders(<DataManagementPage />)
    expect(screen.getByDisplayValue('6')).toBeInTheDocument()
  })
})
