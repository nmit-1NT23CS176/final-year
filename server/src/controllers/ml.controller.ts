import { Request, Response } from 'express';
import { MLService } from '../services/ml.service';

export class MLController {
  static async getForecast(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol as string;
      if (!symbol) {
        res.status(400).json({ success: false, error: 'Symbol parameter is required' });
        return;
      }
      const forecast = await MLService.getNextDayTrend(symbol);
      res.status(200).json({
        success: true,
        data: forecast,
      });
    } catch (err) {
      console.error('getForecast controller error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve next-day trend prediction' });
    }
  }

  static async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await MLService.getModelMetrics();
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      console.error('getMetrics controller error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve model metrics' });
    }
  }
}
