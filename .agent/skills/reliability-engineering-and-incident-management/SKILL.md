---
name: reliability-engineering-and-incident-management
description: Site Reliability Engineering (SRE) standards, structured JSON error logging, synthetic health check endpoints, error boundary telemetry, circuit breakers, and incident root cause analysis.
---

# Reliability Engineering and Incident Management Skill

## Purpose
Establishes operational reliability standards, error boundary telemetry, automated recovery, and incident analysis for the Glamouré platform.

## Core Directives

### 1. Structured Telemetry & Error Logging
- All application and API logs must follow structured JSON schema including:
  - `timestamp`: ISO-8601 UTC.
  - `level`: `INFO` | `WARN` | `ERROR` | `FATAL`.
  - `correlationId`: Distributed trace ID across service calls.
  - `tenantId` (`salonId`): Current salon context.
  - `userId`: Authenticated actor.
  - `error`: Error name, sanitized message, and normalized stack trace.
  - `durationMs`: Processing latency.

### 2. Deep Health Checks vs Liveness Probes
- **Liveness Probe** (`/api/liveness`): Lightweight check confirming process is responsive (HTTP 200).
- **Deep Health Check** (`/api/health`): Validates database connectivity, cache availability, ML model readiness, zero hard-constraint invariant violations, and free memory thresholds.

### 3. Graceful Degradation & Fallback Strategy
- When external APIs (payment gateway, notification SMS, or heavy ML inference) fail or time out:
  - Return cached or heuristic fallbacks rather than unhandled 500 errors.
  - Record metric in `IntelligenceMonitor` or audit trail.
  - Circuit breakers should open after 5 consecutive failures within 30 seconds, falling back to rule-based algorithms.

### 4. Incident Post-Mortem & Root Cause Analysis (RCA) Runbook
- For any P0/P1 production incident:
  1. **Immediate Mitigation**: Rollback to last known good build or engage circuit breaker.
  2. **Timeline Construction**: Exact chronological reconstruction of trigger event, detection, and mitigation.
  3. **5-Whys Root Cause Analysis**: Identify systemic gaps in testing, validation, or architecture.
  4. **Action Items**: Create automated regression test in `src/tests/` before closing ticket.
