# Financial Market Trend Forecasting System — CONTEXT.md

> **Repository Root**: `c:\Users\Priyanshu\Desktop\Main\proj\final-year`  
> **Last Updated**: 2026-08-26  
> **Status**: Active Production Pipeline & UI Integration

---

## 1. Project Overview & Objective

The primary objective of this system is to predict **Next-Day Stock Market Trend Direction**:
- **`1` / `UP`** = Uptrend (`Tomorrow_Close > Today_Close`)
- **`0` / `DOWN`** = Downtrend (`Tomorrow_Close < Today_Close`)

Along with probability scores, confidence levels, volatility regimes, and model metrics.

---

## 2. 15-Step System Architecture Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FINANCIAL MARKET TREND FORECASTING SYSTEM                       │
└────────────────────────────────────────────────────────────────────────────────────────┘

 [1. Data Sources]       ► Stock Data (Yahoo Finance), Global Markets (S&P500, NASDAQ, DOW,
                           VIX, Gold, Oil, USDINR), FRED Macro, GDELT Events, News Sentiment.
 [2. Data Ingestion]     ► API Fetching, Data Collection, Raw Validation (fmf/components/data_ingestion.py)
 [3. Raw Storage]        ► Parquet / CSV / Database Historical Repository
 [4. Preprocessing]      ► Cleaning, NaN Handling, Daily Alignment, t-1 Lagging (fmf/components/data_preprocessing.py)
 [5. Feature Engine]     ► 168 Features: RSI, MACD, EMA, SMA, BB, ATR, Lags (fmf/components/feature_engineering.py)
 [6. Volatility Regime]  ► Rolling Volatility Calculation, HIGH/MEDIUM/LOW Clusters (fmf/components/volatility_regime.py)
 [7. Feature Dataset]    ► 168 Features, Target Variable (Next-Day Direction), 20-Day Sequences
 [8. Forecasting Models] ► Baseline: Random Forest & XGBoost (.pkl)
                           Deep Learning: PyTorch LSTM & Transformer (.pt) (fmf/components/model_loader.py)
 [9. Metrics Engine]     ► Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix
 [10. Model Selection]   ► Regime-Aware Performance Comparison & Dynamic Model Routing
 [11. Explainability]    ► SHAP Analysis, Feature Importance, Model Interpretation
 [12. Model Repository]  ► Saved Artifacts (.pkl, .pt, metrics JSON)
 [13. FastAPI Server]    ► REST APIs for Prediction Service & Model Serving (ml_core/ml_pipeline/app.py)
 [14. Frontend UI]       ► Next.js Dashboard: Trend Prediction View, Probability Gauge, Model Metrics
 [15. Prediction Output] ► Input: Latest Market Data  ►  Output: UP / DOWN Direction & Probability Score
```

---

## 3. Technology Stack

- **ML Core**: Python 3.11+, PyTorch (Transformer & LSTM), XGBoost, Scikit-Learn, Pandas, NumPy, TA-Lib.
- **API Server**: FastAPI (Port 8000).
- **Backend**: Express.js 5 / TypeScript (Port 5000).
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons (Port 3000).

---

## 4. Key Endpoints

- `POST /api/v1/predict` — Next-day UP/DOWN trend forecast for stock symbol.
- `POST /api/v1/predict/batch` — Next-day predictions across Nifty 100 universe.
- `GET /api/v1/model-metrics` — Performance comparison (Accuracy, Precision, Recall, F1, ROC-AUC).
