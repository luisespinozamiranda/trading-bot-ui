import { describe, it, expect } from 'vitest'
import {
  SYMBOLS,
  INTERVALS,
  STRATEGIES,
  STRATEGY_DISPLAY_NAMES,
  STRATEGY_STATUS,
  POLLING_INTERVALS,
  DEFAULT_BACKTEST_PARAMS,
} from './constants'

describe('SYMBOLS', () => {
  it('contains 4 trading pairs', () => {
    expect(SYMBOLS).toHaveLength(4)
  })

  it('all end with USDT', () => {
    SYMBOLS.forEach((s) => expect(s).toMatch(/USDT$/))
  })

  it('includes BTC and ETH', () => {
    expect(SYMBOLS).toContain('BTCUSDT')
    expect(SYMBOLS).toContain('ETHUSDT')
  })
})

describe('INTERVALS', () => {
  it('contains 6 timeframes', () => {
    expect(INTERVALS).toHaveLength(6)
  })

  it('ranges from 1m to 1d', () => {
    expect(INTERVALS[0]).toBe('1m')
    expect(INTERVALS[INTERVALS.length - 1]).toBe('1d')
  })
})

describe('STRATEGIES', () => {
  it('contains 2 strategies', () => {
    expect(STRATEGIES).toHaveLength(2)
  })

  it('each strategy has a display name', () => {
    STRATEGIES.forEach((s) => {
      expect(STRATEGY_DISPLAY_NAMES[s]).toBeDefined()
      expect(STRATEGY_DISPLAY_NAMES[s].length).toBeGreaterThan(0)
    })
  })
})

describe('STRATEGY_STATUS', () => {
  it('has VALIDATED, DEPLOYED, REJECTED', () => {
    expect(STRATEGY_STATUS.VALIDATED).toBe('VALIDATED')
    expect(STRATEGY_STATUS.DEPLOYED).toBe('DEPLOYED')
    expect(STRATEGY_STATUS.REJECTED).toBe('REJECTED')
  })
})

describe('POLLING_INTERVALS', () => {
  it('all are 10 seconds', () => {
    expect(POLLING_INTERVALS.ACCOUNT).toBe(10_000)
    expect(POLLING_INTERVALS.LIVE_STATUS).toBe(10_000)
    expect(POLLING_INTERVALS.LIVE_TRADES).toBe(10_000)
  })
})

describe('DEFAULT_BACKTEST_PARAMS', () => {
  it('has valid SMA period', () => {
    expect(DEFAULT_BACKTEST_PARAMS.smaPeriod).toBeGreaterThanOrEqual(5)
    expect(DEFAULT_BACKTEST_PARAMS.smaPeriod).toBeLessThanOrEqual(200)
  })

  it('has valid RSI period', () => {
    expect(DEFAULT_BACKTEST_PARAMS.rsiPeriod).toBeGreaterThanOrEqual(2)
    expect(DEFAULT_BACKTEST_PARAMS.rsiPeriod).toBeLessThanOrEqual(50)
  })

  it('has positive initial capital', () => {
    expect(DEFAULT_BACKTEST_PARAMS.initialCapital).toBeGreaterThan(0)
  })

  it('take profit exceeds stop loss', () => {
    expect(DEFAULT_BACKTEST_PARAMS.takeProfitPercent).toBeGreaterThan(
      DEFAULT_BACKTEST_PARAMS.stopLossPercent,
    )
  })

  it('fee and slippage are small percentages', () => {
    expect(DEFAULT_BACKTEST_PARAMS.feePercent).toBeLessThan(1)
    expect(DEFAULT_BACKTEST_PARAMS.slippagePercent).toBeLessThan(1)
  })

  it('risk per trade is reasonable', () => {
    expect(DEFAULT_BACKTEST_PARAMS.riskPerTradePercent).toBeGreaterThan(0)
    expect(DEFAULT_BACKTEST_PARAMS.riskPerTradePercent).toBeLessThanOrEqual(5)
  })
})
