import pandas as pd
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

FINAL_DIR = Path('../Market_Data/final')
df = pd.read_parquet(FINAL_DIR / 'step34_3_corrected.parquet')

# Section 1
daily_ic = df.groupby('date', group_keys=False).apply(lambda x: x['pred_score'].corr(x['actual_return'], method='spearman'), include_groups=False)
rolling_ic = daily_ic.shift(1).rolling(20, min_periods=20).mean()
include_regime = rolling_ic > 0.0

df_filtered = df.copy()
valid_dates = include_regime[include_regime].index
df_filtered = df_filtered[df_filtered['date'].isin(valid_dates)].copy()

all_dates = sorted(df_filtered['date'].unique())
all_tickers = sorted(df['ticker'].unique())
df_filtered['rank_pct'] = df_filtered.groupby('date')['pred_score'].rank(pct=True)

# P1
rebalance_days = set(all_dates[::5])
wp_p1 = pd.DataFrame(0.0, index=all_dates, columns=all_tickers)
for i, date in enumerate(all_dates):
    if date in rebalance_days or i == 0:
        day_data = df_filtered[df_filtered['date'] == date]
        scores = day_data.set_index('ticker')['pred_score'].clip(lower=0)
        s = scores.sum()
        if s > 0:
            wp_p1.loc[date, scores.index] = scores / s
    else:
        wp_p1.iloc[i] = wp_p1.iloc[i - 1]

# P2
wp_p2 = pd.DataFrame(0.0, index=all_dates, columns=all_tickers)
position_entry_date = {}
days_held = {}
for i, date in enumerate(all_dates):
    day_data = df_filtered[df_filtered['date'] == date]
    if len(day_data) == 0:
        if i > 0:
            wp_p2.loc[date] = wp_p2.iloc[i - 1]
        continue

    current_held = set(position_entry_date.keys())
    for ticker in current_held:
        days_held[ticker] = days_held.get(ticker, 0) + 1

    candidates = set(day_data.nlargest(10, 'pred_score')['ticker'])
    exits = {t for t in current_held if days_held.get(t, 0) >= 3 and t not in candidates}
    entries = {t for t in candidates if t not in current_held}

    for t in exits:
        del position_entry_date[t]
        del days_held[t]
    for t in entries:
        position_entry_date[t] = date
        days_held[t] = 0

    current_portfolio = list(position_entry_date.keys())
    scores = day_data.set_index('ticker').reindex(current_portfolio)['pred_score'].fillna(0).clip(lower=0)
    s = scores.sum()
    if s > 0:
        wp_p2.loc[date, scores.index] = scores / s

# P3
wp_p3 = pd.DataFrame(0.0, index=all_dates, columns=all_tickers)
current_portfolio = set()
for i, date in enumerate(all_dates):
    day_data = df_filtered[df_filtered['date'] == date]
    if len(day_data) == 0:
        if i > 0:
            wp_p3.loc[date] = wp_p3.iloc[i - 1]
        continue

    if len(current_portfolio) == 0:
        current_portfolio = set(day_data.nlargest(10, 'pred_score')['ticker'])
    else:
        held_data = day_data[day_data['ticker'].isin(current_portfolio)]
        weakest_rank = held_data['rank_pct'].min() if len(held_data) > 0 else 1.0
        
        candidates = day_data.copy()
        eligible_entries = candidates[
            (candidates['rank_pct'] > weakest_rank + 0.15) &
            (~candidates['ticker'].isin(current_portfolio))
        ].sort_values('rank_pct', ascending=False)
        
        weakest_held = held_data.sort_values('rank_pct', ascending=True)
        replacements = min(len(eligible_entries), len(weakest_held))
        for j in range(replacements):
            if eligible_entries.iloc[j]['rank_pct'] > weakest_held.iloc[j]['rank_pct'] + 0.15:
                current_portfolio.remove(weakest_held.iloc[j]['ticker'])
                current_portfolio.add(eligible_entries.iloc[j]['ticker'])

    scores = day_data.set_index('ticker').reindex(list(current_portfolio))['pred_score'].fillna(0).clip(lower=0)
    s = scores.sum()
    if s > 0:
        wp_p3.loc[date, scores.index] = scores / s

# P4
wp_p4 = pd.DataFrame(0.0, index=all_dates, columns=all_tickers)
position_entry_date = {}
days_held = {}
current_portfolio = set()

