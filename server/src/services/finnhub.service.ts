import axios from 'axios';
import { StockQuote, StockProfile, CandleData } from '../../../shared/types/stock';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox_placeholder';
const BASE_URL = 'https://finnhub.io/api/v1';

export class FinnhubService {
  static async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const res = await axios.get(`${BASE_URL}/quote`, {
        params: { symbol, token: FINNHUB_API_KEY }
      });
      
      const data = res.data;
      if (!data || Object.keys(data).length === 0 || data.c === 0) return null;

      return {
        currentPrice: data.c,
        change: data.d,
        changePercent: data.dp,
        dayHigh: data.h,
        dayLow: data.l,
        open: data.o,
        previousClose: data.pc,
      };
    } catch (err) {
      console.error(`Error fetching quote for ${symbol}:`, err);
      return null;
    }
  }

  static async getProfile(symbol: string): Promise<StockProfile | null> {
    try {
      const res = await axios.get(`${BASE_URL}/stock/profile2`, {
        params: { symbol, token: FINNHUB_API_KEY }
      });
      
      const data = res.data;
      if (!data || Object.keys(data).length === 0) return null;

      return {
        industry: data.finnhubIndustry,
        website: data.weburl,
        logo: data.logo,
        description: `${data.name} is a publicly traded company.`, // Basic placeholder if not available
        ipoDate: data.ipo,
      };
    } catch (err) {
      console.error(`Error fetching profile for ${symbol}:`, err);
      return null;
    }
  }
}
