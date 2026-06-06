# AGENTS.md — Codex Instructions

## Project: Financial Market Trend Forecasting

This project builds a stock market trend prediction system for Indian equities using ML/DL models and multi-source financial data.

## Fixed Data Window
All data must be collected strictly between:
START DATE: 2023-01-01
END DATE: 2026-01-01

Do not download data outside this range.

## Stock Universe
All Nifty 100 stocks + Nifty Index (^NSEI)

## Data Sources (Use in this order)
1. Stock Price Data — Yahoo Finance (OHLCV for Nifty 100 stocks and Nifty index)
2. Technical Indicators — TA-Lib (RSI, MACD, EMA, SMA, Bollinger Bands, Volume indicators)
3. Global Market Proxies — Yahoo Finance:
   ^GSPC (S&P 500)
   ^IXIC (NASDAQ)
   ^DJI (Dow Jones)
   GC=F (Gold)
   CL=F (Crude Oil)
   INR=X (USD/INR)
   ^VIX (Volatility Index)
4. News Sentiment — Alpha Vantage NEWS_SENTIMENT
5. Global Events — GDELT
6. Macro Economic Data — FRED (Interest Rate, Inflation, Unemployment, GDP)

## Repository Structure
Financial-Marketing-Forecasting/
│
├── ml_pipeline/
│   ├── financialmarketingforecasting/
│   │   ├── components/
│   │   ├── pipeline/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── entity/
│   │   ├── logging/
│   │   ├── exception/
│   │   └── constant/
│   │
│   ├── notebooks/
│   ├── Market_Data/
│   │   ├── raw/
│   │   ├── processed/
│   │   ├── features/
│   │   ├── final/
│   │   └── reports/
│   │
│   ├── requirements.txt
│   ├── setup.py
│   └── pyproject.toml
│
├── backend/
├── frontend/
└── README.md

## Notebook Execution Order
1. 01_problem_statement.ipynb
2. 02_stock_ingestion.ipynb
3. 03_technical_indicators.ipynb
4. 04_global_market_data.ipynb
5. 05_news_sentiment.ipynb
6. 06_gdelt_events.ipynb
7. 07_fred_macro_data.ipynb
8. 08_data_merging_and_alignment.ipynb
9. 09_data_checks_and_validation.ipynb
10. 10_eda.ipynb
11. 11_preprocessing_and_feature_engineering.ipynb
12. 12_volatility_clustering.ipynb
13. 13_model_training_baselines.ipynb
14. 14_model_training_lstm_transformer.ipynb
15. 15_model_comparison_and_selection.ipynb
16. 16_final_dataset_export.ipynb

## ML Problem Definition
Target variable:
If Tomorrow Close > Today Close → 1
Else → 0

Binary classification problem.

## Volatility Classification
Stocks must be classified into:
- Volatile (Top 33%)
- Stable (Middle 33%)
- Non-Volatile (Bottom 33%)

Based on standard deviation of daily returns.

## Models To Train
- Random Forest
- XGBoost
- LSTM
- Transformer

Train models separately for each volatility category.

## Evaluation Metrics
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

Model selection must be based on validation data only.

## Engineering Rules
- Do NOT use random train-test split.
- Use time-series split only.
- Avoid data leakage.
- Always shift global and news data by 1 day.
- Keep raw, processed, and final datasets separate.
- All reusable code must be moved into the package folder.

## Codex Responsibilities
Codex should focus on:
- Writing ETL pipeline modules
- Writing data ingestion scripts
- Writing data validation scripts
- Writing data transformation scripts
- Writing model trainer modules
- Writing model evaluation modules
- Writing MongoDB integration
- Packaging (setup.py, requirements.txt)
- Logging and exception handling
