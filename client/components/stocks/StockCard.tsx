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
  const color = isUp ? "#00c853" : "#ff3b30";

  return (
    <Card
      className={cn(
        "cursor-pointer hover:bg-[var(--color-elevated)] transition-colors duration-150",
        className
      )}
      onClick={() => router.push(`/stocks/${encodeURIComponent(symbol)}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate text-[var(--color-text-primary)]">{symbol}</h3>
            {companyName && (
              <p className="text-xs text-[var(--color-text-disabled)] truncate mt-0.5">
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
            <div className="text-xl font-semibold tracking-tight tabular-nums text-[var(--color-text-primary)]">
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

          <div className="opacity-50">
            <SparklineChart data={sparklineData} color={color} width={72} height={28} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
