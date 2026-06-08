import { Response } from 'express';
import { WatchlistModel } from '../models/watchlist.model';
import { StockService } from '../services/stock.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class WatchlistController {
  static async getWatchlist(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const watchlist = await WatchlistModel.findByUser(userId);

      // Fetch live quotes for watchlist items
      const itemsWithQuotes = await Promise.all(watchlist.map(async (item) => {
        const stock = await StockService.getStock(item.stockSymbol);
        return {
          ...item,
          quote: stock?.quote
        };
      }));

      res.status(200).json({
        success: true,
        data: itemsWithQuotes,
        count: itemsWithQuotes.length
      });
    } catch (err) {
      console.error('Get watchlist error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async addStock(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { stockSymbol } = req.body;

      const exists = await WatchlistModel.exists(userId, stockSymbol);
      if (exists) {
        res.status(409).json({ success: false, error: `${stockSymbol} is already in your watchlist` });
        return;
      }

      // Ensure the stock exists in our DB
      const stock = await StockService.getStock(stockSymbol);
      if (!stock) {
        res.status(404).json({ success: false, error: 'Stock symbol not found' });
        return;
      }

      const item = await WatchlistModel.add(userId, stockSymbol);

      res.status(201).json({
        success: true,
        data: item,
        message: `${stockSymbol} added to watchlist`
      });
    } catch (err) {
      console.error('Add watchlist error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async removeStock(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const deleted = await WatchlistModel.delete(id, userId);
      
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Watchlist item not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Stock removed from watchlist'
      });
    } catch (err) {
      console.error('Remove watchlist error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
