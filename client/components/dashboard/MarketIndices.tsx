"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const MOCK_INDICES: IndexData[] = [
  { name: "NIFTY 50", value: 22450.30, change: 189.45, changePercent: 0.85 },
  { name: "SENSEX", value: 73850.75, change: 528.60, changePercent: 0.72 },
  { name: "BANK NIFTY", value: 48920.10, change: -120.40, changePercent: -0.25 },
  { name: "NASDAQ", value: 16420.50, change: 210.80, changePercent: 1.30 },
  { name: "S&P 500", value: 5240.20, change: 45.30, changePercent: 0.87 },
  { name: "Bitcoin", value: 5432040.00, change: -12540.00, changePercent: -0.23 },
];

interface MarketIndicesProps {
  indices?: IndexData[];
  className?: string;
}

export function MarketIndices({ indices, className }: MarketIndicesProps) {
  const displayIndices = indices || MOCK_INDICES;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {displayIndices.map((index) => {
          const isUp = index.change >= 0;
          return (
            <div
              key={index.name}
              className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-elevated)] transition-colors duration-150 cursor-pointer shadow-sm"
            >
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider whitespace-nowrap">
                  {index.name}
                </p>
                <p className="text-sm font-bold tabular-nums text-[var(--color-text-primary)] whitespace-nowrap">
                  {index.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap ${
                  isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isUp ? "+" : ""}{index.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
