import pandas as pd
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

FINAL_DIR = Path('../Market_Data/final')
df = pd.read_parquet(FINAL_DIR / 'step34_3_corrected.parquet')

ic_check = df.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()
assert ic_check > 0.020, f"Wrong data source: IC={ic_check:.4f}"
print(f"IC verified: {ic_check:.6f}")

# Regime filter
daily_ic = df.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
)
rolling_ic = daily_ic.shift(1).rolling(20, min_periods=20).mean()
include_regime = rolling_ic > 0.0

df_filtered = df.copy()
valid_dates = include_regime[include_regime].index
df_filtered = df_filtered[df_filtered["date"].isin(valid_dates)].copy()
df_filtered["rank_pct"] = df_filtered.groupby("date")["pred_score"].rank(pct=True)

all_dates = sorted(df_filtered["date"].unique())
all_tickers = sorted(df["ticker"].unique())
all_full_dates = sorted(df["date"].unique())

def simulate_p1_weekly(df_sub, all_tickers_list, cost_bps=10.0):
    dates = sorted(df_sub["date"].unique())
    rebalance_days = set(dates[::5])
    wp = pd.DataFrame(0.0, index=dates, columns=all_tickers_list)
    for i, date in enumerate(dates):
        if date in rebalance_days or i == 0:
            day_data = df_sub[df_sub["date"] == date]
            scores = day_data.set_index("ticker")["pred_score"].clip(lower=0)
            s = scores.sum()
            if s > 0:
                wp.loc[date, scores.index] = scores / s
        else:
            wp.loc[date] = wp.iloc[i - 1]

    ret_pivot = df_sub.pivot(index="date", columns="ticker", values="actual_return").fillna(0)
    common_cols = wp.columns.intersection(ret_pivot.columns)
    wp_a = wp[common_cols]
    ret_a = ret_pivot.reindex(columns=common_cols, fill_value=0)

    td = wp_a.diff().abs().sum(axis=1).fillna(0)
    wtm1 = wp_a.shift(1).fillna(0)
    pr = (wtm1 * ret_a).sum(axis=1)
    nr = pr - td * (cost_bps / 10000)

    avg_turnover = td.mean()
    ann_return = nr.mean() * 252
    net_sharpe = (nr.mean() / (nr.std() + 1e-12)) * np.sqrt(252)
    gross_sharpe = (pr.mean() / (pr.std() + 1e-12)) * np.sqrt(252)
    cum_ret = np.cumprod(1 + nr)
    max_dd = (cum_ret / np.maximum.accumulate(cum_ret) - 1).min()
    eff_n = (1 / (wp_a**2).sum(axis=1).replace(0, float("nan"))).mean()

    prev = wp_a.shift(1).fillna(0)
    curr = wp_a.fillna(0)
    active_today = (curr > 0)
    active_prev = (prev > 0)
    intersection = (active_today & active_prev).sum(axis=1)
    union = (active_today | active_prev).sum(axis=1)
    overlap = (intersection / union.replace(0, float("nan"))).mean()

    breakeven_bps = (pr.mean() / (td.mean() + 1e-12)) * 10000

    downside = nr[nr < 0]
    downside_std = downside.std() * np.sqrt(252) if len(downside) > 0 else 1e-12
    sortino = ann_return / (downside_std + 1e-12)
    calmar = ann_return / (abs(max_dd) + 1e-12)

    return {
        "net_sharpe": net_sharpe, "gross_sharpe": gross_sharpe,
        "turnover": avg_turnover, "ann_return": ann_return,
        "max_dd": max_dd, "effective_n": eff_n,
        "overlap": overlap, "breakeven_bps": breakeven_bps,
        "sortino": sortino, "calmar": calmar,
        "net_returns": nr, "gross_returns": pr,
        "turnover_daily": td, "weight_pivot": wp_a,
    }

# Reproduce P1_Weekly baseline
p1_baseline = simulate_p1_weekly(df_filtered, all_tickers)
final = p1_baseline.copy()

BASELINE = {"net_sharpe": 2.9650, "turnover": 0.3062,
            "ann_return": 0.5549, "max_dd": -0.1115, "effective_n": 9.8}
for k, v in BASELINE.items():
    assert abs(p1_baseline[k] - v) < 0.10, \
        f"P1 mismatch {k}: {p1_baseline[k]:.4f} vs {v:.4f}"
print("P1_Weekly baseline confirmed.")

# Walk-forward
w1_dates = all_full_dates[0:82]
w2_dates = all_full_dates[82:163]
w3_dates = all_full_dates[163:245]

windows = {
    "W1_JanApr": w1_dates,
    "W2_MayAug": w2_dates,
    "W3_SepDec": w3_dates,
}

window_results = {}
for name, window_dates in windows.items():
    df_w = df_filtered[df_filtered["date"].isin(window_dates)]
    if len(df_w) == 0:
        continue
    window_results[name] = simulate_p1_weekly(df_w, all_tickers)

positive_sharpe_windows = sum(1 for r in window_results.values() if r["net_sharpe"] > 0)
profitable_windows = sum(1 for r in window_results.values() if r["ann_return"] > 0)
win_rate = positive_sharpe_windows / 3

assert positive_sharpe_windows >= 2
assert profitable_windows >= 2
print(f"Robustness gate passed. Win rate: {win_rate:.0%}")

