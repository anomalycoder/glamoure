import { db } from '../database/db';
import type { User, AuthSession, UserRole } from '../types/auth';

const SESSION_KEY = 'glamoure_auth_session_v1';

export class AuthService {
  /**
   * Register a new user
   */
  public static async register(params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
    salonName?: string;
  }): Promise<AuthSession> {
    const existing = db.findUserByEmail(params.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    if (params.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const userId = `user-${Date.now()}`;
    const user = db.createUser({
      id: userId,
      email: params.email.trim().toLowerCase(),
      fullName: params.fullName.trim(),
      phone: params.phone,
      passwordHash: params.password, // In real backend: bcrypt.hash
      isEmailVerified: true, // Simulation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const chosenRole: UserRole = params.role || 'customer';
    let salonId: string | undefined = undefined;

    if (chosenRole === 'salon_owner') {
      const newSalon = db.createSalon({
        id: `salon-${Date.now()}`,
        name: params.salonName || `${params.fullName}'s Salon`,
        slug: (params.salonName || `${params.fullName}-salon`).toLowerCase().replace(/\s+/g, '-'),
        phone: params.phone || '+91 98765 00000',
        email: params.email,
        address: 'Bespoke Avenue',
        city: 'Hyderabad',
        country: 'India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        ownerId: userId,
        onboardingCompleted: true,
        settings: {
          allowOnlineBooking: true,
          requireDeposit: false,
          depositPercentage: 20,
          cancellationNoticeHours: 24,
          bufferMinutesBetweenAppointments: 10,
          autoConfirmAppointments: true,
          businessHours: [
            { dayOfWeek: 0, open: '10:00', close: '19:00', isOpen: true },
            { dayOfWeek: 1, open: '09:00', close: '20:00', isOpen: true },
            { dayOfWeek: 2, open: '09:00', close: '20:00', isOpen: true },
            { dayOfWeek: 3, open: '09:00', close: '20:00', isOpen: true },
            { dayOfWeek: 4, open: '09:00', close: '20:00', isOpen: true },
            { dayOfWeek: 5, open: '09:00', close: '20:00', isOpen: true },
            { dayOfWeek: 6, open: '09:00', close: '20:00', isOpen: true },
          ],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      salonId = newSalon.id;

      db.addMembership({
        id: `m-${Date.now()}`,
        userId,
        salonId: newSalon.id,
        role: 'salon_owner',
        permissions: [
          'appointments:read', 'appointments:write', 'appointments:status', 'appointments:cancel',
          'services:read', 'services:write', 'staff:read', 'staff:write', 'staff:schedule',
          'customers:read', 'customers:write', 'inventory:read', 'inventory:write',
          'billing:read', 'billing:write', 'analytics:read', 'settings:manage', 'branches:manage'
        ],
        status: 'active',
        joinedAt: new Date().toISOString(),
      });
    } else {
      // Default to Glamouré Sanctuary membership
      const defaultSalon = db.getAllSalons()[0];
      if (defaultSalon) {
        salonId = defaultSalon.id;
        db.addMembership({
          id: `m-${Date.now()}`,
          userId,
          salonId: defaultSalon.id,
          role: chosenRole,
          permissions: chosenRole === 'salon_member' 
            ? ['appointments:read', 'appointments:status', 'services:read', 'staff:schedule']
            : ['appointments:read', 'appointments:write', 'appointments:cancel'],
          status: 'active',
          joinedAt: new Date().toISOString(),
        });
      }
    }

    if (chosenRole === 'customer') {
      db.createCustomerProfile({
        id: `cp-${userId}`,
        userId,
        loyaltyTier: 'Silver',
        loyaltyPoints: 100,
        allergies: 'None recorded',
        preferredNotes: '',
      });
    }

    db.logAudit({
      userId,
      userEmail: params.email,
      action: 'USER_REGISTERED',
      entity: 'users',
      entityId: userId,
      metadata: { role: chosenRole, salonId },
    });

    return this.createSession(user, chosenRole, salonId);
  }

  /**
   * Log in user
   */
  public static async login(email: string, password: string): Promise<AuthSession> {
    const userRecord = db.findUserByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid email or password.');
    }

    if (userRecord.passwordHash !== password) {
      throw new Error('Invalid email or password.');
    }

    // OWASP & Access Control: Block deactivated accounts
    if (userRecord.isActive === false) {
      throw new Error('This account has been deactivated. Please contact concierge support.');
    }

    const memberships = db.getUserMemberships(userRecord.id);
    const activeMembership = memberships[0];

    // Block suspended memberships
    if (activeMembership && activeMembership.status === 'suspended') {
      throw new Error('Your salon membership has been suspended. Please contact the salon owner.');
    }

    const role: UserRole = activeMembership ? activeMembership.role : 'customer';
    const salonId = activeMembership?.salonId || db.getAllSalons()[0]?.id;

    const { passwordHash, ...user } = userRecord;

    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      entity: 'users',
      entityId: user.id,
      metadata: { role, salonId },
    });

    return this.createSession(user, role, salonId);
  }

  /**
   * Logout user
   */
  public static logout(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
  }

  /**
   * Get currently persisted session
   */
  public static getCurrentSession(): AuthSession | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const session: AuthSession = JSON.parse(stored);
          if (new Date(session.expiresAt).getTime() > Date.now()) {
            return session;
          }
          this.logout();
        }
      }
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    return null;
  }

  /**
   * Switch active role or tenant/salon for multi-role user
   */
  public static switchRole(
    sessionOrRole: AuthSession | UserRole,
    targetRoleOrSalonId?: UserRole | string,
    targetSalonIdParam?: string
  ): AuthSession {
    let currentSession: AuthSession;
    let targetRole: UserRole;
    let targetSalonId: string | undefined;

    if (typeof sessionOrRole === 'string') {
      const stored = this.getCurrentSession();
      if (!stored) throw new Error('No active session to switch roles');
      currentSession = stored;
      targetRole = sessionOrRole as UserRole;
      targetSalonId = targetRoleOrSalonId as string | undefined;
    } else {
      currentSession = sessionOrRole;
      targetRole = targetRoleOrSalonId as UserRole;
      targetSalonId = targetSalonIdParam;
    }

    const memberships = db.getUserMemberships(currentSession.user.id);
    const targetMembership = memberships.find(m => 
      m.role === targetRole && (!targetSalonId || m.salonId === targetSalonId)
    );

    const activeSalonId = targetSalonId || targetMembership?.salonId || currentSession.activeSalonId;

    const updatedSession: AuthSession = {
      ...currentSession,
      activeRole: targetRole,
      activeSalonId,
      salonId: activeSalonId,
      activeMembershipId: targetMembership?.id,
      memberships,
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    }

    db.logAudit({
      userId: currentSession.user.id,
      userEmail: currentSession.user.email,
      action: 'ROLE_SWITCHED',
      entity: 'auth_session',
      entityId: currentSession.user.id,
      metadata: { targetRole, activeSalonId },
    });

    return updatedSession;
  }

  /**
   * Forgot password request simulation
   */
  public static async forgotPassword(email: string): Promise<string> {
    const user = db.findUserByEmail(email);
    if (!user) {
      // Security best practice: don't reveal existence
      return 'If your email is registered, password recovery instructions have been sent.';
    }

    const resetToken = `rst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'users',
      entityId: user.id,
      metadata: { resetToken },
    });

    return `Password reset token generated: ${resetToken}`;
  }

  /**
   * Reset password with token
   */
  public static async resetPassword(userId: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }
    db.updatePassword(userId, newPassword);

    db.logAudit({
      userId,
      userEmail: 'system',
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'users',
      entityId: userId,
    });
  }

  private static createSession(user: User, role: UserRole, salonId?: string): AuthSession {
    const memberships = db.getUserMemberships(user.id);
    const activeMembership = memberships.find(m => m.role === role);

    const effectiveSalonId = salonId || memberships[0]?.salonId;
    const session: AuthSession = {
      token: `jwt-${user.id}-${Date.now()}`,
      user,
      activeRole: role,
      role,
      activeSalonId: effectiveSalonId,
      salonId: effectiveSalonId,
      activeMembershipId: activeMembership?.id,
      memberships,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('Failed to save session', e);
    }

    return session;
  }
}
