import React from 'react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

interface FooterSectionProps {
  onOpenBooking: () => void;
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenServices: (cat?: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenBooking,
  onOpenBookingFor,
  onOpenServices,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-[#201511] text-[#f5eee6] pt-20 sm:pt-24 pb-12 px-6 sm:px-12 lg:px-16 xl:px-24 overflow-hidden border-t border-[#3a2820]">
      {/* Delicate background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#241812] via-[#201511] to-[#18100d] -z-10" />

      <div className="max-w-[1360px] mx-auto w-full">
        
        {/* ═════════════════════════════════════════════════════════
            TOP GRID: 4 COLUMNS
        ═════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-16 sm:pb-20">
          
          {/* ───────────────────────────────────────────────────────
              COLUMN 1: Brand Logo, Philosophy & Socials (4 cols)
          ─────────────────────────────────────────────────────── */}
          <div className="md:col-span-4 lg:col-span-4 xl:col-span-4 flex flex-col justify-between pr-4 md:border-r border-white/10">
            <div>
              {/* Brand Logo: Clean Architectural Montserrat 300 Light */}
              <div 
                onClick={scrollToTop}
                className="inline-flex flex-col cursor-pointer group mb-1 text-left"
              >
                <h2 className="font-['Montserrat'] text-2xl sm:text-[28px] font-light tracking-[0.22em] uppercase text-[#f5eee6] group-hover:text-[#efc9a5] transition-colors leading-none mb-1">
                  GLAMOURÉ
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[10.5px] sm:text-[11px] text-[#d8c3a8]/80 font-medium tracking-[0.28em] uppercase">
                  Salon &amp; Beauty Studio
                </p>
              </div>

              {/* Brand Philosophy */}
              <p className="font-['Plus_Jakarta_Sans'] text-[13.5px] sm:text-[14px] text-[#c2b3a3] leading-[1.65] font-normal max-w-xs mt-4 mb-7">
                An intimate sanctuary devoted to timeless beauty, bespoke artistry and personal renewal.
              </p>
            </div>

            {/* Social Media Circular Capsules */}
            <div className="flex items-center gap-3 text-[#f5eee6]">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-[#f5eee6] hover:text-[#efc9a5] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-[#f5eee6] hover:text-[#efc9a5] transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-[#f5eee6] hover:text-[#efc9a5] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────
              COLUMN 2: Navigation (2 cols)
          ─────────────────────────────────────────────────────── */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 md:pl-2">
            <h3 className="font-['Montserrat'] text-[15px] sm:text-[16px] font-medium tracking-[0.14em] uppercase text-[#f5eee6] mb-5 sm:mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 font-['Plus_Jakarta_Sans'] font-normal text-[13.5px] text-[#c2b3a3]">
              <li>
                <button onClick={scrollToTop} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToElement('services')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToElement('moments')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Moments
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left text-[#cbb08a] font-medium">
                  Reserve Ritual
                </button>
              </li>
              <li>
                <button onClick={() => { scrollToElement('about'); onOpenAbout(); }} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToElement('reviews')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Client Stories
                </button>
              </li>
              <li>
                <button onClick={() => scrollToElement('stylists')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Our Experts
                </button>
              </li>
            </ul>
          </div>

          {/* ───────────────────────────────────────────────────────
              COLUMN 3: Offerings (3 cols)
          ─────────────────────────────────────────────────────── */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
            <h3 className="font-['Montserrat'] text-[15px] sm:text-[16px] font-medium tracking-[0.14em] uppercase text-[#f5eee6] mb-5 sm:mb-6">
              Offerings
            </h3>
            <ul className="space-y-3 font-['Plus_Jakarta_Sans'] font-normal text-[13.5px] text-[#c2b3a3]">
              <li>
                <button onClick={() => onOpenServices('hair')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Hair Artistry &amp; Balayage
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('skin')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Clinical Skin Therapy &amp; Glow
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('nails')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Russian Apparatus Manicure
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('spa')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  Japanese Head Spa Ritual
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingFor('hair')} className="hover:text-[#f5eee6] transition-colors cursor-pointer text-left">
                  VIP Private Suite Services
                </button>
              </li>
            </ul>
          </div>

          {/* ───────────────────────────────────────────────────────
              COLUMN 4: Sanctuary & Concierge (3 cols)
          ─────────────────────────────────────────────────────── */}
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
            <h3 className="font-['Montserrat'] text-[15px] sm:text-[16px] font-medium tracking-[0.14em] uppercase text-[#f5eee6] mb-5 sm:mb-6">
              Sanctuary
            </h3>
            <ul className="space-y-3.5 font-['Plus_Jakarta_Sans'] font-normal text-[13.5px] text-[#c2b3a3]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#efc9a5] shrink-0 mt-1 stroke-[1.6]" />
                <button 
                  onClick={onOpenContact} 
                  className="hover:text-[#f5eee6] transition-colors text-left"
                >
                  Road No. 36, Jubilee Hills, Hyderabad, India
                </button>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#efc9a5] shrink-0 stroke-[1.6]" />
                <a href="tel:+919876543210" className="hover:text-[#f5eee6] transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#efc9a5] shrink-0 stroke-[1.6]" />
                <a href="mailto:concierge@glamoure.in" className="hover:text-[#f5eee6] transition-colors">
                  concierge@glamoure.in
                </a>
              </li>
              <li className="pt-1 text-[12.5px] text-[#d8c3a8]">
                <span>Mon – Sun: 9:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════
            BOTTOM COPYRIGHT BAR & BACK TO TOP
        ═════════════════════════════════════════════════════════ */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['Plus_Jakarta_Sans'] text-[12.5px] text-[#c2b3a3]/85 font-normal">
            © 2026 Glamouré Salon &amp; Beauty Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenPrivacy} 
              className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#c2b3a3] hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onOpenTerms} 
              className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#c2b3a3] hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>

            {/* Back to Top Smooth Button */}
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[#f5eee6] hover:text-[#efc9a5] text-[11.5px] font-medium font-['Plus_Jakarta_Sans'] transition-all cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
