"use client";

import { use } from "react";
import Link from "next/link";
import { useForecast } from "@/hooks/useSignals";
import { useStockPrice } from "@/hooks/useStockPrice";
import { getSector, getCap, fmtProb, directionIcon } from "@/lib/api";
import { SkeletonStatCard, ErrorBanner } from "@/components/shared/FeedbackUI";
import { Activity, ChevronRight, TrendingUp, TrendingDown, Info, Briefcase, BarChart2 } from "lucide-react";

// ── Shared UI Helpers ────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <h2 className="text-[17px] font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
      <span className="text-[var(--color-accent)]">{icon}</span>
      {title}
    </h2>
  );
}

// ── Main Page Component ──────────────────────────────────
export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const sym = symbol.toUpperCase();
  
  // Real data hooks
  const { data: forecastData, loading: forecastLoading, error: forecastError } = useForecast(sym);
  const { price, change, changePercent, isLoading: priceLoading } = useStockPrice(sym);

  // Derived state
  const isUp = change ? change > 0 : true;
  const isForecastUp = forecastData?.target_prediction === 1;
  const forecastColor = forecastData
    ? isForecastUp ? "var(--color-bullish)"
      : forecastData.target_prediction === 0 ? "var(--color-bearish)"
      : "var(--color-text-secondary)"
    : "var(--color-text-disabled)";

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* ── Breadcrumb / Sticky Header ── */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] px-6 py-2.5 flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <Link href="/stocks" className="hover:text-[var(--color-text-primary)] transition-colors">Stocks</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="text-[var(--color-text-primary)] font-bold">{sym}</span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        
        {/* ── 1. Hero Section (Price) ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">{sym}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                NSE
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
              {getSector(sym)} • {getCap(sym)}
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-bullish)] bg-[var(--color-bullish-muted)] px-2 py-0.5 rounded-full ml-2">
                <span className="live-dot" /> Market Open
              </span>
            </p>
          </div>

          <div className="text-left md:text-right">
            {priceLoading ? (
              <div className="animate-pulse">
                <div className="h-10 w-40 bg-gray-200 rounded-lg mb-2 ml-auto" />
                <div className="h-5 w-24 bg-gray-100 rounded ml-auto" />
              </div>
            ) : (
              <>
                <p className="text-[42px] font-black tabular-nums leading-none tracking-tight text-[var(--color-text-primary)]">
                  ₹{price?.toFixed(2) || "---"}
                </p>
                <div className={`flex items-center md:justify-end gap-1.5 mt-2 text-[15px] font-bold tabular-nums ${isUp ? 'text-[var(--color-bullish)]' : 'text-[var(--color-bearish)]'}`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {change ? (change > 0 ? "+" : "") + change.toFixed(2) : "0.00"} ({changePercent ? (changePercent > 0 ? "+" : "") + changePercent.toFixed(2) : "0.00"}%)
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── 2. AI Forecast (The Star Feature) ── */}
        {forecastError && <ErrorBanner section="AI Forecast" />}
        
        {forecastLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
        ) : forecastData ? (
          <div className="mb-8">
            <h2 className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-3 ml-1">StockVista Intelligence</h2>
            
            <div className="bg-gradient-to-br from-[#0B1020] to-[#1a233a] rounded-2xl p-8 shadow-xl text-white relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity duration-700" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold text-gray-300 tracking-wide">AI FORECAST FOR NEXT SESSION</span>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-8 items-end">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">AI Prediction</p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black tracking-tight" style={{ color: forecastColor }}>
                          {isForecastUp ? "BULLISH" : forecastData.target_prediction === 0 ? "BEARISH" : "NEUTRAL"}
                        </span>
                        <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${forecastColor}30`, color: forecastColor, border: `1px solid ${forecastColor}50` }}>
                          {fmtProb(forecastData.probability_score)} Prob.
                        </div>
                      </div>
                    </div>
                    
                    <div className="pl-6 border-l border-white/10">
                      <p className="text-sm text-gray-400 font-medium mb-1">Signal Strength</p>
                      <p className="text-xl font-bold text-white">{forecastData.signal_strength}</p>
                    </div>

                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke={forecastColor} strokeWidth="3"
                      strokeDasharray={`${forecastData.intelligence_score}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{forecastData.intelligence_score}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── 3. Grid Sections ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Reason Breakdown */}
          {forecastData && (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <SectionTitle icon={<Info className="w-5 h-5" />} title="Why this prediction?" />
              <div className="space-y-4 mt-6">
                {forecastData.reasons_breakdown.map((r, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                    <div className="shrink-0 mt-0.5 text-lg">{directionIcon(r.direction)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{r.category}</p>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded bg-gray-50 border ${
                          r.direction === "POSITIVE" ? "text-[var(--color-bullish)] border-[var(--color-bullish-muted)]" 
                          : r.direction === "NEGATIVE" ? "text-[var(--color-bearish)] border-[var(--color-bearish-muted)]" 
                          : "text-yellow-600 border-yellow-100"
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">{r.value}</p>
                      <p className="text-[12px] text-[var(--color-text-disabled)] mt-1.5 leading-relaxed">{r.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Intelligence & Technicals */}
          <div className="space-y-8">
            
            {/* Model Analysis Grid */}
            {forecastData && (
              <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
                <SectionTitle icon={<BarChart2 className="w-5 h-5" />} title="Model Performance" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                    <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Historical Acc.</p>
                    <p className="text-xl font-black text-[var(--color-text-primary)]">{(forecastData.historical_oos_accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                    <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">30D Accuracy</p>
                    <p className="text-xl font-black text-[var(--color-text-primary)]">{(forecastData.historical_30d_accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                    <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Volatility</p>
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">{forecastData.volatility_regime}</p>
                  </div>
                  <div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                    <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Calibration</p>
                    <p className="text-lg font-bold text-[var(--color-bullish)]">{forecastData.calibration_status}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Company Information Placeholder */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <SectionTitle icon={<Briefcase className="w-5 h-5" />} title="Company Information" />
              <div className="grid grid-cols-2 gap-y-6 mt-6">
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Sector</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{getSector(sym)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Market Cap</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{getCap(sym)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Exchange</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">NSE</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Type</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">Equity</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
