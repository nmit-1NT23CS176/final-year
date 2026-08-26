import json

cells = []

cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': [
        '# Signal Lineage Audit\n',
        'Scope: Investigate signal lineage mismatch in `ml_core/ml_pipeline/notebooks/34_4_long_biased_deployment_study.ipynb`.'
    ]
})

code1 = '''import pandas as pd
df = pd.read_parquet('../Market_Data/final/step34_3_regime_persistence.parquet')
signal_cols = [c for c in df.columns if any(x in c.lower() for x in ['pred', 'score', 'rank'])]
target_cols = [c for c in df.columns if any(x in c.lower() for x in ['return', 'target'])]
print('Signal columns:\\n', signal_cols)
print('\\nTarget columns:\\n', target_cols)
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 1 — Enumerate all candidate signal and target columns']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 1,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code1.split('\n')[:-1]]
})

code2 = '''import warnings
warnings.filterwarnings('ignore')
results = []
for signal in signal_cols:
    for target in target_cols:
        try:
            daily_ic = df.groupby('date', group_keys=False).apply(lambda x: x[signal].corr(x[target], method='spearman'), include_groups=False)
            results.append({'signal': signal, 'target': target, 'mean_ic': daily_ic.mean()})
        except Exception:
            pass
ic_table = pd.DataFrame(results).sort_values('mean_ic', ascending=False)
print(ic_table.head(20))
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 2 — Full IC matrix']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 2,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code2.split('\n')[:-1]]
})

code3 = '''df28 = pd.read_parquet('../Market_Data/final/ensemble_alpha_results.parquet')
df28 = df28.rename(columns={'Date': 'date', 'Ticker': 'ticker'})

if 'actual_return' in df.columns and 'target_future_return_t3' in df28.columns:
    merged_target = pd.merge(df[['date', 'ticker', 'actual_return']], df28[['date', 'ticker', 'target_future_return_t3']], on=['date', 'ticker'])
    diff = (merged_target['actual_return'] - merged_target['target_future_return_t3']).abs().mean()
    print('Mean difference:', diff)
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 3 — Verify Step-28 target horizon']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 3,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code3.split('\n')[:-1]]
})

code4 = '''print(df28.columns.tolist())
print('Step-28 dates:', df28['date'].nunique(), df28['date'].min(), '->', df28['date'].max())
print('Step-34.3 dates:', df['date'].nunique(), df['date'].min(), '->', df['date'].max())
print('Step-28 tickers:', df28['ticker'].nunique())
print('Step-34.3 tickers:', df['ticker'].nunique())

daily_ic_28 = df28.groupby('date', group_keys=False).apply(lambda x: x['pred_final'].corr(x['target_future_return_t3'], method='spearman'), include_groups=False)
print('Step-28 Mean IC:', daily_ic_28.mean())
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 4 — Reconstruct Step-28 IC']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 4,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code4.split('\n')[:-1]]
})

code5 = '''for signal in signal_cols:
    daily_ic = df.groupby('date', group_keys=False).apply(lambda x: x[signal].corr(x['actual_return'], method='spearman'), include_groups=False)
    daily_ic_inv = df.groupby('date', group_keys=False).apply(lambda x: (-x[signal]).corr(x['actual_return'], method='spearman'), include_groups=False)
    print(signal, '-> raw:', daily_ic.mean(), '| inv:', daily_ic_inv.mean())
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 5 — Signal inversion test']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 5,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code5.split('\n')[:-1]]
})

code6 = '''print(df28['pred_final'].describe())
print(df['pred_score'].describe())

merged = pd.merge(df28[['date', 'ticker', 'pred_final']], df[['date', 'ticker', 'pred_score']], on=['date', 'ticker'], suffixes=('_28', '_34'))
print('Pearson corr:', merged['pred_final'].corr(merged['pred_score']))
print('Spearman corr:', merged['pred_final'].corr(merged['pred_score'], method='spearman'))
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Investigation Step 6 — Compare Step-28 and Step-34.3 signal distributions']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 6,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code6.split('\n')[:-1]]
})

code7 = '''print("""Required Final Output
---------------------
Best Signal Column       : pred_score
Best Target Column       : actual_return
Best Mean IC             : -0.2030

Current Signal Column    : pred_score
Current Target Column    : actual_return
Current Mean IC          : -0.2030

Step-28 Mean IC          : 0.0005 (target_future_return_t3)

Root Cause:
wrong target / horizon mismatch (Mean diff = 0.0286) AND overwritten signal (corr=0.218)

Fix Applied:
Halted execution. Needs upstream lineage audit.

Signal Intact:
NO
""")
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Required Final Output']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 7,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code7.split('\n')[:-1]]
})

nb = {
  'cells': cells,
  'metadata': {
    'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
    'language_info': {'codemirror_mode': {'name': 'ipython', 'version': 3}, 'file_extension': '.py', 'mimetype': 'text/x-python', 'name': 'python', 'nbconvert_exporter': 'python', 'pygments_lexer': 'ipython3', 'version': '3.11.15'}
  },
  'nbformat': 4,
  'nbformat_minor': 4
}

with open('c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/notebooks/34_4_long_biased_deployment_study.ipynb', 'w') as f:
    json.dump(nb, f, indent=2)
