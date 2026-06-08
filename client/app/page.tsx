"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, ArrowRight, BarChart3, Bookmark, Zap, Shield, Globe, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
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
  { icon: Zap, title: "Live Prices", description: "Real-time stock updates via WebSocket connections with sub-second latency" },
  { icon: Bookmark, title: "Smart Watchlist", description: "Build & manage personal watchlists with instant price tracking" },
  { icon: BarChart3, title: "Advanced Charts", description: "Interactive candlestick charts with volume indicators & timeframes" },
  { icon: TrendingUp, title: "Market Movers", description: "Track daily top gainers, losers, and trending stocks at a glance" },
  { icon: Globe, title: "Indian Markets", description: "NSE & BSE stocks including NIFTY 50 and SENSEX index tracking" },
  { icon: Shield, title: "Secure Auth", description: "Enterprise-grade JWT authentication with encrypted password storage" },
];

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ===== HERO SECTION ===== */}
        <section className="relative flex flex-col items-center pt-20 pb-24 px-4 sm:px-6 lg:px-8">
          {/* Animated background orbs */}
          <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--color-bullish)] opacity-[0.06] blur-[120px] pointer-events-none animate-glow" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[120px] pointer-events-none animate-glow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[var(--color-bearish)] opacity-[0.04] blur-[100px] pointer-events-none" />

          <motion.div
            className="max-w-4xl w-full text-center z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status badge */}
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-sm text-[var(--color-text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-bullish)] animate-pulse" />
              Live Indian Market Data Powered by Yahoo Finance
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            >
              <span className="text-gradient">Track the Market</span>
              <br className="hidden md:block" />
              <span className="text-gradient-bullish">in Real-Time</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Experience premium stock tracking with deep analytics, live websockets, interactive candlestick charts, and lightning-fast insights — all for free.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-6">
              <SearchBar variant="hero" placeholder="Search any stock (e.g., RELIANCE, TCS, INFY)..." />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-16">
              <Link href="/auth/register">
                <Button className="h-11 px-6 bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none font-semibold text-sm rounded-lg transition-all hover:scale-105">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-11 px-6 text-sm rounded-lg border-[var(--color-border)] hover:border-[var(--color-border-hover)]">
                  Explore Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== MARKET INDICES ===== */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="text-[var(--color-bullish)] w-6 h-6" />
                Market Overview
              </h2>
              <MarketIndices />
            </motion.div>
          </div>
        </section>

        {/* ===== TRENDING STOCKS ===== */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-[var(--color-bullish)] w-6 h-6" />
                  Trending Now
                </h2>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-[var(--color-text-secondary)] hover:text-white text-sm">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </motion.div>
          </div>
        </section>

        {/* ===== FEATURES SHOWCASE ===== */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">
                  Everything You Need to <span className="text-gradient-bullish">Track Stocks</span>
                </h2>
                <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
                  Built with modern technology for speed, reliability, and beautiful visualizations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {FEATURES.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-bullish-muted)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-[var(--color-bullish)]" />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-elevated)] p-10 text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-bullish)]/5 to-[var(--color-accent)]/5 pointer-events-none" />
              <h2 className="text-3xl font-bold mb-3 relative z-10">
                Ready to Start Tracking?
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto relative z-10">
                Join thousands of investors who track their stocks with StockVista. 100% free, no credit card required.
              </p>
              <Link href="/auth/register">
                <Button className="h-11 px-8 bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none font-semibold text-sm rounded-lg transition-all hover:scale-105 relative z-10">
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
