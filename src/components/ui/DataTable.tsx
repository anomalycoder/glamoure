import React from 'react';
import { useUiTheme, type UiTheme } from './ThemeContext';

export interface Column<T> {
  key?: string;
  accessor?: string | keyof T;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptySubtitle?: string;
  isLoading?: boolean;
  theme?: UiTheme;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  emptySubtitle = 'New entries will automatically appear here.',
  isLoading = false,
  theme,
  className = '',
}: DataTableProps<T>) {
  const contextTheme = useUiTheme();
  const activeTheme = theme || contextTheme;
  const isDark = activeTheme === 'dark';

  if (isLoading) {
    return (
      <div className={`w-full py-16 flex flex-col items-center justify-center rounded-2xl border ${
        isDark ? 'bg-[#201511] border-[#38271e] text-[#a89582]' : 'bg-white border-[#E8DFD5] text-[#7A6658]'
      }`}>
        <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3 ${
          isDark ? 'border-[#b99470]' : 'border-[#2B2118]'
        }`} />
        <span className="text-xs font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-wider">
          Loading Data...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`w-full py-16 border rounded-2xl flex flex-col items-center justify-center text-center p-6 ${
        isDark
          ? 'bg-[#201511] border-[#38271e] text-[#a89582]'
          : 'bg-white border-[#E8DFD5] text-[#7A6658]'
      }`}>
        <span className={`font-['Montserrat'] text-sm uppercase tracking-wider mb-1 font-medium ${
          isDark ? 'text-[#f5eee6]' : 'text-[#2B2118]'
        }`}>
          {emptyMessage}
        </span>
        <span className="text-xs font-['Plus_Jakarta_Sans'] opacity-80">
          {emptySubtitle}
        </span>
      </div>
    );
  }

  const containerStyles = isDark
    ? 'border-[#38271e] bg-[#201511] text-[#f5eee6] shadow-xl'
    : 'border-[#E8DFD5] bg-white text-[#2B2118] shadow-xs';

  const headerStyles = isDark
    ? 'border-b border-[#38271e] bg-[#291d17] text-[#efc9a5]'
    : 'border-b border-[#E8DFD5] bg-[#FAF8F5] text-[#2B2118]';

  const dividerStyles = isDark
    ? 'divide-y divide-[#38271e]/60'
    : 'divide-y divide-[#E8DFD5]/60';

  const rowHoverStyles = (clickable?: boolean) => {
    if (isDark) {
      return clickable ? 'cursor-pointer hover:bg-[#2b1f19] active:bg-[#34241d]' : 'hover:bg-white/[0.02]';
    }
    return clickable ? 'cursor-pointer hover:bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]/50';
  };

  return (
    <div className={`w-full overflow-x-auto rounded-2xl border ${containerStyles} ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={headerStyles}>
            {columns.map((col, idx) => (
              <th
                key={col.key || (col.accessor as string) || idx}
                className={`py-3.5 px-4 text-[11px] font-['Montserrat'] font-semibold uppercase tracking-wider whitespace-nowrap ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${dividerStyles} font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px]`}>
          {data.map((row, rowIdx) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${rowHoverStyles(!!onRowClick)}`}
            >
              {columns.map((col, colIdx) => {
                const renderFn = col.cell || col.render;
                const fieldKey = (col.accessor || col.key || '') as keyof T;
                return (
                  <td key={col.key || (col.accessor as string) || colIdx} className={`py-3.5 px-4 align-middle ${col.className || ''}`}>
                    {renderFn ? renderFn(row, rowIdx) : ((row as any)[fieldKey] as React.ReactNode)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
