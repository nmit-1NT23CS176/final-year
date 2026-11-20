# Project Memory & System Log — MEMORY.md

> **Repository Root**: `c:\Users\Priyanshu\Desktop\Main\proj\final-year`  
> **Status**: Active Production Pipeline

---

## 1. System Identity
- **Goal**: End-to-end Financial Market Trend Forecasting System predicting Next-Day Stock Market Trend Direction (`1` = UP / `0` = DOWN).
- **Universe**: Nifty 100 stocks + Nifty index (^NSEI).
- **Input Data**: Stock OHLCV, Global Markets, FRED Macro, GDELT Events, News Sentiment.
- **Sequence Window**: 20 trading days.
- **Total Features**: 168 engineered features.

---

## 2. Completed Architecture Stages
- [x] **Data Ingestion Module** (`fmf/components/data_ingestion.py`): Downloads multi-source market data.
- [x] **Time-Aware Preprocessing** (`fmf/components/data_preprocessing.py`): Missing value handling, timestamp alignment, and $t-1$ lagging to prevent lookahead data leakage.
- [x] **Feature Engineering Engine** (`fmf/components/feature_engineering.py`): Technical indicators (RSI, MACD, EMA, SMA, BB, ATR), rolling stats, lag features.
- [x] **Volatility & Regime Detection** (`fmf/components/volatility_regime.py`): Standard deviation clustering into `HIGH`, `MEDIUM`, and `LOW` volatility regimes.
- [x] **Model Zoo & Loader** (`fmf/components/model_loader.py`): PyTorch Transformer (`.pt`), LSTM (`.pt`), XGBoost (`.pkl`), and Random Forest (`.pkl`).
- [x] **Next-Day Trend Predictor** (`fmf/components/predictor.py`): Generates Next-Day UP (`1`) / DOWN (`0`) direction, probability score, confidence rating, and regime routing.
- [x] **FastAPI Service** (`ml_core/ml_pipeline/app.py`): Serves REST endpoints for `/predict` and `/model-metrics`.
- [x] **Full-Stack Web UI** (`server` & `client`): Displays Next-Day UPTREND (Green) / DOWNTREND (Red) trend badges, probability gauge, and model metrics.
