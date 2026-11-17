import React, { useState } from 'react';
import { Check, X, Cpu } from 'lucide-react';

export const TriSchedulingEngine: React.FC = () => {
  const [selectedService, setSelectedService] = useState<'cut' | 'color' | 'spa'>('cut');

  const serviceSpecs = {
    cut: {
      name: 'Precision Scissor Cut & Finish',
      duration: '40 min',
      chairStatus: 'Available (Bay 02)',
      stylistStatus: 'Available (Elena Vance)',
      washStatus: 'Available in 5m',
      slotOutcome: 'Confirmed Available at 15:30',
      isFeasible: true,
    },
    color: {
      name: 'Balayage & Multi-Tone Glaze',
      duration: '90 min',
      chairStatus: 'Available (Bay 03)',
      stylistStatus: 'Busy until 16:15',
      washStatus: 'Available',
      slotOutcome: 'Blocked: Stylist Busy (Next slot: 16:15)',
      isFeasible: false,
    },
    spa: {
      name: 'Deep Scalp Therapy & Blowout',
      duration: '50 min',
      chairStatus: 'Available',
      stylistStatus: 'Available',
      washStatus: 'Occupied (Wash 01 & 02 busy)',
      slotOutcome: 'Blocked: Washing Stations At Max Capacity',
      isFeasible: false,
    },
  };

  const current = serviceSpecs[selectedService];

  return (
    <section id="scheduling" className="py-20 px-4 sm:px-8 bg-[#070605] border-t border-white/8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Concept description */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161412] border border-[#e5c378]/30 font-['JetBrains_Mono'] text-[11px] text-[#e5c378] uppercase tracking-widest mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Scheduling Engine</span>
            </div>

            <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
              A Salon Slot is Not Just a Calendar Entry.
            </h2>

            <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#c4c0b8] leading-relaxed mb-6 font-light">
              Conventional salon software checks calendar hours. <strong className="text-white font-medium">SalonOS</strong> evaluates the physical trifecta: <span className="text-[#e5c378]">Styling Chair</span>, <span className="text-[#e5c378]">Assigned Stylist</span>, and <span className="text-[#e5c378]">Washing Station</span>.
            </p>

            <div className="space-y-3 font-['Space_Grotesk'] text-xs sm:text-sm text-[#a8a29e]">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0f0e0d] border border-white/5">
                <div className="w-5 h-5 rounded-full bg-[#e5c378]/20 text-[#e5c378] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-white block">Atomic Multi-Resource Locking:</strong>
                  Prevents a slot from opening if a wash basin is bottlenecked, even if 5 styling chairs are empty.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0f0e0d] border border-white/5">
                <div className="w-5 h-5 rounded-full bg-[#e5c378]/20 text-[#e5c378] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-white block">Machine Learning Dynamic Buffers:</strong>
                  Buffers adjust dynamically based on stylist speed and service history, cutting dead-chair idle time by 34%.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Engine Playground */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-[#0e0d0c] border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <span className="font-['JetBrains_Mono'] text-xs text-[#a8a29e] uppercase tracking-wider">
                  Test Scheduling Constraints
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#e5c378] bg-[#e5c378]/10 px-2 py-0.5 rounded border border-[#e5c378]/20">
                  PostgreSQL Transactional Lock
                </span>
              </div>

              {/* Service Selectors */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {(['cut', 'color', 'spa'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedService(key)}
                    className={`py-2 px-3 rounded-xl font-['Space_Grotesk'] text-xs font-semibold capitalize transition-all cursor-pointer ${
                      selectedService === key
                        ? 'bg-gradient-to-r from-[#e5c378] to-[#caa043] text-[#090807] shadow-[0_0_15px_rgba(229,195,120,0.3)]'
                        : 'bg-[#181614] text-white/70 hover:text-white border border-white/5'
                    }`}
                  >
                    {key === 'cut' ? 'Haircut' : key === 'color' ? 'Balayage' : 'Scalp Spa'}
                  </button>
                ))}
              </div>

              {/* Live Resource Checklist */}
              <div className="space-y-3 mb-6">
                {/* Chair */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141210] border border-white/5 font-['JetBrains_Mono'] text-xs">
                  <span className="text-white/80">1. Styling Chair</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>{current.chairStatus}</span>
                  </span>
                </div>

                {/* Stylist */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141210] border border-white/5 font-['JetBrains_Mono'] text-xs">
                  <span className="text-white/80">2. Senior Stylist</span>
                  <span className={`flex items-center gap-1.5 ${current.stylistStatus.includes('Busy') ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {current.stylistStatus.includes('Busy') ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{current.stylistStatus}</span>
                  </span>
                </div>

                {/* Wash Station */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141210] border border-white/5 font-['JetBrains_Mono'] text-xs">
                  <span className="text-white/80">3. Wash Basin</span>
                  <span className={`flex items-center gap-1.5 ${current.washStatus.includes('Occupied') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {current.washStatus.includes('Occupied') ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{current.washStatus}</span>
                  </span>
                </div>
              </div>

              {/* Outcome Banner */}
              <div className={`p-4 rounded-xl border ${
                current.isFeasible 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-bold">
                    Slot Calculation Result:
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs font-semibold">
                    {current.duration}
                  </span>
                </div>
                <div className="font-['Space_Grotesk'] text-sm font-medium">
                  {current.slotOutcome}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
