import { StockQuote } from './stock';

export interface WatchlistItem {
  id: string;
  stockSymbol: string;
  companyName?: string;
  addedAt: string | Date;
  quote?: StockQuote;
}

export interface WatchlistResponse {
  success: boolean;
  data?: WatchlistItem[];
  count?: number;
  message?: string;
  error?: string;
}
