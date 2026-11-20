"use client";

import { Briefcase, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

const HOLDINGS = [
  { symbol: "RELIANCE", name: "Reliance Industries", shares: 50, avgPrice: 2850.40, currentPrice: 2940.10 },
  { symbol: "TCS", name: "Tata Consultancy Services", shares: 25, avgPrice: 3820.00, currentPrice: 3950.25 },
  { symbol: "HDFCBANK", name: "HDFC Bank", shares: 100, avgPrice: 1540.50, currentPrice: 1480.20 },
  { symbol: "INFY", name: "Infosys", shares: 75, avgPrice: 1420.00, currentPrice: 1485.60 },
  { symbol: "ICICIBANK", name: "ICICI Bank", shares: 80, avgPrice: 980.20, currentPrice: 1050.45 },
];

export default function PortfolioPage() {
  const totalInvested = HOLDINGS.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalCurrent = HOLDINGS.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;
  const isTotalUp = totalPnL >= 0;

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Portfolio
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Manage your holdings and track performance.
            </p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-[var(--color-text-disabled)] mb-1 uppercase tracking-wider">Invested Value</p>
              <p className="text-xl font-bold tabular-nums text-[var(--color-text-primary)]">₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-[var(--color-text-disabled)] mb-1 uppercase tracking-wider">Current Value</p>
              <p className="text-xl font-bold tabular-nums text-[var(--color-text-primary)]">₹{totalCurrent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-[var(--color-text-disabled)] mb-1 uppercase tracking-wider">Total P&L</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-bold tabular-nums ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                  {isTotalUp ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <Badge variant={isTotalUp ? "bullish" : "bearish"}>
                  {isTotalUp ? "+" : ""}{totalPnLPercent.toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="font-semibold text-sm text-[var(--color-text-primary)]">Your Holdings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-[var(--color-text-disabled)] uppercase tracking-wider border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Asset</th>
                  <th className="px-5 py-3 font-semibold text-right">Qty</th>
                  <th className="px-5 py-3 font-semibold text-right">Avg Price</th>
                  <th className="px-5 py-3 font-semibold text-right">LTP</th>
                  <th className="px-5 py-3 font-semibold text-right">Current Value</th>
                  <th className="px-5 py-3 font-semibold text-right">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50">
                {HOLDINGS.map((holding) => {
                  const pnl = (holding.currentPrice - holding.avgPrice) * holding.shares;
                  const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                  const isUp = pnl >= 0;

                  return (
                    <tr key={holding.symbol} className="hover:bg-[var(--color-elevated)] transition-colors duration-100">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--color-text-primary)]">{holding.symbol}</span>
                          <span className="text-[11px] text-[var(--color-text-disabled)]">{holding.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right font-medium tabular-nums text-[var(--color-text-primary)]">
                        {holding.shares}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right tabular-nums text-[var(--color-text-secondary)]">
                        ₹{holding.avgPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right tabular-nums text-[var(--color-text-primary)]">
                        ₹{holding.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right font-medium tabular-nums text-[var(--color-text-primary)]">
                        ₹{(holding.shares * holding.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right">
                        <div className={`flex flex-col items-end ${isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                          <span className="font-semibold tabular-nums">
                            {isUp ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[11px] font-medium inline-flex items-center gap-0.5">
                            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(pnlPercent).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
