"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Users, BookmarkPlus, BookmarkCheck, ExternalLink, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { PriceDisplay } from "@/components/stocks/PriceDisplay";
import { TradePanel } from "@/components/stocks/TradePanel";
import { stockApi } from "@/services/stock-api";
import { Footer } from "@/components/layout/Footer";

interface StockData {
  symbol: string;
  companyName: string;
  sector?: string;
  exchange?: string;
  quote: {
    currentPrice: number;
    change: number;
    changePercent: number;
    dayHigh?: number;
    dayLow?: number;
    open?: number;
    previousClose?: number;
    volume?: number;
    marketCap?: number;
    peRatio?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
  };
  profile?: {
    industry?: string;
    website?: string;
    description?: string;
    employeeCount?: number;
    ipoDate?: string;
  };
}

// Fallback mock data for when backend is unavailable
const MOCK_DATA: StockData = {
  symbol: "",
  companyName: "Loading...",
  sector: "Technology",
  exchange: "NSE",
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
    fiftyTwoWeekLow: 2200,
  },
  profile: {
    industry: "Conglomerates",
    website: "https://www.example.com",
    description: "A leading Indian company operating across multiple sectors including energy, petrochemicals, textiles, natural resources, retail, and telecommunications.",
    employeeCount: 389000,
  },
};

