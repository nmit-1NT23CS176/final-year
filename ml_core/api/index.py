import os
import sys
from pathlib import Path

# Ensure ml_pipeline and fmf package can be found on sys.path
base_dir = Path(__file__).resolve().parent.parent
ml_pipeline_dir = base_dir / "ml_pipeline"
if str(base_dir) not in sys.path:
    sys.path.insert(0, str(base_dir))
if str(ml_pipeline_dir) not in sys.path:
    sys.path.insert(0, str(ml_pipeline_dir))

from ml_pipeline.app import app

# Export app for Vercel Serverless Function
handler = app
