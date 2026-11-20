# Comprehensive Diagnostic Report: Validation-to-Test Performance Analysis

*Report Generated: 2026-08-26 18:42:45*

## 1. Reproduction & Baseline Audit

- **Dataset Path**: `C:\Users\Priyanshu\Desktop\Main\proj\final-year\ml_core\ml_pipeline\Market_Data\processed\final_model_dataset_with_volatility.parquet`
- **Total Rows**: 64,737 (168 columns, 159 features)
- **Train Set**: 28,459 rows (2023-04-18 to 2024-06-28)
- **Validation Set**: 12,222 rows (2024-07-01 to 2024-12-31)
- **Test Set**: 24,056 rows (2025-01-01 to 2025-12-30)

| Model | Accuracy | Bal Acc | Precision | Recall | F1 Score | MCC | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | 0.5098 | 0.5072 | 0.5442 | 0.0839 | 0.1454 | 0.0272 | 0.5108 |
| **XGBoost** | 0.5038 | 0.5036 | 0.5008 | 0.4722 | 0.4861 | 0.0072 | 0.501 |
| **PyTorch LSTM** | 0.5019 | 0.5017 | 0.5017 | 0.7316 | 0.5953 | 0.0038 | 0.4997 |
| **PyTorch Transformer** | 0.4978 | 0.4976 | 0.4988 | 0.6687 | 0.5714 | -0.0051 | 0.4977 |


## 2. Feature & Target Distribution Shift Analysis

### Target Class Distributions

- **Train Target**: UP = 53.90% | DOWN = 46.10%
- **Val Target**: UP = 48.76% | DOWN = 51.24%
- **Test Target**: UP = 49.70% | DOWN = 50.30%

### Key Feature Statistics Across Splits

| Feature | Split | Mean | Std | Median | Min | Max |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `NIFTY_RET` | Train | 0.0011 | 0.0076 | 0.0014 | -0.0593 | 0.0336 |
| `NIFTY_RET` | Val | -0.0001 | 0.0076 | 0.0000 | -0.0268 | 0.0239 |
| `NIFTY_RET` | Test | 0.0003 | 0.0073 | 0.0000 | -0.0324 | 0.0382 |
| `VIX_RET` | Train | 0.0003 | 0.0519 | -0.0040 | -0.1444 | 0.1610 |
| `VIX_RET` | Val | 0.0072 | 0.1229 | -0.0097 | -0.2816 | 0.7404 |
| `VIX_RET` | Test | 0.0037 | 0.0848 | -0.0073 | -0.1790 | 0.5093 |
| `Return` | Train | 0.0021 | 0.0195 | 0.0012 | -0.2519 | 0.2560 |
| `Return` | Val | -0.0001 | 0.0189 | -0.0004 | -0.2261 | 0.2177 |
| `Return` | Test | 0.0005 | 0.0174 | 0.0000 | -0.4015 | 0.2000 |
| `Volatility_20` | Train | 0.0173 | 0.0090 | 0.0152 | 0.0034 | 0.0861 |
| `Volatility_20` | Val | 0.0176 | 0.0078 | 0.0162 | 0.0032 | 0.0830 |
| `Volatility_20` | Test | 0.0161 | 0.0070 | 0.0146 | 0.0041 | 0.0919 |
| `RSI` | Train | 56.9838 | 11.8387 | 57.1261 | 14.7860 | 92.5794 |
| `RSI` | Val | 50.5106 | 12.2501 | 50.1571 | 12.2257 | 87.9257 |
| `RSI` | Test | 51.0342 | 11.6369 | 50.9034 | 12.0899 | 90.2076 |
| `Avg_Tone` | Train | -1.4115 | 2.4208 | -1.5482 | -7.0297 | 6.2748 |
| `Avg_Tone` | Val | -1.3721 | 2.4461 | -1.2904 | -8.0894 | 5.9631 |
| `Avg_Tone` | Test | -1.6753 | 2.5431 | -1.7460 | -8.9778 | 4.5292 |
| `Event_Count` | Train | 1126.8742 | 159.9234 | 1188.0000 | 753.0000 | 1314.0000 |
| `Event_Count` | Val | 1109.0397 | 166.2421 | 1182.0000 | 750.0000 | 1318.0000 |
| `Event_Count` | Test | 1116.3629 | 165.6912 | 1185.5000 | 715.0000 | 1297.0000 |
| `GOLD_RET` | Train | 0.0004 | 0.0082 | 0.0003 | -0.0276 | 0.0311 |
| `GOLD_RET` | Val | 0.0009 | 0.0097 | 0.0019 | -0.0344 | 0.0185 |
| `GOLD_RET` | Test | 0.0024 | 0.0122 | 0.0030 | -0.0450 | 0.0350 |
| `USDINR_RET` | Train | 0.0001 | 0.0027 | 0.0000 | -0.0229 | 0.0230 |
| `USDINR_RET` | Val | 0.0002 | 0.0010 | 0.0001 | -0.0039 | 0.0037 |
| `USDINR_RET` | Test | 0.0002 | 0.0031 | 0.0002 | -0.0110 | 0.0149 |

