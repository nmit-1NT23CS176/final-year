"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

interface UseWebSocketOptions {
  token?: string | null;
  onPriceUpdate?: (data: PriceUpdatePayload) => void;
  onMarketStatus?: (data: { status: 'open' | 'closed'; nextEvent?: string }) => void;
  autoConnect?: boolean;
}

export interface PriceUpdatePayload {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp?: string;
  dayHigh?: number;
  dayLow?: number;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useWebSocket({
  token,
  onPriceUpdate,
  onMarketStatus,
  autoConnect = true,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const url = token ? `${WS_URL}?token=${token}` : WS_URL;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      setStatus('connecting');

      ws.onopen = () => {
        setStatus('connected');
        retryCount.current = 0;
        // Re-subscribe to all previously subscribed symbols
        subscribedSymbols.current.forEach((symbol) => {
          ws.send(JSON.stringify({ event: 'subscribe', data: { symbol } }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          switch (message.event) {
            case 'price_update':
              onPriceUpdate?.(message.data);
              break;
            case 'market_status':
              onMarketStatus?.(message.data);
              break;
            case 'pong':
              break;
            default:
              break;
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(2, retryCount.current), 30000);
        const jitter = baseDelay * (0.8 + Math.random() * 0.4);
        retryCount.current++;
        retryTimer.current = setTimeout(connect, jitter);
      };

      ws.onerror = () => {
        setStatus('error');
        ws.close();
      };
    } catch {
      setStatus('error');
    }
  }, [token, onPriceUpdate, onMarketStatus]);

  const disconnect = useCallback(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  const subscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.add(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'subscribe', data: { symbol } }));
    }
  }, []);

  const unsubscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'unsubscribe', data: { symbol } }));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return { status, subscribe, unsubscribe, connect, disconnect };
}
