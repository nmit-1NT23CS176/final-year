from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import logging

from fmf.pipeline.inference_pipeline import InferencePipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fmf.api")

app = FastAPI(
    title="Financial Market Trend Forecasting System API",
    description="Next-Day Stock Market Trend Direction Prediction (UP/DOWN) & Model Evaluation Metrics API",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = InferencePipeline()

@app.on_event("startup")
def startup_event():
    try:
        pipeline.initialize()
        logger.info("Next-Day Market Trend Forecasting Pipeline initialized.")
    except Exception as e:
        logger.error(f"Error during pipeline startup: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Financial Market Trend Forecasting System API",
        "pipeline_initialized": pipeline.is_initialized,
    }

@app.get("/api/v1/forecast/{symbol}")
def get_forecast(symbol: str):
    """Predict Next-Day Stock Market Trend Direction (UP/DOWN) and probability score for symbol."""
    try:
        pred = pipeline.predict_next_day_trend(symbol.upper())
        return {
            "success": True,
            "data": {
                "symbol": pred.symbol,
                "date": pred.date,
                "target_prediction": pred.target_prediction,
                "trend_label": pred.trend_label,
                "probability_score": pred.probability_score,
                "confidence_level": pred.confidence_level,
                "confidence_score": pred.confidence_score,
                "volatility_regime": pred.volatility_regime,
                "model_used": pred.model_used,
                "accuracy_benchmark": pred.accuracy_benchmark,
                "f1_benchmark": pred.f1_benchmark,
                # Next-Gen Market Intelligence Fields
                "intelligence_score": pred.intelligence_score,
                "signal_strength": pred.signal_strength,
                "calibration_status": pred.calibration_status,
                "historical_oos_accuracy": pred.historical_oos_accuracy,
                "historical_roc_auc": pred.historical_roc_auc,
                "historical_30d_accuracy": pred.historical_30d_accuracy,
                "historical_90d_accuracy": pred.historical_90d_accuracy,
                "stock_historical_accuracy": pred.stock_historical_accuracy,
                "reasons_breakdown": pred.reasons_breakdown,
                "prediction_history": pred.prediction_history,
            }
        }
    except Exception as e:
        logger.error(f"Error predicting next-day trend for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/tickers")
def get_tickers():
    """Returns list of all available NSE stock tickers in the dataset."""
    try:
        df = pipeline.get_latest_dataset()
        col = "ticker" if "ticker" in df.columns else "Ticker"
        tickers = sorted(df[col].dropna().unique().tolist())
        return {
            "success": True,
            "data": tickers
        }
    except Exception as e:
        logger.error(f"Error retrieving tickers list: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/model-metrics")
def get_model_metrics():
    """Returns Step 9 Evaluation & Metrics Engine results across model families."""
    try:
        metrics = pipeline.get_model_metrics()
        return {
            "success": True,
            "data": metrics,
        }
    except Exception as e:
        logger.error(f"Error retrieving model metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
