import type { SalonMembership, UserRole, Permission } from '../types/auth';
import { db } from '../database/db';

export class RBACService {
  /**
   * Check if a membership contains a specific granular permission
   */
  public static hasPermission(
    membershipOrUserId: SalonMembership | string | undefined, 
    permissionOrSalonId: Permission | string,
    permissionParam?: Permission
  ): boolean {
    if (!membershipOrUserId) return false;

    // Direct (membership, permission) signature
    if (typeof membershipOrUserId === 'object') {
      const membership = membershipOrUserId as SalonMembership;
      const permission = permissionOrSalonId as Permission;
      if (membership.role === 'salon_owner') return true; // Owner has all permissions
      return membership.permissions.includes(permission);
    }

    // (userId, salonId, permission) signature
    const userId = membershipOrUserId as string;
    const salonId = permissionOrSalonId as string;
    const permission = permissionParam as Permission;

    const memberships = db.getUserMemberships(userId);
    const membership = memberships.find(m => m.salonId === salonId);
    if (!membership) return false;

    if (membership.role === 'salon_owner') return true;
    return membership.permissions.includes(permission);
  }

  /**
   * Verify if a user with active membership can access a specific salon's data
   */
  public static canAccessSalon(
    activeSalonIdOrUserId: string | undefined, 
    targetSalonId: string, 
    role?: UserRole
  ): boolean {
    if (!activeSalonIdOrUserId) return false;

    if (role) {
      if (role === 'customer') return true;
      return activeSalonIdOrUserId === targetSalonId;
    }

    // (userId, targetSalonId) signature
    const memberships = db.getUserMemberships(activeSalonIdOrUserId);
    return memberships.some(m => m.salonId === targetSalonId && m.status === 'active');
  }

  /**
   * Validate role can access a target route path
   */
  public static isRouteAllowedForRole(role: UserRole, pathname: string): boolean {
    if (pathname.startsWith('/customer')) {
      return role === 'customer' || role === 'salon_owner';
    }
    if (pathname.startsWith('/owner')) {
      return role === 'salon_owner';
    }
    if (pathname.startsWith('/member')) {
      return role === 'salon_member' || role === 'salon_owner';
    }
    return true; // Public route
  }

  public static canAccessRoute = RBACService.isRouteAllowedForRole;
}

export const RbacService = RBACService;
export const rbacService = RBACService;