for i, date in enumerate(all_dates):
    day_data = df_filtered[df_filtered['date'] == date]
    if len(day_data) == 0:
        if i > 0:
            wp_p4.loc[date] = wp_p4.iloc[i - 1]
        continue

    for ticker in current_portfolio:
        days_held[ticker] = days_held.get(ticker, 0) + 1

    if date in rebalance_days or i == 0:
        if len(current_portfolio) == 0:
            current_portfolio = set(day_data.nlargest(10, 'pred_score')['ticker'])
            for t in current_portfolio:
                position_entry_date[t] = date
                days_held[t] = 0
        else:
            eligible_to_exit = {t for t in current_portfolio if days_held.get(t, 0) >= 3}
            held_data = day_data[day_data['ticker'].isin(current_portfolio)]
            weakest_eligible = held_data[held_data['ticker'].isin(eligible_to_exit)].sort_values('rank_pct', ascending=True)
            
            if len(weakest_eligible) > 0:
                weakest_rank = weakest_eligible['rank_pct'].min()
                candidates = day_data.copy()
                eligible_entries = candidates[
                    (candidates['rank_pct'] > weakest_rank + 0.10) &
                    (~candidates['ticker'].isin(current_portfolio))
                ].sort_values('rank_pct', ascending=False)
                
                replacements = min(len(eligible_entries), len(weakest_eligible))
                for j in range(replacements):
                    if eligible_entries.iloc[j]['rank_pct'] > weakest_eligible.iloc[j]['rank_pct'] + 0.10:
                        out_t = weakest_eligible.iloc[j]['ticker']
                        in_t = eligible_entries.iloc[j]['ticker']
                        current_portfolio.remove(out_t)
                        current_portfolio.add(in_t)
                        del position_entry_date[out_t]
                        del days_held[out_t]
                        position_entry_date[in_t] = date
                        days_held[in_t] = 0

        scores = day_data.set_index('ticker').reindex(list(current_portfolio))['pred_score'].fillna(0).clip(lower=0)
        s = scores.sum()
        if s > 0:
            wp_p4.loc[date, scores.index] = scores / s
    else:
        wp_p4.loc[date] = wp_p4.iloc[i - 1]

variants = [
    {"name": "P1_Weekly", "weight_pivot": wp_p1},
    {"name": "P2_MinHold", "weight_pivot": wp_p2},
    {"name": "P3_Threshold", "weight_pivot": wp_p3},
    {"name": "P4_Combined", "weight_pivot": wp_p4},
]

ret_pivot = df_filtered.pivot(index='date', columns='ticker', values='actual_return').fillna(0)

def decompose(wp):
    prev = wp.shift(1).fillna(0)
    curr = wp.fillna(0)
    en = ((prev == 0) & (curr > 0)).sum(axis=1).mean()
    ex = ((prev > 0) & (curr == 0)).sum(axis=1).mean()
    re = ((prev > 0) & (curr > 0) & (prev != curr)).sum(axis=1).mean()
    
    active_today = (curr > 0)
    active_prev = (prev > 0)
    intersection = (active_today & active_prev).sum(axis=1)
    union = (active_today | active_prev).sum(axis=1)
    overlap = (intersection / union.replace(0, float("nan"))).mean()
    
    return en, ex, re, overlap

for v in variants:
    wp = v['weight_pivot']
    en, ex, re, overlap = decompose(wp)
    td = wp.diff().abs().sum(axis=1).fillna(0)
    avg_turnover = td.mean()
    eff_n = (1 / (wp**2).sum(axis=1).replace(0, float('nan'))).mean()
    
    wtm1 = wp.shift(1).fillna(0)
    pr = (wtm1 * ret_pivot).sum(axis=1)
    nr = pr - td * 10.0 / 10000
    ann = nr.mean() * 252
    net_sharpe = (nr.mean() / (nr.std() + 1e-12)) * np.sqrt(252)
    gross_sharpe = (pr.mean() / (pr.std() + 1e-12)) * np.sqrt(252)
    max_dd = (np.cumprod(1 + nr) / np.maximum.accumulate(np.cumprod(1 + nr)) - 1).min()
    
    v['turnover'] = avg_turnover
    v['net_sharpe'] = net_sharpe
    v['gross_sharpe'] = gross_sharpe
    v['sharpe_retention'] = net_sharpe / 2.1771
    v['ann_return'] = ann
    v['alpha_per_turnover'] = ann / (avg_turnover + 1e-12)
    v['max_dd'] = max_dd
    v['effective_n'] = eff_n
    v['overlap'] = overlap
    v['entries'] = en
    v['exits'] = ex
    v['resizes'] = re
    
    breakeven_bps = (pr.mean() / (td.mean() + 1e-12)) * 10000
    v['breakeven_bps'] = breakeven_bps
    
    print(f"{v['name']}: TO={avg_turnover:.3f}, Shrpe={net_sharpe:.3f}, Overlap={overlap:.3f}, EffN={eff_n:.1f}, BE={breakeven_bps:.1f}bps")

out_dir = FINAL_DIR / 'step35_results'
out_dir.mkdir(parents=True, exist_ok=True)
df_out = pd.DataFrame([{k: v for k, v in var.items() if k not in ['weight_pivot']} for var in variants])
df_out.to_csv(out_dir / 'persistence_metrics.csv', index=False)
