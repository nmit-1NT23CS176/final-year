import json
from pathlib import Path

cells = []

# Section 1
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': [
        '# Signal Lineage Audit\n',
        'Scope: Investigate signal lineage mismatch. Do not touch any execution notebooks or any other directory. All execution notebooks remain paused until this audit returns Safe to proceed: YES.'
    ]
})

code1 = '''import pandas as pd
from pathlib import Path

FINAL_DIR = Path("../Market_Data/final")

df28 = pd.read_parquet(FINAL_DIR / "ensemble_alpha_results.parquet")
df28 = df28.rename(columns={"Date": "date", "Ticker": "ticker", "Regime": "regime"})

df33 = pd.read_parquet(FINAL_DIR / "step33_cost_aware_portfolio.parquet")
df34 = pd.read_parquet(FINAL_DIR / "step34_3_regime_persistence.parquet")

lineage = []
for name, dfx in [("Step-28", df28), ("Step-33", df33), ("Step-34.3", df34)]:
    lineage.append({
        "file": name,
        "rows": len(dfx),
        "dates": dfx["date"].nunique(),
        "tickers": dfx["ticker"].nunique(),
        "tickers_per_day": round(len(dfx) / dfx["date"].nunique(), 1),
        "columns": dfx.columns.tolist()
    })

print(pd.DataFrame(lineage)[["file","rows","dates","tickers","tickers_per_day"]])
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 1 — Load all three files and verify dimensions']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 1,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code1.split('\n')[:-1]]
})

code2 = '''def compute_ic_matrix(df, name):
    if "record_type" in df.columns:
        df = df[df["record_type"].isin(["signal", "prediction"])].copy()
        print(f"{name} after record_type filter: {len(df)} rows")

    signal_cols = [c for c in df.columns if any(
        x in c.lower() for x in ["pred", "score", "rank"])]
    target_cols = [c for c in df.columns if any(
        x in c.lower() for x in ["return", "target"])]

    results = []
    for sig in signal_cols:
        for tgt in target_cols:
            try:
                ic = df.groupby("date", group_keys=False).apply(
                    lambda x: x[sig].corr(x[tgt], method="spearman"),
                    include_groups=False
                ).mean()
                results.append({"file": name, "signal": sig,
                                 "target": tgt, "mean_ic": ic})
            except Exception:
                pass
    df_res = pd.DataFrame(results)
    if not df_res.empty:
        return df_res.sort_values("mean_ic", ascending=False)
    return df_res

ic28 = compute_ic_matrix(df28, "Step-28")
ic33 = compute_ic_matrix(df33, "Step-33")
ic34 = compute_ic_matrix(df34, "Step-34.3")

print("\\nStep-28 top IC pairs:\\n", ic28.head(5))
print("\\nStep-33 top IC pairs:\\n", ic33.head(5))
print("\\nStep-34.3 top IC pairs:\\n", ic34.head(5))
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 2 — IC matrix for each file independently']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 2,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code2.split('\n')[:-1]]
})

code3 = '''GROUND_TRUTH_IC   = 0.026841  # Step-33 published
GROUND_TRUTH_SHARPE = 0.624138

if "pred_score" in df33.columns and "actual_return" in df33.columns:
    ic33_direct = df33.groupby("date", group_keys=False).apply(
        lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
        include_groups=False
    ).mean()
    print(f"Direct Step-33 IC: {ic33_direct:.6f}")
    print(f"Expected:          {GROUND_TRUTH_IC}")
    print(f"Match: {'YES' if abs(ic33_direct - GROUND_TRUTH_IC) < 0.005 else 'NO — corruption occurred BEFORE Step-34'}")
else:
    print("pred_score or actual_return missing from Step-33 — check column names")
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 3 — Step-33 anchor verification (mandatory checkpoint)']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 3,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code3.split('\n')[:-1]]
})

code4 = '''key = ["date", "ticker"]

# Transition 1: Step-28 → Step-33
merged_2833 = df28.merge(df33, on=key, suffixes=("_28", "_33"))
print(f"\\nStep-28 → Step-33 overlap: {len(merged_2833)} rows")

# Transition 2: Step-33 → Step-34.3
merged_3334 = df33.merge(df34, on=key, suffixes=("_33", "_34"))
print(f"Step-33 → Step-34.3 overlap: {len(merged_3334)} rows")

# Transition 3: Step-28 → Step-34.3 (endpoint comparison)
merged_2834 = df28.merge(df34, on=key, suffixes=("_28", "_34"))
print(f"Step-28 → Step-34.3 overlap: {len(merged_2834)} rows")

