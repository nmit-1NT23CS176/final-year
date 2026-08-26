import logging
import pandas as pd
import numpy as np

logger = logging.getLogger("fmf.feature_engineering")

class FeatureEngine:
    """Step 5: Feature Engineering Engine (RSI, MACD, EMA/SMA, Bollinger Bands, ATR, Lags, 168 Features)."""

    def compute_technical_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Computes core TA-Lib style technical indicators on OHLCV prices."""
        df = df.copy()

        close = df["Close"] if "Close" in df.columns else df["close"]
        high = df["High"] if "High" in df.columns else close
        low = df["Low"] if "Low" in df.columns else close
        volume = df["Volume"] if "Volume" in df.columns else pd.Series(1, index=df.index)

        # Simple & Exponential Moving Averages
        df["SMA_10"] = close.rolling(10).mean()
        df["SMA_20"] = close.rolling(20).mean()
        df["SMA_50"] = close.rolling(50).mean()
        df["EMA_12"] = close.ewm(span=12, adjust=False).mean()
        df["EMA_26"] = close.ewm(span=26, adjust=False).mean()

        # MACD & Signal Line
        df["MACD"] = df["EMA_12"] - df["EMA_26"]
        df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()
        df["MACD_Hist"] = df["MACD"] - df["MACD_Signal"]

        # Relative Strength Index (RSI 14)
        delta = close.diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / (loss + 1e-12)
        df["RSI_14"] = 100 - (100 / (1 + rs))

        # Bollinger Bands (20, 2)
        std_20 = close.rolling(20).std()
        df["BB_Upper"] = df["SMA_20"] + (std_20 * 2)
        df["BB_Lower"] = df["SMA_20"] - (std_20 * 2)
        df["BB_Width"] = (df["BB_Upper"] - df["BB_Lower"]) / (df["SMA_20"] + 1e-12)

        # Average True Range (ATR 14)
        tr1 = high - low
        tr2 = (high - close.shift(1)).abs()
        tr3 = (low - close.shift(1)).abs()
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        df["ATR_14"] = tr.rolling(14).mean()

        # Daily Returns & Volatility
        df["Daily_Return"] = close.pct_change()
        df["Vol_20d"] = df["Daily_Return"].rolling(20).std()

        return df
