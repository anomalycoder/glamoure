/**
 * Feature Extraction Layer for Glamouré ML Engine
 * Extracts mathematical, behavioral, and temporal feature vectors from real DB entities.
 */

import type { Appointment } from '../../types/appointment';
import type { CustomerRecord } from '../../types/common';
import type { StaffProfile } from '../../types/staff';
import type { Service } from '../../types/salon';

export interface CustomerFeatureVector {
  customerId: string;
  recencyDays: number;
  visitFrequency90d: number;
  totalAppointments: number;
  monetaryTotal: number;
  avgOrderValue: number;
  cancellationRate: number;
  preferredCategoryId?: string;
  preferredStaffId?: string;
}

export interface StaffFeatureVector {
  staffId: string;
  staffName: string;
  totalBookingsCount: number;
  utilizationPercentage: number;
  averageRating: number;
  serviceIdsQualified: string[];
  scheduleCompactnessScore: number; // 0 to 1, higher = fewer awkward gaps
}

export interface ServiceFeatureVector {
  serviceId: string;
  serviceName: string;
  categoryId: string;
  price: number;
  durationMinutes: number;
  totalBookings: number;
  popularityScore: number; // 0 to 100
  revenueContribution: number;
}

export class FeatureExtractor {
  /**
   * Extract customer behavioral vector (RFM + cancellation history)
   */
  public static extractCustomerFeatures(
    customerId: string,
    appointments: Appointment[],
    customerRecord?: CustomerRecord,
    referenceDate: string = new Date().toISOString().split('T')[0]
  ): CustomerFeatureVector {
    const custApts = appointments.filter(a => a.customerId === customerId);
    
    // Sort chronologically
    const sorted = [...custApts].sort((a, b) => 
      `${a.appointmentDate} ${a.startTime}`.localeCompare(`${b.appointmentDate} ${b.startTime}`)
    );

    const completed = sorted.filter(a => a.status === 'completed');
    const cancelled = sorted.filter(a => a.status === 'cancelled' || a.status === 'no_show');

    // Recency: days between reference date and most recent completed/confirmed visit
    let recencyDays = 999;
    if (sorted.length > 0) {
      const lastApt = sorted[sorted.length - 1];
      const diffMs = new Date(referenceDate).getTime() - new Date(lastApt.appointmentDate).getTime();
      recencyDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }

    // 90-day window frequency
    const ninetyDaysAgo = new Date(new Date(referenceDate).getTime() - 90 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    const visitFrequency90d = custApts.filter(a => a.appointmentDate >= ninetyDaysAgo).length;

    // Monetary
    const monetaryTotal = customerRecord?.totalSpent 
      ?? completed.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const avgOrderValue = completed.length > 0 ? monetaryTotal / completed.length : (customerRecord?.totalSpent || 0);

    // Cancellation rate
    const cancellationRate = sorted.length > 0 ? cancelled.length / sorted.length : 0;

    // Preferred stylist (mode)
    const staffFrequency: Record<string, number> = {};
    for (const apt of custApts) {
      if (apt.staffId) {
        staffFrequency[apt.staffId] = (staffFrequency[apt.staffId] || 0) + 1;
      }
    }
    const preferredStaffId = Object.entries(staffFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      customerId,
      recencyDays,
      visitFrequency90d,
      totalAppointments: sorted.length || customerRecord?.totalAppointments || 0,
      monetaryTotal,
      avgOrderValue,
      cancellationRate,
      preferredStaffId,
    };
  }

  /**
   * Extract staff workload and compactness features
   */
  public static extractStaffFeatures(
    staff: StaffProfile,
    appointmentsForDateOrPeriod: Appointment[],
    shiftHoursPerDay: number = 8
  ): StaffFeatureVector {
    const staffApts = appointmentsForDateOrPeriod
      .filter(a => a.staffId === staff.id && a.status !== 'cancelled' && a.status !== 'no_show')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const totalMinutesBooked = staffApts.reduce((sum, a) => sum + (Number(a.durationMinutes) || 60), 0);
    const totalAvailableMinutes = shiftHoursPerDay * 60;
    const utilizationPercentage = Math.min(100, Math.round((totalMinutesBooked / totalAvailableMinutes) * 100));

    // Calculate schedule compactness (penalize dead gaps between 15 and 45 minutes)
    let idleGapCount = 0;
    for (let i = 0; i < staffApts.length - 1; i++) {
      const currentEnd = staffApts[i].endTime;
      const nextStart = staffApts[i + 1].startTime;
      const gapMins = this.calculateMinuteDifference(currentEnd, nextStart);
      if (gapMins > 0 && gapMins <= 45) {
        idleGapCount++;
      }
    }

    const scheduleCompactnessScore = Math.max(0, 1 - (idleGapCount * 0.15));

    return {
      staffId: staff.id,
      staffName: staff.displayName,
      totalBookingsCount: staffApts.length,
      utilizationPercentage,
      averageRating: staff.rating || 4.9,
      serviceIdsQualified: staff.servicesOffered || [],
      scheduleCompactnessScore,
    };
  }

  /**
   * Extract Service Popularity & Margin Feature Vector
   */
  public static extractServiceFeatures(
    service: Service,
    allAppointments: Appointment[]
  ): ServiceFeatureVector {
    const serviceApts = allAppointments.filter(a => a.serviceId === service.id);
    const totalBookings = serviceApts.length;
    const revenueContribution = serviceApts.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

    // Compute relative popularity score (0-100)
    const baseScore = Math.min(100, totalBookings * 8);

    return {
      serviceId: service.id,
      serviceName: service.name,
      categoryId: service.categoryId,
      price: service.price,
      durationMinutes: service.durationMinutes,
      totalBookings,
      popularityScore: baseScore,
      revenueContribution,
    };
  }

  private static calculateMinuteDifference(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  }
}
