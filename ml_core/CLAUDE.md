# CLAUDE.md — Claude Instructions

## Project: Financial Market Trend Forecasting

This project predicts Indian stock market trend direction using machine learning and deep learning models with multi-source financial data.

## Fixed Data Window
All data must be collected strictly between:
START DATE: 2023-01-01
END DATE: 2026-01-01

## Stock Universe
All Nifty 100 stocks + Nifty Index (^NSEI)

## Data Sources
1. Stock Price Data — Yahoo Finance
2. Technical Indicators — TA-Lib
3. Global Market Proxies — Yahoo Finance
4. News Sentiment — Alpha Vantage
5. Global Events — GDELT
6. Macro Economic Data — FRED

## Primary Objective
Research question:
Which model performs best under different stock volatility regimes in the Indian stock market?

## Stock Categories
- Volatile Stocks
- Stable Stocks
- Non-Volatile Stocks

## Feature Engineering Plan

### Price Features
- Open
- High
- Low
- Close
- Volume
- Returns

### Technical Indicators
- RSI
- MACD
- EMA
- SMA
- Bollinger Bands
- Volume indicators

### Global Market Features
- S&P 500 Return
- NASDAQ Return
- Dow Jones Return
- Gold Return
- Oil Return
- USD/INR Return
- VIX Return

### News Features
- News Sentiment Score
- Article Count
- Sentiment Rolling Mean (3-day, 7-day)
- Sentiment Lag Features

### GDELT Features
- Event Count
- Tone
- Theme Flags (War, Crisis, Inflation, Rate Hike)

### Macro Features
- Interest Rate
- Inflation
- Unemployment
- GDP

## Important ML Rules
- This is a time-series classification problem.
- Train/test split must be time-based.
- No future data should be used to predict past.
- Global data must be lagged by 1 day.
- News data must be lagged by 1 day.

## Model Training Strategy
For each stock category:
Train:
- Random Forest
- XGBoost
- LSTM
- Transformer

Then compare performance and select best model per category.

## Claude Responsibilities
Claude should focus on:
- Feature engineering logic
- Data merging logic
- Time-series alignment
- Handling missing values
- Volatility clustering logic
- Model training notebooks
- Model comparison
- Research analysis
- EDA and visualizations

## Final Output
The system should:
1. Classify stock into volatility category
2. Select best model for that category
3. Predict next-day trend (Up/Down)
