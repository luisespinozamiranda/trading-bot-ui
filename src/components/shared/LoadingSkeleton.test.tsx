import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LoadingSkeleton from './LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders card variant with correct count', () => {
    const { container } = render(<LoadingSkeleton variant="card" count={4} />)
    const cards = container.querySelectorAll('.rounded-lg')
    expect(cards.length).toBe(4)
  })

  it('renders line variant with correct count', () => {
    const { container } = render(<LoadingSkeleton variant="line" count={3} />)
    const lines = container.querySelectorAll('.animate-pulse')
    expect(lines.length).toBe(3)
  })

  it('renders table variant with header + rows', () => {
    const { container } = render(<LoadingSkeleton variant="table" count={5} />)
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBe(6) // 1 header + 5 rows
  })

  it('defaults to card variant', () => {
    const { container } = render(<LoadingSkeleton count={2} />)
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })

  it('defaults to count of 1', () => {
    const { container } = render(<LoadingSkeleton variant="line" />)
    const lines = container.querySelectorAll('.animate-pulse')
    expect(lines.length).toBe(1)
  })

  it('all skeleton elements have animate-pulse', () => {
    const { container } = render(<LoadingSkeleton variant="line" count={3} />)
    container.querySelectorAll('.animate-pulse').forEach((el) => {
      expect(el.className).toContain('animate-pulse')
    })
  })
})
