import React from 'react';
import { ArrowUpRight, Calendar, User, Zap } from 'lucide-react';
import { renderFlourishText } from '../utils/flourishText';
import aiRecommendedLoungeImg from '../assets/ai_recommended_lounge.jpg';

interface BookingCtaSectionProps {
  onOpenBooking: () => void;
}

export const BookingCtaSection: React.FC<BookingCtaSectionProps> = ({
  onOpenBooking,
}) => {
  return (
    <section 
      id="booking-visit" 
      className="relative w-full overflow-hidden select-none bg-[#D5AF9A] text-[#41332B]"
    >
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP (lg+): Full-Bleed Architectural Sanctuary Experience
          - Image anchored right so the floating AI card and clients are NEVER cut off
          - Left wall tone seamlessly matches #D5AF9A
          - Editorial text positioned on the left wall with pristine contrast
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block relative w-full min-h-[640px] xl:min-h-[720px] 2xl:min-h-[780px] h-[92vh] max-h-[880px]">
        
        {/* Background Image Container pinned to right */}
        <div className="absolute inset-y-0 right-0 w-[68%] xl:w-[65%] 2xl:w-[62%] h-full overflow-hidden pointer-events-none">
          <img
            src={aiRecommendedLoungeImg}
            alt="Glamouré Sanctuary - Real-Time AI Booking and Waiting Lounge"
            className="w-full h-full object-cover object-right select-none"
            loading="eager"
          />
          
          {/* Flawless blend from photo wall into the section background */}
          <div className="absolute inset-y-0 left-0 w-36 xl:w-52 bg-gradient-to-r from-[#D5AF9A] via-[#D5AF9A]/70 to-transparent pointer-events-none" />
          
          {/* Subtle top & bottom edge blending to unify with neighbor sections */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#D5AF9A]/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#D5AF9A]/30 to-transparent pointer-events-none" />
        </div>

        {/* Content on Left Wall */}
        <div className="relative z-10 max-w-[1400px] mx-auto h-full flex items-center px-8 xl:px-16 2xl:px-20 pointer-events-auto">
          <div className="max-w-[480px] xl:max-w-[520px] flex flex-col justify-center items-start text-left">
            
            {/* Eyebrow: NO MORE WAITING */}
            <div className="mb-2 sm:mb-2.5">
              <span 
                className="font-['Plus_Jakarta_Sans'] uppercase font-semibold text-[#5a4335]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '3.5px',
                }}
              >
                NO MORE WAITING
              </span>
            </div>

            {/* Heading: Signature Typography with Flourish S & B */}
            <h2 
              className="leading-[1.08] block m-0 p-0 text-left font-light mb-4 sm:mb-5 text-[#41332B]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(32px, 3.4vw, 46px)',
                fontWeight: 300,
                letterSpacing: '3px',
                color: '#41332B',
              }}
            >
              <span className="block mb-1 sm:mb-1.5" style={{ color: '#41332B' }}>
                {renderFlourishText({
                  text: '{S}KIP THE WAIT,',
                  sansFont: "'Montserrat', sans-serif",
                  flourishFont: "'Alex Brush', cursive",
                  flourishScale: 1.45,
                  flourishOffsetY: 0,
                  flourishColor: '#41332b',
                })}
              </span>
              <span className="block" style={{ color: '#41332B' }}>
                {renderFlourishText({
                  text: '{B}OOK IN REAL TIME.',
                  sansFont: "'Montserrat', sans-serif",
                  flourishFont: "'Alex Brush', cursive",
                  flourishScale: 1.45,
                  flourishOffsetY: 0,
                  flourishColor: '#41332b',
                })}
              </span>
            </h2>

            {/* Subheader */}
            <p 
              className="font-['Plus_Jakarta_Sans'] font-normal text-[#4e3a2e] leading-[1.65] max-w-md mb-7 sm:mb-8 text-[14.5px] sm:text-[15px]"
              style={{
                letterSpacing: '0.2px',
              }}
            >
              Experience effortless salon luxury with live availability, intelligent stylist matching, and instant confirmed reservations.
            </p>

            {/* 3 Micro-Features */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-9">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
                <span className="font-['Montserrat'] text-[11px] text-[#41332B] font-semibold uppercase tracking-wider">
                  Live Slots
                </span>
              </div>
              <span className="text-[#6d5445]/40">·</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
                <span className="font-['Montserrat'] text-[11px] text-[#41332B] font-semibold uppercase tracking-wider">
                  Your Stylist
                </span>
              </div>
              <span className="text-[#6d5445]/40">·</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
                <span className="font-['Montserrat'] text-[11px] text-[#41332B] font-semibold uppercase tracking-wider">
                  Instant Booking
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onOpenBooking}
                className="group inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 rounded-full bg-[#41332B] hover:bg-[#58463c] text-[#F3ECE7] font-['Plus_Jakarta_Sans'] text-[13px] sm:text-[13.5px] font-medium tracking-[0.14em] uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(65,51,43,0.22)] hover:shadow-[0_14px_32px_rgba(65,51,43,0.32)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#efc9a5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE & TABLET (< lg): Clean Stacked Editorial Layout
          - Zero overlap over subjects or holographic card
          - Complete 16:9 photo displayed with rounded corners & shadow
      ───────────────────────────────────────────────────────────── */}
      <div className="block lg:hidden w-full px-6 py-14 sm:py-16">
        <div className="max-w-[620px] mx-auto flex flex-col items-start text-left mb-8">
          
          <div className="mb-2">
            <span 
              className="font-['Plus_Jakarta_Sans'] uppercase font-semibold text-[#5a4335]"
              style={{
                fontSize: '10.5px',
                letterSpacing: '3px',
              }}
            >
              NO MORE WAITING
            </span>
          </div>

          <h2 
            className="leading-[1.12] block m-0 p-0 text-left font-light mb-3 text-[#41332B]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: 300,
              letterSpacing: '2.5px',
            }}
          >
            <span className="block mb-1">
              {renderFlourishText({
                text: '{S}KIP THE WAIT,',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.4,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>
            <span className="block">
              {renderFlourishText({
                text: '{B}OOK IN REAL TIME.',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.4,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>
          </h2>

          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[#4e3a2e] leading-[1.6] max-w-md mb-6 text-[14px]">
            Experience effortless salon luxury with live availability, intelligent stylist matching, and instant confirmed reservations.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-6 text-[#41332B]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider font-['Montserrat']">Live Slots</span>
            </div>
            <span className="text-[#6d5445]/40">·</span>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider font-['Montserrat']">Your Stylist</span>
            </div>
            <span className="text-[#6d5445]/40">·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider font-['Montserrat']">Instant Booking</span>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#41332B] text-[#F3ECE7] font-['Plus_Jakarta_Sans'] text-xs font-semibold tracking-wider uppercase shadow-md active:scale-95 transition-all cursor-pointer mb-6"
          >
            <span>Book Appointment</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#efc9a5]" />
          </button>

          {/* Full Uncropped Photo Card with 16:9 Aspect Ratio */}
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-[#41332b]/15 relative">
            <img
              src={aiRecommendedLoungeImg}
              alt="Glamouré AI Recommended Slot & Waiting Lounge"
              className="w-full h-full object-cover object-center select-none"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
