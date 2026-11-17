import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { renderFlourishText } from '../utils/flourishText';

interface TestimonialsSectionProps {
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
}

interface Testimonial {
  id: number;
  name: string;
  category: string;
  categoryKey: 'hair' | 'skin' | 'nails' | 'spa';
  quote: string;
  photo: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenBookingFor,
}) => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ananya S.',
      category: 'Hair Styling',
      categoryKey: 'hair',
      quote: '“The best salon experience I’ve had. The team is so professional and friendly!”',
      photo: '/testimonials/client1.jpg',
    },
    {
      id: 2,
      name: 'Riya M.',
      category: 'Skin Treatment',
      categoryKey: 'skin',
      quote: '“My skin feels so much healthier and brighter. Absolutely loved the bespoke facial!”',
      photo: '/testimonials/client2.jpg',
    },
    {
      id: 3,
      name: 'Megha K.',
      category: 'Nail Care',
      categoryKey: 'nails',
      quote: '“Clean, precise and beautiful results. Highly recommend their Russian apparatus manicure.”',
      photo: '/testimonials/client3.jpg',
    },
    {
      id: 4,
      name: 'Priyanka N.',
      category: 'French Balayage',
      categoryKey: 'hair',
      quote: '“Elena captured the exact tone I envisioned. My hair looks like liquid silk in the sun.”',
      photo: '/moments/moment_1.jpg',
    },
    {
      id: 5,
      name: 'Tara D.',
      category: 'Holistic Head Spa',
      categoryKey: 'spa',
      quote: '“Pure tranquil bliss. The warm botanical oils and acupressure melted months of desk fatigue.”',
      photo: '/moments/moment_2.jpg',
    },
    {
      id: 6,
      name: 'Sonia L.',
      category: 'Hydra-Glow Facial',
      categoryKey: 'skin',
      quote: '“The ultrasonic pore cleanse was painless and left my complexion glass-smooth and radiant.”',
      photo: '/moments/moment_5.jpg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Automatic moving of cards every 4 seconds, pausing on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Determine current 3 testimonials to show based on currentIndex
  const len = testimonials.length;
  const currentReviews = [
    testimonials[currentIndex % len],
    testimonials[(currentIndex + 1) % len],
    testimonials[(currentIndex + 2) % len],
  ];

  // Specific sculpted corner radii for the 3 triptych cards:
  // Card 0 (Left):   Skin from second section in reverse -> 40px top-left, 8px other corners
  // Card 1 (Middle): 8px corners card                    -> 8px all corners
  // Card 2 (Right):  Skin from second section component  -> 8px top-left, 40px top-right, 8px other corners
  const cardRadii = [
    '40px 8px 8px 8px',
    '8px 8px 8px 8px',
    '8px 40px 8px 8px',
  ];

  return (
    <section 
      id="reviews" 
      className="relative w-full min-h-screen h-[100vh] flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none bg-[#D7C4B1] text-[#41332B]"
    >
      {/* ─────────────────────────────────────────────────────────────
          05 · TESTIMONIALS: Mushroom Taupe · #D7C4B1
          Connected seamlessly between Section 4 (#F1EAE2) and Section 6 (#F4ECE3)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dfd0c0] via-[#D7C4B1] to-[#cebcab] -z-10" />

      {/* Soft, Faded Ambient Arcs (Delicate espresso thread, low opacity) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-10" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 800"
      >
        <path 
          d="M 0 140 C 90 150, 180 110, 260 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
          fill="none" 
        />
        <path 
          d="M 1200 800 C 1280 730, 1370 710, 1440 720" 
          stroke="#41332b" 
          strokeWidth="0.8" 
          fill="none" 
        />
        <path 
          d="M 440 0 C 600 220, 840 260, 1020 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
          fill="none" 
        />
      </svg>

      <div className="relative z-10 max-w-[1360px] mx-auto w-full flex flex-col justify-between h-full py-10 sm:py-14 lg:py-16">
        
        {/* ═════════════════════════════════════════════════════════
            HEADER: Exactly Matching Above Sections' Typography & Layout
            - Eyebrow: CLIENT EXPERIENCES (11.5px, tracking 3.5px, #6e594d, no dashes)
            - Heading: {L}OVED BY OUR / {C}LIENTS. (Montserrat 300, clamp 28-44px, Alex Brush flourish)
            - Subheader: Plus Jakarta Sans 13.5px, #6e594d
        ═════════════════════════════════════════════════════════ */}
        <div className="text-center mx-auto max-w-2xl shrink-0">
          
          {/* Eyebrow: CLIENT EXPERIENCES (no dashes, exact match to above sections) */}
          <div 
            className="font-['Plus_Jakarta_Sans'] uppercase font-medium mb-2 sm:mb-2.5 text-[#6e594d]"
            style={{
              fontSize: '11.5px',
              letterSpacing: '3.5px',
            }}
          >
            CLIENT EXPERIENCES
          </div>

          {/* Heading: Exact Match to Above Section Typography & Flourish Styling */}
          <h2 
            className="leading-[1.08] block m-0 p-0 text-center font-light mb-2.5 text-[#41332B]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(30px, 3.8vw, 48px)',
              fontWeight: 300,
              letterSpacing: '3.5px',
              color: '#41332B',
            }}
          >
            {/* Line 1: LOVED BY OUR (with Flourish Script L) */}
            <span className="block mb-0.5" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: '{L}OVED BY OUR',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>

            {/* Line 2: CLIENTS. (with Flourish Script C) */}
            <span className="block" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: '{C}LIENTS.',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>
          </h2>

          {/* Subheader: Clean Natural Case Typography matching Above Section */}
          <p 
            className="text-center font-normal max-w-[540px] mx-auto text-[#6e594d] hidden sm:block"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              lineHeight: 1.55,
              letterSpacing: '0.2px',
            }}
          >
            Real stories of artistry, care and personal transformation.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            3 SLEEK SIMPLE WHITE CARDS (Not too polished):
            - Left:   Skin component from Section 2 in reverse (40px 8px 8px 8px)
            - Middle: 8px corners card (8px 8px 8px 8px)
            - Right:  Skin component from Section 2 (8px 40px 8px 8px)
            - Left side: client image thumbnail
            - Right side: stars, quote, divider, name & category
            - Auto-moving every 4s, pauses on hover
            - Generous 100vh layout
        ═════════════════════════════════════════════════════════ */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 my-auto max-w-[1240px] mx-auto w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {currentReviews.map((item, idx) => {
            const cardRadius = cardRadii[idx];
            return (
              <div
                key={`${item.id}-${idx}-${currentIndex}`}
                onClick={() => onOpenBookingFor(item.categoryKey)}
                className="group cursor-pointer p-4 sm:p-5 bg-gradient-to-br from-[#f5ede3] via-[#ece2d6] to-[#e4d8cb] hover:from-[#f8f1e8] hover:via-[#efe6db] hover:to-[#e8ddd0] border border-[#41332B]/15 hover:border-[#41332B]/30 shadow-[0_12px_30px_rgba(65,51,43,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_16px_36px_rgba(65,51,43,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 flex items-center gap-4 sm:gap-4.5"
                style={{
                  borderRadius: cardRadius,
                }}
              >
                {/* Left: Client Photo Thumbnail with Subtle Border */}
                <div className="relative w-[105px] sm:w-[115px] lg:w-[120px] aspect-[1/1.24] rounded-[14px] overflow-hidden shrink-0 shadow-[0_4px_12px_rgba(65,51,43,0.10)] border border-[#41332B]/12">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                  />
                </div>

                {/* Right: Review Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-1 text-left">
                  {/* 5 Dark Stars */}
                  <div className="flex items-center gap-1 mb-2 text-[#41332B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#41332B] text-[#41332B]" />
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="font-['Plus_Jakarta_Sans'] italic text-[12.5px] sm:text-[13px] text-[#41332B] leading-[1.48] mb-2.5 line-clamp-3">
                    {item.quote}
                  </p>

                  {/* Thin Divider Line */}
                  <div className="w-10 sm:w-12 h-[1px] bg-[#41332B]/20 mb-2" />

                  {/* Client Name & Category */}
                  <div>
                    <h4 className="font-['Montserrat'] font-medium text-[13px] text-[#41332B] leading-tight truncate">
                      {item.name}
                    </h4>
                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-[11px] text-[#70594a] leading-tight block mt-0.5 truncate">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═════════════════════════════════════════════════════════
            BOTTOM CONTROLS: Centered Carousel Indicator Dots + Right Navigation Chevrons
        ═════════════════════════════════════════════════════════ */}
        <div className="relative flex items-center justify-between pt-2 shrink-0">
          
          {/* Spacer on left for perfect optical balance */}
          <div className="hidden sm:block w-24" />

          {/* Centered Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mx-auto">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-5 h-1.5 bg-[#41332B]' 
                    : 'w-1.5 h-1.5 bg-[#41332B]/30 hover:bg-[#41332B]/50'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Right Navigation Arrows: < and > */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-[#41332B]/25 hover:border-[#41332B] bg-white/60 hover:bg-white flex items-center justify-center text-[#41332B] transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.8]" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-[#41332B]/25 hover:border-[#41332B] bg-white/60 hover:bg-white flex items-center justify-center text-[#41332B] transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
