import { useState, useEffect } from "react";
import { MARKET_INDICES } from "@/lib/api";
import { stockApi } from "@/services/stock-api";

export const INDEX_SYMBOLS: Record<string, string> = {
  'NIFTY 50': '^NSEI',
  'SENSEX': '^BSESN',
  'BANK NIFTY': '^NSEBANK',
  'INDIA VIX': '^INDIAVIX',
  'NASDAQ': '^IXIC',
  'S&P 500': '^GSPC',
  'Bitcoin': 'BTC-USD'
};

export function useMarketIndices() {
  const [indices, setIndices] = useState(MARKET_INDICES);

  useEffect(() => {
    let cancelled = false;

    const fetchIndices = async () => {
      try {
        const updated = await Promise.all(
          MARKET_INDICES.map(async (idx) => {
            const symbol = INDEX_SYMBOLS[idx.label];
            if (!symbol) return idx;

            try {
              const res = await stockApi.getStockDetails(symbol);
              if (res?.data?.quote) {
                const quote = res.data.quote;
                return {
                  ...idx,
                  price: quote.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                  change: (quote.change > 0 ? "+" : "") + quote.change.toFixed(2),
                  changePct: (quote.changePercent > 0 ? "+" : "") + quote.changePercent.toFixed(2) + "%",
                  isUp: quote.change >= 0
                };
              }
            } catch (err) {
              // Ignore single failure
            }
            return idx;
          })
        );
        if (!cancelled) setIndices(updated);
      } catch (err) {
        // Overall failure
      }
    };

    fetchIndices();
    const t = setInterval(fetchIndices, 5000);

    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return indices;
}
