import { describe, it, expect } from 'vitest'
import API from './endpoints'

describe('API endpoints', () => {
  describe('account', () => {
    it('has snapshot endpoint', () => {
      expect(API.account.snapshot).toBe('/api/v1/account/snapshot')
    })
  })

  describe('backtest', () => {
    it('has all static endpoints', () => {
      expect(API.backtest.run).toBe('/api/v1/backtest/run')
      expect(API.backtest.runBinance).toBe('/api/v1/backtest/run/binance')
      expect(API.backtest.optimize).toBe('/api/v1/backtest/run/binance/optimize')
      expect(API.backtest.compare).toBe('/api/v1/backtest/run/binance/compare')
      expect(API.backtest.results).toBe('/api/v1/backtest/results')
    })

    it('generates dynamic endpoints with ID', () => {
      expect(API.backtest.getById('abc-123')).toBe('/api/v1/backtest/abc-123')
      expect(API.backtest.monteCarlo('abc-123')).toBe('/api/v1/backtest/abc-123/monte-carlo')
    })
  })

  describe('live', () => {
    it('has all live trading endpoints', () => {
      expect(API.live.start).toBe('/api/v1/live/start')
      expect(API.live.stop).toBe('/api/v1/live/stop')
      expect(API.live.status).toBe('/api/v1/live/status')
      expect(API.live.trades).toBe('/api/v1/live/trades')
      expect(API.live.dailySummary).toBe('/api/v1/live/summary/daily')
      expect(API.live.totalSummary).toBe('/api/v1/live/summary/total')
    })
  })

  describe('strategies', () => {
    it('has static endpoints', () => {
      expect(API.strategies.list).toBe('/api/v1/strategies')
      expect(API.strategies.best).toBe('/api/v1/strategies/best')
    })

    it('generates deploy/reject with ID', () => {
      expect(API.strategies.deploy(5)).toBe('/api/v1/strategies/5/deploy')
      expect(API.strategies.reject(10)).toBe('/api/v1/strategies/10/reject')
    })

    it('generates bySymbol', () => {
      expect(API.strategies.bySymbol('BTCUSDT')).toBe('/api/v1/strategies/BTCUSDT')
    })
  })

  describe('activeStrategies', () => {
    it('has list and assign endpoints', () => {
      expect(API.activeStrategies.list).toBe('/api/v1/strategies/active')
      expect(API.activeStrategies.enabled).toBe('/api/v1/strategies/active/enabled')
      expect(API.activeStrategies.assign).toBe('/api/v1/strategies/active/assign')
    })

    it('generates delete with ID', () => {
      expect(API.activeStrategies.delete(3)).toBe('/api/v1/strategies/active/3')
    })
  })

  describe('data', () => {
    it('has data management endpoints', () => {
      expect(API.data.backfill).toBe('/api/v1/data/backfill')
      expect(API.data.sync).toBe('/api/v1/data/sync')
      expect(API.data.status).toBe('/api/v1/data/status')
    })
  })

  describe('settings', () => {
    it('has list endpoint', () => {
      expect(API.settings.list).toBe('/api/v1/settings')
    })

    it('generates update with key', () => {
      expect(API.settings.update('live.enabled')).toBe('/api/v1/settings/live.enabled')
    })
  })
})