# Benchmarks
df_eq = df.copy()
n_tickers = df_eq.groupby("date")["ticker"].transform("count")
df_eq["weight"] = 1.0 / n_tickers
wp_eq = df_eq.pivot(index="date", columns="ticker", values="weight").fillna(0)
ret_eq = df_eq.pivot(index="date", columns="ticker", values="actual_return").fillna(0)
td_eq = wp_eq.diff().abs().sum(axis=1).fillna(0)
pr_eq = (wp_eq.shift(1).fillna(0) * ret_eq).sum(axis=1)
nr_eq = pr_eq - td_eq * 10.0 / 10000
eq_sharpe = (nr_eq.mean() / (nr_eq.std() + 1e-12)) * np.sqrt(252)
eq_ann = nr_eq.mean() * 252
eq_dd = (np.cumprod(1 + nr_eq) / np.maximum.accumulate(np.cumprod(1 + nr_eq)) - 1).min()
eq_to = td_eq.mean()

df_day1 = df[df["date"] == df["date"].min()].copy()
df_day1["rank_pct"] = df_day1["pred_score"].rank(pct=True)
top10 = df_day1.nlargest(10, "rank_pct")["ticker"].tolist()
wp_bh = pd.DataFrame(0.0, index=sorted(df["date"].unique()), columns=all_tickers)
for t in top10:
    wp_bh.loc[:, t] = 1.0 / len(top10)
ret_bh = df.pivot(index="date", columns="ticker", values="actual_return").fillna(0)
common = wp_bh.columns.intersection(ret_bh.columns)
wp_bh2 = wp_bh[common]
ret_bh2 = ret_bh.reindex(columns=common, fill_value=0)
td_bh = wp_bh2.diff().abs().sum(axis=1).fillna(0)
pr_bh = (wp_bh2.shift(1).fillna(0) * ret_bh2).sum(axis=1)
nr_bh = pr_bh - td_bh * 10.0 / 10000
bh_sharpe = (nr_bh.mean() / (nr_bh.std() + 1e-12)) * np.sqrt(252)
bh_ann = nr_bh.mean() * 252
bh_dd = (np.cumprod(1 + nr_bh) / np.maximum.accumulate(np.cumprod(1 + nr_bh)) - 1).min()
bh_to = td_bh.mean()

df_e1 = df_filtered.copy()
df_e1["weight"] = df_e1.groupby("date")["pred_score"].transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))
wp_e1 = df_e1.pivot(index="date", columns="ticker", values="weight").fillna(0)
ret_e1 = df_e1.pivot(index="date", columns="ticker", values="actual_return").fillna(0)
td_e1 = wp_e1.diff().abs().sum(axis=1).fillna(0)
pr_e1 = (wp_e1.shift(1).fillna(0) * ret_e1).sum(axis=1)
nr_e1 = pr_e1 - td_e1 * 10.0 / 10000
e1_sharpe = (nr_e1.mean() / (nr_e1.std() + 1e-12)) * np.sqrt(252)
e1_ann = nr_e1.mean() * 252
e1_dd = (np.cumprod(1 + nr_e1) / np.maximum.accumulate(np.cumprod(1 + nr_e1)) - 1).min()
e1_to = td_e1.mean()

# Save results
out_dir = FINAL_DIR / "step36_results"
out_dir.mkdir(parents=True, exist_ok=True)

metrics = {k: v for k, v in final.items() if k not in ["net_returns", "gross_returns", "turnover_daily", "weight_pivot"]}
metrics["ic"] = ic_check
metrics["win_rate"] = win_rate
pd.DataFrame([metrics]).to_csv(out_dir / "final_strategy_metrics.csv", index=False)

window_export = []
for wname, wr in window_results.items():
    window_export.append({
        "window": wname,
        "net_sharpe": wr["net_sharpe"],
        "turnover": wr["turnover"],
        "ann_return": wr["ann_return"],
        "max_dd": wr["max_dd"],
    })
pd.DataFrame(window_export).to_csv(out_dir / "walkforward_results.csv", index=False)

benchmarks_export = [
    {"benchmark": "P1_Weekly", "net_sharpe": p1_baseline["net_sharpe"], "ann_return": p1_baseline["ann_return"], "max_dd": p1_baseline["max_dd"], "turnover": p1_baseline["turnover"]},
    {"benchmark": "Equal_weight", "net_sharpe": eq_sharpe, "ann_return": eq_ann, "max_dd": eq_dd, "turnover": eq_to},
    {"benchmark": "Buy_hold_top10", "net_sharpe": bh_sharpe, "ann_return": bh_ann, "max_dd": bh_dd, "turnover": bh_to},
    {"benchmark": "Daily_E1_Baseline", "net_sharpe": e1_sharpe, "ann_return": e1_ann, "max_dd": e1_dd, "turnover": e1_to},
]
pd.DataFrame(benchmarks_export).to_csv(out_dir / "benchmark_comparison.csv", index=False)

print("=" * 50)
print("RESEARCH PIPELINE COMPLETE")
print("=" * 50)
print(f"Final architecture : P1_Weekly")
print(f"Net Sharpe         : {final['net_sharpe']:.4f}")
print(f"Turnover           : {final['turnover']:.4f}")
print(f"Breakeven cost     : {final['breakeven_bps']:.1f} bps")
print(f"Win rate           : {win_rate:.1%}")
print("=" * 50)
print("\nAll results saved to Market_Data/final/step36_results/")
