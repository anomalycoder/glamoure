/**
 * Customer Retention & Churn Prediction Engine
 * Computes individual churn probabilities using RFM (Recency, Frequency, Monetary)
 * and cancellation velocity, surfacing proactive retention actions.
 */

import { db } from '../../database/db';
import type { CustomerChurnAssessment } from '../types';
import { FeatureExtractor } from '../features/featureExtractor';
import { ModelRegistry } from '../models/modelRegistry';
import { IntelligenceMonitor } from '../monitoring/intelligenceMonitor';

export class ChurnPredictor {
  private static readonly MODEL_ID = 'churn-rfm-predictor-v2';

  /**
   * Assess churn risk for all customers of a salon
   */
  public static assessSalonCustomers(salonId: string): CustomerChurnAssessment[] {
    IntelligenceMonitor.recordInferenceCall('churn_prediction');

    const customerRecords = db.getCustomerRecordsBySalon(salonId);
    const appointments = db.getAppointmentsBySalon(salonId);
    const offers = db.getOffersBySalon(salonId);
    const topOffer = offers[0]?.code || 'PRIVILEGE15';

    const assessments: CustomerChurnAssessment[] = [];

    for (const record of customerRecords) {
      const assessment = this.assessCustomer(record.id, appointments, record, topOffer);
      assessments.push(assessment);
    }

    // Sort by churn risk score descending (highest risk first)
    assessments.sort((a, b) => b.churnRiskScore - a.churnRiskScore);

    ModelRegistry.recordInference(this.MODEL_ID, 0.92);

    return assessments;
  }

  /**
   * Assess churn risk for a single customer
   */
  public static assessCustomer(
    customerId: string,
    appointments: any[],
    customerRecord?: any,
    defaultOfferCode: string = 'GLAMVIP15'
  ): CustomerChurnAssessment {
    const custFeatures = FeatureExtractor.extractCustomerFeatures(customerId, appointments, customerRecord);
    const name = customerRecord?.fullName || 'Distinguished Guest';

    const { recencyDays, visitFrequency90d, totalAppointments, monetaryTotal, cancellationRate } = custFeatures;

    // Churn Risk Scoring Heuristic (Logistic Regression approximation)
    // Luxury salon cycle benchmark: ideal rebooking is every 28-42 days.
    let riskScore = 0.15; // baseline

    // Recency penalty
    if (recencyDays > 90) {
      riskScore += 0.45;
    } else if (recencyDays > 50) {
      riskScore += 0.25;
    } else if (recencyDays > 35) {
      riskScore += 0.10;
    } else {
      riskScore -= 0.10; // active client
    }

    // Frequency damping (loyal guests churn less easily, but drift is high concern)
    if (visitFrequency90d === 0 && totalAppointments > 2) {
      riskScore += 0.20;
    } else if (visitFrequency90d >= 2) {
      riskScore -= 0.15;
    }

    // Cancellation momentum penalty
    if (cancellationRate > 0.3) {
      riskScore += 0.15;
    }

    // Clamp score to [0.05, 0.98]
    const churnRiskScore = Math.round(Math.min(0.98, Math.max(0.05, riskScore)) * 100) / 100;

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (churnRiskScore >= 0.75) {
      riskLevel = 'Critical';
    } else if (churnRiskScore >= 0.55) {
      riskLevel = 'High';
    } else if (churnRiskScore >= 0.35) {
      riskLevel = 'Moderate';
    }

    // Contributing Factors Formulation
    const contributingFactors: string[] = [];
    if (recencyDays > 45) {
      contributingFactors.push(`Lapsed visit window: ${recencyDays} days since last confirmed appointment.`);
    }
    if (visitFrequency90d === 0) {
      contributingFactors.push('Zero appointments in the last 90-day seasonal quarter.');
    }
    if (cancellationRate > 0.25) {
      contributingFactors.push(`Elevated cancellation rate (${Math.round(cancellationRate * 100)}%) without rebooking.`);
    }
    if (monetaryTotal > 10000) {
      contributingFactors.push(`High lifetime value (₹${monetaryTotal.toLocaleString('en-IN')}) requires dedicated retention concierge.`);
    }
    if (contributingFactors.length === 0) {
      contributingFactors.push('Steady visit cadence adhering to recommended ritual cycles.');
    }

    // Suggested Action Formulation
    let suggestedAction = 'Maintain standard concierge communications.';
    if (riskLevel === 'Critical') {
      suggestedAction = `Immediate VIP concierge outreach: Offer ${defaultOfferCode} complimentary scalp revival with next haircut.`;
    } else if (riskLevel === 'High') {
      suggestedAction = 'Send personalized email from preferred stylist noting curated seasonal openings.';
    } else if (riskLevel === 'Moderate') {
      suggestedAction = 'Trigger automated WhatsApp reminder for scheduled hair touch-up.';
    }

    return {
      customerId,
      customerName: name,
      daysSinceLastVisit: recencyDays,
      totalVisits: totalAppointments,
      totalSpent: monetaryTotal,
      churnRiskScore,
      riskLevel,
      contributingFactors,
      suggestedAction,
      recommendedOfferCode: riskLevel !== 'Low' ? defaultOfferCode : undefined,
    };
  }
}
