"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, getCap, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner, SkeletonTableRow } from "@/components/shared/FeedbackUI";
import { List, Search, ArrowDownUp, TrendingUp, TrendingDown, Minus } from "lucide-react";

type SortKey = "intelligence_score" | "probability_score" | "stock_historical_accuracy" | "confidence_score";
type SortDir = "asc" | "desc";
type SignalFilter = "ALL" | "BULLISH" | "BEARISH" | "NO SIGNAL";
type VolFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

function SignalPill({ pred }: { pred: -1 | 0 | 1 }) {
  const styles = {
    1:  "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)] border-[var(--color-bullish-muted)]",
    0:  "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)] border-[var(--color-bearish-muted)]",
    "-1": "bg-gray-100 text-gray-600 border-gray-200",
  } as Record<string, string>
  const labels = { 1: "BULLISH", 0: "BEARISH", "-1": "NO SIGNAL" } as Record<string, string>
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide border flex items-center justify-center gap-1 w-fit ${styles[String(pred)]}`}>
      {pred === 1 ? <TrendingUp className="w-3 h-3" /> : pred === 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
      {labels[String(pred)]}
    </span>
  );
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 60 ? "bg-[var(--color-bullish)]" : pct >= 40 ? "bg-[var(--color-warning)]" : "bg-[var(--color-bearish)]";
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
    <span className={`ml-1 flex-shrink-0 ${sortKey === k ? "text-[var(--color-accent)]" : "text-[var(--color-text-disabled)]"}`}>
      {sortKey === k ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
    </span>
  );

  const bullish   = forecasts.filter(f => f.target_prediction === 1).length;
  const bearish   = forecasts.filter(f => f.target_prediction === 0).length;
  const noSignal  = forecasts.filter(f => f.target_prediction === -1).length;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1600px] mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight flex items-center gap-2">
              <List className="w-8 h-8 text-[var(--color-accent)]" />
              All Stocks Directory
            </h1>
            <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">
              Browse and filter {forecasts.length} NSE stocks analyzed by AI.
            </p>
          </div>
          <FreshnessBadge lastFetchedAt={lastFetchedAt} />
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Total Tracked", value: forecasts.length, color: "text-[var(--color-text-primary)]", bg: "bg-white border-[var(--color-border)] shadow-sm" },
            { label: "Bullish Signals", value: bullish, color: "text-[var(--color-bullish)]", bg: "bg-[var(--color-bullish-muted)] border-[var(--color-bullish-muted)]" },
            { label: "Bearish Signals", value: bearish, color: "text-[var(--color-bearish)]", bg: "bg-[var(--color-bearish-muted)] border-[var(--color-bearish-muted)]" },
            { label: "No Signal", value: noSignal, color: "text-[var(--color-text-secondary)]", bg: "bg-gray-100 border-gray-200" },
          ].map(p => (
            <div key={p.label} className={`px-4 py-2 rounded-xl border text-[12px] font-bold flex items-center gap-2 ${p.bg}`}>
              <span className="text-[var(--color-text-secondary)]">{p.label}</span>
              <span className={`text-[14px] font-black ${p.color}`}>{loading ? "—" : p.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol or sector…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-xl shadow-sm
              text-[13px] font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
          />
        </div>

        {/* Signal filter */}
        <div className="flex bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          {(["ALL","BULLISH","BEARISH","NO SIGNAL"] as SignalFilter[]).map(f => (
            <button key={f} onClick={() => setSignalFilter(f)}
              className={`px-4 py-2.5 text-[12px] font-bold transition-colors border-r last:border-r-0 border-[var(--color-border)] ${
                signalFilter === f
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Volatility filter */}
        <div className="flex bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          <div className="px-3 py-2.5 text-[12px] font-bold text-[var(--color-text-disabled)] bg-gray-50 border-r border-[var(--color-border)]">Vol:</div>
          {(["ALL","LOW","MEDIUM","HIGH"] as VolFilter[]).map(f => (
            <button key={f} onClick={() => setVolFilter(f)}
              className={`px-4 py-2.5 text-[12px] font-bold transition-colors border-r last:border-r-0 border-[var(--color-border)] ${
                volFilter === f
                  ? "bg-gray-800 text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner section="stocks" onRetry={refetch} />}

      {/* ── Table ── */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm text-left">
            <thead className="bg-[var(--color-background)]/50">
              <tr className="border-b border-[var(--color-border)]">
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest">Symbol</th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest">Sector</th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest">AI Signal</th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => toggleSort("intelligence_score")}>
                  <div className="flex items-center gap-1">AI Score <SortIcon k="intelligence_score" /></div>
                </th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => toggleSort("probability_score")}>
                  <div className="flex items-center gap-1">UP Prob. <SortIcon k="probability_score" /></div>
                </th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => toggleSort("confidence_score")}>
                  <div className="flex items-center gap-1">Confidence <SortIcon k="confidence_score" /></div>
                </th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => toggleSort("stock_historical_accuracy")}>
                  <div className="flex items-center gap-1">Stock Acc. <SortIcon k="stock_historical_accuracy" /></div>
                </th>
                <th className="py-4 px-5 font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest">Volatility</th>
                <th className="py-4 px-5 text-right font-bold text-[11px] text-[var(--color-text-disabled)] uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading
                ? Array.from({ length: 15 }).map((_, i) => <SkeletonTableRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-[var(--color-text-secondary)]">
                      <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-[15px] text-[var(--color-text-primary)]">No stocks match your filters.</p>
                      <p className="text-[13px]">Try adjusting your search criteria.</p>
                    </td>
                  </tr>
                )
                : filtered.map(stock => (
                  <tr key={stock.symbol}
                    className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-5">
                      <Link href={`/stocks/${stock.symbol}`}
                        className="font-extrabold text-[15px] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {stock.symbol}
                      </Link>
                      <div className="text-[11px] font-medium text-[var(--color-text-disabled)] mt-0.5">{getCap(stock.symbol)}</div>
                    </td>
                    <td className="py-4 px-5 text-[var(--color-text-secondary)] font-medium text-[13px]">{getSector(stock.symbol)}</td>
                    <td className="py-4 px-5">
                      <SignalPill pred={stock.target_prediction} />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-2 min-w-[90px]">
                        <span className={`text-[14px] font-black tabular-nums ${
                          stock.intelligence_score >= 60 ? "text-[var(--color-bullish)]"
                          : stock.intelligence_score >= 40 ? "text-[var(--color-warning)]"
                          : "text-[var(--color-bearish)]"
                        }`}>{stock.intelligence_score}</span>
                        <ScoreBar value={stock.intelligence_score} />
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[var(--color-text-primary)] tabular-nums font-bold text-[14px]">
                      {fmtProb(stock.probability_score)}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-[11px] font-extrabold px-2 py-1 rounded-md ${
                        stock.confidence_level === "HIGH" ? "text-[var(--color-bullish)] bg-[var(--color-bullish-muted)]"
                        : stock.confidence_level === "MEDIUM" ? "text-[var(--color-warning)] bg-yellow-100"
                        : "text-[var(--color-text-secondary)] bg-gray-100"
                      }`}>{stock.confidence_level}</span>
                    </td>
                    <td className="py-4 px-5 text-[var(--color-text-primary)] tabular-nums font-bold text-[14px]">
                      {(stock.stock_historical_accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-[12px] font-bold ${
                        stock.volatility_regime === "HIGH" ? "text-[var(--color-bearish)]"
                        : stock.volatility_regime === "MEDIUM" ? "text-[var(--color-warning)]"
                        : "text-[var(--color-bullish)]"
                      }`}>{stock.volatility_regime}</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link href={`/stocks/${stock.symbol}`}
                        className="text-[12px] bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-[var(--color-text-secondary)] font-bold hover:text-[var(--color-text-primary)] hover:border-gray-400 shadow-sm whitespace-nowrap transition-all">
                        Analyse
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
        <div className="mt-6 flex justify-end">
          <p className="text-[13px] font-medium text-[var(--color-text-secondary)] bg-white px-4 py-2 border border-[var(--color-border)] rounded-xl shadow-sm">
            Showing <strong className="text-[var(--color-text-primary)]">{filtered.length}</strong> of <strong className="text-[var(--color-text-primary)]">{forecasts.length}</strong> stocks
          </p>
        </div>
      )}
    </div>
  );
}
