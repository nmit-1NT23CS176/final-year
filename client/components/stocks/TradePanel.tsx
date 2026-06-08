"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradePanelProps {
  symbol: string;
  currentPrice: number;
  className?: string;
}

type OrderType = "market" | "limit" | "stop";

export function TradePanel({ symbol, currentPrice, className }: TradePanelProps) {
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [quantity, setQuantity] = useState<string>("1");
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toString());

  const numQuantity = parseFloat(quantity) || 0;
  const numLimitPrice = parseFloat(limitPrice) || 0;
  
  const estimatedCost = orderType === "market" 
    ? numQuantity * currentPrice 
    : numQuantity * numLimitPrice;

  return (
    <Card className={cn("bg-[var(--color-surface)] border-[var(--color-border)] h-full flex flex-col", className)}>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 p-1 border-b border-[var(--color-border)]">
          <button
            className={cn(
              "py-3 text-sm font-bold uppercase tracking-wider rounded-t-sm transition-all relative overflow-hidden",
              action === "buy" 
                ? "text-[var(--color-bullish)]" 
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
            onClick={() => setAction("buy")}
          >
            Buy
            {action === "buy" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-bullish)] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            )}
          </button>
          <button
            className={cn(
              "py-3 text-sm font-bold uppercase tracking-wider rounded-t-sm transition-all relative overflow-hidden",
              action === "sell" 
                ? "text-[var(--color-bearish)]" 
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
            onClick={() => setAction("sell")}
          >
            Sell
            {action === "sell" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-bearish)] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            )}
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Order Types */}
          <div className="flex bg-[var(--color-elevated)] p-1 rounded-md mb-6">
            {(["market", "limit", "stop"] as const).map((type) => (
              <button
                key={type}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-sm capitalize transition-colors",
                  orderType === type 
                    ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border)]/50" 
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
                onClick={() => setOrderType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-8">
            {orderType !== "market" && (
              <div className="flex items-center justify-between border border-[var(--color-border)] rounded-md px-3 py-2 bg-[var(--color-elevated)]/30 focus-within:border-[var(--color-accent)] transition-colors">
                <label className="text-xs text-[var(--color-text-secondary)] font-medium">Price</label>
                <div className="flex items-center">
                  <span className="text-[var(--color-text-secondary)] mr-1">₹</span>
                  <input 
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-24 text-right bg-transparent text-sm font-medium text-[var(--color-text-primary)] focus:outline-none"
                    step="0.05"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between border border-[var(--color-border)] rounded-md px-3 py-2 bg-[var(--color-elevated)]/30 focus-within:border-[var(--color-accent)] transition-colors">
              <label className="text-xs text-[var(--color-text-secondary)] font-medium">Quantity</label>
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-24 text-right bg-transparent text-sm font-medium text-[var(--color-text-primary)] focus:outline-none"
                min="1"
              />
            </div>
          </div>

          <div className="mt-auto">
            {/* Estimate */}
            <div className="flex justify-between items-end mb-4 px-1">
              <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                Estimated Cost <Info className="w-3.5 h-3.5" />
              </span>
              <span className="text-xl font-bold tabular-nums">
                ₹{estimatedCost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Buying Power */}
            <div className="flex justify-between items-center mb-4 px-1 pb-4 border-b border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-secondary)]">Available Funds</span>
              <span className="text-xs font-semibold">₹1,25,000.00</span>
            </div>

            {/* Action Button */}
            <Button 
              className={cn(
                "w-full py-6 text-base font-bold uppercase tracking-wider border-none",
                action === "buy" 
                  ? "bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black" 
                  : "bg-[var(--color-bearish)] hover:bg-[var(--color-bearish-hover)] text-white"
              )}
            >
              {action} {symbol}
            </Button>
            <p className="text-[10px] text-center text-[var(--color-text-disabled)] mt-3">
              Brokerage and regulatory fees not included in estimate.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
