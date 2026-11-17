import React, { useRef, useState, useEffect } from 'react';
import { Move } from 'lucide-react';

interface DraggableElementProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  label,
  x,
  y,
  isEditMode,
  isSelected,
  onSelect,
  onMove,
  children,
  className = '',
  style = {},
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startMouseX: number; startMouseY: number; startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    // Don't drag if clicking directly on a form input or button when not in edit handle
    onSelect();
    e.stopPropagation();

    setIsDragging(true);
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: x,
      startY: y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startMouseX;
      const dy = e.clientY - dragStartRef.current.startMouseY;
      const newX = Math.round(dragStartRef.current.startX + dx);
      const newY = Math.round(dragStartRef.current.startY + dy);
      onMove(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMove]);

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: `translate(${x}px, ${y}px)`,
    transition: isDragging ? 'none' : 'box-shadow 0.2s ease, border-color 0.2s ease',
  };

  if (!isEditMode) {
    return (
      <div data-element-id={id} className={className} style={combinedStyle}>
        {children}
      </div>
    );
  }

  return (
    <div
      data-element-id={id}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          onSelect();
        }
      }}
      className={`relative group cursor-move select-none transition-all duration-150 ${className} ${
        isSelected
          ? 'ring-2 ring-[#efc9a5] ring-offset-2 ring-offset-black/50 rounded-lg'
          : 'hover:ring-1 hover:ring-white/40 hover:ring-offset-1 rounded-lg'
      }`}
      style={combinedStyle}
    >
      {/* Floating element label and drag badge on select or hover */}
      <div 
        className={`absolute -top-6 left-0 z-40 px-2 py-0.5 rounded text-[9.5px] font-['DM_Sans'] font-medium tracking-wider uppercase pointer-events-none flex items-center gap-1 transition-opacity whitespace-nowrap shadow-md ${
          isSelected
            ? 'opacity-100 bg-[#efc9a5] text-[#241812] font-semibold'
            : 'opacity-0 group-hover:opacity-100 bg-[#1e1a17]/90 text-white/90 border border-white/20'
        }`}
      >
        <Move className="w-2.5 h-2.5" />
        <span>{label}</span>
        {isSelected && <span className="opacity-70 text-[8.5px]">({x}px, {y}px)</span>}
      </div>

      {/* Children content */}
      {children}
    </div>
  );
};
