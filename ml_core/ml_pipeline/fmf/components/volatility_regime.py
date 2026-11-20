import logging
import pandas as pd
import numpy as np

logger = logging.getLogger("fmf.volatility_regime")

class VolatilityRegimeDetector:
    """Step 6: Calculates rolling return volatility and assigns rule-based/clustered regime labels."""

    def compute_regimes(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        if "Vol_20d" not in df.columns and "Daily_Return" in df.columns:
            df["Vol_20d"] = df["Daily_Return"].rolling(20).std()

        if "Vol_20d" in df.columns:
            q_low = df["Vol_20d"].quantile(0.33)
            q_high = df["Vol_20d"].quantile(0.66)

            def get_regime(val):
                if pd.isna(val):
                    return "MEDIUM"
                if val >= q_high:
                    return "HIGH"
                elif val <= q_low:
                    return "LOW"
                else:
                    return "MEDIUM"

            df["volatility_regime_label"] = df["Vol_20d"].apply(get_regime)
        else:
            df["volatility_regime_label"] = "MEDIUM"

        return df
