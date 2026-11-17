import React from 'react';
import { useUiTheme, type UiTheme } from './ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  theme?: UiTheme;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  theme
}) => {
  const contextTheme = useUiTheme();
  const activeTheme = theme || contextTheme;

  const themeClasses = activeTheme === 'dark'
    ? 'bg-[#201511] border-[#38271e] text-[#f5eee6] hover:border-[#b99470]/30 shadow-[0_4px_24px_rgba(0,0,0,0.25)]'
    : 'bg-white border-[#E8DFD5] text-[#2B2118] hover:border-[#B99470]/40 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_16px_rgba(43,33,24,0.03)]';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition-all duration-200 ${themeClasses} ${
        onClick ? 'cursor-pointer active:scale-[0.995]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | { value: string; isPositive?: boolean };
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  theme?: UiTheme;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  theme,
}) => {
  const contextTheme = useUiTheme();
  const activeTheme = theme || contextTheme;

  const changeValue = typeof change === 'object' ? change.value : change;
  const isPos = typeof change === 'object' ? (change.isPositive ?? isPositive) : isPositive;

  const isDark = activeTheme === 'dark';

  return (
    <Card theme={activeTheme} className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className={`font-['Montserrat'] text-[11px] font-medium uppercase tracking-[0.14em] ${
          isDark ? 'text-[#a89582]' : 'text-[#7A6658]'
        }`}>
          {title}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10 text-[#efc9a5]' : 'bg-[#FAF6F1] border-[#E8DFD5] text-[#B99470]'
          }`}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className={`font-['Montserrat'] text-2xl sm:text-3xl font-light tracking-tight ${
          isDark ? 'text-[#f5eee6]' : 'text-[#2B2118]'
        }`}>
          {value}
        </div>

        {(changeValue || subtitle) && (
          <div className="flex items-center gap-2 mt-2 text-xs font-['Plus_Jakarta_Sans']">
            {changeValue && (
              <span
                className={`font-medium px-2 py-0.5 rounded text-[11px] ${
                  isPos 
                    ? (isDark ? 'text-emerald-300 bg-emerald-950/50 border border-emerald-800/40' : 'text-emerald-800 bg-emerald-50 border border-emerald-200')
                    : (isDark ? 'text-rose-300 bg-rose-950/50 border border-rose-800/40' : 'text-rose-800 bg-rose-50 border border-rose-200')
                }`}
              >
                {changeValue}
              </span>
            )}
            {subtitle && (
              <span className={`text-[11px] ${isDark ? 'text-[#a89582]' : 'text-[#7A6658]'}`}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
