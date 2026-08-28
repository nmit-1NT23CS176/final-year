"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CandlestickSeries, HistogramSeries, CrosshairMode, Time, CandlestickData, HistogramData } from "lightweight-charts";

interface CandleData {
  time: Time;
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
        textColor: "#64748b", // slate-500
        attributionLogo: false,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(241, 245, 249, 0.8)" }, // slate-100
        horzLines: { color: "rgba(241, 245, 249, 0.8)" }, // slate-100
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { 
          color: "rgba(100, 116, 139, 0.4)", 
          width: 1, 
          style: 3, // Dashed
          labelBackgroundColor: "#1e293b" 
        },
        horzLine: { 
          color: "rgba(100, 116, 139, 0.4)", 
          width: 1, 
          style: 3, // Dashed
          labelBackgroundColor: "#1e293b" 
        },
      },
      rightPriceScale: {
        borderColor: "rgba(226, 232, 240, 1)", // slate-200
        scaleMargins: { top: 0.1, bottom: 0.25 },
        borderVisible: false,
      },
      timeScale: {
        borderColor: "rgba(226, 232, 240, 1)", // slate-200
        timeVisible: selectedTf.days <= 7,
        secondsVisible: false,
        borderVisible: false,
        tickMarkFormatter: (time: number) => {
          const d = new Date(time * 1000);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
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
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    // Filter data based on selected timeframe if data is provided
    let candleData = data ? [...data] : generateMockCandles(selectedTf.days);
    if (data) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - selectedTf.days);
      const cutoffTimeStr = cutoffDate.toISOString().split("T")[0];
      candleData = candleData.filter((d: any) => d.time >= cutoffTimeStr);
    }

    candleSeries.setData(candleData as unknown as CandlestickData[]);

    const volumeData = candleData.map((d: any) => ({
      time: d.time,
      value: d.volume !== undefined ? d.volume : Math.floor(Math.random() * 10000000) + 1000000,
      color: d.close >= d.open ? "rgba(0, 208, 156, 0.4)" : "rgba(255, 82, 82, 0.4)",
    }));
    volumeSeries.setData(volumeData as unknown as HistogramData[]);

    // We can delay fitContent slightly to ensure rendering, but usually immediate is fine
    setTimeout(() => {
      chart.timeScale().fitContent();
    }, 10);
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
      <div className="flex items-center gap-1.5 mb-4 px-1 border-b border-[var(--color-border)] pb-3">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.label}
            onClick={() => setActiveTimeframe(tf.label)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              activeTimeframe === tf.label
                ? "bg-[var(--color-accent)] text-white shadow-md"
                : "text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div className="w-full rounded-xl overflow-hidden bg-white">
        <div ref={containerRef} className="w-full" />
      </div>
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
