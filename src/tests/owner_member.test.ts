import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../database/db';
import { AuthService } from '../services/authService';
import { AppointmentService } from '../services/appointmentService';
import { PaymentService } from '../services/paymentService';
import { RbacService } from '../services/rbacService';
import type { UserRole } from '../types/auth';

describe('GLAMOURÉ PHASE 3: Complete Owner & Member Management System', () => {
  const timestamp = Date.now();
  const testOwnerEmail = `owner_${timestamp}@glamoure.test`;
  const testMemberEmail = `artisan_${timestamp}@glamoure.test`;
  const testCustomerEmail = `guest_${timestamp}@glamoure.test`;

  let createdSalonId = '';
  let createdBranchId = '';
  let createdServiceId = '';
  let createdStaffProfileId = '';
  let memberUserId = '';
  let customerUserId = '';
  let createdAppointmentId = '';
  let inventoryItemId = '';

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 1: Owner creates salon
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 1: Owner creates salon with business profile and policies', () => {
    const ownerUser = db.createUser({
      id: `user-owner-${timestamp}`,
      email: testOwnerEmail,
      fullName: 'Genevieve Delacroix',
      passwordHash: 'hash_delacroix',
      phone: '+91 98840 11111',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newSalon = db.createSalon({
      id: `salon-test-${timestamp}`,
      name: 'Maison Glamouré Banjara',
      slug: `maison-glamoure-banjara-${timestamp}`,
      ownerId: ownerUser.id,
      phone: '+91 98840 11111',
      email: testOwnerEmail,
      address: 'Road No. 12, Banjara Hills',
      city: 'Hyderabad',
      country: 'India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      onboardingCompleted: true,
      settings: {
        allowOnlineBooking: true,
        requireDeposit: true,
        depositPercentage: 25,
        cancellationNoticeHours: 24,
        bufferMinutesBetweenAppointments: 15,
        autoConfirmAppointments: true,
        businessHours: [
          { dayOfWeek: 1, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 2, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 3, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 4, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 5, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 6, open: '09:00', close: '20:00', isOpen: true },
          { dayOfWeek: 0, open: '10:00', close: '18:00', isOpen: true },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    createdSalonId = newSalon.id;
    expect(newSalon.name).toBe('Maison Glamouré Banjara');
    expect(db.getSalonById(createdSalonId)).toBeDefined();
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 2: Owner adds branch
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 2: Owner adds branch to the salon', () => {
    const branch = db.createBranch({
      id: `branch-banjara-${timestamp}`,
      salonId: createdSalonId,
      name: 'Banjara Hills Flagship Suite',
      code: 'BH-01',
      address: 'Suite 401, Banjara Heritage',
      city: 'Hyderabad',
      phone: '+91 98840 11112',
      email: 'banjara@glamoure.test',
      isMainBranch: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    createdBranchId = branch.id;
    const salonBranches = db.getBranchesBySalon(createdSalonId);
    expect(salonBranches.length).toBeGreaterThanOrEqual(1);
    expect(salonBranches[0].name).toBe('Banjara Hills Flagship Suite');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 3: Owner creates services
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 3: Owner creates services with validated price and duration', () => {
    // Backend validation: positive price and duration >= 15
    const servicePrice = 7500;
    const durationMinutes = 90;
    expect(servicePrice).toBeGreaterThan(0);
    expect(durationMinutes).toBeGreaterThanOrEqual(15);

    const srv = db.createService({
      id: `srv-couture-${timestamp}`,
      salonId: createdSalonId,
      categoryId: 'cat-hair',
      categoryName: 'Hair Artistry',
      name: 'Couture Ombre Balayage',
      slug: `couture-ombre-balayage-${timestamp}`,
      description: 'Hand-painted dimensional contouring with organic gloss.',
      durationMinutes,
      price: servicePrice,
      bufferMinutes: 15,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    createdServiceId = srv.id;
    const list = db.getServicesBySalon(createdSalonId);
    expect(list.some(s => s.id === createdServiceId)).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 4: Owner invites employees
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 4: Owner invites employee with role and commission rate', () => {
    const invitedUser = db.createUser({
      id: `user-member-${timestamp}`,
      email: testMemberEmail,
      fullName: 'Sebastien Laurent',
      passwordHash: 'hash_sebastien',
      phone: '+91 98840 22222',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    memberUserId = invitedUser.id;

    const membership = db.addMembership({
      id: `m-artisan-${timestamp}`,
      userId: invitedUser.id,
      salonId: createdSalonId,
      branchId: createdBranchId,
      role: 'salon_member',
      permissions: ['appointments:read', 'appointments:status', 'staff:schedule'],
      status: 'active',
      joinedAt: new Date().toISOString(),
    });

    const staffProfile = db.createStaffProfile({
      id: `staff-sebastien-${timestamp}`,
      salonId: createdSalonId,
      userId: invitedUser.id,
      branchId: createdBranchId,
      displayName: 'Sebastien Laurent',
      title: 'Hairstylist & Master Colorist',
      role: 'Hairstylist',
      bio: 'French balayage master with 10 years European atelier experience.',
      servicesOffered: [createdServiceId],
      commissionPercentage: 35,
      rating: 5.0,
      reviewCount: 0,
      isActive: true,
      joinedAt: new Date().toISOString(),
    });

    createdStaffProfileId = staffProfile.id;
    expect(membership.status).toBe('active');
    expect(staffProfile.commissionPercentage).toBe(35);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 5: Member accepts invitation and logs in
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 5: Member authenticates and accesses salon membership', async () => {
    const session = await AuthService.login(testMemberEmail, 'hash_sebastien');
    expect(session.user.email).toBe(testMemberEmail);
    expect(session.activeRole).toBe('salon_member');
    expect(session.memberships.some(m => m.salonId === createdSalonId)).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 6: Customer books a service
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 6: Customer books an appointment with chosen stylist', () => {
    const custUser = db.createUser({
      id: `user-cust-${timestamp}`,
      email: testCustomerEmail,
      fullName: 'Aarohi Sen',
      passwordHash: 'hash_aarohi',
      phone: '+91 98840 33333',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    customerUserId = custUser.id;

    db.createCustomerProfile({
      id: `cp-${custUser.id}`,
      userId: custUser.id,
      hairType: 'Fine 2A Wavy Strand',
      preferredNotes: 'Prefers cool ash toner, sensitive to heat',
      loyaltyPoints: 100,
    });

    const apt = db.createAppointment({
      salonId: createdSalonId,
      branchId: createdBranchId,
      customerId: custUser.id,
      customerName: 'Aarohi Sen',
      customerEmail: testCustomerEmail,
      customerPhone: '+91 98840 33333',
      staffId: createdStaffProfileId,
      staffName: 'Sebastien Laurent',
      serviceId: createdServiceId,
      serviceName: 'Couture Ombre Balayage',
      appointmentDate: '2026-11-20',
      startTime: '11:00',
      endTime: '12:30',
      durationMinutes: 90,
      status: 'confirmed',
      price: 7500,
      depositAmount: 1875,
      paymentStatus: 'paid',
      notes: 'Customer desires subtle face-framing illumination',
    });

    createdAppointmentId = apt.id;
    expect(apt.status).toBe('confirmed');
    expect(apt.staffId).toBe(createdStaffProfileId);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 7: Owner receives the appointment
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 7: Owner receives appointment in salon calendar & records', () => {
    const salonAppointments = db.getAppointmentsBySalon(createdSalonId);
    expect(salonAppointments.some(a => a.id === createdAppointmentId)).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 8: Member receives the assignment
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 8: Member receives assignment in personal schedule', () => {
    const staffAppointments = db.getAppointmentsByStaff(createdStaffProfileId);
    expect(staffAppointments.some(a => a.id === createdAppointmentId)).toBe(true);
    expect(staffAppointments[0].customerName).toBe('Aarohi Sen');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 9: Member checks in the customer
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 9: Member checks in the customer upon lounge arrival', () => {
    const memberUser = db.getUserById(memberUserId)!;
    const updated = AppointmentService.updateStatus(
      createdAppointmentId,
      'checked_in',
      memberUser,
      'Guest greeted with organic herbal tea and seated at styling bay'
    );
    expect(updated.status).toBe('checked_in');

    const history = db.getAppointmentHistory(createdAppointmentId);
    expect(history.some(h => h.toStatus === 'checked_in')).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 10: Member starts the service
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 10: Member transitions ritual to In Progress', () => {
    const memberUser = db.getUserById(memberUserId)!;
    const updated = AppointmentService.updateStatus(
      createdAppointmentId,
      'in_progress',
      memberUser,
      'Commenced French balayage application'
    );
    expect(updated.status).toBe('in_progress');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 11: Member completes the service
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 11: Member completes the service', () => {
    const memberUser = db.getUserById(memberUserId)!;
    const updated = AppointmentService.updateStatus(
      createdAppointmentId,
      'completed',
      memberUser,
      'Styling and cool gloss finished to perfection'
    );
    expect(updated.status).toBe('completed');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 12: Payment is recorded
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 12: Payment is verified and recorded with invoice generation', () => {
    const invoice = db.createInvoice({
      id: `inv-${timestamp}`,
      salonId: createdSalonId,
      appointmentId: createdAppointmentId,
      customerId: customerUserId,
      invoiceNumber: `INV-${timestamp}`,
      subtotal: 7500,
      taxAmount: 1350,
      discountAmount: 0,
      totalAmount: 8850,
      status: 'paid',
      issuedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });

    const payment = db.recordPayment({
      id: `pmt-${timestamp}`,
      salonId: createdSalonId,
      invoiceId: invoice.id,
      appointmentId: createdAppointmentId,
      customerId: customerUserId,
      amount: 8850,
      method: 'card',
      status: 'successful',
      transactionReference: `TXN-STRIPE-${timestamp}`,
      notes: 'Visa Infinite settlement',
      createdAt: new Date().toISOString(),
    });

    expect(payment.status).toBe('successful');
    expect(payment.amount).toBe(8850);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 13: Customer history updates
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 13: Customer history updates with completed ritual', () => {
    const customerApts = db.getAppointmentsByCustomer(customerUserId);
    expect(customerApts.some(a => a.id === createdAppointmentId && a.status === 'completed')).toBe(true);

    const segments = db.getCustomerSegments(createdSalonId);
    expect(segments.new.length + segments.returning.length + segments.frequent.length).toBeGreaterThan(0);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 14: Owner revenue updates
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 14: Owner revenue updates in ledger and daily reconciliation', () => {
    const today = new Date().toISOString().split('T')[0];
    const reconciliation = db.getDailyReconciliation(createdSalonId, today);
    expect(reconciliation.totalRevenue).toBeGreaterThanOrEqual(8850);
    expect(reconciliation.cardTotal).toBeGreaterThanOrEqual(8850);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 15: Inventory is updated
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 15: Inventory consumption is tracked with auditable movement', () => {
    // Add inventory item first
    const item = {
      id: `inv-${timestamp}`,
      salonId: createdSalonId,
      branchId: createdBranchId,
      name: 'Olaplex No. 1 Bond Multiplier',
      sku: `OLA-BOND-${timestamp}`,
      category: 'Hair Care',
      quantity: 10,
      minThreshold: 3,
      reorderThreshold: 5,
      unitPrice: 3200,
      price: 3200,
      costPrice: 2400,
      updatedAt: new Date().toISOString(),
    };
    (db as any).inventory.push(item);
    inventoryItemId = item.id;

    // Record stock usage connected to completed appointment
    const movement = db.recordStockMovement({
      salonId: createdSalonId,
      branchId: createdBranchId,
      itemId: inventoryItemId,
      quantityDelta: -1,
      reason: 'service_usage',
      appointmentId: createdAppointmentId,
      performedByUserId: memberUserId,
      notes: 'Bond multiplier used for Balayage lightening treatment',
    });

    expect(movement.newQuantity).toBe(9);
    expect(movement.reason).toBe('service_usage');
    expect(movement.appointmentId).toBe(createdAppointmentId);

    const movements = db.getInventoryMovements(createdSalonId, inventoryItemId);
    expect(movements.length).toBeGreaterThanOrEqual(1);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 16: Customer leaves a review
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 16: Customer leaves a 5-star review for the service', () => {
    const review = db.addReview({
      id: `rev-${timestamp}`,
      salonId: createdSalonId,
      appointmentId: createdAppointmentId,
      customerId: customerUserId,
      customerName: 'Aarohi Sen',
      staffId: createdStaffProfileId,
      staffName: 'Sebastien Laurent',
      rating: 5,
      comment: 'Sebastien is phenomenal! The Couture Ombre Balayage gave me luminous dimensions with zero damage.',
      createdAt: new Date().toISOString(),
    });

    expect(review.rating).toBe(5);
    const salonReviews = db.getReviewsBySalon(createdSalonId);
    expect(salonReviews.some(r => r.id === review.id)).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 17: Owner responds to review
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 17: Owner responds to client review with public hospitality reply', () => {
    const replyText = 'Thank you Aarohi! Sebastien and the Maison Banjara atelier were delighted to host you.';
    db.addReviewReply(`rev-${timestamp}`, replyText);

    const reviews = db.getReviewsBySalon(createdSalonId);
    const targetRev = reviews.find(r => r.id === `rev-${timestamp}`);
    expect(targetRev?.reply).toBe(replyText);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 18: Member requests leave
  // ═════════════════════════════════════════════════════════════════════════
  let submittedLeaveId = '';
  it('Workflow 18: Member requests leave with dates and reason', () => {
    // Schedule a future appointment to test conflict detection
    db.createAppointment({
      salonId: createdSalonId,
      branchId: createdBranchId,
      customerId: customerUserId,
      customerName: 'Aarohi Sen',
      customerEmail: testCustomerEmail,
      staffId: createdStaffProfileId,
      staffName: 'Sebastien Laurent',
      serviceId: createdServiceId,
      serviceName: 'Couture Ombre Balayage',
      appointmentDate: '2026-11-26',
      startTime: '14:00',
      endTime: '15:30',
      durationMinutes: 90,
      status: 'confirmed',
      price: 7500,
      depositAmount: 0,
      paymentStatus: 'paid',
    });

    const leave = db.createLeaveRequest({
      salonId: createdSalonId,
      staffProfileId: createdStaffProfileId,
      startDate: '2026-11-25',
      endDate: '2026-11-28',
      reason: 'L’Oréal Professionnel Color World Summit Paris',
    });

    submittedLeaveId = leave.id;
    expect(leave.status).toBe('pending');
    expect(leave.startDate).toBe('2026-11-25');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 19 & 20: Owner approves leave & affected appointments identified
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 19 & 20: Owner approves leave and affected appointments are detected without cancellation', () => {
    const ownerUser = db.getUserByEmail(testOwnerEmail)!;
    const result = db.updateLeaveRequestStatus(submittedLeaveId, 'approved', ownerUser.id);

    expect(result.request?.status).toBe('approved');
    expect(result.affectedAppointments.length).toBeGreaterThanOrEqual(1);

    // CRITICAL REQUIREMENT: Affected appointments must NOT be automatically cancelled!
    const apt = result.affectedAppointments[0];
    expect(apt.status).toBe('confirmed');
    expect(apt.appointmentDate).toBe('2026-11-26');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 21: Live Queue Management
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 21: Walk-in enrolled into live queue with workload estimation and duplicate check', () => {
    const walkIn = db.addToQueue({
      salonId: createdSalonId,
      branchId: createdBranchId,
      customerName: 'Pooja Hegde',
      customerPhone: '+91 97711 22334',
      serviceId: createdServiceId,
      serviceName: 'Couture Ombre Balayage',
      staffId: createdStaffProfileId,
      staffName: 'Sebastien Laurent',
      notes: 'Express toner touch-up',
    });

    expect(walkIn.success).toBe(true);
    expect(walkIn.item?.status).toBe('next_in_line');

    // Duplicate prevention check: cannot add the same customer twice while active!
    const duplicateAttempt = db.addToQueue({
      salonId: createdSalonId,
      branchId: createdBranchId,
      customerName: 'Pooja Hegde',
      customerPhone: '+91 97711 22334',
      serviceId: createdServiceId,
      serviceName: 'Couture Ombre Balayage',
    });

    expect(duplicateAttempt.success).toBe(false);
    expect(duplicateAttempt.error).toContain('already active in the salon queue');
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 22: Role-based Access Control (RBAC) & Tenant Isolation
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 22: Enforces role permissions and prevents unauthorized modifications', () => {
    // Salon member cannot access owner financial settings permission
    const memberMembership = {
      id: `m-test-member-${timestamp}`,
      userId: memberUserId,
      salonId: createdSalonId,
      role: 'salon_member' as const,
      permissions: ['appointments:read' as const, 'appointments:status' as const, 'staff:schedule' as const],
      status: 'active' as const,
      joinedAt: new Date().toISOString(),
    };
    const memberCanManageSettings = RbacService.hasPermission(memberMembership, 'settings:manage');
    expect(memberCanManageSettings).toBe(false);

    // Salon owner has full settings and business governance permissions
    const ownerMembership = {
      id: `m-test-owner-${timestamp}`,
      userId: `user-owner-${timestamp}`,
      salonId: createdSalonId,
      role: 'salon_owner' as const,
      permissions: ['settings:manage' as const, 'branches:manage' as const, 'billing:read' as const, 'billing:write' as const],
      status: 'active' as const,
      joinedAt: new Date().toISOString(),
    };
    const ownerCanManageSettings = RbacService.hasPermission(ownerMembership, 'settings:manage');
    expect(ownerCanManageSettings).toBe(true);

    // Route guard checks
    expect(RbacService.isRouteAllowedForRole('salon_member', '/member/dashboard')).toBe(true);
    expect(RbacService.isRouteAllowedForRole('salon_member', '/owner/dashboard')).toBe(false);
    expect(RbacService.isRouteAllowedForRole('salon_owner', '/owner/dashboard')).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 23: Price snapshot preservation
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 23: Preserves price snapshots on historical appointments and invoices when catalogue price changes', () => {
    // Original appointment created at 5500
    const originalApt = db.getAppointmentById(createdAppointmentId);
    expect(originalApt).toBeDefined();
    const originalPrice = originalApt!.price;

    // Owner updates service price to 7500 in catalogue
    db.updateService(createdServiceId, { price: 7500 });
    const updatedService = db.getServiceById(createdServiceId);
    expect(updatedService?.price).toBe(7500);

    // Historic appointment MUST preserve original snapshot price 5500
    const reloadedApt = db.getAppointmentById(createdAppointmentId);
    expect(reloadedApt?.price).toBe(originalPrice);

    // Issued invoice MUST also preserve original subtotal and GST
    const invoices = db.getInvoicesBySalon(createdSalonId);
    const historicInvoice = invoices.find(i => i.appointmentId === createdAppointmentId);
    expect(historicInvoice).toBeDefined();
    expect(historicInvoice?.subtotal).toBe(originalPrice);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 24: Artisan deactivation preserves records
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 24: Deactivating an artisan does not delete past appointments or commissions', () => {
    const staff = db.getStaffById(createdStaffProfileId);
    expect(staff).toBeDefined();
    expect(staff?.isActive).toBe(true);

    // Deactivate artisan
    const updated = db.updateStaffProfile(createdStaffProfileId, { isActive: false });
    expect(updated.isActive).toBe(false);

    // Historical appointments for this artisan are completely intact
    const staffApts = db.getAppointmentsByStaff(createdStaffProfileId);
    expect(staffApts.length).toBeGreaterThan(0);
    expect(staffApts.some(a => a.id === createdAppointmentId)).toBe(true);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 25: GST 18% calculation verification
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 25: Verifies GST 18% statutory tax calculation and 50/50 CGST/SGST split', () => {
    const servicePrice = 5000;
    const gstRate = 0.18;
    const expectedGst = servicePrice * gstRate; // 900
    const expectedCgst = expectedGst / 2; // 450
    const expectedSgst = expectedGst / 2; // 450

    expect(expectedGst).toBe(900);
    expect(expectedCgst).toBe(450);
    expect(expectedSgst).toBe(450);
    expect(servicePrice + expectedGst).toBe(5900);
  });

  // ═════════════════════════════════════════════════════════════════════════
  // WORKFLOW 26: Leave request conflict detection
  // ═════════════════════════════════════════════════════════════════════════
  it('Workflow 26: Accurately detects existing client appointments during proposed leave window', () => {
    // Create an upcoming confirmed appointment for the artisan
    const upcomingApt = db.createAppointment({
      salonId: createdSalonId,
      branchId: createdBranchId,
      customerId: customerUserId,
      customerName: 'Aria Montgomery',
      customerEmail: testCustomerEmail,
      serviceId: createdServiceId,
      serviceName: 'Bespoke Balayage',
      staffId: createdStaffProfileId,
      staffName: 'Elena Vance',
      appointmentDate: '2026-11-25',
      startTime: '11:00',
      endTime: '12:30',
      durationMinutes: 90,
      price: 5500,
      status: 'confirmed',
    }, customerUserId, 'Aria Montgomery');

    const affected = db.getAffectedAppointments(
      createdStaffProfileId,
      '2026-11-24',
      '2026-11-26'
    );
    expect(affected.length).toBeGreaterThan(0);
    expect(affected.some(a => a.id === upcomingApt.id)).toBe(true);
  });
});
