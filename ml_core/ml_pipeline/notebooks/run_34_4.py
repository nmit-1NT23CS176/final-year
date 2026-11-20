import pandas as pd
import numpy as np
from pathlib import Path

FINAL_DIR = Path("c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/Market_Data/final")
df = pd.read_parquet(FINAL_DIR / "step34_3_corrected.parquet")

ic_check = df.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()
print(f"IC at load: {ic_check:.6f}")
assert ic_check > 0.020, f"Wrong data source — IC = {ic_check:.4f}"
print("Data source verified. Proceeding to simulation.")

bench = df.copy()
if "weight" not in bench.columns and "weight_new" in bench.columns:
    bench["weight"] = bench["weight_new"]
bench_pivot = bench.pivot(index="date", columns="ticker", values="weight").fillna(0)
turnover_daily = bench_pivot.diff().abs().sum(axis=1).fillna(0)
benchmark_turnover = turnover_daily.mean()
print(f"Benchmark avg turnover: {benchmark_turnover:.4f}")

daily_ic = df.groupby("date").apply(lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"))
rolling_ic = daily_ic.shift(1).rolling(20, min_periods=20).mean()
threshold = 0.0
include_regime = rolling_ic > threshold

portfolios = {
    "A": {"regime": "ALL",         "side": "long_short"},
    "B": {"regime": "ALL",         "side": "long_only"},
    "C": {"regime": "HIGH",        "side": "long_only"},
    "D": {"regime": "HIGH+MEDIUM", "side": "long_only"},
    "E": {"regime": "dynamic",     "side": "long_only"},
}

results = {}
cost_bps = 10.0

for p_name, p_cfg in portfolios.items():
    df_filtered = df.copy()
    if p_cfg["regime"] == "HIGH":
        df_filtered = df_filtered[df_filtered["regime"] == "HIGH"].copy()
    elif p_cfg["regime"] == "HIGH+MEDIUM":
        df_filtered = df_filtered[df_filtered["regime"].isin(["HIGH", "MEDIUM"])].copy()
    elif p_cfg["regime"] == "dynamic":
        valid_dates = include_regime[include_regime].index
        df_filtered = df_filtered[df_filtered["date"].isin(valid_dates)].copy()
        
    side = p_cfg["side"]
    if side == "long_only":
        df_filtered["weight"] = (
            df_filtered.groupby("date")["pred_score"]
            .transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))
        )
    elif side == "long_short":
        def normalize_long_short(group):
            longs = group["pred_score"].clip(lower=0)
            shorts = (-group["pred_score"].clip(upper=0))
            long_w = longs / (longs.sum() + 1e-12) if longs.sum() > 0 else longs * 0
            short_w = shorts / (shorts.sum() + 1e-12) if shorts.sum() > 0 else shorts * 0
            group["weight"] = 0.5 * long_w - 0.5 * short_w
            return group
        df_filtered = df_filtered.groupby("date", group_keys=False).apply(normalize_long_short)

    weight_pivot = df_filtered.pivot(index="date", columns="ticker", values="weight").fillna(0)
    turnover_daily_p = weight_pivot.diff().abs().sum(axis=1).fillna(0)
    avg_turnover = turnover_daily_p.mean()
    
    assert avg_turnover < 1.50, f"Portfolio {p_name} turnover inconsistent with project history: {avg_turnover:.4f}"

    ret_pivot_p = df_filtered.pivot(index="date", columns="ticker", values="actual_return").fillna(0)
    w_t_minus_1_p = weight_pivot.shift(1).fillna(0)
    port_returns_p = (w_t_minus_1_p * ret_pivot_p).sum(axis=1)
    
    daily_cost_p = turnover_daily_p * (cost_bps / 10000)
    net_returns_p = port_returns_p - daily_cost_p
    
    ann_return_p = net_returns_p.mean() * 252
    gross_sharpe_p = (port_returns_p.mean() / (port_returns_p.std() + 1e-12)) * np.sqrt(252)
    net_sharpe_p = (net_returns_p.mean() / (net_returns_p.std() + 1e-12)) * np.sqrt(252)
    
    cum_ret = np.cumprod(1 + net_returns_p)
    max_dd_p = (cum_ret / np.maximum.accumulate(cum_ret) - 1).min()
    alpha_per_turnover_p = ann_return_p / (avg_turnover + 1e-12)
    
    results[p_name] = {
        "Gross Sharpe": gross_sharpe_p,
        "Net Sharpe": net_sharpe_p,
        "Turnover": avg_turnover,
        "Ann.Return": ann_return_p,
        "Alpha/Turnover": alpha_per_turnover_p,
        "Max DD": max_dd_p
    }

print("\n| Portfolio | Gross Sharpe | Net Sharpe | Turnover | Ann.Return | Alpha/Turnover | Max DD |")
print("|---|---|---|---|---|---|---|")
for p_name in ["A", "B", "C", "D", "E"]:
    r = results[p_name]
    print(f"| {p_name} | {r['Gross Sharpe']:.4f} | {r['Net Sharpe']:.4f} | {r['Turnover']:.4f} | {r['Ann.Return']:.4f} | {r['Alpha/Turnover']:.4f} | {r['Max DD']:.4f} |")

results_df = pd.DataFrame(results).T
out_dir = FINAL_DIR / "step34_4_results"
out_dir.mkdir(exist_ok=True)
results_df.to_csv(out_dir / "portfolio_simulation_results.csv")
print("\nResults saved to step34_4_results/portfolio_simulation_results.csv")
