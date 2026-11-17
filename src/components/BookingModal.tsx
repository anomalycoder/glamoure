import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { HairIcon, SkinIcon, NailsIcon, SpaIcon } from './ServiceIcons';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'hair' | 'skin' | 'nails' | 'spa';
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  initialCategory = 'hair' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'hair' | 'skin' | 'nails' | 'spa'>(initialCategory);
  const [selectedService, setSelectedService] = useState<string>('Signature Cut & Blowout');
  const [selectedStylist, setSelectedStylist] = useState<string>('Elena Vance');
  const [selectedTime, setSelectedTime] = useState<string>('02:30 PM');
  const [selectedDate] = useState<string>('Tomorrow, Nov 17');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const servicesData = {
    hair: [
      { name: 'Signature Cut & Blowout', time: '50 min', price: '$85' },
      { name: 'Custom Balayage & Glaze', time: '120 min', price: '$220' },
      { name: 'Keratin Smoothing Therapy', time: '90 min', price: '$180' },
      { name: 'Editorial Styling & Waves', time: '45 min', price: '$75' },
    ],
    skin: [
      { name: 'Hydra-Glow Botanical Facial', time: '60 min', price: '$130' },
      { name: 'Custom Microderm Sculpt', time: '75 min', price: '$165' },
      { name: 'Oxygen Radiance Infusion', time: '50 min', price: '$110' },
    ],
    nails: [
      { name: 'Luxury Gel Manicure', time: '45 min', price: '$65' },
      { name: 'Spa Pedicure & Paraffin', time: '60 min', price: '$85' },
      { name: 'Nail Artistry & Sculpting', time: '75 min', price: '$95' },
    ],
    spa: [
      { name: 'Warm Basalt Stone Massage', time: '75 min', price: '$150' },
      { name: 'Aromatherapy Scalp & Body Ritual', time: '90 min', price: '$190' },
      { name: 'Detoxifying Herbal Wrap', time: '60 min', price: '$140' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbb08a]" />
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium">
                Salon & Studio
              </span>
            </div>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              Book an Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
          {isConfirmed ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#cbb08a]/20 border border-[#cbb08a]/40 text-[#cbb08a] mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="font-['Montserrat'] text-2xl font-light text-[#f7f2eb]">
                Your Reservation is Confirmed
              </h4>
              <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#efe0cc]/70 max-w-sm mx-auto leading-relaxed font-normal">
                We have reserved your chair for <strong className="text-[#f7f2eb] font-semibold">{selectedService}</strong> with <strong className="text-[#cbb08a] font-semibold">{selectedStylist}</strong> on <strong className="text-[#f7f2eb] font-semibold">{selectedDate}</strong> at <strong className="text-[#f7f2eb] font-semibold">{selectedTime}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-[#1c1815] border border-[#d8c3a8]/20 max-w-xs mx-auto text-center font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#cbb08a]">
                Confirmation code: #GLM-2026-X9
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsConfirmed(false);
                    onClose();
                  }}
                  className="px-8 py-3 rounded-full bg-[#d8c3a8] text-[#1a1614] font-['Plus_Jakarta_Sans'] font-semibold text-xs tracking-wider uppercase hover:bg-[#e8ded2] transition-colors cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Category selector: Small labels: Montserrat 500 */}
              <div>
                <label className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#efe0cc]/60 block mb-3 font-medium">
                  1. Select Experience
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'hair', label: 'Hair', icon: HairIcon },
                    { id: 'skin', label: 'Skin', icon: SkinIcon },
                    { id: 'nails', label: 'Nails', icon: NailsIcon },
                    { id: 'spa', label: 'Spa', icon: SpaIcon },
                  ].map(cat => {
                    const IconComp = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id as any);
                          setSelectedService(servicesData[cat.id as keyof typeof servicesData][0].name);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#cbb08a]/20 border-[#cbb08a] text-[#f7f2eb]' 
                            : 'bg-[#1c1815] border-white/5 text-[#efe0cc]/60 hover:text-[#efe0cc] hover:border-white/20'
                        }`}
                      >
                        <IconComp className="w-5 h-5 text-current" />
                        <span className="font-['Montserrat'] text-xs font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service list */}
              <div>
                <label className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#efe0cc]/60 block mb-3 font-medium">
                  2. Choose Service
                </label>
                <div className="space-y-2">
                  {servicesData[selectedCategory].map(srv => {
                    const isSelected = selectedService === srv.name;
                    return (
                      <div
                        key={srv.name}
                        onClick={() => setSelectedService(srv.name)}
                        className={`cursor-pointer p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#cbb08a]/15 border-[#cbb08a]'
                            : 'bg-[#1c1815] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div>
                          {/* Service card title: Montserrat 400 */}
                          <div className="font-['Montserrat'] text-base font-normal text-[#f7f2eb]">
                            {srv.name}
                          </div>
                          {/* Timings: Plus Jakarta Sans 600 */}
                          <div className="font-['Plus_Jakarta_Sans'] text-xs font-normal text-[#efe0cc]/50">
                            <span className="font-semibold text-[#efe0cc]/70">{srv.time}</span> duration
                          </div>
                        </div>
                        <div className="text-right">
                          {/* Prices: Plus Jakarta Sans 600 */}
                          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#cbb08a]">
                            {srv.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stylist & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#efe0cc]/60 block mb-2 font-medium">
                    3. Stylist
                  </label>
                  <select
                    value={selectedStylist}
                    onChange={e => setSelectedStylist(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#1c1815] border border-white/10 text-xs font-['Plus_Jakarta_Sans'] font-normal text-[#efe0cc] focus:border-[#cbb08a] focus:outline-none"
                  >
                    <option value="Elena Vance">Elena Vance (Master Director)</option>
                    <option value="Marcus Reed">Marcus Reed (Color Specialist)</option>
                    <option value="Aria Chen">Aria Chen (Holistic Esthetician)</option>
                    <option value="First Available">First Available Stylist</option>
                  </select>
                </div>

                <div>
                  <label className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#efe0cc]/60 block mb-2 font-medium">
                    4. Preferred Time
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['11:00 AM', '02:30 PM', '05:00 PM'].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 rounded-xl text-center font-['Plus_Jakarta_Sans'] text-[11px] font-semibold border transition-all cursor-pointer ${
                          selectedTime === slot
                            ? 'bg-[#d8c3a8] text-[#1a1614] border-[#d8c3a8]'
                            : 'bg-[#1c1815] border-white/5 text-[#efe0cc]/70 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirm Button: Plus Jakarta Sans 600 */}
              <button
                type="button"
                onClick={() => setIsConfirmed(true)}
                className="w-full py-4 rounded-full bg-[#d8c3a8] hover:bg-[#e8ded2] text-[#1a1614] font-['Plus_Jakarta_Sans'] font-semibold text-[14px] tracking-wide transition-all shadow-[0_4px_25px_rgba(216,195,168,0.2)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
