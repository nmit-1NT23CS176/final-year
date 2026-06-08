import { Request, Response } from 'express';
import { StockService } from '../services/stock.service';
import { StockModel } from '../models/stock.model';

export class StocksController {
  static async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
        return;
      }

      const results = await StockModel.search(query, limit);
      
      res.status(200).json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getStockDetails(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol as string;
      const stock = await StockService.getStock(symbol);

      if (!stock) {
        res.status(404).json({ success: false, error: 'Stock not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: stock
      });
    } catch (err) {
      console.error('Get stock details error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getTrending(req: Request, res: Response) {
    try {
      // For now, return some hardcoded trending stocks until we have the aggregation logic
      const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
      const stocks = await Promise.all(symbols.map(s => StockService.getStock(s)));
      
      res.status(200).json({
        success: true,
        data: stocks.filter(Boolean)
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
