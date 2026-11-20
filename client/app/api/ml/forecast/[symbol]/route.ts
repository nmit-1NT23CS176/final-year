import { NextRequest, NextResponse } from 'next/server';
import precomputedData from '@/lib/precomputed_forecasts.json';

const ML_URL = process.env.ML_SERVICE_URL || process.env.BACKEND_URL;
const forecastsMap = precomputedData.forecasts as Record<string, any>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;
  const cleanSymbol = symbol.toUpperCase();

  if (ML_URL && !ML_URL.includes('localhost')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${ML_URL}/api/v1/forecast/${encodeURIComponent(cleanSymbol)}`, {
        signal: controller.signal,
        next: { revalidate: 30 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.intelligence_score !== undefined) {
          return NextResponse.json(data);
        }
      }
    } catch {
      // Backend temporarily offline — fall through to precomputed forecast
    }
  }

  const forecast = forecastsMap[cleanSymbol];
  if (forecast) {
    return NextResponse.json({
      success: true,
      data: forecast,
    });
  }

  return NextResponse.json({
    success: false,
    error: `Symbol ${cleanSymbol} not found`,
  }, { status: 404 });
}
