import { query } from '../database/db';
import { Stock } from '../../../shared/types/stock';

export class StockModel {
  static async findBySymbol(symbol: string): Promise<Stock | null> {
    const res = await query('SELECT * FROM stocks WHERE symbol = $1', [symbol]);
    return res.rows[0] || null;
  }

  static async search(q: string, limit: number = 10): Promise<Stock[]> {
    const searchPattern = `%${q}%`;
    const res = await query(
      `SELECT symbol, company_name as "companyName", sector, exchange, last_updated as "lastUpdated"
       FROM stocks 
       WHERE symbol ILIKE $1 OR company_name ILIKE $1 
       LIMIT $2`,
      [searchPattern, limit]
    );
    return res.rows;
  }

  static async upsert(symbol: string, companyName: string, sector?: string, exchange?: string): Promise<Stock> {
    const res = await query(
      `INSERT INTO stocks (symbol, company_name, sector, exchange, last_updated) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (symbol) DO UPDATE 
       SET company_name = EXCLUDED.company_name, 
           sector = COALESCE(EXCLUDED.sector, stocks.sector), 
           exchange = COALESCE(EXCLUDED.exchange, stocks.exchange),
           last_updated = CURRENT_TIMESTAMP
       RETURNING symbol, company_name as "companyName", sector, exchange, last_updated as "lastUpdated"`,
      [symbol, companyName, sector, exchange]
    );
    return res.rows[0];
  }
}
