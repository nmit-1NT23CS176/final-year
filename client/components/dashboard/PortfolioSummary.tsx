"use client";

import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PortfolioSummaryProps {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  buyingPower: number;
}

export function PortfolioSummary({
  totalValue,
  dayChange,
  dayChangePercent,
  totalReturn,
  totalReturnPercent,
  buyingPower,
}: PortfolioSummaryProps) {
  const isDayUp = dayChange >= 0;
  const isTotalUp = totalReturn >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Total Value */}
          <div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
              <Wallet className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs font-semibold tracking-wider uppercase">Portfolio Value</span>
            </div>
            
            <span className="text-4xl font-extrabold tracking-tight tabular-nums text-[var(--color-text-primary)]">
              ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 text-sm font-medium ${isDayUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                {isDayUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="tabular-nums">
                  {isDayUp ? "+" : ""}₹{Math.abs(dayChange).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs">
                  ({isDayUp ? "+" : ""}{dayChangePercent.toFixed(2)}%)
                </span>
              </div>
              <span className="text-[11px] text-[var(--color-text-disabled)] font-medium uppercase">Today</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div>
              <p className="text-[11px] text-[var(--color-text-disabled)] mb-0.5 font-medium uppercase tracking-wider">Total Returns</p>
              <p className={`text-base font-bold tabular-nums ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                {isTotalUp ? "+" : "-"}₹{Math.abs(totalReturn).toLocaleString("en-IN")}
              </p>
              <p className={`text-[11px] font-medium tabular-nums ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                {isTotalUp ? "+" : ""}{totalReturnPercent.toFixed(2)}%
              </p>
            </div>
            
            <div className="w-px h-10 bg-[var(--color-border)]" />
            
            <div>
              <p className="text-[11px] text-[var(--color-text-disabled)] mb-0.5 font-medium uppercase tracking-wider">Buying Power</p>
              <p className="text-base font-bold tabular-nums text-[var(--color-text-primary)]">
                ₹{buyingPower.toLocaleString("en-IN")}
              </p>
              <Link href="/portfolio" className="inline-flex mt-0.5">
                <span className="text-[11px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium flex items-center gap-0.5 transition-colors">
                  View Holdings <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
