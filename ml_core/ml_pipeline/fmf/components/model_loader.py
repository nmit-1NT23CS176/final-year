import json
import logging
import pickle
from pathlib import Path
from typing import Dict, Any, List, Optional

import torch
import torch.nn as nn

logger = logging.getLogger("fmf.model_loader")


class LSTMClassifier(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 128, num_layers: int = 2, dropout: float = 0.3):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.dropout = nn.Dropout(dropout)
        self.head = nn.Linear(hidden_size, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out, _ = self.lstm(x)
        return self.head(self.dropout(out[:, -1, :])).squeeze(-1)


class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 20):
        super().__init__()
        self.pe = nn.Parameter(torch.zeros(1, max_len, d_model))
        nn.init.normal_(self.pe, mean=0.0, std=0.02)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.pe[:, : x.size(1), :]


class TransformerClassifier(nn.Module):
    def __init__(self, input_size: int, d_model: int = 64, n_heads: int = 4,
                 num_layers: int = 2, dropout: float = 0.3, max_len: int = 20):
        super().__init__()
        self.proj = nn.Linear(input_size, d_model)
        self.pos_enc = PositionalEncoding(d_model=d_model, max_len=max_len)
        enc_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=n_heads, dropout=dropout,
            batch_first=True, dim_feedforward=d_model * 4, activation="gelu",
        )
        self.encoder = nn.TransformerEncoder(enc_layer, num_layers=num_layers)
        self.dropout = nn.Dropout(dropout)
        self.head = nn.Linear(d_model, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.proj(x)
        h = self.pos_enc(h)
        h = self.encoder(h)
        return self.head(self.dropout(h[:, -1, :])).squeeze(-1)


class ModelLoader:
    """Loads and holds all trained ML model artifacts.

    After retraining, models expect top-60 features (not 163).
    Falls back to 163 if no top_features.json found (backward compat).
    """

    def __init__(self, models_dir: Path, device: Optional[torch.device] = None):
        self.models_dir = Path(models_dir)
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.xgb_model: Any = None
        self.rf_model: Any = None
        self.transformer_model: Optional[TransformerClassifier] = None
        self.lstm_model: Optional[LSTMClassifier] = None
        self.scaler: Any = None
        self.top_features: Optional[List[str]] = None
        self.ensemble_config: Dict = {
            "transformer_weight": 0.5,
            "lstm_weight": 0.5,
            "xgb_weight": 0.0,
            "threshold": 0.50,
            "routing": "flat",
        }

    def load_all(self, feature_dim: int = 163) -> "ModelLoader":
        """Load all model artifacts. Reads top_features.json to determine input dim."""
        logger.info(f"Loading model artifacts from {self.models_dir} on device {self.device}")

        # ── Top features list (determines input_size for DL models) ──
        feat_path = self.models_dir / "top_features.json"
        if feat_path.exists():
            with open(feat_path, "r") as f:
                self.top_features = json.load(f)
            feature_dim = len(self.top_features)
            logger.info(f"Top features loaded: {feature_dim} features")
        else:
            logger.info(f"No top_features.json; using default feature_dim={feature_dim}")

        # ── Scaler ──
        scaler_path = self.models_dir / "feature_scaler.pkl"
        if scaler_path.exists():
            with open(scaler_path, "rb") as f:
                self.scaler = pickle.load(f)
            logger.info("StandardScaler loaded")

        # ── XGBoost ──
        xgb_path = self.models_dir / "xgb_baseline.pkl"
        if xgb_path.exists():
            with open(xgb_path, "rb") as f:
                self.xgb_model = pickle.load(f)
            logger.info("XGBoost baseline loaded")

        # ── Random Forest ──
        rf_path = self.models_dir / "rf_baseline.pkl"
        if rf_path.exists():
            with open(rf_path, "rb") as f:
                self.rf_model = pickle.load(f)
            logger.info("RandomForest baseline loaded")

        # Load PyTorch Transformer
        trf_path = self.models_dir / "transformer_model.pt"
        if trf_path.exists():
            state = torch.load(trf_path, map_location=self.device, weights_only=False)
            if "input_proj.weight" in state:
                state["proj.weight"] = state.pop("input_proj.weight")
            if "input_proj.bias" in state:
                state["proj.bias"] = state.pop("input_proj.bias")
            proj_w = state.get("proj.weight")
            trf_in_dim = proj_w.shape[1] if proj_w is not None else feature_dim
            self.transformer_model = TransformerClassifier(input_size=trf_in_dim).to(self.device)
            self.transformer_model.load_state_dict(state)
            self.transformer_model.eval()
            logger.info(f"PyTorch Transformer loaded (input_size={trf_in_dim})")

        # Load PyTorch LSTM
        lstm_path = self.models_dir / "lstm_model.pt"
        if lstm_path.exists():
            state = torch.load(lstm_path, map_location=self.device, weights_only=False)
            hh_w = state.get("lstm.weight_hh_l0")
            if hh_w is not None:
                hidden_dim = hh_w.shape[0] // 4
            else:
                head_w = state.get("head.weight")
                hidden_dim = head_w.shape[1] if head_w is not None else 64
            ih_w = state.get("lstm.weight_ih_l0")
            in_dim = ih_w.shape[1] if ih_w is not None else feature_dim
            self.lstm_model = LSTMClassifier(input_size=in_dim, hidden_size=hidden_dim).to(self.device)
            self.lstm_model.load_state_dict(state)
            self.lstm_model.eval()
            logger.info(f"PyTorch LSTM loaded (input_size={in_dim}, hidden_size={hidden_dim})")

        # ── Ensemble config ──
        ens_path = self.models_dir / "ensemble_config.json"
        if ens_path.exists():
            with open(ens_path, "r") as f:
                self.ensemble_config = json.load(f)
            logger.info(f"Ensemble config loaded: {self.ensemble_config}")

        return self
