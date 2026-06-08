"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CandlestickSeries, HistogramSeries, CrosshairMode } from "lightweight-charts";

interface CandleData {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  symbol: string;
  data?: CandleData[];
  className?: string;
}

const TIMEFRAMES = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "5Y", days: 1825 },
] as const;

export function CandlestickChart({ symbol, data, className }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState("1M");

  const selectedTf = TIMEFRAMES.find(t => t.label === activeTimeframe) || TIMEFRAMES[2];

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8b8f98",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(42, 45, 53, 0.5)" },
        horzLines: { color: "rgba(42, 45, 53, 0.5)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "rgba(83, 103, 255, 0.3)", labelBackgroundColor: "#22252c" },
        horzLine: { color: "rgba(83, 103, 255, 0.3)", labelBackgroundColor: "#22252c" },
      },
      rightPriceScale: {
        borderColor: "rgba(42, 45, 53, 0.5)",
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      timeScale: {
        borderColor: "rgba(42, 45, 53, 0.5)",
        timeVisible: selectedTf.days <= 7,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height: 480,
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00d09c",
      downColor: "#ff5252",
      borderDownColor: "#ff5252",
      borderUpColor: "#00d09c",
      wickDownColor: "#ff5252",
      wickUpColor: "#00d09c",
    });

    // Volume histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Use provided data or generate mock
    const candleData = data || generateMockCandles(selectedTf.days);

    candleSeries.setData(candleData as any);

    const volumeData = candleData.map((d) => ({
      time: d.time,
      value: Math.floor(Math.random() * 10000000) + 1000000,
      color: d.close >= d.open ? "rgba(0, 208, 156, 0.2)" : "rgba(255, 82, 82, 0.2)",
    }));
    volumeSeries.setData(volumeData as any);

    chart.timeScale().fitContent();
    chartRef.current = chart;

    // Responsive resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [symbol, activeTimeframe, data, selectedTf.days]);

  return (
    <div className={className}>
      {/* Timeframe selectors */}
      <div className="flex items-center gap-0.5 mb-3 px-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.label}
            onClick={() => setActiveTimeframe(tf.label)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
              activeTimeframe === tf.label
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

function generateMockCandles(days: number): CandleData[] {
  const candles: CandleData[] = [];
  let basePrice = 2500 + Math.random() * 1000;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (Math.random() - 0.48) * basePrice * 0.03;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;

    candles.push({
      time: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    basePrice = close;
  }
  return candles;
}
