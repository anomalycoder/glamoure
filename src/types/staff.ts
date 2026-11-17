export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type StaffRole = 'Manager' | 'Receptionist' | 'Hairstylist' | 'Beautician' | 'Nail Artist' | 'Spa Therapist' | 'Custom';

export interface StaffProfile {
  id: string;
  salonId: string;
  userId: string;
  branchId: string;
  displayName: string;
  title: string;
  role?: StaffRole | string;
  bio?: string;
  photoUrl?: string;
  avatarUrl?: string;
  phone?: string;
  servicesOffered: string[]; // Service IDs
  specialties?: string[];
  experienceYears?: number;
  commissionPercentage: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  joinedAt: string;
}

export interface WorkingHours {
  id: string;
  staffProfileId: string;
  salonId?: string;
  dayOfWeek: number | DayOfWeek | string;
  startTime: string; // '09:00'
  endTime: string;   // '18:00'
  isWorking: boolean;
}

export interface StaffAvailabilitySlot {
  time: string; // '09:00'
  available: boolean;
  isAvailable?: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface LeaveRequest {
  id: string;
  salonId: string;
  staffProfileId: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedByUserId?: string;
  reviewedAt?: string;
  createdAt: string;
}
