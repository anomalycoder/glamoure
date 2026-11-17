export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';

export interface AppointmentStatusHistory {
  id: string;
  appointmentId: string;
  salonId: string;
  fromStatus: AppointmentStatus | null;
  toStatus: AppointmentStatus;
  changedByUserId: string;
  changedByName: string;
  reason?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  salonId: string;
  branchId: string;
  customerId: string; // User ID of customer
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  staffId: string;     // StaffProfile ID
  staffName: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string; // 'YYYY-MM-DD'
  startTime: string;       // '10:00'
  endTime: string;         // '11:00'
  durationMinutes: number;
  status: AppointmentStatus;
  price: number;
  depositAmount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  salonId: string;
  appointmentId: string;
  customerId: string;
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'issued' | 'paid' | 'void';
  issuedAt: string;
  paidAt?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  salonId: string;
  invoiceId?: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  method: 'card' | 'upi' | 'cash' | 'membership';
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  transactionReference: string;
  notes?: string;
  createdAt: string;
}

export type QueueStatus = 'waiting' | 'next_in_line' | 'in_service' | 'completed' | 'cancelled';

export interface QueueItem {
  id: string;
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
  status: QueueStatus;
  position: number;
  estimatedWaitMinutes: number;
  checkInTime: string;
  serviceStartTime?: string;
  completedTime?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  salonId: string;
  branchId: string;
  itemId: string;
  itemName: string;
  quantityDelta: number;
  newQuantity: number;
  reason: 'restock' | 'service_usage' | 'wastage' | 'adjustment' | 'manual';
  appointmentId?: string;
  performedByUserId: string;
  notes?: string;
  createdAt: string;
}
