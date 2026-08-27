"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useSignalsSummary } from "@/hooks/useSignals";
import { MARKET_INDICES, fmtProb, getSector, signalLabel } from "@/lib/api";
import { SkeletonSignalCard, ErrorBanner, FreshnessBadge } from "@/components/shared/FeedbackUI";
import { SearchBar } from "@/components/stocks/SearchBar";

// ── Icon components ──────────────────────────────────────
function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      className={`w-4 h-4 ${up ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
      {up ? (
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      ) : (
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      )}
    </svg>
  );
}

function MiniSparkline({ up }: { up: boolean }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {up ? (
        <>
          <path d="M2 16L15 10L25 12L45 4L58 2" stroke="var(--color-bullish)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 16L15 10L25 12L45 4L58 2V20H2V16Z" fill="url(#paint0_linear_up)" opacity="0.1"/>
          <defs>
            <linearGradient id="paint0_linear_up" x1="30" y1="2" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-bullish)"/>
              <stop offset="1" stopColor="var(--color-bullish)" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </>
      ) : (
        <>
          <path d="M2 4L15 12L25 10L45 16L58 18" stroke="var(--color-bearish)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 4L15 12L25 10L45 16L58 18V20H2V4Z" fill="url(#paint0_linear_down)" opacity="0.1"/>
          <defs>
            <linearGradient id="paint0_linear_down" x1="30" y1="4" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-bearish)"/>
              <stop offset="1" stopColor="var(--color-bearish)" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
}

// ── Market snapshot card ─────────────────────────────────
function IndexCard({ label, price, change, changePct, isUp }: typeof MARKET_INDICES[0]) {
  return (
    <div className="flex-1 min-w-[220px] bg-white border border-[var(--color-border)] rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:shadow-soft transition-all cursor-pointer">
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{label}</p>
        <MiniSparkline up={isUp} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">{price}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <TrendIcon up={isUp} />
          <span className={`text-sm font-medium ${isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
            {change} ({changePct})
          </span>
        </div>
      </div>
    </div>
  );
}

// ── AI Signal card ───────────────────────────────────────
function SignalCard({ stock }: { stock: import("@/lib/api").ForecastData }) {
  const sig = signalLabel(stock.target_prediction);
  const up = stock.target_prediction === 1;

  return (
    <Link href={`/stocks/${stock.symbol}`} className="block group">
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex flex-col gap-4 shadow-card hover:shadow-soft hover:border-[var(--color-bullish)] transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{stock.symbol}</h3>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              {getSector(stock.symbol)}
            </span>
          </div>
          <div className={`shrink-0 px-2.5 py-1 rounded-md border text-[11px] font-bold flex items-center gap-1 ${
            up 
              ? 'bg-[var(--color-bullish-muted)] text-[var(--color-bullish)] border-[var(--color-bullish)]/20' 
              : stock.target_prediction === 0 
                ? 'bg-[var(--color-bearish-muted)] text-[var(--color-bearish)] border-[var(--color-bearish)]/20'
                : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            <TrendIcon up={up} />
            {sig}
          </div>
        </div>

        {/* Prediction Stats */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium uppercase tracking-wider mb-1">AI Probability</p>
            <p className="text-xl font-extrabold text-[var(--color-text-primary)] tabular-nums">{fmtProb(stock.probability_score)}</p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium uppercase tracking-wider mb-1">Confidence</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{stock.confidence_level}</p>
          </div>
        </div>

        {/* AI Score Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-[var(--color-text-secondary)]">StockVista Score</span>
            <span className="font-bold">{stock.intelligence_score}/100</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${up ? 'bg-[var(--color-bullish)]' : stock.target_prediction === 0 ? 'bg-[var(--color-bearish)]' : 'bg-gray-400'}`}
              style={{ width: `${stock.intelligence_score}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Homepage ─────────────────────────────────────────────
export default function HomePage() {
  const { data, loading, error, refetch } = useSignalsSummary(300_000);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* ── Hero / Search Section ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 bg-white border-b border-[var(--color-border)]">
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto w-full">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] mb-6">
            Invest smarter.<br/>
            Understand markets <span className="text-[var(--color-accent)]">better.</span>
          </h1>

          <p className="text-[var(--color-text-secondary)] text-lg max-w-xl leading-relaxed mb-10 font-medium">
            AI-powered stock analysis and forecasting built on ensemble learning and deep sequence models.
          </p>

          <div className="w-full max-w-2xl relative shadow-soft rounded-2xl bg-white group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors" />
            </div>
            <SearchBar 
              variant="hero" 
              className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-[var(--color-border)] text-lg focus-within:border-[var(--color-accent)] focus-within:ring-4 focus-within:ring-[var(--color-accent)]/10 transition-all outline-none placeholder:text-gray-400 font-medium bg-transparent shadow-none" 
              placeholder="Search stocks, companies & ETFs..."
            />
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
            Trending: 
            {['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'].map(t => (
              <Link key={t} href={`/stocks/${t}`} className="px-3 py-1 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)]">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Snapshot ── */}
      <section className="px-6 py-12 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-wrap gap-4">
          {MARKET_INDICES.map(idx => (
            <IndexCard key={idx.label} {...idx} />
          ))}
        </div>
      </section>

      {/* ── Top AI Insights ── */}
      <section className="px-6 pb-20 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Top AI Forecasts</h2>
            <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Highest conviction signals generated for the next trading session.</p>
          </div>
          <Link href="/stocks" className="text-[var(--color-accent)] font-semibold hover:text-[var(--color-accent-hover)] flex items-center gap-1 group">
            Explore All Stocks <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {error && !data.allStocks.length && (
          <ErrorBanner section="signals" onRetry={refetch} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonSignalCard key={i} />)
            : data.allStocks.slice(0, 8).map(s => <SignalCard key={s.symbol} stock={s} />)
          }
        </div>
      </section>
      
      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-[var(--color-border)] bg-white py-10 px-6 text-center">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--color-bullish)] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SV</span>
            </div>
            <span className="font-bold text-gray-900">StockVista</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Financial Market Trend Forecasting using Deep Sequence Models.</p>
        </div>
      </footer>
    </div>
  );
}
