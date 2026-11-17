/**
 * Member Workstation Intelligence
 * Powers the artisan workstation experience:
 * Daily client itinerary intelligence, guest preference alerts, workstation efficiency, and schedule compactness.
 */

import { db } from '../../database/db';
import type { Appointment } from '../../types/appointment';

export interface WorkstationItineraryItem {
  appointment: Appointment;
  prepNotes: string[];
  isVipClient: boolean;
  timeUntilStartMinutes: number;
  compactnessFlag: 'on_time' | 'tight_buffer' | 'generous_break';
}

export interface MemberWorkstationIntelligenceResult {
  staffId: string;
  staffName: string;
  date: string;
  todayAppointmentsCount: number;
  totalServiceMinutes: number;
  efficiencyScore: number; // 0 to 100
  workstationStatus: 'optimal' | 'calm' | 'dense';
  itinerary: WorkstationItineraryItem[];
  suggestedPrep: string[];
  personalRating: number;
}

export class MemberIntelligence {
  public static getWorkstationIntelligence(
    staffId: string,
    date: string = new Date().toISOString().split('T')[0]
  ): MemberWorkstationIntelligenceResult {
    const staff = db.getStaffById(staffId);
    const appointments = db.getAppointmentsByStaff(staffId).filter(a => 
      a.appointmentDate === date && 
      a.status !== 'cancelled' && 
      a.status !== 'no_show'
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    const totalServiceMinutes = appointments.reduce((sum, a) => sum + (Number(a.durationMinutes) || 60), 0);
    const bookedHours = totalServiceMinutes / 60;

    let workstationStatus: 'optimal' | 'calm' | 'dense' = 'optimal';
    if (bookedHours > 6.5) workstationStatus = 'dense';
    else if (bookedHours < 3.5) workstationStatus = 'calm';

    // Calculate efficiency score (0-100) based on appointment completion and schedule density
    const efficiencyScore = Math.min(100, Math.max(60, Math.round(75 + (bookedHours * 3.5))));

    const now = new Date();
    const currentMinOfDay = now.getHours() * 60 + now.getMinutes();

    const itinerary: WorkstationItineraryItem[] = appointments.map((apt, idx) => {
      const [startH, startM] = apt.startTime.split(':').map(Number);
      const aptMin = startH * 60 + startM;
      const timeUntilStartMinutes = Math.max(0, aptMin - currentMinOfDay);

      // Determine buffer/compactness
      let compactnessFlag: WorkstationItineraryItem['compactnessFlag'] = 'on_time';
      if (idx > 0) {
        const prevEnd = appointments[idx - 1].endTime;
        const [prevH, prevM] = prevEnd.split(':').map(Number);
        const gap = aptMin - (prevH * 60 + prevM);
        if (gap < 15) compactnessFlag = 'tight_buffer';
        else if (gap > 45) compactnessFlag = 'generous_break';
      }

      // Guest profile prep notes
      const prepNotes: string[] = [];
      const isVip = Number(apt.price) > 5000;
      if (isVip) prepNotes.push('VIP Guest: Reserve private styling booth and offer signature welcome beverage.');
      
      const sName = apt.serviceName.toLowerCase();
      if (sName.includes('color') || sName.includes('balayage')) {
        prepNotes.push('Stage bond-building toner & foil bowls 10 mins prior to arrival.');
      } else if (sName.includes('treatment') || sName.includes('spa')) {
        prepNotes.push('Pre-heat botanical steam towels and verify scalp essential oil blend.');
      } else {
        prepNotes.push('Standard consultation protocol; review previous cut notes.');
      }

      return {
        appointment: apt,
        prepNotes,
        isVipClient: isVip,
        timeUntilStartMinutes,
        compactnessFlag,
      };
    });

    const suggestedPrep = [
      'Station sanitized and staged with freshly sterilized instruments.',
      'Check inventory for afternoon color treatments and toners.',
      'Review guest formula cards for today’s confirmed bookings.',
    ];

    return {
      staffId,
      staffName: staff?.displayName || 'Master Artisan',
      date,
      todayAppointmentsCount: appointments.length,
      totalServiceMinutes,
      efficiencyScore,
      workstationStatus,
      itinerary,
      suggestedPrep,
      personalRating: staff?.rating || 4.9,
    };
  }
}
