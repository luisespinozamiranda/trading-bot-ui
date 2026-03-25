import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="No data available" />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    render(<EmptyState message="Empty" action="Add Item" onAction={() => {}} />)
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
  })

  it('does not render button without action', () => {
    render(<EmptyState message="Empty" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not render button without onAction', () => {
    render(<EmptyState message="Empty" action="Click me" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onAction when button clicked', () => {
    const onAction = vi.fn()
    render(<EmptyState message="Empty" action="Click" onAction={onAction} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
