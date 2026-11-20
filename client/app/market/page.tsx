"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, getCap } from "@/lib/api";
import { useMarketIndices, type MarketIndex } from "@/hooks/useMarketIndices";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";
import { BarChart3, PieChart, TrendingUp, TrendingDown, Layers, ChevronDown, ChevronUp, ArrowRight, Minus } from "lucide-react";

const SECTORS = [
  "Financials",
  "IT",
  "Energy",
  "Auto",
  "Pharma",
  "Consumer",
  "FMCG",
  "Metals",
  "Power",
  "Infrastructure",
  "Capital Goods",
  "Telecom",
  "Real Estate",
  "Healthcare",
];

// ── Shared UI Helpers ────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="text-[17px] font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
      <span className="text-[var(--color-accent)]">{icon}</span>
      {title}
    </h2>
  );
}

// ── Market Index Card ────────────────────────────────────
function IndexCard({ label, price, change, changePct, isUp }: MarketIndex) {
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
          <p className="text-2xl font-black text-[var(--color-text-disabled)]">{Math.max(0, total - bullish - bearish)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Bearish</p>
          <p className="text-2xl font-black text-[var(--color-bearish)]">{bearish}</p>
        </div>
      </div>
    </div>
  );
}

// ── Sector heatmap overview ──────────────────────────────
function SectorHeatmap({ stocks, selectedSector, onSelectSector }: { 
  stocks: ForecastData[]; 
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
}) {
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
      <div className="flex items-center justify-between mb-2">
        <SectionTitle icon={<BarChart3 className="w-5 h-5" />} title="Sector Sentiment Overview" />
        {selectedSector && (
          <button 
            onClick={() => onSelectSector(null)} 
            className="text-[11px] font-bold text-[var(--color-accent)] hover:underline mb-4"
          >
            Show All
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 mt-1">
        {sectorData.map(d => {
          if (!d) return null;
          const color = d.bullPct >= 60 ? "var(--color-bullish)" : d.bullPct >= 40 ? "var(--color-warning)" : "var(--color-bearish)";
          const isSelected = selectedSector === d.sector;

          return (
            <div 
              key={d.sector} 
              onClick={() => onSelectSector(isSelected ? null : d.sector)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                isSelected ? 'bg-gray-100 ring-2 ring-[var(--color-accent)]' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-[13px] font-bold w-28 shrink-0 truncate transition-colors ${
                isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
              }`}>
                {d.sector}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.bullPct}%`, background: color }} 
                />
              </div>
              <span className="text-[13px] font-bold tabular-nums w-10 text-right" style={{ color }}>
                {d.bullPct}%
              </span>
              <span className="text-[11px] font-medium text-[var(--color-text-disabled)] w-14 text-right tabular-nums">
                {d.count} stocks
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Detailed Sector Breakdown with Constituent Stocks ─────
function SectorBreakdown({ 
  stocks, 
  liveQuotes,
  selectedSector, 
  onSelectSector 
}: { 
  stocks: ForecastData[]; 
  liveQuotes: Record<string, { price: number; change: number; changePercent: number; isUp: boolean }>;
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
}) {
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({
    Financials: true,
    IT: true,
    Energy: true,
  });

  const toggleExpand = (sec: string) => {
    setExpandedSectors(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const sectorsToDisplay = selectedSector 
    ? SECTORS.filter(s => s === selectedSector)
    : SECTORS;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <SectionTitle icon={<Layers className="w-5 h-5" />} title="Sector-wise Stock Breakdown" />
          <p className="text-[13px] text-[var(--color-text-secondary)] -mt-3">
            Real-time stock values, AI predictions, and conviction scores partitioned by industry domain.
          </p>
        </div>

        {selectedSector && (
          <button
            onClick={() => onSelectSector(null)}
            className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200 transition-colors w-fit"
          >
            ← View All Sectors
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sectorsToDisplay.map(sector => {
          const sectorStocks = stocks.filter(s => getSector(s.symbol) === sector);
          if (!sectorStocks.length) return null;

          const bullish = sectorStocks.filter(s => s.target_prediction === 1).length;
          const bearish = sectorStocks.filter(s => s.target_prediction === 0).length;
          const avgScore = Math.round(sectorStocks.reduce((a, b) => a + b.intelligence_score, 0) / sectorStocks.length);
          const isExpanded = selectedSector ? true : !!expandedSectors[sector];

          return (
            <div key={sector} className="border border-[var(--color-border)] rounded-xl overflow-hidden shadow-xs">
              {/* Sector Header Strip */}
              <div 
                onClick={() => toggleExpand(sector)}
                className="bg-gray-50/80 hover:bg-gray-100/80 px-5 py-4 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-[15px] text-[var(--color-text-primary)]">{sector}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {sectorStocks.length} {sectorStocks.length === 1 ? 'Stock' : 'Stocks'}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="hidden sm:flex items-center gap-3 text-[12px] font-medium">
                    <span className="text-[var(--color-bullish)] font-bold">🟢 {bullish} Bullish</span>
                    <span className="text-[var(--color-bearish)] font-bold">🔴 {bearish} Bearish</span>
                    <span className="text-[var(--color-text-secondary)]">
                      Avg AI Score: <strong className="text-[var(--color-text-primary)]">{avgScore}</strong>
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Constituent Stocks Grid */}
              {isExpanded && (
                <div className="p-4 bg-white divide-y divide-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sectorStocks.map(stock => {
                      const quote = liveQuotes[stock.symbol];
                      const isUp = stock.target_prediction === 1;

                      return (
                        <Link 
                          key={stock.symbol}
                          href={`/stocks/${stock.symbol}`}
                          className="p-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-xs transition-all group flex flex-col justify-between bg-white"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-black text-[15px] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                {stock.symbol}
                              </div>
                              <span className="text-[10px] font-bold text-[var(--color-text-disabled)] uppercase">
                                {getCap(stock.symbol)}
                              </span>
                            </div>

                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              isUp 
                                ? 'bg-[var(--color-bullish-muted)] text-[var(--color-bullish)] border-[var(--color-bullish-muted)]'
                                : stock.target_prediction === 0
                                ? 'bg-[var(--color-bearish-muted)] text-[var(--color-bearish)] border-[var(--color-bearish-muted)]'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {isUp ? <TrendingUp className="w-3 h-3" /> : stock.target_prediction === 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                              {isUp ? 'BULLISH' : stock.target_prediction === 0 ? 'BEARISH' : 'NEUTRAL'}
                            </span>
                          </div>

                          <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-100">
                            <div>
                              <div className="text-[10px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
                                Live Price
                              </div>
                              {quote ? (
                                <div>
                                  <span className="text-[14px] font-extrabold text-[var(--color-text-primary)] tabular-nums">
                                    ₹{quote.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                  <span className={`ml-1.5 text-[11px] font-bold tabular-nums ${quote.isUp ? 'text-[var(--color-bullish)]' : 'text-[var(--color-bearish)]'}`}>
                                    {quote.isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[12px] text-gray-400 font-medium">Fetching…</span>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
                                AI Score
                              </div>
                              <span className={`text-[14px] font-black tabular-nums ${
                                stock.intelligence_score >= 60 ? 'text-[var(--color-bullish)]'
                                : stock.intelligence_score >= 40 ? 'text-[var(--color-warning)]'
                                : 'text-[var(--color-bearish)]'
                              }`}>
                                {stock.intelligence_score}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
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
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [liveQuotes, setLiveQuotes] = useState<Record<string, { price: number; change: number; changePercent: number; isUp: boolean }>>({});

  // Fetch real-time prices for constituent stocks
  useEffect(() => {
    if (!forecasts.length) return;
    let cancelled = false;

    const fetchPrices = async () => {
      try {
        const symbols = forecasts.map(f => f.symbol).join(',');
        const res = await fetch(`/api/stocks/batch?symbols=${encodeURIComponent(symbols)}`);
        if (res.ok) {
          const json = await res.json();
          if (!cancelled && json.data) {
            setLiveQuotes(prev => ({ ...prev, ...json.data }));
          }
        }
      } catch {
        // Fallback resilience
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [forecasts]);

  const bullish = forecasts.filter(f => f.target_prediction === 1).length;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1300px] mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight">Market Overview</h1>
          <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">
            AI signal breadth, live sector sentiment, and partitioned industry stocks with real-time valuations.
          </p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="market data" onRetry={refetch} />}

      {/* ── Index strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {marketIndices.map((idx: any) => <IndexCard key={idx.label} {...idx} />)}
      </div>

      {/* ── Breadth + sector sentiment overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl h-56 animate-pulse shadow-sm" />
            <div className="bg-white border border-[var(--color-border)] rounded-2xl h-56 animate-pulse shadow-sm" />
          </>
        ) : (
          <>
            <BreadthGauge bullish={bullish} total={forecasts.length} />
            <SectorHeatmap 
              stocks={forecasts} 
              selectedSector={selectedSector} 
              onSelectSector={setSelectedSector} 
            />
          </>
        )}
      </div>

      {/* ── Detailed Sector Breakdown with All Stocks partitioned into domains ── */}
      {!loading && forecasts.length > 0 && (
        <SectorBreakdown 
          stocks={forecasts} 
          liveQuotes={liveQuotes}
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
        />
      )}

      {/* ── Top movers ── */}
      {!loading && forecasts.length > 0 && (
        <TopMovers stocks={forecasts} />
      )}
    </div>
  );
}
