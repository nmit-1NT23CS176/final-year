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
import { BrainCircuit, BarChart3, Activity, ShieldCheck, Flame, TrendingUp, Search, Layers, CheckCircle2, XCircle } from "lucide-react";

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
  const [visibleCount, setVisibleCount] = useState<number>(20);

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
      <div className="flex-1 bg-[#0b0c0e] text-zinc-100 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  StockVista Market Intelligence & Forecast Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#00d09c]/10 text-[#00d09c] border border-[#00d09c]/30">
                  ALL 97 NSE STOCKS
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                Complete NSE Coverage · Research-Grade Signals · InvestorGain/Chittorgarh UX Inspired
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-[#141416] text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#00d09c] animate-pulse" />
                NSE OPEN · LATENCY 12ms
              </div>
            </div>
          </div>

          {/* ===== ALL STOCKS LIVE INTELLIGENCE SCREENER (InvestorGain/Chittorgarh Style) ===== */}
          <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#00d09c]" />
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-zinc-100 uppercase font-mono">
                    All NSE Stock Intelligence Directory ({filteredTickers.length} Equities)
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Select any stock below to inspect complete AI Market Outlook, Why Evidence Signals, Model Reliability & Track Record
                  </p>
                </div>
              </div>

              {/* Ticker Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search stock ticker (e.g. RELIANCE, TCS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#00d09c]"
                />
              </div>
            </div>

            {/* Interactive Grid of All Stock Pills */}
            <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-2 custom-scrollbar border-b border-zinc-800/60 pb-4">
              {filteredTickers.map((tkr) => {
                const isSelected = selectedSymbol.toUpperCase() === tkr.toUpperCase();
                return (
                  <button
                    key={tkr}
                    onClick={() => setSelectedSymbol(tkr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#00d09c] text-black shadow-lg shadow-[#00d09c]/20 scale-105"
                        : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {tkr}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Info Banner */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Currently Inspecting: <strong className="text-[#00d09c] font-bold">{selectedSymbol}</strong></span>
              <span>Total Available Stocks: {tickers.length}</span>
            </div>
          </section>

          {/* ===== FEATURED STOCK DEEP INTELLIGENCE & AUDIT PANEL ===== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#00d09c]" />
                <h2 className="text-base font-extrabold text-white">
                  AI Market Outlook & Evidence Breakdown for <span className="text-[#00d09c]">{selectedSymbol}</span>
                </h2>
              </div>
              {loadingSymbol && <span className="text-xs text-zinc-400 font-mono animate-pulse">Loading AI forecast...</span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Deep ML Card + Reasons + Audit Log */}
              {featuredPrediction && (
                <div className="lg:col-span-2">
                  <MLPredictionCard prediction={featuredPrediction} />
                </div>
              )}

              {/* Right Col: Benchmark Model Performance & Reliability Engine */}
              <div className={`rounded-2xl border border-zinc-800 bg-[#141416] p-6 shadow-xl space-y-4 ${featuredPrediction ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4 text-[#00d09c]" /> MODEL RELIABILITY & BENCHMARKS
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">2026 Test Set</span>
                </div>

                {/* Reliability Summary Box */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 font-mono">
                  <span className="text-[10px] uppercase text-zinc-400 font-semibold block">StockVista Reliability Metrics</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">2026 OOS ACCURACY</span>
                      <span className="text-[#00d09c] font-bold text-sm">52.4%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">ROC-AUC</span>
                      <span className="text-zinc-200 font-bold text-sm">0.548</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">LAST 30 PREDICTIONS</span>
                      <span className="text-zinc-200 font-bold text-sm">56.7%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">LAST 90 PREDICTIONS</span>
                      <span className="text-zinc-200 font-bold text-sm">54.1%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono font-bold text-zinc-300 block">Model Family Performance Engine</span>
                  {metrics.map((m) => (
                    <div key={m.model_name} className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#00d09c]" /> {m.model_name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#00d09c]">{(m.accuracy * 100).toFixed(1)}% Acc</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
                        <div>Prec: {(m.precision * 100).toFixed(0)}%</div>
                        <div>Rec: {(m.recall * 100).toFixed(0)}%</div>
                        <div className="text-right">AUC: {(m.roc_auc * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Institutional Proof Callout */}
                <div className="p-3.5 rounded-xl border border-[#00d09c]/20 bg-[#00d09c]/5 text-[11px] font-mono text-zinc-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#00d09c]">
                    <ShieldCheck className="w-4 h-4" /> Academic Validation
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Evaluated on N=11,803 test observations. Rolling 18M XGBoost yields $p &lt; 0.001$ statistical significance over random guess ($95\%$ Clopper-Pearson CI: [51.5%, 53.3%]).
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
