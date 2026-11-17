import React from 'react';
import type { AppointmentStatus, PaymentStatus } from '../../types/appointment';
import { useUiTheme, type UiTheme } from './ThemeContext';

interface BadgeProps {
  children?: React.ReactNode;
  label?: string;
  status?: AppointmentStatus | PaymentStatus | 'active' | 'invited' | 'suspended' | string;
  variant?: AppointmentStatus | PaymentStatus | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'active' | 'invited' | 'suspended' | string;
  theme?: UiTheme;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  label: propLabel, 
  status, 
  variant, 
  theme,
  className = '' 
}) => {
  const contextTheme = useUiTheme();
  const activeTheme = theme || contextTheme;
  const isDark = activeTheme === 'dark';

  let label = propLabel || children;
  const key = status || variant;

  let styleClasses = isDark
    ? 'bg-white/10 text-[#f5eee6] border-white/15'
    : 'bg-[#FAF6F1] text-[#2B2118] border-[#E0D5C9]';

  if (key) {
    switch (key) {
      case 'pending':
        styleClasses = isDark
          ? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
          : 'bg-amber-50 text-amber-800 border-amber-200';
        label = label || 'Pending';
        break;
      case 'confirmed':
        styleClasses = isDark
          ? 'bg-sky-950/50 text-sky-300 border-sky-800/40'
          : 'bg-sky-50 text-sky-800 border-sky-200';
        label = label || 'Confirmed';
        break;
      case 'checked_in':
        styleClasses = isDark
          ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/40'
          : 'bg-indigo-50 text-indigo-800 border-indigo-200';
        label = label || 'Checked In';
        break;
      case 'in_progress':
        styleClasses = isDark
          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = label || 'In Progress';
        break;
      case 'completed':
        styleClasses = isDark
          ? 'bg-teal-950/50 text-teal-300 border-teal-800/40'
          : 'bg-teal-50 text-teal-800 border-teal-200';
        label = label || 'Completed';
        break;
      case 'cancelled':
        styleClasses = isDark
          ? 'bg-rose-950/50 text-rose-300 border-rose-800/40'
          : 'bg-rose-50 text-rose-800 border-rose-200';
        label = label || 'Cancelled';
        break;
      case 'no_show':
        styleClasses = isDark
          ? 'bg-stone-800/60 text-stone-300 border-stone-700/40'
          : 'bg-stone-100 text-stone-700 border-stone-300';
        label = label || 'No Show';
        break;
      case 'paid':
        styleClasses = isDark
          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = label || 'Paid';
        break;
      case 'deposit_paid':
        styleClasses = isDark
          ? 'bg-teal-950/50 text-teal-300 border-teal-800/40'
          : 'bg-teal-50 text-teal-800 border-teal-200';
        label = label || 'Deposit Paid';
        break;
      case 'unpaid':
        styleClasses = isDark
          ? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
          : 'bg-amber-50 text-amber-800 border-amber-200';
        label = label || 'Unpaid';
        break;
      case 'active':
        styleClasses = isDark
          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = label || 'Active';
        break;
      case 'invited':
        styleClasses = isDark
          ? 'bg-sky-950/50 text-sky-300 border-sky-800/40'
          : 'bg-sky-50 text-sky-800 border-sky-200';
        label = label || 'Invited';
        break;
      case 'suspended':
        styleClasses = isDark
          ? 'bg-rose-950/50 text-rose-300 border-rose-800/40'
          : 'bg-rose-50 text-rose-800 border-rose-200';
        label = label || 'Suspended';
        break;
      case 'success':
        styleClasses = isDark
          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200';
        break;
      case 'warning':
        styleClasses = isDark
          ? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
          : 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'error':
        styleClasses = isDark
          ? 'bg-rose-950/50 text-rose-300 border-rose-800/40'
          : 'bg-rose-50 text-rose-800 border-rose-200';
        break;
      case 'info':
        styleClasses = isDark
          ? 'bg-sky-950/50 text-sky-300 border-sky-800/40'
          : 'bg-sky-50 text-sky-800 border-sky-200';
        break;
      case 'neutral':
      default:
        styleClasses = isDark
          ? 'bg-white/10 text-[#f5eee6] border-white/15'
          : 'bg-[#FAF6F1] text-[#2B2118] border-[#E0D5C9]';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-['Montserrat'] font-medium uppercase tracking-wider border select-none ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
};
