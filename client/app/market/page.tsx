"use client";

import { useAllStocks } from "@/hooks/useSignals";
import { MARKET_INDICES, getSector } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";

const SECTORS = ["IT", "Financials", "Energy", "Auto", "Pharma", "FMCG", "Metals", "Power", "Telecom", "Capital Goods"];

function IndexCard({ label, price, change, changePct, isUp }: typeof MARKET_INDICES[0]) {
  return (
    <div className="bg-[#131820] border border-[#1e2535] rounded-xl p-5 hover:border-[#2a3548] transition-all">
      <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums mb-1">{price}</p>
      <span className={`text-sm font-bold ${isUp ? "text-[#00d26a]" : "text-[#ef4444]"}`}>
        {isUp ? "▲" : "▼"} {change} ({changePct})
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
    <div className="bg-[#131820] border border-[#1e2535] rounded-xl p-6">
      <h3 className="text-sm font-bold text-[#8892a4] uppercase tracking-widest mb-4">Market Breadth</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-4 bg-[#0d1117] rounded-full overflow-hidden flex">
          <div className="bg-[#00d26a] h-full transition-all duration-700" style={{ width: `${pct}%` }} />
          <div className="bg-[#ef4444] h-full flex-1 transition-all duration-700" />
        </div>
        <span className="text-white font-bold tabular-nums text-lg w-12 text-right">{pct}%</span>
      </div>
      <div className="flex justify-between text-xs text-[#6b7280]">
        <span className="text-[#00d26a] font-semibold">▲ {bullish} Bullish</span>
        <span className="text-[#ef4444] font-semibold">▼ {bearish} Bearish</span>
      </div>
      <div className="mt-4 pt-4 border-t border-[#1e2535] grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Bullish</p>
          <p className="text-xl font-black text-[#00d26a]">{bullish}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">No Signal</p>
          <p className="text-xl font-black text-[#6b7280]">{total - bullish - bearish < 0 ? 0 : total - bullish - bearish}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Bearish</p>
          <p className="text-xl font-black text-[#ef4444]">{bearish}</p>
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
    <div className="bg-[#131820] border border-[#1e2535] rounded-xl p-6">
      <h3 className="text-sm font-bold text-[#8892a4] uppercase tracking-widest mb-4">Sector Sentiment</h3>
      <div className="flex flex-col gap-2.5">
        {sectorData.map(d => {
          if (!d) return null;
          const color = d.bullPct >= 60 ? "#00d26a" : d.bullPct >= 40 ? "#facc15" : "#ef4444";
          return (
            <div key={d.sector} className="flex items-center gap-3">
              <span className="text-xs text-[#8892a4] w-28 shrink-0">{d.sector}</span>
              <div className="flex-1 h-2 bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.bullPct}%`, background: color }} />
              </div>
              <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color }}>
                {d.bullPct}%
              </span>
              <span className="text-[10px] text-[#3a4258] w-14 text-right">{d.count} stocks</span>
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

  const List = ({ items, label, color }: { items: ForecastData[]; label: string; color: string }) => (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>{label}</h4>
      {items.map((s, i) => (
        <div key={s.symbol} className="flex items-center gap-3 py-2.5 border-b border-[#1e2535]/50 last:border-b-0">
          <span className="text-[#3a4258] text-xs w-4">{i + 1}</span>
          <span className="font-bold text-white text-sm flex-1">{s.symbol}</span>
          <span className="text-xs text-[#6b7280]">{getSector(s.symbol)}</span>
          <span className="font-black text-sm tabular-nums" style={{ color }}>{s.intelligence_score}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#131820] border border-[#1e2535] rounded-xl p-6">
      <h3 className="text-sm font-bold text-[#8892a4] uppercase tracking-widest mb-4">Top Movers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <List items={bullish} label="Top Bullish" color="#00d26a" />
        <List items={bearish} label="Top Bearish" color="#ef4444" />
      </div>
    </div>
  );
}

export default function MarketPage() {
  const { forecasts, loading, error, lastFetchedAt, refetch } = useAllStocks(300_000);

  const bullish = forecasts.filter(f => f.target_prediction === 1).length;
  const bearish = forecasts.filter(f => f.target_prediction === 0).length;

  return (
    <div className="min-h-screen bg-[#0a0e14] px-4 md:px-8 py-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Market Overview</h1>
          <p className="text-[#8892a4] text-sm">AI signal breadth · Sector sentiment · NSE top movers</p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="market data" onRetry={refetch} />}

      {/* ── Index strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {MARKET_INDICES.map(idx => <IndexCard key={idx.label} {...idx} />)}
      </div>

      {/* ── Breadth + sector ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {loading ? (
          <>
            <div className="bg-[#131820] border border-[#1e2535] rounded-xl h-52 animate-pulse" />
            <div className="bg-[#131820] border border-[#1e2535] rounded-xl h-52 animate-pulse" />
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
