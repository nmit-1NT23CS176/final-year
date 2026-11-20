import { NextRequest, NextResponse } from 'next/server';

const KNOWN_STOCKS = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries Limited', sector: 'Energy' },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services Limited', sector: 'IT' },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank Limited', sector: 'Financials' },
  { symbol: 'INFY', companyName: 'Infosys Limited', sector: 'IT' },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank Limited', sector: 'Financials' },
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Limited', sector: 'Telecom' },
  { symbol: 'SBIN', companyName: 'State Bank of India', sector: 'Financials' },
  { symbol: 'BAJFINANCE', companyName: 'Bajaj Finance Limited', sector: 'Financials' },
  { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank Limited', sector: 'Financials' },
  { symbol: 'LT', companyName: 'Larsen & Toubro Limited', sector: 'Capital Goods' },
  { symbol: 'HINDUNILVR', companyName: 'Hindustan Unilever Limited', sector: 'FMCG' },
  { symbol: 'ITC', companyName: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'SUNPHARMA', companyName: 'Sun Pharmaceutical Industries Limited', sector: 'Pharma' },
  { symbol: 'AXISBANK', companyName: 'Axis Bank Limited', sector: 'Financials' },
  { symbol: 'TITAN', companyName: 'Titan Company Limited', sector: 'Consumer' },
  { symbol: 'WIPRO', companyName: 'Wipro Limited', sector: 'IT' },
  { symbol: 'HCLTECH', companyName: 'HCL Technologies Limited', sector: 'IT' },
  { symbol: 'NTPC', companyName: 'NTPC Limited', sector: 'Power' },
  { symbol: 'ONGC', companyName: 'Oil and Natural Gas Corporation', sector: 'Energy' },
  { symbol: 'POWERGRID', companyName: 'Power Grid Corporation of India', sector: 'Power' },
  { symbol: 'MARUTI', companyName: 'Maruti Suzuki India Limited', sector: 'Auto' },
  { symbol: 'TATAMOTORS', companyName: 'Tata Motors Limited', sector: 'Auto' },
  { symbol: 'TATASTEEL', companyName: 'Tata Steel Limited', sector: 'Metals' },
  { symbol: 'COALINDIA', companyName: 'Coal India Limited', sector: 'Energy' },
  { symbol: 'BAJAJ-AUTO', companyName: 'Bajaj Auto Limited', sector: 'Auto' },
  { symbol: 'ADANIENT', companyName: 'Adani Enterprises Limited', sector: 'Metals' },
  { symbol: 'ADANIPORTS', companyName: 'Adani Ports and Special Economic Zone', sector: 'Infrastructure' },
  { symbol: 'ASIANPAINT', companyName: 'Asian Paints Limited', sector: 'Consumer' },
  { symbol: 'JSWSTEEL', companyName: 'JSW Steel Limited', sector: 'Metals' },
  { symbol: 'ZOMATO', companyName: 'Zomato Limited', sector: 'Consumer' },
];

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);

  if (!q) {
    return NextResponse.json({ success: true, data: [], count: 0 });
  }

  const queryUpper = q.toUpperCase();
  const matched = KNOWN_STOCKS.filter(
    (s) => s.symbol.includes(queryUpper) || s.companyName.toUpperCase().includes(queryUpper)
  ).slice(0, limit);

  return NextResponse.json({
    success: true,
    data: matched.map((s) => ({
      symbol: s.symbol,
      companyName: s.companyName,
      sector: s.sector,
      exchange: 'NSE',
    })),
    count: matched.length,
  });
}
