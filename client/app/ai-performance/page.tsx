"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { ModelMetric } from "@/lib/api";
import { FreshnessBadge, ErrorBanner } from "@/components/shared/FeedbackUI";

function MetricBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  const color = pct >= 55 ? "bg-[#00d26a]" : pct >= 50 ? "bg-yellow-400" : "bg-[#ef4444]";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${pct >= 55 ? "text-[#00d26a]" : pct >= 50 ? "text-yellow-400" : "text-[#ef4444]"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ModelCard({ m, rank }: { m: ModelMetric; rank: number }) {
  const f1Pct = Math.round(m.f1_score * 100);
  return (
    <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6 flex flex-col gap-5 hover:border-[#2a3548] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">
            #{rank} · Model Family
          </div>
          <h3 className="text-lg font-bold text-white">{m.model_name}</h3>
        </div>
        <div className="text-center shrink-0">
          <div className={`text-3xl font-extrabold tabular-nums ${f1Pct >= 60 ? "text-[#00d26a]" : f1Pct >= 55 ? "text-yellow-400" : "text-[#ef4444]"}`}>
            {f1Pct}<span className="text-base text-[#6b7280]">%</span>
          </div>
          <div className="text-[10px] text-[#6b7280] uppercase tracking-wider mt-0.5">F1 Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <MetricBar value={m.accuracy}  label="Accuracy"  />
        <MetricBar value={m.precision} label="Precision" />
        <MetricBar value={m.recall}    label="Recall"    />
        <MetricBar value={m.roc_auc}   label="ROC-AUC"   />
      </div>
    </div>
  );
}

// Explanation table
const METRIC_DEFS = [
  { name: "Accuracy",  desc: "Fraction of all predictions (UP+DOWN) that were correct." },
  { name: "Precision", desc: "Of all stocks predicted UP, how many actually went UP." },
  { name: "Recall",    desc: "Of all stocks that actually went UP, how many did we catch." },
  { name: "F1 Score",  desc: "Harmonic mean of Precision and Recall — primary ranking metric." },
  { name: "ROC-AUC",   desc: "Area Under the Receiver Operating Curve. 0.5 = random, 1.0 = perfect." },
];

export default function AIPerformancePage() {
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  async function doFetch() {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: ModelMetric[] }>("/api/v1/model-metrics");
      const sorted = [...res.data].sort((a, b) => b.f1_score - a.f1_score);
      setMetrics(sorted);
      setLastFetchedAt(new Date());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { doFetch(); }, []);

  const best = metrics[0];

  return (
    <div className="min-h-screen bg-[#0a0e14] px-4 md:px-8 py-10 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">AI Model Performance</h1>
            <p className="text-[#8892a4] text-sm">
              Step 9 Evaluation — All model families ranked by F1 score
            </p>
          </div>
          <FreshnessBadge lastFetchedAt={lastFetchedAt} />
        </div>

        {/* Leading model banner */}
        {best && !loading && (
          <div className="mt-4 p-4 rounded-xl bg-[#003d20]/30 border border-[#00d26a]/30 flex items-center gap-4">
            <span className="text-[#00d26a] text-xl">🏆</span>
            <div>
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider">Best Model by F1</p>
              <p className="text-white font-bold">{best.model_name}
                <span className="text-[#00d26a] ml-2">{(best.f1_score * 100).toFixed(1)}% F1</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <ErrorBanner section="model metrics" onRetry={doFetch} />}

      {/* ── Model cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6 h-60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {metrics.map((m, i) => <ModelCard key={m.model_name} m={m} rank={i + 1} />)}
        </div>
      )}

      {/* ── Comparison table ── */}
      {!loading && metrics.length > 0 && (
        <div className="bg-[#131820] border border-[#1e2535] rounded-2xl overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-[#1e2535]">
            <h2 className="text-base font-bold text-white">Side-by-Side Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-[#6b7280] uppercase tracking-wider border-b border-[#1e2535]">
                  <th className="text-left py-3 px-6 font-semibold">Model</th>
                  <th className="py-3 px-4 font-semibold">Accuracy</th>
                  <th className="py-3 px-4 font-semibold">Precision</th>
                  <th className="py-3 px-4 font-semibold">Recall</th>
                  <th className="py-3 px-4 font-semibold">F1</th>
                  <th className="py-3 px-4 font-semibold">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => (
                  <tr key={m.model_name}
                    className={`border-b border-[#1e2535]/50 ${i === 0 ? "bg-[#003d20]/10" : ""}`}>
                    <td className="py-4 px-6 font-semibold text-white">
                      {i === 0 && <span className="text-[#00d26a] mr-2">🏆</span>}
                      {m.model_name}
                    </td>
                    {[m.accuracy, m.precision, m.recall, m.f1_score, m.roc_auc].map((v, j) => (
                      <td key={j} className={`py-4 px-4 tabular-nums font-medium text-center ${
                        v >= 0.55 ? "text-[#00d26a]" : v >= 0.50 ? "text-yellow-400" : "text-[#ef4444]"
                      }`}>
                        {(v * 100).toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Metric definitions ── */}
      <div className="bg-[#131820] border border-[#1e2535] rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-5">Metric Definitions</h2>
        <div className="flex flex-col gap-3">
          {METRIC_DEFS.map(d => (
            <div key={d.name} className="flex gap-4 py-3 border-b border-[#1e2535]/50 last:border-b-0">
              <span className="text-[#00d26a] font-bold text-sm w-24 shrink-0">{d.name}</span>
              <span className="text-[#8892a4] text-sm">{d.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="mt-8 text-[11px] text-[#3a4258] text-center leading-relaxed">
        Metrics reported from out-of-sample (OOS) evaluation on held-out test period.
        Past model accuracy does not guarantee future prediction performance.
      </p>
    </div>
  );
}
