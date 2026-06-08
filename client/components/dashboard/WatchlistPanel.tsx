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
    <Card className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="font-semibold text-sm">Watchlist</h3>
        </div>

        {/* Quick add form */}
        <form onSubmit={handleAdd} className="flex gap-1.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-disabled)]" />
            <input
              type="text"
              value={addSymbol}
              onChange={(e) => setAddSymbol(e.target.value)}
              placeholder="Add symbol..."
              className="h-8 w-[140px] pl-8 pr-3 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-150"
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
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2 border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-disabled)] uppercase tracking-wider min-w-[500px]">
          <div>Symbol</div>
          <div className="text-right">Last Price</div>
          <div className="text-right">Change</div>
          <div className="flex justify-center">Trend</div>
          <div className="w-7"></div>
        </div>

        {/* Content */}
        <div className="min-w-[500px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-6 w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : stocks.length === 0 ? (
            <div className="p-8 text-center">
              <Bookmark className="w-6 h-6 text-[var(--color-text-disabled)] mx-auto mb-2 opacity-40" />
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">Watchlist is empty</p>
              <p className="text-xs text-[var(--color-text-disabled)]">Add stocks to track them here.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {stocks.map((stock) => {
                const isUp = stock.change >= 0;
                const colorHex = isUp ? "#00d09c" : "#ff5252";
                
                return (
                  <div
                    key={stock.id}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2.5 items-center border-b border-[var(--color-border)]/50 hover:bg-[var(--color-elevated)] cursor-pointer transition-colors duration-100 group"
                    onClick={() => router.push(`/stocks/${encodeURIComponent(stock.symbol)}`)}
                  >
                    {/* Symbol & Name */}
                    <div className="min-w-0 flex flex-col">
                      <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                        {stock.symbol}
                      </span>
                      {stock.companyName && (
                        <span className="text-[11px] text-[var(--color-text-disabled)] truncate mt-0.5">
                          {stock.companyName}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right font-medium text-sm tabular-nums text-[var(--color-text-primary)]">
                      ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Change */}
                    <div className="text-right flex flex-col items-end">
                      <span className={cn("text-sm font-semibold tabular-nums", isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]")}>
                        {isUp ? "+" : ""}{stock.change.toFixed(2)}
                      </span>
                      <span className={cn("text-[11px] font-semibold tabular-nums", isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]")}>
                        {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    {/* Chart */}
                    <div className="flex justify-center items-center h-7">
                      <SparklineChart 
                        width={72} 
                        height={28} 
                        color={colorHex} 
                      />
                    </div>

                    {/* Actions */}
                    <div className="w-7 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
