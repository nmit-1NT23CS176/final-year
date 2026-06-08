"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Bookmark, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SparklineChart } from "@/components/charts/SparklineChart";

interface WatchlistStock {
  id: string;
  symbol: string;
  companyName?: string;
  price: number;
  change: number;
  changePercent: number;
}

interface WatchlistPanelProps {
  stocks: WatchlistStock[];
  isLoading?: boolean;
  onAddStock?: (symbol: string) => void;
  onRemoveStock?: (id: string) => void;
  className?: string;
}

export function WatchlistPanel({
  stocks,
  isLoading = false,
  onAddStock,
  onRemoveStock,
  className,
}: WatchlistPanelProps) {
  const router = useRouter();
  const [addSymbol, setAddSymbol] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (addSymbol.trim() && onAddStock) {
      onAddStock(addSymbol.trim().toUpperCase());
      setAddSymbol("");
    }
  };

  return (
    <Card className={cn("bg-[var(--color-surface)] border-[var(--color-border)] flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/30">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="font-bold text-base">Watchlist</h3>
        </div>

        {/* Quick add form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-disabled)]" />
            <input
              type="text"
              value={addSymbol}
              onChange={(e) => setAddSymbol(e.target.value)}
              placeholder="Search symbol..."
              className="h-8 w-[160px] pl-8 pr-3 text-xs rounded-md border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-8 w-8 p-0 bg-[var(--color-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <CardContent className="p-0 flex-1 overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/10 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider min-w-[500px]">
          <div>Symbol</div>
          <div className="text-right">Last Price</div>
          <div className="text-right">Change</div>
          <div className="flex justify-center">Chart 1D</div>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="min-w-[500px]">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-8 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : stocks.length === 0 ? (
            <div className="p-10 text-center">
              <Bookmark className="w-8 h-8 text-[var(--color-text-disabled)] mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Watchlist is empty</p>
              <p className="text-xs text-[var(--color-text-disabled)]">Track your favorite stocks easily.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {stocks.map((stock) => {
                const isUp = stock.change >= 0;
                const colorHex = isUp ? "#22C55E" : "#EF4444";
                
                return (
                  <div
                    key={stock.id}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center border-b border-[var(--color-border)]/50 hover:bg-[var(--color-elevated)]/40 cursor-pointer transition-colors group"
                    onClick={() => router.push(`/stocks/${encodeURIComponent(stock.symbol)}`)}
                  >
                    {/* Symbol & Name */}
                    <div className="min-w-0 flex flex-col">
                      <span className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {stock.symbol}
                      </span>
                      {stock.companyName && (
                        <span className="text-[11px] text-[var(--color-text-disabled)] truncate mt-0.5">
                          {stock.companyName}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right font-medium text-sm tabular-nums">
                      ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Change */}
                    <div className="text-right flex flex-col items-end">
                      <span className={cn("text-sm font-semibold tabular-nums", isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]")}>
                        {isUp ? "+" : ""}{stock.change.toFixed(2)}
                      </span>
                      <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded-sm mt-0.5", isUp ? "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]" : "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]")}>
                        {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    {/* Chart */}
                    <div className="flex justify-center items-center h-8">
                      <SparklineChart 
                        width={80} 
                        height={32} 
                        color={colorHex} 
                      />
                    </div>

                    {/* Actions */}
                    <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[var(--color-text-disabled)] hover:text-[var(--color-bearish)] hover:bg-[var(--color-bearish-muted)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveStock?.(stock.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
