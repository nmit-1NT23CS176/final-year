"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiFetch, fetchForecastBatch, ForecastData, TickersResponse } from '@/lib/api'

// ── Featured symbols for homepage signals ──────────────
const FEATURED_SYMBOLS = [
  'RELIANCE','TCS','HDFCBANK','ICICIBANK','INFY','BHARTIARTL',
  'SBIN','KOTAKBANK','AXISBANK','WIPRO','HCLTECH','TATASTEEL',
]

const TICKER_SYMBOLS = [
  'RELIANCE','TCS','HDFCBANK','INFY','ICICIBANK','BHARTIARTL','SBIN',
]

export interface SignalSummary {
  bullishCount: number
  bearishCount: number
  noSignalCount: number
  total: number
  topStock: ForecastData | null
  bullishStocks: ForecastData[]
  allStocks: ForecastData[]
  lastFetchedAt: Date | null
}

// ── Hook: homepage signals summary ─────────────────────
export function useSignalsSummary(intervalMs = 300_000) {
  const [data, setData] = useState<SignalSummary>({
    bullishCount: 0, bearishCount: 0, noSignalCount: 0, total: 0,
    topStock: null, bullishStocks: [], allStocks: [], lastFetchedAt: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<SignalSummary | null>(null)

  const fetch = useCallback(async () => {
    try {
      const forecasts = await fetchForecastBatch(FEATURED_SYMBOLS, 6)
      const bullish = forecasts.filter(f => f.target_prediction === 1)
      const bearish = forecasts.filter(f => f.target_prediction === 0)
      const noSig = forecasts.filter(f => f.target_prediction === -1)
      const top = [...forecasts].sort((a, b) => b.intelligence_score - a.intelligence_score)[0] ?? null

      const summary: SignalSummary = {
        bullishCount: bullish.length,
        bearishCount: bearish.length,
        noSignalCount: noSig.length,
        total: forecasts.length,
        topStock: top,
        bullishStocks: bullish.sort((a, b) => b.intelligence_score - a.intelligence_score),
        allStocks: forecasts.sort((a, b) => b.intelligence_score - a.intelligence_score),
        lastFetchedAt: new Date(),
      }
      cacheRef.current = summary
      setData(summary)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      if (cacheRef.current) setData(cacheRef.current)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    if (intervalMs > 0) {
      const id = setInterval(fetch, intervalMs)
      return () => clearInterval(id)
    }
  }, [fetch, intervalMs])

  return { data, loading, error, refetch: fetch }
}

// ── Hook: all stocks for /stocks page ──────────────────
export function useAllStocks(intervalMs = 300_000) {
  const [tickers, setTickers] = useState<string[]>([])
  const [forecasts, setForecasts] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null)
  const cacheRef = useRef<ForecastData[]>([])

  const doFetch = useCallback(async (syms: string[]) => {
    try {
      setLoading(true)
      const results = await fetchForecastBatch(syms, 8)
      cacheRef.current = results
      setForecasts(results)
      setLastFetchedAt(new Date())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      if (cacheRef.current.length > 0) setForecasts(cacheRef.current)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    apiFetch<TickersResponse>('/api/v1/tickers').then(r => {
      setTickers(r.data)
      // Fetch top 24 immediately for fast rendering, then background load the rest
      const initial = r.data.slice(0, 24)
      doFetch(initial).then(() => {
        if (r.data.length > 24) {
          fetchForecastBatch(r.data.slice(24), 8).then(rest => {
            setForecasts(prev => [...prev, ...rest])
          })
        }
      })
    }).catch(() => {
      doFetch(FEATURED_SYMBOLS)
    })
  }, [doFetch])

  useEffect(() => {
    if (tickers.length === 0 || intervalMs === 0) return
    const id = setInterval(() => doFetch(tickers), intervalMs)
    return () => clearInterval(id)
  }, [tickers, doFetch, intervalMs])

  return { forecasts, loading, error, lastFetchedAt, refetch: () => doFetch(tickers) }
}

// ── Hook: single stock forecast ─────────────────────────
export function useForecast(symbol: string) {
  const [data, setData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) return
    setLoading(true)
    apiFetch<{ success: boolean; data: ForecastData }>(`/api/v1/forecast/${symbol}`)
      .then(r => { setData(r.data); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [symbol])

  return { data, loading, error }
}

// ── Hook: ticker strip data ─────────────────────────────
export function useTickerStocks(intervalMs = 60_000) {
  const [stocks, setStocks] = useState<ForecastData[]>([])
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null)
  const cacheRef = useRef<ForecastData[]>([])

  const doFetch = useCallback(async () => {
    try {
      const results = await fetchForecastBatch(TICKER_SYMBOLS, 7)
      cacheRef.current = results
      setStocks(results)
      setLastFetchedAt(new Date())
    } catch {
      if (cacheRef.current.length > 0) setStocks(cacheRef.current)
    }
  }, [])

  useEffect(() => {
    doFetch()
    const id = setInterval(doFetch, intervalMs)
    return () => clearInterval(id)
  }, [doFetch, intervalMs])

  return { stocks, lastFetchedAt }
}
