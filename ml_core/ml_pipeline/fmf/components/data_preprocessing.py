import logging
import pandas as pd
import numpy as np

logger = logging.getLogger("fmf.data_preprocessing")

class DataPreprocessor:
    """Step 4: Performs data cleaning, timestamp alignment, and t-1 lagging to prevent data leakage."""

    def __init__(self, lag_days: int = 1):
        self.lag_days = lag_days

    def clean_and_align(self, df: pd.DataFrame) -> pd.DataFrame:
        """Fills missing values and enforces sequential date ordering per ticker."""
        if df.empty:
            return df

        df = df.copy()
        if "Date" in df.columns:
            df["Date"] = pd.to_datetime(df["Date"])
            df = df.sort_values(["Ticker", "Date"] if "Ticker" in df.columns else ["Date"])

        # Forward fill then backward fill missing values per ticker
        if "Ticker" in df.columns:
            df = df.groupby("Ticker", group_keys=False).apply(lambda g: g.ffill().bfill())
        else:
            df = df.ffill().bfill()

        return df

    def apply_t1_lag(self, df: pd.DataFrame, external_cols: list) -> pd.DataFrame:
        """Lags external features (news, macro, global markets) by 1 day to strictly eliminate lookahead bias."""
        df = df.copy()
        for col in external_cols:
            if col in df.columns:
                if "Ticker" in df.columns:
                    df[f"{col}_lag1"] = df.groupby("Ticker")[col].shift(self.lag_days)
                else:
                    df[f"{col}_lag1"] = df[col].shift(self.lag_days)
        return df
