"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, getCap, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";
import { Filter, Search, SlidersHorizontal, TrendingUp, TrendingDown, Minus } from "lucide-react";

type SignalFilter  = "ALL" | "BULLISH" | "BEARISH" | "NO SIGNAL";
type VolFilter     = "ALL" | "LOW" | "MEDIUM" | "HIGH";
type ConfFilter    = "ALL" | "HIGH" | "MEDIUM" | "LOW";
type SortKey       = "intelligence_score" | "probability_score" | "stock_historical_accuracy";

const SECTOR_OPTIONS = ["ALL","IT","Financials","Energy","Auto","Pharma","FMCG","Metals","Power","Telecom","Capital Goods","Diversified"];

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
        active
          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm"
          : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-gray-400"
      }`}>
      {label}
    </button>
  );
}

function ResultCard({ stock }: { stock: ForecastData }) {
  const up = stock.target_prediction === 1;
  const neutral = stock.target_prediction === -1;
  return (
    <div className={`bg-white p-5 rounded-2xl border transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group flex flex-col ${
      up ? "border-[var(--color-border)] hover:border-[var(--color-bullish)]" : neutral ? "border-[var(--color-border)] hover:border-gray-400" : "border-[var(--color-border)] hover:border-[var(--color-bearish)]"
    }`}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <div className="text-[11px] font-bold text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">{getSector(stock.symbol)}</div>
          <Link href={`/stocks/${stock.symbol}`}
            className="text-[18px] font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors tracking-tight">
            {stock.symbol}
          </Link>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
          up ? "text-[var(--color-bullish)] bg-[var(--color-bullish-muted)]"
          : neutral ? "text-gray-600 bg-gray-100"
          : "text-[var(--color-bearish)] bg-[var(--color-bearish-muted)]"
        }`}>
          {up ? <TrendingUp className="w-3 h-3" /> : neutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {up ? "BULLISH" : neutral ? "NO SIG" : "BEARISH"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-[12px] mt-auto bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">AI Score</p>
          <p className={`font-black tabular-nums text-[15px] ${up ? "text-[var(--color-bullish)]" : neutral ? "text-[var(--color-text-secondary)]" : "text-[var(--color-bearish)]"}`}>
            {stock.intelligence_score}
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">UP Prob.</p>
          <p className="font-bold tabular-nums text-[var(--color-text-primary)]">{fmtProb(stock.probability_score)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Vol.</p>
          <p className={`font-bold ${
            stock.volatility_regime === "HIGH" ? "text-[var(--color-bearish)]"
            : stock.volatility_regime === "MEDIUM" ? "text-[var(--color-warning)]"
            : "text-[var(--color-bullish)]"
          }`}>{stock.volatility_regime}</p>
        </div>
      </div>

      <Link href={`/stocks/${stock.symbol}`}
        className="mt-4 pt-3 border-t border-[var(--color-border)] flex w-full text-[13px] font-bold text-[var(--color-accent)] hover:underline">
        Full Analysis →
      </Link>
    </div>
  );
}

export default function ScreenerPage() {
  const { forecasts, loading, error, lastFetchedAt, refetch } = useAllStocks(300_000);

  const [signal, setSignal]   = useState<SignalFilter>("ALL");
  const [vol, setVol]         = useState<VolFilter>("ALL");
  const [conf, setConf]       = useState<ConfFilter>("ALL");
  const [sector, setSector]   = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("intelligence_score");
  const [minScore, setMinScore] = useState(0);
  const [search, setSearch]   = useState("");

  const results = useMemo(() => {
    let data = [...forecasts];

    if (search) data = data.filter(f => f.symbol.toUpperCase().includes(search.toUpperCase()));
    if (signal !== "ALL") {
      const pred = signal === "BULLISH" ? 1 : signal === "BEARISH" ? 0 : -1;
      data = data.filter(f => f.target_prediction === pred);
    }
    if (vol !== "ALL")  data = data.filter(f => f.volatility_regime === vol);
    if (conf !== "ALL") data = data.filter(f => f.confidence_level === conf);
    if (sector !== "ALL") data = data.filter(f => getSector(f.symbol) === sector);
    if (minScore > 0) data = data.filter(f => f.intelligence_score >= minScore);

    data.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
    return data;
  }, [forecasts, signal, vol, conf, sector, sortKey, minScore, search]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1200px] mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight flex items-center gap-2">
            <Filter className="w-8 h-8 text-[var(--color-accent)]" />
            AI Stock Screener
          </h1>
          <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">Filter all {forecasts.length} NSE stocks by machine learning criteria.</p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="screener" onRetry={refetch} />}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── Filter panel (Left) ── */}
        <div className="w-full lg:w-[320px] shrink-0 h-fit sticky top-24 bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4 mb-1">
            <SlidersHorizontal className="w-5 h-5 text-[var(--color-text-primary)]" />
            <h2 className="font-extrabold text-[16px]">Screening Criteria</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search symbol…"
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[13px] font-semibold
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all" />
          </div>

          {/* Signal */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">AI Signal</p>
            <div className="flex flex-wrap gap-2">
              {(["ALL","BULLISH","BEARISH","NO SIGNAL"] as SignalFilter[]).map(f => (
                <FilterChip key={f} label={f} active={signal === f} onClick={() => setSignal(f)} />
              ))}
            </div>
          </div>

          {/* Volatility */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">Volatility Regime</p>
            <div className="flex flex-wrap gap-2">
              {(["ALL","LOW","MEDIUM","HIGH"] as VolFilter[]).map(f => (
                <FilterChip key={f} label={f} active={vol === f} onClick={() => setVol(f)} />
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">Model Confidence</p>
            <div className="flex flex-wrap gap-2">
              {(["ALL","HIGH","MEDIUM","LOW"] as ConfFilter[]).map(f => (
                <FilterChip key={f} label={f} active={conf === f} onClick={() => setConf(f)} />
              ))}
            </div>
          </div>

          {/* Sector */}
          <div>
            <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">Sector</p>
            <div className="flex flex-wrap gap-2">
              {SECTOR_OPTIONS.map(s => (
                <FilterChip key={s} label={s} active={sector === s} onClick={() => setSector(s)} />
              ))}
            </div>
          </div>

          {/* Min Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Min AI Score</p>
              <span className="text-[14px] font-black tabular-nums text-[var(--color-text-primary)]">{minScore}</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)] cursor-pointer" />
            <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-disabled)] mt-1 tabular-nums">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>

          {/* Sort + Reset */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[var(--color-border)]">
            <div>
              <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">Sort Results By</p>
              <div className="flex flex-wrap gap-2">
                {(["intelligence_score","probability_score","stock_historical_accuracy"] as SortKey[]).map(k => (
                  <FilterChip key={k} label={k === "intelligence_score" ? "AI Score" : k === "probability_score" ? "UP Prob." : "Stock Acc."} active={sortKey === k} onClick={() => setSortKey(k)} />
                ))}
              </div>
            </div>
            <button onClick={() => { setSignal("ALL"); setVol("ALL"); setConf("ALL"); setSector("ALL"); setMinScore(0); setSearch(""); }}
              className="w-full py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[13px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>

        {/* ── Results (Right) ── */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 bg-white border border-[var(--color-border)] px-5 py-3 rounded-xl shadow-sm">
            <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
              {loading ? "Searching…" : `${results.length} Stocks Found`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl h-48 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[var(--color-border)] rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-[var(--color-text-disabled)] mx-auto mb-4" />
              <p className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No stocks match your criteria</p>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Try adjusting or resetting your filters.</p>
              <button onClick={() => { setSignal("ALL"); setVol("ALL"); setConf("ALL"); setSector("ALL"); setMinScore(0); setSearch(""); }}
                className="mt-6 px-6 py-2 bg-[var(--color-accent)] text-white rounded-xl text-[13px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map(s => <ResultCard key={s.symbol} stock={s} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
