import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { renderFlourishText } from '../utils/flourishText';
import { 
  type ServicesDesignConfig, 
  DEFAULT_SERVICES_CONFIG 
} from '../types/services-design';

interface ServicesSectionProps {
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenAllServices: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBookingFor,
  onOpenAllServices,
}) => {
  const loadSavedConfig = (): ServicesDesignConfig => {
    try {
      const CURRENT_KEY = 'glamoure_services_design_config_v6';
      const saved = localStorage.getItem(CURRENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SERVICES_CONFIG,
          ...parsed,
          header: { ...DEFAULT_SERVICES_CONFIG.header, ...(parsed.header || {}) },
          hair: { ...DEFAULT_SERVICES_CONFIG.hair, ...(parsed.hair || {}) },
          skin: { 
            ...DEFAULT_SERVICES_CONFIG.skin, 
            ...(parsed.skin || {}),
            radius: { ...DEFAULT_SERVICES_CONFIG.skin.radius, ...(parsed.skin?.radius || {}) } 
          },
          nails: { 
            ...DEFAULT_SERVICES_CONFIG.nails, 
            ...(parsed.nails || {}),
            radius: { ...DEFAULT_SERVICES_CONFIG.nails.radius, ...(parsed.nails?.radius || {}) } 
          },
          spa: { 
            ...DEFAULT_SERVICES_CONFIG.spa, 
            ...(parsed.spa || {}),
            radius: { ...DEFAULT_SERVICES_CONFIG.spa.radius, ...(parsed.spa?.radius || {}) } 
          },
          stack: { ...DEFAULT_SERVICES_CONFIG.stack, ...(parsed.stack || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to load saved services design config', e);
    }
    return DEFAULT_SERVICES_CONFIG;
  };

  const [config] = useState<ServicesDesignConfig>(loadSavedConfig);

  return (
    <section 
      id="services" 
      className="relative w-full min-h-screen pt-20 sm:pt-24 lg:pt-24 pb-20 sm:pb-24 lg:pb-24 overflow-hidden flex items-center px-6 sm:px-10 lg:px-14 xl:px-16 bg-[#F5EFE7] text-[#41332B] select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          02 · EXPLORE SERVICES: Warm Ivory · #F5EFE7
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf6f1] via-[#F5EFE7] to-[#ede4d8] -z-10" />
      
      {/* Soft, Faded Ambient Arcs (Delicate faded espresso thread, no harshness) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-10"
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="none"
      >
        {/* Sweeping curve passing behind Hair and connecting to the right */}
        <path 
          d="M 240 440 C 380 180, 720 160, 920 360 S 1240 540, 1440 460" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
        {/* Soft bottom-right accent arc */}
        <path 
          d="M 1020 900 C 1160 780, 1320 760, 1440 800" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
        {/* Top-left subtle counter curve */}
        <path 
          d="M -20 180 C 140 180, 260 90, 360 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT CONTAINER (Centered strictly within 100vh with Equal Left & Right Padding)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
          
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: Eyebrow Tag + Large Heading + Subheader + Button
          ═════════════════════════════════════════════════════════ */}
          <div 
            className="lg:col-span-5 xl:col-span-5 flex flex-col justify-start items-start text-left transition-transform duration-150"
            style={{
              transform: `translate(${config.header.x}px, ${config.header.y}px)`,
            }}
          >
            {/* Text Group (Shifted slightly up, leaving button anchored) */}
            <div className="-translate-y-2 sm:-translate-y-2.5">
              {/* Eyebrow: SALON & STUDIO */}
              {config.header.eyebrow && (
                <div 
                  className="font-['Plus_Jakarta_Sans'] uppercase font-medium mb-2.5 sm:mb-3 text-[#806B5C]"
                  style={{
                    fontSize: `${config.header.eyebrowSize}px`,
                    letterSpacing: `${config.header.eyebrowTracking}px`,
                  }}
                >
                  {config.header.eyebrow}
                </div>
              )}

              {/* Section Heading: Style E ({E}XPLORE OUR) + SERVICES. */}
              <h2 
                className="leading-[1.08] block m-0 p-0 text-left font-light whitespace-nowrap mb-4 sm:mb-5 text-[#41332B]"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: `${config.header.fontSize}px`,
                  fontWeight: config.header.fontWeight,
                  letterSpacing: `${config.header.letterSpacing}px`,
                }}
              >
                <span className="block mb-1 sm:mb-1.5 text-[#41332B]">
                  {renderFlourishText({
                    text: config.header.line1,
                    sansFont: "'Montserrat', sans-serif",
                    flourishFont: config.header.flourishFont || "'Alex Brush', cursive",
                    flourishScale: config.header.flourishScale,
                    flourishOffsetY: 0,
                    flourishColor: '#41332b',
                  })}
                </span>
                <span className="block text-[#41332B]">
                  {config.header.line2}
                </span>
              </h2>

              {/* Subheader: Clean Natural Case (Not Fullcase), Graceful Typography */}
              {config.header.subheaderText && (
                <p 
                  className="text-left font-normal max-w-[420px] mb-6 sm:mb-7 text-[#806B5C]"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: `${config.header.subheaderSize}px`,
                    lineHeight: 1.6,
                    letterSpacing: '0.2px',
                  }}
                >
                  {config.header.subheaderText}
                </p>
              )}
            </div>

            {/* Action Button: Moved slightly right, moved down as requested */}
            {config.header.buttonText && (
              <div className="translate-x-2 sm:translate-x-3.5 translate-y-3.5 sm:translate-y-4 pt-1 sm:pt-1.5">
                <button
                  onClick={onOpenAllServices}
                  className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3 sm:py-3.5 bg-[#41332B] hover:bg-[#58463c] text-[#F5EFE7] font-['Plus_Jakarta_Sans'] text-[12.5px] sm:text-[13px] font-normal tracking-[0.14em] uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(65,51,43,0.20)] hover:shadow-[0_14px_32px_rgba(65,51,43,0.30)] hover:-translate-y-0.5 cursor-pointer rounded-full"
                >
                  <span>{config.header.buttonText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#efc9a5]" />
                </button>
              </div>
            )}
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: 4 Asymmetric Cards with Typography, Subtitles & Arrows
              [Spa]  [Hair - Centerpiece]  [Skin / Nails - Stacked]
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-7 flex items-end justify-center lg:justify-end gap-3 sm:gap-3.5 lg:gap-4 xl:gap-5 translate-y-2 sm:translate-y-4 lg:translate-y-6">
            
            {/* ──────────────────────────────────────────
                1. SPA CARD (Left, lifted up above Hair bottom)
            ────────────────────────────────────────── */}
            <div
              onClick={() => onOpenBookingFor('spa')}
              className="group cursor-pointer relative overflow-hidden shadow-[0_14px_35px_rgba(44,34,30,0.20)] hover:shadow-[0_18px_40px_rgba(44,34,30,0.28)] transition-all duration-300 shrink-0"
              style={{
                width: `${config.spa.width}px`,
                height: `${config.spa.height}px`,
                transform: `translate(${config.spa.x}px, ${config.spa.y}px)`,
                borderRadius: `${config.spa.radius.tl}px ${config.spa.radius.tr}px ${config.spa.radius.br}px ${config.spa.radius.bl}px`,
              }}
            >
              <img
                src="/services/spa.jpg"
                alt="Spa - Relaxation & Wellness"
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
              {/* Bottom Gradient with Editorial Serif Title, Subtitle & Arrow */}
              <div className="absolute inset-x-0 bottom-0 pt-12 pb-5 sm:pb-6 px-3.5 sm:px-4 lg:px-4.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-left pointer-events-none">
                <h3 className="font-['Playfair_Display'] text-[22px] sm:text-[25px] lg:text-[28px] text-[#fcf8f4] font-normal leading-none mb-1.5 sm:mb-2">
                  {config.spa.title}
                </h3>
                <div className="flex items-center justify-between w-full gap-1">
                  <span className="font-['Plus_Jakarta_Sans'] text-[8px] sm:text-[9px] lg:text-[9.5px] uppercase tracking-[0.18em] text-[#ded3c7]/90 font-medium truncate">
                    {config.spa.subtitle}
                  </span>
                  <svg className="w-4 h-3 sm:w-4.5 sm:h-3.5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M0 8h22m-6-6l6 6-6 6" />
                  </svg>
                </div>
              </div>
              <div 
                className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors pointer-events-none"
                style={{
                  borderRadius: `${config.spa.radius.tl}px ${config.spa.radius.tr}px ${config.spa.radius.br}px ${config.spa.radius.bl}px`,
                }}
              />
            </div>

            {/* ──────────────────────────────────────────
                2. HAIR CARD (Center, vertically increased, vaulted arch, baseline anchor)
            ────────────────────────────────────────── */}
            <div
              onClick={() => onOpenBookingFor('hair')}
              className="group cursor-pointer relative overflow-hidden shadow-[0_24px_60px_rgba(44,34,30,0.26)] hover:shadow-[0_28px_65px_rgba(44,34,30,0.32)] transition-all duration-300 shrink-0"
              style={{
                width: `${config.hair.width}px`,
                height: `${config.hair.height}px`,
                transform: `translate(${config.hair.x}px, ${config.hair.y}px)`,
                borderRadius: `${config.hair.topRadius}px ${config.hair.topRadius}px ${config.hair.bottomRadius}px ${config.hair.bottomRadius}px`,
              }}
            >
              <img
                src="/services/hair.jpg"
                alt="Hair - Cuts, Styling, Color"
                className="w-full h-full object-cover object-center transition-opacity duration-300"
                style={{
                  borderRadius: `${config.hair.topRadius}px ${config.hair.topRadius}px ${config.hair.bottomRadius}px ${config.hair.bottomRadius}px`,
                }}
              />
              {/* Bottom Gradient with Italic Serif Title, Subtitle & Arrow */}
              <div className="absolute inset-x-0 bottom-0 pt-16 pb-6 sm:pb-7 px-4 sm:px-5 lg:px-5.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end text-left pointer-events-none">
                <h3 className={`font-['Playfair_Display'] ${config.hair.isItalic ? 'italic' : ''} text-[25px] sm:text-[29px] lg:text-[33px] text-[#fcf8f4] font-normal leading-none mb-1.5 sm:mb-2`}>
                  {config.hair.title}
                </h3>
                <div className="flex items-center justify-between w-full gap-1">
                  <span className="font-['Plus_Jakarta_Sans'] text-[8.5px] sm:text-[9.5px] lg:text-[10px] uppercase tracking-[0.2em] text-[#ded3c7]/90 font-medium truncate">
                    {config.hair.subtitle}
                  </span>
                  <svg className="w-4 h-3 sm:w-4.5 sm:h-3.5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M0 8h22m-6-6l6 6-6 6" />
                  </svg>
                </div>
              </div>
              <div 
                className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors pointer-events-none" 
                style={{
                  borderRadius: `${config.hair.topRadius}px ${config.hair.topRadius}px ${config.hair.bottomRadius}px ${config.hair.bottomRadius}px`,
                }}
              />
            </div>

            {/* ──────────────────────────────────────────
                3 & 4. RIGHT STACK: Skin (top, enlarged, top aligned with Hair) & Nails (bottom)
            ────────────────────────────────────────── */}
            <div 
              className="flex flex-col shrink-0 transition-transform duration-150"
              style={{
                transform: `translate(${config.stack.x}px, ${config.stack.y}px)`,
                gap: `${config.stack.gap}px`,
              }}
            >
              
              {/* SKIN CARD (Top Right, enlarged & aligned at same top as Hair arch) */}
              <div
                onClick={() => onOpenBookingFor('skin')}
                className="group cursor-pointer relative overflow-hidden shadow-[0_14px_32px_rgba(44,34,30,0.18)] hover:shadow-[0_18px_38px_rgba(44,34,30,0.25)] transition-all duration-300"
                style={{
                  width: `${config.skin.width}px`,
                  height: `${config.skin.height}px`,
                  transform: `translate(${config.skin.x}px, ${config.skin.y}px)`,
                  borderRadius: `${config.skin.radius.tl}px ${config.skin.radius.tr}px ${config.skin.radius.br}px ${config.skin.radius.bl}px`,
                }}
              >
                <img
                  src="/services/skin.jpg"
                  alt="Skin - Facials & Treatments"
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                />
                {/* Bottom Gradient with Editorial Serif Title, Subtitle & Arrow */}
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-3.5 sm:pb-4.5 px-3 sm:px-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-left pointer-events-none">
                  <h3 className="font-['Playfair_Display'] text-[21px] sm:text-[24px] lg:text-[27px] text-[#fcf8f4] font-normal leading-none mb-1">
                    {config.skin.title}
                  </h3>
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="font-['Plus_Jakarta_Sans'] text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-[#ded3c7]/90 font-medium truncate">
                      {config.skin.subtitle}
                    </span>
                    <svg className="w-4 h-3 sm:w-4.5 sm:h-3.5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M0 8h22m-6-6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors pointer-events-none"
                  style={{
                    borderRadius: `${config.skin.radius.tl}px ${config.skin.radius.tr}px ${config.skin.radius.br}px ${config.skin.radius.bl}px`,
                  }}
                />
              </div>

              {/* NAILS CARD (Bottom Right, left almost sharp rounded, right rounded) */}
              <div
                onClick={() => onOpenBookingFor('nails')}
                className="group cursor-pointer relative overflow-hidden shadow-[0_14px_32px_rgba(44,34,30,0.18)] hover:shadow-[0_18px_38px_rgba(44,34,30,0.25)] transition-all duration-300"
                style={{
                  width: `${config.nails.width}px`,
                  height: `${config.nails.height}px`,
                  transform: `translate(${config.nails.x}px, ${config.nails.y}px)`,
                  borderRadius: `${config.nails.radius.tl}px ${config.nails.radius.tr}px ${config.nails.radius.br}px ${config.nails.radius.bl}px`,
                }}
              >
                <img
                  src="/services/nails.jpg"
                  alt="Nails - Manicure & Pedicure"
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                />
                {/* Bottom Gradient with Editorial Serif Title, Subtitle & Arrow */}
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-3.5 sm:pb-4.5 px-3 sm:px-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-left pointer-events-none">
                  <h3 className="font-['Playfair_Display'] text-[19px] sm:text-[22px] lg:text-[25px] text-[#fcf8f4] font-normal leading-none mb-1">
                    {config.nails.title}
                  </h3>
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="font-['Plus_Jakarta_Sans'] text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-[#ded3c7]/90 font-medium truncate">
                      {config.nails.subtitle}
                    </span>
                    <svg className="w-4 h-3 sm:w-4.5 sm:h-3.5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 shrink-0" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M0 8h22m-6-6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors pointer-events-none"
                  style={{
                    borderRadius: `${config.nails.radius.tl}px ${config.nails.radius.tr}px ${config.nails.radius.br}px ${config.nails.radius.bl}px`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
