---
name: backend-architecture-engineering
description: >-
  Comprehensive guide for backend architecture, REST API design, Node.js/TypeScript services,
  multi-tenant SaaS domain boundaries, transaction handling, payment webhooks, and idempotent background operations.
---

# Backend Architecture & Engineering Skill

## 1. Domain-Driven Service Architecture
- Separate concerns into clean architectural boundaries:
  - `database/`: Schema definition, migration scripts, persistence, and low-level data access.
  - `services/`: Reusable, transactional business logic (e.g., `appointmentService`, `paymentService`, `authService`, `rbacService`, `availabilityService`, `storageService`).
  - `intelligence/`: Mathematical, ML, and predictive analytics modules.
  - `api/` or `controllers/`: HTTP request validation, status code dispatch, authentication extraction, and error translation.
- Never write direct database mutation logic inside UI components; encapsulate operations inside domain services.

## 2. Multi-Tenant SaaS Isolation
- All data operations must enforce tenant partitioning (`salonId`).
- A client, owner, or staff member must never query or mutate another salon's records without explicit permission.
- Always validate that foreign key references (`branchId`, `serviceId`, `staffId`, `customerId`) belong to the active `salonId`.

## 3. Concurrency & Transactional Conflict Prevention
- Slot reservation and appointment booking must be transactional:
  - Pre-validate availability and lock overlapping intervals: `(newStart < existingEnd && newEnd > existingStart)`.
  - For concurrent incoming requests for the exact same staff and time window, ensure atomic conflict detection throws an error immediately rather than creating a double booking.
- State machines must strictly enforce allowed lifecycle transitions:
  - `pending` -> `['confirmed', 'cancelled']`
  - `confirmed` -> `['checked_in', 'cancelled', 'no_show']`
  - `checked_in` -> `['in_progress', 'cancelled']`
  - `in_progress` -> `['completed', 'cancelled']`
  - Terminal states (`completed`, `cancelled`, `no_show`) cannot transition further.

## 4. Payment Lifecycle & Webhook Idempotency
- Payment sessions must generate cryptographic verification tokens (`vtok_...`).
- Webhook endpoints must:
  - Verify gateway signature against `WEBHOOK_SECRET`.
  - Maintain an idempotency key cache: if `event.id` was already processed, respond with success (`duplicate: true`) without double-crediting or re-triggering status changes.
  - Support full lifecycle: initiation, capture, failure logging, and refunds.

## 5. Error Handling & Consistent Status Codes
- `200 OK`: Successful retrieval or update.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or illegal state transition.
- `401 Unauthorized`: Missing or invalid session authentication token.
- `403 Forbidden`: Authenticated user lacks required RBAC permission or cross-tenant access.
- `404 Not Found`: Entity not found in target tenant.
- `409 Conflict`: Scheduling collision or concurrent duplicate request.
- `500 Internal Server Error`: Unhandled server exception with sanitized error message (no leaked stack traces or credentials).
