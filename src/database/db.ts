import type { 
  User, 
  SalonMembership, 
  CustomerProfile, 
  Invitation, 
  UserRole, 
  Permission 
} from '../types/auth';
import type { 
  Salon, 
  SalonBranch, 
  ServiceCategory, 
  Service, 
  Offer, 
  InventoryItem 
} from '../types/salon';
import type { StaffProfile, WorkingHours, LeaveRequest } from '../types/staff';
import type { 
  Appointment, 
  AppointmentStatus, 
  AppointmentStatusHistory, 
  Invoice, 
  Payment,
  QueueItem,
  QueueStatus,
  InventoryMovement
} from '../types/appointment';
import type { Notification, AuditLog, Review, CustomerRecord, CustomerFavorites } from '../types/common';
import { SecurityUtils } from '../utils/security';
import {
  SEED_USERS,
  SEED_CUSTOMER_PROFILES,
  SEED_SALONS,
  SEED_BRANCHES,
  SEED_MEMBERSHIPS,
  SEED_CATEGORIES,
  SEED_SERVICES,
  SEED_STAFF,
  SEED_WORKING_HOURS,
  SEED_APPOINTMENTS,
  SEED_STATUS_HISTORY,
  SEED_INVOICES,
  SEED_PAYMENTS,
  SEED_INVENTORY,
  SEED_OFFERS,
  SEED_REVIEWS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
  SEED_QUEUE,
  SEED_INVENTORY_MOVEMENTS,
} from './seedData';

// ═══════════════════════════════════════════════════════════════════════════
// APPOINTMENT STATE MACHINE VALIDATION MATRIX
// ═══════════════════════════════════════════════════════════════════════════
export const VALID_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled', 'no_show'],
  checked_in: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
  no_show: [],   // Terminal state
};

export class AppDatabase {
  private users: (User & { passwordHash: string })[] = [];
  private customerProfiles: CustomerProfile[] = [];
  private salons: Salon[] = [];
  private branches: SalonBranch[] = [];
  private memberships: SalonMembership[] = [];
  private invitations: Invitation[] = [];
  private categories: ServiceCategory[] = [];
  private services: Service[] = [];
  private staff: StaffProfile[] = [];
  private workingHours: WorkingHours[] = [];
  private leaveRequests: LeaveRequest[] = [];
  private appointments: Appointment[] = [];
  private statusHistory: AppointmentStatusHistory[] = [];
  private invoices: Invoice[] = [];
  private payments: Payment[] = [];
  private inventory: InventoryItem[] = [];
  private offers: Offer[] = [];
  private reviews: Review[] = [];
  private notifications: Notification[] = [];
  private auditLogs: AuditLog[] = [];
  private favorites: CustomerFavorites[] = [];
  private queueItems: QueueItem[] = [];
  private inventoryMovements: InventoryMovement[] = [];

