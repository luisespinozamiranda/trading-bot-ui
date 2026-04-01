import { useRef, useEffect, useMemo } from 'react'
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  LineStyle,
  createSeriesMarkers,
  type IChartApi,
  type UTCTimestamp,
  type SeriesMarker,
  type Time,
} from 'lightweight-charts'
import { useCandles } from '@/api/hooks/useCandles'
import { useThemeStore } from '@/stores/themeStore'
import { calculateSMA, calculateRSI } from '@/lib/indicators'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import type { TradeDecisionLog } from '@/api/types'

interface CandlestickChartProps {
  symbol: string
  interval: string
  trades?: TradeDecisionLog[]
  showMarkers?: boolean
  height?: number
}

interface ThemeColors {
  bg: string
  text: string
  grid: string
}

function getThemeColors(theme: string): ThemeColors {
  if (theme === 'dark') {
    return { bg: '#0D1117', text: '#E6EDF3', grid: '#1C2333' }
  }
  return { bg: '#FFFFFF', text: '#1A1A1A', grid: '#E5E7EB' }
}

function toUTC(isoString: string): UTCTimestamp {
  return Math.floor(new Date(isoString).getTime() / 1000) as UTCTimestamp
}

function buildCandlestickData(candles: { openTime: string; open: number; high: number; low: number; close: number }[]) {
  return candles.map((c) => ({
    time: toUTC(c.openTime),
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }))
}

function buildTimedCloses(candles: { openTime: string; close: number }[]) {
  return candles.map((c) => ({ time: toUTC(c.openTime) as number, close: c.close }))
}

function buildSMAData(candles: { openTime: string; close: number }[]) {
  const timed = buildTimedCloses(candles)
  return calculateSMA(timed, 200).map((p) => ({
    time: p.time as UTCTimestamp,
    value: p.value,
  }))
}

function buildRSIData(candles: { openTime: string; close: number }[]) {
  const timed = buildTimedCloses(candles)
  return calculateRSI(timed, 14).map((p) => ({
    time: p.time as UTCTimestamp,
    value: p.value,
  }))
}

function buildTradeMarkers(trades: TradeDecisionLog[]): SeriesMarker<Time>[] {
  return trades
    .map((trade) => ({
      time: toUTC(trade.timestamp) as Time,
      position: (trade.action === 'BUY' ? 'belowBar' : 'aboveBar') as 'belowBar' | 'aboveBar',
      color: trade.action === 'BUY' ? '#2EA043' : '#DA3633',
      shape: (trade.action === 'BUY' ? 'arrowUp' : 'arrowDown') as 'arrowUp' | 'arrowDown',
      text: `${trade.action} @ ${trade.price}`,
    }))
    .sort((a, b) => (a.time as number) - (b.time as number))
}

export default function CandlestickChart({
  symbol,
  interval,
  trades,
  showMarkers = false,
  height = 400,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const { data: candles, isLoading } = useCandles(symbol, interval)
  const theme = useThemeStore((s) => s.theme)
  const colors = useMemo(() => getThemeColors(theme), [theme])

  const ohlcData = useMemo(() => (candles ? buildCandlestickData(candles) : []), [candles])
  const smaData = useMemo(() => (candles ? buildSMAData(candles) : []), [candles])
  const rsiData = useMemo(() => (candles ? buildRSIData(candles) : []), [candles])
  const markers = useMemo(
    () => (trades && showMarkers ? buildTradeMarkers(trades) : []),
    [trades, showMarkers],
  )

  useEffect(() => {
    if (!chartContainerRef.current || !ohlcData.length) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: { background: { color: colors.bg }, textColor: colors.text },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      timeScale: { borderColor: colors.grid },
      rightPriceScale: { borderColor: colors.grid },
    })
    chartRef.current = chart

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderUpColor: '#26A69A',
      borderDownColor: '#EF5350',
      wickUpColor: '#26A69A',
      wickDownColor: '#EF5350',
    })
    candleSeries.setData(ohlcData)

    if (smaData.length) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      smaSeries.setData(smaData)
    }

    if (markers.length) {
      createSeriesMarkers(candleSeries, markers)
    }

    if (rsiData.length) {
      const rsiSeries = chart.addSeries(LineSeries, {
        color: '#7C4DFF',
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        priceScaleId: 'rsi',
      }, 1)
      rsiSeries.setData(rsiData)

      addRSIReferenceLine(rsiSeries, 70)
      addRSIReferenceLine(rsiSeries, 30)
    }

    chart.timeScale().fitContent()

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) chart.applyOptions({ width: entry.contentRect.width })
    })
    observer.observe(chartContainerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [ohlcData, smaData, rsiData, markers, height, colors])

  if (isLoading) return <LoadingSkeleton variant="card" count={1} />

  if (!candles?.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-[var(--color-text-muted)]"
        style={{ height }}
      >
        No candle data available for {symbol}
      </div>
    )
  }

  return <div ref={chartContainerRef} style={{ height }} />
}

function addRSIReferenceLine(
  series: ReturnType<IChartApi['addSeries']>,
  price: number,
) {
  series.createPriceLine({
    price,
    color: '#787B86',
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    axisLabelVisible: false,
  })
}
