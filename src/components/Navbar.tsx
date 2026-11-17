import React from 'react';
import { Eye, ArrowUpRight, Cpu } from 'lucide-react';

interface NavbarProps {
  visionActive: boolean;
  onToggleVision: () => void;
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ visionActive, onToggleVision, onOpenBookingModal }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <a href="#" className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#12100e]/80 backdrop-blur-md border border-[#ffffff]/10 hover:border-[#e5c378]/40 transition-all duration-300">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#e5c378] to-[#9c7827] text-[#080706]">
              <Cpu className="w-4 h-4 text-[#080706] stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Syne'] font-bold text-base tracking-wider text-white group-hover:text-[#e5c378] transition-colors">
                SALON<span className="text-[#e5c378]">OS</span>
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#e5c378]/80 font-semibold px-1 py-0.2 rounded bg-[#e5c378]/10 border border-[#e5c378]/20">
                AI
              </span>
            </div>
          </a>

          {/* Engine Status Pill - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#100f0d]/60 backdrop-blur-sm border border-white/5 font-['JetBrains_Mono'] text-[11px] text-[#a8a29e]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#f4f2ed]/90 font-medium">CV ENGINE v2.4</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">SEAT OCCUPANCY: LIVE</span>
          </div>
        </div>

        {/* Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#141210]/80 backdrop-blur-md border border-white/8 text-xs font-['Space_Grotesk'] tracking-wide">
          <a href="#vision" className="px-3 py-1 text-white/70 hover:text-white transition-colors">
            Computer Vision
          </a>
          <a href="#scheduling" className="px-3 py-1 text-white/70 hover:text-white transition-colors">
            Smart Scheduling
          </a>
          <a href="#floor" className="px-3 py-1 text-white/70 hover:text-white transition-colors">
            Live Floor
          </a>
          <a href="#queue" className="px-3 py-1 text-white/70 hover:text-white transition-colors">
            Walk-in Tickets
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick HUD Toggle button */}
          <button
            onClick={onToggleVision}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-['JetBrains_Mono'] tracking-wide transition-all duration-300 border cursor-pointer ${
              visionActive 
                ? 'bg-[#e5c378]/15 border-[#e5c378]/50 text-[#f4dfa0] shadow-[0_0_15px_rgba(229,195,120,0.2)]' 
                : 'bg-[#181614]/80 border-white/10 text-white/60 hover:text-white hover:border-white/20'
            }`}
            title="Toggle Computer Vision Bounding Overlay"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{visionActive ? 'HUD: ON' : 'HUD: OFF'}</span>
          </button>

          <button 
            onClick={onOpenBookingModal}
            className="group relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#e5c378] to-[#d4af37] text-[#0a0908] font-['Space_Grotesk'] font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,195,120,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Launch Floor</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
