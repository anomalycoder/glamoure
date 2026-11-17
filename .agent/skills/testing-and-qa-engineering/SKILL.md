---
name: testing-and-qa-engineering
description: >-
  Standardized testing, QA automation, test-driven development (TDD), Vitest suite construction,
  concurrency testing, API contract verification, and end-to-end multi-role workflow validation.
---

# Testing & QA Engineering Skill

## 1. Test Suite Hierarchy
Every production system must maintain automated test coverage across 5 tiers:
1. **Unit Tests**:
   - Mathematical calculations (pricing, GST tax, discounts, margin percentages).
   - Data cleaning, deduplication, and outlier filtering.
   - Date, time, and slot duration conversion utilities.
2. **Integration Tests**:
   - Authentication, password verification, and session persistence.
   - RBAC permission evaluation (`hasPermission`, `canAccessSalon`, `isRouteAllowedForRole`).
   - Appointment booking and availability calculation.
3. **End-to-End Workflow Tests**:
   - Workflows A through K: Onboarding, Customer registration, Complete booking, Service execution, Cancellation, Rescheduling, Walk-in queue, Leave handling, Multi-branch, AI scheduling, Business intelligence.
4. **Concurrency & Edge Case Tests**:
   - Simultaneous booking collision detection.
   - Webhook idempotency and replay protection.
   - Boundary condition durations (15m to 360m).
5. **Machine Learning & Predictive Tests**:
   - Model accuracy, MAE/MAPE error evaluation, confidence intervals, zero-hallucination assistant assertions.

## 2. Test Execution Principles
- Never mock the primary business logic being tested. Use real service instances against a clean in-memory or transactional database state.
- Strictly separate training and evaluation datasets chronologically to prevent temporal data leakage.
- Never weaken assertions to make failing tests pass. Discover root causes, implement proper code fixes, and verify regression stability.
- Continuous Test Verification: Run `npm test -- --run` after every significant code modification.
