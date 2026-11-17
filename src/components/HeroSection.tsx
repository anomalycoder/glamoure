import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  ArrowRight, 
  ShieldCheck, 
  Play,
  Activity
} from 'lucide-react';

interface HeroSectionProps {
  visionActive: boolean;
  onToggleVision: () => void;
  onOpenBookingModal: () => void;
}

type ChairState = 'occupied' | 'available' | 'sanitizing';

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  visionActive, 
  onToggleVision,
  onOpenBookingModal 
}) => {
  const [chairState, setChairState] = useState<ChairState>('occupied');
  const [elapsedMinutes, setElapsedMinutes] = useState(24);
  const [predictedRemaining, setPredictedRemaining] = useState(16);

  // Subtle timer tick for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(prev => (prev < 45 ? prev + 1 : 18));
      setPredictedRemaining(prev => (prev > 2 ? prev - 1 : 20));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-8 flex flex-col justify-between overflow-hidden bg-[#070605]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#e5c378]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#c4973b]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-emerald-500/4 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Top Eyebrow Bar: High-concept luxury + AI telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121110]/90 border border-[#e5c378]/25 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5c378] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e5c378]" />
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.22em] text-[#e5c378] font-medium">
              COMPUTER VISION • SALON OPERATING SYSTEM
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#a8a29e]/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Zero-Face Privacy</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#e5c378]" />
              <span>RTSP / IP Camera Agnostic</span>
            </span>
          </div>
        </div>

        {/* Monumental Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-8 sm:mb-12">
          <div className="lg:col-span-8">
            <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl md:text-7xl xl:text-8xl tracking-[-0.03em] leading-[0.95] text-white">
              THE PHYSICAL FLOOR.{' '}
              <span className="block mt-1 font-['Italiana'] italic font-normal text-[#e5c378] tracking-normal">
                Observed & Predicted.
              </span>
            </h1>
          </div>
          
          <div className="lg:col-span-4 flex flex-col justify-end">
            <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#c4c0b8] leading-relaxed font-light mb-6">
              Connect physical chair occupancy, real-time queues, and online scheduling. Our computer vision engine tracks seats automatically so double bookings are mathematically eliminated.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBookingModal}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e5c378] via-[#e5c378] to-[#caa043] text-[#090807] font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,195,120,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Experience Live Floor</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#vision"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#161412]/80 hover:bg-[#201d19] border border-white/10 hover:border-[#e5c378]/30 text-white/80 hover:text-white font-['Space_Grotesk'] text-xs sm:text-sm tracking-wide transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#e5c378] fill-[#e5c378]/20" />
                <span>How Vision Works</span>
              </a>
            </div>
          </div>
        </div>

        {/* THE CRAZY SHOWSTOPPER: THE INTERACTIVE HERO VISUAL WITH CV HUD */}
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] bg-[#0d0c0b] group">
          {/* Top Camera Telemetry Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0f0e0d]/90 border-b border-white/8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#a8a29e]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white/90 font-medium">CAM-01 [STYLING BAY A]</span>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="hidden sm:inline text-[#e5c378]/80">ZONE: CHAIR_01_MIRROR</span>
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-['JetBrains_Mono'] text-[11px] text-[#a8a29e] mr-1">
                Simulate State:
              </span>
              <div className="inline-flex rounded-full bg-[#171513] p-0.5 border border-white/10 font-['JetBrains_Mono'] text-[10px]">
                <button
                  onClick={() => setChairState('occupied')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    chairState === 'occupied' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Occupied
                </button>
                <button
                  onClick={() => setChairState('available')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    chairState === 'available' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setChairState('sanitizing')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    chairState === 'sanitizing' 
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Buffer
                </button>
              </div>

              <button
                onClick={onToggleVision}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b1916] hover:bg-[#25221e] border border-white/10 text-[11px] font-['JetBrains_Mono'] text-[#e5c378] transition-colors cursor-pointer"
              >
                <Scan className="w-3 h-3" />
                <span>{visionActive ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}</span>
              </button>
            </div>
          </div>

          {/* The Hero Image Stage */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.3/1] w-full overflow-hidden">
            {/* The User's Image */}
            <img 
              src="/hero-salon.jpg" 
              alt="SalonOS AI - Intelligent Salon Chair with Computer Vision" 
              className={`w-full h-full object-cover object-[center_35%] transition-all duration-700 ${
                visionActive ? 'contrast-[1.05] brightness-[0.92]' : 'brightness-100'
              }`}
            />

            {/* Subtle Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/50 pointer-events-none" />

            {/* Scanlines Effect (Only when HUD active) */}
            {visionActive && (
              <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
            )}

            {/* COMPUTER VISION YOLO BOUNDING RETICLE OVER THE CHAIR & PERSON */}
            {visionActive && (
              <div 
                className={`absolute transition-all duration-500 pointer-events-none ${
                  chairState === 'occupied' 
                    ? 'border-amber-400/70 shadow-[0_0_30px_rgba(245,158,11,0.25)]' 
                    : chairState === 'available'
                    ? 'border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : 'border-sky-400/70 shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                }`}
                style={{
                  left: '21%',
                  top: '18%',
                  width: '24%',
                  height: '74%',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                {/* 4 Precision Reticle Corner Markers */}
                <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#e5c378]" />
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#e5c378]" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#e5c378]" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#e5c378]" />

                {/* Vertical Laser Radar Sweep Bar */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e5c378] to-transparent opacity-75 animate-radar pointer-events-none" />

                {/* Floating Micro Tag on Bounding Box Header */}
                <div className="absolute -top-7 left-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0a0908]/90 border border-[#e5c378]/50 backdrop-blur-md font-['JetBrains_Mono'] text-[10px] text-[#e5c378] whitespace-nowrap shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ID: CHAIR_01 • {chairState.toUpperCase()}</span>
                  <span className="text-white/40 font-normal">| 99.4% CONF</span>
                </div>

                {/* Sub-label showing real-time service tracking */}
                {chairState === 'occupied' && (
                  <div className="absolute -bottom-9 left-0 right-0 flex items-center justify-between px-2.5 py-1 rounded bg-[#0c0b0a]/90 border border-amber-500/30 backdrop-blur-md font-['JetBrains_Mono'] text-[10px] text-[#f4f2ed] shadow-lg">
                    <span className="text-amber-400 font-medium">BALAYAGE & CUT</span>
                    <span className="text-white/60">{elapsedMinutes}m elapsed</span>
                  </div>
                )}
              </div>
            )}

            {/* RIGHT SIDE FLOATING TELEMETRY HUDS (Placed in the empty space of the photo) */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex flex-col gap-3 max-w-xs pointer-events-auto">
              {/* Card 1: Live Seat Status & ML Prediction */}
              <div className="p-4 rounded-xl bg-[#0c0b0a]/85 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[#e5c378]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#a8a29e] tracking-wider uppercase">
                    SEAT DYNAMICS // BAY 01
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-semibold ${
                    chairState === 'occupied'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : chairState === 'available'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {chairState === 'occupied' ? 'Occupied' : chairState === 'available' ? 'Available' : 'Buffer'}
                  </span>
                </div>

                {chairState === 'occupied' ? (
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-['Space_Grotesk'] font-medium text-sm text-white">
                        Service in Progress
                      </span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#e5c378] font-bold">
                        ~{predictedRemaining}m remaining
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-[#e5c378] rounded-full transition-all duration-500"
                        style={{ width: `${(elapsedMinutes / (elapsedMinutes + predictedRemaining)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#a8a29e]">
                      <span>Stylist: Elena Vance</span>
                      <span>Next Vacant: ~15:10</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-white font-['Space_Grotesk'] font-medium text-sm mb-1">
                      Ready for Instant Allocation
                    </div>
                    <p className="text-[11px] font-['Space_Grotesk'] text-[#a8a29e] mb-2">
                      Zero wait time. Suitable for Cut, Styling, or Color services.
                    </p>
                    <button 
                      onClick={onOpenBookingModal}
                      className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-['Space_Grotesk'] font-medium transition-colors cursor-pointer"
                    >
                      Assign Walk-in / Slot Now
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Next Smart Slot Recommendation */}
              <div className="hidden sm:block p-3.5 rounded-xl bg-[#0c0b0a]/80 border border-white/8 backdrop-blur-md shadow-xl">
                <div className="text-xs text-white/90 font-['Space_Grotesk']">
                  Next optimal appointment window:
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#f4f2ed]">
                    3:30 PM — 4:10 PM
                  </span>
                  <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-white/5 text-emerald-400">
                    100% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Photo Caption / Signature */}
            <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] text-white/40">
              <span>STREAM: RTSP://192.168.1.104/BAY_A</span>
              <span>•</span>
              <span>NO BIOMETRIC IDENTIFIERS STORED</span>
            </div>
          </div>
        </div>

        {/* 3 ESSENTIAL ARCHITECTURAL METRICS: NO CLUTTER, PURE PUNCH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 border-t border-white/8">
          <div className="flex items-start gap-4">
            <span className="font-['JetBrains_Mono'] text-xs text-[#e5c378] font-bold pt-1">01/</span>
            <div>
              <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-white mb-1">
                Tri-Resource Scheduling
              </h3>
              <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#a8a29e] leading-relaxed">
                Slots unlock only when Chair, Stylist, and Station are all simultaneously available. Zero overlap.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-['JetBrains_Mono'] text-xs text-[#e5c378] font-bold pt-1">02/</span>
            <div>
              <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-white mb-1">
                Computer Vision Ground Truth
              </h3>
              <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#a8a29e] leading-relaxed">
                Passive CCTV or webcam zone tracking observes physical seats. Never assumes service end without staff confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-['JetBrains_Mono'] text-xs text-[#e5c378] font-bold pt-1">03/</span>
            <div>
              <h3 className="font-['Syne'] font-bold text-base sm:text-lg text-white mb-1">
                Dynamic Walk-In QR Tickets
              </h3>
              <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#a8a29e] leading-relaxed">
                Seamless digital queueing. Online availability updates the millisecond a walk-in is assigned to a seat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
