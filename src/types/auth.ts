export type UserRole = 'customer' | 'salon_owner' | 'salon_member' | 'system_admin';

export type Permission = 
  | 'appointments:read'
  | 'appointments:write'
  | 'appointments:status'
  | 'appointments:cancel'
  | 'services:read'
  | 'services:write'
  | 'staff:read'
  | 'staff:write'
  | 'staff:schedule'
  | 'customers:read'
  | 'customers:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'billing:read'
  | 'billing:write'
  | 'analytics:read'
  | 'settings:manage'
  | 'branches:manage';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  allergies?: string;
  preferredNotes?: string;
  hairType?: string;
  skinType?: string;
  preferredLocation?: string;
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  preferences?: {
    notes?: string;
    [key: string]: any;
  };
  loyaltyPoints: number;
  loyaltyTier?: string;
  emergencyContact?: string;
}

export interface SalonMembership {
  id: string;
  userId: string;
  salonId: string;
  branchId?: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'invited' | 'suspended';
  invitedAt?: string;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  salonId: string;
  branchId?: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  invitedByUserId: string;
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  activeRole: UserRole;
  role?: UserRole;
  activeSalonId?: string;
  salonId?: string;
  activeMembershipId?: string;
  memberships: SalonMembership[];
  expiresAt: string;
}
