import logging
from typing import Dict, List, Optional
import pandas as pd
import numpy as np

logger = logging.getLogger("fmf.data_ingestion")

class DataIngestion:
    """Step 1-3: Ingests raw stock prices, global markets, macro data, and event features."""

    def __init__(self, symbols: Optional[List[str]] = None):
        self.symbols = symbols or ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"]

    def fetch_stock_data(self, ticker: str) -> pd.DataFrame:
        """Fetch OHLCV stock data via yfinance or load from raw store."""
        try:
            import yfinance as yf
            formatted = f"{ticker}.NS" if not ticker.endswith(".NS") and not ticker.startswith("^") else ticker
            df = yf.download(formatted, start="2023-01-01", progress=False)
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            df = df.reset_index()
            df["Ticker"] = ticker
            return df
        except Exception as e:
            logger.warning(f"Unable to fetch live stock data for {ticker}: {e}")
            return pd.DataFrame()

    def fetch_global_market_data(self) -> pd.DataFrame:
        """Fetch S&P500, NASDAQ, Dow, Gold, Crude Oil, USD/INR, VIX data."""
        indices = ["^GSPC", "^IXIC", "^DJI", "GC=F", "CL=F", "INR=X", "^VIX"]
        try:
            import yfinance as yf
            df = yf.download(indices, start="2023-01-01", progress=False)["Close"]
            df = df.reset_index()
            return df
        except Exception as e:
            logger.warning(f"Unable to fetch global market proxies: {e}")
            return pd.DataFrame()
