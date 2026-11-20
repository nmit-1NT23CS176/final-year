import { NextResponse } from 'next/server';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const res = await fetch(`${ML_URL}/api/v1/tickers`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      success: true,
      data: [
        'ABB', 'ADANIENSOL', 'ADANIENT', 'ADANIGREEN', 'ADANIPORTS', 'ADANIPOWER',
        'AMBUJACEM', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK', 'BAJAJ-AUTO', 'BAJAJFINSV',
        'BAJAJHLDNG', 'BAJFINANCE', 'BANKBARODA', 'BEL', 'BHARTIARTL', 'BOSCHLTD', 'BPCL',
        'BRITANNIA', 'CIPLA', 'COALINDIA', 'COLPAL', 'DLF', 'DRREDDY', 'EICHERMOT', 'GAIL',
        'GRASIM', 'HCLTECH', 'HDFCBANK', 'HDFCLIFE', 'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR',
        'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'INDIANB', 'IOC', 'IRCTC', 'ITC', 'JINDALSTEL',
        'JSWSTEEL', 'KOTAKBANK', 'LT', 'LTIM', 'LTI', 'MARUTI', 'NESTLEIND', 'NTPC', 'ONGC',
        'PIDILITIND', 'POWERGRID', 'RELIANCE', 'SBILIFE', 'SBIN', 'SHRIRAMFIN', 'SIEMENS',
        'SUNPHARMA', 'TATACONSUM', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM',
        'TITAN', 'TORNTPHARM', 'TRENT', 'ULTRACEMCO', 'UNITDSPR', 'VBL', 'WIPRO', 'ZOMATO'
      ],
    });
  }
}
