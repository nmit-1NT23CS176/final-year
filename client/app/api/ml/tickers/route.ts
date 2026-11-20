import { NextResponse } from 'next/server';
import precomputedData from '@/lib/precomputed_forecasts.json';

const ML_URL = process.env.ML_SERVICE_URL || process.env.BACKEND_URL;

export async function GET() {
  if (ML_URL && !ML_URL.includes('localhost')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${ML_URL}/api/v1/tickers`, {
        signal: controller.signal,
        next: { revalidate: 300 },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.data) && data.data.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch {
      // Backend unavailable — fall through to precomputed 97 tickers
    }
  }

  return NextResponse.json({
    success: true,
    data: precomputedData.tickers,
  });
}
