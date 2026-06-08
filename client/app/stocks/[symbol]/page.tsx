"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton className="h-4 w-36 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-[520px] w-full rounded-lg" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Back button */}
          <div className="mb-5">
            <Link
              href="/dashboard"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] inline-flex items-center text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ===== Main Content (2 cols) ===== */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Header: Name + Price + Watchlist button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{symbol}</h1>
                    {stockData.exchange && (
                      <Badge variant="outline">{stockData.exchange}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5">
                    {stockData.companyName}
                    {stockData.sector && <span className="text-[var(--color-text-disabled)]">· {stockData.sector}</span>}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <PriceDisplay
                    price={quote.currentPrice}
                    change={quote.change}
                    changePercent={quote.changePercent}
                    size="lg"
                  />
                  <Button
                    onClick={toggleWatchlist}
                    variant={inWatchlist ? "success" : "outline"}
                    size="sm"
                    className={inWatchlist
                      ? ""
                      : "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    }
                  >
                    {inWatchlist ? (
                      <><BookmarkCheck className="w-4 h-4 mr-1.5" /> In Watchlist</>
                    ) : (
                      <><BookmarkPlus className="w-4 h-4 mr-1.5" /> Add to Watchlist</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Candlestick Chart */}
              <Card>
                <CardContent className="p-4">
                  <CandlestickChart symbol={symbol} />
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-4 text-[var(--color-text-primary)]">
                    Market Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                    {statsGrid.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)]/50">
                        <span className="text-xs text-[var(--color-text-disabled)]">{stat.label}</span>
                        <span className="text-sm font-medium tabular-nums text-[var(--color-text-primary)]">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ===== Sidebar (1 col) ===== */}
            <div className="flex flex-col gap-5">
              {/* Order Execution Panel */}
              <TradePanel 
                symbol={symbol} 
                currentPrice={quote.currentPrice} 
              />

              {/* Day Range Visualizer */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-xs mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">Today&apos;s Range</h3>
                  {quote.dayLow && quote.dayHigh && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-[var(--color-text-disabled)] tabular-nums">
                        <span>₹{quote.dayLow.toLocaleString("en-IN")}</span>
                        <span>₹{quote.dayHigh.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="relative h-1.5 bg-[var(--color-elevated)] rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-bearish)] via-[var(--color-warning)] to-[var(--color-bullish)]"
                          style={{ width: "100%" }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-[var(--color-background)]"
                          style={{
                            left: `${Math.min(100, Math.max(0, ((quote.currentPrice - quote.dayLow) / (quote.dayHigh - quote.dayLow)) * 100))}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h3 className="font-semibold text-xs mb-3 text-[var(--color-text-secondary)] uppercase tracking-wider">52 Week Range</h3>
                    {quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-[var(--color-text-disabled)] tabular-nums">
                          <span>₹{quote.fiftyTwoWeekLow.toLocaleString("en-IN")}</span>
                          <span>₹{quote.fiftyTwoWeekHigh.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="relative h-1.5 bg-[var(--color-elevated)] rounded-full overflow-hidden">
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
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-3 text-[var(--color-text-primary)]">
                      About
                    </h3>

                    {profile.description && (
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-5">
                        {profile.description}
                      </p>
                    )}

                    <div className="space-y-2.5">
                      {profile.industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[var(--color-text-disabled)]">Industry:</span>
                          <span className="font-medium text-[var(--color-text-primary)]">{profile.industry}</span>
                        </div>
                      )}
                      {profile.employeeCount && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-3.5 h-3.5 text-[var(--color-text-disabled)]" />
                          <span className="text-[var(--color-text-primary)]">{profile.employeeCount.toLocaleString()} Employees</span>
                        </div>
                      )}
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
