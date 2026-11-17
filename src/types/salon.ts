export interface Salon {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
  ownerId: string;
  rating?: number;
  reviewCount?: number;
  onboardingCompleted: boolean;
  settings: SalonSettings;
  createdAt: string;
  updatedAt: string;
}

export interface SalonSettings {
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositPercentage: number;
  cancellationNoticeHours: number;
  bufferMinutesBetweenAppointments: number;
  autoConfirmAppointments: boolean;
  businessHours: {
    dayOfWeek: number; // 0=Sunday, 1=Monday ...
    open: string;
    close: string;
    isOpen: boolean;
  }[];
}

export interface SalonBranch {
  id: string;
  salonId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  salonId: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  salonId: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  bufferMinutes: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  salonId: string;
  code: string;
  title: string;
  description?: string;
  type?: 'percentage' | 'fixed' | 'bundle' | 'first_visit';
  discountPercent?: number;
  discountAmount?: number;
  serviceId?: string;
  branchId?: string;
  validFrom: string;
  validTo: string;
  minSpend?: number;
  maxUses?: number;
  usageCount: number;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  salonId: string;
  branchId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minThreshold: number;
  reorderThreshold: number;
  unitPrice: number;
  price: number;
  costPrice: number;
  unit?: string;
  supplier?: string;
  updatedAt: string;
}
