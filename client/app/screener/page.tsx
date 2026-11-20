"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, getCap, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";

type SignalFilter  = "ALL" | "BULLISH" | "BEARISH" | "NO SIGNAL";
type VolFilter     = "ALL" | "LOW" | "MEDIUM" | "HIGH";
type ConfFilter    = "ALL" | "HIGH" | "MEDIUM" | "LOW";
type SortKey       = "intelligence_score" | "probability_score" | "stock_historical_accuracy";

const SECTOR_OPTIONS = ["ALL","IT","Financials","Energy","Auto","Pharma","FMCG","Metals","Power","Telecom","Capital Goods","Diversified"];

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        active
          ? "bg-[#00d26a] text-[#06090d] border-[#00d26a]"
          : "bg-[#131820] text-[#6b7280] border-[#1e2535] hover:text-white hover:border-[#2a3548]"
      }`}>
      {label}
    </button>
  );
}

function ResultCard({ stock }: { stock: ForecastData }) {
  const up = stock.target_prediction === 1;
  const neutral = stock.target_prediction === -1;
  return (
    <div className={`p-4 rounded-xl border transition-all hover:-translate-y-0.5 group ${
      up ? "border-[#00d26a]/20 bg-[#003d20]/10" : neutral ? "border-[#1e2535] bg-[#131820]" : "border-[#ef4444]/20 bg-[#3d0000]/10"
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-[10px] text-[#6b7280] mb-0.5">{getSector(stock.symbol)} · {getCap(stock.symbol)}</div>
          <Link href={`/stocks/${stock.symbol}`}
            className="text-lg font-extrabold text-white group-hover:text-[#00d26a] transition-colors">
            {stock.symbol}
          </Link>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${
          up ? "text-[#00d26a] bg-[#003d20] border-[#00d26a]/30"
          : neutral ? "text-[#6b7280] bg-[#1a1f2c] border-[#6b7280]/30"
          : "text-[#ef4444] bg-[#3d0000] border-[#ef4444]/30"
        }`}>
          {up ? "BULLISH" : neutral ? "NO SIG" : "BEARISH"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mt-auto">
        <div>
          <p className="text-[#6b7280] mb-0.5">AI Score</p>
          <p className={`font-bold ${up ? "text-[#00d26a]" : neutral ? "text-[#6b7280]" : "text-[#ef4444]"}`}>
            {stock.intelligence_score}
          </p>
        </div>
        <div>
          <p className="text-[#6b7280] mb-0.5">UP Prob.</p>
          <p className="font-bold text-white">{fmtProb(stock.probability_score)}</p>
        </div>
        <div>
          <p className="text-[#6b7280] mb-0.5">Vol.</p>
          <p className={`font-bold ${
            stock.volatility_regime === "HIGH" ? "text-[#ef4444]"
            : stock.volatility_regime === "MEDIUM" ? "text-yellow-400"
            : "text-[#00d26a]"
          }`}>{stock.volatility_regime}</p>
        </div>
      </div>

      <Link href={`/stocks/${stock.symbol}`}
        className="mt-3 pt-3 border-t border-[#1e2535]/50 flex w-full text-xs font-semibold text-[#00d26a] hover:underline">
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
    <div className="min-h-screen bg-[#0a0e14] px-4 md:px-8 py-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Stock Screener</h1>
          <p className="text-[#8892a4] text-sm">Filter all {forecasts.length} NSE stocks by AI signal criteria</p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="screener" onRetry={refetch} />}

      {/* ── Filter panel ── */}
      <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6 mb-6 flex flex-col gap-5">

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by symbol…"
          className="w-full px-4 py-3 bg-[#0d1117] border border-[#1e2535] rounded-xl text-sm
            text-white placeholder:text-[#3a4258] focus:outline-none focus:border-[#00d26a]/60 transition-colors" />

        {/* Signal */}
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-2">Signal</p>
          <div className="flex flex-wrap gap-2">
            {(["ALL","BULLISH","BEARISH","NO SIGNAL"] as SignalFilter[]).map(f => (
              <FilterChip key={f} label={f} active={signal === f} onClick={() => setSignal(f)} />
            ))}
          </div>
        </div>

        {/* Volatility */}
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-2">Volatility Regime</p>
          <div className="flex flex-wrap gap-2">
            {(["ALL","LOW","MEDIUM","HIGH"] as VolFilter[]).map(f => (
              <FilterChip key={f} label={f} active={vol === f} onClick={() => setVol(f)} />
            ))}
          </div>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-2">Confidence</p>
          <div className="flex flex-wrap gap-2">
            {(["ALL","HIGH","MEDIUM","LOW"] as ConfFilter[]).map(f => (
              <FilterChip key={f} label={f} active={conf === f} onClick={() => setConf(f)} />
            ))}
          </div>
        </div>

        {/* Sector */}
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-2">Sector</p>
          <div className="flex flex-wrap gap-2">
            {SECTOR_OPTIONS.map(s => (
              <FilterChip key={s} label={s} active={sector === s} onClick={() => setSector(s)} />
            ))}
          </div>
        </div>

        {/* Min Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Min AI Score</p>
            <span className="text-xs font-bold text-[#00d26a]">{minScore}</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="w-full accent-[#00d26a]" />
          <div className="flex justify-between text-[10px] text-[#3a4258] mt-1">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>

        {/* Sort + Reset */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#1e2535]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Sort by:</span>
            {(["intelligence_score","probability_score","stock_historical_accuracy"] as SortKey[]).map(k => (
              <button key={k} onClick={() => setSortKey(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  sortKey === k ? "bg-[#00d26a] text-[#06090d] border-[#00d26a]" : "bg-[#0d1117] text-[#6b7280] border-[#1e2535] hover:text-white"
                }`}>
                {k === "intelligence_score" ? "AI Score" : k === "probability_score" ? "UP Prob." : "Stock Acc."}
              </button>
            ))}
          </div>
          <button onClick={() => { setSignal("ALL"); setVol("ALL"); setConf("ALL"); setSector("ALL"); setMinScore(0); setSearch(""); }}
            className="text-xs text-[#6b7280] hover:text-white transition-colors underline">
            Reset filters
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-[#8892a4]">
          {loading ? "Loading…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#131820] border border-[#1e2535] rounded-xl h-44 animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-[#6b7280]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-semibold text-white mb-1">No stocks match</p>
          <p className="text-sm">Adjust your filters to see results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map(s => <ResultCard key={s.symbol} stock={s} />)}
        </div>
      )}
    </div>
  );
}
