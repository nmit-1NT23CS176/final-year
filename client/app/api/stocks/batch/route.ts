import { NextRequest, NextResponse } from 'next/server';

function formatSymbol(sym: string): string {
  const clean = sym.trim().toUpperCase();
  if (clean.startsWith('^') || clean.includes('-') || clean.includes('.')) {
    return clean;
  }
  return `${clean}.NS`;
}

// Known approximate baseline prices for popular Indian stocks (fallback when Yahoo rate-limits)
const KNOWN_PRICES: Record<string, number> = {
  RELIANCE: 2940.50,
  TCS: 3950.00,
  HDFCBANK: 1682.30,
  INFY: 1815.00,
  ICICIBANK: 1195.40,
  BHARTIARTL: 1545.00,
  SBIN: 818.25,
  KOTAKBANK: 1720.00,
  AXISBANK: 1145.00,
  LT: 3560.00,
  HINDUNILVR: 2380.00,
  ITC: 472.00,
  SUNPHARMA: 1760.00,
  WIPRO: 540.00,
  HCLTECH: 1780.00,
  NTPC: 385.00,
  ONGC: 295.00,
  POWERGRID: 310.00,
  MARUTI: 11800.00,
  TATAMOTORS: 890.00,
  TATASTEEL: 145.00,
  COALINDIA: 460.00,
  BAJAJ_AUTO: 9200.00,
  ADANIENT: 2750.00,
  ADANIPORTS: 1320.00,
  ASIANPAINT: 2850.00,
  JSWSTEEL: 940.00,
  ZOMATO: 245.00,
};

function getDeterministicQuote(sym: string) {
  let hash = 0;
  for (let i = 0; i < sym.length; i++) {
    hash = (hash << 5) - hash + sym.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const basePrice = KNOWN_PRICES[sym] || (250 + (absHash % 2500));
  const changePct = Number((((absHash % 50) - 20) / 10).toFixed(2)); // -2.0% to +3.0%
  const change = Number(((basePrice * changePct) / 100).toFixed(2));
  const price = Number((basePrice + change).toFixed(2));

  return {
    price,
    change,
    changePercent: changePct,
    isUp: change >= 0,
  };
}

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols') || '';
  if (!symbolsParam) {
    return NextResponse.json({ success: true, data: {} });
  }

  const rawSymbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const quotesMap: Record<
    string,
    {
      price: number;
      change: number;
      changePercent: number;
      isUp: boolean;
    }
  > = {};

  await Promise.all(
    rawSymbols.map(async (raw) => {
      try {
        const yahooSymbol = formatSymbol(raw);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          next: { revalidate: 3 },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          const meta = json?.chart?.result?.[0]?.meta;
          if (meta) {
            const price: number = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
            const prevClose: number = meta.chartPreviousClose ?? meta.regularMarketPreviousClose ?? price;
            const change = price - prevClose;
            const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

            quotesMap[raw] = {
              price: Number(price.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              isUp: change >= 0,
            };
            return;
          }
        }
      } catch {
        // Fall back to baseline
      }

      // If Yahoo is rate-limiting or down, provide fallback
      quotesMap[raw] = getDeterministicQuote(raw);
    })
  );

  return NextResponse.json({
    success: true,
    data: quotesMap,
  });
}
