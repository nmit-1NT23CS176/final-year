import api from './api';
import { WatchlistItem } from '../../shared/types/watchlist';

export const watchlistApi = {
  async getWatchlist(): Promise<{ data: WatchlistItem[]; count: number }> {
    const { data } = await api.get('/watchlist');
    return data;
  },

  async addToWatchlist(stockSymbol: string): Promise<{ data: WatchlistItem; message: string }> {
    const { data } = await api.post('/watchlist', { stockSymbol });
    return data;
  },

  async removeFromWatchlist(id: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/watchlist/${id}`);
    return data;
  },
};
