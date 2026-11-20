import { YahooService } from './yahoo.service';
import { CacheService } from './cache.service';
import { StockModel } from '../models/stock.model';
import { Stock } from '../../../shared/types/stock';

export class StockService {
  /**
   * Get complete stock info: Quote + Profile
   * Implements cache-aside pattern
   */
  static async getStock(symbol: string): Promise<Stock | null> {
    const symbolUpper = symbol.toUpperCase();
    const cacheKey = `stock:${symbolUpper}`;

    // 1. Check Redis Cache
    const cachedStock = await CacheService.get<Stock>(cacheKey);
    if (cachedStock) {
      return cachedStock;
    }

    // 2. Fetch from Yahoo Finance API
    const [quote, profile] = await Promise.all([
      YahooService.getQuote(symbolUpper),
      YahooService.getProfile(symbolUpper)
    ]);

    if (!quote && !profile) {
      return null;
    }

    // 3. Upsert into Database (to keep our stocks catalog updated)
    const companyName = profile?.description ? profile.description.split(' ')[0] : symbolUpper; // Simplified
    await StockModel.upsert(symbolUpper, companyName, profile?.industry, 'NSE'); // Defaulting exchange to NSE for now

    const stockData: Stock = {
      symbol: symbolUpper,
      companyName,
      sector: profile?.industry,
      exchange: 'NSE',
      quote: quote || undefined,
      profile: profile || undefined
    };

    // 4. Save to Cache (TTL 30 seconds to prevent hammering API)
    await CacheService.set(cacheKey, stockData, 30);

    return stockData;
  }
}
