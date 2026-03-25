import { describe, it, expect } from 'vitest'
import API from './endpoints'

describe('apiClient module', () => {
  it('exports a default module', async () => {
    const mod = await import('./client')
    expect(mod.default).toBeDefined()
  })

  it('API endpoints are accessible', () => {
    expect(API.account.snapshot).toBeDefined()
    expect(API.live.start).toBeDefined()
    expect(API.backtest.runBinance).toBeDefined()
  })
})
