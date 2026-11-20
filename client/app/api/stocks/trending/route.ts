import { NextResponse } from 'next/server';

function formatSymbol(sym: string): string {
  const clean = sym.trim().toUpperCase();
  if (clean.startsWith('^') || clean.includes('-') || clean.includes('.')) {
    return clean;
  }
  return `${clean}.NS`;
}

const TRENDING_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIARTL', 'SBIN', 'ITC'];

export async function GET() {
  const stocks = await Promise.all(
    TRENDING_SYMBOLS.map(async (symbol) => {
      try {
        const yahooSymbol = formatSymbol(symbol);
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          next: { revalidate: 10 },
        });

        if (!res.ok) return null;
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!meta) return null;

        const currentPrice: number = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
        const previousClose: number = meta.chartPreviousClose ?? meta.regularMarketPreviousClose ?? currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

        return {
          symbol,
          companyName: meta.shortName || meta.longName || symbol,
          exchange: 'NSE',
          quote: {
            currentPrice,
            change,
            changePercent,
            dayHigh: meta.regularMarketDayHigh ?? currentPrice,
            dayLow: meta.regularMarketDayLow ?? currentPrice,
            open: meta.regularMarketOpen ?? currentPrice,
            previousClose,
            volume: meta.regularMarketVolume ?? 0,
          },
        };
      } catch {
        return null;
      }
    })
  );

  return NextResponse.json({
    success: true,
    data: stocks.filter(Boolean),
  });
}
