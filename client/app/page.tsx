"use client";

import { Search, TrendingUp, ArrowRight, BarChart3, Bookmark, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockCard } from "@/components/stocks/StockCard";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/stocks/SearchBar";
import Link from "next/link";

const TRENDING_STOCKS = [
  { symbol: "RELIANCE.NS", companyName: "Reliance Industries", price: 2984.50, change: 36.70, changePercent: 1.24 },
  { symbol: "TCS.NS", companyName: "Tata Consultancy", price: 4120.00, change: 34.50, changePercent: 0.85 },
  { symbol: "HDFCBANK.NS", companyName: "HDFC Bank", price: 1632.10, change: -7.40, changePercent: -0.45 },
  { symbol: "INFY.NS", companyName: "Infosys Limited", price: 1645.20, change: 12.10, changePercent: 0.74 },
  { symbol: "ICICIBANK.NS", companyName: "ICICI Bank", price: 1245.80, change: 18.30, changePercent: 1.49 },
  { symbol: "ITC.NS", companyName: "ITC Limited", price: 456.75, change: -2.30, changePercent: -0.50 },
];

const FEATURES = [
  { icon: Zap, title: "Live Prices", description: "Real-time stock updates via WebSocket with sub-second latency" },
  { icon: Bookmark, title: "Smart Watchlist", description: "Build and manage personal watchlists with instant price tracking" },
  { icon: BarChart3, title: "Advanced Charts", description: "Interactive candlestick charts with volume indicators and timeframes" },
];

export default function Home() {
  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* ===== HERO SECTION ===== */}
        <section className="flex flex-col items-center pt-16 pb-14 px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Status badge */}
            <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bullish)] animate-pulse" />
              Live Indian Market Data
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[var(--color-text-primary)]">
              Track the Market in Real-Time
            </h1>

            {/* Subtitle */}
            <p className="text-base text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
              Professional stock tracking with live prices, interactive charts, and portfolio analytics — completely free.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-5">
              <SearchBar variant="hero" placeholder="Search any stock (e.g., RELIANCE, TCS, INFY)..." />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Link href="/auth/register">
                <Button variant="primary" className="h-10 px-5 text-sm">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-10 px-5 text-sm">
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== MARKET INDICES ===== */}
        <section className="px-4 pb-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
              <Activity className="text-[var(--color-bullish)] w-5 h-5" />
              Market Overview
            </h2>
            <MarketIndices />
          </div>
        </section>

        {/* ===== TRENDING STOCKS ===== */}
        <section className="px-4 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-text-primary)]">
                <TrendingUp className="text-[var(--color-bullish)] w-5 h-5" />
                Trending Now
              </h2>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] text-xs">
                  View All <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TRENDING_STOCKS.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  companyName={stock.companyName}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="px-4 pb-14">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-elevated)] transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className="px-4 pb-14">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <h2 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">
                Ready to Start Tracking?
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-md mx-auto">
                Join thousands of investors who track their stocks with StockVista. Free forever, no credit card required.
              </p>
              <Link href="/auth/register">
                <Button variant="primary" className="h-10 px-6 text-sm">
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
