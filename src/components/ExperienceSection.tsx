import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { renderFlourishText } from '../utils/flourishText';
import { HairIcon, SkinIcon, NailsIcon, SpaIcon } from './ServiceIcons';

interface ExperienceSectionProps {
  onOpenBooking?: () => void;
  onOpenBookingFor?: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenAbout?: () => void;
  imageSrc?: string;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onOpenBooking,
  onOpenBookingFor,
  onOpenAbout,
  imageSrc = '/services/hair.jpg',
}) => {
  // 4 Core Offerings: What We Do (Sleek, Editorial Tiles without Text Clutter)
  const whatWeDoPillars = [
    {
      id: 'hair',
      num: '01',
      title: 'HAIR ARTISTRY',
      icon: <HairIcon className="w-5 h-5 text-[#41332B]" />,
      tags: 'Precision Cuts · Balayage · Couture Styling',
    },
    {
      id: 'skin',
      num: '02',
      title: 'SKIN THERAPY',
      icon: <SkinIcon className="w-5 h-5 text-[#41332B]" />,
      tags: 'Hydra-Infusion · Clinical Facials · Glow',
    },
    {
      id: 'nails',
      num: '03',
      title: 'NAIL COUTURE',
      icon: <NailsIcon className="w-5 h-5 text-[#41332B]" />,
      tags: 'Russian Apparatus · Sculpted Architecture',
    },
    {
      id: 'spa',
      num: '04',
      title: 'HOLISTIC SPA',
      icon: <SpaIcon className="w-5 h-5 text-[#41332B]" />,
      tags: 'Japanese Head Spa · Botanical Rituals',
    },
  ];

  return (
    <section 
      id="about"
      className="relative w-full min-h-screen pt-20 sm:pt-24 lg:pt-24 pb-20 sm:pb-24 lg:pb-24 flex items-center px-6 sm:px-10 lg:px-14 xl:px-16 bg-[#F1EAE2] text-[#41332B] overflow-hidden select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          04 · ABOUT US: Soft Cream · #F1EAE2
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f2ec] via-[#F1EAE2] to-[#ebe1d7] -z-10" />
      
      {/* Delicate, Faded Ambient Arcs (Low opacity, delicate espresso thread) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-10" 
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <path 
          d="M 1180 0 C 1240 220, 1380 440, 1220 680 S 980 860, 840 900" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
        <path 
          d="M -20 340 C 180 340, 320 200, 440 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center w-full">
          
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: Vaulted Arch Hair Component
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex items-center justify-center order-2 lg:order-1">
            <div className="relative inline-block">
              
              {/* Silhouette Arch Depth Shadow */}
              <div 
                className="absolute -inset-4 sm:-inset-5 -translate-x-4 sm:-translate-x-5 translate-y-3 sm:translate-y-4 bg-[#dfd4c7]/70 -z-10 pointer-events-none transition-transform border border-[#41332b]/15"
                style={{
                  borderRadius: '9999px 9999px 28px 28px',
                }}
              />

              {/* Exact Vaulted Arch Card */}
              <div
                onClick={() => onOpenBookingFor ? onOpenBookingFor('hair') : onOpenBooking?.()}
                className="group cursor-pointer relative overflow-hidden shadow-[0_12px_32px_rgba(65,51,43,0.18)] hover:shadow-[0_16px_38px_rgba(65,51,43,0.25)] transition-shadow duration-300 shrink-0"
                style={{
                  width: '300px',
                  height: '520px',
                  borderRadius: '9999px 9999px 0 0',
                }}
              >
                {/* Hair Image */}
                <img
                  src={imageSrc}
                  alt="Hair Artistry & Experience"
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                  style={{
                    borderRadius: '9999px 9999px 0 0',
                  }}
                />

                {/* Bottom Gradient with Title & Subtitle */}
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-6 sm:pb-7 px-5 sm:px-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end text-left pointer-events-none">
                  <h3 className="font-['Playfair_Display'] italic text-[26px] sm:text-[30px] lg:text-[32px] text-[#fcf8f4] font-normal leading-none mb-1.5 sm:mb-2">
                    Hair
                  </h3>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-[8.5px] sm:text-[9.5px] lg:text-[10px] uppercase tracking-[0.2em] text-[#ded3c7]/90 font-medium truncate">
                      CUTS · STYLING · COLOR
                    </span>
                    <svg 
                      className="w-4 h-3 sm:w-4.5 sm:h-3.5 text-white/80 group-hover:translate-x-1 transition-transform duration-300 shrink-0" 
                      viewBox="0 0 24 16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.2"
                    >
                      <path d="M0 8h22m-6-6l6 6-6 6" />
                    </svg>
                  </div>
                </div>

                {/* Border Outline */}
                <div 
                  className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors pointer-events-none"
                  style={{
                    borderRadius: '9999px 9999px 0 0',
                  }}
                />
              </div>

            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: About Us (Clean, Visual & Non-Cluttered)
              - Crisp 1-line luxury manifesto (No text fatigue)
              - 4 Elegant tactile service tiles
              - Direct Call to Action button
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left order-1 lg:order-2">
            
            {/* Eyebrow: ABOUT US */}
            <div className="mb-2 sm:mb-2.5">
              <span 
                className="font-['Plus_Jakarta_Sans'] uppercase font-medium text-[#806B5C]"
                style={{
                  fontSize: '11.5px',
                  letterSpacing: '3.5px',
                }}
              >
                ABOUT US
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 
              className="leading-[1.10] block m-0 p-0 text-left font-light mb-4 sm:mb-5 text-[#41332B]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(32px, 3.8vw, 46px)',
                fontWeight: 300,
                letterSpacing: '3.5px',
                color: '#41332B',
              }}
            >
              {/* Line 1: WHO WE ARE, */}
              <span className="block mb-1 sm:mb-1.5" style={{ color: '#41332B' }}>
                {renderFlourishText({
                  text: '{W}HO WE ARE,',
                  sansFont: "'Montserrat', sans-serif",
                  flourishFont: "'Alex Brush', cursive",
                  flourishScale: 1.45,
                  flourishOffsetY: 0,
                  flourishColor: '#41332b',
                })}
              </span>
              {/* Line 2: WHAT WE DO. */}
              <span className="block" style={{ color: '#41332B' }}>
                {renderFlourishText({
                  text: '{W}HAT WE DO.',
                  sansFont: "'Montserrat', sans-serif",
                  flourishFont: "'Alex Brush', cursive",
                  flourishScale: 1.45,
                  flourishOffsetY: 0,
                  flourishColor: '#41332b',
                })}
              </span>
            </h2>

            {/* Concise Luxury Brand Manifesto (Clean, Poetic, No Text Wall) */}
            <p 
              className="font-['Plus_Jakarta_Sans'] font-normal text-[#5C473B] leading-relaxed max-w-[560px] mb-7 sm:mb-8 text-[15px] sm:text-[15.5px]"
              style={{
                letterSpacing: '0.15px',
              }}
            >
              An intimate luxury sanctuary where bespoke artistry meets personal renewal—crafted for effortless sophistication and mindful beauty.
            </p>

            {/* 4 Tactile Editorial Pillars: Visual, Clean Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full max-w-[620px] mb-8">
              {whatWeDoPillars.map((pillar) => (
                <div 
                  key={pillar.id}
                  onClick={() => onOpenBookingFor ? onOpenBookingFor(pillar.id as any) : onOpenBooking?.()}
                  className="group cursor-pointer p-3.5 sm:p-4 rounded-[14px] bg-gradient-to-br from-[#faf6f1]/90 to-[#f3ece3]/90 hover:from-white hover:to-[#faf5ef] border border-[#41332B]/12 hover:border-[#41332B]/25 shadow-[0_4px_16px_rgba(65,51,43,0.04)] hover:shadow-[0_8px_24px_rgba(65,51,43,0.08)] transition-all duration-300 flex items-center gap-3.5"
                >
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-[#e8ded3] group-hover:bg-[#ded3c7] flex items-center justify-center shrink-0 border border-[#41332B]/10 transition-colors shadow-sm">
                    {pillar.icon}
                  </div>
                  
                  {/* Title & Curated Tags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-['Plus_Jakarta_Sans'] text-[10px] tracking-[1.5px] text-[#806B5C] font-semibold">
                        {pillar.num}
                      </span>
                      <h4 className="font-['Montserrat'] text-[12.5px] sm:text-[13px] font-medium text-[#41332B] tracking-[1.8px] uppercase leading-tight truncate">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[11px] sm:text-[11.5px] text-[#806B5C] font-normal tracking-wide truncate">
                      {pillar.tags}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button: Refined Editorial CTA */}
            <div>
              <button
                onClick={onOpenAbout || onOpenBooking}
                className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 rounded-full bg-[#41332B] hover:bg-[#58463c] text-[#F1EAE2] font-['Plus_Jakarta_Sans'] text-[12.5px] sm:text-[13px] font-medium tracking-[0.14em] uppercase transition-all duration-300 shadow-[0_8px_22px_rgba(65,51,43,0.18)] hover:shadow-[0_12px_28px_rgba(65,51,43,0.26)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore The Experience</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#efc9a5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
