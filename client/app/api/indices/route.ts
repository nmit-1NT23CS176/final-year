import { NextResponse } from 'next/server';

// Symbols to fetch live from Yahoo Finance
const INDICES = [
  { label: 'NIFTY 50',   symbol: '^NSEI'     },
  { label: 'SENSEX',     symbol: '^BSESN'    },
  { label: 'BANK NIFTY', symbol: '^NSEBANK'  },
  { label: 'INDIA VIX',  symbol: '^INDIAVIX' },
];

async function fetchYahooQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: {
      // Yahoo Finance requires a browser-like User-Agent to avoid 401/429
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
    next: { revalidate: 15 }, // ISR: cache for 15 seconds on Next.js edge
  });

  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status} for ${symbol}`);

  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta for ${symbol}`);

  const price: number = meta.regularMarketPrice ?? meta.chartPreviousClose;
  const prevClose: number = meta.chartPreviousClose ?? meta.regularMarketPreviousClose ?? price;
  const change = price - prevClose;
  const changePct = prevClose !== 0 ? (change / prevClose) * 100 : 0;

  return { price, change, changePct };
}

export async function GET() {
  const results = await Promise.all(
    INDICES.map(async (idx) => {
      try {
        const { price, change, changePct } = await fetchYahooQuote(idx.symbol);

        // Format price — VIX is small, indices are large
        const isVix = idx.symbol === '^INDIAVIX';
        const priceStr = isVix
          ? price.toFixed(2)
          : price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return {
          label: idx.label,
          price: priceStr,
          change: (change >= 0 ? '+' : '') + change.toFixed(2),
          changePct: (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
          isUp: change >= 0,
          live: true,
        };
      } catch (_err) {
        // If Yahoo fails for this symbol, return null (client will keep prior value)
        return null;
      }
    })
  );

  return NextResponse.json({ success: true, data: results });
}
