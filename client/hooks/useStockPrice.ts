"use client";

import { useEffect, useState, useRef } from 'react';
import { stockApi } from '@/services/stock-api';
import { StockQuote } from '../../shared/types/stock';

interface UseStockPriceResult {
  price: number | null;
  change: number | null;
  changePercent: number | null;
  isLoading: boolean;
  error: string | null;
  flashDirection: 'up' | 'down' | null;
}

/**
 * Fetches stock price via REST and can receive WebSocket updates.
 * Returns the latest price with flash direction for animations.
 */
export function useStockPrice(symbol: string | null): UseStockPriceResult {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashDirection, setFlashDirection] = useState<'up' | 'down' | null>(null);
  const prevPrice = useRef<number | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;
    const t = setTimeout(() => {
      setIsLoading(true);
      setError(null);
    }, 0);

    stockApi.getStockDetails(symbol)
      .then((res) => {
        if (cancelled) return;
        if (res.data.quote) {
          setQuote(res.data.quote);
          prevPrice.current = res.data.quote.currentPrice;
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => { 
      cancelled = true; 
      clearTimeout(t);
    };
  }, [symbol]);

  // Removed unused updatePrice function to fix lint error
  return {
    price: quote?.currentPrice ?? null,
    change: quote?.change ?? null,
    changePercent: quote?.changePercent ?? null,
    isLoading,
    error,
    flashDirection,
  };
}
