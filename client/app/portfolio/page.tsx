"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="flex-1 bg-[var(--color-background)] min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Portfolio
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-1 font-medium">
              Manage your holdings and track performance.
            </p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Invested Value</p>
              <p className="text-2xl font-bold">₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Current Value</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">₹{totalCurrent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Total P&L</p>
              <div className="flex items-center gap-3">
                <p className={`text-2xl font-bold ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                  {isTotalUp ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${isTotalUp ? "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]" : "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]"}`}>
                  {isTotalUp ? "+" : ""}{totalPnLPercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2 bg-[var(--color-elevated)]/30">
              <Briefcase className="w-5 h-5 text-[var(--color-accent)]" />
              <h2 className="font-bold text-lg">Your Holdings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-elevated)]/10 border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Asset</th>
                    <th className="px-6 py-4 font-semibold text-right">Qty</th>
                    <th className="px-6 py-4 font-semibold text-right">Avg Price</th>
                    <th className="px-6 py-4 font-semibold text-right">LTP</th>
                    <th className="px-6 py-4 font-semibold text-right">Current Value</th>
                    <th className="px-6 py-4 font-semibold text-right">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {HOLDINGS.map((holding) => {
                    const pnl = (holding.currentPrice - holding.avgPrice) * holding.shares;
                    const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                    const isUp = pnl >= 0;

                    return (
                      <tr key={holding.symbol} className="hover:bg-[var(--color-elevated)]/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--color-text-primary)]">{holding.symbol}</span>
                            <span className="text-xs text-[var(--color-text-disabled)]">{holding.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {holding.shares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right tabular-nums">
                          ₹{holding.avgPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right tabular-nums">
                          ₹{holding.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium tabular-nums text-[var(--color-text-primary)]">
                          ₹{(holding.shares * holding.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`flex flex-col items-end ${isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                            <span className="font-semibold tabular-nums">
                              {isUp ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs font-medium inline-flex items-center gap-0.5">
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
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
