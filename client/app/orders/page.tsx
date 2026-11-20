"use client";

import { useState } from "react";
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
    <div className="flex-1 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Orders
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            View your open, completed, and cancelled orders.
          </p>
        </div>

        <Card className="overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex bg-[var(--color-elevated)] p-1 rounded-lg">
              {(["ALL", "OPEN", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-md capitalize transition-colors duration-150 ${
                    activeTab === tab 
                      ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm" 
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-disabled)]" />
                <input
                  type="text"
                  placeholder="Search by symbol..."
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-150"
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
              <thead className="text-[11px] text-[var(--color-text-disabled)] uppercase tracking-wider border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Symbol</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Order Type</th>
                  <th className="px-5 py-3 font-semibold text-right">Qty</th>
                  <th className="px-5 py-3 font-semibold text-right">Price</th>
                  <th className="px-5 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-[var(--color-text-secondary)]">
                      <History className="w-6 h-6 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No orders found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--color-elevated)] transition-colors duration-100">
                      <td className="px-5 py-3 whitespace-nowrap text-[var(--color-text-secondary)] text-[13px]">
                        {order.date}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-semibold text-[var(--color-text-primary)]">
                        {order.symbol}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-semibold">
                        <span className={order.type === "BUY" ? "text-[var(--color-bullish)]" : "text-[var(--color-bearish)]"}>
                          {order.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-[var(--color-text-secondary)]">
                        {order.orderType.replace("_", " ")}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right font-medium tabular-nums text-[var(--color-text-primary)]">
                        {order.qty}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right tabular-nums text-[var(--color-text-primary)]">
                        ₹{order.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right">
                        <Badge 
                          variant={
                            order.status === "COMPLETED" ? "bullish" :
                            order.status === "OPEN" ? "warning" :
                            "bearish"
                          }
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
      </div>
      <Footer />
    </div>
  );
}
