import { describe, it, expect } from 'vitest';
import { AppointmentService } from '../services/appointmentService';
import { db, VALID_STATUS_TRANSITIONS } from '../database/db';
import type { User } from '../types/auth';

describe('Glamouré Shared Appointment Lifecycle Engine', () => {
  const salonId = 'salon-glamoure-jubilee';
  const staffId = 'staff-aria';
  const customerId = 'user-customer-sophia';

  const mockUser: User = {
    id: 'user-owner-elena',
    email: 'elena@glamoure.com',
    fullName: 'Elena Vance',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should book a valid appointment and initialize status to pending', () => {
    const apt = AppointmentService.bookAppointment({
      salonId,
      customerId,
      customerName: 'Sophia Reynolds',
      customerEmail: 'sophia@example.com',
      staffId,
      staffName: 'Aria Chen',
      serviceId: 'srv-balayage',
      serviceName: 'Bespoke Balayage',
      appointmentDate: '2026-12-01',
      startTime: '10:00',
      durationMinutes: 90,
      price: 6500,
      bookedBy: mockUser,
    });

    expect(apt).toBeDefined();
    expect(apt.id).toBeDefined();
    expect(apt.status).toBe('pending');
    expect(apt.endTime).toBe('11:30');

    // Immutable history log must exist
    const history = db.getAppointmentHistory(apt.id);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].toStatus).toBe('pending');
  });

  it('should reject booking when stylist has an overlapping schedule conflict', () => {
    // Already booked 10:00 to 11:30 on 2026-12-01
    expect(() => {
      AppointmentService.bookAppointment({
        salonId,
        customerId: 'user-another-client',
        customerName: 'Victoria Sterling',
        customerEmail: 'victoria@example.com',
        staffId,
        staffName: 'Aria Chen',
        serviceId: 'srv-cut',
        serviceName: 'Precision Cut',
        appointmentDate: '2026-12-01',
        startTime: '10:30', // Overlaps with 10:00 - 11:30!
        durationMinutes: 60,
        price: 3200,
        bookedBy: mockUser,
      });
    }).toThrow(/already booked for overlapping time/);
  });

  it('should allow booking for a non-overlapping slot on the same day', () => {
    const nonOverlappingApt = AppointmentService.bookAppointment({
      salonId,
      customerId: 'user-another-client',
      customerName: 'Victoria Sterling',
      customerEmail: 'victoria@example.com',
      staffId,
      staffName: 'Aria Chen',
      serviceId: 'srv-cut',
      serviceName: 'Precision Cut',
      appointmentDate: '2026-12-01',
      startTime: '12:00', // Safe non-overlapping window
      durationMinutes: 60,
      price: 3200,
      bookedBy: mockUser,
    });

    expect(nonOverlappingApt).toBeDefined();
    expect(nonOverlappingApt.status).toBe('pending');
  });

  it('should progress smoothly through valid lifecycle transitions: pending -> confirmed -> checked_in -> in_progress -> completed', () => {
    const apt = AppointmentService.bookAppointment({
      salonId,
      customerId,
      customerName: 'Sophia Reynolds',
      customerEmail: 'sophia@example.com',
      staffId,
      staffName: 'Aria Chen',
      serviceId: 'srv-balayage',
      serviceName: 'Bespoke Balayage',
      appointmentDate: '2026-12-02',
      startTime: '14:00',
      durationMinutes: 60,
      price: 5000,
      bookedBy: mockUser,
    });

    expect(apt.status).toBe('pending');

    // 1. Confirm
    const confirmed = AppointmentService.updateStatus(apt.id, 'confirmed', mockUser, 'Deposit secured');
    expect(confirmed.status).toBe('confirmed');

    // 2. Check In
    const checkedIn = AppointmentService.updateStatus(apt.id, 'checked_in', mockUser, 'Client seated in lounge');
    expect(checkedIn.status).toBe('checked_in');

    // 3. In Progress
    const inProgress = AppointmentService.updateStatus(apt.id, 'in_progress', mockUser, 'Service started at bay 2');
    expect(inProgress.status).toBe('in_progress');

    // 4. Completed
    const completed = AppointmentService.updateStatus(apt.id, 'completed', mockUser, 'Ritual finished and blown out');
    expect(completed.status).toBe('completed');

    // Verify complete audit history trail
    const auditTrail = db.getAppointmentHistory(apt.id);
    expect(auditTrail.length).toBe(5); // initial + 4 transitions
    expect(auditTrail.map(h => h.toStatus)).toEqual(['pending', 'confirmed', 'checked_in', 'in_progress', 'completed']);
  });

  it('should strictly reject invalid lifecycle status transitions', () => {
    const apt = AppointmentService.bookAppointment({
      salonId,
      customerId,
      customerName: 'Sophia Reynolds',
      customerEmail: 'sophia@example.com',
      staffId,
      staffName: 'Aria Chen',
      serviceId: 'srv-balayage',
      serviceName: 'Bespoke Balayage',
      appointmentDate: '2026-12-03',
      startTime: '09:00',
      durationMinutes: 60,
      price: 5000,
      bookedBy: mockUser,
    });

    // Cannot jump directly from 'pending' to 'completed'
    expect(() => {
      AppointmentService.updateStatus(apt.id, 'completed', mockUser);
    }).toThrow(/Cannot transition appointment from 'pending' to 'completed'/);

    // Cannot jump from 'pending' to 'in_progress'
    expect(() => {
      AppointmentService.updateStatus(apt.id, 'in_progress', mockUser);
    }).toThrow(/Cannot transition appointment from 'pending' to 'in_progress'/);

    // Confirm then test terminal state restrictions
    AppointmentService.updateStatus(apt.id, 'confirmed', mockUser);
    AppointmentService.updateStatus(apt.id, 'checked_in', mockUser);
    AppointmentService.updateStatus(apt.id, 'in_progress', mockUser);
    const completedApt = AppointmentService.updateStatus(apt.id, 'completed', mockUser);

    // 'completed' is terminal: cannot transition back to 'in_progress' or 'pending'
    expect(() => {
      AppointmentService.updateStatus(completedApt.id, 'in_progress', mockUser);
    }).toThrow(/Cannot transition appointment from 'completed'/);
  });

  it('should support cancellation with reason and record in audit log', () => {
    const apt = AppointmentService.bookAppointment({
      salonId,
      customerId,
      customerName: 'Sophia Reynolds',
      customerEmail: 'sophia@example.com',
      staffId,
      staffName: 'Aria Chen',
      serviceId: 'srv-balayage',
      serviceName: 'Bespoke Balayage',
      appointmentDate: '2026-12-04',
      startTime: '15:00',
      durationMinutes: 60,
      price: 5000,
      bookedBy: mockUser,
    });

    const cancelled = AppointmentService.updateStatus(apt.id, 'cancelled', mockUser, 'Client requested schedule postponement');
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.cancellationReason).toBe('Client requested schedule postponement');

    // Terminal check: cannot resurrect cancelled appointment
    expect(() => {
      AppointmentService.updateStatus(cancelled.id, 'confirmed', mockUser);
    }).toThrow(/Cannot transition appointment from 'cancelled'/);
  });
});
