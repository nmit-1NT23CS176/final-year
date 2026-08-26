import numpy as np
import pandas as pd

df = pd.read_parquet('c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/Market_Data/final/step34_3_regime_persistence.parquet')

print("--- BUG 2 DIAGNOSTICS ---")
print("Check 1: Date range:", df["date"].min(), "->", df["date"].max())
print("\nCheck 2: Signal stats:\n", df["pred_score"].describe())
print("\nCheck 3: Actual return mean:", df["actual_return"].mean())
print("Check 3: Actual return std:", df["actual_return"].std())

bench = df.copy()
if 'weight' not in bench.columns and 'weight_new' in bench.columns:
    bench['weight'] = bench['weight_new']
bench_pivot = bench.pivot(index='date', columns='ticker', values='weight').fillna(0)
turnover_daily = bench_pivot.diff().abs().sum(axis=1).fillna(0)
w_t_minus_1 = bench_pivot.shift(1).fillna(0)
ret_pivot = bench.pivot(index='date', columns='ticker', values='actual_return').fillna(0)
port_returns_no_cost = (w_t_minus_1 * ret_pivot).sum(axis=1)
zc_sharpe = (port_returns_no_cost.mean() / (port_returns_no_cost.std() + 1e-12)) * np.sqrt(252)

print("\nCheck 4: Zero-cost benchmark Sharpe:", zc_sharpe)

print("\nCheck 4.5: pred_score nulls:", df["pred_score"].isna().sum())
print("Check 4.5: pred_score min/max:", df["pred_score"].min(), df["pred_score"].max())
if "rank_pct" in df.columns:
    daily_rank_std = df.groupby("date")["rank_pct"].std()
    print("Mean daily rank std:", daily_rank_std.mean())
else:
    print("rank_pct not in columns")

daily_ic = df.groupby("date").apply(lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"))
mean_ic = daily_ic.mean()
print("\nCheck 5: Mean IC:", mean_ic)

print("\n--- BUG 3 DIAGNOSTICS ---")
rolling_ic = daily_ic.shift(1).rolling(20, min_periods=20).mean()
print("regime_daily_ic shape:", daily_ic.shape)
print("regime_daily_ic sample:\n", daily_ic.head())
print("\nrolling_ic describe:\n", rolling_ic.describe())
try:
    print("\nrolling_ic quantiles:\n", rolling_ic.quantile([0.1, 0.25, 0.5, 0.75, 0.9]))
except Exception as e:
    print("Error quantiles:", e)
print("rolling_ic non-null count:", rolling_ic.notna().sum())
include_regime = rolling_ic > 0
print("include_regime True count:", include_regime.sum())
