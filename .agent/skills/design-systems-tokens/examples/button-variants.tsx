import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'champagne';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface EditorialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  children: React.ReactNode;
}

export const EditorialButton: React.FC<EditorialButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon = true,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Variant styles mapped directly to design tokens
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#41332B] text-[#fbf7f2] hover:bg-[#2e241e] active:scale-[0.98] shadow-md hover:shadow-lg',
    secondary: 'bg-[#ded1ca] text-[#41332B] hover:bg-[#cfbbb0] active:scale-[0.98] shadow-sm',
    outline: 'bg-transparent text-[#41332B] border border-[#41332B]/30 hover:border-[#41332B] hover:bg-[#41332B]/5 active:scale-[0.98]',
    champagne: 'bg-[#B99470] text-[#1d1511] hover:bg-[#aa845f] active:scale-[0.98] shadow-md hover:shadow-lg',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-5 py-2.5 text-[11px] tracking-[0.14em]',
    md: 'px-7 py-3.5 text-[12.5px] tracking-[0.14em]',
    lg: 'px-9 py-4 text-[14px] tracking-[0.16em]',
  };

  return (
    <button
      disabled={disabled}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full font-['Plus_Jakarta_Sans'] font-medium uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current opacity-80 group-hover:opacity-100" />
      )}
    </button>
  );
};
