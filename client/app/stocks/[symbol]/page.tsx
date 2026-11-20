"use client";

import { use } from "react";
import Link from "next/link";
import { useForecast } from "@/hooks/useSignals";
import { getSector, getCap, fmtProb, directionIcon } from "@/lib/api";
import type { PredictionHistory, ReasonBreakdown } from "@/lib/api";
import { SkeletonStatCard, ErrorBanner } from "@/components/shared/FeedbackUI";

// ── Confidence ring ─────────────────────────────────────
function ConfidenceRing({ score }: { score: number }) {
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 60 ? "#00d26a" : score >= 40 ? "#facc15" : "#ef4444";
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width={112} height={112} className="-rotate-90">
        <circle cx={56} cy={56} r={radius} fill="none" stroke="#1e2535" strokeWidth={8} />
        <circle
          cx={56} cy={56} r={radius} fill="none"
          stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 0.7s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black" style={{ color }}>{score}</div>
        <div className="text-[10px] text-[#6b7280]">AI Score</div>
      </div>
    </div>
  );
}

// ── Reason breakdown row ────────────────────────────────
function ReasonRow({ r }: { r: ReasonBreakdown }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[#1e2535]/60 last:border-b-0">
      <span className="text-lg shrink-0 mt-0.5">{directionIcon(r.direction)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <p className="text-sm font-semibold text-white truncate">{r.category}</p>
          <span className={`text-[10px] font-bold shrink-0 ${
            r.direction === "POSITIVE" ? "text-[#00d26a]" : r.direction === "NEGATIVE" ? "text-[#ef4444]" : "text-yellow-400"
          }`}>{r.status}</span>
        </div>
        <p className="text-xs text-[#8892a4]">{r.value}</p>
        <p className="text-[11px] text-[#6b7280] mt-1">{r.explanation}</p>
      </div>
    </div>
  );
}

// ── Prediction history row ──────────────────────────────
function HistoryRow({ h }: { h: PredictionHistory }) {
  const hit = h.result === "HIT";
  return (
    <tr className="border-b border-[#1e2535]/50 text-sm hover:bg-[#0d1117]/30 transition-colors">
      <td className="py-3 px-4 text-[#8892a4] tabular-nums font-mono">{h.date}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
          h.predicted === "UPTREND" ? "text-[#00d26a]" : "text-[#ef4444]"
        }`}>
          {h.predicted === "UPTREND" ? "▲ UPTREND" : "▼ DOWNTREND"}
        </span>
      </td>
      <td className="py-3 px-4 text-white font-medium tabular-nums">{Math.round(h.probability * 100)}%</td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold ${h.actual === "UP" ? "text-[#00d26a]" : "text-[#ef4444]"}`}>
          {h.actual === "UP" ? "▲ UP" : "▼ DOWN"}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          hit ? "bg-[#003d20] text-[#00d26a]" : "bg-[#3d0000] text-[#ef4444]"
        }`}>{h.result}</span>
      </td>
    </tr>
  );
}

// ── Stat card ───────────────────────────────────────────
function StatCard({ label, value, sub, color = "text-white" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-[#0d1117] border border-[#1e2535] rounded-xl p-4">
      <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-[#6b7280] mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────
export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const sym = symbol.toUpperCase();
  const { data, loading, error } = useForecast(sym);

  const signalColor = data
    ? data.target_prediction === 1 ? "#00d26a"
      : data.target_prediction === 0 ? "#ef4444"
      : "#6b7280"
    : "#6b7280";

  const signalLabel = data
    ? data.target_prediction === 1 ? "BULLISH"
      : data.target_prediction === 0 ? "BEARISH"
      : "NO SIGNAL"
    : "LOADING";

  return (
    <div className="min-h-screen bg-[#0a0e14]">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-[#06090d]/90 backdrop-blur-md border-b border-[#1e2535] px-6 py-3 flex items-center gap-4">
        <Link href="/stocks" className="text-[#6b7280] hover:text-white text-sm flex items-center gap-1.5 transition-colors">
          ← Stocks
        </Link>
        <span className="text-[#1e2535]">/</span>
        <span className="text-white font-bold">{sym}</span>
        {data && (
          <>
            <span className="text-[#1e2535]">·</span>
            <span className="text-[11px] text-[#6b7280]">{getSector(sym)} · {getCap(sym)}</span>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {error && <ErrorBanner section={`forecast for ${sym}`} />}

        {/* ── Hero row ── */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
          {/* Left: ID block */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                {getSector(sym)} · {getCap(sym)}
              </span>
              {loading ? (
                <div className="h-5 w-20 bg-[#1e2535] rounded-full animate-pulse" />
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    color: signalColor,
                    borderColor: `${signalColor}40`,
                    background: `${signalColor}15`,
                  }}>
                  {signalLabel}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-1">{sym}</h1>
            {data && (
              <p className="text-[#8892a4] text-sm">
                Prediction as of {data.date} · {data.model_used}
              </p>
            )}
          </div>

          {/* Right: Confidence ring + trend label */}
          {loading ? (
            <SkeletonStatCard />
          ) : data ? (
            <div className="flex items-center gap-6">
              <ConfidenceRing score={data.intelligence_score} />
              <div>
                <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Signal Strength</p>
                <p className="text-lg font-bold text-white">{data.signal_strength}</p>
                <p className="text-[11px] text-[#6b7280] mt-1">{data.calibration_status}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)
          ) : data ? (
            <>
              <StatCard label="UP Probability" value={fmtProb(data.probability_score)} color={data.target_prediction === 1 ? "text-[#00d26a]" : "text-[#ef4444]"} />
              <StatCard label="Confidence" value={data.confidence_level} sub={`${data.confidence_score.toFixed(0)}%`} />
              <StatCard label="Volatility" value={data.volatility_regime} />
              <StatCard label="30d Accuracy" value={`${(data.historical_30d_accuracy * 100).toFixed(1)}%`} />
              <StatCard label="90d Accuracy" value={`${(data.historical_90d_accuracy * 100).toFixed(1)}%`} />
              <StatCard label="Stock Acc." value={`${(data.stock_historical_accuracy * 100).toFixed(1)}%`} sub="Historical" />
            </>
          ) : null}
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Reason Breakdown ── */}
            <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00d26a]">⚡</span> Why This Signal?
              </h2>
              <div>
                {data.reasons_breakdown.map((r, i) => (
                  <ReasonRow key={i} r={r} />
                ))}
              </div>
            </div>

            {/* ── Prediction History ── */}
            <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00d26a]">📋</span> Prediction History
              </h2>
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] text-[#6b7280] uppercase tracking-wider border-b border-[#1e2535]">
                      <th className="text-left py-2.5 px-4 font-semibold">Date</th>
                      <th className="text-left py-2.5 px-4 font-semibold">Predicted</th>
                      <th className="text-left py-2.5 px-4 font-semibold">Prob.</th>
                      <th className="text-left py-2.5 px-4 font-semibold">Actual</th>
                      <th className="text-left py-2.5 px-4 font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.prediction_history.map((h, i) => (
                      <HistoryRow key={i} h={h} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hit rate summary */}
              <div className="mt-4 pt-4 border-t border-[#1e2535] flex gap-6">
                {(() => {
                  const hits = data.prediction_history.filter(h => h.result === "HIT").length;
                  const total = data.prediction_history.length;
                  return (
                    <>
                      <div>
                        <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">Recent Hit Rate</p>
                        <p className="text-lg font-bold text-[#00d26a]">{total ? Math.round((hits / total) * 100) : 0}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">Hits / Misses</p>
                        <p className="text-lg font-bold text-white">{hits} / {total - hits}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* ── Model Info ── */}
            <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00d26a]">🧠</span> Model Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Model Used</p>
                  <p className="text-sm font-semibold text-white leading-snug">{data.model_used}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Acc. Benchmark</p>
                  <p className="text-sm font-bold text-white">{(data.accuracy_benchmark * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">F1 Benchmark</p>
                  <p className="text-sm font-bold text-white">{(data.f1_benchmark * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">OOS ROC-AUC</p>
                  <p className="text-sm font-bold text-white">{(data.historical_roc_auc * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Calibration</p>
                  <p className="text-sm font-semibold text-[#00d26a] leading-snug">{data.calibration_status}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">OOS Accuracy</p>
                  <p className="text-sm font-bold text-white">{(data.historical_oos_accuracy * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
