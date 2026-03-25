import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatPercent, formatNumber, formatPrice, formatCompactNumber } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })
})

describe('formatCurrency', () => {
  it('formats positive amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-$500.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('respects custom decimals', () => {
    expect(formatCurrency(99.999, 4)).toBe('$99.9990')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
  })
})

describe('formatPercent', () => {
  it('formats positive with plus sign', () => {
    expect(formatPercent(12.34)).toBe('+12.34%')
  })

  it('formats negative without plus sign', () => {
    expect(formatPercent(-5.67)).toBe('-5.67%')
  })

  it('formats zero with plus sign', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })

  it('respects custom decimals', () => {
    expect(formatPercent(3.14159, 1)).toBe('+3.1%')
  })
})

describe('formatNumber', () => {
  it('formats with default 2 decimals', () => {
    expect(formatNumber(1234.5)).toBe('1,234.50')
  })

  it('formats with custom decimals', () => {
    expect(formatNumber(3.14159, 4)).toBe('3.1416')
  })

  it('formats integers', () => {
    expect(formatNumber(42, 0)).toBe('42')
  })
})

describe('formatPrice', () => {
  it('formats high prices with 2 decimals', () => {
    expect(formatPrice(67234.50)).toBe('$67,234.50')
  })

  it('formats mid prices with 4 decimals', () => {
    expect(formatPrice(3.4567)).toBe('$3.4567')
  })

  it('formats low prices with 6 decimals', () => {
    expect(formatPrice(0.001234)).toBe('$0.001234')
  })
})

describe('formatCompactNumber', () => {
  it('formats thousands', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K')
  })

  it('formats millions', () => {
    expect(formatCompactNumber(2500000)).toBe('2.5M')
  })

  it('formats small numbers as-is', () => {
    expect(formatCompactNumber(42)).toBe('42')
  })
})
