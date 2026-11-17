export interface Notification {
  id: string;
  userId: string;
  salonId?: string;
  title: string;
  message: string;
  type: 'appointment' | 'system' | 'reminder' | 'payment' | 'invitation';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  salonId?: string;
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  salonId: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  staffId: string;
  staffName: string;
  rating: number; // 1 to 5
  comment: string;
  reply?: string;
  createdAt: string;
}

export interface CustomerRecord {
  id: string; // Customer profile ID or User ID
  userId: string;
  salonId: string;
  fullName: string;
  email: string;
  phone?: string;
  totalAppointments: number;
  totalSpent: number;
  lastVisitDate?: string;
  loyaltyPoints: number;
  notes?: string;
  createdAt: string;
}

export interface CustomerFavorites {
  userId: string;
  salonIds: string[];
  serviceIds: string[];
  staffIds: string[];
}
