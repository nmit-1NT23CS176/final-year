import { create } from 'zustand'
import { WatchlistItem } from '../../shared/types/watchlist'
import { watchlistApi } from '@/services/watchlist-api'

interface WatchlistState {
  items: WatchlistItem[]
  isLoading: boolean
  error: string | null
  setItems: (items: WatchlistItem[]) => void
  addItem: (item: WatchlistItem) => void
  removeItem: (id: string) => void
  updateItemPrice: (symbol: string, price: number, change: number, changePercent: number) => void
  fetchWatchlist: () => Promise<void>
  addStock: (symbol: string) => Promise<void>
  deleteStock: (id: string) => Promise<void>
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),

  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),

  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),

  updateItemPrice: (symbol, price, change, changePercent) => set((state) => ({
    items: state.items.map(item => {
      if (item.stockSymbol === symbol && item.quote) {
        return { ...item, quote: { ...item.quote, currentPrice: price, change, changePercent } }
      }
      return item
    })
  })),

  fetchWatchlist: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await watchlistApi.getWatchlist()
      set({ items: res.data || [], isLoading: false })
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false })
    }
  },

  addStock: async (symbol: string) => {
    try {
      const res = await watchlistApi.addToWatchlist(symbol)
      if (res.data) {
        set((state) => ({ items: [res.data, ...state.items] }))
      }
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'An error occurred' })
    }
  },

  deleteStock: async (id: string) => {
    try {
      await watchlistApi.removeFromWatchlist(id)
      set((state) => ({ items: state.items.filter(i => i.id !== id) }))
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'An error occurred' })
    }
  },
}))
