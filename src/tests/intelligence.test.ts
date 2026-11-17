import { describe, it, expect, beforeEach } from 'vitest';
import { DataCleaner } from '../intelligence/preprocessing/dataCleaner';
import { FeatureExtractor } from '../intelligence/features/featureExtractor';
import { SmartScheduler } from '../intelligence/scheduling/smartScheduler';
import { RecommendationEngine } from '../intelligence/recommendations/recommendationEngine';
import { DemandForecaster } from '../intelligence/forecasting/demandForecaster';
import { RevenueForecaster } from '../intelligence/forecasting/revenueForecaster';
import { EmployeeAllocator } from '../intelligence/allocation/employeeAllocator';
import { ChurnPredictor } from '../intelligence/retention/churnPredictor';
import { ReviewIntelligence } from '../intelligence/nlp/reviewIntelligence';
import { OwnerAiAssistant } from '../intelligence/assistants/ownerAiAssistant';
import { CustomerAiAssistant } from '../intelligence/assistants/customerAiAssistant';
import { MemberIntelligence } from '../intelligence/member/memberIntelligence';
import { ModelRegistry } from '../intelligence/models/modelRegistry';
import { IntelligenceMonitor } from '../intelligence/monitoring/intelligenceMonitor';
import { IntelligenceApi } from '../intelligence/api/intelligenceApi';
import { db } from '../database/db';
import type { Appointment } from '../types/appointment';

