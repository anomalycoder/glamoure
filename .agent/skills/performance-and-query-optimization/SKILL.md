---
name: performance-and-query-optimization
description: >-
  Performance engineering guidelines, database query optimization, composite indexing,
  frontend code-splitting, bundle size reduction, memory leak prevention, and latency minimization.
---

# Performance & Query Optimization Skill

## 1. Database Query & Index Optimization
- Avoid N+1 database queries when rendering lists:
  - Join or batch lookups for related entities (e.g., appointments + services + staff).
  - Use composite indices for high-frequency filters:
    ```sql
    CREATE INDEX idx_appointments_lookup ON appointments(salon_id, appointment_date, staff_id);
    CREATE INDEX idx_staff_salon_active ON staff_profiles(salon_id, is_active);
    CREATE INDEX idx_payments_salon_date ON payments(salon_id, created_at);
    ```
- Paginate large datasets (appointments, customer CRM dossiers, inventory transactions) with `limit` and `offset` or keyset pagination.

## 2. Frontend Bundle & Asset Optimization
- Dynamic code-splitting with `React.lazy()` for secondary portal routes (e.g. Owner Intelligence, Member Performance, Customer Settings).
- Image optimization:
  - Compress luxury photography with modern formats (WEBP/AVIF).
  - Use responsive `srcset` and explicit `width`/`height` attributes to prevent Cumulative Layout Shift (CLS).
- Keep production bundle minified with gzip target under 300 KB for core initial chunks.

## 3. Caching & Memory Hygiene
- Cache static or rarely changing lookup tables (service catalogues, branch lists, categories) in memory.
- Invalidate cache immediately on update mutations (`createService`, `updateService`, `deleteService`).
- Never cache private, tenant-specific customer dossiers or payment records globally across different tenants.
