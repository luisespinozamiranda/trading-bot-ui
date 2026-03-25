import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricCard from './MetricCard'

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Net Profit" value={1234.56} format="currency" />)
    expect(screen.getByText('Net Profit')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('renders percent format', () => {
    render(<MetricCard label="Win Rate" value={58.3} format="percent" />)
    expect(screen.getByText('+58.30%')).toBeInTheDocument()
  })

  it('renders decimal format', () => {
    render(<MetricCard label="Sharpe" value={1.87} format="decimal" />)
    expect(screen.getByText('1.87')).toBeInTheDocument()
  })

  it('renders integer format', () => {
    render(<MetricCard label="Trades" value={42} format="integer" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders dash for null value', () => {
    render(<MetricCard label="Empty" value={null} />)
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('renders string value as-is', () => {
    render(<MetricCard label="Status" value="Running" format="raw" />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<MetricCard label="PF" value={1.87} format="decimal" subtitle="35W / 25L" />)
    expect(screen.getByText('35W / 25L')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<MetricCard label="Test" value={100} icon={<span data-testid="icon">I</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies green color for positive values', () => {
    const { container } = render(<MetricCard label="P/L" value={500} format="currency" />)
    const valueEl = container.querySelector('.font-mono')
    expect(valueEl?.className).toContain('success')
  })

  it('applies red color for negative values', () => {
    const { container } = render(<MetricCard label="P/L" value={-200} format="currency" />)
    const valueEl = container.querySelector('.font-mono')
    expect(valueEl?.className).toContain('danger')
  })

  it('applies neutral color when trend is neutral', () => {
    const { container } = render(<MetricCard label="Equity" value={10000} format="currency" trend="neutral" />)
    const valueEl = container.querySelector('.font-mono')
    expect(valueEl?.className).toContain('text-primary')
  })
})
