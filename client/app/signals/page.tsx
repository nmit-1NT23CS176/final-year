"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";
import { Activity, TrendingUp, TrendingDown, Minus, Filter, ArrowDownUp } from "lucide-react";

type Tab = "ALL" | "BULLISH" | "BEARISH";

function SignalFeedCard({ stock }: { stock: ForecastData }) {
  const up = stock.target_prediction === 1;
  const neutral = stock.target_prediction === -1;
  const hitRate = (() => {
    const h = stock.prediction_history?.filter(p => p.result === "HIT").length ?? 0;
    const t = stock.prediction_history?.length ?? 0;
    return t ? Math.round((h / t) * 100) : null;
  })();

  return (
    <div className={`bg-white p-5 rounded-2xl border transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group ${
      up ? "border-[var(--color-border)] hover:border-[var(--color-bullish)]"
      : neutral ? "border-[var(--color-border)] hover:border-gray-400"
      : "border-[var(--color-border)] hover:border-[var(--color-bearish)]"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
              {getSector(stock.symbol)}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              up ? "text-[var(--color-bullish)] bg-[var(--color-bullish-muted)] border border-[var(--color-bullish-muted)]"
              : neutral ? "text-gray-600 bg-gray-100 border border-gray-200"
              : "text-[var(--color-bearish)] bg-[var(--color-bearish-muted)] border border-[var(--color-bearish-muted)]"
            }`}>
              {up ? <TrendingUp className="w-3 h-3" /> : neutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {up ? "BULLISH" : neutral ? "NO SIGNAL" : "BEARISH"}
            </span>
          </div>

          <Link href={`/stocks/${stock.symbol}`}
            className="text-xl font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors tracking-tight">
            {stock.symbol}
          </Link>
        </div>

        {/* Score circle */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 shrink-0 ${
          up ? "border-[var(--color-bullish-muted)] text-[var(--color-bullish)] bg-[var(--color-bullish-muted)]/30"
          : neutral ? "border-gray-200 text-gray-500 bg-gray-50"
          : "border-[var(--color-bearish-muted)] text-[var(--color-bearish)] bg-[var(--color-bearish-muted)]/30"
        }`}>
          {stock.intelligence_score}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-xs bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">UP Prob.</p>
          <p className="font-bold text-[var(--color-text-primary)] tabular-nums">{fmtProb(stock.probability_score)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Confidence</p>
          <p className={`font-bold ${
            stock.confidence_level === "HIGH" ? "text-[var(--color-bullish)]"
            : stock.confidence_level === "MEDIUM" ? "text-[var(--color-warning)]"
            : "text-[var(--color-text-secondary)]"
          }`}>{stock.confidence_level}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Recent Hits</p>
          <p className="font-bold text-[var(--color-text-primary)] tabular-nums">{hitRate != null ? `${hitRate}%` : "—"}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">AI Score</span>
          <span className="text-[11px] font-bold text-[var(--color-text-primary)] tabular-nums">{stock.intelligence_score}/100</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${
            up ? "bg-[var(--color-bullish)]" : neutral ? "bg-gray-400" : "bg-[var(--color-bearish)]"
          }`} style={{ width: `${stock.intelligence_score}%` }} />
        </div>
      </div>

      {/* Signal strength */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{stock.signal_strength}</span>
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{stock.volatility_regime} vol</span>
      </div>
    </div>
  );
}

import { Suspense } from 'react';

function SignalsPageContent() {
  const { forecasts, loading, error, lastFetchedAt, refetch } = useAllStocks(300_000);
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [tab, setTab] = useState<Tab>("ALL");
  const [sort, setSort] = useState<"score" | "prob">("score");

  useEffect(() => {
    if (filterParam === "bullish") setTab("BULLISH");
    else if (filterParam === "bearish") setTab("BEARISH");
    else setTab("ALL");
  }, [filterParam]);

  const displayed = useMemo(() => {
    let data = [...forecasts];

    if (tab === "BULLISH") data = data.filter(f => f.target_prediction === 1);
    else if (tab === "BEARISH") data = data.filter(f => f.target_prediction === 0);

    data.sort((a, b) =>
      sort === "score"
        ? b.intelligence_score - a.intelligence_score
        : b.probability_score - a.probability_score
    );
    return data;
  }, [forecasts, tab, sort]);

  const counts = {
    all: forecasts.length,
    bullish: forecasts.filter(f => f.target_prediction === 1).length,
    bearish: forecasts.filter(f => f.target_prediction === 0).length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1200px] mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight flex items-center gap-2">
            <Activity className="w-8 h-8 text-[var(--color-accent)]" />
            AI Signal Feed
          </h1>
          <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">
            Next-day AI forecasts based on deep sequence models.
          </p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="signals" onRetry={refetch} />}

      {/* ── Tab + sort bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          {(["ALL","BULLISH","BEARISH"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-[13px] font-bold transition-colors border-r last:border-r-0 border-[var(--color-border)] flex items-center gap-2 ${
                tab === t ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50"
              }`}>
              {t}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {t === "ALL" ? counts.all : t === "BULLISH" ? counts.bullish : counts.bearish}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-white px-1.5 py-1.5 rounded-xl border border-[var(--color-border)] shadow-sm">
          <div className="pl-3 pr-2 text-[12px] font-semibold text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <ArrowDownUp className="w-3.5 h-3.5" />
            Sort by:
          </div>
          {(["score","prob"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-4 py-1.5 rounded-lg transition-colors text-[13px] font-bold ${
                sort === s
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50"
              }`}>
              {s === "score" ? "AI Score" : "UP Prob."}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl h-56 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map(s => <SignalFeedCard key={s.symbol} stock={s} />)}
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">
              Showing {displayed.length} of {forecasts.length} total signals generated for this session.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function SignalsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[var(--color-text-secondary)] font-medium">Loading AI signals...</div>}>
      <SignalsPageContent />
    </Suspense>
  );
}
