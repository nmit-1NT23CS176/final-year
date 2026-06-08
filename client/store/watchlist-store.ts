import { create } from 'zustand'
import { WatchlistItem } from '../../../shared/types/watchlist'

interface WatchlistState {
  items: WatchlistItem[]
  setItems: (items: WatchlistItem[]) => void
  addItem: (item: WatchlistItem) => void
  removeItem: (id: string) => void
  updateItemPrice: (symbol: string, price: number, change: number, changePercent: number) => void
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
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
  }))
}))
