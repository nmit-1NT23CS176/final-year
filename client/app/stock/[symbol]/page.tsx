"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createChart, ColorType } from "lightweight-charts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Globe, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function StockDetailsPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase();
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from backend: /api/stocks/:symbol
    const fetchStock = async () => {
      try {
        setLoading(true);
        // Fallback mock data for visualization if backend is not reachable
        setTimeout(() => {
          setStockData({
            quote: {
              currentPrice: 3000,
              change: 25.5,
              changePercent: 0.85,
              dayHigh: 3050,
              dayLow: 2980,
              open: 2990,
              previousClose: 2974.5,
              volume: 12500000,
              marketCap: 20000000000000,
              peRatio: 28.5,
              fiftyTwoWeekHigh: 3200,
              fiftyTwoWeekLow: 2200
            },
            profile: {
              industry: "Conglomerates",
              website: "https://www.relianceindustries.com",
              description: "Reliance Industries Limited engages in hydrocarbon exploration and production, oil refining, telecommunications, and retail businesses worldwide.",
              employeeCount: 389000
            }
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchStock();
  }, [symbol]);

  useEffect(() => {
    if (!chartContainerRef.current || loading) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa', // var(--color-text-secondary)
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.5)' }, // var(--color-border)
        horzLines: { color: 'rgba(39, 39, 42, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      }
    });

    const isUp = stockData?.quote?.change >= 0;
    const color = isUp ? '#00d09c' : '#ff6b6b';

    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}80`, // 50% opacity
      bottomColor: `${color}00`, // 0% opacity
      lineWidth: 2,
    });

    // Generate some fake historical data for the chart to look nice
    const data = [];
    let currentPrice = stockData?.quote?.previousClose || 2900;
    const now = new Date();
    for (let i = 60; i >= 0; i--) {
      currentPrice += (Math.random() - 0.45) * 10; // slight upward bias
      data.push({
        time: (now.getTime() - i * 24 * 60 * 60 * 1000) / 1000,
        value: currentPrice
      });
    }
    
    // Add today's actual price
    data.push({ time: now.getTime() / 1000, value: stockData?.quote?.currentPrice || currentPrice });

    areaSeries.setData(data as any);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [loading, stockData]);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--color-bullish)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const isUp = stockData?.quote?.change >= 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-[var(--color-text-secondary)] hover:text-white inline-flex items-center text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{symbol}</h1>
              <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
                <Globe className="w-4 h-4" /> {stockData?.profile?.industry || 'Stock Market'}
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <span className="text-4xl font-semibold tracking-tight">₹{stockData?.quote?.currentPrice.toLocaleString()}</span>
              <span className={`text-lg font-medium mt-1 ${isUp ? 'text-[var(--color-bullish)]' : 'text-[var(--color-bearish)]'}`}>
                {isUp ? '+' : ''}{stockData?.quote?.change.toFixed(2)} ({stockData?.quote?.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border)] p-1 overflow-hidden">
            <div ref={chartContainerRef} className="w-full h-[400px]" />
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                <TrendingUp className="w-5 h-5 text-[var(--color-bullish)]" /> Market Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Open</span>
                  <span className="font-medium">₹{stockData?.quote?.open?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Prev Close</span>
                  <span className="font-medium">₹{stockData?.quote?.previousClose?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Day Range</span>
                  <span className="font-medium">₹{stockData?.quote?.dayLow?.toLocaleString()} - ₹{stockData?.quote?.dayHigh?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">52W Range</span>
                  <span className="font-medium">₹{stockData?.quote?.fiftyTwoWeekLow?.toLocaleString()} - ₹{stockData?.quote?.fiftyTwoWeekHigh?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Volume</span>
                  <span className="font-medium">{(stockData?.quote?.volume / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">P/E Ratio</span>
                  <span className="font-medium">{stockData?.quote?.peRatio?.toFixed(2) || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 border-b border-[var(--color-border)] pb-2">About Company</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-6">
                {stockData?.profile?.description || 'No description available for this company.'}
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Users className="w-4 h-4" /> {stockData?.profile?.employeeCount?.toLocaleString() || 'N/A'} Employees
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
