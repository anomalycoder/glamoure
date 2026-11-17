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
  const base = "inline-flex items-center justify-center font-['Plus_Jakarta_Sans'] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99470] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16110e]";

  const radiusStyles = shape === 'pill' ? 'rounded-full' : 'rounded-lg';

  const sizeStyles = {
    sm: `px-3 py-1.5 text-xs ${radiusStyles} gap-1.5 min-h-[32px]`,
    md: `px-5 py-2.5 text-[13px] ${radiusStyles} gap-2 tracking-wide min-h-[40px]`,
    lg: `px-7 py-3 text-sm ${radiusStyles} gap-2.5 tracking-wider min-h-[48px]`,
  };

  const variants = {
    primary: 'bg-[#41332B] hover:bg-[#58463c] text-[#F5EFE7] shadow-sm hover:shadow active:scale-[0.99] border border-[#58463c]/30',
    secondary: 'bg-[#E8D8C7] hover:bg-[#dfcebc] text-[#41332B] border border-[#41332B]/10 active:scale-[0.99]',
    outline: 'border border-[#b99470]/30 hover:border-[#b99470] text-[#efc9a5] hover:text-white bg-transparent hover:bg-[#b99470]/10 active:scale-[0.99]',
    ghost: 'text-[#efc9a5] hover:text-white hover:bg-white/5 bg-transparent active:scale-[0.99]',
    gold: 'bg-[#b99470] hover:bg-[#a37f5d] text-[#16110e] font-semibold shadow-md hover:shadow-lg active:scale-[0.99]',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm active:scale-[0.99]',
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
