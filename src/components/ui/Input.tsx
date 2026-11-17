import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-['Montserrat'] font-medium uppercase tracking-wider text-[#41332B]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#806B5C] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full px-4 py-2.5 rounded-xl bg-white/80 border text-[13.5px] text-[#241812] placeholder-[#806B5C]/50 font-['Plus_Jakarta_Sans'] transition-all focus:outline-none focus:ring-2 focus:ring-[#41332B]/20 ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-[#41332B]/15 hover:border-[#41332B]/30 focus:border-[#41332B]'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-[11.5px] text-rose-600 font-['Plus_Jakarta_Sans'] mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-[11.5px] text-[#806B5C] font-['Plus_Jakarta_Sans'] mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
};
