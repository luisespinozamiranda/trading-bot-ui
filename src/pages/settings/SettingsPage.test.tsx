import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import SettingsPage from './SettingsPage'

vi.mock('@/api/hooks/useDataStatus', () => ({
  useSettings: () => ({
    data: [
      { key: 'live.enabled', value: 'true', category: 'live' },
      { key: 'live.initial_capital', value: '10000', category: 'live' },
      { key: 'binance.rate_limit', value: '15', category: 'binance' },
      { key: 'strategy.default_sma', value: '50', category: 'strategy' },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/api/hooks/mutations/useDataMutations', () => ({
  useUpdateSetting: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('SettingsPage', () => {
  it('renders page title', () => {
    renderWithProviders(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders category headers', () => {
    renderWithProviders(<SettingsPage />)
    expect(screen.getByText('live')).toBeInTheDocument()
    expect(screen.getByText('binance')).toBeInTheDocument()
    expect(screen.getByText('strategy')).toBeInTheDocument()
  })

  it('renders setting keys', () => {
    renderWithProviders(<SettingsPage />)
    expect(screen.getByText('live.enabled')).toBeInTheDocument()
    expect(screen.getByText('live.initial_capital')).toBeInTheDocument()
    expect(screen.getByText('binance.rate_limit')).toBeInTheDocument()
  })

  it('renders setting values as clickable buttons', () => {
    renderWithProviders(<SettingsPage />)
    const trueButton = screen.getByRole('button', { name: 'true' })
    expect(trueButton).toBeInTheDocument()
  })

  it('enters edit mode on value click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SettingsPage />)
    await user.click(screen.getByRole('button', { name: '15' }))
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('cancels edit mode', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SettingsPage />)
    await user.click(screen.getByRole('button', { name: '50' }))
    expect(screen.getByDisplayValue('50')).toBeInTheDocument()
    await user.click(screen.getByText('Cancel'))
    expect(screen.queryByDisplayValue('50')).not.toBeInTheDocument()
  })
})
