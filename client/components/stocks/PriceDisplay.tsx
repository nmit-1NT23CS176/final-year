"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  change?: number;
  changePercent?: number;
  size?: "sm" | "default" | "lg";
  showCurrency?: boolean;
  flashDirection?: "up" | "down" | null;
  className?: string;
}

export function PriceDisplay({
  price,
  change,
  changePercent,
  size = "default",
  showCurrency = true,
  flashDirection,
  className,
}: PriceDisplayProps) {
  const isUp = (change ?? 0) >= 0;
  const formattedPrice = formatINR(price);

  const sizeClasses = {
    sm: { price: "text-lg font-semibold", change: "text-xs" },
    default: { price: "text-2xl font-bold", change: "text-sm" },
    lg: { price: "text-3xl font-bold tracking-tight", change: "text-base" },
  };

  return (
    <div
      className={cn(
        "transition-colors duration-500",
        flashDirection === "up" && "animate-flash-green",
        flashDirection === "down" && "animate-flash-red",
        className
      )}
    >
      <span className={cn(sizeClasses[size].price, "tabular-nums text-[var(--color-text-primary)]")}>
        {showCurrency && "₹"}{formattedPrice}
      </span>
      {change !== undefined && changePercent !== undefined && (
        <span
          className={cn(
            "flex items-center gap-0.5 font-medium mt-0.5",
            sizeClasses[size].change,
            isUp ? "text-bullish" : "text-bearish"
          )}
        >
          {isUp ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {isUp ? "+" : ""}
          {change.toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
        </span>
      )}
    </div>
  );
}

function formatINR(value: number): string {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + " Cr";
  }
  if (value >= 100000) {
    return (value / 100000).toFixed(2) + " L";
  }
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
