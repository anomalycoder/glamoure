/**
 * GLAMOURÉ AI & MACHINE LEARNING INTELLIGENCE ENGINE
 * Domain Types, Feature Schemas & Model Interfaces
 */

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  domain: 'scheduling' | 'recommendations' | 'demand_forecast' | 'revenue_forecast' | 'churn_prediction' | 'nlp_sentiment' | 'employee_allocation';
  status: 'active' | 'evaluating' | 'degraded' | 'cold_start';
  lastTrained: string;
  trainingSamplesCount: number;
  evaluationMetrics: {
    primaryMetric: string;
    primaryValue: number;
    baselineValue: number;
    secondaryMetrics?: Record<string, number>;
  };
  fallbackActive: boolean;
  confidenceScore: number; // 0.0 to 1.0
  description: string;
}

export interface SmartSlotRecommendation {
  startTime: string;
  endTime: string;
  date: string;
  staffId: string;
  staffName: string;
  branchId: string;
  serviceId: string;
  serviceName: string;
  overallScore: number; // 0 to 100 ranking score
  factors: {
    stylistQualification: number; // 0 to 1
    workloadBalanceScore: number;  // 0 to 1
    customerPreferenceMatch: number; // 0 to 1
    scheduleEfficiencyScore: number; // 0 to 1
  };
  explanation: string;
  estimatedWaitMinutes: number;
}

export interface SmartScheduleResult {
  recommendedSlots: SmartSlotRecommendation[];
  primaryRecommendation: SmartSlotRecommendation | null;
  alternativeSlots: SmartSlotRecommendation[];
  workloadDistribution: { staffId: string; staffName: string; totalMinutes: number; appointmentCount: number }[];
  constraintViolationsAvoided: number;
  fallbackUsed: boolean;
}

export interface CustomerRecommendation {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  price: number;
  matchScore: number; // 0 to 100
  reasoning: string;
  isBundle?: boolean;
}

export interface CustomerPersonalizationResult {
  customerId: string;
  recommendedServices: CustomerRecommendation[];
  suggestedStylists: { staffId: string; staffName: string; specialty: string; matchScore: number; reasoning: string }[];
  recommendedOffers: { code: string; title: string; discountText: string; matchReason: string }[];
  preferredCategory: string;
  fallbackStrategy: 'collaborative' | 'content_based' | 'popularity_cold_start';
}

export interface DailyDemandPoint {
  date: string;
  dayOfWeek: string;
  predictedAppointments: number;
  actualAppointments?: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface DemandForecastResult {
  timeframe: '7d' | '30d' | '90d';
  dailyForecast: DailyDemandPoint[];
  peakHours: { hour: string; expectedVolume: number; densityLabel: 'High' | 'Moderate' | 'Low' }[];
  categoryDemand: { category: string; percentage: number; count: number }[];
  branchDemand: { branchId: string; branchName: string; expectedVolume: number }[];
  historicalMae: number;
  baselineMae: number;
  confidence: number;
  modelType: string;
}

export interface DailyRevenuePoint {
  date: string;
  predictedRevenue: number;
  actualRevenue?: number;
  lowerBound: number;
  upperBound: number;
}

export interface RevenueForecastResult {
  period: 'daily' | 'weekly' | 'monthly';
  forecastSeries: DailyRevenuePoint[];
  expectedTotalRevenue: number;
  confidenceIntervalPercentage: number; // e.g. 95%
  serviceProfitability: { serviceId: string; serviceName: string; grossRevenue: number; estimatedMarginPercentage: number }[];
  forecastErrorMape: number;
  modelConfidence: number;
}

export interface StaffWorkloadAnalysis {
  staffId: string;
  staffName: string;
  branchName: string;
  activeHours: number;
  bookedHours: number;
  utilizationRate: number; // 0% to 100%
  status: 'optimal' | 'underutilized' | 'overloaded';
  alert?: string;
  recommendedRituals: string[];
}

export interface StaffAllocationResult {
  allocations: StaffWorkloadAnalysis[];
  suggestedRebalancing: { fromStaffId: string; toStaffId: string; appointmentId: string; reason: string }[];
  averageBayUtilization: number;
}

export interface CustomerChurnAssessment {
  customerId: string;
  customerName: string;
  daysSinceLastVisit: number;
  totalVisits: number;
  totalSpent: number;
  churnRiskScore: number; // 0.0 to 1.0
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  contributingFactors: string[];
  suggestedAction: string;
  recommendedOfferCode?: string;
}

export interface ReviewSentimentResult {
  salonId: string;
  averageSentimentScore: number; // -1.0 to +1.0
  sentimentDistribution: { positive: number; neutral: number; negative: number };
  aspectScores: {
    hairArtistry: number;
    hospitality: number;
    cleanliness: number;
    punctuality: number;
    valueForPrice: number;
  };
  keyPositiveThemes: string[];
  emergingConcerns: string[];
  analyzedReviewsCount: number;
}

export interface OwnerAiQueryResponse {
  query: string;
  answer: string;
  structuredMetrics?: Record<string, any>;
  dataSources: string[];
  dateRangeReferenced: string;
  suggestedFollowUps?: string[];
  confidence: number;
}
