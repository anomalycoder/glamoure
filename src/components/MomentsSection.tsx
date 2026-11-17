import React, { useState } from 'react';
import { renderFlourishText } from '../utils/flourishText';
import { X, ArrowUpRight } from 'lucide-react';

interface MomentsSectionProps {
  onOpenBookingFor?: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
}

interface MomentCard {
  id: string;
  number: string;
  title?: string;
  tag?: string;
  image: string;
  alt: string;
  sizeType: 'big' | 'small' | 'regular';
  cols: string; // Tailwind col-span
  borderRadius: string; // Custom corner radius (some 8px, some with random 25px corner)
}

export const MomentsSection: React.FC<MomentsSectionProps> = ({
  onOpenBookingFor,
}) => {
  const [activeItem, setActiveItem] = useState<MomentCard | null>(null);

  // Row 1: One Regular (3 cols), One Big (4 cols, 25px top-right), One Small (2 cols), One Regular (3 cols, 25px bottom-right)
  const row1: MomentCard[] = [
    {
      id: '01',
      number: '01',
      image: '/moments/moment_1.jpg',
      alt: 'Modern Silk Bob & Soft Waves',
      sizeType: 'regular',
      cols: 'col-span-3',
      borderRadius: '8px',
    },
    {
      id: '02',
      number: '02',
      tag: 'LUXURY HAIR STYLING EXPERIENCE',
      image: '/moments/moment_3.jpg',
      alt: 'Editorial Slicked Back Luxury Styling',
      sizeType: 'big',
      cols: 'col-span-4',
      borderRadius: '8px 25px 8px 8px', // Sculpted top-right corner at 25px
    },
    {
      id: '03',
      number: '03',
      image: '/moments/moment_2.jpg',
      alt: 'Sun-Kissed Dewy Skin Glow',
      sizeType: 'small',
      cols: 'col-span-2',
      borderRadius: '8px',
    },
    {
      id: '04',
      number: '04',
      image: '/moments/moment_4.jpg',
      alt: 'Sleek Architectural Chignon Updo',
      sizeType: 'regular',
      cols: 'col-span-3',
      borderRadius: '8px 8px 8px 25px', // Sculpted bottom-right corner at 25px
    },
  ];

  // Row 2: One Small (2 cols, 25px top-left), One Regular (3 cols), One Regular (3 cols), One Big (4 cols, 25px bottom-left)
  const row2: MomentCard[] = [
    {
      id: '05',
      number: '05',
      image: '/moments/moment_5.jpg',
      alt: 'Glass Hair & Radiant Bronze Glow',
      sizeType: 'small',
      cols: 'col-span-2',
      borderRadius: '25px 8px 8px 8px', // Sculpted top-left corner at 25px
    },
    {
      id: '06',
      number: '06',
      image: '/services/hair.jpg',
      alt: 'Dimensional Balayage & Waves',
      sizeType: 'regular',
      cols: 'col-span-3',
      borderRadius: '8px',
    },
    {
      id: '07',
      number: '07',
      image: '/moments/moment_6.jpg',
      alt: 'Couture Editorial Styling with Brim Hat',
      sizeType: 'regular',
      cols: 'col-span-3',
      borderRadius: '8px',
    },
    {
      id: '08',
      number: '08',
      tag: 'LUMINOUS GLASS SKIN & GLOW',
      image: '/transformations/skin_after.jpg',
      alt: 'Luminous Hydrated Glass Skin',
      sizeType: 'big',
      cols: 'col-span-4',
      borderRadius: '8px 8px 25px 8px', // Sculpted bottom-left corner at 25px
    },
  ];

  return (
    <section 
      id="moments" 
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center pt-20 sm:pt-24 lg:pt-24 pb-20 sm:pb-24 lg:pb-24 px-4 sm:px-6 lg:px-10 xl:px-14 bg-[#E5D5C5] text-[#41332B] select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          03 · ART OF TRANSFORMATION: Sandstone · #E5D5C5
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ebdcd0] via-[#E5D5C5] to-[#dfcebe] -z-10" />

      {/* Delicate, Faded Ambient Arcs (Low opacity, delicate espresso thread) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-10"
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="none"
      >
        {/* Arc flowing in directly from Section 2's bottom connection at x=1020 */}
        <path 
          d="M 1020 0 C 920 180, 680 260, 420 440 S 120 740, 0 860" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
        {/* Soft right-side sweeping arc */}
        <path 
          d="M 1440 220 C 1260 380, 1080 620, 1180 900" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
        {/* Top-left subtle counter curve */}
        <path 
          d="M -20 160 C 140 160, 260 90, 360 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
        />
      </svg>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col justify-center items-center h-full">
        
        {/* ═════════════════════════════════════════════════════════
            HEADER: Exactly Matching Section 2's Structure & Typography
            - Eyebrow: SALON & STUDIO (11.5px, tracking 3.5px, classy brown #806B5C)
            - Heading: M{O}MENTS OF / BEAUTY, ELEGANCE. (Montserrat 300, clamp 28-48px, 3.5px tracking, Alex Brush flourish)
            - Subheader: Plus Jakarta Sans 13.5px, #806B5C, line-height 1.5
        ═════════════════════════════════════════════════════════ */}
        <div className="text-center mx-auto mb-6 sm:mb-7 lg:mb-8 max-w-3xl shrink-0">
          
          {/* Eyebrow: Exact Match to Section 2 */}
          <div 
            className="font-['Plus_Jakarta_Sans'] uppercase font-medium mb-1.5 sm:mb-2 text-[#806B5C]"
            style={{
              fontSize: '11.5px',
              letterSpacing: '3.5px',
            }}
          >
            SALON &amp; STUDIO
          </div>

          {/* Heading: Exact Match to Section 2 Typography & Letter Spacing */}
          <h2 
            className="leading-[1.08] block m-0 p-0 text-center font-light mb-2 sm:mb-2.5 text-[#41332B]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: 300,
              letterSpacing: '3.5px',
              color: '#41332B',
            }}
          >
            {/* Line 1: MOMENTS OF (with Flourish Script O) */}
            <span className="block mb-0.5" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: 'M{O}MENTS OF',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>

            {/* Line 2: BEAUTY, ELEGANCE. (with Flourish Script B and E) */}
            <span className="block" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: '{B}EAUTY, {E}LEGANCE.',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>
          </h2>

          {/* Subheader: Clean Natural Case Typography matching Section 2 */}
          <p 
            className="text-center font-normal max-w-[540px] mx-auto text-[#806B5C] hidden sm:block"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13.5px',
              lineHeight: 1.5,
              letterSpacing: '0.2px',
            }}
          >
            Curated editorial moments of artistry, precision and effortless elegance.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            2-ROW EDITORIAL GALLERY LAYOUT (Fitted in 100vh)
            Row 1: [ Regular ] [ ONE BIG (25px corner) ] [ ONE SMALL ] [ Regular (25px corner) ]
            Row 2: [ ONE SMALL (25px corner) ] [ Regular ] [ Regular ] [ ONE BIG (25px corner) ]
            Some cards with a single 25px random corner, remaining standard 8px
        ═════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col gap-2.5 sm:gap-3 lg:gap-3.5 justify-center max-w-[1380px]">
          
          {/* ──────────────────────────────────────────
              ROW 1: 4 Cards (1 Big, 1 Small, 2 Same/Regular)
          ────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-2.5 sm:gap-3 lg:gap-3.5 items-end w-full">
            {row1.map((card) => (
              <div 
                key={card.id}
                className={`${card.cols} group flex flex-col justify-end relative cursor-pointer`}
                onClick={() => {
                  setActiveItem(card);
                  onOpenBookingFor?.('hair');
                }}
              >
                {/* Number & Tag above card */}
                <div className="mb-1 flex items-center justify-between text-left">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] sm:text-[10.5px] font-normal tracking-wider text-[#241812] block">
                    {card.number}
                  </span>
                  {card.tag && (
                    <span className="font-['Plus_Jakarta_Sans'] text-[7px] sm:text-[7.5px] uppercase tracking-[0.14em] font-medium text-[#5c473b] truncate block max-w-[160px]">
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Card Image: Sculpted with custom corner radius, Scaled for 100vh */}
                <div 
                  className={`relative w-full overflow-hidden bg-[#ded5cc] shadow-[0_4px_18px_rgba(65,51,43,0.12)] hover:shadow-[0_10px_24px_rgba(65,51,43,0.18)] border border-[#41332b]/15 transition-shadow duration-300 ${
                    card.sizeType === 'big' 
                      ? 'h-[160px] sm:h-[185px] lg:h-[210px]' 
                      : card.sizeType === 'small' 
                        ? 'h-[135px] sm:h-[155px] lg:h-[180px]' 
                        : 'h-[150px] sm:h-[170px] lg:h-[195px]'
                  }`}
                  style={{
                    borderRadius: card.borderRadius,
                  }}
                >
                  <img 
                    src={card.image} 
                    alt={card.alt}
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                    style={{ borderRadius: card.borderRadius }}
                  />

                  {/* Subtle hover overlay */}
                  <div 
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none"
                    style={{ borderRadius: card.borderRadius }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[#241812] shadow-md">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ──────────────────────────────────────────
              ROW 2: 4 Cards (1 Small, 2 Same/Regular, 1 Big)
          ────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-2.5 sm:gap-3 lg:gap-3.5 items-end w-full">
            {row2.map((card) => (
              <div 
                key={card.id}
                className={`${card.cols} group flex flex-col justify-end relative cursor-pointer`}
                onClick={() => {
                  setActiveItem(card);
                  onOpenBookingFor?.('hair');
                }}
              >
                {/* Number & Tag above card */}
                <div className="mb-1 flex items-center justify-between text-left">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] sm:text-[10.5px] font-normal tracking-wider text-[#241812] block">
                    {card.number}
                  </span>
                  {card.tag && (
                    <span className="font-['Plus_Jakarta_Sans'] text-[7px] sm:text-[7.5px] uppercase tracking-[0.14em] font-medium text-[#5c473b] truncate block max-w-[160px]">
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Card Image: Sculpted with custom corner radius, Scaled for 100vh */}
                <div 
                  className={`relative w-full overflow-hidden bg-[#ded5cc] shadow-[0_4px_18px_rgba(65,51,43,0.12)] hover:shadow-[0_10px_24px_rgba(65,51,43,0.18)] border border-[#41332b]/15 transition-shadow duration-300 ${
                    card.sizeType === 'big' 
                      ? 'h-[160px] sm:h-[185px] lg:h-[210px]' 
                      : card.sizeType === 'small' 
                        ? 'h-[135px] sm:h-[155px] lg:h-[180px]' 
                        : 'h-[150px] sm:h-[170px] lg:h-[195px]'
                  }`}
                  style={{
                    borderRadius: card.borderRadius,
                  }}
                >
                  <img 
                    src={card.image} 
                    alt={card.alt}
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                    style={{ borderRadius: card.borderRadius }}
                  />

                  {/* Subtle hover overlay */}
                  <div 
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none"
                    style={{ borderRadius: card.borderRadius }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[#241812] shadow-md">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════
          LIGHTBOX / DETAIL PREVIEW MODAL
      ═════════════════════════════════════════════════════════ */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-fade"
          onClick={() => setActiveItem(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#ded5cc] text-[#241812] border border-[#41332b]/20 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#241812]/80 hover:bg-[#241812] text-[#fbf7f2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div 
              className="relative aspect-[3/4] w-full overflow-hidden mb-4 bg-black/10 border border-[#41332b]/15"
              style={{ borderRadius: activeItem.borderRadius }}
            >
              <img 
                src={activeItem.image} 
                alt={activeItem.alt}
                className="w-full h-full object-cover"
                style={{ borderRadius: activeItem.borderRadius }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#5c473b] block mb-1">
                  Moment #{activeItem.number}
                </span>
                <h4 className="font-['Playfair_Display'] text-xl text-[#241812]">
                  {activeItem.alt}
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveItem(null);
                  onOpenBookingFor?.('hair');
                }}
                className="px-5 py-2.5 rounded-full bg-[#241812] hover:bg-[#382820] text-[#fbf7f2] font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-md"
              >
                Book This Look
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MomentsSection;
