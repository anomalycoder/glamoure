/**
 * Data Preprocessing & Validation Pipeline
 * Ensures hygiene, prevents data leakage, cleanses outliers, and handles missing fields.
 */

import type { Appointment } from '../../types/appointment';
import type { CustomerRecord } from '../../types/common';

export class DataCleaner {
  /**
   * Validate and clean appointments for training and analytics
   */
  public static cleanAppointments(appointments: Appointment[]): Appointment[] {
    const seenIds = new Set<string>();
    const cleaned: Appointment[] = [];

    for (const apt of appointments) {
      // 1. Deduplication
      if (seenIds.has(apt.id)) continue;
      seenIds.add(apt.id);

      // 2. Validate essential fields
      if (!apt.id || !apt.salonId || !apt.appointmentDate || !apt.startTime) {
        continue;
      }

      // 3. Outlier handling: duration must be between 15 and 360 minutes
      const duration = Number(apt.durationMinutes);
      if (isNaN(duration) || duration < 15 || duration > 360) {
        continue;
      }

      // 4. Outlier handling: price must be non-negative and realistic
      const price = Number(apt.price);
      if (isNaN(price) || price < 0 || price > 200000) {
        continue;
      }

      cleaned.push({
        ...apt,
        durationMinutes: duration,
        price,
        customerName: apt.customerName?.trim() || 'Valued Guest',
      });
    }

    // Sort chronologically to prevent temporal data leakage
    return cleaned.sort((a, b) => 
      `${a.appointmentDate} ${a.startTime}`.localeCompare(`${b.appointmentDate} ${b.startTime}`)
    );
  }

  /**
   * Chronological Train/Test Split to strictly prevent time-series data leakage
   */
  public static chronologicalSplit<T extends { appointmentDate?: string; createdAt?: string }>(
    data: T[],
    trainRatio: number = 0.8
  ): { train: T[]; test: T[] } {
    if (data.length === 0) return { train: [], test: [] };

    const sorted = [...data].sort((a, b) => {
      const dateA = a.appointmentDate || a.createdAt || '';
      const dateB = b.appointmentDate || b.createdAt || '';
      return dateA.localeCompare(dateB);
    });

    const splitIndex = Math.max(1, Math.floor(sorted.length * trainRatio));
    return {
      train: sorted.slice(0, splitIndex),
      test: sorted.slice(splitIndex),
    };
  }

  /**
   * Handle missing values in customer CRM records
   */
  public static cleanCustomerRecords(records: CustomerRecord[]): CustomerRecord[] {
    return records.map(r => ({
      ...r,
      totalSpent: Math.max(0, Number(r.totalSpent) || 0),
      totalAppointments: Math.max(1, Number(r.totalAppointments) || 1),
      loyaltyPoints: Math.max(0, Number(r.loyaltyPoints) || 0),
      fullName: r.fullName?.trim() || 'Guest',
      email: r.email?.trim() || 'guest@glamoure.com',
    }));
  }
}
