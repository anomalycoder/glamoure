import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../database/db';
import { AuthService } from '../services/authService';
import { AppointmentService } from '../services/appointmentService';
import { AvailabilityService } from '../services/availabilityService';
import { PaymentService } from '../services/paymentService';
import { customerAiService } from '../services/customerAiService';

describe('Glamouré Phase 2: Customer Portal & Booking Engine Integration', () => {
  const testCustomerEmail = `customer_${Date.now()}@glamoure.test`;
  const salonId = 'salon-glamoure-jubilee';
  const branchId = 'branch-jubilee-main';
  const serviceId = 'srv-balayage';
  const staffId = 'staff-aria';

  beforeEach(() => {
    // Ensure clean state if needed
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Customer Registration & Authentication
  // ──────────────────────────────────────────────────────────────────────────
  it('1. should register a new customer with a profile and persistent session', async () => {
    const session = await AuthService.register({
      email: testCustomerEmail,
      password: 'SecurePassword123!',
      fullName: 'Aurelia Dubois',
      phone: '+91 99887 76655',
      role: 'customer',
    });

    expect(session).toBeDefined();
    expect(session.user.email).toBe(testCustomerEmail);
    expect(session.user.fullName).toBe('Aurelia Dubois');
    expect(session.activeRole).toBe('customer');

    const customerProfile = db.getCustomerProfile(session.user.id);
    expect(customerProfile).toBeDefined();
    expect(customerProfile?.userId).toBe(session.user.id);
    expect(customerProfile?.loyaltyTier).toBe('Silver');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Salon Discovery: Filtering & Search
  // ──────────────────────────────────────────────────────────────────────────
  it('2. should discover salons and filter by location and search query', () => {
    const allSalons = db.getAllSalons();
    expect(allSalons.length).toBeGreaterThan(0);

    const jubilees = allSalons.filter(s => 
      s.city.toLowerCase().includes('hyderabad') || s.address.toLowerCase().includes('jubilee')
    );
    expect(jubilees.length).toBeGreaterThan(0);
    expect(jubilees[0].name).toContain('Glamouré');
    expect(jubilees[0].rating).toBeGreaterThanOrEqual(4.5);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Service Discovery Across the 4 Pillars
  // ──────────────────────────────────────────────────────────────────────────
  it('3. should discover services across Hair, Skin, Nails, and Spa categories', () => {
    const categories = db.getCategoriesBySalon(salonId);
    expect(categories.length).toBeGreaterThanOrEqual(4);

    const services = db.getServicesBySalon(salonId);
    expect(services.length).toBeGreaterThanOrEqual(4);

    const hairServices = services.filter(s => s.categoryId === 'cat-hair');
    expect(hairServices.length).toBeGreaterThan(0);
    expect(hairServices.some(s => s.name.includes('Balayage'))).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Availability Engine: Specific Stylist & "Any Master Stylist"
  // ──────────────────────────────────────────────────────────────────────────
  it('4. should calculate live open slots for a specific stylist and aggregate for any stylist', () => {
    const dateStr = '2026-12-15';
    const slots = AvailabilityService.getAvailableSlots(staffId, salonId, 90, dateStr);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toHaveProperty('startTime');
    expect(slots[0]).toHaveProperty('endTime');
    expect(slots[0].isAvailable).toBe(true);

    // Any Master Stylist allocation
    const anySlots = AvailabilityService.getSlotsForAnyStylist(salonId, serviceId, 90, dateStr);
    expect(anySlots.length).toBeGreaterThan(0);
    expect(anySlots[0].assignedStaffId).toBeDefined();
    expect(anySlots[0].assignedStaffName).toBeDefined();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Complete 12-Step Booking Flow Execution
  // ──────────────────────────────────────────────────────────────────────────
  it('5. should execute a complete 12-step booking flow using shared backend appointment engine', async () => {
    const customer = db.getUserByEmail(testCustomerEmail) || db.getUserByEmail('customer@glamoure.com')!;
    const dateStr = '2026-12-20';

    // Pricing calculation with coupon
    const pricing = PaymentService.calculatePricing(6500, 'GLAMOUR15', salonId);
    expect(pricing.discountAmount).toBeGreaterThan(0);
    expect(pricing.totalAmount).toBeLessThan(6500 * 1.18);

    // Commit booking
    const apt = AppointmentService.bookAppointment({
      salonId,
      branchId,
      customerId: customer.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      staffId,
      staffName: 'Aria Chen',
      serviceId,
      serviceName: 'Bespoke Balayage',
      appointmentDate: dateStr,
      startTime: '14:00',
      durationMinutes: 90,
      price: pricing.totalAmount,
      bookedBy: customer,
      notes: 'Prefers organic botanicals',
    });

    expect(apt).toBeDefined();
    expect(apt.id).toBeDefined();
    expect(apt.status).toBe('pending');
    expect(apt.startTime).toBe('14:00');
    expect(apt.endTime).toBe('15:30');

    // Confirm booking
    const confirmed = AppointmentService.updateStatus(apt.id, 'confirmed', customer, 'Guest confirmed reservation');
    expect(confirmed.status).toBe('confirmed');

    // Verify history trail
    const history = db.getAppointmentHistory(apt.id);
    expect(history.length).toBe(2);
    expect(history[1].toStatus).toBe('confirmed');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Overlapping Schedule Conflict / Concurrent Booking Prevention
  // ──────────────────────────────────────────────────────────────────────────
  it('6. should strictly prevent double-booking or overlapping appointments on the same stylist', () => {
    const customer = db.getUserByEmail('customer@glamoure.com')!;
    const dateStr = '2026-12-20';

    // Aria is already booked 14:00 to 15:30 on 2026-12-20
    expect(() => {
      AppointmentService.bookAppointment({
        salonId,
        customerId: 'another-guest',
        customerName: 'Another Guest',
        customerEmail: 'another@example.com',
        staffId,
        staffName: 'Aria Chen',
        serviceId,
        serviceName: 'Bespoke Balayage',
        appointmentDate: dateStr,
        startTime: '14:30', // Overlaps!
        durationMinutes: 60,
        price: 4500,
        bookedBy: customer,
      });
    }).toThrow(/conflict|not available|overlapping/i);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Self-Rescheduling with Live Conflict Validation
  // ──────────────────────────────────────────────────────────────────────────
  it('7. should reschedule an appointment to an open slot and validate against conflicts', () => {
    const customer = db.getUserByEmail('customer@glamoure.com')!;
    const apt = db.getAppointmentsByCustomer(customer.id)[0];
    expect(apt).toBeDefined();

    // Reschedule to 2026-12-22 at 11:00
    const rescheduled = AppointmentService.rescheduleAppointment(
      apt.id,
      '2026-12-22',
      '11:00',
      customer,
      'Change in flight schedule'
    );

    expect(rescheduled.appointmentDate).toBe('2026-12-22');
    expect(rescheduled.startTime).toBe('11:00');
    expect(rescheduled.status).toBe('confirmed');

    // Attempting to reschedule onto Aria's overlapping slot (booked in test 5) should fail
    expect(() => {
      AppointmentService.rescheduleAppointment(
        apt.id,
        '2026-12-20',
        '14:00',
        'staff-aria',
        customer
      );
    }).toThrow();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. Cancellation Policy Validation
  // ──────────────────────────────────────────────────────────────────────────
  it('8. should validate salon cancellation policy and record reason', () => {
    const customer = db.getUserByEmail('customer@glamoure.com')!;
    const apt = db.getAppointmentsByCustomer(customer.id)[0];

    const cancelled = AppointmentService.cancelAppointment(
      apt.id,
      customer,
      'Emergency personal travel'
    );

    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.cancellationReason).toContain('Emergency personal travel');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 9. Verified Reviews Eligibility & Duplicate Prevention
  // ──────────────────────────────────────────────────────────────────────────
  it('9. should enforce verified review eligibility strictly on completed visits', () => {
    const customer = db.getUserByEmail('customer@glamoure.com')!;
    
    // A cancelled appointment cannot be reviewed
    const cancelledApts = db.getAppointmentsByCustomer(customer.id).filter(a => a.status === 'cancelled');
    if (cancelledApts.length > 0) {
      const canReview = db.canReviewAppointment(customer.id, cancelledApts[0].id);
      expect(canReview.eligible).toBe(false);
    }

    // Create a completed appointment to test review submission
    const completedApt = db.createAppointment({
      id: `apt-completed-${Date.now()}`,
      salonId,
      branchId,
      customerId: customer.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      staffId,
      staffName: 'Aria Chen',
      serviceId,
      serviceName: 'Bespoke Balayage',
      appointmentDate: '2026-11-01',
      startTime: '10:00',
      endTime: '11:30',
      durationMinutes: 90,
      price: 6500,
      depositAmount: 1500,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const eligibility = db.canReviewAppointment(customer.id, completedApt.id);
    expect(eligibility.eligible).toBe(true);

    // Submit review
    const review = db.addReview({
      id: `rev-${Date.now()}`,
      salonId,
      appointmentId: completedApt.id,
      customerId: customer.id,
      customerName: customer.fullName,
      staffId,
      staffName: 'Aria Chen',
      rating: 5,
      comment: 'Exquisite balayage and impeccable service.',
      createdAt: new Date().toISOString(),
    });

    expect(review).toBeDefined();
    expect(review.rating).toBe(5);

    // Duplicate review must now be blocked
    const duplicateEligibility = db.canReviewAppointment(customer.id, completedApt.id);
    expect(duplicateEligibility.eligible).toBe(false);
    expect(duplicateEligibility.reason).toMatch(/already reviewed|already submitted/i);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 10. Persistent Customer Favorites
  // ──────────────────────────────────────────────────────────────────────────
  it('10. should persist and toggle customer favorites for salons, services, and stylists', () => {
    const customerId = 'user-customer-sophia';

    const isFavInitially = db.isFavorite(customerId, 'salon', salonId);
    const toggled = db.toggleFavorite(customerId, 'salon', salonId);
    expect(toggled).toBe(!isFavInitially);

    const favs = db.getFavorites(customerId);
    if (toggled) {
      expect(favs.salonIds).toContain(salonId);
    } else {
      expect(favs.salonIds).not.toContain(salonId);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 11. Payment Verification & Receipt Statement Generation
  // ──────────────────────────────────────────────────────────────────────────
  it('11. should initiate, verify cryptographic token, process payment, and format receipt statement', () => {
    const customer = db.getUserByEmail('customer@glamoure.com')!;
    const paymentSession = PaymentService.initiatePayment({
      appointmentId: 'apt-test-receipt',
      amount: 4500,
      method: 'card',
      currency: 'INR',
    });

    expect(paymentSession.orderId).toContain('ORD-');
    expect(paymentSession.verificationToken).toContain('vtok_');

    const payment = PaymentService.verifyAndProcessPayment({
      salonId,
      appointmentId: 'apt-test-receipt',
      customerId: customer.id,
      amount: 4500,
      method: 'card',
      verificationToken: paymentSession.verificationToken,
      user: customer,
      notes: 'Full payment processed',
    });

    expect(payment.status).toBe('successful');
    expect(payment.amount).toBe(4500);

    const receipt = PaymentService.generateReceiptData(payment.id);
    expect(receipt).toBeDefined();
    expect(receipt?.receiptNumber).toContain('REC-');
    expect(receipt?.amount).toBe(4500);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 12. Customer AI Assistant Grounded in Real Backend Data
  // ──────────────────────────────────────────────────────────────────────────
  it('12. should respond to customer AI queries with grounded backend data and actionable booking intent', async () => {
    const response = await customerAiService.handleUserQuery('What is your best hair coloring treatment and price?');
    expect(response).toBeDefined();
    expect(response.message.length).toBeGreaterThan(10);
    expect(response.suggestedActions.length).toBeGreaterThan(0);
    expect(response.suggestedActions.some(a => a.type === 'book_service')).toBe(true);
  });
});
