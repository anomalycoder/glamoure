---
name: database-engineering-and-migrations
description: Enterprise PostgreSQL schema architecture, Supabase Row-Level Security (RLS) enforcement, composite indexing strategies, zero-downtime migration runbooks, and ACID transaction guarantees.
---

# Database Engineering and Migrations Skill

## Purpose
Provides standardized architectural patterns, schema design constraints, query execution optimization, and multi-tenant data isolation standards for Glamouré.

## Core Directives

### 1. Multi-Tenant Row-Level Security (RLS)
- Every table containing salon-specific data (`appointments`, `services`, `staff_profiles`, `invoices`, `queue_items`, `inventory_items`) MUST contain an indexed `salon_id UUID REFERENCES salons(id)`.
- RLS policies must strictly isolate tenant reads and writes based on authenticated session context:
  ```sql
  ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY tenant_isolation_policy ON appointments
    FOR ALL
    USING (salon_id = auth.jwt() ->> 'salon_id')
    WITH CHECK (salon_id = auth.jwt() ->> 'salon_id');
  ```

### 2. Double-Booking & Slot Conflict Prevention
- Slot reservation must use pessimistic concurrency control (`SELECT ... FOR UPDATE`) or transactional conditional inserts:
  ```sql
  -- Prevent concurrent booking overlap
  INSERT INTO appointments (salon_id, staff_id, appointment_date, start_time, end_time, status)
  SELECT $1, $2, $3, $4, $5, 'confirmed'
  WHERE NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE staff_id = $2
      AND appointment_date = $3
      AND status NOT IN ('cancelled', 'no_show')
      AND (start_time < $5 AND end_time > $4)
  );
  ```

### 3. High-Performance Indexing Matrix
- Multi-column composite indexes on high-frequency query access paths:
  - `CREATE INDEX idx_appts_staff_date_time ON appointments(staff_id, appointment_date, start_time);`
  - `CREATE INDEX idx_appts_salon_status ON appointments(salon_id, status);`
  - `CREATE INDEX idx_appts_customer ON appointments(customer_id, appointment_date DESC);`

### 4. Zero-Downtime Migration Safety Checklist
- Never execute destructive column drops or type mutations in a single deployment.
- Follow the Expand/Contract migration pattern:
  1. Add new column with safe default (nullable).
  2. Dual-write to old and new columns in application code.
  3. Backfill historic records via batched background job.
  4. Switch reads to new column.
  5. Remove old column and dual-write logic in subsequent deployment.
