"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LayoutDashboard, TrendingUp, Flame } from "lucide-react";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { WatchlistPanel } from "@/components/dashboard/WatchlistPanel";
import { GainersLosers } from "@/components/dashboard/GainersLosers";
import { StockCard } from "@/components/stocks/StockCard";
import { useAuthStore } from "@/store/auth-store";
import { Footer } from "@/components/layout/Footer";

const MOCK_WATCHLIST = [
  { id: "1", symbol: "RELIANCE.NS", companyName: "Reliance Industries", price: 2984.50, change: 36.70, changePercent: 1.24 },
  { id: "2", symbol: "TCS.NS", companyName: "Tata Consultancy Services", price: 4120.00, change: 34.50, changePercent: 0.85 },
  { id: "3", symbol: "HDFCBANK.NS", companyName: "HDFC Bank Limited", price: 1632.10, change: -7.40, changePercent: -0.45 },
  { id: "4", symbol: "INFY.NS", companyName: "Infosys Limited", price: 1645.20, change: 12.10, changePercent: 0.74 },
];

const TRENDING_STOCKS = [
  { symbol: "TCS.NS", companyName: "Tata Consultancy", price: 4120.00, change: 34.50, changePercent: 0.85 },
  { symbol: "INFY.NS", companyName: "Infosys Limited", price: 1645.20, change: 12.10, changePercent: 0.74 },
  { symbol: "RELIANCE.NS", companyName: "Reliance Industries", price: 2984.50, change: 36.70, changePercent: 1.24 },
  { symbol: "HDFCBANK.NS", companyName: "HDFC Bank", price: 1632.10, change: -7.40, changePercent: -0.45 },
  { symbol: "ITC.NS", companyName: "ITC Limited", price: 456.75, change: -2.30, changePercent: -0.50 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { NewsSection } from "@/components/dashboard/NewsSection";

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
      <div className="flex-1 bg-[var(--color-background)]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                Overview
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1 font-medium">
                Welcome back. Here's your portfolio at a glance.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-bullish)] animate-pulse" />
              Market Open
            </div>
          </motion.div>

          {/* Portfolio Hero */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <PortfolioSummary {...MOCK_PORTFOLIO} />
          </motion.section>

          {/* Market Indices */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <MarketIndices />
          </motion.section>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Watchlist — takes 2 cols */}
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <WatchlistPanel
                stocks={MOCK_WATCHLIST}
                onAddStock={handleAddStock}
                onRemoveStock={handleRemoveStock}
              />
            </motion.section>

            {/* Right column: Gainers/Losers & News placeholder */}
            <motion.section
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-8"
            >
              <GainersLosers />
              <NewsSection />
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
