// ──────────────────────────────────────────────────────
//  StockVista — Central API Client
//  Backend: FastAPI at localhost:8000 (proxied via Next.js rewrites)
// ──────────────────────────────────────────────────────

// In the browser: use relative URL (proxied by Next.js)
// In SSR / Node: use full backend URL
export const API_BASE =
  typeof window === "undefined"
    ? (process.env.BACKEND_URL ?? "http://localhost:8000")
    : ""


// ── Generic fetch helper ────────────────────────────────
export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>,
  opts?: RequestInit,
): Promise<T> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.BACKEND_URL ?? 'http://localhost:8000')
  const url = new URL(path, baseUrl)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`)
  return res.json()
}

// ── Response Types (mapped from actual OpenAPI responses) ──
export interface TickersResponse {
  success: boolean
  data: string[]
}

export interface ReasonBreakdown {
  category: string
  value: string
  status: string
  direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  explanation: string
}

export interface PredictionHistory {
  date: string
  symbol: string
  predicted: 'UPTREND' | 'DOWNTREND'
  probability: number
  actual: 'UP' | 'DOWN'
  result: 'HIT' | 'MISS'
}

export interface ForecastData {
  symbol: string
  date: string
  target_prediction: -1 | 0 | 1
  trend_label: string
  probability_score: number        // 0–1 float
  confidence_level: string
  confidence_score: number
  volatility_regime: 'LOW' | 'MEDIUM' | 'HIGH'
  model_used: string
  accuracy_benchmark: number
  f1_benchmark: number
  intelligence_score: number       // 0–100  (the "AI Score" shown in UI)
  signal_strength: string
  calibration_status: string
  historical_oos_accuracy: number
  historical_roc_auc: number
  historical_30d_accuracy: number
  historical_90d_accuracy: number
  stock_historical_accuracy: number
  reasons_breakdown: ReasonBreakdown[]
  prediction_history: PredictionHistory[]
}

export interface ForecastResponse {
  success: boolean
  data: ForecastData
}

export interface ModelMetric {
  model_name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  roc_auc: number
}

export interface ModelMetricsResponse {
  success: boolean
  data: ModelMetric[]
}

// ── Derived helpers ─────────────────────────────────────
/** Maps target_prediction → UI signal label */
export function signalLabel(prediction: -1 | 0 | 1): 'BULLISH' | 'BEARISH' | 'NO SIGNAL' {
  if (prediction === 1) return 'BULLISH'
  if (prediction === 0) return 'BEARISH'
  return 'NO SIGNAL'
}

/** Maps target_prediction → isUp boolean */
export function isUp(prediction: -1 | 0 | 1): boolean {
  return prediction === 1
}

/** direction string → emoji */
export function directionIcon(direction: string): string {
  if (direction === 'POSITIVE') return '🟢'
  if (direction === 'NEGATIVE') return '🔴'
  return '🟡'
}

/** Formats probability_score (0–1) → "57%" */
export function fmtProb(score: number): string {
  return `${Math.round(score * 100)}%`
}

/** Stable "batch fetch" — fetch a subset of tickers in parallel, with concurrency limit */
export async function fetchForecastBatch(
  symbols: string[],
  limit = 10,
): Promise<ForecastData[]> {
  const results: ForecastData[] = []
  for (let i = 0; i < symbols.length; i += limit) {
    const chunk = symbols.slice(i, i + limit)
    const settled = await Promise.allSettled(
      chunk.map((s) => apiFetch<ForecastResponse>(`/api/v1/forecast/${s}`)),
    )
    settled.forEach((r) => {
      if (r.status === 'fulfilled' && r.value.success) results.push(r.value.data)
    })
  }
  return results
}

// ── Static market data (no market data API available on backend) ──
// These are displayed alongside real AI signals
export const MARKET_INDICES = [
  { label: 'NIFTY 50',    price: '25,412.30', change: '+212.40', changePct: '+0.84%', isUp: true },
  { label: 'SENSEX',      price: '83,241.15', change: '+588.10', changePct: '+0.71%', isUp: true },
  { label: 'BANK NIFTY',  price: '56,182.40', change: '-118.60', changePct: '-0.21%', isUp: false },
  { label: 'INDIA VIX',   price: '13.80',     change: '-0.34',   changePct: '-2.40%', isUp: true },
]

// Sector mapping for stocks
export const SECTOR_MAP: Record<string, string> = {
  RELIANCE: 'Energy', TCS: 'IT', HDFCBANK: 'Financials', INFY: 'IT', ICICIBANK: 'Financials',
  BHARTIARTL: 'Telecom', BAJFINANCE: 'Financials', KOTAKBANK: 'Financials', AXISBANK: 'Financials',
  SBIN: 'Financials', LT: 'Capital Goods', HINDUNILVR: 'FMCG', ITC: 'FMCG', SUNPHARMA: 'Pharma',
  WIPRO: 'IT', HCLTECH: 'IT', TATASTEEL: 'Metals', JSWSTEEL: 'Metals', NTPC: 'Power',
  POWERGRID: 'Power', ONGC: 'Energy', BPCL: 'Energy', COALINDIA: 'Energy', GAIL: 'Energy',
  TITAN: 'Consumer', MARUTI: 'Auto', TATAMOTORS: 'Auto', 'BAJAJ-AUTO': 'Auto',
  M$M: 'Auto', DRREDDY: 'Pharma', CIPLA: 'Pharma', DIVISLAB: 'Pharma', APOLLOHOSP: 'Healthcare',
  ASIANPAINT: 'Consumer', BRITANNIA: 'FMCG', NESTLEIND: 'FMCG', DMART: 'Retail',
  ADANIPORTS: 'Infrastructure', DLF: 'Real Estate',
}

export function getSector(symbol: string): string {
  return SECTOR_MAP[symbol] ?? 'Diversified'
}

export function getCap(symbol: string): string {
  const large = [
    'RELIANCE','TCS','HDFCBANK','INFY','ICICIBANK','BHARTIARTL','BAJFINANCE',
    'KOTAKBANK','AXISBANK','SBIN','LT','HINDUNILVR','ITC','SUNPHARMA','WIPRO',
    'HCLTECH','NTPC','ONGC','COALINDIA','TITAN','MARUTI','ADANIPORTS',
  ]
  return large.includes(symbol) ? 'LARGE CAP' : 'MID CAP'
}
