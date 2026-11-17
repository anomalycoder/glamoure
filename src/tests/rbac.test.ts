import { describe, it, expect } from 'vitest';
import { RbacService } from '../services/rbacService';
import { db } from '../database/db';
import type { UserRole } from '../types/auth';

describe('Glamouré Role-Based Access Control (RBAC) & Tenant Isolation', () => {
  const jubileeSalonId = 'salon-glamoure-jubilee';
  const sohoSalonId = 'salon-glamoure-soho';

  it('should grant full administrative permissions to Salon Owner for their salon', () => {
    // Elena Vance is owner of Jubilee salon
    const hasWriteService = RbacService.hasPermission(
      'user-owner-elena',
      jubileeSalonId,
      'services:write'
    );
    expect(hasWriteService).toBe(true);

    const hasManageSettings = RbacService.hasPermission(
      'user-owner-elena',
      jubileeSalonId,
      'settings:manage'
    );
    expect(hasManageSettings).toBe(true);

    const hasBillingWrite = RbacService.hasPermission(
      'user-owner-elena',
      jubileeSalonId,
      'billing:write'
    );
    expect(hasBillingWrite).toBe(true);
  });

  it('should enforce multi-tenant isolation: Salon Owner cannot manage another salon', () => {
    // Elena is owner of Jubilee, not SoHo
    const canManageSoho = RbacService.hasPermission(
      'user-owner-elena',
      sohoSalonId,
      'settings:manage'
    );
    expect(canManageSoho).toBe(false);

    const canAccessSoho = RbacService.canAccessSalon('user-owner-elena', sohoSalonId);
    expect(canAccessSoho).toBe(false);
  });

  it('should grant operational floor permissions to Salon Members (Staff)', () => {
    // Aria Chen is staff member at Jubilee salon
    const canUpdateStatus = RbacService.hasPermission(
      'user-member-aria',
      jubileeSalonId,
      'appointments:status'
    );
    expect(canUpdateStatus).toBe(true);

    const canViewSchedule = RbacService.hasPermission(
      'user-member-aria',
      jubileeSalonId,
      'staff:schedule'
    );
    expect(canViewSchedule).toBe(true);
  });

  it('should restrict financial and business settings access from Salon Members', () => {
    // Staff should NOT be able to modify salon settings or financial ledgers
    const canManageSettings = RbacService.hasPermission(
      'user-member-aria',
      jubileeSalonId,
      'settings:manage'
    );
    expect(canManageSettings).toBe(false);

    const canWriteBilling = RbacService.hasPermission(
      'user-member-aria',
      jubileeSalonId,
      'billing:write'
    );
    expect(canWriteBilling).toBe(false);
  });

  it('should allow customers to book and cancel their appointments but restrict staff data', () => {
    // Sophia Reynolds is a customer
    const canReadApts = RbacService.hasPermission(
      'user-customer-sophia',
      jubileeSalonId,
      'appointments:read'
    );
    expect(canReadApts).toBe(true);

    const canManageInventory = RbacService.hasPermission(
      'user-customer-sophia',
      jubileeSalonId,
      'inventory:write'
    );
    expect(canManageInventory).toBe(false);
  });

  it('should validate route access correctly by user role', () => {
    expect(RbacService.canAccessRoute('salon_owner', '/owner/dashboard')).toBe(true);
    expect(RbacService.canAccessRoute('salon_owner', '/owner/payments')).toBe(true);
    expect(RbacService.canAccessRoute('salon_member', '/owner/settings')).toBe(false);
    expect(RbacService.canAccessRoute('customer', '/owner/dashboard')).toBe(false);

    expect(RbacService.canAccessRoute('salon_member', '/member/dashboard')).toBe(true);
    expect(RbacService.canAccessRoute('customer', '/member/dashboard')).toBe(false);

    expect(RbacService.canAccessRoute('customer', '/customer/bookings')).toBe(true);
  });
});
