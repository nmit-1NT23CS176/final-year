import { query } from '../database/db';
import { WatchlistItem } from '../../../shared/types/watchlist';

export class WatchlistModel {
  static async findByUser(userId: string): Promise<WatchlistItem[]> {
    const res = await query(
      `SELECT w.id, w.stock_symbol as "stockSymbol", w.added_at as "addedAt", s.company_name as "companyName"
       FROM watchlists w
       JOIN stocks s ON w.stock_symbol = s.symbol
       WHERE w.user_id = $1
       ORDER BY w.added_at DESC`,
      [userId]
    );
    return res.rows;
  }

  static async add(userId: string, stockSymbol: string): Promise<WatchlistItem> {
    const res = await query(
      `INSERT INTO watchlists (user_id, stock_symbol) 
       VALUES ($1, $2) 
       RETURNING id, stock_symbol as "stockSymbol", added_at as "addedAt"`,
      [userId, stockSymbol]
    );
    return res.rows[0];
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const res = await query(
      'DELETE FROM watchlists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (res.rowCount ?? 0) > 0;
  }

  static async exists(userId: string, stockSymbol: string): Promise<boolean> {
    const res = await query(
      'SELECT 1 FROM watchlists WHERE user_id = $1 AND stock_symbol = $2',
      [userId, stockSymbol]
    );
    return res.rows.length > 0;
  }
}