#### Distribution Drift Warnings (Z-Shift > 0.3 Std Dev):
- **`RSI`**: Z-Shift = `0.50` standard deviations from Train to 2025 Test.


## 3. Volatility & Market Regime Shift Analysis

### Volatility Regime Proportions

| Split | LOW Regime % | MEDIUM Regime % | HIGH Regime % |
| :--- | :---: | :---: | :---: |
| Train | 45.9% | 25.6% | 28.5% |
| Val | 37.7% | 31.6% | 30.7% |
| Test | 50.3% | 24.4% | 25.3% |

### Annual Macro & Market Indicators

| Year | Annual NIFTY Mean Return | Annual NIFTY Volatility | Avg VIX Return | Avg Sentiment Tone |
| :---: | :---: | :---: | :---: | :---: |
| 2023 | 0.00118 | 0.00564 | 0.00022 | -1.2866 |
| 2024 | 0.00044 | 0.00881 | 0.00395 | -1.4793 |
| 2025 | 0.00031 | 0.00731 | 0.00373 | -1.6753 |


## 4. Quarterly Performance Breakdown (2025)

### Model Performance Across 2025 Quarters

| Quarter | Model | Samples | Accuracy | Bal Acc | F1 Score | ROC-AUC |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 2025Q1 | XGBoost | 6,014 | 0.5095 | 0.5064 | 0.4665 | 0.4951 |
| 2025Q1 | Random Forest | 6,014 | 0.5366 | 0.5104 | 0.1658 | 0.5117 |
| 2025Q1 | PyTorch LSTM | 4,074 | 0.4948 | 0.5035 | 0.5576 | 0.4894 |
| 2025Q1 | PyTorch Transformer | 4,074 | 0.4929 | 0.5047 | 0.5787 | 0.5002 |
| 2025Q2 | XGBoost | 5,917 | 0.509 | 0.518 | 0.4755 | 0.5008 |
| 2025Q2 | Random Forest | 5,917 | 0.4675 | 0.5047 | 0.1086 | 0.5261 |
| 2025Q2 | PyTorch LSTM | 5,917 | 0.5156 | 0.4924 | 0.6327 | 0.4918 |
| 2025Q2 | PyTorch Transformer | 5,917 | 0.4881 | 0.4789 | 0.5548 | 0.4618 |
| 2025Q3 | XGBoost | 6,208 | 0.4779 | 0.4841 | 0.5243 | 0.4977 |
| 2025Q3 | Random Forest | 6,208 | 0.5279 | 0.5079 | 0.1829 | 0.5038 |
| 2025Q3 | PyTorch LSTM | 6,208 | 0.49 | 0.5056 | 0.6029 | 0.5112 |
| 2025Q3 | PyTorch Transformer | 6,208 | 0.5066 | 0.5172 | 0.5839 | 0.5338 |
| 2025Q4 | XGBoost | 5,917 | 0.5199 | 0.5208 | 0.4685 | 0.5235 |
| 2025Q4 | Random Forest | 5,917 | 0.506 | 0.5099 | 0.1235 | 0.5179 |
| 2025Q4 | PyTorch LSTM | 5,917 | 0.5057 | 0.5044 | 0.5692 | 0.4965 |
| 2025Q4 | PyTorch Transformer | 5,917 | 0.5016 | 0.5002 | 0.5692 | 0.5137 |


## 5. Volatility Regime Performance Breakdown

### 2025 Test Performance by Volatility Regime

