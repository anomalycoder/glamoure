---
name: security-and-owasp-hardening
description: >-
  Enterprise security engineering guidelines, OWASP Top 10 mitigation, multi-tenant data isolation,
  role-based access control (RBAC), secure file validation, rate limiting, and secret sanitization.
---

# Security & OWASP Hardening Skill

## 1. OWASP Top 10 Mitigation Matrix

### A. Broken Access Control & IDOR
- Enforce backend verification on every mutation. Never trust frontend claims of role or salon ID.
- In multi-tenant environments, every lookup must constrain by `salonId = currentUser.activeSalonId`.
- Implement Row Level Security (RLS) in PostgreSQL/Supabase:
  ```sql
  CREATE POLICY tenant_isolation ON appointments
  FOR ALL USING (salon_id = (SELECT salon_id FROM salon_memberships WHERE user_id = auth.uid()));
  ```

### B. Injection Prevention (SQLi & NoSQLi)
- Use parameterized queries, ORMs, or strongly-typed database abstraction layers.
- Sanitize and trim all text inputs before persistence.

### C. Cross-Site Scripting (XSS)
- React escapes JSX expressions by default; never use `dangerouslySetInnerHTML` with unsanitized user content.
- Clean review comments, customer notes, and salon descriptions against HTML injection.

### D. Insecure File Uploads
- Strictly enforce whitelist validation for allowed MIME types: `['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']`.
- Reject file payloads exceeding the maximum limit (5.0 MB).
- Sanitize filenames to remove path traversal sequences (`..`, `/`, `\`).

### E. Security Misconfiguration & Secret Leaks
- Never commit API keys, database credentials, JWT secrets, or webhook signing keys to source control.
- Expose public configuration only via `VITE_` prefixed variables; keep service role keys on the server.
- Provide a documented `.env.example` with clear secret placeholders.

### F. Cryptographic Failures & Session Security
- Use modern cryptographic hashing for passwords (e.g. bcrypt / argon2).
- Session expiration: enforce sliding session expiry with immediate revocation on logout.
- Sign payment tokens and verify webhook signatures.
