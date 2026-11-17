import { db } from '../database/db';
import type { StaffAvailabilitySlot, StaffProfile } from '../types/staff';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export interface MultiStylistSlot extends StaffAvailabilitySlot {
  availableStaffIds?: string[];
  recommendedStaffId?: string;
  recommendedStaffName?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
}

export class AvailabilityService {
  /**
   * Get all active stylists in a salon who are qualified to perform the service
   */
  public static getQualifiedStylists(salonId: string, serviceId: string): StaffProfile[] {
    const allStaff = db.getStaffBySalon(salonId);
    return allStaff.filter(st => st.isActive && st.servicesOffered.includes(serviceId));
  }

  /**
   * Calculate real-time available booking slots for a stylist on a given date
   */
  public static getAvailableSlots(
    staffIdOrParams: string | { staffId?: string; salonId?: string; serviceId?: string; date?: string; duration?: number; durationMinutes?: number },
    durationOrSalonId?: number | string,
    dateOrDuration?: string | number,
    optionalDate?: string
  ): StaffAvailabilitySlot[] {
    let targetStaffId = '';
    let serviceDurationMinutes = 60;
    let dateString = new Date().toISOString().split('T')[0];

    if (typeof staffIdOrParams === 'object' && staffIdOrParams !== null) {
      targetStaffId = staffIdOrParams.staffId || '';
      serviceDurationMinutes = staffIdOrParams.durationMinutes || staffIdOrParams.duration || 60;
      dateString = staffIdOrParams.date || new Date().toISOString().split('T')[0];
    } else if (typeof staffIdOrParams === 'string') {
      targetStaffId = staffIdOrParams;
      if (staffIdOrParams.startsWith('salon-') && typeof durationOrSalonId === 'string') {
        targetStaffId = durationOrSalonId;
        if (typeof dateOrDuration === 'number') {
          serviceDurationMinutes = dateOrDuration;
          if (typeof optionalDate === 'string') dateString = optionalDate;
        } else if (typeof optionalDate === 'string') {
          dateString = optionalDate;
        }
      } else {
        serviceDurationMinutes = typeof durationOrSalonId === 'number' 
          ? durationOrSalonId 
          : (typeof dateOrDuration === 'number' ? dateOrDuration : 60);
        dateString = typeof optionalDate === 'string' 
          ? optionalDate 
          : (typeof dateOrDuration === 'string' ? dateOrDuration : new Date().toISOString().split('T')[0]);
      }
    }

    const staff = db.getStaffById(targetStaffId);
    if (!staff || !staff.isActive) return [];

    // Check if on approved leave
    const leaves = db.getLeaveRequestsByStaff(targetStaffId);
    const isOnLeave = leaves.some(l => l.status === 'approved' && l.startDate <= dateString && l.endDate >= dateString);
    if (isOnLeave) return [];

    const targetDate = new Date(dateString + 'T00:00:00');
    const dayOfWeek = targetDate.getDay(); // 0=Sun..6=Sat
    const dayName = DAY_NAMES[dayOfWeek];

    const allHours = db.getWorkingHours(targetStaffId);
    const workingHours = allHours.find(wh => 
      wh.dayOfWeek === dayOfWeek || 
      (typeof wh.dayOfWeek === 'string' && wh.dayOfWeek.toLowerCase() === dayName)
    );

    if (!workingHours || !workingHours.isWorking) {
      return []; // Stylist off-duty on this day
    }

    // Get existing bookings for this stylist on this date
    const existingAppointments = db
      .getAppointmentsByStaff(targetStaffId)
      .filter(a => a.appointmentDate === dateString && !['cancelled', 'no_show'].includes(a.status));

    // Generate 30-minute increment slots within working hours
    const slots: StaffAvailabilitySlot[] = [];
    const [startH, startM] = workingHours.startTime.split(':').map(Number);
    const [endH, endM] = workingHours.endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    for (let timeM = startMinutes; timeM + serviceDurationMinutes <= endMinutes; timeM += 30) {
      const slotStartH = Math.floor(timeM / 60);
      const slotStartMin = timeM % 60;
      const slotStartTime = `${String(slotStartH).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}`;

      const slotEndTimeM = timeM + serviceDurationMinutes;
      const slotEndH = Math.floor(slotEndTimeM / 60);
      const slotEndMin = slotEndTimeM % 60;
      const slotEndTime = `${String(slotEndH).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}`;

      // Conflict check with existing bookings
      const isBooked = existingAppointments.some(apt => {
        return slotStartTime < apt.endTime && slotEndTime > apt.startTime;
      });

      slots.push({
        time: slotStartTime,
        startTime: slotStartTime,
        endTime: slotEndTime,
        available: !isBooked,
        isAvailable: !isBooked,
        reason: isBooked ? 'Reserved' : undefined,
      } as any);
    }

    return slots;
  }

  /**
   * Calculate aggregated slots when customer selects "Any Available Stylist"
   */
  public static getSlotsForAnyStylist(
    salonId: string,
    serviceId: string,
    serviceDurationMinutes: number,
    dateString: string
  ): MultiStylistSlot[] {
    const qualifiedStylists = this.getQualifiedStylists(salonId, serviceId);
    if (qualifiedStylists.length === 0) return [];

    const slotMap = new Map<string, { availableStaff: StaffProfile[] }>();

    // Calculate slots for each qualified stylist
    qualifiedStylists.forEach(st => {
      const stylistSlots = this.getAvailableSlots(st.id, serviceDurationMinutes, dateString);
      stylistSlots.forEach(slot => {
        if (!slotMap.has(slot.time)) {
          slotMap.set(slot.time, { availableStaff: [] });
        }
        if (slot.available) {
          slotMap.get(slot.time)!.availableStaff.push(st);
        }
      });
    });

    // Sort times chronologically
    const sortedTimes = Array.from(slotMap.keys()).sort();

    return sortedTimes.map(time => {
      const { availableStaff } = slotMap.get(time)!;
      const isAvailable = availableStaff.length > 0;
      const recommended = isAvailable ? availableStaff[0] : undefined;

      return {
        time,
        available: isAvailable,
        reason: isAvailable ? undefined : 'All artisans booked',
        availableStaffIds: availableStaff.map(s => s.id),
        recommendedStaffId: recommended?.id,
        recommendedStaffName: recommended?.displayName,
        assignedStaffId: recommended?.id,
        assignedStaffName: recommended?.displayName,
      };
    });
  }
}

export const availabilityService = {
  getAvailableSlots: AvailabilityService.getAvailableSlots,
  getQualifiedStylists: AvailabilityService.getQualifiedStylists,
  getSlotsForAnyStylist: AvailabilityService.getSlotsForAnyStylist,
};
