"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockRow {
  symbol: string;
  companyName?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface StockTableProps {
  stocks: StockRow[];
  className?: string;
  showRank?: boolean;
}

export function StockTable({ stocks, className, showRank = false }: StockTableProps) {
  const router = useRouter();

  if (stocks.length === 0) {
    return (
      <div className={cn("text-center py-8 text-sm text-[var(--color-text-secondary)]", className)}>
        No stocks to display
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {showRank && (
              <th className="text-left py-2.5 px-4 text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider w-8">
                #
              </th>
            )}
            <th className="text-left py-2.5 px-4 text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
              Symbol
            </th>
            <th className="text-right py-2.5 px-4 text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
              Price
            </th>
            <th className="text-right py-2.5 px-4 text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
              Change
            </th>
            <th className="text-right py-2.5 px-4 text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider">
              % Change
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => {
            const isUp = stock.change >= 0;
            return (
              <tr
                key={stock.symbol}
                onClick={() => router.push(`/stocks/${encodeURIComponent(stock.symbol)}`)}
                className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-elevated)] cursor-pointer transition-colors duration-100"
              >
                {showRank && (
                  <td className="py-2.5 px-4 text-sm text-[var(--color-text-disabled)] tabular-nums">
                    {i + 1}
                  </td>
                )}
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-sm text-[var(--color-text-primary)]">
                    {stock.symbol}
                  </div>
                  {stock.companyName && (
                    <div className="text-[11px] text-[var(--color-text-disabled)] truncate max-w-[160px]">
                      {stock.companyName}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
                  ₹{stock.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={cn("py-2.5 px-4 text-right text-sm font-medium tabular-nums", isUp ? "text-bullish" : "text-bearish")}>
                  <span className="inline-flex items-center gap-0.5">
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isUp ? "+" : ""}{stock.change.toFixed(2)}
                  </span>
                </td>
                <td className={cn("py-2.5 px-4 text-right text-sm font-medium tabular-nums", isUp ? "text-bullish" : "text-bearish")}>
                  {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
