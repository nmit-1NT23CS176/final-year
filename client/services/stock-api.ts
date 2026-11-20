import api from './api';
import { Stock } from '../../shared/types/stock';

export const stockApi = {
  async searchStocks(query: string, limit: number = 10): Promise<{ data: Stock[]; count: number }> {
    const { data } = await api.get('/stocks/search', { params: { q: query, limit } });
    return data;
  },

  async getStockDetails(symbol: string): Promise<{ data: Stock }> {
    const { data } = await api.get(`/stocks/${encodeURIComponent(symbol)}`);
    return data;
  },

  async getTrending(): Promise<{ data: Stock[] }> {
    const { data } = await api.get('/stocks/trending');
    return data;
  },
};
