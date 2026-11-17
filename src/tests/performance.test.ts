import { describe, it, expect } from 'vitest';
import { db } from '../database/db';
import { AvailabilityService } from '../services/availabilityService';
import { AppointmentService } from '../services/appointmentService';

describe('Glamouré Performance & Concurrency Load Test Suite', () => {
  it('should execute 50 concurrent slot availability checks in under 500ms', async () => {
    const startTime = performance.now();
    const queries = [];

    for (let i = 0; i < 50; i++) {
      queries.push(
        AvailabilityService.getAvailableSlots({
          salonId: 'salon-glamoure-jubilee',
          serviceId: 'srv-precision-cut',
          date: '2026-11-20',
          staffId: 'staff-marcus',
          durationMinutes: 60,
        })
      );
    }

    const results = await Promise.all(queries);
    const duration = performance.now() - startTime;

    expect(results).toHaveLength(50);
    expect(results[0].length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(500); // Strict latency budget: < 500ms for 50 concurrent checks
  });

  it('should prevent race condition double-booking when two concurrent requests target identical slot', async () => {
    const targetDate = `2026-12-18`; // Friday (Marcus is scheduled)
    const targetTime = '11:00';
    const staffId = 'staff-marcus';
    const salonId = 'salon-glamoure-jubilee';
    const serviceId = 'srv-precision-cut';

    // Fire 2 simultaneous booking attempts for the exact same staff, date, and time
    const [resultA, resultB] = await Promise.allSettled([
      (async () => AppointmentService.bookAppointment({
        salonId,
        serviceId,
        staffId,
        customerId: 'user-customer-sophia',
        date: targetDate,
        startTime: targetTime,
        status: 'confirmed',
      }))(),
      (async () => AppointmentService.bookAppointment({
        salonId,
        serviceId,
        staffId,
        customerId: 'user-customer-priya',
        date: targetDate,
        startTime: targetTime,
        status: 'confirmed',
      }))(),
    ]);

    // Invariant: Exactly ONE appointment must succeed, and the other must be rejected
    const succeeded = [resultA, resultB].filter(r => r.status === 'fulfilled');
    const rejected = [resultA, resultB].filter(r => r.status === 'rejected');

    expect(succeeded).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    if (rejected[0].status === 'rejected') {
      expect(rejected[0].reason.message).toMatch(/conflict|unavailable|booked|overlap/i);
    }
  });

  it('should efficiently fetch salon dashboard data without N+1 query overhead', () => {
    const startTime = performance.now();
    const salonId = 'salon-glamoure-jubilee';

    // Fetch complete aggregate salon dataset
    const salon = db.getSalonById(salonId);
    const appointments = db.getAppointmentsBySalon(salonId);
    const staff = db.getStaffBySalon(salonId);
    const services = db.getServicesBySalon(salonId);
    const reviews = db.getReviewsBySalon(salonId);
    const queue = db.getQueueBySalon(salonId);
    const duration = performance.now() - startTime;

    expect(salon).toBeDefined();
    expect(appointments.length).toBeGreaterThan(0);
    expect(staff.length).toBeGreaterThan(0);
    expect(services.length).toBeGreaterThan(0);
    expect(reviews.length).toBeGreaterThan(0);
    expect(queue.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(50); // Direct memory hash/array lookup in < 50ms
  });
});
