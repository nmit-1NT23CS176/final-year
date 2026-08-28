"use client";

import { useAllStocks } from "@/hooks/useSignals";
import { getSector } from "@/lib/api";
import { useMarketIndices } from "@/hooks/useMarketIndices";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";
import { BarChart3, PieChart, TrendingUp, TrendingDown } from "lucide-react";

const SECTORS = ["IT", "Financials", "Energy", "Auto", "Pharma", "FMCG", "Metals", "Power", "Telecom", "Capital Goods"];

// ── Shared UI Helpers ────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <h2 className="text-[17px] font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
      <span className="text-[var(--color-accent)]">{icon}</span>
      {title}
    </h2>
  );
}

// ── Market Index Card ────────────────────────────────────
function IndexCard({ label, price, change, changePct, isUp }: typeof MARKET_INDICES[0]) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-soft transition-all cursor-pointer shadow-card">
      <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-[var(--color-text-primary)] tabular-nums tracking-tight mb-1">{price}</p>
      <span className={`text-[13px] font-bold flex items-center gap-1 ${isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />} 
        {change} ({changePct})
      </span>
    </div>
  );
}

// ── Breadth gauge ────────────────────────────────────────
function BreadthGauge({ bullish, total }: { bullish: number; total: number }) {
  if (!total) return null;
  const pct = Math.round((bullish / total) * 100);
  const bearish = total - bullish;
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <SectionTitle icon={<PieChart className="w-5 h-5" />} title="Market Breadth" />
      
      <div className="flex items-center gap-4 mb-4 mt-2">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-[var(--color-bullish)] h-full transition-all duration-700" style={{ width: `${pct}%` }} />
          <div className="bg-[var(--color-bearish)] h-full flex-1 transition-all duration-700" />
        </div>
        <span className="text-[var(--color-text-primary)] font-bold tabular-nums text-xl w-12 text-right tracking-tight">{pct}%</span>
      </div>
      
      <div className="flex justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
        <span className="text-[var(--color-bullish)] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {bullish} Bullish</span>
        <span className="text-[var(--color-bearish)] flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {bearish} Bearish</span>
      </div>
      
      <div className="mt-6 pt-6 border-t border-[var(--color-border)] grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Bullish</p>
          <p className="text-2xl font-black text-[var(--color-bullish)]">{bullish}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">No Signal</p>
          <p className="text-2xl font-black text-[var(--color-text-disabled)]">{total - bullish - bearish < 0 ? 0 : total - bullish - bearish}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Bearish</p>
          <p className="text-2xl font-black text-[var(--color-bearish)]">{bearish}</p>
        </div>
      </div>
    </div>
  );
}

// ── Sector heatmap ────────────────────────────────────────
function SectorHeatmap({ stocks }: { stocks: ForecastData[] }) {
  const sectorData = SECTORS.map(sector => {
    const sectorStocks = stocks.filter(s => getSector(s.symbol) === sector);
    if (!sectorStocks.length) return null;
    const bullish = sectorStocks.filter(s => s.target_prediction === 1).length;
    const avgScore = Math.round(sectorStocks.reduce((a, b) => a + b.intelligence_score, 0) / sectorStocks.length);
    const bullPct = Math.round((bullish / sectorStocks.length) * 100);
    return { sector, bullPct, avgScore, count: sectorStocks.length };
  }).filter(Boolean);

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <SectionTitle icon={<BarChart3 className="w-5 h-5" />} title="Sector Sentiment" />
      <div className="flex flex-col gap-3 mt-2">
        {sectorData.map(d => {
          if (!d) return null;
          const color = d.bullPct >= 60 ? "var(--color-bullish)" : d.bullPct >= 40 ? "var(--color-warning)" : "var(--color-bearish)";
          return (
            <div key={d.sector} className="flex items-center gap-3 group">
              <span className="text-[13px] font-semibold text-[var(--color-text-secondary)] w-28 shrink-0 group-hover:text-[var(--color-text-primary)] transition-colors">{d.sector}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.bullPct}%`, background: color }} />
              </div>
              <span className="text-[13px] font-bold tabular-nums w-10 text-right" style={{ color }}>
                {d.bullPct}%
              </span>
              <span className="text-[11px] font-medium text-[var(--color-text-disabled)] w-14 text-right tabular-nums">{d.count} stocks</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top movers by AI score ────────────────────────────────
function TopMovers({ stocks }: { stocks: ForecastData[] }) {
  const bullish = [...stocks].filter(s => s.target_prediction === 1)
    .sort((a, b) => b.intelligence_score - a.intelligence_score).slice(0, 5);
  const bearish = [...stocks].filter(s => s.target_prediction === 0)
    .sort((a, b) => b.intelligence_score - a.intelligence_score).slice(0, 5);

  const List = ({ items, label, color, isUp }: { items: ForecastData[]; label: string; color: string; isUp: boolean }) => (
    <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        {isUp ? <TrendingUp className="w-4 h-4" style={{ color }} /> : <TrendingDown className="w-4 h-4" style={{ color }} />}
        <h4 className="text-[12px] font-bold uppercase tracking-widest" style={{ color }}>{label}</h4>
      </div>
      
      {items.map((s, i) => (
        <div key={s.symbol} className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-white hover:rounded-lg transition-colors px-2 -mx-2 cursor-pointer">
          <span className="text-[var(--color-text-disabled)] text-[12px] font-bold w-4 shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[14px] text-[var(--color-text-primary)] truncate">{s.symbol}</div>
            <div className="text-[11px] font-medium text-[var(--color-text-secondary)] truncate">{getSector(s.symbol)}</div>
          </div>
          <div className="text-right">
            <span className="font-black text-[15px] tabular-nums tracking-tight" style={{ color }}>{s.intelligence_score}</span>
            <div className="text-[10px] text-[var(--color-text-disabled)] font-bold uppercase">AI Score</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <SectionTitle icon={<TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />} title="Top Movers (Next Session)" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <List items={bullish} label="Top Bullish Signals" color="var(--color-bullish)" isUp={true} />
        <List items={bearish} label="Top Bearish Signals" color="var(--color-bearish)" isUp={false} />
      </div>
    </div>
  );
}

export default function MarketPage() {
  const marketIndices = useMarketIndices();
  const { forecasts, loading, error, lastFetchedAt, refetch } = useAllStocks(300_000);

  const bullish = forecasts.filter(f => f.target_prediction === 1).length;
  const bearish = forecasts.filter(f => f.target_prediction === 0).length;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1200px] mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight">Market Overview</h1>
          <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">AI signal breadth, sector sentiment, and top momentum stocks.</p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="market data" onRetry={refetch} />}

      {/* ── Index strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {marketIndices.map((idx: any) => <IndexCard key={idx.label} {...idx} />)}
      </div>

      {/* ── Breadth + sector ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl h-56 animate-pulse shadow-sm" />
            <div className="bg-white border border-[var(--color-border)] rounded-2xl h-56 animate-pulse shadow-sm" />
          </>
        ) : (
          <>
            <BreadthGauge bullish={bullish} total={forecasts.length} />
            <SectorHeatmap stocks={forecasts} />
          </>
        )}
      </div>

      {/* ── Top movers ── */}
      {!loading && forecasts.length > 0 && (
        <TopMovers stocks={forecasts} />
      )}
    </div>
  );
}
