"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StockTable } from "@/components/stocks/StockTable";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GainersLosersStock {
  symbol: string;
  companyName?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface GainersLosersProps {
  gainers?: GainersLosersStock[];
  losers?: GainersLosersStock[];
  isLoading?: boolean;
  className?: string;
}

const MOCK_GAINERS: GainersLosersStock[] = [
  { symbol: "ADANIENT", companyName: "Adani Enterprises", currentPrice: 3200.50, change: 145.30, changePercent: 4.75 },
  { symbol: "TATAMOTORS", companyName: "Tata Motors", currentPrice: 985.25, change: 38.50, changePercent: 4.07 },
  { symbol: "BAJFINANCE", companyName: "Bajaj Finance", currentPrice: 7456.30, change: 253.80, changePercent: 3.52 },
  { symbol: "LTIM", companyName: "LTIMindtree", currentPrice: 5890.00, change: 165.40, changePercent: 2.89 },
  { symbol: "SBIN", companyName: "State Bank of India", currentPrice: 832.50, change: 19.60, changePercent: 2.41 },
];

const MOCK_LOSERS: GainersLosersStock[] = [
  { symbol: "WIPRO", companyName: "Wipro Limited", currentPrice: 452.30, change: -10.70, changePercent: -2.31 },
  { symbol: "SUNPHARMA", companyName: "Sun Pharmaceutical", currentPrice: 1245.80, change: -23.50, changePercent: -1.85 },
  { symbol: "NESTLEIND", companyName: "Nestlé India", currentPrice: 24680.00, change: -355.40, changePercent: -1.42 },
  { symbol: "HINDUNILVR", companyName: "Hindustan Unilever", currentPrice: 2378.50, change: -28.40, changePercent: -1.18 },
  { symbol: "BRITANNIA", companyName: "Britannia Industries", currentPrice: 5120.00, change: -46.30, changePercent: -0.90 },
];

export function GainersLosers({ gainers, losers, isLoading, className }: GainersLosersProps) {
  const displayGainers = gainers || MOCK_GAINERS;
  const displayLosers = losers || MOCK_LOSERS;

  return (
    <Card className={`bg-[var(--color-surface)] border-[var(--color-border)] ${className}`}>
      <CardContent className="p-0">
        <Tabs defaultValue="gainers">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <TabsList>
              <TabsTrigger value="gainers" className="gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Top Gainers
              </TabsTrigger>
              <TabsTrigger value="losers" className="gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                Top Losers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gainers" className="mt-0">
            <StockTable stocks={displayGainers} showRank />
          </TabsContent>

          <TabsContent value="losers" className="mt-0">
            <StockTable stocks={displayLosers} showRank />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
