interface TimedClose {
  time: number
  close: number
}

interface TimedValue {
  time: number
  value: number
}

export function calculateSMA(candles: TimedClose[], period: number): TimedValue[] {
  if (candles.length < period) return []

  const result: TimedValue[] = []
  let sum = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0)

  result.push({ time: candles[period - 1].time, value: sum / period })

  for (let i = period; i < candles.length; i++) {
    sum += candles[i].close - candles[i - period].close
    result.push({ time: candles[i].time, value: sum / period })
  }

  return result
}

function calculateGains(candles: TimedClose[]): { gains: number[]; losses: number[] } {
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 1; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? -change : 0)
  }

  return { gains, losses }
}

function averageSlice(values: number[], start: number, length: number): number {
  return values.slice(start, start + length).reduce((a, b) => a + b, 0) / length
}

export function calculateRSI(candles: TimedClose[], period: number): TimedValue[] {
  if (candles.length < period + 1) return []

  const { gains, losses } = calculateGains(candles)
  let avgGain = averageSlice(gains, 0, period)
  let avgLoss = averageSlice(losses, 0, period)

  const result: TimedValue[] = [
    { time: candles[period].time, value: toRSI(avgGain, avgLoss) },
  ]

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    result.push({ time: candles[i + 1].time, value: toRSI(avgGain, avgLoss) })
  }

  return result
}

function toRSI(avgGain: number, avgLoss: number): number {
  if (avgLoss === 0) return 100
  return 100 - 100 / (1 + avgGain / avgLoss)
}
