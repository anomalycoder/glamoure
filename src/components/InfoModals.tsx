import React from 'react';
import { X, MapPin, Clock, Phone } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const StylistsModal: React.FC<ModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  if (!isOpen) return null;

  const stylists = [
    {
      name: 'Elena Vance',
      role: 'Founder & Creative Director',
      specialty: 'Precision Cuts, Editorial Blowouts & French Balayage',
      exp: '14+ Years in London & New York',
    },
    {
      name: 'Marcus Reed',
      role: 'Master Colorist',
      specialty: 'Corrective Color, Platinum Blonding & Dimensional Brunettes',
      exp: '10+ Years Vidal Sassoon Trained',
    },
    {
      name: 'Aria Chen',
      role: 'Senior Esthetician & Skin Specialist',
      specialty: 'Lymphatic Drainage, Ultrasonic Hydration & Custom Peels',
      exp: '8+ Years European Holistic Certified',
    },
    {
      name: 'Julian Silva',
      role: 'Master Nail Artist & Spa Director',
      specialty: 'Russian Apex Manicures & Therapeutic Basalt Bodywork',
      exp: '7+ Years Milan Fashion Week Resident',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Master Artisans
            </span>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              Meet Our Stylists
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
          {stylists.map(st => (
            <div key={st.name} className="p-5 rounded-2xl bg-[#1c1815] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-['Montserrat'] text-xl font-normal text-[#f7f2eb]">{st.name}</h4>
                  <span className="text-[10px] font-['Montserrat'] font-medium px-2 py-0.5 rounded-full bg-[#cbb08a]/10 border border-[#cbb08a]/30 text-[#cbb08a]">
                    Verified Master
                  </span>
                </div>
                <div className="font-['Plus_Jakarta_Sans'] text-xs font-medium text-[#cbb08a] mb-1.5">{st.role}</div>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#efe0cc]/70 leading-relaxed mb-1 font-normal">{st.specialty}</p>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#efe0cc]/40 italic font-normal">{st.exp}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenBooking) onOpenBooking();
                }}
                className="shrink-0 px-5 py-2 rounded-full border border-[#d8c3a8]/40 hover:bg-[#d8c3a8] hover:text-[#1a1614] text-[#efe0cc] font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Book with {st.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose, onOpenBooking }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Sanctuary of Beauty
            </span>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              About Glamouré
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-[#efe0cc]/80 font-['Plus_Jakarta_Sans'] font-normal text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
          <p>
            Founded on the principle that self-care is an art form, <strong className="text-[#f7f2eb] font-semibold">Glamouré Salon & Studio</strong> blends old-world European hospitality with modern precision beauty.
          </p>
          <p>
            Every client experience begins with a dedicated consultation. We study bone structure, hair density, skin undertones, and daily routine to craft a look that feels effortless and personal.
          </p>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3.5 rounded-xl bg-[#1c1815] border border-white/5">
              <span className="font-['Montserrat'] text-xl font-light text-[#cbb08a] block mb-0.5">100%</span>
              <span className="text-xs text-[#efe0cc]/70 font-normal">Organic & Cruelty-Free Botanical Products</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1c1815] border border-white/5">
              <span className="font-['Montserrat'] text-xl font-light text-[#cbb08a] block mb-0.5">1-on-1</span>
              <span className="text-xs text-[#efe0cc]/70 font-normal">Uninterrupted Dedicated Chair Attention</span>
            </div>
          </div>
          <p className="text-xs text-[#efe0cc]/60 font-normal">
            Located in the serene heart of the city, our private styling bays offer quiet natural light, ergonomic custom leather seating, and complimentary espresso & prosecco service.
          </p>
        </div>

        <div className="p-6 bg-[#1c1815] border-t border-[#d8c3a8]/10 flex justify-end">
          <button
            onClick={() => {
              onClose();
              if (onOpenBooking) onOpenBooking();
            }}
            className="px-6 py-2.5 rounded-full bg-[#d8c3a8] hover:bg-[#e8ded2] text-[#1a1614] font-['Plus_Jakarta_Sans'] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            Experience Glamouré
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Visit or Inquire
            </span>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              Contact & Location
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4 font-['Plus_Jakarta_Sans'] font-normal text-xs">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1c1815] border border-white/5">
            <MapPin className="w-4 h-4 text-[#cbb08a] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#f7f2eb] font-semibold block text-sm mb-0.5">Studio Sanctuary</span>
              <p className="text-[#efe0cc]/70 leading-relaxed font-normal">
                Road No. 36, Jubilee Hills<br />
                Hyderabad, Telangana 500033
              </p>
              <span className="text-[#cbb08a] text-[11px] mt-1 block font-medium">Complimentary Valet Parking Available</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1c1815] border border-white/5">
            <Clock className="w-4 h-4 text-[#cbb08a] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#f7f2eb] font-semibold block text-sm mb-0.5">Hours of Service</span>
              <p className="text-[#efe0cc]/70 leading-relaxed font-normal">
                Monday – Sunday: 9:00 AM – 9:00 PM<br />
                VIP Suite: By Prior Appointment
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#1c1815] border border-white/5">
            <Phone className="w-4 h-4 text-[#cbb08a] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#f7f2eb] font-semibold block text-sm mb-0.5">Concierge Desk</span>
              <p className="text-[#efe0cc]/70 leading-relaxed font-normal">
                Direct Line: +91 98765 43210<br />
                Email: concierge@glamoure.in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Client Confidentiality
            </span>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              Privacy Policy
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-[#efe0cc]/80 font-['Plus_Jakarta_Sans'] font-normal text-xs sm:text-[13px] leading-relaxed max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              1. Discretion &amp; Personal Data Protection
            </h4>
            <p>
              At Glamouré, privacy is an integral element of luxury. We collect only essential contact and scheduling information required to fulfill your bespoke salon and aesthetic services. Your personal details are never sold, rented, or distributed to third parties.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              2. Technical Formulations &amp; Treatment History
            </h4>
            <p>
              Hair color formulas, skin allergy assessments, and service histories are securely stored in encrypted profile vaults accessible only by your authorized master artisan to ensure seamless continuity across every visit.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              3. Secure Digital Reservations &amp; Payments
            </h4>
            <p>
              Online bookings and deposits are processed through bank-grade PCI-DSS compliant gateways. Glamouré does not retain raw credit card numbers or sensitive payment credentials on local servers.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              4. Concierge Communications
            </h4>
            <p>
              SMS and email reminders are sent exclusively for appointment confirmations, booking status, and requested consultations. You may customize your communication preferences or opt out at any time.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-[#1c1815] border-t border-[#d8c3a8]/10 flex items-center justify-between">
          <span className="text-[11.5px] text-[#cbb08a]/80 font-['Plus_Jakarta_Sans']">
            Last Updated: November 2026
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#d8c3a8] hover:bg-[#e8ded2] text-[#1a1614] font-['Plus_Jakarta_Sans'] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md anim-fade">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#171412] border border-[#d8c3a8]/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#efe0cc]">
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#d8c3a8]/10 bg-[#1c1815]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-[0.25em] text-[#cbb08a] font-medium block mb-1">
              Sanctuary Etiquette
            </span>
            <h3 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-[0.02em] text-[#f7f2eb]">
              Terms of Service
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#efe0cc]/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-[#efe0cc]/80 font-['Plus_Jakarta_Sans'] font-normal text-xs sm:text-[13px] leading-relaxed max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              1. The Sanctuary Atmosphere
            </h4>
            <p>
              To maintain a tranquil environment for all patrons, we request that devices be placed on silent mode upon entry. Silent appointments (where discussion is reserved strictly for consultation) are gladly honored upon request.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              2. Arrival &amp; Reserved Dedicated Time
            </h4>
            <p>
              Please arrive 10 minutes prior to your scheduled slot to enjoy a complimentary herbal infusion or espresso. If you arrive late, your service duration may need to be tailored to respect the reservations of succeeding clients.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              3. Cancellation &amp; Rescheduling Courtesy
            </h4>
            <p>
              Because your stylist’s time is reserved exclusively for you, cancellations or reschedulings must be communicated at least 24 hours in advance. Same-day cancellations may incur a 50% service reservation retainer.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              4. Satisfaction Guarantee &amp; Adjustments
            </h4>
            <p>
              Our artistry is pledged to perfection. If your haircut, color tone, or treatment requires minor refinement, notify our concierge within 7 calendar days of your appointment for a complimentary consultation and adjustment.
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] text-sm uppercase tracking-wider text-[#f7f2eb] font-medium mb-1">
              5. Patch Testing &amp; Hair Health
            </h4>
            <p>
              For new color clients and intensive keratin or chemical treatments, complimentary allergy skin tests are recommended 48 hours prior to service to guarantee complete safety and radiant hair integrity.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-[#1c1815] border-t border-[#d8c3a8]/10 flex items-center justify-between">
          <span className="text-[11.5px] text-[#cbb08a]/80 font-['Plus_Jakarta_Sans']">
            Glamouré Sanctuary Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#d8c3a8] hover:bg-[#e8ded2] text-[#1a1614] font-['Plus_Jakarta_Sans'] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            Agree &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
