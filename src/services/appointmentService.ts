import { db } from '../database/db';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import type { User } from '../types/auth';
import { AvailabilityService } from './availabilityService';

export class AppointmentService {
  /**
   * Book appointment with transactional conflict checks and auto-generated status history
   */
  public static bookAppointment(params: {
    salonId: string;
    branchId?: string;
    customerId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    staffId?: string;
    staffName?: string;
    serviceId: string;
    serviceName?: string;
    appointmentDate?: string;
    date?: string;
    startTime: string;
    durationMinutes?: number;
    price?: number;
    depositAmount?: number;
    status?: AppointmentStatus;
    notes?: string;
    bookedBy?: User | { id: string; fullName: string; email: string };
  }): Appointment {
    const appointmentDate = params.appointmentDate || params.date || new Date().toISOString().split('T')[0];
    const service = db.getServiceById(params.serviceId);
    const durationMinutes = params.durationMinutes || (service ? service.durationMinutes : 60);
    const serviceName = params.serviceName || (service ? service.name : 'Salon Ritual');
    const price = params.price !== undefined ? params.price : (service ? service.price : 0);
    const customer = db.findUserById(params.customerId);
    const customerName = params.customerName || (customer ? customer.fullName : 'Valued Client');
    const customerEmail = params.customerEmail || (customer ? customer.email : 'client@glamoure.com');

    let targetStaffId = params.staffId;
    let targetStaffName = params.staffName;

    // Handle "Any Available Stylist" allocation
    if (params.staffId === 'any' || !params.staffId) {
      const anySlots = AvailabilityService.getSlotsForAnyStylist(
        params.salonId,
        params.serviceId,
        durationMinutes,
        appointmentDate
      );
      const matchingSlot = anySlots.find(s => s.time === params.startTime && s.available);
      if (!matchingSlot || !matchingSlot.recommendedStaffId) {
        throw new Error(`No qualified artisans available for ${serviceName} on ${appointmentDate} at ${params.startTime}`);
      }
      targetStaffId = matchingSlot.recommendedStaffId;
      targetStaffName = matchingSlot.recommendedStaffName || 'Master Stylist';
    }

    // Validate stylist qualification
    if (!targetStaffId) {
      throw new Error('Please select a preferred stylist or choose any available stylist.');
    }
    const staff = db.getStaffById(targetStaffId);
    if (!staff) {
      throw new Error('Selected stylist profile was not found.');
    }
    if (!staff.servicesOffered.includes(params.serviceId)) {
      throw new Error(`Artisan ${staff.displayName} is not qualified for ${serviceName}.`);
    }

    const confirmedStaffName = targetStaffName || staff.displayName;

    // Calculate end time
    const [h, m] = params.startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const appointment = db.createAppointment(
      {
        salonId: params.salonId,
        branchId: params.branchId || 'branch-jubilee-main',
        customerId: params.customerId,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: params.customerPhone,
        staffId: targetStaffId,
        staffName: confirmedStaffName,
        serviceId: params.serviceId,
        serviceName: serviceName,
        appointmentDate: appointmentDate,
        startTime: params.startTime,
        endTime,
        durationMinutes: durationMinutes,
        price: price,
        depositAmount: params.depositAmount || 0,
        status: params.status || 'pending',
        paymentStatus: params.depositAmount && params.depositAmount > 0 ? 'deposit_paid' : 'unpaid',
        notes: params.notes,
      },
      params.bookedBy?.id || params.customerId,
      params.bookedBy?.fullName || customerName
    );

    // Create Notification
    db.createNotification({
      id: `notif-${Date.now()}`,
      userId: params.customerId,
      salonId: params.salonId,
      title: 'Appointment Requested',
      message: `Your booking for ${serviceName} on ${appointmentDate} at ${params.startTime} has been created.`,
      type: 'appointment',
      isRead: false,
      link: `/customer/bookings/${appointment.id}`,
      createdAt: new Date().toISOString(),
    });

    db.logAudit({
      salonId: params.salonId,
      userId: params.bookedBy?.id || params.customerId,
      userEmail: params.bookedBy?.email || customerEmail,
      action: 'APPOINTMENT_BOOKED',
      entity: 'appointments',
      entityId: appointment.id,
      metadata: { service: serviceName, date: appointmentDate, price: price, staff: targetStaffName },
    });

    return appointment;
  }

