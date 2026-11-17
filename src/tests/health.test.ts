import { describe, it, expect } from 'vitest';
import { HealthService } from '../services/healthService';

describe('Glamouré Production Health Diagnostics', () => {
  it('should return system status healthy with zero hard constraint violations', () => {
    const health = HealthService.checkHealth();

    expect(health).toBeDefined();
    expect(health.status).toBe('healthy');
    expect(health.environment).toBeDefined();
    expect(health.version).toBe('2.5.0-luxury');
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);

    // Database diagnostics
    expect(health.services.database.status).toBe('up');
    expect(health.services.database.salonsCount).toBeGreaterThan(0);
    expect(health.services.database.usersCount).toBeGreaterThan(0);
    expect(health.services.database.appointmentsCount).toBeGreaterThan(0);
    expect(health.services.database.servicesCount).toBeGreaterThan(0);
    expect(health.services.database.tenancyIsolated).toBe(true);

    // Intelligence engine diagnostics
    expect(health.services.intelligenceEngine.status).toBe('ready');
    expect(health.services.intelligenceEngine.models.recommendations).toBe(true);
    expect(health.services.intelligenceEngine.models.churnPrediction).toBe(true);
    expect(health.services.intelligenceEngine.models.demandForecasting).toBe(true);
    expect(health.services.intelligenceEngine.models.smartScheduler).toBe(true);
    expect(health.services.intelligenceEngine.registeredModelsCount).toBeGreaterThan(0);
    expect(health.services.intelligenceEngine.hardConstraintViolations).toBe(0);

    // Security diagnostics
    expect(health.services.security.auditLoggingActive).toBe(true);
    expect(health.services.security.rbacEnforced).toBe(true);
  });
});
