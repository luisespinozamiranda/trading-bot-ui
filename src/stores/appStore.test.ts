import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './appStore'

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({ selectedSymbol: 'BTCUSDT', sidebarCollapsed: false })
  })

  it('has BTCUSDT as default symbol', () => {
    expect(useAppStore.getState().selectedSymbol).toBe('BTCUSDT')
  })

  it('changes selected symbol', () => {
    useAppStore.getState().setSelectedSymbol('ETHUSDT')
    expect(useAppStore.getState().selectedSymbol).toBe('ETHUSDT')
  })

  it('has sidebar expanded by default', () => {
    expect(useAppStore.getState().sidebarCollapsed).toBe(false)
  })

  it('toggles sidebar', () => {
    useAppStore.getState().toggleSidebar()
    expect(useAppStore.getState().sidebarCollapsed).toBe(true)
  })

  it('toggles sidebar back', () => {
    useAppStore.getState().toggleSidebar()
    useAppStore.getState().toggleSidebar()
    expect(useAppStore.getState().sidebarCollapsed).toBe(false)
  })
})
