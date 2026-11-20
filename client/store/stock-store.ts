import { create } from 'zustand'
import { Stock } from '../../shared/types/stock'

interface StockState {
  trendingStocks: Stock[]
  topGainers: Stock[]
  topLosers: Stock[]
  setTrendingStocks: (stocks: Stock[]) => void
  setTopGainers: (stocks: Stock[]) => void
  setTopLosers: (stocks: Stock[]) => void
  updateStockPrice: (symbol: string, price: number, change: number, changePercent: number) => void
}

export const useStockStore = create<StockState>((set) => ({
  trendingStocks: [],
  topGainers: [],
  topLosers: [],
  setTrendingStocks: (stocks) => set({ trendingStocks: stocks }),
  setTopGainers: (stocks) => set({ topGainers: stocks }),
  setTopLosers: (stocks) => set({ topLosers: stocks }),
  updateStockPrice: (symbol, price, change, changePercent) => set((state) => {
    const updateList = (list: Stock[]) => list.map(s => {
      if (s.symbol === symbol && s.quote) {
        return { ...s, quote: { ...s.quote, currentPrice: price, change, changePercent } }
      }
      return s
    })
    
    return {
      trendingStocks: updateList(state.trendingStocks),
      topGainers: updateList(state.topGainers),
      topLosers: updateList(state.topLosers),
    }
  })
}))
