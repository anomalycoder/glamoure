import React from 'react';

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
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-[#806B5C]">
        <div className="w-6 h-6 border-2 border-[#41332B] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-wider">
          Loading Data...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-16 border border-dashed border-[#41332B]/15 rounded-2xl flex flex-col items-center justify-center text-center text-[#806B5C] bg-white/40">
        <span className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#41332B] mb-1">
          {emptyMessage}
        </span>
        <span className="text-xs font-['Plus_Jakarta_Sans']">
          New entries will automatically appear here.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#41332B]/10 bg-white/70 shadow-sm backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#41332B]/10 bg-[#E8D8C7]/30 text-[#41332B]">
            {columns.map((col, idx) => (
              <th
                key={col.key || (col.accessor as string) || idx}
                className={`py-3.5 px-4 font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  col.className || ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#41332B]/5 font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] text-[#241812]">
          {data.map((row, rowIdx) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-[#F5EFE7]/80' : 'hover:bg-black/[0.01]'
              }`}
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
