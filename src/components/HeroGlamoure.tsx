import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HairIcon, SkinIcon, NailsIcon, SpaIcon } from './ServiceIcons';
import { renderFlourishText } from '../utils/flourishText';

interface HeroGlamoureProps {
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onScrollToServices: () => void;
  onScrollToStylists: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onToggleMobileMenu: () => void;
}

export const HeroGlamoure: React.FC<HeroGlamoureProps> = ({
  onOpenBookingFor,
  onScrollToServices,
  onScrollToStylists,
  onOpenAbout,
  onOpenContact,
  onToggleMobileMenu,
}) => {
  const { user, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'salon_owner') return '/owner/dashboard';
    if (role === 'salon_member') return '/member/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="relative w-full h-screen min-h-[660px] max-h-[1020px] overflow-hidden bg-[#1e1916] text-[#fbf7f2]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-SCREEN BACKGROUND IMAGE (Uniform Warmth & Natural Contrast)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero-salon-4k.jpg"
          alt="Glamouré Salon Studio with Mirror and Chair"
          className="w-full h-full object-cover pointer-events-none scale-[1.03] object-[48%_center]"
          style={{
            filter: 'contrast(1.12) brightness(0.86)',
          }}
        />
        {/* Uniform Adjusted Ambient Darkness */}
        <div className="absolute inset-0 bg-black/26 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL ARCHITECTURAL VERTICAL GUIDELINES
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none flex justify-between px-6 sm:px-10 lg:px-16">
        <div className="w-[1px] h-full bg-white/[0.04]" />
        <div className="hidden md:block w-[1px] h-full bg-white/[0.04]" />
        <div className="hidden lg:block w-[1px] h-full bg-white/[0.04]" />
        <div className="w-[1px] h-full bg-white/[0.04]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. HEADER: Clean Non-Sticky Architectural Header
          - Logo on Left
          - Centered Navigation Links
          - Integrated Auth (Sign In / Partner) & Book Appointment on Right
      ───────────────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 pt-7 sm:pt-8 pb-4 flex items-center justify-between pointer-events-auto">
        
        {/* Brand Logo & Subtitle */}
        <div className="flex flex-col text-left">
          <a 
            href="#" 
            className="font-['Montserrat'] text-[23px] sm:text-[24px] font-light tracking-[0.22em] uppercase text-white hover:text-[#efc9a5] transition-colors leading-none"
          >
            GLAMOURÉ
          </a>
          <span className="font-['Plus_Jakarta_Sans'] text-[8.5px] font-medium tracking-[0.28em] uppercase text-[#ded3c7]/75 mt-1">
            SALON &amp; STUDIO
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 lg:gap-13 font-['Plus_Jakarta_Sans'] text-[13px] font-normal tracking-[0.18em] text-[#e8ded2]">
          <button 
            onClick={onScrollToServices}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Services
          </button>

          <button 
            onClick={onScrollToStylists}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Stylists
          </button>

          <button 
            onClick={onOpenAbout}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            About
          </button>

          <button 
            onClick={onOpenContact}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Group: Auth Links + Book Appointment Button */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          {user ? (
            <Link
              to={getDashboardPath()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#efc9a5] border border-[#efc9a5]/40 text-xs font-['Montserrat'] uppercase tracking-wider font-semibold transition-all backdrop-blur-sm"
            >
              <span>Portal ({role.replace('salon_', '')})</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
          ) : (
            <div className="flex items-center gap-3 text-xs font-['Plus_Jakarta_Sans']">
              <Link
                to="/login"
                className="text-[#f5eee6]/80 hover:text-white transition-colors tracking-wide font-medium"
              >
                Sign In
              </Link>
              <span className="text-white/25">|</span>
              <Link
                to="/register"
                className="text-[#efc9a5] hover:text-white transition-colors tracking-wide font-medium"
              >
                Partner / Register
              </Link>
            </div>
          )}

          <button
            onClick={() => onOpenBookingFor('hair')}
            className="group flex items-center gap-2 px-5 py-2 rounded-full border border-white/40 hover:border-white bg-transparent text-white font-['Plus_Jakarta_Sans'] text-[13px] font-normal tracking-wide transition-all cursor-pointer"
          >
            <span>Book Appointment</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#efc9a5]" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-white/90 hover:text-white cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          4. BEAUTY QUOTE: Subtle Editorial Brand Accent
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute left-4 sm:left-6 lg:left-8 top-[32%] -translate-y-1/2 z-20 pointer-events-none hidden md:block">
        <span className="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[9.5px] uppercase tracking-[0.26em] text-[#ded3c7]/80 font-normal select-none">
          &ldquo;BEAUTY IN EVERY DETAIL&rdquo;
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. HERO FOCAL TYPOGRAPHY: Heading (Font Size 45 in Two Lines) + Shortened Subtext + 4 Service Pillars
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full h-full flex items-center justify-end px-6 sm:px-10 lg:px-16">
        <div className="w-full sm:w-[540px] md:w-[560px] lg:w-[580px] flex flex-col justify-center items-start text-left pt-6 sm:pt-4">
          
          {/* Main Headline Line 1: WHERE BEAUTY MEETS (Strictly on 1 Line, Font Size 45) */}
          <h1 
            className="leading-[1.1] block m-0 p-0 text-left font-light text-white whitespace-nowrap"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '45px',
              fontWeight: 300,
              letterSpacing: '4px',
              color: '#ffffff',
            }}
          >
            {renderFlourishText({
              text: '{W}HERE BEAUTY MEETS',
              sansFont: "'Montserrat', sans-serif",
              flourishFont: "'Alex Brush', cursive",
              flourishScale: 1.45,
              flourishOffsetY: 0,
              flourishColor: '#ffffff',
            })}
          </h1>

          {/* Main Headline Line 2: TIMELESS ELEGANCE. (Strictly on 2nd Line, Font Size 45) */}
          <h1 
            className="leading-[1.1] block m-0 p-0 text-left font-light whitespace-nowrap mt-1"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '45px',
              fontWeight: 300,
              letterSpacing: '4px',
            }}
          >
            <span className="text-white">TIMELESS </span>
            <span style={{ color: '#efc9a5' }}>
              {renderFlourishText({
                text: '{E}LEGANCE.',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#efc9a5',
              })}
            </span>
          </h1>

          {/* Subheader: Clean natural flowing luxury copy */}
          <p 
            className="mt-4 sm:mt-5 mb-5 sm:mb-6 w-full max-w-[500px] leading-[1.75] text-left uppercase text-[#ded3c7]/85 font-normal tracking-[0.18em] break-words"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              letterSpacing: '2.2px',
            }}
          >
            A PERSONALIZED LUXURY SALON EXPERIENCE CRAFTED TO ELEVATE TIMELESS ELEGANCE.
          </p>

          {/* 4 Service Pillars: Hair · Skin · Nails · Spa with Clean Natural Alignment */}
          <div className="w-full max-w-[440px] pt-2">
            <div className="flex items-center justify-between w-full">
              {/* 1. Hair */}
              <div 
                onClick={() => onOpenBookingFor('hair')}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer group hover:text-white transition-colors"
              >
                <div className="text-[#e7c19a] group-hover:text-white transition-colors">
                  <HairIcon className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium text-[#ded3c7] tracking-[0.06em]">
                  Hair
                </span>
              </div>

              {/* Divider 1 */}
              <div className="h-7 w-[1px] bg-white/20 shrink-0" />

              {/* 2. Skin */}
              <div 
                onClick={() => onOpenBookingFor('skin')}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer group hover:text-white transition-colors"
              >
                <div className="text-[#e7c19a] group-hover:text-white transition-colors">
                  <SkinIcon className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium text-[#ded3c7] tracking-[0.06em]">
                  Skin
                </span>
              </div>

              {/* Divider 2 */}
              <div className="h-7 w-[1px] bg-white/20 shrink-0" />

              {/* 3. Nails */}
              <div 
                onClick={() => onOpenBookingFor('nails')}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer group hover:text-white transition-colors"
              >
                <div className="text-[#e7c19a] group-hover:text-white transition-colors">
                  <NailsIcon className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium text-[#ded3c7] tracking-[0.06em]">
                  Nails
                </span>
              </div>

              {/* Divider 3 */}
              <div className="h-7 w-[1px] bg-white/20 shrink-0" />

              {/* 4. Spa & Wellness */}
              <div 
                onClick={() => onOpenBookingFor('spa')}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer group hover:text-white transition-colors"
              >
                <div className="text-[#e7c19a] group-hover:text-white transition-colors">
                  <SpaIcon className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                </div>
                <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium text-[#ded3c7] tracking-[0.06em]">
                  Spa &amp; Wellness
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          6. BOTTOM EDITORIAL BAR: Centered Opening Hours
      ───────────────────────────────────────────────────────────── */}
      <footer className="absolute bottom-3 sm:bottom-4 lg:bottom-4.5 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 flex items-center justify-center pointer-events-auto">
        <div className="flex items-center gap-3.5 select-none">
          <span className="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[9.5px] uppercase tracking-[0.24em] text-[#ded3c7]/65 font-medium">
            OPENING HOURS
          </span>
          <div className="h-3.5 w-[1px] bg-white/20" />
          <div className="flex flex-col text-[9px] sm:text-[9.5px] uppercase tracking-[0.18em] text-white/90 font-medium text-left">
            <span>MON — SAT</span>
            <span className="text-[#efc9a5]">10:00 AM — 8:00 PM</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
