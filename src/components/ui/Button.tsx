import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'rounded';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-['Plus_Jakarta_Sans'] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99470] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#16110e]";

  const radiusStyles = shape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const sizeStyles = {
    sm: `px-3.5 py-1.5 text-xs ${radiusStyles} gap-1.5 min-h-[32px]`,
    md: `px-5 py-2 text-[13px] ${radiusStyles} gap-2 tracking-wide min-h-[38px]`,
    lg: `px-7 py-2.5 text-sm ${radiusStyles} gap-2.5 tracking-wider min-h-[44px]`,
  };

  const variants = {
    primary: 'bg-[#2B2118] hover:bg-[#1D1610] text-white shadow-xs border border-[#2B2118] active:scale-[0.99]',
    secondary: 'bg-[#F5EFE7] hover:bg-[#EBE2D8] text-[#2B2118] border border-[#E0D5C9] active:scale-[0.99]',
    outline: 'border border-[#D8CABE] hover:border-[#B99470] text-[#2B2118] dark:text-[#efc9a5] dark:border-white/15 bg-white dark:bg-transparent hover:bg-[#FAF6F1] dark:hover:bg-[#b99470]/10 active:scale-[0.99]',
    ghost: 'text-[#5C483A] hover:text-[#2B2118] hover:bg-[#FAF6F1] dark:text-[#efc9a5] dark:hover:text-white dark:hover:bg-white/5 bg-transparent active:scale-[0.99]',
    gold: 'bg-[#B99470] hover:bg-[#A68361] text-white font-medium shadow-xs active:scale-[0.99]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.99]',
  };

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children && <span>{children}</span>}
    </button>
  );
};