def transition_report(merged, label, sig_a, sig_b, tgt_a, tgt_b):
    print(f"\\n--- {label} ---")
    try:
        sig_corr = merged[sig_a].corr(merged[sig_b])
        sig_spear = merged[sig_a].corr(merged[sig_b], method="spearman")
        sign_agree = (merged[sig_a] * merged[sig_b] > 0).mean()
        print(f"Signal Pearson corr:    {sig_corr:.4f}")
        print(f"Signal Spearman corr:   {sig_spear:.4f}")
        print(f"Signal sign agreement:  {sign_agree:.3f}  (<0.5 = inversion)")
    except Exception as e:
        print(f"Signal comparison error: {e}")
    try:
        tgt_corr = merged[tgt_a].corr(merged[tgt_b])
        tgt_sign = (merged[tgt_a] * merged[tgt_b] > 0).mean()
        tgt_diff = (merged[tgt_a] - merged[tgt_b]).abs().mean()
        print(f"Target Pearson corr:    {tgt_corr:.4f}")
        print(f"Target sign agreement:  {tgt_sign:.3f}")
        print(f"Target mean abs diff:   {tgt_diff:.6f}")
    except Exception as e:
        print(f"Target comparison error: {e}")

# Run for each transition — adjust column names based on what exists in each file
transition_report(merged_2833, "Step-28 → Step-33",
                  "pred_final", "pred_score",
                  "target_future_return_t3", "actual_return")

transition_report(merged_3334, "Step-33 → Step-34.3",
                  "pred_score_33", "pred_score_34",
                  "actual_return_33", "actual_return_34")

transition_report(merged_2834, "Step-28 → Step-34.3",
                  "pred_final", "pred_score",
                  "target_future_return_t3", "actual_return")
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 4 — Transition-by-transition lineage trace']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 4,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code4.split('\n')[:-1]]
})

code5 = '''GROUND_TRUTH_IC = 0.026841

for sig, tgt in [
    ("pred_final",        "target_future_return_t3"),       # baseline
    ("pred_score",        "actual_return"),       # current broken
    ("-pred_score",       "actual_return"),       # H1: signal inversion
    ("pred_score",        "target_future_return_t3"),  # H2: horizon fix
    ("-pred_score",       "target_future_return_t3"),  # H3: both fixes
]:
    try:
        col = sig.lstrip("-")
        sign = -1 if sig.startswith("-") else 1
        ic = merged_2834.groupby("date", group_keys=False).apply(
            lambda x: (sign * x[col]).corr(x[tgt], method="spearman"),
            include_groups=False
        ).mean()
        match = "✓ GROUND TRUTH RESTORED" if abs(ic - GROUND_TRUTH_IC) < 0.01 else ""
        print(f"IC({sig} vs {tgt}): {ic:.4f}  {match}")
    except Exception as e:
        print(f"IC({sig} vs {tgt}): ERROR — {e}")
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 5 — Inversion isolation on the transition that broke']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 5,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code5.split('\n')[:-1]]
})

code6 = '''print("""Signal Lineage Audit — Final Report
=====================================
Ground truth IC (Step-33 published) : 0.026841
Step-28 best IC pair                : pred_final vs target_future_return_t3 = 0.0005
Step-33 direct IC                   : 0.026841  (expected: 0.0268)
Step-34.3 current IC                : -0.2030

Transition break point              : BOTH
  - Signal sign agreement broke at  : Step-28→33 (corr 0.218)
  - Target agreement broke at       : Step-33→34 (corr -0.021)
Horizon mismatch confirmed          : YES (diff = 0.0286)

Root cause:
  [x] Sign flip in pred_score at Step-[xx] -> Actually overwritten with something else entirely
  [x] Wrong target horizon (actual_return ≠ target_future_return_t3)
  [x] Both
  [ ] Different signal source

Corrected IC after fix              : 0.0005 (target_future_return_t3)

Conditions met:
  1. Ground truth pair identified   : NO (Step 28 best IC was 0.0005 not 0.0268, but Step-33 was 0.0268)
  2. Step-33 IC reproduced          : YES
  3. Break point localized          : YES
  4. Corrected IC reproduced        : NO (Original Step-28 did not have 0.0268)

Safe to proceed to Step-34.4        : NO
""")
'''
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['### Section 6 — Final report']
})
cells.append({
    'cell_type': 'code',
    'execution_count': 6,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code6.split('\n')[:-1]]
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

with open('c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/notebooks/signal_lineage_audit.ipynb', 'w') as f:
    json.dump(nb, f, indent=2)
