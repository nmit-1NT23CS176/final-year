"use client";

import { motion } from "framer-motion";
import { Search, Bell, ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Avatar } from "../ui/avatar";

const mockChartData = [
  { time: "10:00", value: 18500 },
  { time: "11:00", value: 18620 },
  { time: "12:00", value: 18580 },
  { time: "13:00", value: 18700 },
  { time: "14:00", value: 18850 },
  { time: "15:00", value: 18810 },
  { time: "16:00", value: 19100 },
];

const mockAssets = [
  { name: "Reliance Ind.", symbol: "RELIANCE", amount: 150, avgPrice: 2400.50, currentPrice: 2984.50, change: "+24.3%" },
  { name: "HDFC Bank", symbol: "HDFCBANK", amount: 300, avgPrice: 1500.00, currentPrice: 1632.10, change: "+8.8%" },
  { name: "Infosys", symbol: "INFY", amount: 200, avgPrice: 1450.20, currentPrice: 1645.20, change: "+13.4%" },
];

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-[800px] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden perspective-1000"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--color-text-primary)]">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
            <Search className="w-3.5 h-3.5" />
            <span>Search assets...</span>
          </div>
          <Bell className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <Avatar name="John Doe" size="sm" />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-5 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-border)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bullish)] to-transparent opacity-20" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Total Balance</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums">
                    ₹24,56,892.50
                  </h3>
                  <span className="flex items-center text-sm font-medium text-[var(--color-bullish)] mb-1 bg-[var(--color-bullish-muted)] px-1.5 py-0.5 rounded text-[11px]">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +12.4%
                  </span>
                </div>
              </div>
              <div className="flex gap-1 text-[10px] font-medium">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((tf, i) => (
                  <div key={tf} className={`px-2 py-1 rounded cursor-pointer ${i === 2 ? 'bg-[var(--color-border)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}>
                    {tf}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-bullish)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-bullish)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="var(--color-bullish)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-5 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-border)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Your Holdings</h4>
              <MoreHorizontal className="w-4 h-4 text-[var(--color-text-secondary)] cursor-pointer" />
            </div>
            
            <div className="w-full">
              <div className="grid grid-cols-4 text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] pb-2 border-b border-[var(--color-border)] mb-3">
                <div className="col-span-2">Asset</div>
                <div className="text-right">Price</div>
                <div className="text-right">Return</div>
              </div>
              
              <div className="space-y-3">
                {mockAssets.map((asset, i) => (
                  <div key={i} className="grid grid-cols-4 items-center text-xs">
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-border)] flex items-center justify-center text-[8px] font-bold">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <div className="text-[var(--color-text-primary)] font-medium">{asset.name}</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)]">{asset.amount} Qty</div>
                      </div>
                    </div>
                    <div className="text-right text-[var(--color-text-primary)] tabular-nums">
                      ₹{asset.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-right text-[var(--color-bullish)] tabular-nums font-medium">
                      {asset.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-5 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-border)]"
          >
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Quick Trade</h4>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">Pay</div>
                  <div className="text-sm text-[var(--color-text-primary)] font-medium">₹50,000</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-primary)] bg-[var(--color-border)] px-2 py-1 rounded">
                  INR <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              
              <div className="flex justify-center -my-1 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)] flex items-center justify-center">
                  <ArrowDownRight className="w-3 h-3 text-[var(--color-text-secondary)]" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">Receive</div>
                  <div className="text-sm text-[var(--color-text-primary)] font-medium">16.75</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-primary)] bg-[var(--color-border)] px-2 py-1 rounded">
                  RELIANCE <ChevronDown className="w-3 h-3" />
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 rounded-xl bg-[var(--color-bullish)] text-[#050816] text-xs font-bold hover:shadow-green-glow transition-all">
                Review Order
              </button>
            </div>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             className="p-5 rounded-xl bg-gradient-to-br from-[var(--color-elevated)] to-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-bullish-muted)] flex items-center justify-center mb-3">
              <span className="text-[var(--color-bullish)] text-lg">✨</span>
            </div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">AI Insights</h4>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              Your portfolio is heavily weighted towards IT. Consider diversifying with Financials to reduce sector risk.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
