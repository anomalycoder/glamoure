import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityUtils } from '../utils/security';
import { db } from '../database/db';

describe('Glamouré Security & Hardening Suite', () => {
  beforeEach(() => {
    SecurityUtils.resetRateLimits();
  });

  describe('OWASP XSS Input Sanitization', () => {
    it('should strip malicious script tags from review comments', () => {
      const maliciousPayload = "Loved the haircut! <script>alert('hacked')</script>";
      const sanitized = SecurityUtils.sanitizeInput(maliciousPayload);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toContain('Loved the haircut!');
    });

    it('should neutralize inline javascript handlers like onerror and onload', () => {
      const maliciousPayload = '<img src="invalid.jpg" onerror="fetch(\'https://attacker.com\')" /> Flawless styling';
      const sanitized = SecurityUtils.sanitizeInput(maliciousPayload);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('<img');
      expect(sanitized).toContain('Flawless styling');
    });

    it('should sanitize review comments stored in the database', () => {
      const review = db.createReview({
        id: `rev-sec-${Date.now()}`,
        salonId: 'salon-1',
        appointmentId: 'apt-sec-1',
        customerId: 'user-cust-1',
        customerName: '<script>window.location="http://evil.com"</script>Sophia',
        staffId: 'staff-1',
        staffName: 'Marcus Reed',
        rating: 5,
        comment: 'Extraordinary ambiance! <iframe src="evil.html"></iframe>',
        createdAt: new Date().toISOString(),
      });

      expect(review.customerName).not.toContain('<script>');
      expect(review.customerName).toContain('Sophia');
      expect(review.comment).not.toContain('<iframe');
      expect(review.comment).toContain('Extraordinary ambiance!');
    });
  });

  describe('RFC 5322 Email & Contact Validation', () => {
    it('should accept valid luxury client email addresses', () => {
      expect(SecurityUtils.validateEmail('concierge@glamoure.luxury')).toBe(true);
      expect(SecurityUtils.validateEmail('client.name+vip@domain.co.uk')).toBe(true);
    });

    it('should reject malformed or dangerous email addresses', () => {
      expect(SecurityUtils.validateEmail('plainaddress')).toBe(false);
      expect(SecurityUtils.validateEmail('@missingusername.com')).toBe(false);
      expect(SecurityUtils.validateEmail('user@.com')).toBe(false);
      expect(SecurityUtils.validateEmail('user@domain..com')).toBe(false);
    });

    it('should validate customer phone numbers', () => {
      expect(SecurityUtils.validatePhone('+91 98765 43210')).toBe(true);
      expect(SecurityUtils.validatePhone('+1 (555) 234-5678')).toBe(true);
      expect(SecurityUtils.validatePhone('invalid-phone-abc')).toBe(false);
    });
  });

  describe('Sliding Window Rate Limiter', () => {
    it('should allow requests within threshold and block requests exceeding rate limit', () => {
      const clientIp = '192.168.1.105';
      const maxRequests = 5;
      const windowMs = 5000;

      // Make 5 permitted requests
      for (let i = 0; i < maxRequests; i++) {
        const result = SecurityUtils.checkRateLimit(clientIp, maxRequests, windowMs);
        expect(result.allowed).toBe(true);
        expect(result.remainingRequests).toBe(maxRequests - i - 1);
      }

      // 6th request must be blocked
      const blockedResult = SecurityUtils.checkRateLimit(clientIp, maxRequests, windowMs);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remainingRequests).toBe(0);
      expect(blockedResult.retryAfterMs).toBeGreaterThan(0);
    });
  });
});
