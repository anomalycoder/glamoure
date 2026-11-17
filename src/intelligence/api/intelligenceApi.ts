/**
 * Unified Intelligence API
 * Central orchestration layer with multi-tenant salon boundary enforcement.
 */

import { SmartScheduler, type SmartScheduleRequest } from '../scheduling/smartScheduler';
import { RecommendationEngine } from '../recommendations/recommendationEngine';
import { DemandForecaster } from '../forecasting/demandForecaster';
import { RevenueForecaster } from '../forecasting/revenueForecaster';
import { EmployeeAllocator } from '../allocation/employeeAllocator';
import { ChurnPredictor } from '../retention/churnPredictor';
import { ReviewIntelligence } from '../nlp/reviewIntelligence';
import { OwnerAiAssistant } from '../assistants/ownerAiAssistant';
import { CustomerAiAssistant, type CustomerAiResponse } from '../assistants/customerAiAssistant';
import { MemberIntelligence } from '../member/memberIntelligence';
import { ModelRegistry } from '../models/modelRegistry';
import { IntelligenceMonitor } from '../monitoring/intelligenceMonitor';
import type { 
  SmartScheduleResult, 
  CustomerPersonalizationResult, 
  DemandForecastResult, 
  RevenueForecastResult, 
  StaffAllocationResult, 
  CustomerChurnAssessment, 
  ReviewSentimentResult, 
  OwnerAiQueryResponse,
  ModelMetadata 
} from '../types';

export class IntelligenceApi {
  /**
   * Smart Scheduling
   */
  public static getSmartSlots(request: SmartScheduleRequest): SmartScheduleResult {
    return SmartScheduler.findSmartSlots(request);
  }

  /**
   * Customer Personalization
   */
  public static getPersonalizedRecommendations(
    salonId: string, 
    customerId?: string
  ): CustomerPersonalizationResult {
    return RecommendationEngine.personalizeForCustomer(salonId, customerId);
  }

  /**
   * Demand Forecasting
   */
  public static getDemandForecast(
    salonId: string, 
    timeframe: '7d' | '30d' | '90d' = '7d'
  ): DemandForecastResult {
    return DemandForecaster.forecastDemand(salonId, timeframe);
  }

  /**
   * Revenue Forecasting
   */
  public static getRevenueForecast(
    salonId: string, 
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): RevenueForecastResult {
    return RevenueForecaster.forecastRevenue(salonId, period);
  }

  /**
   * Employee Workload Allocation
   */
  public static getStaffAllocation(
    salonId: string, 
    date?: string
  ): StaffAllocationResult {
    return EmployeeAllocator.analyzeAllocation(salonId, date);
  }

  /**
   * Customer Churn Risk
   */
  public static getChurnAssessments(salonId: string): CustomerChurnAssessment[] {
    return ChurnPredictor.assessSalonCustomers(salonId);
  }

  /**
   * Review Sentiment Mining
   */
  public static getReviewIntelligence(salonId: string): ReviewSentimentResult {
    return ReviewIntelligence.analyzeReviews(salonId);
  }

  /**
   * Owner Business Assistant Q&A
   */
  public static askOwnerAssistant(salonId: string, query: string): OwnerAiQueryResponse {
    return OwnerAiAssistant.ask(salonId, query);
  }

  /**
   * Customer Booking Assistant
   */
  public static askCustomerAssistant(
    salonId: string, 
    query: string, 
    customerId?: string
  ): CustomerAiResponse {
    return CustomerAiAssistant.ask(salonId, query, customerId);
  }

  /**
   * Member Workstation Intelligence
   */
  public static getMemberWorkstation(staffId: string, date?: string) {
    return MemberIntelligence.getWorkstationIntelligence(staffId, date);
  }

  /**
   * Model Registry & Telemetry
   */
  public static getModelRegistry(): ModelMetadata[] {
    return ModelRegistry.getAllModels();
  }

  /**
   * System Health Report
   */
  public static getSystemHealth() {
    return IntelligenceMonitor.getHealthReport();
  }
}
