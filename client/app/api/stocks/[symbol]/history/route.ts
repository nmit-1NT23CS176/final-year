import { NextRequest, NextResponse } from 'next/server';

function formatSymbol(sym: string): string {
  const clean = sym.trim().toUpperCase();
  if (clean.startsWith('^') || clean.includes('-') || clean.includes('.')) {
    return clean;
  }
  return `${clean}.NS`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await context.params;
  const rawSymbol = symbol.toUpperCase().replace('.NS', '');
  const yahooSymbol = formatSymbol(rawSymbol);
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '1mo';
  const interval = searchParams.get('interval') || '1d';

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Yahoo returned status ${res.status}`);
    }

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result || !result.timestamp) {
      return NextResponse.json({ success: true, data: [] });
    }

    const timestamps: number[] = result.timestamp;
    const quotes = result.indicators?.quote?.[0] || {};
    const opens = quotes.open || [];
    const highs = quotes.high || [];
    const lows = quotes.low || [];
    const closes = quotes.close || [];
    const volumes = quotes.volume || [];

    const candles = timestamps.map((ts, i) => {
      return {
        date: new Date(ts * 1000).toISOString(),
        time: ts,
        open: opens[i] != null ? opens[i] : closes[i],
        high: highs[i] != null ? highs[i] : closes[i],
        low: lows[i] != null ? lows[i] : closes[i],
        close: closes[i],
        volume: volumes[i] || 0,
      };
    }).filter(c => c.close != null);

    return NextResponse.json({
      success: true,
      data: candles,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch historical data',
      },
      { status: 502 }
    );
  }
}
