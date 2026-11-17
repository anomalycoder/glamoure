# GLAMOURÉ LUXURY PLATFORM — DATABASE BACKUP & DISASTER RECOVERY RUNBOOK

This operational runbook defines the enterprise database backup, Point-in-Time Recovery (PITR), multi-tenant isolation verification, and disaster recovery procedures for the Glamouré platform.

---

## 1. ARCHITECTURAL OVERVIEW & RECOVERY TARGETS

Glamouré operates on an isolated multi-tenant architecture with shared schema, enforced by PostgreSQL Row-Level Security (RLS) policies and indexed `salon_id` partitioning.

| Metric | Target | Definition |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | < 5 Minutes | Maximum acceptable data loss window via continuous Write-Ahead Log (WAL) archiving. |
| **RTO (Recovery Time Objective)** | < 15 Minutes | Maximum acceptable platform downtime to restore full transaction capability. |
| **Data Retention Standard** | 30 Days PITR | Continuous Point-in-Time recovery availability + 1 Year immutable monthly snapshots. |
| **Encryption Standard** | AES-256 | Encryption at rest and TLS 1.3 encryption in transit for all backup artifacts. |

---

## 2. BACKUP PROCEDURES

### 2.1 Continuous WAL Archiving (PITR)
PostgreSQL Write-Ahead Logs are archived to redundant encrypted S3/GCS object storage buckets upon closure:
```bash
# In postgresql.conf
archive_mode = on
archive_command = 'pgbackrest --stanza=glamoure_prod archive-push %p'
archive_timeout = 300 # Forces log switch every 5 minutes
```

### 2.2 Automated Daily Full Backups
A compressed, consistent full snapshot is generated daily at 02:00 UTC during off-peak salon hours:
```bash
# Automated Snapshot Execution
pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="glamoure_production" \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-privileges \
  --file="/backups/glamoure_prod_$(date +%Y%m%d_%H%M%S).dump"
```

### 2.3 Per-Tenant Isolated Data Export
For compliance, auditing, or salon offboarding requests:
```bash
# Export single salon's complete dataset (appointments, clients, services, revenue)
psql -U "$DB_USER" -d glamoure_production -c "
  COPY (
    SELECT a.*, s.name as service_name, st.display_name as staff_name
    FROM appointments a
    JOIN services s ON a.service_id = s.id
    JOIN staff_profiles st ON a.staff_id = st.id
    WHERE a.salon_id = 'salon-glamoure-jubilee'
  ) TO STDOUT WITH CSV HEADER;
" | gzip > salon_glamoure_jubilee_export.csv.gz
```

---

## 3. DISASTER RECOVERY & RESTORATION RUNBOOK

### 3.1 Point-in-Time Recovery (PITR) Execution
To recover to a specific timestamp (e.g., prior to a catastrophic incident at `2026-11-17 14:32:00 UTC`):

1. **Stop active backend traffic**:
   ```bash
   kubectl scale deployment glamoure-backend --replicas=0
   ```
2. **Deploy clean standby instance** and restore the latest baseline backup:
   ```bash
   pg_restore \
     --clean \
     --if-exists \
     --exit-on-error \
     --dbname="glamoure_production" \
     /backups/glamoure_prod_latest.dump
   ```
3. **Configure recovery target timestamp** in `recovery.signal`:
   ```bash
   touch /var/lib/postgresql/data/recovery.signal
   echo "recovery_target_time = '2026-11-17 14:32:00 UTC'" >> /var/lib/postgresql/data/postgresql.conf
   echo "recovery_target_action = 'promote'" >> /var/lib/postgresql/data/postgresql.conf
   ```
4. **Start PostgreSQL service**:
   ```bash
   systemctl start postgresql
   ```
5. **Verify data integrity and hard constraints**:
   Execute the health diagnostic suite:
   ```bash
   npm test -- src/tests/health.test.ts
   ```
6. **Restore application traffic**:
   ```bash
   kubectl scale deployment glamoure-backend --replicas=3
   ```

---

## 4. INTEGRITY VERIFICATION & AUDITING

After any restore or weekly automated verification drill:
1. **Foreign Key Integrity Check**:
   ```sql
   -- Verify zero orphaned appointments
   SELECT COUNT(*) FROM appointments a 
   LEFT JOIN salons s ON a.salon_id = s.id 
   WHERE s.id IS NULL; -- Must return 0
   ```
2. **Double-Booking Hard Constraint Verification**:
   ```sql
   -- Verify zero double-booking overlap for active appointments
   SELECT staff_id, appointment_date, start_time, COUNT(*)
   FROM appointments
   WHERE status IN ('confirmed', 'checked_in', 'in_progress')
   GROUP BY staff_id, appointment_date, start_time
   HAVING COUNT(*) > 1; -- Must return 0 rows
   ```
3. **Audit Log Continuity**:
   Verify the sequence of `audit_logs` has no chronological gaps and matches user transaction volume.
