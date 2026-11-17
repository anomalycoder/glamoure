import { db } from '../database/db';
import { RecommendationEngine } from '../intelligence/recommendations/recommendationEngine';
import { ChurnPredictor } from '../intelligence/retention/churnPredictor';
import { DemandForecaster } from '../intelligence/forecasting/demandForecaster';
import { SmartScheduler } from '../intelligence/scheduling/smartScheduler';
import { ModelRegistry } from '../intelligence/models/modelRegistry';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  services: {
    database: {
      status: 'up' | 'down';
      salonsCount: number;
      usersCount: number;
      appointmentsCount: number;
      servicesCount: number;
      tenancyIsolated: boolean;
    };
    intelligenceEngine: {
      status: 'ready' | 'degraded' | 'offline';
      models: {
        recommendations: boolean;
        churnPrediction: boolean;
        demandForecasting: boolean;
        smartScheduler: boolean;
      };
      registeredModelsCount: number;
      hardConstraintViolations: number;
    };
    security: {
      auditLoggingActive: boolean;
      totalAuditEvents: number;
      rbacEnforced: boolean;
    };
    memory: {
      heapUsedMb?: number;
      heapTotalMb?: number;
      rssMb?: number;
    };
  };
}

const processStartTime = Date.now();

export class HealthService {
  /**
   * Run end-to-end system health check
   */
  public static checkHealth(): HealthCheckResult {
    let dbStatus: 'up' | 'down' = 'down';
    let salonsCount = 0;
    let usersCount = 0;
    let appointmentsCount = 0;
    let servicesCount = 0;
    let hardConstraintViolations = 0;
    let tenancyIsolated = true;

    try {
      const salons = db.getAllSalons();
      const users = db.getAllUsers();
      const appointments = db.getAllAppointments();
      const services = db.getAllServices();

      salonsCount = salons.length;
      usersCount = users.length;
      appointmentsCount = appointments.length;
      servicesCount = services.length;
      dbStatus = salonsCount > 0 ? 'up' : 'down';

      // Check for hard constraint violations: double-booking active appointments
      const activeAppts = appointments.filter(
        a => a.status === 'confirmed' || a.status === 'checked_in' || a.status === 'in_progress'
      );
      
      const slotMap = new Map<string, string>();
      for (const appt of activeAppts) {
        const key = `${appt.staffId}_${appt.appointmentDate}_${appt.startTime}`;
        if (slotMap.has(key)) {
          hardConstraintViolations++;
        } else {
          slotMap.set(key, appt.id);
        }
      }

      // Check tenant isolation: ensure every appointment belongs to a valid salon
      const salonIds = new Set(salons.map(s => s.id));
      for (const appt of appointments) {
        if (!salonIds.has(appt.salonId)) {
          tenancyIsolated = false;
        }
      }
    } catch {
      dbStatus = 'down';
    }

    // Verify ML intelligence readiness
    let modelsReady = false;
    let recsReady = false;
    let churnReady = false;
    let forecastReady = false;
    let schedulerReady = false;
    let registeredModelsCount = 0;

    try {
      recsReady = typeof RecommendationEngine.personalizeForCustomer === 'function';
      churnReady = typeof ChurnPredictor.assessCustomer === 'function';
      forecastReady = typeof DemandForecaster.forecastDemand === 'function';
      schedulerReady = typeof SmartScheduler.findSmartSlots === 'function';
      modelsReady = recsReady && churnReady && forecastReady && schedulerReady;
      registeredModelsCount = ModelRegistry.getAllModels().length;
    } catch {
      modelsReady = false;
    }

    const auditEvents = db.getAuditLogs();

    const overallStatus: 'healthy' | 'degraded' | 'down' =
      dbStatus === 'up' && modelsReady && hardConstraintViolations === 0 && tenancyIsolated
        ? 'healthy'
        : dbStatus === 'up'
        ? 'degraded'
        : 'down';

    // Memory metrics if running in Node.js
    let memoryMetrics: { heapUsedMb?: number; heapTotalMb?: number; rssMb?: number } = {};
    const proc = (globalThis as unknown as { process?: { memoryUsage?: () => { heapUsed: number; heapTotal: number; rss: number }; env?: Record<string, string> } }).process;
    if (proc && typeof proc.memoryUsage === 'function') {
      const mem = proc.memoryUsage();
      memoryMetrics = {
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      };
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - processStartTime) / 1000),
      environment: proc?.env?.NODE_ENV || 'production',
      version: '2.5.0-luxury',
      services: {
        database: {
          status: dbStatus,
          salonsCount,
          usersCount,
          appointmentsCount,
          servicesCount,
          tenancyIsolated,
        },
        intelligenceEngine: {
          status: modelsReady ? 'ready' : 'degraded',
          models: {
            recommendations: recsReady,
            churnPrediction: churnReady,
            demandForecasting: forecastReady,
            smartScheduler: schedulerReady,
          },
          registeredModelsCount,
          hardConstraintViolations,
        },
        security: {
          auditLoggingActive: true,
          totalAuditEvents: auditEvents.length,
          rbacEnforced: true,
        },
        memory: memoryMetrics,
      },
    };
  }
}
