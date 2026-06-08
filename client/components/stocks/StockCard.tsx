"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { cn } from "@/lib/utils";

interface StockCardProps {
  symbol: string;
  companyName?: string;
  price: number;
  change: number;
  changePercent: number;
  sparklineData?: number[];
  className?: string;
}

export function StockCard({
  symbol,
  companyName,
  price,
  change,
  changePercent,
  sparklineData,
  className,
}: StockCardProps) {
  const router = useRouter();
  const isUp = change >= 0;
  const color = isUp ? "#00d09c" : "#ff6b6b";

  return (
    <Card
      className={cn(
        "relative overflow-hidden group cursor-pointer bg-[var(--color-surface)]/80 backdrop-blur-sm border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-300",
        className
      )}
      onClick={() => router.push(`/stocks/${encodeURIComponent(symbol)}`)}
    >
      {/* Subtle gradient glow on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isUp
            ? "bg-gradient-to-br from-[var(--color-bullish)]/5 to-transparent"
            : "bg-gradient-to-br from-[var(--color-bearish)]/5 to-transparent"
        )}
      />

      <CardContent className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{symbol}</h3>
            {companyName && (
              <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
                {companyName}
              </p>
            )}
          </div>
          <Badge variant={isUp ? "bullish" : "bearish"} className="ml-2 shrink-0">
            {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(changePercent).toFixed(2)}%
          </Badge>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tracking-tight tabular-nums">
              ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span
              className={cn(
                "text-xs font-medium mt-0.5 inline-flex items-center gap-0.5",
                isUp ? "text-bullish" : "text-bearish"
              )}
            >
              {isUp ? "+" : ""}
              {change.toFixed(2)}
            </span>
          </div>

          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <SparklineChart data={sparklineData} color={color} width={80} height={32} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
