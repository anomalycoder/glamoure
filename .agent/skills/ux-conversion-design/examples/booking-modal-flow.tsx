import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Calendar, User } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'hair' | 'skin' | 'nails' | 'spa';
}

export const BookingModalFlow: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'hair',
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedStylist, setSelectedStylist] = useState<string>('Elena Rostova');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    { key: 'hair', label: 'Hair Couture' },
    { key: 'skin', label: 'Skin Therapy' },
    { key: 'nails', label: 'Nail Couture' },
    { key: 'spa', label: 'Holistic Spa' },
  ];

  const stylists = ['Elena Rostova (Master Colorist)', 'Marcus Vance (Creative Director)', 'Sophie Laurent (Skin Specialist)'];
  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade">
      <div 
        className="relative w-full max-w-lg bg-[#ded5cc] text-[#41332B] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 border border-[#41332B]/15 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#41332B]/10 hover:bg-[#41332B]/20 text-[#41332B] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-[#B99470] mb-4" />
            <h3 className="font-['Montserrat'] font-light text-2xl tracking-[2px] uppercase text-[#41332B] mb-2">
              Reservation Confirmed
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#806B5C] max-w-xs mb-6">
              Thank you, {clientName || 'valued guest'}. Your appointment with {selectedStylist} is reserved for {selectedTime}.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#41332B] text-[#fbf7f2] font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm}>
            {/* Header */}
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[3px] text-[#B99470] font-medium block mb-1">
              Glamouré Sanctuary
            </span>
            <h3 className="font-['Montserrat'] font-light text-2xl tracking-[2px] uppercase text-[#41332B] mb-6">
              Reserve Your Experience
            </h3>

            {/* Step 1: Category Selection */}
            <div className="mb-6">
              <label className="block font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#806B5C] mb-2 font-medium">
                1. Select Ritual
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key as any)}
                    className={`py-3 px-4 rounded-xl text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider text-left transition-all cursor-pointer ${
                      category === c.key
                        ? 'bg-[#41332B] text-[#fbf7f2] shadow-md font-semibold'
                        : 'bg-[#ded1ca]/60 text-[#41332B] hover:bg-[#ded1ca]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Time Selection */}
            <div className="mb-6">
              <label className="block font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#806B5C] mb-2 font-medium">
                2. Select Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {times.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 px-3.5 rounded-lg text-xs font-['Plus_Jakarta_Sans'] transition-all cursor-pointer ${
                      selectedTime === t
                        ? 'bg-[#41332B] text-[#fbf7f2] font-semibold'
                        : 'bg-[#ded1ca]/60 text-[#41332B] hover:bg-[#ded1ca]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Client Details */}
            <div className="space-y-3 mb-6">
              <label className="block font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider text-[#806B5C] font-medium">
                3. Your Details
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#41332B]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#41332B]"
              />
              <input
                type="tel"
                required
                placeholder="Mobile / WhatsApp Number"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#41332B]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#41332B]"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#41332B] hover:bg-[#2e241e] text-[#fbf7f2] font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-lg cursor-pointer"
            >
              Confirm Reservation · No Deposit Required
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
