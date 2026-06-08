"use client";

import { Newspaper, Clock } from "lucide-react";
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
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[var(--color-accent)]" />
          Market News
        </h2>
        <a href="/news" className="text-[11px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors">
          View All
        </a>
      </div>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {MOCK_NEWS.map((news) => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 hover:bg-[var(--color-elevated)] transition-colors duration-100 block"
            >
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-snug line-clamp-2 mb-1.5">
                {news.headline}
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  {news.source}
                </span>
                <span className="text-[var(--color-text-disabled)]">·</span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-disabled)]">
                  <Clock className="w-3 h-3" /> {news.time}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
