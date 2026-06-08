"use client";

import { Card, CardContent } from "@/components/ui/card";
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
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 px-1">
        Market Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayIndices.map((index) => {
          const isUp = index.change >= 0;
          return (
            <Card
              key={index.name}
              className="bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-elevated)] transition-colors cursor-pointer group"
            >
              <CardContent className="p-3">
                <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 truncate group-hover:text-[var(--color-text-primary)] transition-colors">
                  {index.name}
                </p>
                <div className="text-sm font-bold tracking-tight tabular-nums truncate">
                  {index.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium mt-1 ${
                    isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span className="truncate">
                    {isUp ? "+" : ""}{index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
