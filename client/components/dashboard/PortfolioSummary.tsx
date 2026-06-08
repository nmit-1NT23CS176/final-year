"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/stocks/PriceDisplay";
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
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)] overflow-hidden relative">
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[var(--color-bullish)] opacity-[0.04] blur-[80px] pointer-events-none" />

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Wallet className="w-5 h-5 text-[var(--color-accent)]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase">Total Portfolio Value</h2>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-bold tracking-tight">
                ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-3 mt-2">
                <div className={`flex items-center gap-1 font-medium ${isDayUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                  {isDayUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isDayUp ? "+" : ""}₹{Math.abs(dayChange).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-opacity-10 bg-current text-xs">
                    ({isDayUp ? "+" : ""}{dayChangePercent.toFixed(2)}%)
                  </span>
                </div>
                <span className="text-xs text-[var(--color-text-disabled)] font-medium uppercase">Today</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 flex-1 w-full md:max-w-md">
            <div className="p-4 rounded-xl bg-[var(--color-elevated)]/40 border border-[var(--color-border)]/50 backdrop-blur-sm">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 font-medium">Total Returns</p>
              <p className={`text-lg font-bold ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                {isTotalUp ? "+" : "-"}₹{Math.abs(totalReturn).toLocaleString("en-IN")}
              </p>
              <p className={`text-xs ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                {isTotalUp ? "+" : ""}{totalReturnPercent.toFixed(2)}% All Time
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-[var(--color-elevated)]/40 border border-[var(--color-border)]/50 backdrop-blur-sm">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 font-medium">Buying Power</p>
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                ₹{buyingPower.toLocaleString("en-IN")}
              </p>
              <Link href="/portfolio" className="inline-flex mt-1">
                <span className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium flex items-center gap-1">
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
