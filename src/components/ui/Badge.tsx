import React from 'react';
import type { AppointmentStatus, PaymentStatus } from '../../types/appointment';

interface BadgeProps {
  children?: React.ReactNode;
  label?: string;
  status?: AppointmentStatus | PaymentStatus | 'active' | 'invited' | 'suspended' | string;
  variant?: AppointmentStatus | PaymentStatus | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'active' | 'invited' | 'suspended' | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, label: propLabel, status, variant, className = '' }) => {
  let styleClasses = 'bg-[#41332B]/10 text-[#41332B] border-[#41332B]/20';
  let label = propLabel || children;

  const key = status || variant;

  if (key) {
    switch (key) {
      case 'pending':
        styleClasses = 'bg-amber-500/10 text-amber-700 border-amber-500/30';
        label = label || 'Pending';
        break;
      case 'confirmed':
        styleClasses = 'bg-blue-500/10 text-blue-700 border-blue-500/30';
        label = label || 'Confirmed';
        break;
      case 'checked_in':
        styleClasses = 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30';
        label = label || 'Checked In';
        break;
      case 'in_progress':
        styleClasses = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40 animate-pulse';
        label = label || 'In Progress';
        break;
      case 'completed':
        styleClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
        label = label || 'Completed';
        break;
      case 'cancelled':
        styleClasses = 'bg-rose-500/10 text-rose-700 border-rose-500/30';
        label = label || 'Cancelled';
        break;
      case 'no_show':
        styleClasses = 'bg-stone-500/20 text-stone-700 border-stone-500/30';
        label = label || 'No Show';
        break;
      case 'paid':
        styleClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
        label = label || 'Paid';
        break;
      case 'deposit_paid':
        styleClasses = 'bg-teal-500/10 text-teal-700 border-teal-500/30';
        label = label || 'Deposit Paid';
        break;
      case 'unpaid':
        styleClasses = 'bg-amber-500/10 text-amber-700 border-amber-500/30';
        label = label || 'Unpaid';
        break;
      case 'active':
        styleClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
        label = label || 'Active';
        break;
      case 'success':
        styleClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
        label = label || 'Success';
        break;
      case 'warning':
        styleClasses = 'bg-amber-500/10 text-amber-700 border-amber-500/30';
        label = label || 'Warning';
        break;
      case 'error':
        styleClasses = 'bg-rose-500/10 text-rose-700 border-rose-500/30';
        label = label || 'Error';
        break;
      case 'info':
        styleClasses = 'bg-blue-500/10 text-blue-700 border-blue-500/30';
        label = label || 'Info';
        break;
      default:
        styleClasses = 'bg-[#41332B]/10 text-[#41332B] border-[#41332B]/20';
        label = label || key;
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-wider border ${styleClasses} ${className}`}
    >
      {label}
    </span>
  );
};
