import pandas as pd
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

FINAL_DIR = Path("c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/Market_Data/final")

print("--- SECTION 1 ---")
df34 = pd.read_parquet(FINAL_DIR / "step34_3_regime_persistence.parquet")
df33 = pd.read_parquet(FINAL_DIR / "step33_cost_aware_portfolio.parquet")

print("Step-33 actual_return std:", df33["actual_return"].std())
print("Step-34.3 actual_return std:", df34["actual_return"].std())

print("\nStep-33 actual_return:\n", df33["actual_return"].describe())
print("\nStep-34.3 actual_return:\n", df34["actual_return"].describe())

merged_3334 = df33.merge(df34, on=["date", "ticker"], suffixes=("_33", "_34"))
diff = (merged_3334["actual_return_33"] - merged_3334["actual_return_34"]).abs().mean()
corr = merged_3334["actual_return_33"].corr(merged_3334["actual_return_34"])
sign_agree = (merged_3334["actual_return_33"] * merged_3334["actual_return_34"] > 0).mean()

print(f"\nactual_return_33 vs actual_return_34:")
print(f"  Mean abs diff:    {diff:.6f}")
print(f"  Pearson corr:     {corr:.4f}")
print(f"  Sign agreement:   {sign_agree:.3f}")

print("\nLag sweep: Step-34.3 actual_return vs Step-33 actual_return")
df_s = merged_3334.sort_values(["ticker", "date"])
for lag in range(-5, 6):
    shifted = df_s.groupby("ticker")["actual_return_34"].shift(lag)
    c = shifted.corr(df_s["actual_return_33"])
    print(f"  Lag {lag:+d}: corr={c:.4f}")

print("\n--- SECTION 2 ---")
df28 = pd.read_parquet(FINAL_DIR / "ensemble_alpha_results.parquet")
df28 = df28.rename(columns={"Date": "date", "Ticker": "ticker"})

if "record_type" in df28.columns:
    print("record_type values:", df28["record_type"].value_counts())
    df28 = df28[df28["record_type"] == "prediction"].copy()

assert "target_future_return_t3" in df28.columns
assert df28["target_future_return_t3"].notna().all()

target_map = df28[["date", "ticker", "target_future_return_t3"]].drop_duplicates()
print(f"Target map: {len(target_map)} rows, "
      f"{target_map['date'].nunique()} dates, "
      f"{target_map['ticker'].nunique()} tickers")

df34_restored = df34.merge(target_map, on=["date", "ticker"], how="left")
null_count = df34_restored["target_future_return_t3"].isna().sum()
print(f"Missing after join: {null_count}")

print("\n--- SECTION 3 ---")
ic_broken = df34_restored.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()

ic_restored = df34_restored.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["target_future_return_t3"], method="spearman"),
    include_groups=False
).mean()

print(f"IC (pred_score vs actual_return):           {ic_broken:.6f}  <- broken")
print(f"IC (pred_score vs target_future_return_t3): {ic_restored:.6f}  <- restored")
print(f"Expected:                                    0.026841")
print(f"Match: {'YES' if abs(ic_restored - 0.026841) < 0.005 else 'NO'}")

print("\n--- SECTION 4 ---")
df34_restored["actual_return"] = df34_restored["target_future_return_t3"]
ic_final = df34_restored.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()
print(f"Final IC after remap: {ic_final:.6f}")
df34_restored.to_parquet(FINAL_DIR / "step34_3_corrected.parquet")
