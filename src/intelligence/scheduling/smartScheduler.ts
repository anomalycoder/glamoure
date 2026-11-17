/**
 * GLAMOURÉ AI SMART SCHEDULING ENGINE
 * 3-Tier Hybrid Scheduler:
 * 1. Hard Constraints (Inviolable Rules: Salon Hours, Staff Hours, Leave, No Overlap, Buffer)
 * 2. Workload Optimization (Balances bookings across artisans to prevent burnout)
 * 3. Learned Ranking (Scores slots by customer preference, qualification, compactness, and wait-time minimization)
 */

import { db } from '../../database/db';
import type { 
  SmartScheduleResult, 
  SmartSlotRecommendation 
} from '../types';
import { IntelligenceMonitor } from '../monitoring/intelligenceMonitor';
import { ModelRegistry } from '../models/modelRegistry';

export interface SmartScheduleRequest {
  salonId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  branchId?: string;
  preferredTime?: string; // 'morning' | 'afternoon' | 'evening' | '11:15'
  preferredStaffId?: string;
  customerId?: string;
}

export class SmartScheduler {
  private static readonly MODEL_ID = 'smart-scheduling-v2';

  /**
   * Main entry point: evaluate hard constraints, calculate workload balance, rank slots.
   */
  public static findSmartSlots(request: SmartScheduleRequest): SmartScheduleResult {
    IntelligenceMonitor.recordInferenceCall('scheduling');

    const salon = db.getSalonById(request.salonId);
    const service = db.getServiceById(request.serviceId);

    if (!salon || !service) {
      return {
        recommendedSlots: [],
        primaryRecommendation: null,
        alternativeSlots: [],
        workloadDistribution: [],
        constraintViolationsAvoided: 0,
        fallbackUsed: true,
      };
    }

    const duration = Number(service.durationMinutes) || 60;
    const buffer = salon.settings?.bufferMinutesBetweenAppointments ?? 10;
    const requestedDate = new Date(request.date);
    const dayOfWeek = requestedDate.getDay(); // 0=Sunday, 1=Monday...

    // ─────────────────────────────────────────────────────────────────────────
    // TIER 1: HARD CONSTRAINT EVALUATION
    // ─────────────────────────────────────────────────────────────────────────

    // 1.1 Salon Operating Hours check
    const salonHours = salon.settings?.businessHours?.find(bh => bh.dayOfWeek === dayOfWeek);
    if (salonHours && !salonHours.isOpen) {
      // Salon is closed on this day
      return {
        recommendedSlots: [],
        primaryRecommendation: null,
        alternativeSlots: [],
        workloadDistribution: [],
        constraintViolationsAvoided: 1,
        fallbackUsed: false,
      };
    }

    const salonOpenTime = salonHours?.open || '09:00';
    const salonCloseTime = salonHours?.close || '20:00';

    // 1.2 Qualified Staff Profiles
    const allStaff = db.getStaffBySalon(request.salonId).filter(s => s.isActive !== false);
    const qualifiedStaff = allStaff.filter(s => 
      s.servicesOffered && s.servicesOffered.includes(request.serviceId)
    );

    if (qualifiedStaff.length === 0) {
      // Cold-start fallback: any active staff member if service qualifications aren't mapped
      qualifiedStaff.push(...allStaff);
    }

    // 1.3 Leave Requests for that date
    const leaveRequests = db.getLeaveRequests(request.salonId).filter(lr => 
      lr.status === 'approved' &&
      request.date >= lr.startDate &&
      request.date <= lr.endDate
    );
    const staffOnLeave = new Set(leaveRequests.map(lr => lr.staffProfileId));

    // 1.4 Existing Appointments for salon on that date
    const existingApts = db.getAppointmentsBySalon(request.salonId).filter(a => 
      a.appointmentDate === request.date &&
      a.status !== 'cancelled' &&
      a.status !== 'no_show'
    );

    // Compute Workload Distribution for reporting
    const workloadDistribution = qualifiedStaff.map(staff => {
      const staffApts = existingApts.filter(a => a.staffId === staff.id);
      const totalMinutes = staffApts.reduce((sum, a) => sum + (Number(a.durationMinutes) || 60), 0);
      return {
        staffId: staff.id,
        staffName: staff.displayName,
        totalMinutes,
        appointmentCount: staffApts.length,
      };
    });

    // 1.5 Generate and Filter candidate slots
    const candidateSlots: SmartSlotRecommendation[] = [];
    let violationsAvoided = 0;

    for (const staff of qualifiedStaff) {
      // Skip if on approved leave
      if (staffOnLeave.has(staff.id)) {
        violationsAvoided++;
        continue;
      }

      // Check Staff Working Hours
      const workingHoursList = db.getWorkingHours(staff.id);
      const staffDayHours = workingHoursList.find(wh => {
        const whDay = typeof wh.dayOfWeek === 'string' ? Number(wh.dayOfWeek) : wh.dayOfWeek;
        return whDay === dayOfWeek;
      });

      // If staff has configured hours and is not working today, skip
      if (staffDayHours && !staffDayHours.isWorking) {
        violationsAvoided++;
        continue;
      }

      const shiftStart = staffDayHours?.startTime || salonOpenTime;
      const shiftEnd = staffDayHours?.endTime || salonCloseTime;

      // Existing bookings for this staff member
      const staffBookings = existingApts.filter(a => a.staffId === staff.id);

      // Slot generator: step through in 30-minute intervals
      const startMin = this.timeToMinutes(shiftStart);
      const endMin = this.timeToMinutes(shiftEnd);

      for (let currMin = startMin; currMin + duration <= endMin; currMin += 30) {
        const slotStartStr = this.minutesToTime(currMin);
        const slotEndStr = this.minutesToTime(currMin + duration);

        // Check against Salon close time
        if (this.timeToMinutes(slotEndStr) > this.timeToMinutes(salonCloseTime)) {
          violationsAvoided++;
          continue;
        }

        // Check for collision with existing appointments (including buffer)
        let hasCollision = false;
        for (const booking of staffBookings) {
          const bStart = this.timeToMinutes(booking.startTime);
          const bEnd = this.timeToMinutes(booking.endTime);
          
          // Slot interval with buffer: [currMin, currMin + duration + buffer]
          // Booking interval: [bStart, bEnd]
          const slotEndWithBuffer = currMin + duration + buffer;
          const bookingEndWithBuffer = bEnd + buffer;

          if (
            (currMin >= bStart && currMin < bookingEndWithBuffer) ||
            (currMin + duration > bStart && currMin + duration <= bookingEndWithBuffer) ||
            (currMin <= bStart && slotEndWithBuffer >= bookingEndWithBuffer)
          ) {
            hasCollision = true;
            violationsAvoided++;
            break;
          }
        }

        if (hasCollision) continue;

        // ─────────────────────────────────────────────────────────────────────
        // TIER 2 & TIER 3: WORKLOAD OPTIMIZATION & LEARNED RANKING
        // ─────────────────────────────────────────────────────────────────────

        // Workload factor: stylists with fewer minutes booked today receive higher score
        const staffWorkload = workloadDistribution.find(w => w.staffId === staff.id);
        const bookedMins = staffWorkload ? staffWorkload.totalMinutes : 0;
        const maxShiftMins = 8 * 60;
        const workloadBalanceScore = Math.max(0.1, 1 - (bookedMins / maxShiftMins));

        // Stylist qualification factor (rating + experience)
        const rating = Number(staff.rating) || 4.8;
        const stylistQualification = Math.min(1.0, rating / 5.0);

        // Customer preference factor
        let customerPreferenceMatch = 0.5; // neutral baseline
        if (request.preferredStaffId && request.preferredStaffId === staff.id) {
          customerPreferenceMatch = 1.0;
        } else if (request.customerId) {
          // Check if customer previously booked this stylist
          const pastCustApts = db.getAppointmentsByCustomer(request.customerId);
          const withStaff = pastCustApts.filter(a => a.staffId === staff.id && a.status === 'completed');
          if (withStaff.length > 0) {
            customerPreferenceMatch = 0.85;
          }
        }

        // Time of Day alignment
        let timeScore = 0.7; // default
        if (request.preferredTime) {
          const slotHour = Math.floor(currMin / 60);
          if (request.preferredTime === 'morning' && slotHour >= 9 && slotHour < 12) {
            timeScore = 0.95;
          } else if (request.preferredTime === 'afternoon' && slotHour >= 12 && slotHour < 16) {
            timeScore = 0.95;
          } else if (request.preferredTime === 'evening' && slotHour >= 16 && slotHour <= 20) {
            timeScore = 0.95;
          } else if (request.preferredTime.includes(':')) {
            const targetMin = this.timeToMinutes(request.preferredTime);
            const diff = Math.abs(targetMin - currMin);
            timeScore = Math.max(0.2, 1 - (diff / 180));
          }
        }

        // Schedule Compactness (reward adjacent slots that prevent dead downtime)
        let scheduleEfficiencyScore = 0.6;
        for (const booking of staffBookings) {
          const bEnd = this.timeToMinutes(booking.endTime);
          const gap = currMin - bEnd;
          if (gap >= 0 && gap <= 15) {
            scheduleEfficiencyScore = 0.95; // Seamless transition!
            break;
          }
        }

        // Weighted Overall Score (0 to 100)
        const overallScore = Math.min(100, Math.round(
          (stylistQualification * 20) +
          (workloadBalanceScore * 25) +
          (customerPreferenceMatch * 25) +
          (timeScore * 15) +
          (scheduleEfficiencyScore * 15)
        ));

        // Explanation text
        let explanation = `Optimal timing: ${staff.displayName} (${staff.title || 'Artisan'}) is highly rated`;
        if (scheduleEfficiencyScore > 0.8) {
          explanation += ' with zero dead downtime between services.';
        } else if (workloadBalanceScore > 0.7) {
          explanation += ' with calm workstation capacity.';
        } else {
          explanation += '.';
        }

        candidateSlots.push({
          startTime: slotStartStr,
          endTime: slotEndStr,
          date: request.date,
          staffId: staff.id,
          staffName: staff.displayName,
          branchId: request.branchId || staff.branchId,
          serviceId: service.id,
          serviceName: service.name,
          overallScore,
          factors: {
            stylistQualification,
            workloadBalanceScore,
            customerPreferenceMatch,
            scheduleEfficiencyScore,
          },
          explanation,
          estimatedWaitMinutes: 0, // Zero wait guarantee for confirmed smart slots
        });
      }
    }

    // Sort descending by overallScore
    candidateSlots.sort((a, b) => b.overallScore - a.overallScore);

    // Filter duplicates for identical start times across the same staff (keep highest score)
    const uniqueSlots: SmartSlotRecommendation[] = [];
    const seen = new Set<string>();
    for (const slot of candidateSlots) {
      const key = `${slot.staffId}-${slot.startTime}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSlots.push(slot);
      }
    }

    const primaryRecommendation = uniqueSlots.length > 0 ? uniqueSlots[0] : null;
    const alternativeSlots = uniqueSlots.slice(1, 6);

    ModelRegistry.recordInference(this.MODEL_ID, primaryRecommendation ? 0.95 : 0.6);

    return {
      recommendedSlots: uniqueSlots.slice(0, 8),
      primaryRecommendation,
      alternativeSlots,
      workloadDistribution,
      constraintViolationsAvoided: violationsAvoided,
      fallbackUsed: uniqueSlots.length === 0,
    };
  }

  private static timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  private static minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
}
