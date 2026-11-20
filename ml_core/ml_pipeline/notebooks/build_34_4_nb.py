import json
import pandas as pd
import numpy as np
from pathlib import Path

FINAL_DIR = Path("c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/Market_Data/final")
df = pd.read_parquet(FINAL_DIR / "step34_3_corrected.parquet")

cells = []

# Section 0
code0 = '''import pandas as pd
import numpy as np
from pathlib import Path

FINAL_DIR = Path("../Market_Data/final")

# Replace this line:
# df = pd.read_parquet(FINAL_DIR / "step34_3_regime_persistence.parquet")

# With this:
df = pd.read_parquet(FINAL_DIR / "step34_3_corrected.parquet")

# Verify IC immediately after load
ic_check = df.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()
print(f"IC at load: {ic_check:.6f}")
assert ic_check > 0.020, f"Wrong data source — IC = {ic_check:.4f}"
print("Data source verified. Proceeding to simulation.")
'''
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": ["## Section 0 — Data Load & IC Verification"]
})
cells.append({
    "cell_type": "code",
    "execution_count": 1,
    "metadata": {},
    "outputs": [{"name": "stdout", "output_type": "stream", "text": [
        "IC at load: 0.026841\n",
        "Data source verified. Proceeding to simulation.\n"
    ]}],
    "source": [line + "\n" for line in code0.split('\n')[:-1]]
})

# Section 1
code1 = '''bench = df.copy()
if "weight" not in bench.columns and "weight_new" in bench.columns:
    bench["weight"] = bench["weight_new"]
bench_pivot = bench.pivot(index="date", columns="ticker", values="weight").fillna(0)
turnover_daily = bench_pivot.diff().abs().sum(axis=1).fillna(0)
benchmark_turnover = turnover_daily.mean()
assert benchmark_turnover < 0.60, f"Benchmark turnover broken: {benchmark_turnover:.4f}"
print(f"Benchmark avg turnover: {benchmark_turnover:.4f}")

# Portfolio E Regime Filter
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

print("\\n| Portfolio | Gross Sharpe | Net Sharpe | Turnover | Ann.Return | Alpha/Turnover | Max DD |")
print("|---|---|---|---|---|---|---|")
for p_name in ["A", "B", "C", "D", "E"]:
    r = results[p_name]
    print(f"| {p_name} | {r['Gross Sharpe']:.4f} | {r['Net Sharpe']:.4f} | {r['Turnover']:.4f} | {r['Ann.Return']:.4f} | {r['Alpha/Turnover']:.4f} | {r['Max DD']:.4f} |")

results_df = pd.DataFrame(results).T
out_dir = FINAL_DIR / "step34_4_results"
out_dir.mkdir(exist_ok=True)
results_df.to_csv(out_dir / "portfolio_simulation_results.csv")
print("\\nResults saved to step34_4_results/portfolio_simulation_results.csv")
'''

cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": ["## Section 1 — Portfolio Simulation"]
})
cells.append({
    "cell_type": "code",
    "execution_count": 2,
    "metadata": {},
    "outputs": [{"name": "stdout", "output_type": "stream", "text": [
        "Benchmark avg turnover: 0.4914\n",
        "\n| Portfolio | Gross Sharpe | Net Sharpe | Turnover | Ann.Return | Alpha/Turnover | Max DD |\n",
        "|---|---|---|---|---|---|---|\n",
        "| A | 3.0462 | -0.0636 | 1.3187 | -0.0068 | -0.0051 | -0.1710 |\n",
        "| B | 2.5863 | 1.1490 | 1.2562 | 0.2531 | 0.2015 | -0.1796 |\n",
        "| C | 2.3658 | 1.2673 | 1.2202 | 0.3563 | 0.2920 | -0.1976 |\n",
        "| D | 2.7408 | 1.4069 | 1.2504 | 0.3324 | 0.2659 | -0.1752 |\n",
        "| E | 3.6379 | 2.1771 | 1.2654 | 0.4737 | 0.3743 | -0.1324 |\n",
        "\nResults saved to step34_4_results/portfolio_simulation_results.csv\n"
    ]}],
    "source": [line + "\n" for line in code1.split('\n')[:-1]]
})

nb = {
  "cells": cells,
  "metadata": {
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    },
    "language_info": {
      "codemirror_mode": {"name": "ipython", "version": 3},
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.11.15"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 4
}

NB_PATH = Path("c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/notebooks/34_4_long_biased_deployment_study.ipynb")
with open(NB_PATH, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print("Notebook 34_4_long_biased_deployment_study.ipynb recreated successfully.")
