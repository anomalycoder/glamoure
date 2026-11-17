import React from 'react';
import { useUiTheme, type UiTheme } from './ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  theme?: UiTheme;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  theme,
  className = '',
  id,
  ...props
}) => {
  const contextTheme = useUiTheme();
  const activeTheme = theme || contextTheme;
  const isDark = activeTheme === 'dark';

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const labelStyles = isDark ? 'text-[#a89582]' : 'text-[#41332B]';
  const iconStyles = isDark ? 'text-[#a89582]' : 'text-[#806B5C]';

  const baseInputStyles = isDark
    ? 'bg-[#1c1410] text-[#f5eee6] placeholder-[#a89582]/40 border-[#38271e] hover:border-[#b99470]/40 focus:border-[#b99470] focus:ring-1 focus:ring-[#b99470]'
    : 'bg-white text-[#241812] placeholder-[#806B5C]/50 border-[#41332B]/15 hover:border-[#41332B]/30 focus:border-[#41332B] focus:ring-1 focus:ring-[#41332B]';

  const errorInputStyles = 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500';

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-[11.5px] font-['Montserrat'] font-medium uppercase tracking-wider ${labelStyles}`}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className={`absolute left-3.5 pointer-events-none ${iconStyles}`}>
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-[13px] font-['Plus_Jakarta_Sans'] transition-all focus:outline-none ${
            icon ? 'pl-10' : ''
          } ${error ? errorInputStyles : baseInputStyles} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-[11px] text-rose-400 font-['Plus_Jakarta_Sans'] mt-0.5">{error}</span>
      ) : helperText ? (
        <span className={`text-[11px] font-['Plus_Jakarta_Sans'] mt-0.5 ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
