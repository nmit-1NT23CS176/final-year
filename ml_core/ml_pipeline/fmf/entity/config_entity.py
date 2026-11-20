from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Any

@dataclass
class DataIngestionConfig:
    stock_symbols: List[str] = field(default_factory=lambda: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"])
    global_indices: List[str] = field(default_factory=lambda: ["^GSPC", "^IXIC", "^DJI", "GC=F", "CL=F", "INR=X", "^VIX"])
    start_date: str = "2023-01-01"
    end_date: str = "2026-01-01"

@dataclass
class DataPreprocessingConfig:
    sequence_window: int = 20
    lag_days: int = 1

@dataclass
class FeatureEngineeringConfig:
    technical_indicators: List[str] = field(default_factory=lambda: ["RSI", "MACD", "EMA", "SMA", "Bollinger_Bands", "ATR"])
    total_features_count: int = 168

@dataclass
class ModelConfig:
    models_dir: Path
    sequence_window: int = 20
    uncertain_low: float = 0.48
    uncertain_high: float = 0.52
    default_threshold: float = 0.50

@dataclass
class TrendPredictionOutput:
    symbol: str
    date: str
    target_prediction: int        # 1 = UP, 0 = DOWN
    trend_label: str              # 'UPTREND' or 'DOWNTREND'
    probability_score: float      # Next-day upward probability
    confidence_level: str         # 'HIGH' or 'NEUTRAL'
    confidence_score: float       # Percentage confidence
    volatility_regime: str        # 'HIGH', 'MEDIUM', 'LOW'
    model_used: str               # Model family selected
    accuracy_benchmark: float     # Model accuracy on test set
    f1_benchmark: float           # Model F1-score on test set
    # Next-Gen Market Intelligence Fields
    intelligence_score: int              # 0 - 100 Composite Score
    signal_strength: str                 # VERY WEAK, WEAK, MODERATE, STRONG, VERY STRONG
    calibration_status: str              # Calibrated via Platt Scaling / Isotonic
    historical_oos_accuracy: float       # 0.5241 (52.4%)
    historical_roc_auc: float            # 0.548
    historical_30d_accuracy: float       # 0.567 (56.7%)
    historical_90d_accuracy: float       # 0.541 (54.1%)
    stock_historical_accuracy: float     # Per-stock 90d accuracy
    reasons_breakdown: List[Dict[str, Any]] # Interpretable 6-10 signals
    prediction_history: List[Dict[str, Any]] # Transparent last 5 prediction audit log

@dataclass
class ModelMetricsOutput:
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