| Volatility Regime | Model | Samples | Accuracy | Bal Acc | F1 Score | ROC-AUC |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| LOW | XGBoost | 12,099 | 0.499 | 0.4985 | 0.4819 | 0.4989 |
| LOW | Random Forest | 12,099 | 0.5145 | 0.5064 | 0.1637 | 0.5064 |
| LOW | PyTorch LSTM | 12,222 | 0.4968 | 0.4977 | 0.5831 | 0.4951 |
| LOW | PyTorch Transformer | 12,222 | 0.5103 | 0.5109 | 0.5725 | 0.5185 |
| MEDIUM | XGBoost | 5,863 | 0.5025 | 0.5023 | 0.4883 | 0.4984 |
| MEDIUM | Random Forest | 5,863 | 0.5148 | 0.5116 | 0.1433 | 0.5137 |
| MEDIUM | PyTorch LSTM | 3,395 | 0.5328 | 0.5101 | 0.6839 | 0.5661 |
| MEDIUM | PyTorch Transformer | 3,395 | 0.4713 | 0.4576 | 0.5918 | 0.477 |
| HIGH | XGBoost | 6,094 | 0.5146 | 0.5159 | 0.4923 | 0.5076 |
| HIGH | Random Forest | 6,094 | 0.4957 | 0.5058 | 0.11 | 0.5203 |
| HIGH | PyTorch LSTM | 6,499 | 0.4955 | 0.4977 | 0.5596 | 0.475 |
| HIGH | PyTorch Transformer | 6,499 | 0.4881 | 0.4905 | 0.5574 | 0.468 |


## 6. Feature Selection Overfitting Analysis

### Feature Subset Evaluation (Validation vs 2025 Test)

| Feature Count | Model | Validation BalAcc | 2025 Test BalAcc | 2025 Test Acc | 2025 Test AUC |
| :---: | :--- | :---: | :---: | :---: | :---: |
| Top 159 | Random Forest | 0.5101 | 0.5043 | 0.5032 | 0.5249 |
| Top 159 | XGBoost | 0.4939 | 0.4833 | 0.4822 | 0.5035 |
| Top 100 | Random Forest | 0.4937 | 0.5015 | 0.5005 | 0.5083 |
| Top 100 | XGBoost | 0.4953 | 0.4899 | 0.4887 | 0.5008 |
| Top 60 | Random Forest | 0.4801 | 0.4995 | 0.4985 | 0.5083 |
| Top 60 | XGBoost | 0.5039 | 0.4907 | 0.4896 | 0.5056 |
| Top 40 | Random Forest | 0.5125 | 0.4849 | 0.484 | 0.4981 |
| Top 40 | XGBoost | 0.4953 | 0.4952 | 0.4942 | 0.5082 |


## 7. Decision Threshold Sensitivity Analysis

### Decision Threshold Scan (Validation vs 2025 Test)

| Threshold | PyTorch Transformer Val BAcc | PyTorch Transformer Test BAcc | XGBoost Val BAcc | XGBoost Test BAcc |
| :---: | :---: | :---: | :---: | :---: |
| 0.40 | 0.5072 | 0.4951 | 0.6276 | 0.4985 |
| 0.42 | 0.5122 | 0.4934 | 0.6478 | 0.4965 |
| 0.44 | 0.5175 | 0.4919 | 0.6602 | 0.4948 |
| 0.46 | 0.5269 | 0.4929 | 0.6680 | 0.4995 |
| 0.48 | 0.5361 | 0.4942 | 0.6718 | 0.4971 |
| 0.50 | 0.5382 | 0.4991 | 0.6721 | 0.4878 |
| 0.52 | 0.5316 | 0.4987 | 0.6715 | 0.4949 |
| 0.54 | 0.5216 | 0.4980 | 0.6597 | 0.5060 |
| 0.56 | 0.5082 | 0.4983 | 0.6476 | 0.5043 |
| 0.58 | 0.5041 | 0.4983 | 0.6325 | 0.5017 |
| 0.60 | 0.4949 | 0.5006 | 0.6112 | 0.5013 |


## 8. Prediction Probability Distribution & Calibration Audit

### Probability Distribution Summary Statistics ($P(\text{UP})$)

| Model | Split | Mean P(UP) | Std Dev | Min P | Max P | % Predicted UP (t=0.5) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| XGBoost | Validation | 0.4999 | 0.1257 | 0.1873 | 0.8233 | 48.7% |
| XGBoost | 2025 Test | 0.5149 | 0.0871 | 0.2386 | 0.7521 | 63.6% |
| PyTorch Transformer | Validation | 0.5534 | 0.1127 | 0.2170 | 0.8264 | 68.5% |
| PyTorch Transformer | 2025 Test | 0.5342 | 0.1190 | 0.1574 | 0.8372 | 64.6% |
| PyTorch LSTM | Validation | 0.5381 | 0.0318 | 0.4637 | 0.6546 | 91.2% |
| PyTorch LSTM | 2025 Test | 0.5305 | 0.0302 | 0.4413 | 0.6192 | 82.3% |