  private STORAGE_PREFIX = 'glamoure_db_v1_';

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.users = this.loadOrSet('users', SEED_USERS);
    this.customerProfiles = this.loadOrSet('customer_profiles', SEED_CUSTOMER_PROFILES);
    this.salons = this.loadOrSet('salons', SEED_SALONS);
    this.branches = this.loadOrSet('branches', SEED_BRANCHES);
    this.memberships = this.loadOrSet('memberships', SEED_MEMBERSHIPS);
    this.invitations = this.loadOrSet('invitations', []);
    this.categories = this.loadOrSet('categories', SEED_CATEGORIES);
    this.services = this.loadOrSet('services', SEED_SERVICES);
    this.staff = this.loadOrSet('staff', SEED_STAFF);
    this.workingHours = this.loadOrSet('working_hours', SEED_WORKING_HOURS);
    this.leaveRequests = this.loadOrSet('leave_requests', []);
    this.appointments = this.loadOrSet('appointments', SEED_APPOINTMENTS);
    this.statusHistory = this.loadOrSet('status_history', SEED_STATUS_HISTORY);
    this.invoices = this.loadOrSet('invoices', SEED_INVOICES);
    this.payments = this.loadOrSet('payments', SEED_PAYMENTS);
    this.inventory = this.loadOrSet('inventory', SEED_INVENTORY);
    this.offers = this.loadOrSet('offers', SEED_OFFERS);
    this.reviews = this.loadOrSet('reviews', SEED_REVIEWS);
    this.notifications = this.loadOrSet('notifications', SEED_NOTIFICATIONS);
    this.auditLogs = this.loadOrSet('audit_logs', SEED_AUDIT_LOGS);
    this.queueItems = this.loadOrSet('queue', SEED_QUEUE);
    this.inventoryMovements = this.loadOrSet('inventory_movements', SEED_INVENTORY_MOVEMENTS);
    this.favorites = this.loadOrSet('favorites', [
      {
        userId: 'user-customer-sophia',
        salonIds: ['salon-glamoure-jubilee'],
        serviceIds: ['srv-balayage', 'srv-facial-glow'],
        staffIds: ['staff-aria'],
      },
    ]);
  }

  private loadOrSet<T>(key: string, defaultData: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
        if (stored) {
          return JSON.parse(stored);
        }
        localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(defaultData));
      }
    } catch (e) {
      console.warn(`[AppDatabase] localStorage unavailable for ${key}`, e);
    }
    return defaultData;
  }

  private persist(key: string, data: any) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(data));
      }
    } catch (e) {
      console.warn(`[AppDatabase] Failed to persist ${key}`, e);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // USERS & AUTH
  // ═════════════════════════════════════════════════════════════════════════
  public getAllUsers(): User[] {
    return this.users.map(({ passwordHash, ...safeUser }) => safeUser);
  }

  public findUserByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.users.find(u => u.email.toLowerCase() === normalized);
  }

  public getUserByEmail(email: string): User | undefined {
    const user = this.findUserByEmail(email);
    if (!user) return undefined;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  public getUserById(id: string): User | undefined {
    return this.findUserById(id);
  }

  public findUserById(id: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  public getCustomerProfile(userId: string): CustomerProfile | undefined {
    return this.customerProfiles.find(p => p.userId === userId);
  }

  public createCustomerProfile(profile: CustomerProfile): CustomerProfile {
    this.customerProfiles.push(profile);
    this.persist('customerProfiles', this.customerProfiles);
    return profile;
  }

  public getAllCustomerProfiles(): CustomerProfile[] {
    return this.customerProfiles;
  }

  public createUser(user: User & { passwordHash: string }): User {
    this.users.push(user);
    this.persist('users', this.users);
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist('users', this.users);
    const { passwordHash, ...safeUser } = this.users[idx];
    return safeUser;
  }

  public updatePassword(id: string, newPasswordHash: string): void {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    this.users[idx].passwordHash = newPasswordHash;
    this.users[idx].updatedAt = new Date().toISOString();
    this.persist('users', this.users);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SALON MEMBERSHIPS & RBAC
  // ═════════════════════════════════════════════════════════════════════════
  public getUserMemberships(userId: string): SalonMembership[] {
    return this.memberships.filter(m => m.userId === userId && m.status === 'active');
  }

  public getSalonMembers(salonId: string): SalonMembership[] {
    return this.memberships.filter(m => m.salonId === salonId);
  }

  public addMembership(membership: SalonMembership): SalonMembership {
    this.memberships.push(membership);
    this.persist('memberships', this.memberships);
    return membership;
  }

  public updateMembership(id: string, updates: Partial<SalonMembership>): SalonMembership {
    const idx = this.memberships.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Membership ${id} not found`);
    this.memberships[idx] = { ...this.memberships[idx], ...updates };
    this.persist('memberships', this.memberships);
    return this.memberships[idx];
  }

  public removeMembership(id: string): void {
    this.memberships = this.memberships.filter(m => m.id !== id);
    this.persist('memberships', this.memberships);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SALONS & BRANCHES (MULTI-TENANT)
  // ═════════════════════════════════════════════════════════════════════════
  public getAllSalons(): Salon[] {
    return this.salons.filter(s => s.settings.allowOnlineBooking);
  }

  public getSalonById(id: string): Salon | undefined {
    return this.salons.find(s => s.id === id);
  }

  public getSalonBySlug(slug: string): Salon | undefined {
    return this.salons.find(s => s.slug === slug);
  }

  public createSalon(salon: Salon): Salon {
    this.salons.push(salon);
    this.persist('salons', this.salons);
    return salon;
  }

  public updateSalon(id: string, updates: Partial<Salon>): Salon {
    const idx = this.salons.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Salon ${id} not found`);
    this.salons[idx] = { ...this.salons[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist('salons', this.salons);
    return this.salons[idx];
  }

  public getBranchesBySalon(salonId: string): SalonBranch[] {
    return this.branches.filter(b => b.salonId === salonId && b.isActive);
  }

  public createBranch(branch: SalonBranch): SalonBranch {
    this.branches.push(branch);
    this.persist('branches', this.branches);
    return branch;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SERVICES & CATEGORIES
  // ═════════════════════════════════════════════════════════════════════════
  public getCategoriesBySalon(salonId: string): ServiceCategory[] {
    return this.categories
      .filter(c => c.salonId === salonId && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public createCategory(category: ServiceCategory): ServiceCategory {
    this.categories.push(category);
    this.persist('categories', this.categories);
    return category;
  }

  public getServicesBySalon(salonId: string): Service[] {
    return this.services.filter(s => s.salonId === salonId && s.isActive);
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  public createService(service: Service): Service {
    this.services.push(service);
    this.persist('services', this.services);
    return service;
  }

  public updateService(id: string, updates: Partial<Service>): Service {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Service ${id} not found`);
    this.services[idx] = { ...this.services[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist('services', this.services);
    return this.services[idx];
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STAFF PROFILES & AVAILABILITY
  // ═════════════════════════════════════════════════════════════════════════
  public getAllStaff(salonId: string): StaffProfile[] {
    return this.getStaffBySalon(salonId);
  }

  public getStaffBySalon(salonId: string): StaffProfile[] {
    return this.staff.filter(st => st.salonId === salonId && st.isActive);
  }

  public getStaffById(id: string): StaffProfile | undefined {
    return this.staff.find(st => st.id === id);
  }

  public getStaffByUserId(userId: string, salonId: string): StaffProfile | undefined {
    return this.staff.find(st => st.userId === userId && st.salonId === salonId);
  }

  public createStaffProfile(profile: StaffProfile): StaffProfile {
    this.staff.push(profile);
    this.persist('staff', this.staff);
    return profile;
  }

  public updateStaffProfile(id: string, updates: Partial<StaffProfile>): StaffProfile {
    const idx = this.staff.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Staff ${id} not found`);
    this.staff[idx] = { ...this.staff[idx], ...updates };
    this.persist('staff', this.staff);
    return this.staff[idx];
  }

  public getWorkingHours(staffProfileId: string): WorkingHours[] {
    return this.workingHours.filter(wh => wh.staffProfileId === staffProfileId);
  }

  public updateWorkingHours(staffProfileId: string, hours: WorkingHours[]): void {
    this.workingHours = this.workingHours.filter(wh => wh.staffProfileId !== staffProfileId);
    this.workingHours.push(...hours);
    this.persist('working_hours', this.workingHours);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // APPOINTMENTS & LIFECYCLE STATE ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  public getAllAppointments(): Appointment[] {
    return [...this.appointments];
  }

  public getAppointmentsBySalon(salonId: string): Appointment[] {
    return this.appointments.filter(a => a.salonId === salonId);
  }

  public getAppointmentsByCustomer(customerId: string): Appointment[] {
    return this.appointments.filter(a => a.customerId === customerId);
  }

  public getAppointmentsByStaff(staffId: string): Appointment[] {
    return this.appointments.filter(a => a.staffId === staffId);
  }

  public getAppointmentById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  public createAppointment(
    data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string; status?: AppointmentStatus; createdAt?: string; updatedAt?: string },
    userId: string = data.customerId || 'system',
    userName: string = data.customerName || 'System'
  ): Appointment {
    // 1. Conflict Validation
    const hasConflict = this.appointments.some(existing => {
      if (existing.staffId !== data.staffId) return false;
      if (existing.appointmentDate !== data.appointmentDate) return false;
      if (['cancelled', 'no_show'].includes(existing.status)) return false;

      // Overlap check
      const startA = data.startTime;
      const endA = data.endTime;
      const startB = existing.startTime;
      const endB = existing.endTime;

      return (startA < endB && endA > startB);
    });

    if (hasConflict) {
      throw new Error(`Stylist is already booked for overlapping time on ${data.appointmentDate}`);
    }

    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments.unshift(newAppointment);
    this.persist('appointments', this.appointments);

    // Initial Status History Log
    this.addStatusHistory({
      id: `sh-${Date.now()}`,
      appointmentId: newAppointment.id,
      salonId: newAppointment.salonId,
      fromStatus: null,
      toStatus: newAppointment.status,
      changedByUserId: userId,
      changedByName: userName,
      reason: 'Appointment created',
      createdAt: new Date().toISOString(),
    });

    // Auto-create initial invoice
    this.createInvoice({
      id: `inv-${Date.now()}`,
      salonId: newAppointment.salonId,
      appointmentId: newAppointment.id,
      customerId: newAppointment.customerId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subtotal: newAppointment.price,
      taxAmount: Math.round(newAppointment.price * 0.18),
      discountAmount: 0,
      totalAmount: Math.round(newAppointment.price * 1.18),
      status: 'issued',
      issuedAt: new Date().toISOString(),
    });

    return newAppointment;
  }

  /**
   * Strict Lifecycle State Machine Transition
   */
  public transitionAppointmentStatus(
    appointmentId: string,
    toStatus: AppointmentStatus,
    changedByUserId: string,
    changedByName: string,
    reason?: string
  ): Appointment {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (!appointment) throw new Error(`Appointment ${appointmentId} not found`);

    const currentStatus = appointment.status;

    // Validate Transition Matrix
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(toStatus)) {
      throw new Error(
        `Invalid status transition: Cannot transition appointment from '${currentStatus}' to '${toStatus}'. Allowed: [${allowed.join(', ')}]`
      );
    }

    // Apply Transition
    appointment.status = toStatus;
    appointment.updatedAt = new Date().toISOString();

    if (toStatus === 'cancelled' && reason) {
      appointment.cancellationReason = reason;
    }

    this.persist('appointments', this.appointments);

    // Record Immutable Audit History
    this.addStatusHistory({
      id: `sh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      appointmentId: appointment.id,
      salonId: appointment.salonId,
      fromStatus: currentStatus,
      toStatus: toStatus,
      changedByUserId,
      changedByName,
      reason: reason || `Status changed from ${currentStatus} to ${toStatus}`,
      createdAt: new Date().toISOString(),
    });

    return appointment;
  }

  public getAppointmentHistory(appointmentId: string): AppointmentStatusHistory[] {
    return this.statusHistory
      .filter(sh => sh.appointmentId === appointmentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  private addStatusHistory(record: AppointmentStatusHistory) {
    this.statusHistory.push(record);
    this.persist('status_history', this.statusHistory);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // INVOICES & PAYMENTS
  // ═════════════════════════════════════════════════════════════════════════
  public getInvoicesBySalon(salonId: string): Invoice[] {
    return this.invoices.filter(i => i.salonId === salonId);
  }

  public getInvoicesByCustomer(customerId: string): Invoice[] {
    return this.invoices.filter(i => i.customerId === customerId);
  }

  public createInvoice(invoice: Invoice): Invoice {
    this.invoices.unshift(invoice);
    this.persist('invoices', this.invoices);
    return invoice;
  }

  public getPaymentsBySalon(salonId: string): Payment[] {
    return this.payments.filter(p => p.salonId === salonId);
  }

  public recordPayment(payment: Payment): Payment {
    if (!payment.id) payment.id = `pmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    if (!payment.createdAt) payment.createdAt = new Date().toISOString();
    this.payments.unshift(payment);
    this.persist('payments', this.payments);

    // Update appointment paymentStatus if paid
    const apt = this.appointments.find(a => a.id === payment.appointmentId);
    if (apt) {
      if (payment.amount >= apt.price) {
        apt.paymentStatus = 'paid';
      } else if (payment.amount > 0) {
        apt.paymentStatus = 'deposit_paid';
      }
      this.persist('appointments', this.appointments);
    }

    return payment;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // INVENTORY & OFFERS
  // ═════════════════════════════════════════════════════════════════════════
  public getInventoryBySalon(salonId: string): InventoryItem[] {
    return this.inventory.filter(i => i.salonId === salonId);
  }

  public createInventoryItem(item: InventoryItem): InventoryItem {
    this.inventory.push(item);
    this.persist('inventory', this.inventory);
    return item;
  }

  public updateInventoryQuantity(id: string, delta: number): InventoryItem {
    const item = this.inventory.find(i => i.id === id);
    if (!item) throw new Error(`Inventory item ${id} not found`);
    item.quantity = Math.max(0, item.quantity + delta);
    item.updatedAt = new Date().toISOString();
    this.persist('inventory', this.inventory);
    return item;
  }

  public getOffersBySalon(salonId: string): Offer[] {
    return this.offers.filter(o => o.salonId === salonId && o.isActive);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // REVIEWS & NOTIFICATIONS
  // ═════════════════════════════════════════════════════════════════════════
  public getReviewsBySalon(salonId: string): Review[] {
    return this.reviews.filter(r => r.salonId === salonId);
  }

  public createReview(review: Review): Review {
    const sanitizedReview: Review = {
      ...review,
      customerName: SecurityUtils.sanitizeInput(review.customerName),
      comment: SecurityUtils.sanitizeInput(review.comment),
    };
    this.reviews.unshift(sanitizedReview);
    this.persist('reviews', this.reviews);
    return sanitizedReview;
  }

  public addReview(review: Review): Review {
    return this.createReview(review);
  }

  public getNotificationsByUser(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public createNotification(notification: Notification): Notification {
    // Duplicate prevention: avoid duplicate notifications within 5 mins
    const isDuplicate = this.notifications.some(n => 
      n.userId === notification.userId &&
      n.title === notification.title &&
      n.message === notification.message &&
      Math.abs(new Date(n.createdAt).getTime() - new Date(notification.createdAt).getTime()) < 5 * 60 * 1000
    );
    if (isDuplicate) return notification;

    this.notifications.unshift(notification);
    this.persist('notifications', this.notifications);
    return notification;
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist('notifications', this.notifications);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // AUDIT LOGS
  // ═════════════════════════════════════════════════════════════════════════
  public getAllAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public getAuditLogsBySalon(salonId: string): AuditLog[] {
    return this.auditLogs.filter(a => a.salonId === salonId);
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'createdAt'>): void {
    const entry: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    this.persist('audit_logs', this.auditLogs);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CUSTOMER PROFILES & PREFERENCES
  // ═════════════════════════════════════════════════════════════════════════
  public updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): CustomerProfile {
    let profile = this.customerProfiles.find(p => p.userId === userId);
    if (!profile) {
      profile = {
        id: `cp-${Date.now()}`,
        userId,
        loyaltyPoints: 100,
        ...updates,
      };
      this.customerProfiles.push(profile);
    } else {
      Object.assign(profile, updates);
    }
    this.persist('customer_profiles', this.customerProfiles);
    return profile;
  }

  public updateCustomerNotes(userId: string, notes: string): boolean {
    this.updateCustomerProfile(userId, { preferredNotes: notes });
    return true;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // FAVORITES PERSISTENCE
  // ═════════════════════════════════════════════════════════════════════════
  public getFavorites(userId: string): CustomerFavorites {
    let fav = this.favorites.find(f => f.userId === userId);
    if (!fav) {
      fav = {
        userId,
        salonIds: [],
        serviceIds: [],
        staffIds: [],
      };
      this.favorites.push(fav);
      this.persist('favorites', this.favorites);
    }
    return fav;
  }

  public toggleFavorite(userId: string, type: 'salon' | 'service' | 'staff', itemId: string): boolean {
    const fav = this.getFavorites(userId);
    const key = type === 'salon' ? 'salonIds' : type === 'service' ? 'serviceIds' : 'staffIds';
    const index = fav[key].indexOf(itemId);
    let isNowFavorite = false;

    if (index > -1) {
      fav[key].splice(index, 1);
      isNowFavorite = false;
    } else {
      fav[key].push(itemId);
      isNowFavorite = true;
    }

    this.persist('favorites', this.favorites);
    return isNowFavorite;
  }

  public isFavorite(userId: string, typeOrItemId: 'salon' | 'service' | 'staff' | string, itemId?: string): boolean {
    const fav = this.getFavorites(userId);
    if (!itemId) {
      // 2-argument overload: (userId, itemId)
      return fav.salonIds.includes(typeOrItemId) || fav.serviceIds.includes(typeOrItemId) || fav.staffIds.includes(typeOrItemId);
    }
    const key = typeOrItemId === 'salon' ? 'salonIds' : typeOrItemId === 'service' ? 'serviceIds' : 'staffIds';
    return fav[key].includes(itemId);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CATALOG RETRIEVAL HELPERS
  // ═════════════════════════════════════════════════════════════════════════
  public getAllServices(): Service[] {
    return this.services.filter(s => s.isActive);
  }

  public getAllCategories(): ServiceCategory[] {
    return this.categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getAllOffers(): Offer[] {
    return this.offers.filter(o => o.isActive);
  }

  public getBranchById(id: string): SalonBranch | undefined {
    return this.branches.find(b => b.id === id);
  }

  public getLeaveRequestsByStaff(staffProfileId: string): LeaveRequest[] {
    return this.leaveRequests.filter(l => l.staffProfileId === staffProfileId);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // REVIEWS & MODERATION
  // ═════════════════════════════════════════════════════════════════════════
  public getReviewsByCustomer(customerId: string): Review[] {
    return this.reviews.filter(r => r.customerId === customerId);
  }

  public canReviewAppointment(aptIdOrCustomerId: string, customerOrAptId: string): { eligible: boolean; reason?: string } {
    let apt = this.appointments.find(a => a.id === aptIdOrCustomerId);
    let customerId = customerOrAptId;
    if (!apt) {
      apt = this.appointments.find(a => a.id === customerOrAptId);
      customerId = aptIdOrCustomerId;
    }
    if (!apt) return { eligible: false, reason: 'Appointment does not exist.' };
    if (apt.customerId !== customerId) return { eligible: false, reason: 'Unauthorized.' };
    if (apt.status !== 'completed') return { eligible: false, reason: 'Only completed rituals can receive reviews.' };
    
    const existing = this.reviews.find(r => r.appointmentId === apt.id);
    if (existing) return { eligible: false, reason: 'You have already reviewed this appointment.' };

    return { eligible: true };
  }

  public addReviewReply(reviewId: string, reply: string): Review {
    const rev = this.reviews.find(r => r.id === reviewId);
    if (!rev) throw new Error(`Review ${reviewId} not found`);
    rev.reply = reply;
    this.persist('reviews', this.reviews);
    return rev;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RESCHEDULING & CANCELLATION ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  public rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newStartTime: string,
    newStaffId?: string,
    changedByUserId?: string,
    changedByName?: string
  ): Appointment {
    const apt = this.appointments.find(a => a.id === appointmentId);
    if (!apt) throw new Error(`Appointment ${appointmentId} not found`);

    if (['completed', 'cancelled', 'no_show'].includes(apt.status)) {
      throw new Error(`Cannot reschedule an appointment in status '${apt.status}'.`);
    }

    const staffId = newStaffId || apt.staffId;
    const staff = this.getStaffById(staffId);
    if (!staff) throw new Error('Staff not found');

    // Calculate new end time
    const [h, m] = newStartTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + apt.durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Conflict check on target staff and date
    const hasConflict = this.appointments.some(other => {
      if (other.id === appointmentId) return false;
      if (other.staffId !== staffId) return false;
      if (other.appointmentDate !== newDate) return false;
      if (['cancelled', 'no_show'].includes(other.status)) return false;

      return (newStartTime < other.endTime && newEndTime > other.startTime);
    });

    if (hasConflict) {
      throw new Error(`Stylist ${staff.displayName} is already booked on ${newDate} between ${newStartTime} and ${newEndTime}.`);
    }

    const oldDate = apt.appointmentDate;
    const oldTime = apt.startTime;

    apt.appointmentDate = newDate;
    apt.startTime = newStartTime;
    apt.endTime = newEndTime;
    apt.staffId = staffId;
    apt.staffName = staff.displayName;
    apt.updatedAt = new Date().toISOString();

    this.persist('appointments', this.appointments);

    // Record Immutable Audit History
    this.addStatusHistory({
      id: `sh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      appointmentId: apt.id,
      salonId: apt.salonId,
      fromStatus: apt.status,
      toStatus: apt.status,
      changedByUserId: changedByUserId || apt.customerId,
      changedByName: changedByName || apt.customerName,
      reason: `Rescheduled from ${oldDate} ${oldTime} to ${newDate} ${newStartTime}`,
      createdAt: new Date().toISOString(),
    });

    this.createNotification({
      id: `notif-${Date.now()}`,
      userId: apt.customerId,
      salonId: apt.salonId,
      title: 'Appointment Rescheduled',
      message: `Your ritual has been rescheduled to ${newDate} at ${newStartTime} with ${staff.displayName}.`,
      type: 'appointment',
      isRead: false,
      link: `/customer/bookings/${apt.id}`,
      createdAt: new Date().toISOString(),
    });

    return apt;
  }

  public cancelAppointmentWithPolicy(
    appointmentId: string,
    userId: string,
    userName: string,
    reason: string
  ): Appointment {
    const apt = this.appointments.find(a => a.id === appointmentId);
    if (!apt) throw new Error(`Appointment ${appointmentId} not found`);

    const salon = this.getSalonById(apt.salonId);
    const noticeHours = salon?.settings?.cancellationNoticeHours || 24;

    // Check cancellation window
    const appointmentDateTime = new Date(`${apt.appointmentDate}T${apt.startTime}:00`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let isLateCancellation = false;
    if (hoursDifference < noticeHours) {
      isLateCancellation = true;
    }

    const cancellationReason = isLateCancellation
      ? `${reason} (Late Cancellation: within ${noticeHours}h notice period)`
      : reason;

    return this.transitionAppointmentStatus(
      appointmentId,
      'cancelled',
      userId,
      userName,
      cancellationReason
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WALK-IN & LIVE QUEUE ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  public getQueue(salonId: string, branchId?: string): QueueItem[] {
    return this.queueItems
      .filter(q => q.salonId === salonId && (!branchId || q.branchId === branchId))
      .sort((a, b) => a.position - b.position);
  }

  public addToQueue(item: {
    salonId: string;
    branchId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    customerId?: string;
    serviceId: string;
    serviceName: string;
    staffId?: string;
    staffName?: string;
    notes?: string;
  }): { success: boolean; item?: QueueItem; error?: string } {
    // Prevent accidental duplicate queue entry
    const existing = this.queueItems.find(
      q => q.salonId === item.salonId &&
           q.branchId === item.branchId &&
           ['waiting', 'next_in_line', 'in_service'].includes(q.status) &&
           ((item.customerId && q.customerId === item.customerId) ||
            (item.customerPhone && q.customerPhone === item.customerPhone) ||
            (item.customerName.toLowerCase() === q.customerName.toLowerCase()))
    );
    if (existing) {
      return { success: false, error: `${item.customerName} is already active in the salon queue.` };
    }

    const activeInQueue = this.queueItems.filter(
      q => q.salonId === item.salonId &&
           q.branchId === item.branchId &&
           ['waiting', 'next_in_line'].includes(q.status)
    );

    // Calculate wait time from queue workload
    const queueWorkloadMinutes = activeInQueue.reduce((acc, curr) => {
      const s = this.getServiceById(curr.serviceId);
      return acc + (s?.durationMinutes || 30);
    }, 0);

    const position = activeInQueue.length + 1;
    const estimatedWaitMinutes = queueWorkloadMinutes;

    const newQueueItem: QueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      salonId: item.salonId,
      branchId: item.branchId,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerEmail: item.customerEmail,
      customerId: item.customerId,
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      staffId: item.staffId,
      staffName: item.staffName,
      status: position === 1 ? 'next_in_line' : 'waiting',
      position,
      estimatedWaitMinutes,
      checkInTime: new Date().toISOString(),
      notes: item.notes,
      createdAt: new Date().toISOString(),
    };

    this.queueItems.push(newQueueItem);
    this.persist('queue', this.queueItems);
    return { success: true, item: newQueueItem };
  }

  public updateQueueStatus(id: string, status: QueueStatus, staffId?: string, staffName?: string): QueueItem | null {
    const item = this.queueItems.find(q => q.id === id);
    if (!item) return null;
    item.status = status;
    if (staffId) item.staffId = staffId;
    if (staffName) item.staffName = staffName;
    if (status === 'in_service') {
      item.serviceStartTime = new Date().toISOString();
      item.estimatedWaitMinutes = 0;
    } else if (status === 'completed' || status === 'cancelled') {
      item.completedTime = new Date().toISOString();
    }

    // Recalculate remaining active positions
    const active = this.queueItems
      .filter(q => q.salonId === item.salonId && q.branchId === item.branchId && ['waiting', 'next_in_line'].includes(q.status))
      .sort((a, b) => a.position - b.position);
    active.forEach((q, idx) => {
      q.position = idx + 1;
      if (idx === 0) q.status = 'next_in_line';
    });

    this.persist('queue', this.queueItems);
    return item;
  }

  public reorderQueue(id: string, direction: 'up' | 'down'): boolean {
    const active = this.queueItems
      .filter(q => ['waiting', 'next_in_line'].includes(q.status))
      .sort((a, b) => a.position - b.position);
    const index = active.findIndex(q => q.id === id);
    if (index === -1) return false;

    if (direction === 'up' && index > 0) {
      const temp = active[index].position;
      active[index].position = active[index - 1].position;
      active[index - 1].position = temp;
    } else if (direction === 'down' && index < active.length - 1) {
      const temp = active[index].position;
      active[index].position = active[index + 1].position;
      active[index + 1].position = temp;
    }
    active.sort((a, b) => a.position - b.position);
    active.forEach((q, idx) => {
      q.position = idx + 1;
      if (idx === 0) q.status = 'next_in_line';
    });
    this.persist('queue', this.queueItems);
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INVENTORY MOVEMENTS & AUDITABLE USAGE
  // ═══════════════════════════════════════════════════════════════════════════
  public getInventoryMovements(salonId: string, itemId?: string): InventoryMovement[] {
    return this.inventoryMovements
      .filter(m => m.salonId === salonId && (!itemId || m.itemId === itemId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public recordStockMovement(movement: {
    salonId: string;
    branchId: string;
    itemId: string;
    quantityDelta: number;
    reason: 'restock' | 'service_usage' | 'wastage' | 'adjustment' | 'manual';
    appointmentId?: string;
    performedByUserId: string;
    notes?: string;
  }): InventoryMovement {
    const item = this.inventory.find(i => i.id === movement.itemId);
    const itemName = item ? item.name : 'Salon Product';
    const currentQty = item ? item.quantity : 0;
    const newQuantity = Math.max(0, currentQty + movement.quantityDelta);

    if (item) {
      item.quantity = newQuantity;
      item.updatedAt = new Date().toISOString();
      this.persist('inventory', this.inventory);
    }

    const mov: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      salonId: movement.salonId,
      branchId: movement.branchId,
      itemId: movement.itemId,
      itemName,
      quantityDelta: movement.quantityDelta,
      newQuantity,
      reason: movement.reason,
      appointmentId: movement.appointmentId,
      performedByUserId: movement.performedByUserId,
      notes: movement.notes,
      createdAt: new Date().toISOString(),
    };
    this.inventoryMovements.push(mov);
    this.persist('inventory_movements', this.inventoryMovements);
    return mov;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OFFERS & CAMPAIGNS MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  public createOffer(offer: Offer): Offer {
    this.offers.push(offer);
    this.persist('offers', this.offers);
    return offer;
  }

  public updateOffer(id: string, updates: Partial<Offer>): Offer | null {
    const offer = this.offers.find(o => o.id === id);
    if (!offer) return null;
    Object.assign(offer, updates);
    this.persist('offers', this.offers);
    return offer;
  }

  public deleteOffer(id: string): boolean {
    const initialLen = this.offers.length;
    this.offers = this.offers.filter(o => o.id !== id);
    if (this.offers.length !== initialLen) {
      this.persist('offers', this.offers);
      return true;
    }
    return false;
  }

  public validateOffer(
    code: string,
    salonId: string,
    serviceId?: string,
    subtotal: number = 0
  ): { valid: boolean; offer?: Offer; discount: number; error?: string } {
    const offer = this.offers.find(
      o => o.code.toUpperCase() === code.toUpperCase() && o.salonId === salonId && o.isActive
    );
    if (!offer) return { valid: false, discount: 0, error: 'Invalid or inactive promotional code.' };
    
    const now = new Date().toISOString().split('T')[0];
    if (offer.validFrom && now < offer.validFrom) {
      return { valid: false, discount: 0, error: 'Promotion is not yet active.' };
    }
    if (offer.validTo && now > offer.validTo) {
      return { valid: false, discount: 0, error: 'Promotion has expired.' };
    }
    if (offer.maxUses && offer.usageCount >= offer.maxUses) {
      return { valid: false, discount: 0, error: 'Coupon usage limit reached.' };
    }
    if (offer.minSpend && subtotal < offer.minSpend) {
      return { valid: false, discount: 0, error: `Minimum spend of ₹${offer.minSpend} required.` };
    }
    if (offer.serviceId && serviceId && offer.serviceId !== serviceId) {
      return { valid: false, discount: 0, error: 'Code not applicable to this selected ritual.' };
    }

    let discount = 0;
    if (offer.discountPercent) {
      discount = Math.round((subtotal * offer.discountPercent) / 100);
    } else if (offer.discountAmount) {
      discount = Math.min(offer.discountAmount, subtotal);
    }
    return { valid: true, offer, discount };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEWS MODERATION & REPUTATION
  // ═══════════════════════════════════════════════════════════════════════════
  public deleteReview(id: string): boolean {
    const len = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id !== id);
    if (this.reviews.length !== len) {
      this.persist('reviews', this.reviews);
      return true;
    }
    return false;
  }

  public reportReview(id: string, reason: string): boolean {
    const rev = this.reviews.find(r => r.id === id);
    if (!rev) return false;
    this.logAudit({
      salonId: rev.salonId,
      userId: 'moderator',
      userEmail: 'support@glamoure.com',
      action: 'REVIEW_REPORTED',
      entity: 'reviews',
      entityId: id,
      metadata: { reason },
    });
    return true;
  }

  public getReviewsStats(salonId: string) {
    const list = this.getReviewsBySalon(salonId);
    if (!list.length) return { averageRating: 5.0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const sum = list.reduce((a, b) => a + b.rating, 0);
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(r => {
      const score = Math.round(r.rating);
      if (dist[score] !== undefined) dist[score]++;
    });
    return {
      averageRating: +(sum / list.length).toFixed(1),
      totalReviews: list.length,
      distribution: dist,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAVE MANAGEMENT & CONFLICT DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  public getLeaveRequests(salonId: string): LeaveRequest[] {
    return this.leaveRequests.filter(l => l.salonId === salonId);
  }

  public submitLeaveRequest(request: {
    salonId: string;
    staffProfileId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): LeaveRequest {
    return this.createLeaveRequest(request);
  }

  public createLeaveRequest(request: {
    salonId: string;
    staffProfileId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): LeaveRequest {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      salonId: request.salonId,
      staffProfileId: request.staffProfileId,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.leaveRequests.push(newReq);
    this.persist('leave_requests', this.leaveRequests);

    // Notify salon owner
    const salon = this.getSalonById(request.salonId);
    if (salon) {
      this.createNotification({
        id: `notif-${Date.now()}`,
        userId: salon.ownerId,
        salonId: salon.id,
        title: 'New Leave Request',
        message: `A team member requested leave from ${request.startDate} to ${request.endDate}.`,
        type: 'invitation',
        isRead: false,
        link: '/owner/team',
        createdAt: new Date().toISOString(),
      });
    }
    return newReq;
  }

  public getAffectedAppointments(staffProfileId: string, startDate: string, endDate: string): Appointment[] {
    return this.appointments.filter(a => {
      return a.staffId === staffProfileId &&
             ['pending', 'confirmed'].includes(a.status) &&
             a.appointmentDate >= startDate &&
             a.appointmentDate <= endDate;
    });
  }

  public updateLeaveRequestStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewerId: string
  ): { request: LeaveRequest | null; affectedAppointments: Appointment[] } {
    const req = this.leaveRequests.find(l => l.id === id);
    if (!req) return { request: null, affectedAppointments: [] };
    req.status = status;
    req.reviewedByUserId = reviewerId;
    req.reviewedAt = new Date().toISOString();
    this.persist('leave_requests', this.leaveRequests);

    const affected = status === 'approved' 
      ? this.getAffectedAppointments(req.staffProfileId, req.startDate, req.endDate)
      : [];

    // Notify staff member
    const staff = this.getStaffById(req.staffProfileId);
    if (staff) {
      this.createNotification({
        id: `notif-${Date.now()}`,
        userId: staff.userId,
        salonId: req.salonId,
        title: `Leave Request ${status === 'approved' ? 'Approved' : 'Declined'}`,
        message: `Your leave request for ${req.startDate} to ${req.endDate} has been ${status}.`,
        type: 'system',
        isRead: false,
        link: '/member/availability',
        createdAt: new Date().toISOString(),
      });
    }

    return { request: req, affectedAppointments: affected };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOMER CRM & SEGMENTATION
  // ═══════════════════════════════════════════════════════════════════════════
  public getCustomerSegments(salonId: string): {
    new: CustomerRecord[];
    returning: CustomerRecord[];
    frequent: CustomerRecord[];
    inactive: CustomerRecord[];
    highValue: CustomerRecord[];
  } {
    const appointments = this.getAppointmentsBySalon(salonId);
    const payments = this.getPaymentsBySalon(salonId).filter(p => p.status === 'successful');
    
    // Group by customer
    const customerMap = new Map<string, {
      customer: User;
      appointments: Appointment[];
      totalSpent: number;
      lastVisit?: string;
    }>();

    appointments.forEach(apt => {
      if (!customerMap.has(apt.customerId)) {
        const u = this.getUserById(apt.customerId) || {
          id: apt.customerId,
          fullName: apt.customerName,
          email: apt.customerEmail,
          phone: apt.customerPhone,
          isEmailVerified: true,
          createdAt: apt.createdAt,
          updatedAt: apt.createdAt,
        };
        customerMap.set(apt.customerId, {
          customer: u,
          appointments: [],
          totalSpent: 0,
        });
      }
      const entry = customerMap.get(apt.customerId)!;
      entry.appointments.push(apt);
      if (!entry.lastVisit || apt.appointmentDate > entry.lastVisit) {
        entry.lastVisit = apt.appointmentDate;
      }
    });

    payments.forEach(p => {
      if (customerMap.has(p.customerId)) {
        customerMap.get(p.customerId)!.totalSpent += p.amount;
      }
    });

    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newCust: CustomerRecord[] = [];
    const returningCust: CustomerRecord[] = [];
    const frequentCust: CustomerRecord[] = [];
    const inactiveCust: CustomerRecord[] = [];
    const highValueCust: CustomerRecord[] = [];

    customerMap.forEach((val, customerId) => {
      const aptCount = val.appointments.length;
      const calculatedSpent = val.totalSpent || aptCount * 4500;
      const record: CustomerRecord = {
        id: `crm-${customerId}`,
        userId: customerId,
        salonId,
        fullName: val.customer.fullName,
        email: val.customer.email,
        phone: val.customer.phone,
        totalAppointments: aptCount,
        totalSpent: calculatedSpent,
        lastVisitDate: val.lastVisit,
        loyaltyPoints: Math.floor(calculatedSpent / 100),
        createdAt: val.customer.createdAt,
      };

      if (aptCount <= 1) {
        newCust.push(record);
      } else if (aptCount >= 2 && aptCount < 4) {
        returningCust.push(record);
      } else if (aptCount >= 4) {
        frequentCust.push(record);
      }

      if (calculatedSpent >= 10000) {
        highValueCust.push(record);
      }

      if (val.lastVisit && val.lastVisit < sixtyDaysAgo) {
        inactiveCust.push(record);
      }
    });

    return {
      new: newCust,
      returning: returningCust,
      frequent: frequentCust,
      inactive: inactiveCust,
      highValue: highValueCust,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINANCIAL RECONCILIATION & REPORTING
  // ═══════════════════════════════════════════════════════════════════════════
  public getDailyReconciliation(salonId: string, targetDate?: string) {
    const date = targetDate || new Date().toISOString().split('T')[0];
    const payments = this.getPaymentsBySalon(salonId).filter(
      p => p.status === 'successful' && (p.createdAt || '').startsWith(date)
    );
    const cashTotal = payments.filter(p => p.method === 'cash').reduce((a, b) => a + b.amount, 0);
    const cardTotal = payments.filter(p => p.method === 'card').reduce((a, b) => a + b.amount, 0);
    const upiTotal = payments.filter(p => p.method === 'upi').reduce((a, b) => a + b.amount, 0);
    const totalRevenue = cashTotal + cardTotal + upiTotal;
    const apts = this.getAppointmentsBySalon(salonId).filter(a => a.appointmentDate === date);

    return {
      date,
      cashTotal,
      cardTotal,
      upiTotal,
      totalRevenue,
      appointmentCount: apts.length,
      openingBalance: 5000,
      cashReceived: cashTotal,
      digitalSettled: cardTotal + upiTotal,
      totalReconciled: 5000 + totalRevenue,
    };
  }

  public getMonthlyRevenueSummary(salonId: string, year = 2026, month = 11) {
    const payments = this.getPaymentsBySalon(salonId).filter(p => p.status === 'successful');
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const monthPayments = payments.filter(p => p.createdAt.startsWith(prefix));
    const totalRevenue = monthPayments.reduce((a, b) => a + b.amount, 0);

    const breakdownMap = new Map<string, number>();
    monthPayments.forEach(p => {
      const day = p.createdAt.split('T')[0];
      breakdownMap.set(day, (breakdownMap.get(day) || 0) + p.amount);
    });

    const breakdown = Array.from(breakdownMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { totalRevenue, breakdown };
  }

  public getQueueBySalon(salonId: string, branchId?: string): QueueItem[] {
    return this.getQueue(salonId, branchId);
  }

  public getCustomerRecordsBySalon(salonId: string): CustomerRecord[] {
    const segs = this.getCustomerSegments(salonId);
    const map = new Map<string, CustomerRecord>();
    [...segs.new, ...segs.returning, ...segs.frequent, ...segs.inactive, ...segs.highValue].forEach(c => {
      map.set(c.id, c);
    });
    return Array.from(map.values());
  }
}

// Singleton database instance across application
export const db = new AppDatabase();
