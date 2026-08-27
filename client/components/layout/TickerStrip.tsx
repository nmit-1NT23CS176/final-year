"use client";

import { useTickerStocks } from "@/hooks/useSignals";
import { MARKET_INDICES } from "@/lib/api";

type IndexItem = { kind: "index"; label: string; price: string; change: string; isUp: boolean };
type StockItem = { kind: "stock"; label: string; score: string; isUp: boolean };
type TickerItem = IndexItem | StockItem;

export function TickerStrip() {
  const { stocks } = useTickerStocks(60_000);

  const indexItems: TickerItem[] = MARKET_INDICES.map(idx => ({
    kind: "index" as const,
    label: idx.label,
    price: idx.price,
    change: idx.changePct,
    isUp: idx.isUp,
  }));

  const stockItems: TickerItem[] = stocks.map(f => ({
    kind: "stock" as const,
    label: f.symbol,
    score: `${f.intelligence_score}/100`,
    isUp: f.target_prediction === 1,
  }));

  const allItems = [...indexItems, ...stockItems];
  const doubled = [...allItems, ...allItems];

  return (
    <div className="w-full bg-[var(--color-background)] border-b border-[var(--color-border)] overflow-hidden h-9 flex items-center relative z-40">
      <div className="animate-marquee text-[13px] text-[var(--color-text-secondary)] whitespace-nowrap font-medium flex items-center">
        {doubled.map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 px-4 border-r border-[var(--color-border)]">
            <span className="font-bold text-[var(--color-text-primary)]">{item.label}</span>
            {item.kind === "index" ? (
              <>
                <span className="tabular-nums text-[var(--color-text-primary)] text-[12px]">{item.price}</span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${item.isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                  {item.change} {item.isUp ? "🟢" : "🔴"}
                </span>
              </>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                item.isUp ? "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]" : "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]"
              }`}>
                {item.isUp ? "▲" : "▼"} {item.score}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

