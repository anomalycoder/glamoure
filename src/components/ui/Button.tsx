import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-['Plus_Jakarta_Sans'] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-full gap-1.5',
    md: 'px-5 py-2.5 text-[13px] rounded-full gap-2 tracking-wide',
    lg: 'px-7 py-3 text-sm rounded-full gap-2.5 tracking-wider',
  };

  const variants = {
    primary: 'bg-[#41332B] hover:bg-[#58463c] text-[#F5EFE7] shadow-sm hover:shadow active:scale-[0.99]',
    secondary: 'bg-[#E8D8C7] hover:bg-[#dfcebc] text-[#41332B] border border-[#41332B]/10 active:scale-[0.99]',
    outline: 'border border-[#41332B]/30 hover:border-[#41332B] text-[#41332B] bg-transparent hover:bg-[#41332B]/5 active:scale-[0.99]',
    ghost: 'text-[#41332B] hover:bg-[#41332B]/8 bg-transparent',
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
      <span>{children}</span>
    </button>
  );
};
