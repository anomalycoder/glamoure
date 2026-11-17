---
name: ai-and-ml-engineering
description: >-
  Machine learning pipeline engineering, 3-tier hard constraint scheduling, model evaluation,
  time-series demand/revenue forecasting, aspect NLP sentiment analysis, and zero-hallucination grounded AI querying.
---

# AI & Machine Learning Engineering Skill

## 1. 3-Tier Scheduling Hierarchy
- **Tier 1 (Hard Constraints - Inviolable)**:
  - Salon operating hours (`salon.settings.businessHours`).
  - Staff shift hours (`WorkingHours`).
  - Approved leave (`LeaveRequest`).
  - Overlap collisions: new slot `[start, end + buffer]` must not overlap existing bookings.
  - Staff qualifications: staff must have `servicesOffered.includes(serviceId)`.
  - Hard constraint violation rate must strictly equal **0.0%**.
- **Tier 2 (Workload Optimization)**:
  - Level bookings across active artisans to prevent burnout.
  - Maximize schedule compactness by penalizing awkward idle gaps (15-45 mins).
- **Tier 3 (Learned Ranking)**:
  - Composite scoring (0-100) weighting customer past stylist affinity, rating, and time preference.

## 2. Preventing Data Leakage in Time-Series
- Never use future data when evaluating demand or revenue forecasting.
- Split historical series strictly chronologically (`train: past 80%`, `test: future 20%`).
- Display forecasts clearly separated from actual recorded database revenue.

## 3. Zero-Hallucination Grounded AI Assistants
- AI business assistants querying salon operations must query live database tables directly.
- Include structured metrics, data sources (e.g. `['appointments', 'payments']`), date ranges, and confidence scores in responses.
- If data is absent or insufficient, provide transparent cold-start heuristics without fabricating numbers.

## 4. Model Registry & Drift Governance
- Every deployed model must maintain:
  - Version identifier (semantic versioning, e.g. `2.1.0`).
  - Primary evaluation metric (e.g. NDCG@3, Precision@K, MAE, MAPE, ROC-AUC).
  - Training sample count.
  - Fallback activation indicator.
- ML service degradation must never block normal core appointment booking.
