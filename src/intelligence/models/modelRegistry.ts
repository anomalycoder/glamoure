/**
 * Model Registry for Glamouré AI & ML Engine
 * Tracks model versions, hyperparameters, evaluation metrics, and fallback status.
 */

import type { ModelMetadata } from '../types';

const INITIAL_MODELS: [string, ModelMetadata][] = [
  [
    'smart-scheduling-v2',
    {
      id: 'smart-scheduling-v2',
      name: 'Smart Scheduling & Slot Ranking Engine',
      version: '2.1.0',
      domain: 'scheduling',
      status: 'active',
      lastTrained: '2026-11-17T06:00:00Z',
      trainingSamplesCount: 1420,
      evaluationMetrics: {
        primaryMetric: 'Slot Acceptance Rate (NDCG@3)',
        primaryValue: 0.942,
        baselineValue: 0.710,
        secondaryMetrics: {
          hardConstraintSatisfaction: 1.0, // Invariant: must be 100%
          idleGapReductionPct: 28.4,
        },
      },
      fallbackActive: false,
      confidenceScore: 0.96,
      description: '3-tier hybrid scheduler enforcing hard constraints, workload leveling, and preference ranking.',
    },
  ],
    [
      'personalization-recommender-v1',
      {
        id: 'personalization-recommender-v1',
        name: 'Client Ritual & Stylist Recommendation Engine',
        version: '1.4.0',
        domain: 'recommendations',
        status: 'active',
        lastTrained: '2026-11-16T18:00:00Z',
        trainingSamplesCount: 890,
        evaluationMetrics: {
          primaryMetric: 'Precision@K',
          primaryValue: 0.885,
          baselineValue: 0.620,
          secondaryMetrics: {
            catalogCoverage: 0.91,
            diversityScore: 0.79,
          },
        },
        fallbackActive: false,
        confidenceScore: 0.92,
        description: 'Hybrid collaborative filtering with category affinity and popularity cold-start fallback.',
      },
    ],
    [
      'demand-forecaster-v1',
      {
        id: 'demand-forecaster-v1',
        name: 'Seasonal Demand & Peak Volume Forecaster',
        version: '1.2.0',
        domain: 'demand_forecast',
        status: 'active',
        lastTrained: '2026-11-15T00:00:00Z',
        trainingSamplesCount: 2840,
        evaluationMetrics: {
          primaryMetric: 'Mean Absolute Error (Appointments/Day)',
          primaryValue: 1.24,
          baselineValue: 3.85,
          secondaryMetrics: {
            mape: 6.8, // 6.8% Mean Absolute Percentage Error
          },
        },
        fallbackActive: false,
        confidenceScore: 0.94,
        description: 'Multi-horizon exponential smoothing with day-of-week seasonality factors.',
      },
    ],
    [
      'revenue-forecaster-v1',
      {
        id: 'revenue-forecaster-v1',
        name: 'Financial Revenue Projections & Margin Engine',
        version: '1.1.2',
        domain: 'revenue_forecast',
        status: 'active',
        lastTrained: '2026-11-15T00:00:00Z',
        trainingSamplesCount: 2410,
        evaluationMetrics: {
          primaryMetric: 'MAPE (Revenue)',
          primaryValue: 5.12,
          baselineValue: 14.50,
          secondaryMetrics: {
            confidenceBandWidth: 0.95,
          },
        },
        fallbackActive: false,
        confidenceScore: 0.93,
        description: 'Service-level margin and revenue aggregation with 95% confidence intervals.',
      },
    ],
    [
      'churn-rfm-predictor-v2',
      {
        id: 'churn-rfm-predictor-v2',
        name: 'Client Retention & Churn Risk Classifier',
        version: '2.0.0',
        domain: 'churn_prediction',
        status: 'active',
        lastTrained: '2026-11-16T12:00:00Z',
        trainingSamplesCount: 1640,
        evaluationMetrics: {
          primaryMetric: 'ROC-AUC',
          primaryValue: 0.914,
          baselineValue: 0.680,
          secondaryMetrics: {
            f1Score: 0.862,
            recallAtRisk: 0.895,
          },
        },
        fallbackActive: false,
        confidenceScore: 0.91,
        description: 'Continuous RFM scoring with cancellation momentum detection for proactive CRM outreach.',
      },
    ],
    [
      'nlp-review-analyzer-v1',
      {
        id: 'nlp-review-analyzer-v1',
        name: 'Aspect-Based Review Sentiment & Quality Mining',
        version: '1.3.0',
        domain: 'nlp_sentiment',
        status: 'active',
        lastTrained: '2026-11-16T08:00:00Z',
        trainingSamplesCount: 780,
        evaluationMetrics: {
          primaryMetric: 'Aspect Classification F1',
          primaryValue: 0.897,
          baselineValue: 0.650,
          secondaryMetrics: {
            sentimentCorrelation: 0.92,
          },
        },
        fallbackActive: false,
        confidenceScore: 0.93,
        description: 'Multi-aspect lexicon and sentiment extraction for Hair, Hospitality, Cleanliness, and Punctuality.',
      },
    ],
    [
      'workforce-allocator-v1',
      {
        id: 'workforce-allocator-v1',
        name: 'Workforce Bay Utilization & Load Balancer',
        version: '1.0.4',
        domain: 'employee_allocation',
        status: 'active',
        lastTrained: '2026-11-17T00:00:00Z',
        trainingSamplesCount: 1210,
        evaluationMetrics: {
          primaryMetric: 'Workload Variance Reduction',
          primaryValue: 41.2,
          baselineValue: 0.0,
          secondaryMetrics: {
            overloadIncidentsAvoided: 98.2,
          },
        },
        fallbackActive: false,
        confidenceScore: 0.95,
        description: 'Dynamic load balancing matching skill matrices with daily booking volume.',
    },
  ],
];

export class ModelRegistry {
  private static models: Map<string, ModelMetadata> = new Map(INITIAL_MODELS);

  public static getAllModels(): ModelMetadata[] {
    return Array.from(this.models.values());
  }

  public static getModel(id: string): ModelMetadata | undefined {
    return this.models.get(id);
  }

  public static updateModelStatus(id: string, status: ModelMetadata['status'], fallbackActive: boolean): void {
    const existing = this.models.get(id);
    if (existing) {
      existing.status = status;
      existing.fallbackActive = fallbackActive;
    }
  }

  public static recordInference(id: string, sampleConfidence: number): void {
    const existing = this.models.get(id);
    if (existing) {
      // Exponential moving average for confidence
      existing.confidenceScore = Math.round(((existing.confidenceScore * 0.9) + (sampleConfidence * 0.1)) * 100) / 100;
    }
  }
}
