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
      className="relative w-full min-h-[92vh] lg:min-h-screen lg:h-[100vh] flex items-center overflow-hidden select-none bg-[#E8D8C7] text-[#41332B]"
    >
      {/* ─────────────────────────────────────────────────────────────
          FULL-BLEED BACKGROUND IMAGE: 100%vh Luxury Waiting Lounge & AI Card
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={aiRecommendedLoungeImg}
          alt="Skip the Wait, Book in Real Time - Glamouré Sanctuary"
          className="w-full h-full object-cover object-[78%_center] md:object-[72%_center] lg:object-center select-none"
          loading="eager"
        />
        
        {/* Precision Left Scrim for Text Readability without fogging the photo */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 lg:w-1/2 bg-gradient-to-r from-[#eedecf]/85 via-[#eedecf]/45 to-transparent pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE CONTENT: Header, Subheader, Features & Button
          Placed cleanly on the empty wall space on the left
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1360px] mx-auto w-full px-6 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-0">
        <div className="max-w-[540px] flex flex-col justify-center items-start text-left">
          
          {/* Eyebrow: NO MORE WAITING */}
          <div className="mb-2 sm:mb-2.5">
            <span 
              className="font-['Plus_Jakarta_Sans'] uppercase font-medium text-[#70594a]"
              style={{
                fontSize: '11.5px',
                letterSpacing: '3.5px',
              }}
            >
              NO MORE WAITING
            </span>
          </div>

          {/* Heading: Exact Match to Signature Typography with Flourish S & B */}
          <h2 
            className="leading-[1.08] block m-0 p-0 text-left font-light mb-4 sm:mb-5 text-[#41332B]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              fontWeight: 300,
              letterSpacing: '3.5px',
              color: '#41332B',
            }}
          >
            {/* Line 1: SKIP THE WAIT, (with Flourish Script S) */}
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

            {/* Line 2: BOOK IN REAL TIME. (with Flourish Script B) */}
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

          {/* Subheader: Clean Natural Case Luxury Copy */}
          <p 
            className="font-['Plus_Jakarta_Sans'] font-normal text-[#5c473b] leading-[1.65] max-w-md mb-7 sm:mb-8 text-[14.5px] sm:text-[15px]"
            style={{
              letterSpacing: '0.2px',
            }}
          >
            Experience effortless salon luxury with live availability, intelligent stylist matching, and instant confirmed reservations.
          </p>

          {/* 3 Micro-Features */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-9">
            
            {/* Feature 1: Live Slots */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-[11.5px] text-[#41332B] font-medium uppercase tracking-wider">
                Live Slots
              </span>
            </div>

            <span className="text-[#806B5C]/40 hidden sm:inline">·</span>

            {/* Feature 2: Right Stylist */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-[11.5px] text-[#41332B] font-medium uppercase tracking-wider">
                Your Stylist
              </span>
            </div>

            <span className="text-[#806B5C]/40 hidden sm:inline">·</span>

            {/* Feature 3: Instant Booking */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#41332B]" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-[11.5px] text-[#41332B] font-medium uppercase tracking-wider">
                Instant Booking
              </span>
            </div>

          </div>

          {/* Action Button: Signature Luxury Pill CTA */}
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
    </section>
  );
};