export default function StockDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = decodeURIComponent(params.symbol as string).toUpperCase();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    stockApi.getStockDetails(symbol)
      .then((res) => {
        if (!cancelled && res.data) {
          setStockData({
            symbol: res.data.symbol,
            companyName: res.data.companyName || symbol,
            sector: res.data.sector,
            exchange: res.data.exchange,
            quote: res.data.quote || MOCK_DATA.quote,
            profile: res.data.profile,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Use mock data as fallback
          setStockData({ ...MOCK_DATA, symbol, companyName: symbol });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [symbol]);

  const toggleWatchlist = () => {
    setInWatchlist(!inWatchlist);
    // In production: call watchlistStore.addStock(symbol) or deleteStock()
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-4 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-[460px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const { quote, profile } = stockData;
  const isUp = quote.change >= 0;

  const statsGrid = [
    { label: "Open", value: quote.open ? `₹${quote.open.toLocaleString("en-IN")}` : "N/A" },
    { label: "Prev Close", value: quote.previousClose ? `₹${quote.previousClose.toLocaleString("en-IN")}` : "N/A" },
    { label: "Day High", value: quote.dayHigh ? `₹${quote.dayHigh.toLocaleString("en-IN")}` : "N/A" },
    { label: "Day Low", value: quote.dayLow ? `₹${quote.dayLow.toLocaleString("en-IN")}` : "N/A" },
    { label: "Volume", value: quote.volume ? formatVolume(quote.volume) : "N/A" },
    { label: "Market Cap", value: quote.marketCap ? formatMarketCap(quote.marketCap) : "N/A" },
    { label: "P/E Ratio", value: quote.peRatio ? quote.peRatio.toFixed(2) : "N/A" },
    { label: "52W High", value: quote.fiftyTwoWeekHigh ? `₹${quote.fiftyTwoWeekHigh.toLocaleString("en-IN")}` : "N/A" },
    { label: "52W Low", value: quote.fiftyTwoWeekLow ? `₹${quote.fiftyTwoWeekLow.toLocaleString("en-IN")}` : "N/A" },
  ];

  return (
    <>
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/dashboard"
              className="text-[var(--color-text-secondary)] hover:text-white inline-flex items-center text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== Main Content (2 cols) ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Header: Name + Price + Watchlist button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{symbol}</h1>
                    {stockData.exchange && (
                      <Badge variant="outline">{stockData.exchange}</Badge>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {stockData.companyName}
                    {stockData.sector && ` · ${stockData.sector}`}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <PriceDisplay
                    price={quote.currentPrice}
                    change={quote.change}
                    changePercent={quote.changePercent}
                    size="lg"
                  />
                  <Button
                    onClick={toggleWatchlist}
                    variant={inWatchlist ? "default" : "outline"}
                    className={inWatchlist
                      ? "bg-[var(--color-bullish)] text-black hover:bg-[var(--color-bullish-hover)] border-none"
                      : "border-[var(--color-border)] hover:border-[var(--color-bullish)] hover:text-[var(--color-bullish)]"
                    }
                  >
                    {inWatchlist ? (
                      <><BookmarkCheck className="w-4 h-4 mr-2" /> In Watchlist</>
                    ) : (
                      <><BookmarkPlus className="w-4 h-4 mr-2" /> Add to Watchlist</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Candlestick Chart */}
              <Card className="bg-[var(--color-surface)] border-[var(--color-border)] overflow-hidden">
                <CardContent className="p-4">
                  <CandlestickChart symbol={symbol} />
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--color-bullish)]" />
                    Market Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {statsGrid.map((stat) => (
                      <div key={stat.label} className="p-3 rounded-lg bg-[var(--color-elevated)]/50">
                        <p className="text-xs text-[var(--color-text-disabled)] mb-1">{stat.label}</p>
                        <p className="text-sm font-semibold tabular-nums">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ===== Sidebar (1 col) ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {/* Order Execution Panel */}
              <TradePanel 
                symbol={symbol} 
                currentPrice={quote.currentPrice} 
              />

              {/* Day Range Visualizer */}
              <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4 text-[var(--color-text-secondary)]">TODAY&apos;S RANGE</h3>
                  {quote.dayLow && quote.dayHigh && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[var(--color-text-disabled)]">
                        <span>₹{quote.dayLow.toLocaleString("en-IN")}</span>
                        <span>₹{quote.dayHigh.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="relative h-2 bg-[var(--color-elevated)] rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-bearish)] via-[var(--color-warning)] to-[var(--color-bullish)]"
                          style={{ width: "100%" }}
                        />
                        {/* Current price marker */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[var(--color-background)] shadow-lg"
                          style={{
                            left: `${Math.min(100, Math.max(0, ((quote.currentPrice - quote.dayLow) / (quote.dayHigh - quote.dayLow)) * 100))}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h3 className="font-bold text-sm mb-3 text-[var(--color-text-secondary)]">52 WEEK RANGE</h3>
                    {quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-[var(--color-text-disabled)]">
                          <span>₹{quote.fiftyTwoWeekLow.toLocaleString("en-IN")}</span>
                          <span>₹{quote.fiftyTwoWeekHigh.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="relative h-2 bg-[var(--color-elevated)] rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-bearish)] to-[var(--color-bullish)]"
                            style={{
                              width: `${((quote.currentPrice - quote.fiftyTwoWeekLow) / (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About Company */}
              {profile && (
                <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[var(--color-accent)]" />
                      About
                    </h3>

                    {profile.description && (
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-6">
                        {profile.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      {profile.industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[var(--color-text-disabled)]">Industry:</span>
                          <span className="font-medium">{profile.industry}</span>
                        </div>
                      )}
                      {profile.employeeCount && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-[var(--color-text-disabled)]" />
                          <span>{profile.employeeCount.toLocaleString()} Employees</span>
                        </div>
                      )}
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-bullish)] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function formatVolume(vol: number): string {
  if (vol >= 10000000) return `${(vol / 10000000).toFixed(2)} Cr`;
  if (vol >= 100000) return `${(vol / 100000).toFixed(2)} L`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
  return vol.toString();
}

function formatMarketCap(cap: number): string {
  if (cap >= 10000000000000) return `₹${(cap / 10000000000000).toFixed(2)} L Cr`;
  if (cap >= 100000000000) return `₹${(cap / 100000000000).toFixed(2)}K Cr`;
  if (cap >= 10000000) return `₹${(cap / 10000000).toFixed(2)} Cr`;
  return `₹${cap.toLocaleString("en-IN")}`;
}
