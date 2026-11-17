import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-4 sm:px-8 bg-[#060505] border-t border-white/8 font-['Space_Grotesk'] text-[#a8a29e]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#e5c378] flex items-center justify-center">
              <Cpu className="w-3 h-3 text-[#090807]" />
            </div>
            <span className="font-['Syne'] font-bold text-white text-base tracking-wider">
              SALON<span className="text-[#e5c378]">OS</span> AI
            </span>
          </div>
          <p className="text-xs text-[#a8a29e] max-w-sm">
            The intelligent salon operating system. Live chair vision, dynamic tri-resource scheduling, and walk-in queue management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-['Space_Grotesk']">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>GDPR & Privacy Compliant (No Face Scanning)</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-white/60">Built for Modern Salons & Barbershops</span>
        </div>
      </div>
    </footer>
  );
};
