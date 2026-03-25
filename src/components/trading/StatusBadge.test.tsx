import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="DEPLOYED" />)
    expect(screen.getByText('DEPLOYED')).toBeInTheDocument()
  })

  it('applies success style for DEPLOYED', () => {
    const { container } = render(<StatusBadge status="DEPLOYED" />)
    expect(container.firstChild?.textContent).toBe('DEPLOYED')
    expect((container.firstChild as HTMLElement).className).toContain('success')
  })

  it('applies info style for VALIDATED', () => {
    const { container } = render(<StatusBadge status="VALIDATED" />)
    expect((container.firstChild as HTMLElement).className).toContain('accent')
  })

  it('applies danger style for REJECTED', () => {
    const { container } = render(<StatusBadge status="REJECTED" />)
    expect((container.firstChild as HTMLElement).className).toContain('danger')
  })

  it('applies success style for BUY', () => {
    const { container } = render(<StatusBadge status="BUY" />)
    expect((container.firstChild as HTMLElement).className).toContain('success')
  })

  it('applies danger style for SELL', () => {
    const { container } = render(<StatusBadge status="SELL" />)
    expect((container.firstChild as HTMLElement).className).toContain('danger')
  })

  it('applies warning style for PENDING', () => {
    const { container } = render(<StatusBadge status="PENDING" />)
    expect((container.firstChild as HTMLElement).className).toContain('warning')
  })

  it('applies default style for unknown status', () => {
    const { container } = render(<StatusBadge status="UNKNOWN" />)
    expect((container.firstChild as HTMLElement).className).toContain('surface')
  })

  it('renders uppercase text', () => {
    const { container } = render(<StatusBadge status="RUNNING" />)
    expect((container.firstChild as HTMLElement).className).toContain('uppercase')
  })
})
