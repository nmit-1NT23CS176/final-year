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
    <div className="w-full bg-[#06090d] border-b border-[#1e2535]/60 overflow-hidden h-9 flex items-center relative z-40">
      <div className="animate-marquee text-[13px] text-[#8892a4] whitespace-nowrap font-medium flex items-center">
        {doubled.map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 px-4 border-r border-[#1e2535]/40">
            <span className="font-bold text-white">{item.label}</span>
            {item.kind === "index" ? (
              <>
                <span className="tabular-nums text-white text-[12px]">{item.price}</span>
                <span className={`text-[11px] font-bold ${item.isUp ? "text-[#00d26a]" : "text-[#ef4444]"}`}>
                  {item.change} {item.isUp ? "🟢" : "🔴"}
                </span>
              </>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                item.isUp ? "bg-[#003d20] text-[#00d26a]" : "bg-[#3d0000] text-[#ef4444]"
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

