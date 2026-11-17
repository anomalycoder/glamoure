---
name: devops-and-deployment-readiness
description: >-
  DevOps standards, environment variable validation, Docker containerization, CI/CD automated gates,
  database backup & recovery procedures, health-check endpoints, and zero-downtime deployment.
---

# DevOps & Deployment Readiness Skill

## 1. Environment Variable Architecture
- Maintain `.env.example` as a synchronized template of all required variables without real credentials.
- Classify variables into:
  - Public Client: `VITE_APP_URL`, `VITE_API_BASE_URL`, `VITE_APP_ENV`.
  - Private Infrastructure: `DATABASE_URL`, `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
  - Payment Gateways: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`.
  - Communications: `RESEND_API_KEY`, `TWILIO_AUTH_TOKEN`.
- Fail fast on application startup if critical production variables are missing.

## 2. CI/CD Automated Verification Gates
Every production deployment must pass 4 automated gates:
1. `npm run build`: Zero TypeScript compilation errors (`tsc -b`), clean asset bundling.
2. `npm test -- --run`: 100% test pass rate across all unit, integration, and E2E suites.
3. Security Lint: Check for exposed credentials, unescaped queries, and outdated dependencies.
4. Health Probe: Automated endpoint checking `/api/health` returning status 200 with database connectivity and model readiness.

## 3. Database Backup & Disaster Recovery
- **Daily Automated Snapshots**:
  ```bash
  pg_dump -Fc -v -h $DB_HOST -U $DB_USER -d $DB_NAME > glamoure_backup_$(date +%Y%m%d).dump
  ```
- **Point-in-Time Recovery (PITR)**: Enable write-ahead logging (WAL) archival with 7-day retention.
- **Dry-run Restoration Verification**:
  ```bash
  pg_restore -v -h $TEST_HOST -U $DB_USER -d glamoure_restore_test glamoure_backup.dump
  ```
- Non-destructive Migrations: Never run `DROP TABLE` or destructive column alters on active production tables without verified data archival.
