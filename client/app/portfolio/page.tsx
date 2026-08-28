"use client";

import { useState, useEffect } from "react";
import { stockApi } from "@/services/stock-api";

import { Briefcase, ArrowUpRight, ArrowDownRight, Download, PieChart, TrendingUp, ShieldCheck } from "lucide-react";

// Mock Data
const HOLDINGS = [
  { symbol: "RELIANCE", name: "Reliance Industries", shares: 50, avgPrice: 2850.40, currentPrice: 2940.10 },
  { symbol: "TCS", name: "Tata Consultancy Services", shares: 25, avgPrice: 3820.00, currentPrice: 3950.25 },
  { symbol: "HDFCBANK", name: "HDFC Bank", shares: 100, avgPrice: 1540.50, currentPrice: 1480.20 },
  { symbol: "INFY", name: "Infosys", shares: 75, avgPrice: 1420.00, currentPrice: 1485.60 },
  { symbol: "ICICIBANK", name: "ICICI Bank", shares: 80, avgPrice: 980.20, currentPrice: 1050.45 },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState(HOLDINGS);

  useEffect(() => {
    let cancelled = false;
    const fetchHoldingsPrices = async () => {
      try {
        const updated = await Promise.all(
          HOLDINGS.map(async (stock) => {
            try {
              const res = await stockApi.getStockDetails(stock.symbol);
              if (res?.data?.quote) {
                return {
                  ...stock,
                  currentPrice: res.data.quote.currentPrice,
                };
              }
            } catch (err) {
              // Ignore individual fetch errors
            }
            return stock;
          })
        );
        if (!cancelled) setHoldings(updated);
      } catch (err) {
        console.error("Failed to fetch holdings prices", err);
      }
    };
    
    fetchHoldingsPrices();
    const t = setInterval(fetchHoldingsPrices, 3000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;
  const isTotalUp = totalPnL >= 0;

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-10 max-w-[1200px] mx-auto w-full">
        
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1.5 tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[var(--color-accent)]" />
            My Portfolio
          </h1>
          <p className="text-[var(--color-text-secondary)] text-[14px] font-medium">
            Track your holdings, performance, and asset allocation.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-white border border-[var(--color-border)] px-4 py-2 rounded-xl text-[13px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 shadow-sm transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Invested Value</p>
          </div>
          <p className="text-3xl font-black tabular-nums text-[var(--color-text-primary)] tracking-tight">₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <PieChart className="w-4 h-4" />
            </div>
            <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Current Value</p>
          </div>
          <p className="text-3xl font-black tabular-nums text-[var(--color-text-primary)] tracking-tight">₹{totalCurrent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTotalUp ? 'bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]' : 'bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Total P&L</p>
          </div>
          <div className="flex items-center gap-3">
            <p className={`text-3xl font-black tabular-nums tracking-tight ${isTotalUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
              {isTotalUp ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className={`px-2 py-1 rounded-md text-[13px] font-extrabold ${isTotalUp ? "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]" : "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]"}`}>
              {isTotalUp ? "+" : ""}{totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Holdings Table ── */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-extrabold text-[16px] text-[var(--color-text-primary)]">Your Holdings</h2>
          <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">{holdings.length} Assets</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-background)]/50 text-[11px] font-bold text-[var(--color-text-disabled)] uppercase tracking-widest border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Avg Price</th>
                <th className="px-6 py-4 text-right">LTP</th>
                <th className="px-6 py-4 text-right">Current Value</th>
                <th className="px-6 py-4 text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {holdings.map((holding) => {
                const pnl = (holding.currentPrice - holding.avgPrice) * holding.shares;
                const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                const isUp = pnl >= 0;

                return (
                  <tr key={holding.symbol} className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[15px] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{holding.symbol}</span>
                        <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{holding.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold tabular-nums text-[var(--color-text-primary)]">
                      {holding.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium tabular-nums text-[var(--color-text-secondary)]">
                      ₹{holding.avgPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold tabular-nums text-[var(--color-text-primary)]">
                      ₹{holding.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold tabular-nums text-[var(--color-text-primary)]">
                      ₹{(holding.shares * holding.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`flex flex-col items-end ${isUp ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}`}>
                        <span className="font-bold tabular-nums text-[14px]">
                          {isUp ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[11px] font-bold inline-flex items-center gap-0.5 mt-0.5 bg-white/50 px-1.5 rounded">
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
      </div>
    </div>
  );
}
