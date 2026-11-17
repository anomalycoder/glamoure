import React from 'react';
import { Ticket, Bell } from 'lucide-react';

export const TicketQueueSection: React.FC = () => {
  return (
    <section id="queue" className="py-20 px-4 sm:px-8 bg-[#090807] border-t border-white/8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161412] border border-[#e5c378]/30 font-['JetBrains_Mono'] text-[11px] text-[#e5c378] uppercase tracking-widest mb-3">
            <Ticket className="w-3.5 h-3.5" />
            <span>Walk-In Queue Architecture</span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            A Live Ticket, Not an Appointment Slip.
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#a8a29e] leading-relaxed">
            Walk-in clients scan a kiosk QR code, get a live web tracker on their phone, and online slot inventory recalculates instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] p-4 bg-[#141210] border-4 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-black/80 rounded-full mx-auto mb-4" />

              {/* Mobile Screen Content */}
              <div className="rounded-[1.8rem] bg-[#0c0b0a] p-5 border border-white/8 text-white">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <span className="font-['Syne'] font-bold text-sm tracking-wider text-[#e5c378]">
                    SALONOS PASS
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    LIVE SYNC
                  </span>
                </div>

                {/* Ticket Number & QR */}
                <div className="text-center py-4 bg-[#141210] rounded-2xl border border-white/5 mb-4">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-white/50 tracking-widest uppercase block mb-1">
                    Queue Token
                  </span>
                  <div className="font-['Syne'] font-extrabold text-4xl text-[#e5c378] tracking-tight">
                    #T-108
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-['Space_Grotesk'] text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>2 Guests Ahead of You</span>
                  </div>
                </div>

                {/* Live Details */}
                <div className="space-y-2.5 font-['Space_Grotesk'] text-xs mb-5">
                  <div className="flex justify-between text-[#a8a29e]">
                    <span>Selected Service:</span>
                    <span className="text-white font-medium">Beard Sculpt & Cut</span>
                  </div>
                  <div className="flex justify-between text-[#a8a29e]">
                    <span>Assigned Bay:</span>
                    <span className="text-[#e5c378] font-['JetBrains_Mono'] font-bold">Chair 01</span>
                  </div>
                  <div className="flex justify-between text-[#a8a29e]">
                    <span>Est. Seating Time:</span>
                    <span className="text-white font-['JetBrains_Mono']">~15:14 IST</span>
                  </div>
                </div>

                {/* SMS/WhatsApp status banner */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-[11px] font-['Space_Grotesk'] text-[#c4c0b8]">
                  <Bell className="w-4 h-4 text-[#e5c378] shrink-0" />
                  <span>You will receive an automated ping 5m before your chair is sanitized.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Lifecycle Steps */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0e0d0c] border border-white/8 hover:border-[#e5c378]/30 transition-all">
              <div className="flex items-center gap-3 mb-2 font-['JetBrains_Mono'] text-xs text-[#e5c378]">
                <span className="w-6 h-6 rounded-full bg-[#e5c378]/10 flex items-center justify-center font-bold">01</span>
                <span className="uppercase tracking-wider">Instant Kiosk QR Generation</span>
              </div>
              <p className="font-['Space_Grotesk'] text-sm text-[#a8a29e] leading-relaxed pl-9">
                Walk-in customer scans QR or receptionist enters their name. Token #T-108 is generated instantly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0d0c] border border-white/8 hover:border-[#e5c378]/30 transition-all">
              <div className="flex items-center gap-3 mb-2 font-['JetBrains_Mono'] text-xs text-[#e5c378]">
                <span className="w-6 h-6 rounded-full bg-[#e5c378]/10 flex items-center justify-center font-bold">02</span>
                <span className="uppercase tracking-wider">Online Availability Sync</span>
              </div>
              <p className="font-['Space_Grotesk'] text-sm text-[#a8a29e] leading-relaxed pl-9">
                Online website immediately adjusts available slots. No customer on the web can book an overlapping time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0d0c] border border-white/8 hover:border-[#e5c378]/30 transition-all">
              <div className="flex items-center gap-3 mb-2 font-['JetBrains_Mono'] text-xs text-[#e5c378]">
                <span className="w-6 h-6 rounded-full bg-[#e5c378]/10 flex items-center justify-center font-bold">03</span>
                <span className="uppercase tracking-wider">Computer Vision Handshake</span>
              </div>
              <p className="font-['Space_Grotesk'] text-sm text-[#a8a29e] leading-relaxed pl-9">
                When Chair 01 becomes physically free and sanitized, the system triggers a WhatsApp notification to summon the guest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
