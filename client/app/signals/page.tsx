"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAllStocks } from "@/hooks/useSignals";
import { getSector, fmtProb } from "@/lib/api";
import type { ForecastData } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";

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
    <div className={`p-5 rounded-xl border transition-all hover:-translate-y-0.5 group ${
      up ? "border-[#00d26a]/20 bg-[#003d20]/10 hover:border-[#00d26a]/40"
      : neutral ? "border-[#1e2535] bg-[#131820] hover:border-[#2a3548]"
      : "border-[#ef4444]/20 bg-[#3d0000]/10 hover:border-[#ef4444]/40"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">
              {getSector(stock.symbol)}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              up ? "text-[#00d26a] bg-[#003d20] border-[#00d26a]/30"
              : neutral ? "text-[#6b7280] bg-[#1a1f2c] border-[#6b7280]/30"
              : "text-[#ef4444] bg-[#3d0000] border-[#ef4444]/30"
            }`}>
              {up ? "▲ BULLISH" : neutral ? "— NO SIGNAL" : "▼ BEARISH"}
            </span>
          </div>

          <Link href={`/stocks/${stock.symbol}`}
            className="text-xl font-extrabold text-white group-hover:text-[#00d26a] transition-colors">
            {stock.symbol}
          </Link>
        </div>

        {/* Score circle */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 shrink-0 ${
          up ? "border-[#00d26a]/50 text-[#00d26a]"
          : neutral ? "border-[#2a3548] text-[#6b7280]"
          : "border-[#ef4444]/50 text-[#ef4444]"
        }`}>
          {stock.intelligence_score}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[#6b7280] mb-0.5">UP Prob.</p>
          <p className="font-bold text-white">{fmtProb(stock.probability_score)}</p>
        </div>
        <div>
          <p className="text-[#6b7280] mb-0.5">Confidence</p>
          <p className={`font-bold ${
            stock.confidence_level === "HIGH" ? "text-[#00d26a]"
            : stock.confidence_level === "MEDIUM" ? "text-yellow-400"
            : "text-[#6b7280]"
          }`}>{stock.confidence_level}</p>
        </div>
        <div>
          <p className="text-[#6b7280] mb-0.5">Recent Hits</p>
          <p className="font-bold text-white">{hitRate != null ? `${hitRate}%` : "—"}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#6b7280]">AI Score</span>
          <span className="text-[10px] text-[#6b7280]">{stock.intelligence_score}/100</span>
        </div>
        <div className="h-1 bg-[#0d1117] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${
            up ? "bg-[#00d26a]" : neutral ? "bg-[#6b7280]" : "bg-[#ef4444]"
          }`} style={{ width: `${stock.intelligence_score}%` }} />
        </div>
      </div>

      {/* Signal strength */}
      <div className="mt-3 pt-3 border-t border-[#1e2535]/50 flex items-center justify-between">
        <span className="text-[11px] text-[#6b7280]">{stock.signal_strength}</span>
        <span className="text-[11px] text-[#6b7280]">{stock.volatility_regime} vol</span>
      </div>
    </div>
  );
}

export default function SignalsPage() {
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
    <div className="min-h-screen bg-[#0a0e14] px-4 md:px-8 py-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Signal Feed</h1>
          <p className="text-[#8892a4] text-sm">
            Next-day AI forecasts · Sorted by {sort === "score" ? "Intelligence Score" : "UP Probability"}
          </p>
        </div>
        <FreshnessBadge lastFetchedAt={lastFetchedAt} />
      </div>

      {error && <ErrorBanner section="signals" onRetry={refetch} />}

      {/* ── Tab + sort bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Tabs */}
        <div className="flex bg-[#131820] border border-[#1e2535] rounded-xl overflow-hidden">
          {(["ALL","BULLISH","BEARISH"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-bold transition-colors border-r last:border-r-0 border-[#1e2535] flex items-center gap-1.5 ${
                tab === t ? "bg-[#00d26a] text-[#06090d]" : "text-[#6b7280] hover:text-white"
              }`}>
              {t}
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                tab === t ? "bg-[#06090d]/20" : "bg-[#0d1117]"
              }`}>
                {t === "ALL" ? counts.all : t === "BULLISH" ? counts.bullish : counts.bearish}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6b7280]">Sort:</span>
          {(["score","prob"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                sort === s
                  ? "border-[#00d26a]/50 text-[#00d26a] bg-[#003d20]/20"
                  : "border-[#1e2535] text-[#6b7280] hover:text-white"
              }`}>
              {s === "score" ? "AI Score" : "UP Prob."}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#131820] border border-[#1e2535] rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map(s => <SignalFeedCard key={s.symbol} stock={s} />)}
          </div>
          <p className="mt-6 text-xs text-[#3a4258] text-right">
            Showing {displayed.length} of {forecasts.length} stocks
          </p>
        </>
      )}
    </div>
  );
}
