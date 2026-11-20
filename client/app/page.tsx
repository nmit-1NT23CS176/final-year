"use client";

import Link from "next/link";
import { useSignalsSummary } from "@/hooks/useSignals";
import { MARKET_INDICES, fmtProb, getSector, signalLabel } from "@/lib/api";
import { SkeletonSignalCard, ErrorBanner, FreshnessBadge } from "@/components/shared/FeedbackUI";

// ── Icon components ──────────────────────────────────────
function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      className={`w-5 h-5 ${up ? "text-[#00d26a]" : "text-[#ef4444]"}`}>
      {up ? (
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      ) : (
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      )}
    </svg>
  );
}

// ── Signal badge ─────────────────────────────────────────
function SignalBadge({ signal }: { signal: string }) {
  const map = {
    BULLISH: "bg-[#003d20] text-[#00d26a] border border-[#00d26a]/30",
    BEARISH: "bg-[#3d0000] text-[#ef4444] border border-[#ef4444]/30",
    "NO SIGNAL": "bg-[#1a1f2c] text-[#6b7280] border border-[#6b7280]/30",
  } as Record<string, string>
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${map[signal] ?? map["NO SIGNAL"]}`}>
      {signal}
    </span>
  );
}

// ── Market snapshot card ─────────────────────────────────
function IndexCard({ label, price, change, changePct, isUp }: typeof MARKET_INDICES[0]) {
  return (
    <div className="flex-1 min-w-[140px] bg-[#131820] border border-[#1e2535] rounded-xl p-4 flex flex-col gap-2 transition-all hover:border-[#2a3548]">
      <p className="text-[11px] text-[#6b7280] font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-white tabular-nums">{price}</p>
      <div className="flex items-center gap-1.5">
        <TrendIcon up={isUp} />
        <span className={`text-sm font-semibold ${isUp ? "text-[#00d26a]" : "text-[#ef4444]"}`}>
          {change} ({changePct})
        </span>
      </div>
    </div>
  );
}

// ── AI Signal card ───────────────────────────────────────
function SignalCard({ stock }: { stock: import("@/lib/api").ForecastData }) {
  const sig = signalLabel(stock.target_prediction);
  const up = stock.target_prediction === 1;

  return (
    <div className="bg-[#131820] border border-[#1e2535] rounded-xl p-5 flex flex-col gap-4
      hover:border-[#2a3548] transition-all group hover:-translate-y-0.5">
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[#6b7280] font-medium uppercase tracking-wider">
              {getSector(stock.symbol)}
            </span>
            <SignalBadge signal={sig} />
          </div>
          <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
        </div>
        <div className="shrink-0 w-9 h-9 rounded-full bg-[#0d1117] border border-[#1e2535] flex items-center justify-center">
          <TrendIcon up={up} />
        </div>
      </div>

      {/* model */}
      <p className="text-[11px] text-[#6b7280] truncate">
        {stock.model_used}
      </p>

      {/* score bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[#6b7280] font-medium">AI Score</span>
          <span className={`text-base font-bold tabular-nums ${up ? "text-[#00d26a]" : stock.target_prediction === 0 ? "text-[#ef4444]" : "text-[#6b7280]"}`}>
            {stock.intelligence_score}<span className="text-[11px] text-[#6b7280]">/100</span>
          </span>
        </div>
        <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${up ? "bg-[#00d26a]" : stock.target_prediction === 0 ? "bg-[#ef4444]" : "bg-[#6b7280]"}`}
            style={{ width: `${stock.intelligence_score}%` }}
          />
        </div>
      </div>

      {/* stats row */}
      <div className="pt-3 border-t border-[#1e2535] grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">Confidence</p>
          <p className="text-sm font-semibold text-white">{stock.confidence_level}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">UP Probability</p>
          <p className="text-sm font-semibold text-white">{fmtProb(stock.probability_score)}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">Stock Accuracy</p>
          <p className="text-sm font-semibold text-white">{(stock.stock_historical_accuracy * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-0.5">Volatility</p>
          <p className="text-sm font-semibold text-white">{stock.volatility_regime}</p>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/stocks/${stock.symbol}`}
        className="mt-1 py-2 text-center text-xs font-semibold text-[#00d26a] border border-[#00d26a]/30 rounded-lg
        hover:bg-[#00d26a]/10 transition-all">
        Deep Analysis →
      </Link>
    </div>
  );
}

// ── Homepage ─────────────────────────────────────────────
export default function HomePage() {
  const { data, loading, error, refetch } = useSignalsSummary(300_000);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center
        px-6 py-28 bg-[#0a0e14] overflow-hidden">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[700px] h-[500px] rounded-full bg-[#00d26a]/8 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <div className="mb-5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase
            border border-[#00d26a]/30 text-[#00d26a] bg-[#00d26a]/10 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d26a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d26a]" />
            </span>
            AI-Powered · NSE Market · {data.total > 0 ? `${data.total} Signals Active` : "Live Signals"}
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-none tracking-tight text-white mb-4">
            Predict Tomorrow&apos;s{" "}
            <span className="text-[#00d26a]">Market Move</span>
          </h1>

          <p className="text-[#8892a4] text-lg max-w-xl leading-relaxed mb-8">
            Machine learning models analyse NSE stocks overnight and generate next-day UP/DOWN forecasts.
            Track signals, dig into model performance, and understand exactly why each call was made.
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/stocks"
              className="px-7 py-3.5 bg-[#00d26a] text-[#06090d] font-bold text-sm rounded-xl
              hover:bg-[#00b85c] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#00d26a]/20">
              View All Signals
            </Link>
            <Link href="/ai-performance"
              className="px-7 py-3.5 border border-[#2a3548] text-white font-semibold text-sm rounded-xl
              hover:bg-[#131820] transition-all">
              Model Performance
            </Link>
          </div>
        </div>
      </section>

      {/* ── Market Snapshot ── */}
      <section className="px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-semibold text-[#8892a4] uppercase tracking-widest">Market Snapshot</h2>
          <div className="h-px flex-1 bg-[#1e2535]" />
          <span className="text-[11px] text-[#6b7280]">NSE · {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {MARKET_INDICES.map(idx => (
            <IndexCard key={idx.label} {...idx} />
          ))}
        </div>
      </section>

      {/* ── Signal Stats ── */}
      <section className="px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bullish Calls", value: loading ? "—" : String(data.bullishCount), color: "text-[#00d26a]" },
            { label: "Bearish Calls", value: loading ? "—" : String(data.bearishCount), color: "text-[#ef4444]" },
            { label: "No Signal",     value: loading ? "—" : String(data.noSignalCount), color: "text-[#8892a4]" },
            { label: "Total Analysed",value: loading ? "—" : String(data.total),        color: "text-white" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#131820] border border-[#1e2535] rounded-xl p-5 text-center">
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-3xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Signal Cards ── */}
      <section className="px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-semibold text-[#8892a4] uppercase tracking-widest">Featured Signals</h2>
          <div className="h-px flex-1 bg-[#1e2535]" />
          <FreshnessBadge lastFetchedAt={data.lastFetchedAt} />
        </div>

        {error && !data.allStocks.length && (
          <ErrorBanner section="signals" onRetry={refetch} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonSignalCard key={i} />)
            : data.allStocks.slice(0, 8).map(s => <SignalCard key={s.symbol} stock={s} />)
          }
        </div>

        {!loading && data.total > 8 && (
          <div className="mt-8 text-center">
            <Link href="/stocks"
              className="px-6 py-3 border border-[#2a3548] text-white font-medium text-sm rounded-xl
              hover:bg-[#131820] transition-all inline-flex items-center gap-2">
              View All {data.total > 0 ? `${data.total}+ ` : ""}Signals →
            </Link>
          </div>
        )}
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-16 border-t border-[#1e2535] bg-[#0d1117]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-[#8892a4]">
              Multi-model ensemble trained on 5 years of NSE data, predicting next-day direction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Feature Engineering",
                desc: "RSI, MACD, NIFTY benchmark, VIX, S&P 500 proxy, and daily returns feed into each model.",
                color: "text-[#00d26a]",
              },
              {
                step: "02",
                title: "Volatility-Aware Ensemble",
                desc: "Models are selected dynamically (XGBoost in low vol, Transformer/LSTM ensemble in medium-high).",
                color: "text-[#00d26a]",
              },
              {
                step: "03",
                title: "Calibrated Signals",
                desc: "Isotonic calibration on validation set ensures probability scores reflect true accuracy rates.",
                color: "text-[#00d26a]",
              },
            ].map(item => (
              <div key={item.step} className="bg-[#131820] border border-[#1e2535] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl font-black opacity-5 text-white select-none">
                  {item.step}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${item.color}`}>{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#8892a4] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="px-6 py-16 bg-[#06090d] border-t border-[#1e2535]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to explore the signals?
          </h2>
          <p className="text-[#8892a4] mb-8">
            All 96 NSE stocks, three model families, full prediction history.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/stocks"
              className="px-7 py-3.5 bg-[#00d26a] text-[#06090d] font-bold text-sm rounded-xl
              hover:bg-[#00b85c] transition-all hover:-translate-y-0.5">
              Browse Stocks
            </Link>
            <Link href="/ai-performance"
              className="px-7 py-3.5 border border-[#2a3548] text-white font-semibold text-sm rounded-xl
              hover:bg-[#131820] transition-all">
              Model Metrics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
