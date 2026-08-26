import pandas as pd
from pathlib import Path

FINAL_DIR = Path('c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/Market_Data/final')

# SECTION 1
df28 = pd.read_parquet(FINAL_DIR / 'ensemble_alpha_results.parquet')
df28 = df28.rename(columns={'Date': 'date', 'Ticker': 'ticker', 'Regime': 'regime'})

df33 = pd.read_parquet(FINAL_DIR / 'step33_cost_aware_portfolio.parquet')
df34 = pd.read_parquet(FINAL_DIR / 'step34_3_regime_persistence.parquet')

lineage = []
for name, dfx in [('Step-28', df28), ('Step-33', df33), ('Step-34.3', df34)]:
    lineage.append({
        'file': name,
        'rows': len(dfx),
        'dates': dfx['date'].nunique(),
        'tickers': dfx['ticker'].nunique(),
        'tickers_per_day': round(len(dfx) / dfx['date'].nunique(), 1),
        'columns': dfx.columns.tolist()
    })
print('--- SECTION 1 ---')
print(pd.DataFrame(lineage)[['file','rows','dates','tickers','tickers_per_day']])

# SECTION 2
def compute_ic_matrix(df, name):
    if 'record_type' in df.columns:
        df = df[df['record_type'] == 'signal'].copy()
    signal_cols = [c for c in df.columns if any(x in c.lower() for x in ['pred', 'score', 'rank'])]
    target_cols = [c for c in df.columns if any(x in c.lower() for x in ['return', 'target'])]
    results = []
    for sig in signal_cols:
        for tgt in target_cols:
            try:
                ic = df.groupby('date', group_keys=False).apply(
                    lambda x: x[sig].corr(x[tgt], method='spearman'),
                    include_groups=False
                ).mean()
                results.append({'file': name, 'signal': sig, 'target': tgt, 'mean_ic': ic})
            except Exception:
                pass
    return pd.DataFrame(results).sort_values('mean_ic', ascending=False)

ic28 = compute_ic_matrix(df28, 'Step-28')
ic33 = compute_ic_matrix(df33, 'Step-33')
ic34 = compute_ic_matrix(df34, 'Step-34.3')
print('\n--- SECTION 2 ---')
print('Step-28 top IC pairs:\n', ic28.head(5))
print('Step-33 top IC pairs:\n', ic33.head(5))
print('Step-34.3 top IC pairs:\n', ic34.head(5))

# SECTION 3
print('\n--- SECTION 3 ---')
GROUND_TRUTH_IC   = 0.026841
if 'pred_score' in df33.columns and 'actual_return' in df33.columns:
    ic33_direct = df33.groupby('date', group_keys=False).apply(
        lambda x: x['pred_score'].corr(x['actual_return'], method='spearman'),
        include_groups=False
    ).mean()
    print(f'Direct Step-33 IC: {ic33_direct:.6f}')
    print(f'Expected:          {GROUND_TRUTH_IC}')
    match_str = "YES" if abs(ic33_direct - GROUND_TRUTH_IC) < 0.005 else "NO - corruption occurred BEFORE Step-34"
    print(f'Match: {match_str}')
else:
    print('pred_score or actual_return missing in Step-33')

# SECTION 4
print('\n--- SECTION 4 ---')
key = ['date', 'ticker']
merged_2833 = df28.merge(df33, on=key, suffixes=('_28', '_33'))
merged_3334 = df33.merge(df34, on=key, suffixes=('_33', '_34'))
merged_2834 = df28.merge(df34, on=key, suffixes=('_28', '_34'))

def transition_report(merged, label, sig_a, sig_b, tgt_a, tgt_b):
    print(f'\n--- {label} ---')
    try:
        sig_corr = merged[sig_a].corr(merged[sig_b])
        sig_spear = merged[sig_a].corr(merged[sig_b], method='spearman')
        sign_agree = (merged[sig_a] * merged[sig_b] > 0).mean()
        print(f'Signal Pearson corr:    {sig_corr:.4f}')
        print(f'Signal Spearman corr:   {sig_spear:.4f}')
        print(f'Signal sign agreement:  {sign_agree:.3f}  (<0.5 = inversion)')
    except Exception as e:
        print(f'Signal comparison error: {e}')
    try:
        tgt_corr = merged[tgt_a].corr(merged[tgt_b])
        tgt_sign = (merged[tgt_a] * merged[tgt_b] > 0).mean()
        tgt_diff = (merged[tgt_a] - merged[tgt_b]).abs().mean()
        print(f'Target Pearson corr:    {tgt_corr:.4f}')
        print(f'Target sign agreement:  {tgt_sign:.3f}  (≈1.0=same, ≈0.5=unrelated, ≈0.0=inverted)')
        print(f'Target mean abs diff:   {tgt_diff:.6f}')
    except Exception as e:
        print(f'Target comparison error: {e}')

transition_report(merged_2833, 'Step-28 -> Step-33', 'pred_final', 'pred_score', 'target_future_return_t3', 'actual_return')
transition_report(merged_3334, 'Step-33 -> Step-34.3', 'pred_score_33', 'pred_score_34', 'actual_return_33', 'actual_return_34')
transition_report(merged_2834, 'Step-28 -> Step-34.3', 'pred_final', 'pred_score', 'target_future_return_t3', 'actual_return')

# SECTION 5
print('\n--- SECTION 5 ---')
for sig, tgt in [
    ('pred_final',     'target_future_return_t3'),       # baseline
    ('pred_score',     'actual_return'),       # current broken
    ('-pred_score',    'actual_return'),       # H1: signal inversion
    ('pred_score',     'target_future_return_t3'),  # H2: horizon fix
    ('-pred_score',    'target_future_return_t3'),  # H3: both fixes
]:
    try:
        col = sig.lstrip('-')
        sign = -1 if sig.startswith('-') else 1
        ic = merged_2834.groupby('date', group_keys=False).apply(
            lambda x: (sign * x[col]).corr(x[tgt], method='spearman'),
            include_groups=False
        ).mean()
        match = '✓ GROUND TRUTH RESTORED' if abs(ic - GROUND_TRUTH_IC) < 0.01 else ''
        print(f'IC({sig} vs {tgt}): {ic:.4f}  {match}')
    except Exception as e:
        print(f'IC({sig} vs {tgt}): ERROR - {e}')
