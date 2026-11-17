import React, { useState } from 'react';
import { Video, CheckCircle2, Clock, User, RefreshCw } from 'lucide-react';

interface ChairData {
  id: string;
  name: string;
  type: 'styling' | 'wash' | 'manicure';
  status: 'occupied' | 'available' | 'buffer';
  service: string;
  stylist: string;
  elapsedMinutes: number;
  totalEstimated: number;
  predictedCompletion: string;
  confidence: number;
}

export const LiveFloorDemo: React.FC = () => {
  const [chairs, setChairs] = useState<ChairData[]>([
    {
      id: 'CH-01',
      name: 'Chair 01 (Mirror Bay A)',
      type: 'styling',
      status: 'occupied',
      service: 'Haircut & Styling',
      stylist: 'Elena Vance',
      elapsedMinutes: 18,
      totalEstimated: 30,
      predictedCompletion: '15:12',
      confidence: 96,
    },
    {
      id: 'CH-02',
      name: 'Chair 02 (Mirror Bay B)',
      type: 'styling',
      status: 'available',
      service: 'Ready for allocation',
      stylist: 'Unassigned',
      elapsedMinutes: 0,
      totalEstimated: 0,
      predictedCompletion: 'Immediate',
      confidence: 99,
    },
    {
      id: 'CH-03',
      name: 'Chair 03 (Color Studio)',
      type: 'styling',
      status: 'occupied',
      service: 'Full Balayage & Glaze',
      stylist: 'Marcus Reed',
      elapsedMinutes: 42,
      totalEstimated: 75,
      predictedCompletion: '15:45',
      confidence: 91,
    },
    {
      id: 'CH-04',
      name: 'Chair 04 (Executive Cut)',
      type: 'styling',
      status: 'buffer',
      service: 'Sanitization & Station Prep',
      stylist: 'Station Buffer',
      elapsedMinutes: 4,
      totalEstimated: 10,
      predictedCompletion: '15:06',
      confidence: 98,
    },
    {
      id: 'WASH-01',
      name: 'Wash Station 01',
      type: 'wash',
      status: 'occupied',
      service: 'Post-Color Scalp Therapy',
      stylist: 'Aria Chen',
      elapsedMinutes: 12,
      totalEstimated: 20,
      predictedCompletion: '15:18',
      confidence: 94,
    },
    {
      id: 'WASH-02',
      name: 'Wash Station 02',
      type: 'wash',
      status: 'available',
      service: 'Ready for allocation',
      stylist: 'Unassigned',
      elapsedMinutes: 0,
      totalEstimated: 0,
      predictedCompletion: 'Immediate',
      confidence: 99,
    },
  ]);

  const toggleStatus = (id: string) => {
    setChairs(prev =>
      prev.map(chair => {
        if (chair.id !== id) return chair;
        if (chair.status === 'occupied') {
          return {
            ...chair,
            status: 'buffer',
            service: 'Sanitization buffer',
            elapsedMinutes: 2,
            totalEstimated: 8,
            predictedCompletion: '5m remaining',
          };
        } else if (chair.status === 'buffer') {
          return {
            ...chair,
            status: 'available',
            service: 'Ready for allocation',
            elapsedMinutes: 0,
            totalEstimated: 0,
            predictedCompletion: 'Immediate',
          };
        } else {
          return {
            ...chair,
            status: 'occupied',
            service: 'Express Fade & Beard',
            stylist: 'Rohan Sharma',
            elapsedMinutes: 6,
            totalEstimated: 25,
            predictedCompletion: '15:25',
          };
        }
      })
    );
  };

  return (
    <section id="floor" className="py-20 px-4 sm:px-8 bg-[#090807] border-t border-white/8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161412] border border-[#e5c378]/30 font-['JetBrains_Mono'] text-[11px] text-[#e5c378] uppercase tracking-widest mb-3">
              <Video className="w-3.5 h-3.5" />
              <span>Live Salon Floor Dashboard</span>
            </div>
            <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Real-Time Floor Intelligence.
            </h2>
          </div>

          <p className="max-w-md font-['Space_Grotesk'] text-sm text-[#a8a29e] leading-relaxed">
            Click any seat below to test how real-time occupancy updates. Computer vision records ground truth while staff controls service milestones.
          </p>
        </div>

        {/* Chair Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chairs.map(chair => (
            <div
              key={chair.id}
              onClick={() => toggleStatus(chair.id)}
              className="group cursor-pointer p-5 rounded-2xl bg-[#0f0e0d] border border-white/8 hover:border-[#e5c378]/50 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Status Indicator Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-white/90">
                    {chair.id}
                  </span>
                  <span className="text-[10px] font-['Space_Grotesk'] px-2 py-0.5 rounded-full bg-white/5 text-[#a8a29e]">
                    {chair.type === 'wash' ? 'WASH BASIN' : 'STYLING CHAIR'}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold transition-colors ${
                    chair.status === 'occupied'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : chair.status === 'available'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {chair.status === 'occupied' ? 'Occupied' : chair.status === 'available' ? 'Available' : 'Buffer'}
                </span>
              </div>

              {/* Service details */}
              <div className="mb-4">
                <h4 className="font-['Syne'] font-bold text-base text-white group-hover:text-[#e5c378] transition-colors mb-1">
                  {chair.name}
                </h4>
                <p className="font-['Space_Grotesk'] text-xs text-[#a8a29e]">
                  {chair.service}
                </p>
              </div>

              {/* Progress and Stylist */}
              {chair.status === 'occupied' ? (
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs">
                    <span className="text-white/60">Elapsed / Est:</span>
                    <span className="text-[#e5c378] font-bold">
                      {chair.elapsedMinutes}m / {chair.totalEstimated}m
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-[#e5c378] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (chair.elapsedMinutes / chair.totalEstimated) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#a8a29e]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#e5c378]" />
                      <span>{chair.stylist}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-['JetBrains_Mono']">
                      <Clock className="w-3 h-3" />
                      <span>Free: ~{chair.predictedCompletion}</span>
                    </span>
                  </div>
                </div>
              ) : chair.status === 'available' ? (
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-['Space_Grotesk'] text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready for instant walk-in</span>
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-white/40">
                    CV CONF: {chair.confidence}%
                  </span>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-['Space_Grotesk'] text-sky-400">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Station sanitization buffer</span>
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#e5c378]">
                    {chair.predictedCompletion}
                  </span>
                </div>
              )}

              {/* Hover prompt */}
              <div className="mt-3 text-[10px] font-['JetBrains_Mono'] text-white/30 text-right group-hover:text-white/70 transition-colors">
                [click to toggle state]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
