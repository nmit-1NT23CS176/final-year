"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { WatchlistPanel } from "@/components/dashboard/WatchlistPanel";
import { GainersLosers } from "@/components/dashboard/GainersLosers";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { useAuthStore } from "@/store/auth-store";
import { Footer } from "@/components/layout/Footer";

const MOCK_WATCHLIST = [
  { id: "1", symbol: "RELIANCE.NS", companyName: "Reliance Industries", price: 2984.50, change: 36.70, changePercent: 1.24 },
  { id: "2", symbol: "TCS.NS", companyName: "Tata Consultancy Services", price: 4120.00, change: 34.50, changePercent: 0.85 },
  { id: "3", symbol: "HDFCBANK.NS", companyName: "HDFC Bank Limited", price: 1632.10, change: -7.40, changePercent: -0.45 },
  { id: "4", symbol: "INFY.NS", companyName: "Infosys Limited", price: 1645.20, change: 12.10, changePercent: 0.74 },
];

const MOCK_PORTFOLIO = {
  totalValue: 542380.50,
  dayChange: 4250.20,
  dayChangePercent: 0.79,
  totalReturn: 68420.00,
  totalReturnPercent: 14.43,
  buyingPower: 125000.00
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleAddStock = (symbol: string) => {
    console.log("Add stock:", symbol);
  };

  const handleRemoveStock = (id: string) => {
    console.log("Remove stock:", id);
  };

  return (
    <>
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Overview
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                Welcome back. Here&apos;s your portfolio at a glance.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bullish)] animate-pulse" />
              Market Open
            </div>
          </div>

          {/* Portfolio Summary */}
          <section className="mb-6">
            <PortfolioSummary {...MOCK_PORTFOLIO} />
          </section>

          {/* Market Indices */}
          <section className="mb-6">
            <MarketIndices />
          </section>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Watchlist — takes 2 cols */}
            <section className="lg:col-span-2">
              <WatchlistPanel
                stocks={MOCK_WATCHLIST}
                onAddStock={handleAddStock}
                onRemoveStock={handleRemoveStock}
              />
            </section>

            {/* Right column */}
            <section className="flex flex-col gap-6">
              <GainersLosers />
              <NewsSection />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
