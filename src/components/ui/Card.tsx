import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white/70 border border-[#41332B]/10 shadow-[0_4px_20px_rgba(65,51,43,0.04)] backdrop-blur-sm p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-[#41332B]/25 hover:shadow-[0_8px_25px_rgba(65,51,43,0.08)]' : ''
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
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  const changeValue = typeof change === 'object' ? change.value : change;
  const isPos = typeof change === 'object' ? (change.isPositive ?? isPositive) : isPositive;

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between text-[#806B5C] mb-3">
        <span className="font-['Montserrat'] text-[11px] font-medium uppercase tracking-[0.14em]">
          {title}
        </span>
        {icon && <div className="p-2 rounded-xl bg-[#E8D8C7]/50 text-[#41332B]">{icon}</div>}
      </div>

      <div>
        <div className="font-['Montserrat'] text-2xl sm:text-3xl font-light text-[#41332B] tracking-tight">
          {value}
        </div>

        {(changeValue || subtitle) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs font-['Plus_Jakarta_Sans']">
            {changeValue && (
              <span
                className={`font-semibold ${
                  isPos ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded'
                }`}
              >
                {changeValue}
              </span>
            )}
            {subtitle && <span className="text-[#806B5C]">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
