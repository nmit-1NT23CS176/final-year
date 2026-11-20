import { NextRequest, NextResponse } from 'next/server';

function formatSymbol(sym: string): string {
  const clean = sym.trim().toUpperCase();
  if (clean.startsWith('^') || clean.includes('-') || clean.includes('.')) {
    return clean;
  }
  return `${clean}.NS`;
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
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          next: { revalidate: 3 },
        });

        if (!res.ok) return;
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!meta) return;

        const price: number = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
        const prevClose: number = meta.chartPreviousClose ?? meta.regularMarketPreviousClose ?? price;
        const change = price - prevClose;
        const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

        quotesMap[raw] = {
          price,
          change,
          changePercent,
          isUp: change >= 0,
        };
      } catch {
        // Skip on individual failure
      }
    })
  );

  return NextResponse.json({
    success: true,
    data: quotesMap,
  });
}
