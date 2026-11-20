// ML API service — calls Next.js API routes (/api/ml/...) which proxy to FastAPI server-side.
// This avoids CORS issues since browser only talks to the same Next.js origin.

export interface NextDayTrendData {
  symbol: string;
  date: string;
  target_prediction: number;       // 1 = UP, 0 = DOWN, -1 = NO CLEAR SIGNAL
  trend_label: string;
  probability_score: number;       // 0.0 to 1.0
  confidence_level: 'HIGH' | 'MODERATE' | 'LOW' | 'NEUTRAL';
  confidence_score: number;
  volatility_regime: 'HIGH' | 'MEDIUM' | 'LOW';
  model_used: string;
  accuracy_benchmark: number;
  f1_benchmark: number;
  intelligence_score: number;      // 0 - 100 Composite Score
  signal_strength: 'VERY WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY STRONG';
  calibration_status: string;
  historical_oos_accuracy: number;
  historical_roc_auc: number;
  historical_30d_accuracy: number;
  historical_90d_accuracy: number;
  stock_historical_accuracy: number;
  reasons_breakdown: Array<{
    category: string;
    value: string;
    status: string;
    direction: 'POSITIVE' | 'NEGATIVE';
    explanation?: string;
  }>;
  prediction_history: Array<{
    date: string;
    symbol: string;
    predicted: string;
    probability: number;
    actual: string;
    result: 'HIT' | 'MISS';
  }>;
}

export interface ModelMetricsData {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export const mlApi = {
  async getForecast(
    symbol: string,
  ): Promise<{ success: boolean; data: NextDayTrendData }> {
    const res = await fetch(`/api/ml/forecast/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(`ML forecast HTTP ${res.status}`);
    return res.json();
  },

  async getMetrics(): Promise<{ success: boolean; data: ModelMetricsData[] }> {
    const res = await fetch('/api/ml/metrics');
    if (!res.ok) throw new Error(`ML metrics HTTP ${res.status}`);
    return res.json();
  },

  async getTickers(): Promise<{ success: boolean; data: string[] }> {
    const res = await fetch('/api/ml/tickers');
    if (!res.ok) throw new Error(`ML tickers HTTP ${res.status}`);
    return res.json();
  },
};
