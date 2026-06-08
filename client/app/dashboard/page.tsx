"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items } = useWatchlistStore();
  const [newSymbol, setNewSymbol] = useState("");

  // In a real app, we would fetch from /api/watchlist here
  // For now we'll use placeholder local state or empty state if not logged in

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/login"); // Commented out for demo purposes
    }
  }, [isAuthenticated, router]);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      // Add logic here
      setNewSymbol("");
    }
  };

  const mockWatchlist = [
    { id: '1', symbol: 'RELIANCE.NS', price: 2984.50, change: 35.2, changePercent: 1.24 },
    { id: '2', symbol: 'TCS.NS', price: 4120.00, change: 34.5, changePercent: 0.85 },
    { id: '3', symbol: 'HDFCBANK.NS', price: 1432.10, change: -6.4, changePercent: -0.45 },
    { id: '4', symbol: 'INFY.NS', price: 1645.20, change: 12.1, changePercent: 0.74 },
  ];

  const displayItems = items.length > 0 ? items : mockWatchlist;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your watchlist and track live prices.</p>
        </div>
        
        <form onSubmit={handleAddStock} className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Add symbol (e.g. ITC.NS)" 
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="md:w-[250px]"
          />
          <Button type="submit" variant="outline" className="shrink-0 text-[var(--color-bullish)] border-[var(--color-bullish)] hover:bg-[var(--color-bullish)]/10 hover:text-[var(--color-bullish)]">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayItems.map((item, i) => {
          const isUp = item.changePercent >= 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer" onClick={() => router.push(`/stock/${item.symbol}`)}>
                {/* Subtle gradient border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bullish)]/0 to-[var(--color-bullish)]/0 group-hover:from-[var(--color-bullish)]/5 group-hover:to-transparent transition-all duration-500" />
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{item.symbol}</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--color-bearish)]" onClick={(e) => { e.stopPropagation(); /* Remove logic */ }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-semibold tracking-tight">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <span className={`flex items-center text-sm font-medium ${isUp ? 'text-[var(--color-bullish)]' : 'text-[var(--color-bearish)]'}`}>
                      {isUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {Math.abs(item.change).toFixed(2)} ({Math.abs(item.changePercent).toFixed(2)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