## 9. Loss & Convergence Trajectory Audit

### Saved Training History Metrics

#### LSTM Training Trajectory (6 Epochs Executed):

| Epoch | Train Loss | Validation Loss | Validation BalAcc |
| :---: | :---: | :---: | :---: |
| 1 | 0.6886 | 0.6988 | 0.5055 |
| 2 | 0.6812 | 0.7016 | 0.4897 |
| 3 | 0.6721 | 0.7094 | 0.5004 |
| 4 | 0.6647 | 0.7168 | 0.4957 |
| 5 | 0.6578 | 0.7209 | 0.4976 |
| 6 | 0.6510 | 0.7275 | 0.4989 |

#### Transformer Training Trajectory (17 Epochs Executed):

| Epoch | Train Loss | Validation Loss | Validation BalAcc |
| :---: | :---: | :---: | :---: |
| 1 | 0.7182 | 0.7130 | 0.5029 |
| 2 | 0.7007 | 0.7148 | 0.5023 |
| 3 | 0.6934 | 0.7132 | 0.5033 |
| 4 | 0.6877 | 0.7158 | 0.5097 |
| 5 | 0.6843 | 0.7143 | 0.5116 |
| 6 | 0.6807 | 0.7120 | 0.5190 |
| 7 | 0.6769 | 0.7178 | 0.5255 |
| 8 | 0.6745 | 0.7218 | 0.5314 |
| 9 | 0.6690 | 0.7229 | 0.5307 |
| 10 | 0.6683 | 0.7220 | 0.5356 |
| 11 | 0.6664 | 0.7256 | 0.5347 |
| 12 | 0.6635 | 0.7247 | 0.5382 |
| 13 | 0.6599 | 0.7261 | 0.5381 |
| 14 | 0.6595 | 0.7249 | 0.5361 |
| 15 | 0.6568 | 0.7270 | 0.5294 |
| 16 | 0.6537 | 0.7281 | 0.5264 |
| 17 | 0.6522 | 0.7266 | 0.5246 |



## 10. Pipeline & Preprocessing Integrity Audit

### Data Pipeline & Preprocessing Verification Checks

- **Top Features File Exists**: `True` (60 features)
- **Scaler File Exists**: `True`
- **Ensemble Config Exists**: `True`
- **Lookahead Bias Check**: Per-ticker sequence indices verified. Zero future observation leak detected (`seq_has_lookahead=False`).
- **Scaler Fit Boundary**: Scaler fit strictly on Train (April 2023 – June 2024). Applied via `.transform()` to Validation and Test sets.


## 11. Root Cause Synthesis & Research Conclusion

### Summary of Empirical Findings & Root Cause Analysis

1. **Genuinely Non-Stationary Predictive Signal**:
   - The primary cause of the validation-to-test performance drop is that **next-day stock return direction on the NSE exhibits high non-stationarity and low signal-to-noise ratio**.
   - Model ROC-AUC scores on the held-out 2025 test set cluster around **0.498 – 0.514**, confirming that complex non-linear combinations of technical indicators, macro variables, and GDELT sentiment do not maintain stable predictive power across calendar years.

2. **Validation Overfitting via Threshold & Feature Selection**:
   - Selecting a decision threshold (`0.49`) and top 60 features strictly to maximize Validation Balanced Accuracy (`53.89%`) created an optimistic validation score that failed to generalize when evaluated on 2025 test data (`49.78%`).
   - The validation set (Jul–Dec 2024) represented a 6-month period with distinct momentum characteristics that did not persist throughout 2025.

3. **No Implementation Code or Leakage Defects**:
   - Temporal boundaries were strictly maintained (`Train <= 2024-06-30 < Val <= 2024-12-31 < Test >= 2025-01-01`).
   - Feature scalers were fit strictly on the Training set.
   - Sequence construction was properly isolated per-ticker with zero lookahead bias.

### Scientific Research Finding
> **Conclusion**: The empirical evidence demonstrates that next-day stock market trend direction cannot be reliably predicted above random chance (~50-51%) using daily technical, macro, and sentiment features under strict, non-leaking out-of-sample testing. High validation accuracy (~53.89%) was a localized artifact of validation set threshold tuning.

