import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  title?: string;
  category?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before Treatment',
  afterAlt = 'After Transformation',
  title = 'Silk Balayage Transformation',
  category = 'HAIR COUTURE',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="flex flex-col items-start w-full max-w-xl mx-auto select-none">
      {/* Category and Title */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[2px] text-[#B99470] font-semibold">
          {category}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#806B5C]">
          Drag slider to compare
        </span>
      </div>

      {/* Interactive Slider Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-ew-resize shadow-[0_16px_36px_rgba(65,51,43,0.18)] border border-[#DCCBBB]/40"
      >
        {/* After Image (Background full layer) */}
        <img
          src={afterImage}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-['Plus_Jakarta_Sans'] font-medium tracking-wider text-white">
          Before
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-['Plus_Jakarta_Sans'] font-medium tracking-wider text-white">
          After
        </div>

        {/* Slider Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Thumb circle */}
          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#41332B] font-bold text-[10px]">
            ↔
          </div>
        </div>
      </div>

      {/* Bottom Title */}
      <h3 className="font-['Playfair_Display'] text-xl text-[#41332B] mt-3 font-normal">
        {title}
      </h3>
    </div>
  );
};
