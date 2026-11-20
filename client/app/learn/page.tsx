"use client";

import { Footer } from "@/components/layout/Footer";
import { TickerStrip } from "@/components/layout/TickerStrip";
import { BookOpen, HelpCircle, FileText, CheckCircle } from "lucide-react";

export default function LearnPage() {
  return (
    <>
      <TickerStrip />
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#00d26a] block mb-1">
            METHODOLOGY & EDUCATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">StockVista Academy & FAQ</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            Understand how our ML models calculate next-day trend probabilities, technical indicators, and volatility regimes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-xl border border-[#1e2535] bg-[#161c28]">
            <BookOpen className="w-8 h-8 text-[#00d26a] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Our 15-step machine learning pipeline ingests stock OHLCV data, global market indicators (S&amp;P 500, VIX, Crude Oil, Gold), and macro FRED statistics. Features are lagged to $t-1$ to prevent lookahead data leakage.
            </p>
          </div>

          <div className="p-8 rounded-xl border border-[#1e2535] bg-[#161c28]">
            <HelpCircle className="w-8 h-8 text-[#00d26a] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Frequently Asked Questions</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
              <strong>Is this financial advice?</strong> No. StockVista provides probabilistic data science models for educational purposes only. Always consult a SEBI-registered advisor.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
