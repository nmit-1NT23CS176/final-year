import pandas as pd
import numpy as np
from pathlib import Path

FINAL_DIR = Path('../Market_Data/final')
df = pd.read_parquet(FINAL_DIR / 'step34_3_corrected.parquet')

# Section 1
daily_ic = df.groupby('date', group_keys=False).apply(lambda x: x['pred_score'].corr(x['actual_return'], method='spearman'), include_groups=False)
rolling_ic = daily_ic.shift(1).rolling(20, min_periods=20).mean()
include_regime = rolling_ic > 0.0

df_filtered = df.copy()
valid_dates = include_regime[include_regime].index
df_filtered = df_filtered[df_filtered['date'].isin(valid_dates)].copy()
df_filtered['weight'] = df_filtered.groupby('date')['pred_score'].transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))
weight_pivot = df_filtered.pivot(index='date', columns='ticker', values='weight').fillna(0)
turnover_daily_p = weight_pivot.diff().abs().sum(axis=1).fillna(0)
avg_turnover = turnover_daily_p.mean()

ret_pivot_p = df_filtered.pivot(index='date', columns='ticker', values='actual_return').fillna(0)
w_t_minus_1_p = weight_pivot.shift(1).fillna(0)
port_returns_p = (w_t_minus_1_p * ret_pivot_p).sum(axis=1)

net_returns_p = port_returns_p - turnover_daily_p * (10.0 / 10000)
ann_return_p = net_returns_p.mean() * 252
net_sharpe_p = (net_returns_p.mean() / (net_returns_p.std() + 1e-12)) * np.sqrt(252)
cum_ret = np.cumprod(1 + net_returns_p)
max_dd_p = (cum_ret / np.maximum.accumulate(cum_ret) - 1).min()

results_e1 = {'net_sharpe': net_sharpe_p, 'turnover': avg_turnover, 'ann_return': ann_return_p, 'max_dd': max_dd_p}

# Section 2
variants = []
df_base = df.copy()
df_base['rank_pct'] = df_base.groupby('date')['pred_score'].rank(pct=True)
df_base['pred_score_smooth'] = df_base.groupby('ticker')['pred_score'].transform(lambda x: 0.7 * x + 0.3 * x.shift(1))
df_base['signal_for_weights'] = df_base.groupby('ticker')['pred_score_smooth'].shift(1)

for v_name in ['E1_Raw', 'E2_Rank', 'E3_Smooth']:
    df_f = df_base.copy()
    df_f = df_f[df_f['date'].isin(valid_dates)].copy()
    if v_name == 'E1_Raw':
        df_f['weight'] = df_f.groupby('date')['pred_score'].transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))
    elif v_name == 'E2_Rank':
        df_f['weight'] = df_f.groupby('date')['rank_pct'].transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))
    elif v_name == 'E3_Smooth':
        df_f['weight'] = df_f.groupby('date')['signal_for_weights'].transform(lambda x: x.clip(lower=0) / (x.clip(lower=0).sum() + 1e-12))

    wp = df_f.pivot(index='date', columns='ticker', values='weight').fillna(0)
    ret_p = df_f.pivot(index='date', columns='ticker', values='actual_return').fillna(0)
    wtm1 = wp.shift(1).fillna(0)
    td = wp.diff().abs().sum(axis=1).fillna(0)
    pr = (wtm1 * ret_p).sum(axis=1)
    variants.append({'name': v_name, 'weight_pivot': wp, 'turnover_daily': td, 'avg_turnover': td.mean(), 'port_returns': pr})

def decompose(wp):
    prev = wp.shift(1).fillna(0)
    curr = wp.fillna(0)
    en = ((prev == 0) & (curr > 0)).sum(axis=1).mean()
    ex = ((prev > 0) & (curr == 0)).sum(axis=1).mean()
    re = ((prev > 0) & (curr > 0) & (prev != curr)).sum(axis=1).mean()
    return en, ex, re

for v in variants:
    en, ex, re = decompose(v['weight_pivot'])
    eff_n = (1 / (v['weight_pivot']**2).sum(axis=1).replace(0, float('nan'))).mean()
    v['entries'] = en
    v['exits'] = ex
    v['resizes'] = re
    v['effective_n'] = eff_n
    
    td = v['turnover_daily']
    nr = v['port_returns'] - td * 10.0 / 10000
    v['net_sharpe'] = (nr.mean() / (nr.std() + 1e-12)) * np.sqrt(252)
    v['sharpe_retention'] = v['net_sharpe'] / results_e1['net_sharpe']
    v['max_dd'] = (np.cumprod(1 + nr) / np.maximum.accumulate(np.cumprod(1 + nr)) - 1).min()
    
    print(f"{v['name']}: TO={v['avg_turnover']:.3f}, Shrpe={v['net_sharpe']:.3f}, Ret={v['sharpe_retention']:.3f}, eff_n={eff_n:.1f}, en={en:.1f}, ex={ex:.1f}, re={re:.1f}")

best = max(variants, key=lambda v: v["net_sharpe"])
targets = {
    "turnover_below_080":       best["turnover"] < 0.80,
    "net_sharpe_above_150":     best["net_sharpe"] > 1.50,
    "sharpe_retention_above_80": best["sharpe_retention"] > 0.80,
    "effective_n_preserved":    best["effective_n"] >= results_e1["effective_n"] * 0.70,
    "max_dd_above_neg020":      best["max_dd"] > -0.20,
}
passed = sum(targets.values())

if passed >= 4:
    print(f"Verdict: PROCEED TO STEP-35 using {best['name']} architecture")
else:
    print("Verdict: Turnover structurally high — Step-35 must target rebalance frequency / position persistence")
print(f"Targets passed: {passed}/5")
