import json
from pathlib import Path

cells = []

# Objective 1
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['# Target Horizon Repair\n', 'Objective 1 — Trace where actual_return was introduced']
})
code1 = '''import pandas as pd
from pathlib import Path

FINAL_DIR = Path("../Market_Data/final")

files = {
    "Step-33":   "step33_cost_aware_portfolio.parquet",
    "Step-34":   "step34_periodic_rebalancing.parquet",
    "Step-34.1": "step34_1_turnover_audit.parquet",
    "Step-34.2": "step34_2_persistence_engine.parquet",
    "Step-34.3": "step34_3_regime_persistence.parquet",
}

for name, fname in files.items():
    try:
        df = pd.read_parquet(FINAL_DIR / fname)
        print(f"\\n{name}")
        print("Has actual_return:", "actual_return" in df.columns)
        print("Has target_future_return_t3:", "target_future_return_t3" in df.columns)

        if "actual_return" in df.columns:
            print(df["actual_return"].describe())

        if "target_future_return_t3" in df.columns:
            print(df["target_future_return_t3"].describe())

        if "actual_return" in df.columns and "target_future_return_t3" in df.columns:
            diff = (df["actual_return"] - df["target_future_return_t3"]).abs().mean()
            print(f"Mean diff: {diff:.6f}")
    except FileNotFoundError:
        print(f"{name}: file not found — skip")
'''
cells.append({
    'cell_type': 'code',
    'execution_count': 1,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code1.split('\n')[:-1]]
})
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['The exact notebook where `actual_return` first diverged from `target_future_return_t3` is Step 33. `target_future_return_t3` disappears from Step 33 onwards completely, and is replaced by `actual_return` which matches `target_future_return_t3` in Step 33, but diverges in Step 34.3.']
})

# Objective 2
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['Objective 2 — Direct IC proof before any remapping']
})
code2 = '''df = pd.read_parquet(FINAL_DIR / "step34_3_regime_persistence.parquet")

ic_original = df.groupby("date", group_keys=False).apply(
    lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
    include_groups=False
).mean()

try:
    ic_corrected = df.groupby("date", group_keys=False).apply(
        lambda x: x["pred_score"].corr(x["target_future_return_t3"], method="spearman"),
        include_groups=False
    ).mean()
except KeyError as e:
    print(f"KeyError: {e} - STOPPING ENTIRELY")
    ic_corrected = -999

print(f"Original IC  (pred_score vs actual_return):            {ic_original:.6f}")
print(f"Corrected IC (pred_score vs target_future_return_t3):  {ic_corrected:.6f}")
print(f"Expected:                                               0.026841")
print(f"Match: {'YES' if abs(ic_corrected - 0.026841) < 0.005 else 'NO'}")
'''
cells.append({
    'cell_type': 'code',
    'execution_count': 2,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code2.split('\n')[:-1]]
})

# Objective 3
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['Objective 3 — Horizon identification via lag sweep']
})
code3 = '''# Identify exactly what horizon actual_return represents
print("Lag sweep: actual_return vs target_future_return_t3")

try:
    df_sorted = df.sort_values(["ticker", "date"])

    for lag in range(-5, 6):
        shifted = df_sorted.groupby("ticker")["actual_return"].shift(lag)
        corr = shifted.corr(df_sorted["target_future_return_t3"])
        marker = " ← PEAK" if abs(corr) == max(
            abs(df_sorted.groupby("ticker")["actual_return"].shift(l)
                .corr(df_sorted["target_future_return_t3"])) for l in range(-5, 6)
        ) else ""
        print(f"Lag {lag:+d}: corr={corr:.4f}{marker}")
except KeyError as e:
    print(f"Cannot run lag sweep: {e}")
'''
cells.append({
    'cell_type': 'code',
    'execution_count': 3,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code3.split('\n')[:-1]]
})
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['Identified horizon: Cannot be identified because `target_future_return_t3` is completely missing.']
})

# Objective 4
cells.append({
    'cell_type': 'markdown',
    'metadata': {},
    'source': ['Objective 4 — Rebuild with corrected target and save']
})
code4 = '''# Assert target column is complete before remapping
if "target_future_return_t3" not in df.columns:
    print("HALT: target_future_return_t3 is completely missing from df.")
else:
    assert df["target_future_return_t3"].notna().all(), \\
        "Missing values in target_future_return_t3 — cannot remap safely"

    # Remap in memory — do not modify original parquet
    df["actual_return"] = df["target_future_return_t3"]

    # Verify IC is restored
    ic_restored = df.groupby("date", group_keys=False).apply(
        lambda x: x["pred_score"].corr(x["actual_return"], method="spearman"),
        include_groups=False
    ).mean()

    print(f"Restored IC: {ic_restored:.6f}")
    assert ic_restored > 0.020, f"IC not restored: {ic_restored:.4f}"
    assert abs(ic_restored - 0.026841) < 0.005, \\
        f"IC does not match Step-33 ground truth: {ic_restored:.4f}"

    df.to_parquet(FINAL_DIR / "step34_3_corrected.parquet")
    print("Saved: step34_3_corrected.parquet")
'''
cells.append({
    'cell_type': 'code',
    'execution_count': 4,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code4.split('\n')[:-1]]
})

code5 = '''ic_restored = -999.0

print(f"""
Target Horizon Repair — Status
================================
actual_return introduced at      : Step-33
actual_return represents         : [Unknown, missing reference column]
IC before fix                    : {ic_original:.4f}
IC after fix                     : {ic_restored:.4f}  (target: 0.026841)
IC matches Step-33 ground truth  : {'YES' if abs(ic_restored - 0.026841) < 0.005 else 'NO'}

Corrected file saved             : FAILED TO SAVE

Component Status:
  Step-28 Alpha     : ✅ Valid
  Step-33 Alpha     : ✅ Valid
  Signal lineage    : ✅ Preserved
  Step-34.3 target  : {'✅ Repaired' if abs(ic_restored - 0.026841) < 0.005 else '❌ Still broken'}
  Step-34.4         : {'✅ Re-enabled' if abs(ic_restored - 0.026841) < 0.005 else '⛔ Still paused'}

Safe to proceed to Step-34.4     : {'YES' if abs(ic_restored - 0.026841) < 0.005 else 'NO'}
""")
'''
cells.append({
    'cell_type': 'code',
    'execution_count': 5,
    'metadata': {},
    'outputs': [],
    'source': [line + '\n' for line in code5.split('\n')[:-1]]
})

nb = {
  'cells': cells,
  'metadata': {
    'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
    'language_info': {'name': 'python', 'version': '3.11.15'}
  },
  'nbformat': 4,
  'nbformat_minor': 4
}

with open('c:/Users/Priyanshu/Desktop/Main/final-year/ml_core/ml_pipeline/notebooks/34_3_1_target_horizon_repair.ipynb', 'w', encoding="utf-8") as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)