  /**
   * Reschedule appointment with live validation
   */
  public static rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newStartTime: string,
    newStaffIdOrUser?: string | User,
    userOrReason?: User | string,
    reason?: string
  ): Appointment {
    let newStaffId: string | undefined = undefined;
    let user: User | undefined = undefined;
    let actualReason = reason;

    if (typeof newStaffIdOrUser === 'string') {
      newStaffId = newStaffIdOrUser;
      if (typeof userOrReason === 'object') {
        user = userOrReason as User;
      } else if (typeof userOrReason === 'string') {
        actualReason = userOrReason;
      }
    } else if (typeof newStaffIdOrUser === 'object' && newStaffIdOrUser !== null) {
      user = newStaffIdOrUser as User;
      if (typeof userOrReason === 'string') {
        actualReason = userOrReason;
      }
    }

    return db.rescheduleAppointment(
      appointmentId,
      newDate,
      newStartTime,
      newStaffId,
      user?.id,
      user?.fullName
    );
  }

  /**
   * Cancel appointment with salon cancellation window policy checks
   */
  public static cancelAppointment(
    appointmentId: string,
    userOrReason: User | string,
    reasonOrUser: string | User
  ): Appointment {
    let user: User;
    let reason: string;

    if (typeof userOrReason === 'string') {
      reason = userOrReason;
      user = reasonOrUser as User;
    } else {
      user = userOrReason;
      reason = reasonOrUser as string;
    }

    return db.cancelAppointmentWithPolicy(
      appointmentId,
      user.id,
      user.fullName,
      reason
    );
  }

  /**
   * Transition appointment status with strict validation & audit logging
   */
  public static updateStatus(
    appointmentId: string,
    toStatus: AppointmentStatus,
    user: User,
    reason?: string
  ): Appointment {
    const updated = db.transitionAppointmentStatus(
      appointmentId,
      toStatus,
      user.id,
      user.fullName,
      reason
    );

    // Notify customer
    db.createNotification({
      id: `notif-${Date.now()}`,
      userId: updated.customerId,
      salonId: updated.salonId,
      title: `Appointment ${toStatus.replace('_', ' ').toUpperCase()}`,
      message: `Your appointment for ${updated.serviceName} is now ${toStatus.replace('_', ' ')}.`,
      type: 'appointment',
      isRead: false,
      link: `/customer/bookings/${updated.id}`,
      createdAt: new Date().toISOString(),
    });

    db.logAudit({
      salonId: updated.salonId,
      userId: user.id,
      userEmail: user.email,
      action: `APPOINTMENT_STATUS_${toStatus.toUpperCase()}`,
      entity: 'appointments',
      entityId: appointmentId,
      metadata: { newStatus: toStatus, reason },
    });

    return updated;
  }

  public static getAppointmentsForSalon(salonId: string, statusFilter?: AppointmentStatus): Appointment[] {
    const list = db.getAppointmentsBySalon(salonId);
    if (statusFilter) {
      return list.filter(a => a.status === statusFilter);
    }
    return list;
  }

  public static getAppointmentsForCustomer(customerId: string): Appointment[] {
    return db.getAppointmentsByCustomer(customerId);
  }

  public static getAppointmentsForStaff(staffProfileId: string): Appointment[] {
    return db.getAppointmentsByStaff(staffProfileId);
  }
}

export const appointmentService = {
  bookAppointment: AppointmentService.bookAppointment,
  rescheduleAppointment: AppointmentService.rescheduleAppointment,
  cancelAppointment: AppointmentService.cancelAppointment,
  updateStatus: AppointmentService.updateStatus,
  transitionStatus: (
    appointmentId: string, 
    toStatus: AppointmentStatus, 
    userOrId: any, 
    userNameOrReason?: string, 
    reason?: string
  ) => {
    const userObj = typeof userOrId === 'string' 
      ? { id: userOrId, email: '', fullName: userNameOrReason || 'Staff' } as any
      : userOrId;
    const actualReason = typeof userOrId === 'string' ? reason : userNameOrReason;
    return AppointmentService.updateStatus(appointmentId, toStatus, userObj, actualReason);
  },
  getSalonAppointments: AppointmentService.getAppointmentsForSalon,
  getAppointmentsForSalon: AppointmentService.getAppointmentsForSalon,
  getCustomerAppointments: AppointmentService.getAppointmentsForCustomer,
  getAppointmentsForCustomer: AppointmentService.getAppointmentsForCustomer,
  getStaffAppointments: AppointmentService.getAppointmentsForStaff,
  getAppointmentsForStaff: AppointmentService.getAppointmentsForStaff,
};
