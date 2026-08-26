"""
extend_dataset_2026.py
======================
Extends the market dataset from 2025-12-30 to 2026-06-30 by fetching
the latest stock price data, global market proxies, calculating technical
indicators, macro features, rolling statistics, and regime labels.

Saves extended dataset as:
  Market_Data/processed/dataset_2026_extended.parquet
"""

import sys
import logging
from pathlib import Path
import pandas as pd
import numpy as np
import yfinance as yf

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
log = logging.getLogger("extend_2026")

BASE_DIR = Path(__file__).resolve().parent
ORIG_DATA_PATH = BASE_DIR / "Market_Data" / "processed" / "final_model_dataset_with_volatility.parquet"
OUTPUT_DATA_PATH = BASE_DIR / "Market_Data" / "processed" / "dataset_2026_extended.parquet"

def main():
    log.info(f"Loading original dataset from {ORIG_DATA_PATH}...")
    df_orig = pd.read_parquet(ORIG_DATA_PATH)
    df_orig["Date"] = pd.to_datetime(df_orig["Date"])
    df_orig["Ticker"] = df_orig["Ticker"].astype(str)

    max_orig_date = df_orig["Date"].max()
    log.info(f"Original dataset shape: {df_orig.shape}, Max Date: {max_orig_date.date()}")

    tickers = sorted(df_orig["Ticker"].unique().tolist())
    log.info(f"Processing extension through 2026-06-30 for {len(tickers)} tickers...")

    # Fetch new price data from 2025-11-01 to 2026-07-01 (overlap ensures technical indicator calculation)
    yf_tickers = [f"{t}.NS" for t in tickers]
    log.info("Downloading stock price data via yfinance...")
    raw_stocks = yf.download(yf_tickers, start="2025-11-01", end="2026-07-01", progress=False)

    # Fetch global market proxies
    global_symbols = ["^GSPC", "^IXIC", "^DJI", "GC=F", "CL=F", "INR=X", "^VIX", "^NSEI"]
    log.info("Downloading global market proxies via yfinance...")
    raw_global = yf.download(global_symbols, start="2025-11-01", end="2026-07-01", progress=False)["Close"]

    # Calculate global returns
    global_ret = pd.DataFrame(index=raw_global.index)
    if "^GSPC" in raw_global:  global_ret["SP500_RET"]  = raw_global["^GSPC"].pct_change()
    if "^DJI" in raw_global:   global_ret["DOW_RET"]    = raw_global["^DJI"].pct_change()
    if "^IXIC" in raw_global:  global_ret["NASDAQ_RET"] = raw_global["^IXIC"].pct_change()
    if "GC=F" in raw_global:   global_ret["GOLD_RET"]   = raw_global["GC=F"].pct_change()
    if "CL=F" in raw_global:   global_ret["OIL_RET"]    = raw_global["CL=F"].pct_change()
    if "INR=X" in raw_global:  global_ret["USDINR_RET"] = raw_global["INR=X"].pct_change()
    if "^VIX" in raw_global:   global_ret["VIX_RET"]    = raw_global["^VIX"].pct_change()
    if "^NSEI" in raw_global:  global_ret["NIFTY_RET"]  = raw_global["^NSEI"].pct_change()
    global_ret = global_ret.fillna(0.0)

    extended_ticker_dfs = []

    for tkr in tickers:
        try:
            # Extract single ticker stock OHLCV
            tkr_yf = f"{tkr}.NS"
            if ("Close", tkr_yf) in raw_stocks.columns:
                df_t = pd.DataFrame({
                    "Open":   raw_stocks[("Open", tkr_yf)],
                    "High":   raw_stocks[("High", tkr_yf)],
                    "Low":    raw_stocks[("Low", tkr_yf)],
                    "Close":  raw_stocks[("Close", tkr_yf)],
                    "Volume": raw_stocks[("Volume", tkr_yf)],
                }).dropna(subset=["Close"]).reset_index()
            else:
                continue

            df_t["Date"] = pd.to_datetime(df_t["Date"])
            df_t["Ticker"] = tkr
            df_t = df_t.sort_values("Date").reset_index(drop=True)

            # Get macro/global returns for these dates
            df_t = pd.merge(df_t, global_ret, on="Date", how="left").fillna(0.0)

            # Forward-fill GDELT & FRED static macro features from historical average/last known
            orig_tkr = df_orig[df_orig["Ticker"] == tkr].sort_values("Date")
            last_known_event = orig_tkr["Event_Count"].mean() if "Event_Count" in orig_tkr else 1.0
            last_known_tone  = orig_tkr["Avg_Tone"].mean() if "Avg_Tone" in orig_tkr else 0.0
            last_interest    = orig_tkr["Interest_Rate"].iloc[-1] if "Interest_Rate" in orig_tkr else 6.5
            last_inflation   = orig_tkr["Inflation"].iloc[-1] if "Inflation" in orig_tkr else 4.8
            last_unemp       = orig_tkr["Unemployment"].iloc[-1] if "Unemployment" in orig_tkr else 7.1

            df_t["Event_Count"]    = last_known_event
            df_t["Avg_Tone"]       = last_known_tone
            df_t["War_Flag"]       = 0.0
            df_t["Crisis_Flag"]    = 0.0
            df_t["Inflation_Flag"] = 0.0
            df_t["Rate_Hike_Flag"] = 0.0
            df_t["Recession_Flag"] = 0.0
            df_t["Interest_Rate"]  = last_interest
            df_t["Inflation"]      = last_inflation
            df_t["Unemployment"]   = last_unemp

            # Calculate technical indicators
            close = df_t["Close"]
            high  = df_t["High"]
            low   = df_t["Low"]
            vol   = df_t["Volume"]

            df_t["Return"] = close.pct_change()
            df_t["RSI"] = 100 - (100 / (1 + (close.diff().clip(lower=0).rolling(14).mean() / ((-close.diff().clip(upper=0)).rolling(14).mean() + 1e-12))))
            df_t["ROC"] = close.pct_change(10) * 100
            df_t["EMA_20"] = close.ewm(span=20, adjust=False).mean()
            df_t["SMA_20"] = close.rolling(20).mean()
            df_t["MACD"]   = close.ewm(span=12, adjust=False).mean() - close.ewm(span=26, adjust=False).mean()
            df_t["MACD_Signal"] = df_t["MACD"].ewm(span=9, adjust=False).mean()

            std_20 = close.rolling(20).std()
            df_t["BB_upper"] = df_t["SMA_20"] + (2 * std_20)
            df_t["BB_lower"] = df_t["SMA_20"] - (2 * std_20)

            tr = pd.concat([high - low, (high - close.shift(1)).abs(), (low - close.shift(1)).abs()], axis=1).max(axis=1)
            df_t["ATR"] = tr.rolling(14).mean()

            df_t["Volatility_20"] = df_t["Return"].rolling(20).std()
            df_t["Volatility_50"] = df_t["Return"].rolling(50).std()
            df_t["Volume_MA_20"]  = vol.rolling(20).mean()
            df_t["OBV"] = (np.sign(df_t["Return"].fillna(0.0)) * vol).cumsum()

            # Target: Next-day return sign (1 if tomorrow's Close > today's Close else 0)
            df_t["target"] = (close.shift(-1) > close).astype(float)

            # Lags 1..3 for base features
            base_cols_to_lag = ["Return", "RSI", "ROC", "EMA_20", "SMA_20", "MACD", "MACD_Signal",
                                "BB_upper", "BB_lower", "ATR", "Volatility_20", "Volatility_50",
                                "Volume_MA_20", "OBV", "SP500_RET", "DOW_RET", "GOLD_RET",
                                "OIL_RET", "USDINR_RET", "VIX_RET", "NIFTY_RET", "Event_Count",
                                "Avg_Tone", "War_Flag", "Crisis_Flag", "Inflation_Flag",
                                "Rate_Hike_Flag", "Recession_Flag", "Interest_Rate", "Inflation", "Unemployment"]

            for col in base_cols_to_lag:
                if col in df_t.columns:
                    for lag in [1, 2, 3]:
                        df_t[f"{col}_lag_{lag}"] = df_t[col].shift(lag)

            # Log return lag alias if needed
            df_t["Log_Return_lag_1"] = df_t["Return_lag_1"]
            df_t["Log_Return_lag_2"] = df_t["Return_lag_2"]
            df_t["Log_Return_lag_3"] = df_t["Return_lag_3"]
            df_t["GDP_lag_1"] = 0.0
            df_t["GDP_lag_2"] = 0.0
            df_t["GDP_lag_3"] = 0.0
            if "NASDAQ_RET_lag_1" not in df_t:
                df_t["NASDAQ_RET_lag_1"] = df_t["SP500_RET_lag_1"]
                df_t["NASDAQ_RET_lag_2"] = df_t["SP500_RET_lag_2"]
                df_t["NASDAQ_RET_lag_3"] = df_t["SP500_RET_lag_3"]

            # Rolling stats (5, 10, 20)
            for w in [5, 10, 20]:
                df_t[f"return_roll_mean_{w}"] = df_t["Return"].rolling(w).mean()
                df_t[f"return_roll_std_{w}"]  = df_t["Return"].rolling(w).std()
                df_t[f"momentum_{w}"]         = close.pct_change(w)
                df_t[f"volume_roll_mean_{w}"] = vol.rolling(w).mean()
                df_t[f"volume_roll_std_{w}"]  = vol.rolling(w).std()

            # Volatility regime labels based on 20-day volatility
            vol20 = df_t["Volatility_20"].fillna(0.01)
            med_vol, high_vol = vol20.quantile(0.33), vol20.quantile(0.66)
            df_t["volatility_regime"] = np.where(vol20 < med_vol, 0, np.where(vol20 < high_vol, 1, 2))
            df_t["volatility_regime_label"] = np.where(vol20 < med_vol, "LOW", np.where(vol20 < high_vol, "MEDIUM", "HIGH"))
            df_t["volatility_cluster"] = df_t["volatility_regime"]
            df_t["vol_cluster_label"] = df_t["volatility_regime"]
            df_t["vol_cluster_regime_name"] = df_t["volatility_regime_label"]
            df_t["volatility_cluster_gmm"] = df_t["volatility_regime"]
            df_t["regime_change"] = (df_t["volatility_regime"].diff() != 0).astype(float)
            df_t["regime_persistence"] = df_t["volatility_regime"].rolling(5).apply(lambda x: len(set(x)) == 1, raw=False).fillna(1.0)
            df_t["regime_lag_1"] = df_t["volatility_regime"].shift(1).fillna(0)
            df_t["regime_lag_2"] = df_t["volatility_regime"].shift(2).fillna(0)
            df_t["cluster_lag_1"] = df_t["volatility_regime"].shift(1).fillna(0)
            df_t["cluster_lag_2"] = df_t["volatility_regime"].shift(2).fillna(0)

            # Filter only dates after max_orig_date
            new_df_t = df_t[df_t["Date"] > max_orig_date].copy()
            # Drop last row if target is NaN due to shift(-1)
            new_df_t = new_df_t.dropna(subset=["target"])
            extended_ticker_dfs.append(new_df_t)

        except Exception as e:
            log.warning(f"Error processing ticker {tkr}: {e}")

    # Concatenate extension and align columns with original dataset
    df_ext_new = pd.concat(extended_ticker_dfs, ignore_index=True)
    log.info(f"New extension rows fetched: {len(df_ext_new):,} ({df_ext_new['Date'].min().date()} to {df_ext_new['Date'].max().date()})")

    # Align column schema exactly
    orig_cols = df_orig.columns.tolist()
    for col in orig_cols:
        if col not in df_ext_new.columns:
            df_ext_new[col] = 0.0

    df_ext_new = df_ext_new[orig_cols]

    # Combine historical parquet + new extension data
    df_full_extended = pd.concat([df_orig, df_ext_new], ignore_index=True)
    df_full_extended = df_full_extended.sort_values(["Ticker", "Date"]).drop_duplicates(subset=["Ticker", "Date"]).reset_index(drop=True)

    log.info(f"Combined Extended Dataset Shape: {df_full_extended.shape}")
    log.info(f"Full Date Range: {df_full_extended['Date'].min().date()} to {df_full_extended['Date'].max().date()}")

    # Save to disk
    df_full_extended.to_parquet(OUTPUT_DATA_PATH)
    log.info(f"✓ Extended dataset successfully written to: {OUTPUT_DATA_PATH}")

if __name__ == "__main__":
    main()
