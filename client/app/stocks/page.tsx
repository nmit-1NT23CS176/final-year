"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, getCap, signalLabel, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner, SkeletonTableRow } from "@/components/shared/FeedbackUI";

type SortKey = "intelligence_score" | "probability_score" | "stock_historical_accuracy" | "confidence_score";
type SortDir = "asc" | "desc";
type SignalFilter = "ALL" | "BULLISH" | "BEARISH" | "NO SIGNAL";
type VolFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

function SignalPill({ pred }: { pred: -1 | 0 | 1 }) {
  const styles = {
    1:  "bg-[#003d20] text-[#00d26a] border border-[#00d26a]/30",
    0:  "bg-[#3d0000] text-[#ef4444] border border-[#ef4444]/30",
    "-1": "bg-[#1a1f2c] text-[#6b7280] border border-[#6b7280]/30",
  } as Record<string, string>
  const labels = { 1: "BULLISH", 0: "BEARISH", "-1": "NO SIGNAL" } as Record<string, string>
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${styles[String(pred)]}`}>
      {labels[String(pred)]}
    </span>
  );
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 60 ? "bg-[#00d26a]" : pct >= 40 ? "bg-yellow-400" : "bg-[#ef4444]";
  return (
    <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function StocksPage() {
  const { forecasts, loading, error, lastFetchedAt, refetch } = useAllStocks(300_000);

  const [search, setSearch] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("ALL");
  const [volFilter, setVolFilter] = useState<VolFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("intelligence_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let data = [...forecasts];

    if (search) {
      const q = search.toUpperCase();
      data = data.filter(f => f.symbol.includes(q) || getSector(f.symbol).toUpperCase().includes(q));
    }
    if (signalFilter !== "ALL") {
      const pred = signalFilter === "BULLISH" ? 1 : signalFilter === "BEARISH" ? 0 : -1;
      data = data.filter(f => f.target_prediction === pred);
    }
    if (volFilter !== "ALL") {
      data = data.filter(f => f.volatility_regime === volFilter);
    }

    data.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return data;
  }, [forecasts, search, signalFilter, volFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className={`ml-1 ${sortKey === k ? "text-[#00d26a]" : "text-[#3a4258]"}`}>
      {sortKey === k ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
    </span>
  );

  const bullish   = forecasts.filter(f => f.target_prediction === 1).length;
  const bearish   = forecasts.filter(f => f.target_prediction === 0).length;
  const noSignal  = forecasts.filter(f => f.target_prediction === -1).length;

  return (
    <div className="min-h-screen bg-[#0a0e14] px-4 md:px-8 py-10 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Stock Signals</h1>
            <p className="text-[#8892a4] text-sm">
              Next-day AI forecasts for {forecasts.length} NSE stocks
            </p>
          </div>
          <FreshnessBadge lastFetchedAt={lastFetchedAt} />
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap mt-2">
          {[
            { label: "Total", value: forecasts.length, color: "text-white", bg: "bg-[#131820] border-[#2a3548]" },
            { label: "Bullish", value: bullish, color: "text-[#00d26a]", bg: "bg-[#003d20]/40 border-[#00d26a]/30" },
            { label: "Bearish", value: bearish, color: "text-[#ef4444]", bg: "bg-[#3d0000]/40 border-[#ef4444]/30" },
            { label: "No Signal", value: noSignal, color: "text-[#6b7280]", bg: "bg-[#131820] border-[#1e2535]" },
          ].map(p => (
            <div key={p.label} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${p.bg}`}>
              <span className="text-[#6b7280]">{p.label}</span>
              <span className={p.color}>{loading ? "—" : p.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search symbol or sector…"
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-[#131820] border border-[#1e2535] rounded-xl
            text-sm text-white placeholder:text-[#3a4258] focus:outline-none focus:border-[#00d26a]/60 transition-colors"
        />

        {/* Signal filter */}
        <div className="flex bg-[#131820] border border-[#1e2535] rounded-xl overflow-hidden">
          {(["ALL","BULLISH","BEARISH","NO SIGNAL"] as SignalFilter[]).map(f => (
            <button key={f} onClick={() => setSignalFilter(f)}
              className={`px-3 py-2.5 text-xs font-semibold transition-colors border-r last:border-r-0 border-[#1e2535] ${
                signalFilter === f
                  ? "bg-[#00d26a] text-[#06090d]"
                  : "text-[#6b7280] hover:text-white"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Volatility filter */}
        <div className="flex bg-[#131820] border border-[#1e2535] rounded-xl overflow-hidden">
          {(["ALL","LOW","MEDIUM","HIGH"] as VolFilter[]).map(f => (
            <button key={f} onClick={() => setVolFilter(f)}
              className={`px-3 py-2.5 text-xs font-semibold transition-colors border-r last:border-r-0 border-[#1e2535] ${
                volFilter === f
                  ? "bg-[#00d26a] text-[#06090d]"
                  : "text-[#6b7280] hover:text-white"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner section="stocks" onRetry={refetch} />}

      {/* ── Table ── */}
      <div className="bg-[#131820] border border-[#1e2535] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-[#1e2535] text-[#6b7280]">
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider">Symbol</th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider">Sector</th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider">Signal</th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort("intelligence_score")}>
                  AI Score <SortIcon k="intelligence_score" />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort("probability_score")}>
                  UP Prob. <SortIcon k="probability_score" />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort("confidence_score")}>
                  Confidence <SortIcon k="confidence_score" />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort("stock_historical_accuracy")}>
                  Stock Acc. <SortIcon k="stock_historical_accuracy" />
                </th>
                <th className="text-left py-4 px-4 font-semibold text-[11px] uppercase tracking-wider">Volatility</th>
                <th className="py-4 px-4" />
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => <SkeletonTableRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-[#6b7280]">
                      No stocks match your filters.
                    </td>
                  </tr>
                )
                : filtered.map(stock => (
                  <tr key={stock.symbol}
                    className="border-b border-[#1e2535]/50 hover:bg-[#0d1117]/40 transition-colors group">
                    <td className="py-4 px-4">
                      <Link href={`/stocks/${stock.symbol}`}
                        className="font-bold text-white group-hover:text-[#00d26a] transition-colors">
                        {stock.symbol}
                      </Link>
                      <div className="text-[10px] text-[#6b7280] mt-0.5">{getCap(stock.symbol)}</div>
                    </td>
                    <td className="py-4 px-4 text-[#8892a4] text-xs">{getSector(stock.symbol)}</td>
                    <td className="py-4 px-4">
                      <SignalPill pred={stock.target_prediction} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 min-w-[80px]">
                        <span className={`text-sm font-bold tabular-nums ${
                          stock.intelligence_score >= 60 ? "text-[#00d26a]"
                          : stock.intelligence_score >= 40 ? "text-yellow-400"
                          : "text-[#ef4444]"
                        }`}>{stock.intelligence_score}</span>
                        <ScoreBar value={stock.intelligence_score} />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white tabular-nums font-medium">
                      {fmtProb(stock.probability_score)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        stock.confidence_level === "HIGH" ? "text-[#00d26a] bg-[#003d20]"
                        : stock.confidence_level === "MEDIUM" ? "text-yellow-400 bg-yellow-400/10"
                        : "text-[#6b7280] bg-[#0d1117]"
                      }`}>{stock.confidence_level}</span>
                    </td>
                    <td className="py-4 px-4 text-white tabular-nums font-medium">
                      {(stock.stock_historical_accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-medium ${
                        stock.volatility_regime === "HIGH" ? "text-[#ef4444]"
                        : stock.volatility_regime === "MEDIUM" ? "text-yellow-400"
                        : "text-[#00d26a]"
                      }`}>{stock.volatility_regime}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/stocks/${stock.symbol}`}
                        className="text-xs text-[#00d26a] font-semibold hover:underline whitespace-nowrap">
                        Analyse →
                      </Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <p className="mt-4 text-xs text-[#3a4258] text-right">
          Showing {filtered.length} of {forecasts.length} stocks
        </p>
      )}
    </div>
  );
}
