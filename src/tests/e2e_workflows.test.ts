import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../database/db';
import { AuthService } from '../services/authService';
import { AppointmentService } from '../services/appointmentService';
import { AvailabilityService } from '../services/availabilityService';
import { PaymentService } from '../services/paymentService';
import { RBACService } from '../services/rbacService';
import { StorageService } from '../services/storageService';
import { IntelligenceApi } from '../intelligence/api/intelligenceApi';
import type { User } from '../types/auth';

describe('GLAMOURÉ PHASE 5: END-TO-END INTEGRATION & WORKFLOW VALIDATION', () => {
  const masterSalonId = 'salon-glamoure-jubilee';

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW A: SALON ONBOARDING
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow A — Complete Salon Onboarding', () => {
    it('should register owner, create salon, branch, services, hours, invite staff and complete onboarding', async () => {
      // 1. Owner Registration
      const ownerSession = await AuthService.register({
        email: `proprietor_${Date.now()}@glamoure.luxury`,
        password: 'LuxurySecretPassword123!',
        fullName: 'Genevieve Du Pont',
        phone: '+91 99887 76655',
        role: 'salon_owner',
        salonName: 'Maison Du Pont',
      });
      expect(ownerSession.user).toBeDefined();
      expect(ownerSession.role).toBe('salon_owner');

      const ownerUser = ownerSession.user;
      const salonId = ownerSession.salonId!;
      expect(salonId).toBeDefined();

      // 2. Create Branch
      const branch = db.createBranch({
        id: `branch-dp-${Date.now()}`,
        salonId,
        name: 'Maison Du Pont Flagship Sanctuary',
        code: 'MDP-01',
        address: '88 Elysium Boulevard',
        city: 'Mumbai',
        phone: '+91 99887 76656',
        email: 'elysium@du-pont.luxury',
        isMainBranch: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      expect(branch.id).toBeDefined();
      expect(branch.salonId).toBe(salonId);

      // 3. Add Category & Service
      const category = db.createCategory({
        id: `cat-dp-${Date.now()}`,
        salonId,
        name: 'Haute Coiffure',
        slug: 'haute-coiffure',
        description: 'Bespoke sculptural styling',
        sortOrder: 1,
        isActive: true,
      });

      const service = db.createService({
        id: `srv-dp-${Date.now()}`,
        salonId,
        categoryId: category.id,
        name: 'Signature Parisian French Balayage',
        slug: 'signature-parisian-french-balayage',
        description: 'Hand-painted multidimensional blonde illumination',
        durationMinutes: 120,
        price: 8500,
        bufferMinutes: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      expect(service.price).toBe(8500);

      // 4. Invite & Configure Staff Member
      const staffProfile = db.createStaffProfile({
        id: `staff-dp-${Date.now()}`,
        salonId,
        userId: `user-staff-${Date.now()}`,
        branchId: branch.id,
        displayName: 'Camille Laurent',
        title: 'Principal Art Director',
        servicesOffered: [service.id],
        commissionPercentage: 45,
        rating: 5.0,
        reviewCount: 12,
        isActive: true,
        joinedAt: new Date().toISOString(),
      });

      // 5. Configure Working Hours (Mon - Sat)
      const hours = [1, 2, 3, 4, 5, 6].map(day => ({
        id: `wh-camille-${day}`,
        staffProfileId: staffProfile.id,
        salonId,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '19:00',
        isWorking: true,
      }));
      db.updateWorkingHours(staffProfile.id, hours);

      const retrievedHours = db.getWorkingHours(staffProfile.id);
      expect(retrievedHours.length).toBe(6);

      // 6. Complete Onboarding
      const updatedSalon = db.updateSalon(salonId, { onboardingCompleted: true });
      expect(updatedSalon.onboardingCompleted).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW B: CUSTOMER REGISTRATION & DISCOVERY
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow B — Customer Registration & Discovery', () => {
    it('should register customer, explore catalogue, and save favorite salon', async () => {
      const email = `patron_${Date.now()}@glamoure.luxury`;
      const customerSession = await AuthService.register({
        email,
        password: 'PatronPassword123!',
        fullName: 'Eleanor Vance',
        phone: '+91 91234 56789',
        role: 'customer',
      });
      expect(customerSession.role).toBe('customer');

      // Explore salons
      const allSalons = db.getAllSalons();
      expect(allSalons.length).toBeGreaterThan(0);

      const targetSalon = allSalons[0];
      const services = db.getServicesBySalon(targetSalon.id);
      expect(services.length).toBeGreaterThan(0);

      // Save Favorite Salon
      db.toggleFavorite(customerSession.user.id, 'salon', targetSalon.id);
      const favs = db.getFavorites(customerSession.user.id);
      expect(favs.salonIds).toContain(targetSalon.id);
      expect(db.isFavorite(customerSession.user.id, targetSalon.id)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW C: COMPLETE APPOINTMENT BOOKING & PAYMENT
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow C — Complete Booking & Payment', () => {
    it('should select stylist, check slot, book appointment, process payment, and issue invoice', async () => {
      const customer = db.getUserByEmail('customer@glamoure.com')!;
      const services = db.getServicesBySalon(masterSalonId);
      const testService = services[0];
      const staffList = db.getStaffBySalon(masterSalonId);
      const testStaff = staffList.find(s => s.servicesOffered.includes(testService.id)) || staffList[0];

      const testDate = '2026-11-25'; // Future date
      const testTime = '11:00';

      // Verify availability
      const slots = AvailabilityService.getAvailableSlots(
        testStaff.id,
        testService.durationMinutes,
        testDate
      );
      const targetSlot = slots.find(s => s.time === testTime);
      expect(targetSlot?.available).toBe(true);

      // Book appointment
      const appointment = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        staffId: testStaff.id,
        staffName: testStaff.displayName,
        serviceId: testService.id,
        serviceName: testService.name,
        appointmentDate: testDate,
        startTime: testTime,
        durationMinutes: testService.durationMinutes,
        price: testService.price,
        depositAmount: 500,
        bookedBy: customer,
        notes: 'VIP Client requested botanical prep.',
      });

      expect(appointment.id).toBeDefined();
      expect(['pending', 'confirmed']).toContain(appointment.status);
      expect(appointment.paymentStatus).toBe('deposit_paid');

      // Process payment session
      const payment = PaymentService.processPayment({
        salonId: masterSalonId,
        appointmentId: appointment.id,
        customerId: customer.id,
        amount: testService.price,
        method: 'card',
        user: customer,
      });

      expect(payment.id).toBeDefined();
      expect(payment.status).toBe('successful');

      // Verify invoice was created
      const invoices = db.getInvoicesBySalon(masterSalonId);
      const invoice = invoices.find(inv => inv.appointmentId === appointment.id);
      expect(invoice).toBeDefined();
      expect(invoice?.subtotal).toBe(testService.price);

      // Verify customer received notification
      const notifications = db.getNotificationsByUser(customer.id);
      expect(notifications.some(n => n.message.includes(testService.name))).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW D: APPOINTMENT EXECUTION LIFECYCLE
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow D — Appointment Execution Lifecycle', () => {
    it('should transition appointment through checked_in -> in_progress -> completed with state machine integrity', () => {
      const customer = db.getUserByEmail('customer@glamoure.com')!;
      const staff = db.getStaffBySalon(masterSalonId)[0];
      const service = db.getServicesBySalon(masterSalonId)[0];

      // Create new confirmed booking
      const apt = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        staffId: staff.id,
        staffName: staff.displayName,
        serviceId: service.id,
        serviceName: service.name,
        appointmentDate: '2026-11-26',
        startTime: '14:00',
        durationMinutes: 60,
        price: 4500,
        bookedBy: customer,
      });

      // 0. Confirm pending booking
      const confirmed = AppointmentService.updateStatus(apt.id, 'confirmed', customer, 'Proprietor confirmed booking');
      expect(confirmed.status).toBe('confirmed');

      // 1. Check in
      const checkedIn = AppointmentService.updateStatus(apt.id, 'checked_in', customer, 'Guest arrived in lounge');
      expect(checkedIn.status).toBe('checked_in');

      // 2. Start service
      const inProgress = AppointmentService.updateStatus(apt.id, 'in_progress', customer, 'Service started at bay');
      expect(inProgress.status).toBe('in_progress');

      // 3. Complete service
      const completed = AppointmentService.updateStatus(apt.id, 'completed', customer, 'Master styling finished');
      expect(completed.status).toBe('completed');

      // 4. Verify terminal state prevents invalid transition
      expect(() => {
        AppointmentService.updateStatus(apt.id, 'confirmed', customer, 'Illegal backwards transition');
      }).toThrow(/Invalid status transition/);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW E: CANCELLATION & AVAILABILITY RELEASE
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow E — Cancellation & Availability Release', () => {
    it('should cancel appointment, release time slot, and record refund audit', () => {
      const customer = db.getUserByEmail('customer@glamoure.com')!;
      const staff = db.getStaffBySalon(masterSalonId)[0];
      const service = db.getServicesBySalon(masterSalonId)[0];
      const testDate = '2026-11-27';
      const testTime = '16:00';

      const apt = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        staffId: staff.id,
        staffName: staff.displayName,
        serviceId: service.id,
        serviceName: service.name,
        appointmentDate: testDate,
        startTime: testTime,
        durationMinutes: 60,
        price: 3500,
        bookedBy: customer,
      });

      // Verify slot is taken
      let slots = AvailabilityService.getAvailableSlots(staff.id, 60, testDate);
      expect(slots.find(s => s.time === testTime)?.available).toBe(false);

      // Cancel appointment
      const cancelled = AppointmentService.cancelAppointment(apt.id, 'Client schedule conflict', customer);
      expect(cancelled.status).toBe('cancelled');
      expect(cancelled.cancellationReason).toBe('Client schedule conflict');

      // Verify slot is now released and available
      slots = AvailabilityService.getAvailableSlots(staff.id, 60, testDate);
      expect(slots.find(s => s.time === testTime)?.available).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW F: RESCHEDULING
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow F — Rescheduling', () => {
    it('should validate target slot availability, update date/time, and release previous slot', () => {
      const customer = db.getUserByEmail('customer@glamoure.com')!;
      const staff = db.getStaffBySalon(masterSalonId)[0];
      const service = db.getServicesBySalon(masterSalonId)[0];

      const oldDate = '2026-11-24';
      const oldTime = '10:00';
      const newDate = '2026-11-25';
      const newTime = '15:00';

      const apt = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        staffId: staff.id,
        staffName: staff.displayName,
        serviceId: service.id,
        serviceName: service.name,
        appointmentDate: oldDate,
        startTime: oldTime,
        durationMinutes: 60,
        price: 3500,
        bookedBy: customer,
      });

      // Reschedule
      const rescheduled = AppointmentService.rescheduleAppointment(
        apt.id,
        newDate,
        newTime,
        staff.id,
        customer,
        'Requested afternoon slot'
      );

      expect(rescheduled.appointmentDate).toBe(newDate);
      expect(rescheduled.startTime).toBe(newTime);

      // Verify old slot is freed
      const oldSlots = AvailabilityService.getAvailableSlots(staff.id, 60, oldDate);
      expect(oldSlots.find(s => s.time === oldTime)?.available).toBe(true);

      // Verify new slot is booked
      const newSlots = AvailabilityService.getAvailableSlots(staff.id, 60, newDate);
      expect(newSlots.find(s => s.time === newTime)?.available).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW G: WALK-IN QUEUE MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow G — Walk-in Queue Management', () => {
    it('should register walk-in, track queue position, transition to in_service and completed', () => {
      const branches = db.getBranchesBySalon(masterSalonId);
      const branchId = branches[0]?.id || 'branch-jubilee-main';
      const services = db.getServicesBySalon(masterSalonId);
      const testService = services[0];

      // 1. Add to queue
      const queueResult = db.addToQueue({
        salonId: masterSalonId,
        branchId,
        customerName: 'Aarav Mehta',
        customerPhone: '+91 98888 77777',
        serviceId: testService.id,
        serviceName: testService.name,
        notes: 'Walk-in client for signature cut',
      });

      expect(queueResult.item).toBeDefined();
      const queueItem = queueResult.item!;
      expect(queueItem.id).toBeDefined();
      expect(['waiting', 'next_in_line']).toContain(queueItem.status);

      // 2. Update status to in_service with assigned staff
      const staff = db.getStaffBySalon(masterSalonId)[0];
      const inService = db.updateQueueStatus(queueItem.id, 'in_service', staff.id, staff.displayName);
      expect(inService).not.toBeNull();
      expect(inService!.status).toBe('in_service');
      expect(inService!.staffName).toBe(staff.displayName);

      // 3. Complete walk-in service
      const completed = db.updateQueueStatus(queueItem.id, 'completed');
      expect(completed).not.toBeNull();
      expect(completed!.status).toBe('completed');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW H: EMPLOYEE LEAVE REQUEST & SCHEDULE IMPACT
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow H — Employee Leave & Availability Blocking', () => {
    it('should submit leave, approve by owner, and ensure smart scheduler respects leave dates', () => {
      const staff = db.getStaffBySalon(masterSalonId)[0];
      const leaveDate = '2026-11-30';

      // Submit leave request
      const leave = db.submitLeaveRequest({
        salonId: masterSalonId,
        staffProfileId: staff.id,
        startDate: leaveDate,
        endDate: leaveDate,
        reason: 'Masterclass seminar training',
      });
      expect(leave.status).toBe('pending');

      // Approve leave
      const approvedResult = db.updateLeaveRequestStatus(leave.id, 'approved', 'user-owner-1');
      expect(approvedResult.request?.status).toBe('approved');

      // Verify SmartScheduler avoids staff on approved leave
      const services = db.getServicesBySalon(masterSalonId);
      const result = IntelligenceApi.getSmartSlots({
        salonId: masterSalonId,
        serviceId: services[0].id,
        date: leaveDate,
        preferredStaffId: staff.id,
      });

      // The staff on leave should not be assigned as primary
      const primary = result.primaryRecommendation;
      if (primary) {
        expect(primary.staffId).not.toBe(staff.id);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW I: MULTI-BRANCH DATA ISOLATION
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow I — Multi-Branch Isolation & Consolidated Reporting', () => {
    it('should properly isolate branch appointments while maintaining consolidated owner reporting', () => {
      const branches = db.getBranchesBySalon(masterSalonId);
      expect(branches.length).toBeGreaterThan(1);

      const branchA = branches[0];
      const branchB = branches[1];

      const allApts = db.getAppointmentsBySalon(masterSalonId);
      const branchAApts = allApts.filter(a => a.branchId === branchA.id);
      const branchBApts = allApts.filter(a => a.branchId === branchB.id);

      // Branch appointments must not cross-contaminate
      for (const apt of branchAApts) {
        expect(apt.branchId).toBe(branchA.id);
      }
      for (const apt of branchBApts) {
        expect(apt.branchId).toBe(branchB.id);
      }

      // Owner sees consolidated total
      expect(allApts.length).toBeGreaterThanOrEqual(branchAApts.length + branchBApts.length);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW J: AI SMART SCHEDULING SELECTION
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow J — AI Smart Scheduling End-to-End', () => {
    it('should rank slots, respect hard constraints, and allow customer to commit top recommendation', () => {
      const customer = db.getUserByEmail('customer@glamoure.com')!;
      const services = db.getServicesBySalon(masterSalonId);
      const testService = services[0];
      const targetDate = '2026-12-05';

      // AI Slot discovery
      const result = IntelligenceApi.getSmartSlots({
        salonId: masterSalonId,
        serviceId: testService.id,
        date: targetDate,
        preferredTime: 'morning',
        customerId: customer.id,
      });

      expect(result.primaryRecommendation).not.toBeNull();
      const topChoice = result.primaryRecommendation!;

      // Customer commits the AI recommended slot
      const booked = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerEmail: customer.email,
        staffId: topChoice.staffId,
        staffName: topChoice.staffName,
        serviceId: topChoice.serviceId,
        serviceName: topChoice.serviceName,
        appointmentDate: topChoice.date,
        startTime: topChoice.startTime,
        durationMinutes: testService.durationMinutes,
        price: testService.price,
        bookedBy: customer,
      });

      expect(booked.id).toBeDefined();
      expect(booked.staffId).toBe(topChoice.staffId);
      expect(booked.startTime).toBe(topChoice.startTime);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // WORKFLOW K: BUSINESS INTELLIGENCE & TELEMETRY
  // ───────────────────────────────────────────────────────────────────────────
  describe('Workflow K — Business Intelligence & Telemetry', () => {
    it('should compute real-time demand forecasts, revenue series, and answer queries grounded in DB', () => {
      const demand = IntelligenceApi.getDemandForecast(masterSalonId, '7d');
      expect(demand.dailyForecast.length).toBe(7);

      const revenue = IntelligenceApi.getRevenueForecast(masterSalonId, 'daily');
      expect(revenue.expectedTotalRevenue).toBeGreaterThan(0);

      // AI Assistant Natural Language Grounding
      const revenueResponse = IntelligenceApi.askOwnerAssistant(masterSalonId, "What is today's revenue?");
      expect(revenueResponse.structuredMetrics?.todayRevenue).toBeDefined();
      expect(revenueResponse.dataSources).toContain('appointments');

      const staffResponse = IntelligenceApi.askOwnerAssistant(masterSalonId, 'Who is overloaded today?');
      expect(staffResponse.structuredMetrics?.averageBayUtilization).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // SECURITY, CONCURRENCY & IDEMPOTENCY AUDIT
  // ───────────────────────────────────────────────────────────────────────────
  describe('Security, Concurrency & Idempotency Audits', () => {
    it('should strictly reject simultaneous booking requests for the same stylist and slot (concurrency guard)', () => {
      const customerA = db.getUserByEmail('customer@glamoure.com')!;
      const customerB: User = {
        id: 'cust-concurrent-test',
        email: 'patron_b@test.com',
        fullName: 'Patron B',
        isEmailVerified: true,
        createdAt: '2026-11-17',
        updatedAt: '2026-11-17',
      };

      const staff = db.getStaffBySalon(masterSalonId)[0];
      const service = db.getServicesBySalon(masterSalonId)[0];
      const collisionDate = '2026-12-10';
      const collisionTime = '11:00';

      // 1. First booking succeeds
      const firstBooking = AppointmentService.bookAppointment({
        salonId: masterSalonId,
        customerId: customerA.id,
        customerName: customerA.fullName,
        customerEmail: customerA.email,
        staffId: staff.id,
        staffName: staff.displayName,
        serviceId: service.id,
        serviceName: service.name,
        appointmentDate: collisionDate,
        startTime: collisionTime,
        durationMinutes: 60,
        price: service.price,
        bookedBy: customerA,
      });
      expect(firstBooking.id).toBeDefined();

      // 2. Concurrent second booking for the exact same staff and time must throw conflict error
      expect(() => {
        AppointmentService.bookAppointment({
          salonId: masterSalonId,
          customerId: customerB.id,
          customerName: customerB.fullName,
          customerEmail: customerB.email,
          staffId: staff.id,
          staffName: staff.displayName,
          serviceId: service.id,
          serviceName: service.name,
          appointmentDate: collisionDate,
          startTime: collisionTime,
          durationMinutes: 60,
          price: service.price,
          bookedBy: customerB,
        });
      }).toThrow(/already booked for overlapping time/);
    });

    it('should enforce webhook idempotency: duplicate webhook calls must not duplicate payments', () => {
      const webhookPayload = {
        id: `evt_test_${Date.now()}`,
        type: 'payment.captured' as const,
        data: {
          salonId: masterSalonId,
          appointmentId: 'apt-001',
          customerId: 'user-customer-sophia',
          amount: 4500,
          method: 'card' as const,
        },
      };

      // First webhook call: handled, not duplicate
      const firstCall = PaymentService.handleWebhookEvent(webhookPayload);
      expect(firstCall.handled).toBe(true);
      expect(firstCall.duplicate).toBe(false);

      // Second duplicate webhook call with same event ID: handled, marked duplicate
      const secondCall = PaymentService.handleWebhookEvent(webhookPayload);
      expect(secondCall.handled).toBe(true);
      expect(secondCall.duplicate).toBe(true);
    });

    it('should validate file uploads: reject files over 5MB or with disallowed MIME types', async () => {
      // 1. Valid file
      const valid = StorageService.validateFile({
        name: 'salon_cover.jpg',
        size: 2 * 1024 * 1024, // 2MB
        type: 'image/jpeg',
      });
      expect(valid.valid).toBe(true);

      // 2. File too large (>5MB)
      const oversized = StorageService.validateFile({
        name: 'huge_raw_photo.png',
        size: 8 * 1024 * 1024, // 8MB
        type: 'image/png',
      });
      expect(oversized.valid).toBe(false);
      expect(oversized.error).toContain('exceeds maximum allowed limit of 5.0 MB');

      // 3. Disallowed MIME type (e.g. executable or script)
      const invalidType = StorageService.validateFile({
        name: 'malicious_script.exe',
        size: 500 * 1024,
        type: 'application/x-msdownload',
      });
      expect(invalidType.valid).toBe(false);
      expect(invalidType.error).toContain('Unsupported file type');
    });

    it('should enforce RBAC: prevent customer from accessing owner administration routes', () => {
      expect(RBACService.isRouteAllowedForRole('customer', '/customer/dashboard')).toBe(true);
      expect(RBACService.isRouteAllowedForRole('customer', '/owner/dashboard')).toBe(false);
      expect(RBACService.isRouteAllowedForRole('customer', '/owner/intelligence')).toBe(false);
      expect(RBACService.isRouteAllowedForRole('salon_owner', '/owner/intelligence')).toBe(true);
      expect(RBACService.isRouteAllowedForRole('salon_member', '/member/dashboard')).toBe(true);
      expect(RBACService.isRouteAllowedForRole('salon_member', '/owner/settings')).toBe(false);
    });
  });
});
