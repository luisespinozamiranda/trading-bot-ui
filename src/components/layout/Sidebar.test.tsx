import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAppStore } from '@/stores/appStore'

function renderSidebar() {
  return render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    useAppStore.setState({ sidebarCollapsed: false })
  })

  it('renders all navigation items when expanded', () => {
    renderSidebar()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Strategies')).toBeInTheDocument()
    expect(screen.getByText('Backtest Lab')).toBeInTheDocument()
    expect(screen.getByText('Live Trading')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders Trading Bot title when expanded', () => {
    renderSidebar()
    expect(screen.getByText('Trading Bot')).toBeInTheDocument()
  })

  it('hides labels when collapsed', () => {
    useAppStore.setState({ sidebarCollapsed: true })
    renderSidebar()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Strategies')).not.toBeInTheDocument()
    expect(screen.queryByText('Trading Bot')).not.toBeInTheDocument()
  })

  it('toggles sidebar on button click', () => {
    renderSidebar()
    expect(useAppStore.getState().sidebarCollapsed).toBe(false)

    const buttons = screen.getAllByRole('button')
    const toggleButton = buttons[0]
    fireEvent.click(toggleButton)

    expect(useAppStore.getState().sidebarCollapsed).toBe(true)
  })

  it('has correct navigation links', () => {
    renderSidebar()
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/strategies')
    expect(hrefs).toContain('/backtest')
    expect(hrefs).toContain('/live')
    expect(hrefs).toContain('/data')
    expect(hrefs).toContain('/settings')
  })

  it('applies narrow width when collapsed', () => {
    useAppStore.setState({ sidebarCollapsed: true })
    const { container } = renderSidebar()
    expect(container.querySelector('aside')?.className).toContain('w-16')
  })

  it('applies wide width when expanded', () => {
    const { container } = renderSidebar()
    expect(container.querySelector('aside')?.className).toContain('w-56')
  })
})
