export interface StockQuote {
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh?: number;
  dayLow?: number;
  open?: number;
  previousClose?: number;
  volume?: number;
  marketCap?: number;
  peRatio?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

export interface StockProfile {
  industry?: string;
  website?: string;
  description?: string;
  logo?: string;
  employeeCount?: number;
  ipoDate?: string;
}

export interface Stock {
  symbol: string;
  companyName: string;
  sector?: string;
  exchange?: string;
  lastUpdated?: string | Date;
  quote?: StockQuote;
  profile?: StockProfile;
  watchlistCount?: number;
}

export interface CandleData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: string | number;
  value: number;
  color: string;
}
