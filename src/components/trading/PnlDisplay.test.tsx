import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PnlDisplay from './PnlDisplay'

describe('PnlDisplay', () => {
  it('renders positive currency with plus sign', () => {
    render(<PnlDisplay value={321.00} />)
    expect(screen.getByText('+$321.00')).toBeInTheDocument()
  })

  it('renders negative currency', () => {
    render(<PnlDisplay value={-150.50} />)
    expect(screen.getByText('-$150.50')).toBeInTheDocument()
  })

  it('renders percent type', () => {
    render(<PnlDisplay value={3.21} type="percent" />)
    expect(screen.getByText('+3.21%')).toBeInTheDocument()
  })

  it('renders negative percent', () => {
    render(<PnlDisplay value={-2.5} type="percent" />)
    expect(screen.getByText('-2.50%')).toBeInTheDocument()
  })

  it('applies green color for positive', () => {
    const { container } = render(<PnlDisplay value={100} />)
    expect(container.firstChild).toHaveClass('text-[var(--color-success)]')
  })

  it('applies red color for negative', () => {
    const { container } = render(<PnlDisplay value={-100} />)
    expect(container.firstChild).toHaveClass('text-[var(--color-danger)]')
  })

  it('applies secondary color for zero', () => {
    const { container } = render(<PnlDisplay value={0} />)
    expect(container.firstChild).toHaveClass('text-[var(--color-text-secondary)]')
  })

  it('respects size prop', () => {
    const { container } = render(<PnlDisplay value={100} size="sm" />)
    expect(container.firstChild).toHaveClass('text-xs')
  })

  it('renders large size', () => {
    const { container } = render(<PnlDisplay value={100} size="lg" />)
    expect(container.firstChild).toHaveClass('text-lg')
  })
})