describe('GLAMOURÉ PHASE 4: AI & ML INTELLIGENCE ENGINE SUITE', () => {
  const salonId = 'salon-glamoure-jubilee';

  // ───────────────────────────────────────────────────────────────────────────
  // 1. DATA PREPROCESSING & DATA LEAKAGE PREVENTION
  // ───────────────────────────────────────────────────────────────────────────
  describe('Data Preprocessing & Hygiene (DataCleaner)', () => {
    it('should deduplicate records and cleanse invalid outlier values', () => {
      const rawAppointments: any[] = [
        { id: 'apt-1', salonId, appointmentDate: '2026-11-17', startTime: '10:00', durationMinutes: 60, price: 3500 },
        { id: 'apt-1', salonId, appointmentDate: '2026-11-17', startTime: '10:00', durationMinutes: 60, price: 3500 }, // duplicate
        { id: 'apt-2', salonId, appointmentDate: '2026-11-17', startTime: '11:00', durationMinutes: 5, price: 100 }, // invalid duration < 15
        { id: 'apt-3', salonId, appointmentDate: '2026-11-17', startTime: '12:00', durationMinutes: 400, price: 100 }, // invalid duration > 360
        { id: 'apt-4', salonId, appointmentDate: '2026-11-17', startTime: '14:00', durationMinutes: 90, price: 5500 },
      ];

      const cleaned = DataCleaner.cleanAppointments(rawAppointments);
      expect(cleaned.length).toBe(2);
      expect(cleaned.map(c => c.id)).toEqual(['apt-1', 'apt-4']);
    });

    it('should perform strictly chronological train/test split preventing temporal leakage', () => {
      const series = [
        { id: 'a', appointmentDate: '2026-11-10' },
        { id: 'b', appointmentDate: '2026-11-12' },
        { id: 'c', appointmentDate: '2026-11-15' },
        { id: 'd', appointmentDate: '2026-11-18' },
        { id: 'e', appointmentDate: '2026-11-20' },
      ];

      const { train, test } = DataCleaner.chronologicalSplit(series, 0.6);
      expect(train.length).toBe(3);
      expect(test.length).toBe(2);
      // Ensure all train dates are strictly <= test dates
      const maxTrainDate = train[train.length - 1].appointmentDate;
      const minTestDate = test[0].appointmentDate;
      expect(maxTrainDate <= minTestDate).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. FEATURE EXTRACTION
  // ───────────────────────────────────────────────────────────────────────────
  describe('Feature Extraction Layer (FeatureExtractor)', () => {
    it('should extract customer behavioral vectors (RFM & cancellation metrics)', () => {
      const appointments: Appointment[] = [
        {
          id: 'apt-c1',
          salonId,
          branchId: 'b-1',
          customerId: 'cust-test-1',
          customerName: 'Aanya',
          customerEmail: 'aanya@example.com',
          staffId: 'staff-aria',
          staffName: 'Aria Chen',
          serviceId: 'srv-balayage',
          serviceName: 'Balayage',
          appointmentDate: '2026-11-01',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          status: 'completed',
          price: 7500,
          depositAmount: 1500,
          paymentStatus: 'paid',
          createdAt: '2026-11-01',
          updatedAt: '2026-11-01',
        },
      ];

      const features = FeatureExtractor.extractCustomerFeatures('cust-test-1', appointments, undefined, '2026-11-17');
      expect(features.customerId).toBe('cust-test-1');
      expect(features.recencyDays).toBe(16);
      expect(features.monetaryTotal).toBe(7500);
      expect(features.cancellationRate).toBe(0);
      expect(features.preferredStaffId).toBe('staff-aria');
    });

    it('should extract staff workload & schedule compactness vectors', () => {
      const staff = db.getStaffBySalon(salonId)[0];
      const appointments = db.getAppointmentsBySalon(salonId);

      const staffFeatures = FeatureExtractor.extractStaffFeatures(staff, appointments);
      expect(staffFeatures.staffId).toBe(staff.id);
      expect(staffFeatures.utilizationPercentage).toBeGreaterThanOrEqual(0);
      expect(staffFeatures.scheduleCompactnessScore).toBeGreaterThanOrEqual(0);
      expect(staffFeatures.scheduleCompactnessScore).toBeLessThanOrEqual(1.0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. AI SMART SCHEDULING (3-TIER ENGINE)
  // ───────────────────────────────────────────────────────────────────────────
  describe('AI Smart Scheduling Engine (SmartScheduler)', () => {
    it('should evaluate 3 tiers: enforce hard constraints, balance workload and score candidate slots', () => {
      const services = db.getServicesBySalon(salonId);
      const testService = services[0];

      // Schedule for a weekday (e.g. Wednesday 2026-11-18)
      const result = SmartScheduler.findSmartSlots({
        salonId,
        serviceId: testService.id,
        date: '2026-11-18',
        preferredTime: 'morning',
      });

      expect(result).toBeDefined();
      expect(result.recommendedSlots.length).toBeGreaterThan(0);
      expect(result.primaryRecommendation).not.toBeNull();
      
      const topSlot = result.primaryRecommendation!;
      expect(topSlot.overallScore).toBeGreaterThan(0);
      expect(topSlot.overallScore).toBeLessThanOrEqual(100);
      expect(topSlot.factors.stylistQualification).toBeGreaterThan(0);
      expect(topSlot.factors.workloadBalanceScore).toBeGreaterThan(0);
      expect(topSlot.explanation).toContain(topSlot.staffName);
    });

    it('should respect hard constraints: avoid collisions with existing appointments and buffers', () => {
      const services = db.getServicesBySalon(salonId);
      const testService = services[0];
      const appointments = db.getAppointmentsBySalon(salonId);

      const result = SmartScheduler.findSmartSlots({
        salonId,
        serviceId: testService.id,
        date: '2026-11-17',
      });

      // For every recommended slot, verify NO collision with existing appointments of that staff member
      for (const slot of result.recommendedSlots) {
        const staffExisting = appointments.filter(a => 
          a.staffId === slot.staffId && 
          a.appointmentDate === slot.date &&
          a.status !== 'cancelled'
        );

        for (const existing of staffExisting) {
          const slotStart = slot.startTime;
          const slotEnd = slot.endTime;
          // Slots must never overlap existing intervals
          const isOverlap = (slotStart < existing.endTime && slotEnd > existing.startTime);
          expect(isOverlap).toBe(false);
        }
      }
    });

    it('should report constraint violations avoided', () => {
      const services = db.getServicesBySalon(salonId);
      const result = SmartScheduler.findSmartSlots({
        salonId,
        serviceId: services[0].id,
        date: '2026-11-17',
      });

      expect(typeof result.constraintViolationsAvoided).toBe('number');
      expect(result.constraintViolationsAvoided).toBeGreaterThanOrEqual(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. CUSTOMER PERSONALIZATION & RECOMMENDATIONS
  // ───────────────────────────────────────────────────────────────────────────
  describe('Customer Personalization Engine (RecommendationEngine)', () => {
    it('should return personalized rituals and preferred stylists for existing customer', () => {
      const result = RecommendationEngine.personalizeForCustomer(salonId, 'user-customer-sophia');
      expect(result.customerId).toBe('user-customer-sophia');
      expect(result.recommendedServices.length).toBeGreaterThan(0);
      expect(result.suggestedStylists.length).toBeGreaterThan(0);
      expect(result.recommendedOffers.length).toBeGreaterThan(0);
      expect(result.fallbackStrategy).toBe('content_based');
    });

    it('should activate popularity cold-start fallback gracefully for guest without crashing', () => {
      const result = RecommendationEngine.personalizeForCustomer(salonId, undefined);
      expect(result.fallbackStrategy).toBe('popularity_cold_start');
      expect(result.recommendedServices.length).toBeGreaterThan(0);
      expect(result.recommendedServices[0].matchScore).toBeGreaterThanOrEqual(70);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. DEMAND FORECASTING
  // ───────────────────────────────────────────────────────────────────────────
  describe('Demand Forecasting Engine (DemandForecaster)', () => {
    it('should generate multi-horizon daily projections with seasonality and confidence intervals', () => {
      const forecast7d = DemandForecaster.forecastDemand(salonId, '7d');
      expect(forecast7d.dailyForecast.length).toBe(7);
      expect(forecast7d.peakHours.length).toBeGreaterThan(0);
      expect(forecast7d.categoryDemand.length).toBeGreaterThan(0);
      expect(forecast7d.confidence).toBeGreaterThan(0.9);

      for (const day of forecast7d.dailyForecast) {
        expect(day.confidenceLower).toBeLessThanOrEqual(day.predictedAppointments);
        expect(day.confidenceUpper).toBeGreaterThanOrEqual(day.predictedAppointments);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. REVENUE FORECASTING & MARGINS
  // ───────────────────────────────────────────────────────────────────────────
  describe('Revenue Projections & Service Margins (RevenueForecaster)', () => {
    it('should project daily revenue with 95% confidence intervals and margin rankings', () => {
      const revForecast = RevenueForecaster.forecastRevenue(salonId, 'daily');
      expect(revForecast.forecastSeries.length).toBe(14);
      expect(revForecast.expectedTotalRevenue).toBeGreaterThan(0);
      expect(revForecast.confidenceIntervalPercentage).toBe(95);
      expect(revForecast.serviceProfitability.length).toBeGreaterThan(0);

      // Verify margin values are realistic luxury benchmarks (50% to 85%)
      for (const srv of revForecast.serviceProfitability) {
        expect(srv.estimatedMarginPercentage).toBeGreaterThanOrEqual(50);
        expect(srv.estimatedMarginPercentage).toBeLessThanOrEqual(85);
      }

      for (const day of revForecast.forecastSeries) {
        expect(day.lowerBound).toBeLessThanOrEqual(day.predictedRevenue);
        expect(day.upperBound).toBeGreaterThanOrEqual(day.predictedRevenue);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 7. EMPLOYEE ALLOCATION & WORKLOAD BALANCING
  // ───────────────────────────────────────────────────────────────────────────
  describe('Employee Allocation Engine (EmployeeAllocator)', () => {
    it('should analyze bay utilization rates and identify workload imbalances', () => {
      const allocation = EmployeeAllocator.analyzeAllocation(salonId, '2026-11-17');
      expect(allocation.allocations.length).toBeGreaterThan(0);
      expect(allocation.averageBayUtilization).toBeGreaterThanOrEqual(0);
      expect(allocation.averageBayUtilization).toBeLessThanOrEqual(100);

      for (const alloc of allocation.allocations) {
        expect(['optimal', 'underutilized', 'overloaded']).toContain(alloc.status);
        expect(alloc.utilizationRate).toBeGreaterThanOrEqual(0);
        expect(alloc.utilizationRate).toBeLessThanOrEqual(100);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 8. CHURN & RETENTION PREDICTOR
  // ───────────────────────────────────────────────────────────────────────────
  describe('Customer Churn & Retention Predictor (ChurnPredictor)', () => {
    it('should assign calibrated churn risk scores and formulate actionable retention triggers', () => {
      const assessments = ChurnPredictor.assessSalonCustomers(salonId);
      expect(assessments.length).toBeGreaterThan(0);

      for (const assessment of assessments) {
        expect(assessment.churnRiskScore).toBeGreaterThanOrEqual(0.05);
        expect(assessment.churnRiskScore).toBeLessThanOrEqual(0.98);
        expect(['Low', 'Moderate', 'High', 'Critical']).toContain(assessment.riskLevel);
        expect(assessment.contributingFactors.length).toBeGreaterThan(0);
        expect(assessment.suggestedAction).toBeDefined();
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 9. NLP REVIEW INTELLIGENCE
  // ───────────────────────────────────────────────────────────────────────────
  describe('Customer Review Intelligence (ReviewIntelligence)', () => {
    it('should extract aspect scores and sentiment metrics across customer feedback', () => {
      const result = ReviewIntelligence.analyzeReviews(salonId);
      expect(result.averageSentimentScore).toBeGreaterThanOrEqual(-1.0);
      expect(result.averageSentimentScore).toBeLessThanOrEqual(1.0);
      expect(result.aspectScores.hairArtistry).toBeGreaterThan(70);
      expect(result.aspectScores.hospitality).toBeGreaterThan(70);
      expect(result.aspectScores.cleanliness).toBeGreaterThan(70);
      expect(result.aspectScores.punctuality).toBeGreaterThan(70);
      expect(result.aspectScores.valueForPrice).toBeGreaterThan(70);
      expect(result.keyPositiveThemes.length).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 10. AI ASSISTANTS (ZERO HALLUCINATION TESTS)
  // ───────────────────────────────────────────────────────────────────────────
  describe('Grounded AI Assistants (OwnerAiAssistant & CustomerAiAssistant)', () => {
    it('should answer owner revenue query strictly grounded in live records', () => {
      const response = OwnerAiAssistant.ask(salonId, "What is today's revenue?");
      expect(response.answer).toContain('revenue');
      expect(response.structuredMetrics?.todayRevenue).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0.9);
      expect(response.dataSources).toContain('appointments');
    });

    it('should answer owner staff workload query with live allocation data', () => {
      const response = OwnerAiAssistant.ask(salonId, "Who is working and what is staff utilization?");
      expect(response.structuredMetrics?.averageBayUtilization).toBeDefined();
      expect(response.dataSources).toContain('workforce_allocator');
    });

    it('should answer customer concierge queries with relevant service recommendations', () => {
      const colorResponse = CustomerAiAssistant.ask(salonId, 'I want to get balayage and blonde highlights');
      expect(colorResponse.answer.toLowerCase()).toContain('balayage');
      expect(colorResponse.recommendedServiceIds.length).toBeGreaterThan(0);
      expect(colorResponse.suggestedSlots?.length).toBeGreaterThan(0);
      expect(colorResponse.actionCta).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 11. MEMBER WORKSTATION INTELLIGENCE
  // ───────────────────────────────────────────────────────────────────────────
  describe('Member Workstation Intelligence (MemberIntelligence)', () => {
    it('should generate personalized daily itinerary, efficiency score, and preparation checklist', () => {
      const staff = db.getStaffBySalon(salonId)[0];
      const result = MemberIntelligence.getWorkstationIntelligence(staff.id, '2026-11-17');
      expect(result.staffId).toBe(staff.id);
      expect(result.efficiencyScore).toBeGreaterThanOrEqual(60);
      expect(result.efficiencyScore).toBeLessThanOrEqual(100);
      expect(result.suggestedPrep.length).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 12. MODEL REGISTRY & TELEMETRY
  // ───────────────────────────────────────────────────────────────────────────
  describe('Model Registry & System Monitoring', () => {
    it('should maintain all 7 active models with versions, metrics, and confidence', () => {
      const allModels = ModelRegistry.getAllModels();
      expect(allModels.length).toBe(7);

      const requiredDomains = [
        'scheduling',
        'recommendations',
        'demand_forecast',
        'revenue_forecast',
        'churn_prediction',
        'nlp_sentiment',
        'employee_allocation',
      ];

      for (const domain of requiredDomains) {
        const found = allModels.find(m => m.domain === domain);
        expect(found).toBeDefined();
        expect(found?.status).toBe('active');
        expect(found?.version).toBeDefined();
        expect(found?.evaluationMetrics.primaryValue).toBeGreaterThan(0);
      }
    });

    it('should report system health with zero hard constraint violations', () => {
      const health = IntelligenceMonitor.getHealthReport();
      expect(health.overallStatus).toBe('healthy');
      expect(health.hardConstraintViolationRate).toBe(0.0);
      expect(health.activeModelsCount).toBe(7);
      expect(health.dataHygieneScore).toBeGreaterThan(95);
    });

    it('should expose unified access through IntelligenceApi', () => {
      const health = IntelligenceApi.getSystemHealth();
      const models = IntelligenceApi.getModelRegistry();
      expect(health).toBeDefined();
      expect(models.length).toBe(7);
    });
  });
});
