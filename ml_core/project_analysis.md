# Financial Market Trend Forecasting — Project Analysis

## 1. Project Overview
This project builds a financial market trend forecasting system for Indian equities using a multi-source data pipeline and a comparative modeling framework.

The goal is to predict next-day market trend direction:
- `1` = Uptrend
- `0` = Downtrend

The project is designed as a **production-style ML system** with notebook-based experimentation first, followed by ETL pipeline conversion and MongoDB Atlas storage.

## 2. Core Research Objective
Determine which model family performs best under different stock volatility regimes in the Indian market:
- Random Forest
- XGBoost
- LSTM
- Transformer

Volatility-based stock categories:
- Volatile
- Stable
- Non-Volatile

## 3. Data Sources and Order
The project will use the following sources in this exact order:

1. **Stock Price Data** — Yahoo Finance (OHLCV for selected Nifty 100 stocks and Nifty index)
2. **Technical Indicators** — TA-Lib (RSI, MACD, EMA, SMA, Bollinger Bands, volume indicators)
3. **Global Market Proxies** — Yahoo Finance
   - `^GSPC` (S&P 500)
   - `^IXIC` (NASDAQ)
   - `^DJI` (Dow Jones)
   - `GC=F` (Gold)
   - `CL=F` (Crude Oil)
   - `INR=X` (USD/INR)
   - `^VIX` (Volatility Index)
4. **News Sentiment** — Alpha Vantage `NEWS_SENTIMENT`
   - ticker-wise daily sentiment score
   - article count
5. **Global Events** — GDELT
   - daily event count
   - tone
   - themes
6. **Macro Economic Data** — FRED
   - interest rate
   - inflation
   - unemployment
   - GDP

## 4. Project Structure

### Repository Layout
```text
Financial-Marketing-Forecasting/
├── ml_pipeline/
│   ├── financialmarketingforecasting/
│   │   ├── __init__.py
│   │   ├── components/
│   │   ├── pipeline/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── entity/
│   │   ├── logging/
│   │   └── exception/
│   ├── notebooks/
│   ├── Market_Data/
│   │   ├── raw/
│   │   ├── processed/
│   │   ├── features/
│   │   ├── final/
│   │   └── reports/
│   ├── requirements.txt
│   ├── setup.py
│   └── pyproject.toml
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

### Notebook Structure
```text
notebooks/
├── 01_problem_statement.ipynb
├── 02_stock_ingestion.ipynb
├── 03_technical_indicators.ipynb
├── 04_global_market_data.ipynb
├── 05_news_sentiment.ipynb
├── 06_gdelt_events.ipynb
├── 07_fred_macro_data.ipynb
├── 08_data_merging_and_alignment.ipynb
├── 09_data_checks_and_validation.ipynb
├── 10_eda.ipynb
├── 11_preprocessing_and_feature_engineering.ipynb
├── 12_volatility_clustering.ipynb
├── 13_model_training_baselines.ipynb
├── 14_model_training_lstm_transformer.ipynb
├── 15_model_comparison_and_selection.ipynb
└── 16_final_dataset_export.ipynb
```

## 5. Data Processing Strategy
The workflow is notebook-first for experimentation and validation.

### Phase A — Notebook Prototyping
Each source is tested independently in its own notebook.

### Phase B — Merge and Validate
A master notebook merges all sources, aligns dates, handles missing values, and validates feature integrity.

### Phase C — ETL Conversion
Once stable, logic is moved into Python modules under `financialmarketingforecasting/components` and `financialmarketingforecasting/pipeline`.

### Phase D — Persistence
Cleaned and feature-engineered datasets are stored in `Market_Data/` and later pushed to MongoDB Atlas.

## 6. Modeling Strategy
All models will be trained and evaluated separately for each volatility group.

### Baseline Models
- Random Forest
- XGBoost

### Sequence Models
- LSTM
- Transformer

### Evaluation Metrics
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

### Model Selection Rule
Use the validation set to select the best-performing model for each stock category. The test set is reserved for final reporting only.

## 7. Target Definition
The project is a classification problem.

Target rule:
- `1` if `Tomorrow_Close > Today_Close`
- `0` if `Tomorrow_Close < Today_Close`

## 8. Volatility Classification
Stocks will be grouped using historical return volatility.

Suggested rule:
- Top 33% volatility → Volatile
- Middle 33% → Stable
- Bottom 33% → Non-Volatile

## 9. Feature Engineering Plan
Features will include:

### Price Features
- Open
- High
- Low
- Close
- Volume

### Technical Features
- RSI
- MACD
- EMA
- SMA
- Bollinger Bands
- Volume indicators

### Global Market Features
- S&P 500 return
- NASDAQ return
- Dow Jones return
- Gold return
- Crude oil return
- USD/INR return
- VIX return

### News Features
- daily sentiment score
- article count
- lagged sentiment features
- sentiment rolling averages

### GDELT Features
- event count
- tone
- theme-based flags

### Macro Features
- interest rate
- inflation
- unemployment
- GDP

## 10. Implementation Order
The implementation order is fixed:

1. Download stock data
2. Download technical indicator inputs
3. Download global market data
4. Download news sentiment data
5. Download GDELT events
6. Download macroeconomic data
7. Merge all sources
8. Run data checks
9. Perform EDA
10. Generate features
11. Compute volatility groups
12. Train Random Forest
13. Train XGBoost
14. Train LSTM
15. Train Transformer
16. Compare models
17. Export final dataset
18. Move logic into ETL pipeline modules
19. Push cleaned data to MongoDB Atlas

## 11. Shared Engineering Rules
All contributors and agents must follow these rules:
- Use date-based splits only; do not use random split for time-series forecasting.
- Avoid data leakage.
- Keep raw, processed, and final datasets separate.
- Prefer modular code over notebook-only code.
- Every reusable function should eventually move into the package folder.
- Use consistent column names across all notebooks and modules.

## 12. Agent Responsibilities

### Agent 1 — Research / Data / Notebook Work
- Source data collection
- Feature engineering experiments
- notebook validation
- dataset merging
- volatility clustering
- model comparison experiments

### Agent 2 — Packaging / Pipeline / Integration
- package structure
- setup.py / requirements.txt maintenance
- ETL pipeline modules
- MongoDB integration
- logging and exception handling
- deployment-ready code structure

## 13. Output Artifacts
Expected outputs:
- raw CSV files
- merged dataset
- final model-ready dataset
- volatility grouping report
- model comparison report
- trained model artifacts
- MongoDB collections

## 14. Current Status
- Project scope defined
- Data source order defined
- Notebook strategy approved
- Package folder decided: `financialmarketingforecasting`
- Multi-agent implementation approach approved

## 15. Next Immediate Step
Create the first notebook:
`02_stock_ingestion.ipynb`

Then validate stock price download and date alignment before adding the other sources.


