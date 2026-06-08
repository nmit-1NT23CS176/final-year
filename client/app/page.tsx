"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients for aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-bullish)] opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-bearish)] opacity-10 blur-[100px] pointer-events-none" />

      <motion.div 
        className="max-w-4xl w-full text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-sm text-[var(--color-text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-bullish)] animate-pulse" />
          Live Indian Market Data Powered by Yahoo Finance
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent"
        >
          Track the Market <br className="hidden md:block" /> in Real-Time
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto"
        >
          Experience premium stock tracking with deep analytics, live websockets, and lightning-fast insights.
        </motion.p>

        <motion.form 
          variants={itemVariants}
          onSubmit={handleSearch}
          className="max-w-xl mx-auto relative flex items-center group mb-16"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-bullish)] transition-colors" />
          </div>
          <Input
            type="text"
            className="w-full pl-12 pr-32 h-14 text-lg rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border-[var(--color-border)] focus-visible:ring-2 focus-visible:ring-[var(--color-bullish)] transition-all"
            placeholder="Search symbols (e.g., RELIANCE.NS, TCS)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Button 
              type="submit" 
              className="rounded-full h-10 px-6 bg-[var(--color-bullish)] hover:bg-[var(--color-bullish-hover)] text-black border-none font-semibold transition-all hover:scale-105"
            >
              Analyze
            </Button>
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="w-full text-left max-w-5xl mx-auto mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-[var(--color-bullish)]" /> Trending Now
            </h2>
            <Button variant="ghost" className="text-[var(--color-text-secondary)] hover:text-white">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hardcoded placeholders for now until we connect to API in Dashboard */}
            {[
              { symbol: "RELIANCE.NS", price: "2,984.50", change: "+1.24%", isUp: true },
              { symbol: "TCS.NS", price: "4,120.00", change: "+0.85%", isUp: true },
              { symbol: "HDFCBANK.NS", price: "1,432.10", change: "-0.45%", isUp: false },
            ].map((stock) => (
              <Card key={stock.symbol} className="bg-[var(--color-surface)]/50 backdrop-blur-sm border-[var(--color-border)] hover:bg-[var(--color-elevated)] transition-all cursor-pointer" onClick={() => router.push(`/stock/${stock.symbol}`)}>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-lg">{stock.symbol}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${stock.isUp ? 'bg-[var(--color-bullish)]/10 text-[var(--color-bullish)]' : 'bg-[var(--color-bearish)]/10 text-[var(--color-bearish)]'}`}>
                      {stock.change}
                    </span>
                  </div>
                  <div className="text-3xl font-semibold tracking-tight">₹{stock.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
