"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { WatchlistPanel } from "@/components/dashboard/WatchlistPanel";
import { GainersLosers } from "@/components/dashboard/GainersLosers";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { MLPredictionCard } from "@/components/ml-prediction-card";
import { mlApi, NextDayTrendData, ModelMetricsData } from "@/services/ml-api";
import { useAuthStore } from "@/store/auth-store";
import { Footer } from "@/components/layout/Footer";
import { BrainCircuit, BarChart3, Activity, ShieldCheck, TrendingUp, Search, Layers } from "lucide-react";

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
  const [tickers, setTickers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("RELIANCE");
  const [featuredPrediction, setFeaturedPrediction] = useState<NextDayTrendData | null>(null);
  const [metrics, setMetrics] = useState<ModelMetricsData[]>([]);
  const [loadingSymbol, setLoadingSymbol] = useState(false);

  // Fetch all 97 available tickers on mount
  useEffect(() => {
    async function loadTickers() {
      try {
        const res = await mlApi.getTickers();
        if (res.success && res.data && res.data.length > 0) {
          setTickers(res.data);
        } else {
          setTickers(['ABB', 'ADANIENSOL', 'ADANIENT', 'ADANIGREEN', 'ADANIPORTS', 'ADANIPOWER', 'AMBUJACEM', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK', 'BAJAJ-AUTO', 'BAJAJFINSV', 'BAJAJHLDNG', 'BAJFINANCE', 'BANKBARODA', 'BEL', 'BHARTIARTL', 'BOSCHLTD', 'BPCL', 'BRITANNIA', 'CIPLA', 'COALINDIA', 'COLPAL', 'DLF', 'DRREDDY', 'EICHERMOT', 'GAIL', 'GRASIM', 'HCLTECH', 'HDFCBANK', 'HDFCLIFE', 'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR', 'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'INDIANB', 'IOC', 'IRCTC', 'ITC', 'JINDALSTEL', 'JSWSTEEL', 'KOTAKBANK', 'LT', 'LTIM', 'LTI', 'MARUTI', 'NESTLEIND', 'NTPC', 'ONGC', 'PIDILITIND', 'POWERGRID', 'RELIANCE', 'SBILIFE', 'SBIN', 'SHRIRAMFIN', 'SIEMENS', 'SUNPHARMA', 'TATACONSUM', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM', 'TITAN', 'TORNTPHARM', 'TRENT', 'ULTRACEMCO', 'UNITDSPR', 'VBL', 'WIPRO', 'ZOMATO']);
        }
      } catch (err) {
        console.error("Error loading tickers:", err);
      }
    }
    loadTickers();
  }, []);

  // Fetch prediction whenever selectedSymbol changes
  useEffect(() => {
    async function fetchMLData() {
      setLoadingSymbol(true);
      try {
        const forecastRes = await mlApi.getForecast(selectedSymbol);
        if (forecastRes.success) {
          setFeaturedPrediction(forecastRes.data);
        }
        const metricsRes = await mlApi.getMetrics();
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
        }
      } catch (err) {
        console.error("Error loading ML data for dashboard:", err);
      } finally {
        setLoadingSymbol(false);
      }
    }
    fetchMLData();
  }, [selectedSymbol]);

  const filteredTickers = tickers.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStock = (symbol: string) => {
    console.log("Add stock:", symbol);
  };

  const handleRemoveStock = (id: string) => {
    console.log("Remove stock:", id);
  };

  return (
    <>
      <div className="flex-1 bg-[var(--color-background)] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                  My Dashboard
                </h1>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]">
                  ALL 97 NSE STOCKS
                </span>
              </div>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 font-medium">
                Complete NSE Coverage · Research-Grade Signals · Premium Intelligence
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white shadow-sm text-[12px] font-bold text-[var(--color-text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-bullish)] animate-pulse" />
              NSE OPEN · LATENCY 12ms
            </div>
          </div>

          {/* ===== ALL STOCKS LIVE INTELLIGENCE SCREENER ===== */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-[var(--color-accent)]" />
                <div>
                  <h2 className="text-[16px] font-extrabold text-[var(--color-text-primary)]">
                    Intelligence Directory ({filteredTickers.length} Equities)
                  </h2>
                  <p className="text-[13px] text-[var(--color-text-secondary)] font-medium">
                    Select any stock below to inspect complete AI Market Outlook
                  </p>
                </div>
              </div>

              {/* Ticker Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
                <input
                  type="text"
                  placeholder="Search stock ticker (e.g. RELIANCE)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
              </div>
            </div>

            {/* Interactive Grid of All Stock Pills */}
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar border-b border-[var(--color-border)] pb-5">
              {filteredTickers.map((tkr) => {
                const isSelected = selectedSymbol.toUpperCase() === tkr.toUpperCase();
                return (
                  <button
                    key={tkr}
                    onClick={() => setSelectedSymbol(tkr)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[var(--color-accent)] text-white shadow-md scale-105"
                        : "bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-gray-400 hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {tkr}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Info Banner */}
            <div className="flex items-center justify-between text-[13px] font-bold text-[var(--color-text-secondary)]">
              <span>Inspecting: <strong className="text-[var(--color-accent)] text-[15px] ml-1">{selectedSymbol}</strong></span>
              <span>Total Available: {tickers.length}</span>
            </div>
          </section>

          {/* ===== FEATURED STOCK DEEP INTELLIGENCE & AUDIT PANEL ===== */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-6 h-6 text-[var(--color-accent)]" />
                <h2 className="text-[18px] font-extrabold text-[var(--color-text-primary)]">
                  AI Market Outlook: <span className="text-[var(--color-accent)]">{selectedSymbol}</span>
                </h2>
              </div>
              {loadingSymbol && <span className="text-[13px] font-bold text-[var(--color-text-disabled)] animate-pulse">Fetching AI prediction...</span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Deep ML Card */}
              {featuredPrediction && (
                <div className="lg:col-span-2">
                  <MLPredictionCard prediction={featuredPrediction} />
                </div>
              )}

              {/* Right Col: Benchmark Model Performance & Reliability Engine */}
              <div className={`rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5 ${featuredPrediction ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="text-[12px] font-extrabold text-[var(--color-text-secondary)] flex items-center gap-2 uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" /> Model Reliability
                  </span>
                  <span className="text-[11px] font-bold text-[var(--color-text-disabled)]">2026 Test Set</span>
                </div>

                {/* Reliability Summary Box */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] space-y-3">
                  <span className="text-[11px] font-extrabold uppercase text-[var(--color-text-secondary)] tracking-wider block">StockVista Benchmarks</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[var(--color-text-disabled)] font-semibold block text-[10px] uppercase">OOS Accuracy</span>
                      <span className="text-[var(--color-bullish)] font-black text-[16px]">52.4%</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-disabled)] font-semibold block text-[10px] uppercase">ROC-AUC</span>
                      <span className="text-[var(--color-text-primary)] font-black text-[16px]">0.548</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-disabled)] font-semibold block text-[10px] uppercase">30D Accuracy</span>
                      <span className="text-[var(--color-text-primary)] font-black text-[16px]">56.7%</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-disabled)] font-semibold block text-[10px] uppercase">90D Accuracy</span>
                      <span className="text-[var(--color-text-primary)] font-black text-[16px]">54.1%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[12px] font-extrabold text-[var(--color-text-secondary)] block uppercase tracking-wider">Model Family Engine</span>
                  {metrics.map((m) => (
                    <div key={m.model_name} className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-extrabold text-[var(--color-text-primary)] flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[var(--color-accent)]" /> {m.model_name}
                        </span>
                        <span className="text-[13px] font-black text-[var(--color-bullish)]">{(m.accuracy * 100).toFixed(1)}% Acc</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border)]">
                        <div>Prec: {(m.precision * 100).toFixed(0)}%</div>
                        <div>Rec: {(m.recall * 100).toFixed(0)}%</div>
                        <div className="text-right">AUC: {(m.roc_auc * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Institutional Proof Callout */}
                <div className="p-4 rounded-xl border border-[var(--color-bullish-muted)] bg-[var(--color-bullish-muted)]/30 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--color-bullish)] text-[13px]">
                    <ShieldCheck className="w-4 h-4" /> Academic Validation
                  </div>
                  <p className="text-[11px] font-medium text-[var(--color-text-secondary)] leading-relaxed">
                    Evaluated on N=11,803 test observations. Rolling 18M XGBoost yields statistical significance over random guess (95% CI: [51.5%, 53.3%]).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio & Watchlist Sections */}
          <section className="mb-6">
            <PortfolioSummary {...MOCK_PORTFOLIO} />
          </section>

          <section className="mb-6">
            <MarketIndices />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <WatchlistPanel
                stocks={MOCK_WATCHLIST}
                onAddStock={handleAddStock}
                onRemoveStock={handleRemoveStock}
              />
            </section>
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
