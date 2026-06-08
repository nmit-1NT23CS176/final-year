"use client";

import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "RBI keeps repo rate unchanged at 6.5%, maintains 'withdrawal of accommodation' stance",
    source: "Bloomberg",
    time: "2 hours ago",
    url: "#",
    sentiment: "positive"
  },
  {
    id: "2",
    headline: "TCS Q4 Results: Net profit rises 9% to ₹12,434 crore, declares dividend of ₹28 per share",
    source: "Reuters",
    time: "4 hours ago",
    url: "#",
    sentiment: "positive"
  },
  {
    id: "3",
    headline: "Global markets tumble as inflation data comes in hotter than expected",
    source: "Financial Times",
    time: "5 hours ago",
    url: "#",
    sentiment: "negative"
  },
  {
    id: "4",
    headline: "Reliance Industries to invest $10B in green energy projects over next 3 years",
    source: "Mint",
    time: "6 hours ago",
    url: "#",
    sentiment: "positive"
  }
];

export function NewsSection() {
  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)] h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-elevated)]/30">
        <h2 className="font-bold flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[var(--color-accent)]" />
          Market News
        </h2>
        <a href="/news" className="text-xs text-[var(--color-accent)] hover:underline font-medium">
          View All
        </a>
      </div>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {MOCK_NEWS.map((news, i) => (
            <motion.a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 hover:bg-[var(--color-elevated)]/50 transition-colors group block relative"
            >
              {/* Sentiment Indicator line */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  news.sentiment === "positive" ? "bg-[var(--color-bullish)]" : 
                  news.sentiment === "negative" ? "bg-[var(--color-bearish)]" : "bg-[var(--color-text-secondary)]"
                }`} 
              />
              
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-hover)] transition-colors line-clamp-2 leading-tight mb-2 pr-4">
                {news.headline}
              </h3>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {news.source}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-disabled)]">
                  <Clock className="w-3 h-3" /> {news.time}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
