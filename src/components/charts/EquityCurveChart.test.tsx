import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EquityCurveChart from './EquityCurveChart'
import type { EquityPoint } from '@/api/types'

vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ReferenceLine: () => <div data-testid="reference-line" />,
}))

describe('EquityCurveChart', () => {
  const sampleData: EquityPoint[] = [
    { timestamp: '2024-01-01T00:00:00', capital: 10000, drawdownPercent: 0 },
    { timestamp: '2024-01-02T00:00:00', capital: 10500, drawdownPercent: 0 },
    { timestamp: '2024-01-03T00:00:00', capital: 10200, drawdownPercent: -2.86 },
    { timestamp: '2024-01-04T00:00:00', capital: 11000, drawdownPercent: 0 },
  ]

  it('renders empty state when no data', () => {
    render(<EquityCurveChart data={[]} initialCapital={10000} finalCapital={10000} />)
    expect(screen.getByText('No equity curve data available')).toBeInTheDocument()
  })

  it('renders chart when data is provided', () => {
    render(<EquityCurveChart data={sampleData} initialCapital={10000} finalCapital={11000} />)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders chart components', () => {
    render(<EquityCurveChart data={sampleData} initialCapital={10000} finalCapital={11000} />)
    expect(screen.getByTestId('area')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('reference-line')).toBeInTheDocument()
  })
})
