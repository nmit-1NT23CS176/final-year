"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, AreaSeries, Time } from "lightweight-charts";

interface SparklineChartProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function SparklineChart({
  data,
  color = "#00d09c",
  width = 120,
  height = 40,
  className,
}: SparklineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Generate mock sparkline data if none provided
  const chartData = data || generateMockSparkline();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { mode: 0 },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}30`,
      bottomColor: `${color}00`,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    const now = Math.floor(Date.now() / 1000);
    const seriesData = chartData.map((value, i) => ({
      time: (now - (chartData.length - i) * 3600) as Time,
      value,
    }));

    series.setData(seriesData);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData, color, width, height]);

  return <div ref={containerRef} className={className} />;
}

function generateMockSparkline(points: number = 24): number[] {
  const data: number[] = [];
  let value = 100 + Math.random() * 50;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * 3;
    data.push(value);
  }
  return data;
}
