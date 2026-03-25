import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Dashboard" subtitle="Overview of your portfolio" />)
    expect(screen.getByText('Overview of your portfolio')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<PageHeader title="Dashboard" />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Test"
        actions={<button>Action</button>}
      />,
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('renders title as h1', () => {
    render(<PageHeader title="My Title" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Title')
  })
})
