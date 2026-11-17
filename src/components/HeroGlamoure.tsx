import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HairIcon, SkinIcon, NailsIcon, SpaIcon } from './ServiceIcons';
import { renderFlourishText } from '../utils/flourishText';
import { 
  DEFAULT_HERO_CONFIG, 
  type HeroDesignConfig 
} from '../types/hero-design';
import { DraggableElement } from './hero-editor/DraggableElement';

interface HeroGlamoureProps {
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onScrollToServices: () => void;
  onScrollToStylists: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onToggleMobileMenu: () => void;
}

const STORAGE_KEYS = ['glamoure_hero_design_v11', 'glamoure_hero_design_v10', 'glamoure_hero_design_v9', 'glamoure_hero_design_v8', 'glamoure_hero_design_v7', 'glamoure_hero_design'];

export const HeroGlamoure: React.FC<HeroGlamoureProps> = ({
  onOpenBookingFor,
  onScrollToServices,
  onScrollToStylists,
  onOpenAbout,
  onOpenContact,
  onToggleMobileMenu,
}) => {
  // Load saved config from browser localStorage, falling back to brand defaults
  const loadSavedConfig = (): HeroDesignConfig => {
    for (const key of STORAGE_KEYS) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_HERO_CONFIG,
            ...parsed,
            bg: { 
              ...DEFAULT_HERO_CONFIG.bg, 
              ...(parsed.bg || {}),
              darkness: 0, // Bright, warm natural illumination per user instruction
            },
            container: { ...DEFAULT_HERO_CONFIG.container, ...(parsed.container || {}) },
            logo: { 
              ...DEFAULT_HERO_CONFIG.logo, 
              ...(parsed.logo || {}),
              fontSize: parsed.logo?.fontSize || 24,
              subtitleSize: parsed.logo?.subtitleSize || 8.5,
              x: parsed.logo?.x !== undefined ? parsed.logo.x : DEFAULT_HERO_CONFIG.logo.x,
              y: parsed.logo?.y !== undefined ? parsed.logo.y : DEFAULT_HERO_CONFIG.logo.y,
            },
            nav: { 
              ...DEFAULT_HERO_CONFIG.nav, 
              ...(parsed.nav || {}),
              x: parsed.nav?.x !== undefined ? parsed.nav.x : -35,
              y: parsed.nav?.y !== undefined ? parsed.nav.y : -25,
              fontWeight: 400,
            },
            headerBtn: { 
              ...DEFAULT_HERO_CONFIG.headerBtn, 
              ...(parsed.headerBtn || {}),
              fontWeight: 400,
              x: parsed.headerBtn?.x !== undefined ? parsed.headerBtn.x : DEFAULT_HERO_CONFIG.headerBtn.x,
              y: parsed.headerBtn?.y !== undefined ? parsed.headerBtn.y : DEFAULT_HERO_CONFIG.headerBtn.y,
            },
            headlineLine1: { 
              ...DEFAULT_HERO_CONFIG.headlineLine1, 
              ...(parsed.headlineLine1 || {}),
              text: '{W}HERE BEAUTY MEETS',
              fontSize: 45, // Set to 45px per user request
              x: parsed.headlineLine1?.x !== undefined ? parsed.headlineLine1.x : DEFAULT_HERO_CONFIG.headlineLine1.x,
              y: parsed.headlineLine1?.y !== undefined ? parsed.headlineLine1.y : DEFAULT_HERO_CONFIG.headlineLine1.y,
            },
            headlineLine2: { 
              ...DEFAULT_HERO_CONFIG.headlineLine2, 
              ...(parsed.headlineLine2 || {}),
              textPrefix: 'TIMELESS ',
              textHighlight: '{E}LEGANCE.',
              fontSize: 45, // Set to 45px per user request
              x: parsed.headlineLine2?.x !== undefined ? parsed.headlineLine2.x : 28,
              y: parsed.headlineLine2?.y !== undefined ? parsed.headlineLine2.y : -32,
              highlightColor: parsed.headlineLine2?.highlightColor || '#efc9a5',
            },
            subheader: { 
              ...DEFAULT_HERO_CONFIG.subheader, 
              ...(parsed.subheader || {}),
              text: parsed.subheader?.text 
                ? parsed.subheader.text.replace(/\n/g, ' ') 
                : "A PERSONALIZED LUXURY SALON EXPERIENCE CRAFTED TO ELEVATE TIMELESS ELEGANCE.",
              fontSize: parsed.subheader?.fontSize || 13,
              letterSpacing: parsed.subheader?.letterSpacing || 2.2,
              x: parsed.subheader?.x !== undefined ? parsed.subheader.x : DEFAULT_HERO_CONFIG.subheader.x,
              y: parsed.subheader?.y !== undefined ? parsed.subheader.y : DEFAULT_HERO_CONFIG.subheader.y,
            },
            primaryBtn: { 
              ...DEFAULT_HERO_CONFIG.primaryBtn, 
              ...(parsed.primaryBtn || {}),
              visible: false, // Removed center buttons from hero section per user instruction
            },
            secondaryBtn: { 
              ...DEFAULT_HERO_CONFIG.secondaryBtn, 
              ...(parsed.secondaryBtn || {}),
              visible: false, // Removed center buttons from hero section per user instruction
            },
            servicesStrip: { 
              ...DEFAULT_HERO_CONFIG.servicesStrip, 
              ...(parsed.servicesStrip || {}),
              visible: true, // Display down below the shortened subtext
              fontSize: parsed.servicesStrip?.fontSize || 12.5,
              x: parsed.servicesStrip?.x !== undefined ? parsed.servicesStrip.x : 127,
              y: parsed.servicesStrip?.y !== undefined ? parsed.servicesStrip.y : 78,
            },
            flourish: { ...DEFAULT_HERO_CONFIG.flourish, ...(parsed.flourish || {}) },
          };
        }
      } catch (e) {
        console.error(`Error loading saved hero design from ${key}`, e);
      }
    }
    return DEFAULT_HERO_CONFIG;
  };

  const [config, setConfig] = useState<HeroDesignConfig>(loadSavedConfig);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const isEditMode = false;
  const updateElementPosition = (elementKey: keyof HeroDesignConfig, x: number, y: number) => {
    setConfig((prev) => ({
      ...prev,
      [elementKey]: {
        ...(prev[elementKey] as any),
        x,
        y,
      },
    }));
  };

  return (
    <div className="relative w-full h-screen min-h-[660px] max-h-[1020px] overflow-hidden bg-[#1e1916] text-[#fbf7f2]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-SCREEN BACKGROUND IMAGE (Uniform Contrast & Adjusted Darkness All Over)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero-salon-4k.jpg"
          alt="Glamouré Salon Studio with Mirror and Chair"
          className="w-full h-full object-cover pointer-events-none scale-[1.04] -translate-x-1 sm:-translate-x-2 lg:-translate-x-4 translate-y-1 sm:translate-y-1.5 lg:translate-y-2"
          style={{
            filter: 'contrast(1.16) brightness(0.84)',
            objectPosition: '48% center',
          }}
        />
        {/* Uniform Adjusted Darkness Across Entire Hero Image */}
        <div className="absolute inset-0 bg-black/28 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SWISS EDITORIAL ARCHITECTURAL VERTICAL GRID GUIDELINES
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none flex justify-between px-6 sm:px-10 lg:px-16">
        <div className="w-[1px] h-full bg-white/[0.04]" />
        <div className="hidden md:block w-[1px] h-full bg-white/[0.04]" />
        <div className="hidden lg:block w-[1px] h-full bg-white/[0.04]" />
        <div className="w-[1px] h-full bg-white/[0.04]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. HEADER: Original Elegant Header Layout (Preserved Exactly)
      ───────────────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-9 pb-4 flex items-center justify-between pointer-events-auto">
        
        {/* Brand Logo & Subtitle: Montserrat 300 + Plus Jakarta Sans 500 */}
        {config.logo.visible && (
          <DraggableElement
            id="logo"
            label="Logo"
            x={config.logo.x}
            y={config.logo.y}
            isEditMode={isEditMode}
            isSelected={selectedElement === 'logo'}
            onSelect={() => setSelectedElement('logo')}
            onMove={(x, y) => updateElementPosition('logo', x, y)}
          >
            <div className="flex flex-col">
              <a 
                href="#" 
                className="tracking-[0.22em] uppercase transition-colors hover:text-[#efc9a5]"
                style={{
                  fontFamily: config.logo.fontFamily,
                  fontSize: `${config.logo.fontSize}px`,
                  fontWeight: config.logo.fontWeight,
                  letterSpacing: `${config.logo.letterSpacing}px`,
                  color: config.logo.color,
                }}
              >
                {config.logo.text}
              </a>
              {config.logo.subtitle && (
                <span 
                  className="tracking-[0.28em] uppercase -mt-0.5"
                  style={{
                    fontFamily: config.logo.subtitleFont,
                    fontSize: `${config.logo.subtitleSize}px`,
                    fontWeight: config.logo.subtitleWeight,
                    color: 'rgba(222, 211, 199, 0.75)',
                  }}
                >
                  {config.logo.subtitle}
                </span>
              )}
            </div>
          </DraggableElement>
        )}

        {/* Center Navigation Links: Clean Horizontal Row (Light Weight 400) */}
        {config.nav.visible && (
          <DraggableElement
            id="nav"
            label="Nav Links"
            x={config.nav.x}
            y={config.nav.y}
            isEditMode={isEditMode}
            isSelected={selectedElement === 'nav'}
            onSelect={() => setSelectedElement('nav')}
            onMove={(x, y) => updateElementPosition('nav', x, y)}
            className="hidden md:block"
          >
            <nav 
              className="flex items-center gap-10 lg:gap-14 font-['Plus_Jakarta_Sans'] text-[13px] font-normal tracking-[0.18em]"
              style={{
                color: config.nav.color,
              }}
            >
              <button 
                onClick={onScrollToServices}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {config.nav.link1 || 'Services'}
              </button>

              <button 
                onClick={onScrollToStylists}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {config.nav.link2 || 'Stylists'}
              </button>

              <button 
                onClick={onOpenAbout}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {config.nav.link3 || 'About'}
              </button>

              <button 
                onClick={onOpenContact}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {config.nav.link4 || 'Contact'}
              </button>
            </nav>
          </DraggableElement>
        )}

        {/* Right CTA Button: Clean Outline Pill Button */}
        {config.headerBtn.visible && (
          <DraggableElement
            id="headerBtn"
            label="Header Button"
            x={config.headerBtn.x}
            y={config.headerBtn.y}
            isEditMode={isEditMode}
            isSelected={selectedElement === 'headerBtn'}
            onSelect={() => setSelectedElement('headerBtn')}
            onMove={(x, y) => updateElementPosition('headerBtn', x, y)}
            className="hidden sm:block"
          >
            <button
              onClick={() => onOpenBookingFor('hair')}
              className="group flex items-center gap-2 px-5 py-2 rounded-full border border-white/40 hover:border-white bg-transparent text-white font-['Plus_Jakarta_Sans'] text-[13px] font-normal tracking-wide transition-all cursor-pointer translate-x-1 sm:translate-x-2"
            >
              <span>{config.headerBtn.text}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#efc9a5]" />
            </button>
          </DraggableElement>
        )}

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
          4. BEAUTY QUOTE: Moved A Little Down & A Little Left
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute left-2 sm:left-3.5 lg:left-4 top-[25.5%] -translate-y-1/2 z-20 pointer-events-none hidden md:block">
        <span className="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[9.5px] uppercase tracking-[0.26em] text-[#ded3c7]/80 font-normal select-none">
          &ldquo;BEAUTY IN EVERY DETAIL&rdquo;
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. HERO FOCAL TYPOGRAPHY: Heading (Font Size 45 in Two Lines) + Shortened Subtext + Services
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full h-full flex items-center justify-end px-6 sm:px-10 lg:px-16">
        <div 
          className="w-full sm:w-[540px] md:w-[560px] lg:w-[580px] flex flex-col justify-center items-start text-left pt-6 sm:pt-4 -translate-y-1.5 sm:-translate-y-2.5 transition-transform duration-200 transform-gpu"
          style={{
            maxWidth: `${config.container.maxWidth || 580}px`,
            transform: `translate(${config.container.x}px, ${config.container.y}px)`,
          }}
        >
          {/* Main Headline Line 1: WHERE BEAUTY MEETS (Strictly on 1 Line, Font Size 45) */}
          {config.headlineLine1.visible && (
            <DraggableElement
              id="headlineLine1"
              label="Headline 1"
              x={config.headlineLine1.x}
              y={config.headlineLine1.y}
              isEditMode={isEditMode}
              isSelected={selectedElement === 'headlineLine1'}
              onSelect={() => setSelectedElement('headlineLine1')}
              onMove={(x, y) => updateElementPosition('headlineLine1', x, y)}
              className="w-full text-left"
            >
              <h1 
                className="leading-[1.1] block m-0 p-0 text-left font-light text-white whitespace-nowrap"
                style={{
                  fontFamily: config.headlineLine1.fontFamily,
                  fontSize: '45px',
                  fontWeight: config.headlineLine1.fontWeight,
                  letterSpacing: '4px',
                  color: config.headlineLine1.color,
                }}
              >
                {config.flourish?.enabled ? renderFlourishText({
                  text: config.headlineLine1.text,
                  sansFont: config.headlineLine1.fontFamily,
                  flourishFont: config.flourish.scriptFont,
                  flourishScale: config.flourish.scale,
                  flourishOffsetY: config.flourish.offsetY,
                  flourishColor: config.flourish.color || undefined,
                }) : config.headlineLine1.text}
              </h1>
            </DraggableElement>
          )}

          {/* Main Headline Line 2: TIMELESS ELEGANCE. (Strictly on 2nd Line, Font Size 45) */}
          {config.headlineLine2.visible && (
            <DraggableElement
              id="headlineLine2"
              label="Headline 2"
              x={config.headlineLine2.x}
              y={config.headlineLine2.y}
              isEditMode={isEditMode}
              isSelected={selectedElement === 'headlineLine2'}
              onSelect={() => setSelectedElement('headlineLine2')}
              onMove={(x, y) => updateElementPosition('headlineLine2', x, y)}
              className="mt-1 w-full text-left"
            >
              <h1 
                className="leading-[1.1] block m-0 p-0 text-left font-light whitespace-nowrap"
                style={{
                  fontFamily: config.headlineLine2.fontFamily,
                  fontSize: '45px',
                  fontWeight: config.headlineLine2.fontWeight,
                  letterSpacing: '4px',
                  color: config.headlineLine2.color,
                }}
              >
                <span>{config.headlineLine2.textPrefix}</span>
                <span style={{ color: config.headlineLine2.highlightColor || '#efc9a5' }}>
                  {config.flourish?.enabled ? renderFlourishText({
                    text: config.headlineLine2.textHighlight,
                    sansFont: config.headlineLine2.fontFamily,
                    flourishFont: config.flourish.scriptFont,
                    flourishScale: config.flourish.scale,
                    flourishOffsetY: config.flourish.offsetY,
                    flourishColor: config.headlineLine2.highlightColor || '#efc9a5',
                  }) : config.headlineLine2.textHighlight}
                </span>
              </h1>
            </DraggableElement>
          )}

          {/* Subheader: Clean natural flowing lines without forced line break */}
          {config.subheader.visible && (
            <DraggableElement
              id="subheader"
              label="Subheader"
              x={config.subheader.x}
              y={config.subheader.y}
              isEditMode={isEditMode}
              isSelected={selectedElement === 'subheader'}
              onSelect={() => setSelectedElement('subheader')}
              onMove={(x, y) => updateElementPosition('subheader', x, y)}
              className="mt-4 sm:mt-5 mb-5 sm:mb-6 w-full max-w-[500px] text-left pr-2"
            >
              <p 
                className="leading-[1.75] text-left uppercase text-[#ded3c7]/85 font-normal tracking-[0.18em] break-words"
                style={{
                  fontFamily: config.subheader.fontFamily,
                  fontSize: `${config.subheader.fontSize || 13}px`,
                  letterSpacing: `${config.subheader.letterSpacing || 2.2}px`,
                  color: config.subheader.color,
                }}
              >
                {config.subheader.text ? config.subheader.text.replace(/\n/g, ' ') : ''}
              </p>
            </DraggableElement>
          )}

          {/* 4 Service Categories: Hair · Skin · Nails · Spa with Increased Component Size & Placement */}
          {config.servicesStrip.visible && (
            <DraggableElement
              id="servicesStrip"
              label="Services Strip"
              x={config.servicesStrip.x}
              y={config.servicesStrip.y}
              isEditMode={isEditMode}
              isSelected={selectedElement === 'servicesStrip'}
              onSelect={() => setSelectedElement('servicesStrip')}
              onMove={(x, y) => updateElementPosition('servicesStrip', x, y)}
              className="w-full max-w-[440px] pt-2"
            >
              <div className="flex items-center justify-between w-full">
                {/* 1. Hair */}
                <div 
                  onClick={() => onOpenBookingFor('hair')}
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="text-[#e7c19a] group-hover:text-white transition-colors">
                    <HairIcon className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                  </div>
                  <span
                    style={{
                      fontFamily: config.servicesStrip.fontFamily,
                      fontSize: `${config.servicesStrip.fontSize || 12.5}px`,
                      fontWeight: config.servicesStrip.fontWeight || 500,
                      color: config.servicesStrip.textColor,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {config.servicesStrip.item1Text || 'Hair'}
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
                  <span
                    style={{
                      fontFamily: config.servicesStrip.fontFamily,
                      fontSize: `${config.servicesStrip.fontSize || 12.5}px`,
                      fontWeight: config.servicesStrip.fontWeight || 500,
                      color: config.servicesStrip.textColor,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {config.servicesStrip.item2Text || 'Skin'}
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
                  <span
                    style={{
                      fontFamily: config.servicesStrip.fontFamily,
                      fontSize: `${config.servicesStrip.fontSize || 12.5}px`,
                      fontWeight: config.servicesStrip.fontWeight || 500,
                      color: config.servicesStrip.textColor,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {config.servicesStrip.item3Text || 'Nails'}
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
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontFamily: config.servicesStrip.fontFamily,
                      fontSize: `${config.servicesStrip.fontSize || 12.5}px`,
                      fontWeight: config.servicesStrip.fontWeight || 500,
                      color: config.servicesStrip.textColor,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {config.servicesStrip.item4Text || 'Spa & Wellness'}
                  </span>
                </div>
              </div>
            </DraggableElement>
          )}

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          6. BOTTOM EDITORIAL BAR: Centered Opening Hours (Stars & Trusted Removed)
      ───────────────────────────────────────────────────────────── */}
      <footer className="absolute bottom-3 sm:bottom-4 lg:bottom-4.5 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 flex items-center justify-center pointer-events-auto">
        
        {/* Center: Hours of Operation */}
        <div className="flex items-center gap-3.5 select-none">
          <span className="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[9.5px] uppercase tracking-[0.24em] text-[#ded3c7]/65 font-medium">
            OPENING HOURS
          </span>
          <div className="h-3.5 w-[1px] bg-white/20" />
          <div className="flex flex-col text-[9px] sm:text-[9.5px] uppercase tracking-[0.18em] text-white/90 font-medium">
            <span>MON — SAT</span>
            <span className="text-[#efc9a5]">10:00 AM — 8:00 PM</span>
          </div>
        </div>

      </footer>

    </div>
  );
};