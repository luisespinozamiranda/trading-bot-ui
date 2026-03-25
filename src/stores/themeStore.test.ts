import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from './themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'dark' })
  })

  it('has dark as default theme', () => {
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('toggles from dark to light', () => {
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('toggles from light back to dark', () => {
    useThemeStore.getState().toggleTheme()
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('sets theme directly', () => {
    useThemeStore.getState().setTheme('light')
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('updates document class on toggle', () => {
    useThemeStore.getState().toggleTheme()
    expect(document.documentElement.className).toBe('light')
  })

  it('updates document class on setTheme', () => {
    useThemeStore.getState().setTheme('dark')
    expect(document.documentElement.className).toBe('dark')
  })
})
