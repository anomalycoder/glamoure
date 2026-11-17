import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface EditorialSectionProps {
  eyebrow: string;
  headingPrefix: string;
  headingFlourish: string;
  headingSuffix: string;
  bodyText: string;
  imageSrc: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const EditorialSectionExample: React.FC<EditorialSectionProps> = ({
  eyebrow,
  headingPrefix,
  headingFlourish,
  headingSuffix,
  bodyText,
  imageSrc,
  ctaText = 'Discover More',
  onCtaClick,
}) => {
  return (
    <section className="relative w-full min-h-screen pt-20 sm:pt-24 lg:pt-24 pb-20 sm:pb-24 lg:pb-24 px-6 sm:px-10 lg:px-14 xl:px-16 bg-[#F4EEE7] text-[#41332B] flex items-center overflow-hidden">
      {/* Delicate ambient background curve */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10" 
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <path d="M 240 440 C 380 180, 720 160, 920 360 S 1240 540, 1440 460" stroke="#41332B" strokeWidth="0.8" />
      </svg>

      <div className="relative z-10 max-w-[1380px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Asymmetric Architectural Vaulted Arch */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative inline-block">
            {/* Soft architectural silhouette */}
            <div 
              className="absolute -inset-4 sm:-inset-5 -translate-x-4 translate-y-3 bg-[#DCCBBB]/50 -z-10 border border-[#41332B]/10"
              style={{ borderRadius: '9999px 9999px 24px 24px' }}
            />
            {/* Vaulted photo container */}
            <div 
              className="relative overflow-hidden w-[300px] h-[500px] shadow-[0_12px_32px_rgba(65,51,43,0.15)] group"
              style={{ borderRadius: '9999px 9999px 0 0' }}
            >
              <img 
                src={imageSrc} 
                alt="Editorial Salon Artistry" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
            </div>
          </div>
        </div>

        {/* Right: Editorial Typography Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow */}
          <span className="font-['Plus_Jakarta_Sans'] text-[11.5px] uppercase tracking-[3.5px] text-[#806B5C] font-medium mb-3">
            {eyebrow}
          </span>

          {/* Heading with Flourish Accent */}
          <h2 className="font-['Montserrat'] font-light text-[36px] sm:text-[44px] lg:text-[48px] tracking-[3.5px] uppercase text-[#41332B] leading-[1.1] mb-5">
            {headingPrefix}{' '}
            <span className="font-['Alex Brush'] normal-case text-[#41332B] text-[1.4em] inline-block -translate-y-1">
              {headingFlourish}
            </span>
            {headingSuffix}
          </h2>

          {/* Single refined paragraph */}
          <p className="font-['Plus_Jakarta_Sans'] text-[14.5px] text-[#806B5C] leading-[1.7] max-w-[580px] mb-8 font-normal">
            {bodyText}
          </p>

          {/* Editorial CTA Button */}
          {ctaText && (
            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#41332B] text-[#fbf7f2] hover:bg-[#2e241e] font-['Plus_Jakarta_Sans'] text-[12.5px] uppercase tracking-[0.14em] font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B99470]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
