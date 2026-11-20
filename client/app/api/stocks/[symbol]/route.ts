import { NextRequest, NextResponse } from 'next/server';

function formatSymbol(sym: string): string {
  const clean = sym.trim().toUpperCase();
  if (clean.startsWith('^') || clean.includes('-') || clean.includes('.')) {
    return clean;
  }
  return `${clean}.NS`;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await context.params;
  const rawSymbol = symbol.toUpperCase().replace('.NS', '');
  const yahooSymbol = formatSymbol(rawSymbol);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3 }, // Cache for 3 seconds for near real-time quotes
    });

    if (!res.ok) {
      throw new Error(`Yahoo returned status ${res.status}`);
    }

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta) {
      throw new Error(`No quote meta available for ${rawSymbol}`);
    }

    const currentPrice: number = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
    const previousClose: number = meta.chartPreviousClose ?? meta.regularMarketPreviousClose ?? currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    const companyName = meta.shortName || meta.longName || rawSymbol;

    const stockData = {
      symbol: rawSymbol,
      companyName,
      exchange: 'NSE',
      currency: meta.currency || 'INR',
      quote: {
        currentPrice,
        change,
        changePercent,
        dayHigh: meta.regularMarketDayHigh ?? meta.dayHigh ?? currentPrice,
        dayLow: meta.regularMarketDayLow ?? meta.dayLow ?? currentPrice,
        open: meta.regularMarketOpen ?? meta.chartPreviousClose ?? currentPrice,
        previousClose,
        volume: meta.regularMarketVolume ?? 0,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: stockData,
    });
  } catch (error: any) {
    console.error(`Error fetching real-time quote for ${rawSymbol}:`, error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch quote',
      },
      { status: 502 }
    );
  }
}
