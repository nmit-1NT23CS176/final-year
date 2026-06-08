import yahooFinance from 'yahoo-finance2';
import { StockQuote, StockProfile } from '../../../shared/types/stock';

export class YahooService {
  /**
   * Automatically append .NS if the symbol doesn't have an exchange suffix, 
   * to default to NSE (National Stock Exchange of India).
   */
  private static formatSymbol(symbol: string): string {
    if (!symbol.includes('.')) {
      return `${symbol}.NS`;
    }
    return symbol;
  }

  static async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const formattedSymbol = this.formatSymbol(symbol);
      const quote: any = await yahooFinance.quote(formattedSymbol);
      
      if (!quote || !quote.regularMarketPrice) return null;

      return {
        currentPrice: quote.regularMarketPrice,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        open: quote.regularMarketOpen,
        previousClose: quote.regularMarketPreviousClose,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow
      };
    } catch (err) {
      console.error(`Error fetching Yahoo quote for ${symbol}:`, err);
      return null;
    }
  }

  static async getProfile(symbol: string): Promise<StockProfile | null> {
    try {
      const formattedSymbol = this.formatSymbol(symbol);
      const profile: any = await yahooFinance.quoteSummary(formattedSymbol, { modules: ['assetProfile', 'summaryProfile'] });
      
      const assetProfile = profile.assetProfile || profile.summaryProfile;
      if (!assetProfile) return null;

      return {
        industry: assetProfile.industry,
        website: assetProfile.website,
        description: assetProfile.longBusinessSummary,
        employeeCount: assetProfile.fullTimeEmployees,
      };
    } catch (err) {
      console.error(`Error fetching Yahoo profile for ${symbol}:`, err);
      return null;
    }
  }
}
