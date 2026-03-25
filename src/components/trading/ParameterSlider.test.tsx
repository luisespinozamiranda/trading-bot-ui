import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ParameterSlider from './ParameterSlider'

describe('ParameterSlider', () => {
  const defaultProps = {
    label: 'SMA Period',
    value: 50,
    min: 5,
    max: 200,
    step: 5,
    onChange: vi.fn(),
  }

  it('renders label', () => {
    render(<ParameterSlider {...defaultProps} />)
    expect(screen.getByText('SMA Period')).toBeInTheDocument()
  })

  it('renders current value in number input', () => {
    render(<ParameterSlider {...defaultProps} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(50)
  })

  it('renders range slider', () => {
    render(<ParameterSlider {...defaultProps} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('50')
  })

  it('calls onChange when number input changes', () => {
    const onChange = vi.fn()
    render(<ParameterSlider {...defaultProps} onChange={onChange} />)
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '100' } })
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('calls onChange when slider changes', () => {
    const onChange = vi.fn()
    render(<ParameterSlider {...defaultProps} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } })
    expect(onChange).toHaveBeenCalledWith(75)
  })

  it('renders suffix when provided', () => {
    render(<ParameterSlider {...defaultProps} suffix="%" />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('has correct min/max on slider', () => {
    render(<ParameterSlider {...defaultProps} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '5')
    expect(slider).toHaveAttribute('max', '200')
    expect(slider).toHaveAttribute('step', '5')
  })

  it('has correct min/max on number input', () => {
    render(<ParameterSlider {...defaultProps} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '5')
    expect(input).toHaveAttribute('max', '200')
  })
})
