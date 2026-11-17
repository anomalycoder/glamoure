/**
 * Security & Hardening Utilities for Glamouré Luxury Platform
 * OWASP Top 10 Protections: XSS Sanitization, Input Validation, and Rate Limiting
 */

export class SecurityUtils {
  /**
   * Sanitize text against Cross-Site Scripting (XSS)
   */
  public static sanitizeInput(input: string | undefined | null): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> blocks
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe>
      .replace(/javascript:/gi, '') // Strip javascript: pseudo-protocol
      .replace(/on\w+\s*=/gi, '') // Remove inline event handlers (onerror=, onload=, onclick=)
      .replace(/<[^>]+>/g, '') // Strip remaining HTML markup tags
      .replace(/[<>'"]/g, char => {
        // HTML entity encoding for persistent storage
        switch (char) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case "'": return '&#39;';
          case '"': return '&quot;';
          default: return char;
        }
      });
  }

  /**
   * Validate RFC 5322 compliant email format
   */
  public static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email.trim()) && email.length <= 254;
  }

  /**
   * Validate international or local phone numbers
   */
  public static validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    return phoneRegex.test(phone.trim());
  }

  /**
   * In-Memory Sliding Window Rate Limiter
   */
  private static rateLimitStore: Map<string, number[]> = new Map();

  public static checkRateLimit(
    key: string,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): { allowed: boolean; remainingRequests: number; retryAfterMs: number } {
    const now = Date.now();
    const timestamps = this.rateLimitStore.get(key) || [];

    // Filter out timestamps outside sliding window
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      const oldest = validTimestamps[0];
      const retryAfterMs = Math.max(0, windowMs - (now - oldest));
      this.rateLimitStore.set(key, validTimestamps);
      return {
        allowed: false,
        remainingRequests: 0,
        retryAfterMs,
      };
    }

    validTimestamps.push(now);
    this.rateLimitStore.set(key, validTimestamps);

    return {
      allowed: true,
      remainingRequests: maxRequests - validTimestamps.length,
      retryAfterMs: 0,
    };
  }

  public static resetRateLimits(): void {
    this.rateLimitStore.clear();
  }
}
