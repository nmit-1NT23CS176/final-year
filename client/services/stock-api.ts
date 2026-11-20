import { Stock } from '../../shared/types/stock';

export const stockApi = {
  async searchStocks(query: string, limit: number = 10): Promise<{ data: Stock[]; count: number }> {
    const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error(`Search error: ${res.status}`);
    return res.json();
  },

  async getStockDetails(symbol: string): Promise<{ data: Stock }> {
    const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(`Stock details error: ${res.status}`);
    return res.json();
  },

  async getTrending(): Promise<{ data: Stock[] }> {
    const res = await fetch('/api/stocks/trending');
    if (!res.ok) throw new Error(`Trending error: ${res.status}`);
    return res.json();
  },

  async getHistorical(symbol: string, _period1?: string): Promise<{ data: any[] }> {
    const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/history`);
    if (!res.ok) throw new Error(`Historical error: ${res.status}`);
    return res.json();
  },
};
