import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { HairIcon, SkinIcon, NailsIcon, SpaIcon } from './ServiceIcons';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  initialCategory?: 'hair' | 'skin' | 'nails' | 'spa';
  onOpenBookingFor?: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenBooking,
  initialCategory = 'hair',
  onOpenBookingFor,
}) => {
  const [activeTab, setActiveTab] = useState<'hair' | 'skin' | 'nails' | 'spa'>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveTab(initialCategory);
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const catalog = {
    hair: [
      { name: 'Signature Precision Cut & Style', price: '$85', desc: 'Consultation, botanical scalp cleanse, custom haircut, and bouncy editorial blowout.' },
      { name: 'Custom Balayage & Glaze', price: '$220', desc: 'Hand-painted dimensional highlighting tailored to your skin tone and natural texture.' },
      { name: 'Gloss & Color Refresh', price: '$95', desc: 'Demi-permanent translucent shine enhancement and tone neutralization.' },
      { name: 'Keratin Smooth Infusion', price: '$180', desc: 'Eliminates frizz and locks in glass-like luster for up to 12 weeks.' },
    ],
    skin: [
      { name: 'Hydra-Glow Botanical Facial', price: '$130', desc: 'Deep ultrasonic pore clarification, gentle enzyme peel, and peptide hydration.' },
      { name: 'Collagen Lift & Sculpt Facial', price: '$165', desc: 'Targeted microcurrent facial contouring with organic botanical oils.' },
      { name: 'Detoxifying Clay Clarity Treatment', price: '$110', desc: 'Calming treatment for stressed skin with thermal mineral compresses.' },
    ],
    nails: [
      { name: 'Russian Couture Gel Manicure', price: '$75', desc: 'Meticulous dry cuticle work, flawless apex reinforcement, and non-toxic gel polish.' },
      { name: 'Restorative Botanical Pedicure', price: '$85', desc: 'Epsom soak, gentle exfoliation, hot towel wrap, and nourishing cuticle massage.' },
      { name: 'Minimalist Nail Artistry', price: '$35+', desc: 'Bespoke hand-painted gold leaf, chrome glazes, and clean line accents.' },
    ],
    spa: [
      { name: 'Warm Basalt Stone Body Ritual', price: '$150', desc: 'Soothing volcanic stones melt deep muscular tension with organic lavender cedar.' },
      { name: 'Scalp & Neck Acupressure Release', price: '$70', desc: 'Stimulating tension relief targeting trigger points with warm rosemary jojoba.' },
      { name: 'Holistic Body Polishing & Wrap', price: '$140', desc: 'Fine sea salt buffing followed by warm velvet shea butter hydration.' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Curated Offerings
            </span>
            <h3 className="font-['Montserrat'] text-2xl font-light tracking-[0.02em] text-[#f7f2eb]">
              Services & Treatments
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection: Small labels: Montserrat 500 */}
        <div className="flex border-b border-white/5 px-6 pt-4 gap-4 bg-[#141210]">
          {[
            { id: 'hair', label: 'Hair', icon: HairIcon },
            { id: 'skin', label: 'Skin', icon: SkinIcon },
            { id: 'nails', label: 'Nails', icon: NailsIcon },
            { id: 'spa', label: 'Spa & Wellness', icon: SpaIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 font-['Montserrat'] text-xs uppercase tracking-wider font-medium border-b-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-[#cbb08a] text-[#cbb08a]' 
                    : 'border-transparent text-[#efe0cc]/50 hover:text-[#efe0cc]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services List */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[55vh] overflow-y-auto">
          {catalog[activeTab].map(item => (
            <div
              key={item.name}
              className="p-4 rounded-2xl bg-[#1c1815] border border-white/5 hover:border-[#cbb08a]/30 transition-all flex items-start justify-between gap-4"
            >
              <div>
                {/* Service Card Title: Montserrat 400 */}
                <h4 className="font-['Montserrat'] text-base sm:text-[17px] font-normal text-[#f7f2eb] mb-1">
                  {item.name}
                </h4>
                {/* Paragraphs: Plus Jakarta Sans 400 */}
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#efe0cc]/70 leading-relaxed max-w-md font-normal">
                  {item.desc}
                </p>
              </div>
              <div className="text-right shrink-0">
                {/* Prices & timings: Plus Jakarta Sans 600 */}
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#cbb08a] block">
                  {item.price}
                </span>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenBookingFor) {
                      onOpenBookingFor(activeTab);
                    } else {
                      onOpenBooking();
                    }
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-['Plus_Jakarta_Sans'] font-semibold text-[#efe0cc]/80 hover:text-[#f7f2eb] underline cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="p-6 bg-[#1c1815] border-t border-[#d8c3a8]/10 flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#efe0cc]/60 font-normal">
            Complimentary consultation included with all bespoke services.
          </span>
          <button
            onClick={() => {
              onClose();
              if (onOpenBookingFor) {
                onOpenBookingFor(activeTab);
              } else {
                onOpenBooking();
              }
            }}
            className="px-6 py-2.5 rounded-full bg-[#cbb08a] hover:bg-[#dfc49e] text-[#1c1815] font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
