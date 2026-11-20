# Statistical Audit & Methodological Defense Report

*Report Generated: 2026-08-26 21:13:56*  
*Evaluation Dataset: Genuinely Unseen January 1 – June 30, 2026 Test Set ($N = 11,803$ observations, 97 NSE tickers)*

---

## 1. Audit Executive Summary & Discrepancy Resolution

This report resolves the statistical methodology audit requested for the 2026 held-out test set evaluation:

1. **Resolution of ROC-AUC Discrepancy**:
   - In previous preliminary summaries, an uncalibrated ROC-AUC point estimate ($0.5479$) from a validation-tuned threshold experiment was inadvertently confused with the observed test set ROC-AUC.
   - **Audited Truth**: On the fixed $N=11,803$ test set, **Rolling 18M XGBoost** yields an observed ROC-AUC of **0.5235**. Its 1,000-sample bootstrap mean is **0.5233 (SE = 0.0051)** with a 95% percentile CI of **[0.5139, 0.5335]**.
   - The discrepancy between $0.5235$ and $0.5233$ is strictly expected sampling noise ($\Delta = 0.0002$) inherent in non-parametric bootstrap resampling.

2. **One-Sample Binomial Test vs 50% Benchmark**:
   - **Rolling XGBoost Accuracy**: **52.41%** ($K = 6,186 / 11,803$).
   - Exact 95% Clopper-Pearson CI: **[51.50%, 53.31%]** (strictly excludes 50.0%).
   - Exact Binomial Test $p$-value ($H_0: p = 0.50$): $p = 8.51 	imes 10^-8$ (statistically significant).
   - **Effect Size (Cohen's $h$)**: $h = 0.0482$ (**very small effect size**).

3. **Comparison Against Naive Majority Class**:
   - On the 2026 test set, the majority class is **DOWN (52.15%)**.
   - Naive Majority Class prediction achieves **52.15% accuracy**.
   - An exact binomial test comparing XGBoost ($52.41\%$) against the 52.15% benchmark yields $p = 0.2871$. **The model does not demonstrate a statistically significant accuracy gain over a naive majority-class classifier.**

---

## 2. Accuracy, Clopper-Pearson CIs & Significance Tests vs 50% Benchmark

| Model / Baseline | N | Correct (k) | Accuracy | Exact 95% Clopper-Pearson CI | Binomial $p$-value ($p=0.50$) | Cohen's $h$ Effect Size |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Naive Majority Class (Predict DOWN)** | 11,803 | 0 | **0.00%** | **[0.00%, 0.03%]** | $1.00e+00$ | $-1.5708$ |
| **Random Classifier (p=0.5)** | 11,803 | 5,893 | **49.93%** | **[49.02%, 50.83%]** | $5.66e-01$ | $-0.0014$ |
| **Random Forest Baseline** | 11,803 | 6,121 | **51.86%** | **[50.95%, 52.76%]** | $2.76e-05$ | $0.0372$ |
| **AdamW Transformer** | 9,883 | 5,077 | **51.37%** | **[50.38%, 52.36%]** | $3.30e-03$ | $0.0274$ |
| **Rolling 18M XGBoost** | 11,803 | 6,186 | **52.41%** | **[51.50%, 53.31%]** | $8.51e-08$ | $0.0482$ |

---

## 3. Stratified Bootstrap ROC-AUC Audit (1,000 Iterations)

| Model | Observed ROC-AUC | Bootstrap Mean AUC | Std Error (SE) | 95% Bootstrap Percentile CI | Strictly Above 0.500? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Rolling 18M XGBoost** | **0.5235** | 0.5233 | 0.0051 | **[0.5139, 0.5335]** | ✅ Yes |
| **AdamW Transformer** | **0.4893** | 0.4892 | 0.0060 | **[0.4775, 0.5012]** | ❌ No |

---

## 4. McNemar's Paired Significance Test Audit

| Comparison Pair | Both Correct (a) | Model 1 Only (b) | Model 2 Only (c) | Both Incorrect (d) | $\chi^2$ Stat | $p$-value | Statistical Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rolling XGBoost vs Random Classifier** | 3,087 | 3,099 | 2,806 | 2,811 | **14.4888** | **1.41e-04** | $p < 0.001$ (Significant vs Random) |
| **Rolling XGBoost vs Random Forest Baseline** | 4,662 | 1,524 | 1,459 | 4,158 | **1.3947** | **2.38e-01** | $p = 0.238$ (No Stat Diff vs RF) |
| **Rolling XGBoost vs AdamW Transformer** | 1,439 | 3,827 | 3,638 | 979 | **4.7598** | **2.91e-02** | $p = 0.029$ ($p < 0.05$ Diff vs Trf) |

---

## 5. Temporal & Quarter-by-Quarter 2026 Stability Audit

| Quarter | Samples | Rolling XGBoost Acc | Rolling XGBoost AUC | AdamW Transformer Acc | AdamW Transformer AUC |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **2026Q1** | 5,758 | **53.2%** | **0.518** | 52.1% | 0.474 |
| **2026Q2** | 6,045 | **51.6%** | **0.523** | 50.9% | 0.480 |

---

## 6. Methodological Limitations & Publication Defense Statement

> **Academic Limitations Disclosure**:
> 1. **Effect Size**: Although the accuracy ($52.41\%$) is statistically significant compared to a random 50% guess ($p = 8.51 	imes 10^{-8}$), the effect size is very small (Cohen's $h = 0.0482$).
> 2. **Benchmark Threshold**: When compared against the naive majority class benchmark (DOWN = $52.15\%$), the model does not demonstrate a statistically significant improvement ($p = 0.2871$).
> 3. **Non-Stationarity**: Next-day directional stock prediction remains heavily noise-dominated; recency-aware rolling training prevents catastrophic drops but yields modest predictive alpha.

> **Final IEEE Defense Statement**:
> "Evaluated on a 6-month out-of-sample test set (January–June 2026, N = 11,803 across 97 NSE equities), the Rolling 18-Month XGBoost forecasting framework achieved a directional classification accuracy of **52.41% (95% Clopper-Pearson CI: [51.50%, 53.31%])** and a **1,000-sample bootstrap ROC-AUC of 0.5235 (95% CI: [0.5139, 0.5335])**. An exact one-sample binomial test confirms the accuracy strictly exceeds random 50% chance ($p = 8.51 	imes 10^{-8}, h = 0.0482$), though it does not significantly outperform the unadjusted majority-class benchmark ($52.15\%, p = 0.2871$)."
