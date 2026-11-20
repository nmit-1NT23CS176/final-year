import { useState, useEffect, useRef } from "react";
import { MARKET_INDICES } from "@/lib/api";

export type MarketIndex = {
  label: string;
  price: string;
  change: string;
  changePct: string;
  isUp: boolean;
  live?: boolean;
};

async function fetchLiveIndices(): Promise<MarketIndex[]> {
  const res = await fetch("/api/indices");
  if (!res.ok) throw new Error(`/api/indices HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

export function useMarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>(MARKET_INDICES);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const refresh = async () => {
      try {
        const liveData = await fetchLiveIndices();

        // Merge live data over the static defaults — skip nulls (fetch failed for that symbol)
        setIndices((prev) =>
          prev.map((existing, i) => {
            const live = liveData[i];
            if (!live) return existing; // keep prior value if Yahoo failed
            return live;
          })
        );
      } catch (_err) {
        // Network/API failure — silently keep previous values
      }
    };

    // Initial fetch immediately
    refresh();

    // Poll every 15 seconds (Yahoo Finance's free tier is generous enough)
    const interval = setInterval(() => {
      if (!cancelledRef.current) refresh();
    }, 15_000);

    return () => {
      cancelledRef.current = true;
      clearInterval(interval);
    };
  }, []);

  return indices;
}
