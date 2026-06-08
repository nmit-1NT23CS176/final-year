"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

const MOCK_ORDERS = [
  { id: "ORD-001", symbol: "RELIANCE", type: "BUY", orderType: "MARKET", qty: 50, price: 2940.10, status: "COMPLETED", date: "2026-06-08 10:15:22" },
  { id: "ORD-002", symbol: "TCS", type: "SELL", orderType: "LIMIT", qty: 10, price: 3950.00, status: "OPEN", date: "2026-06-08 14:30:00" },
  { id: "ORD-003", symbol: "HDFCBANK", type: "BUY", orderType: "MARKET", qty: 100, price: 1480.20, status: "COMPLETED", date: "2026-06-07 09:45:10" },
  { id: "ORD-004", symbol: "INFY", type: "BUY", orderType: "LIMIT", qty: 75, price: 1400.00, status: "CANCELLED", date: "2026-06-06 11:20:05" },
  { id: "ORD-005", symbol: "ICICIBANK", type: "SELL", orderType: "STOP_LOSS", qty: 80, price: 1000.00, status: "OPEN", date: "2026-06-08 09:15:00" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "OPEN" | "COMPLETED" | "CANCELLED">("ALL");

  const filteredOrders = MOCK_ORDERS.filter(order => 
    activeTab === "ALL" ? true : order.status === activeTab
  );

  return (
    <div className="flex-1 bg-[var(--color-background)] min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Orders
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">
            View your open, completed, and cancelled orders.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)] overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-elevated)]/30">
              
              {/* Tabs */}
              <div className="flex bg-[var(--color-elevated)] p-1 rounded-md">
                {(["ALL", "OPEN", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-sm capitalize transition-colors ${
                      activeTab === tab 
                        ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border)]/50" 
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                  <input
                    type="text"
                    placeholder="Search by symbol..."
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 px-3 border-[var(--color-border)]">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-elevated)]/10 border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Symbol</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Order Type</th>
                    <th className="px-6 py-4 font-semibold text-right">Qty</th>
                    <th className="px-6 py-4 font-semibold text-right">Price</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                        <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p>No orders found for this category.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[var(--color-elevated)]/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[var(--color-text-primary)]">
                          {order.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          <span className={order.type === "BUY" ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}>
                            {order.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">
                          {order.orderType.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {order.qty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right tabular-nums">
                          ₹{order.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Badge 
                            variant="outline" 
                            className={`border-none ${
                              order.status === "COMPLETED" ? "bg-[var(--color-bullish-muted)] text-[var(--color-bullish)]" :
                              order.status === "OPEN" ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]" :
                              "bg-[var(--color-bearish-muted)] text-[var(--color-bearish)]"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
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
