import React from 'react';
import { ArrowRight } from 'lucide-react';
import { renderFlourishText } from '../utils/flourishText';

interface ArtistsSectionProps {
  onOpenBookingFor: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenTeamModal?: () => void;
}

interface Artist {
  id: string;
  name: string;
  role: string;
  experience: string;
  category: 'hair' | 'skin' | 'nails' | 'spa';
  photo: string;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  onOpenBookingFor,
}) => {
  const artists: Artist[] = [
    {
      id: 'aisha',
      name: 'Aisha R.',
      role: 'Hair Stylist',
      experience: '6+ Years Experience',
      category: 'hair',
      photo: '/artists/aisha.jpg',
    },
    {
      id: 'karan',
      name: 'Karan V.',
      role: 'Skin Specialist',
      experience: '5+ Years Experience',
      category: 'skin',
      photo: '/artists/karan.jpg',
    },
    {
      id: 'meera',
      name: 'Meera S.',
      role: 'Nail Artist',
      experience: '4+ Years Experience',
      category: 'nails',
      photo: '/artists/meera.jpg',
    },
    {
      id: 'aditya',
      name: 'Aditya N.',
      role: 'Spa Therapist',
      experience: '7+ Years Experience',
      category: 'spa',
      photo: '/artists/aditya.jpg',
    },
  ];

  // Sculpted corner radii for the 4 artist cards:
  // Card 0 (Far Left):   Nails flip from Section 2 -> 25px top-left, 8px top-right, 8px bottom-right, 25px bottom-left
  // Card 1 (Middle 1):   8px corners               -> 8px all corners
  // Card 2 (Middle 2):   8px corners               -> 8px all corners
  // Card 3 (Far Right):  Same Nails from Section 2 -> 8px top-left, 25px top-right, 25px bottom-right, 8px bottom-left
  const cardRadii = [
    '25px 8px 8px 25px', // Left: Nails flipped
    '8px 8px 8px 8px',   // Middle: 8px corners
    '8px 8px 8px 8px',   // Middle: 8px corners
    '8px 25px 25px 8px', // Right: Same Nails from second section
  ];

  return (
    <section 
      id="stylists" 
      className="relative w-full min-h-screen h-[100vh] flex flex-col justify-center items-center pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none bg-[#F4ECE3] text-[#41332B]"
    >
      {/* ─────────────────────────────────────────────────────────────
          07 · MEET THE EXPERTS: Light Champagne · #F4ECE3
          Flows seamlessly between Waiting Section and Footer
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4ECE3] via-[#F4ECE3] to-[#ebdccf] -z-10" />

      {/* Delicate, Faded Ambient Arcs (Low opacity, delicate espresso thread) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-10" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 850"
      >
        <path 
          d="M -10 160 C 100 170, 200 120, 290 0" 
          stroke="#41332b" 
          strokeWidth="0.8" 
          fill="none" 
        />
        <path 
          d="M 1150 850 C 1240 770, 1340 750, 1450 760" 
          stroke="#41332b" 
          strokeWidth="0.8" 
          fill="none" 
        />
      </svg>

      <div className="relative z-10 max-w-[1360px] mx-auto w-full flex flex-col justify-center items-center h-full pt-2 sm:pt-4 pb-4 sm:pb-6">
        
        {/* ═════════════════════════════════════════════════════════
            HEADER: Eyebrow + Flourish Title
            Reduced top padding for crisp vertical alignment
        ═════════════════════════════════════════════════════════ */}
        <div className="text-center mx-auto max-w-2xl shrink-0 mb-6 sm:mb-8 lg:mb-10">
          
          {/* Eyebrow: MEET THE EXPERTS */}
          <div 
            className="font-['Plus_Jakarta_Sans'] uppercase font-medium mb-1.5 sm:mb-2 text-[#806B5C]"
            style={{
              fontSize: '11.5px',
              letterSpacing: '3.5px',
            }}
          >
            MEET THE EXPERTS
          </div>

          {/* Heading: Exact Match to Above Section Typography & Flourish Styling */}
          <h2 
            className="leading-[1.08] block m-0 p-0 text-center font-light text-[#41332B]"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(28px, 3.6vw, 46px)',
              fontWeight: 300,
              letterSpacing: '3.5px',
              color: '#41332B',
            }}
          >
            {/* Line 1: THE {E}XPERTS BEHIND (with Flourish Script E) */}
            <span className="block mb-0.5" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: 'THE {E}XPERTS BEHIND',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>

            {/* Line 2: YOUR GL{O}W. (with Flourish Script O) */}
            <span className="block" style={{ color: '#41332B' }}>
              {renderFlourishText({
                text: 'YOUR GL{O}W.',
                sansFont: "'Montserrat', sans-serif",
                flourishFont: "'Alex Brush', cursive",
                flourishScale: 1.45,
                flourishOffsetY: 0,
                flourishColor: '#41332b',
              })}
            </span>
          </h2>
        </div>

        {/* ═════════════════════════════════════════════════════════
            4 ARTIST CARDS:
            - Moved down with translate-y for grounded editorial placement
            - Left:   Nails component flip from Section 2 (25px 8px 8px 25px)
            - Middle: 8px corners each (8px 8px 8px 8px)
            - Right:  Same Nails component from Section 2 (8px 25px 25px 8px)
            - Tactile warm linen finish & subtle drop shadow
        ═════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-[1300px] mx-auto w-full translate-y-3 sm:translate-y-5 lg:translate-y-7">
          {artists.map((artist, idx) => {
            const cardRadius = cardRadii[idx];
            return (
              <div
                key={artist.id}
                onClick={() => onOpenBookingFor(artist.category)}
                className="group cursor-pointer flex flex-col overflow-hidden bg-gradient-to-b from-[#fbf8f4] to-[#f4eee6] hover:from-[#fdfbf8] hover:to-[#f7f2eb] border border-[#41332B]/12 hover:border-[#41332B]/25 shadow-[0_10px_26px_rgba(65,51,43,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_14px_32px_rgba(65,51,43,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300"
                style={{
                  borderRadius: cardRadius,
                }}
              >
                {/* Top: Portrait Photo */}
                <div className="relative aspect-[1.14/1] w-full overflow-hidden bg-[#e8ded3]">
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                  />
                  {/* Subtle Top-Right Arrow Badge */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#201510]/50 backdrop-blur-md flex items-center justify-center text-white/90 group-hover:bg-[#41332B] transition-colors border border-white/20">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom: Info Block */}
                <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <h3 className="font-['Montserrat'] font-medium text-[14.5px] sm:text-[15px] text-[#41332B] leading-tight group-hover:text-[#806B5C] transition-colors">
                      {artist.name}
                    </h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-[11.5px] sm:text-[12px] text-[#806B5C] leading-tight mt-1">
                      {artist.role}
                    </p>
                  </div>

                  {/* Experience Badge */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#41332B]/10 flex items-center justify-start">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#eee3d6] border border-[#d8c7b6] text-[10.5px] font-['Plus_Jakarta_Sans'] font-medium text-[#6e594d]">
                      {artist.experience}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
