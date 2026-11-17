import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroGlamoure } from '../../components/HeroGlamoure';
import { ServicesSection } from '../../components/ServicesSection';
import { MomentsSection } from '../../components/MomentsSection';
import { ExperienceSection } from '../../components/ExperienceSection';
import { TestimonialsSection } from '../../components/TestimonialsSection';
import { ArtistsSection } from '../../components/ArtistsSection';
import { BookingCtaSection } from '../../components/BookingCtaSection';
import { FooterSection } from '../../components/FooterSection';
import { BookingModal } from '../../components/BookingModal';
import { ServicesModal } from '../../components/ServicesModal';
import { StylistsModal, AboutModal, ContactModal, PrivacyModal, TermsModal } from '../../components/InfoModals';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const { user, role } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isServicesOpen, setIsServicesOpen] = useState<boolean>(false);
  const [servicesCategory, setServicesCategory] = useState<'hair' | 'skin' | 'nails' | 'spa'>('hair');
  const [isStylistsOpen, setIsStylistsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [bookingCategory, setBookingCategory] = useState<'hair' | 'skin' | 'nails' | 'spa'>('hair');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const openBookingFor = (cat: 'hair' | 'skin' | 'nails' | 'spa') => {
    setBookingCategory(cat);
    setIsBookingOpen(true);
  };

  const openServicesFor = (cat?: 'hair' | 'skin' | 'nails' | 'spa') => {
    if (cat) {
      setServicesCategory(cat);
    }
    setIsServicesOpen(true);
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStylists = () => {
    const el = document.getElementById('stylists');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDashboardPath = () => {
    if (role === 'salon_owner') return '/owner/dashboard';
    if (role === 'salon_member') return '/member/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="relative w-full min-h-screen bg-[#1a1614] font-['Plus_Jakarta_Sans'] font-normal text-[#f5eee6] selection:bg-[#cbb08a]/30 selection:text-white">
      
      {/* Top Floating App Bar Pill (Direct Gateway to Multi-role Portals) */}
      <div className="fixed top-4 right-4 z-40">
        {user ? (
          <Link
            to={getDashboardPath()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#201511]/90 hover:bg-[#34241c] text-[#efc9a5] border border-[#efc9a5]/30 shadow-lg backdrop-blur-md transition-all text-xs font-['Montserrat'] uppercase tracking-wider font-semibold"
          >
            <span>Go to Portal ({role.replace('salon_', '')})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-[#201511]/90 hover:bg-[#34241c] text-[#f5eee6] hover:text-[#efc9a5] border border-white/20 shadow-md backdrop-blur-md transition-all text-xs font-['Plus_Jakarta_Sans'] font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-[#41332B] hover:bg-[#58463c] text-[#f5eee6] border border-[#efc9a5]/40 shadow-md backdrop-blur-md transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold"
            >
              Partner / Register
            </Link>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO VIEW (Refined & Clean)
      ═══════════════════════════════════════════════════════════ */}
      <HeroGlamoure
        onOpenBookingFor={openBookingFor}
        onScrollToServices={scrollToServices}
        onScrollToStylists={scrollToStylists}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#161311]/95 backdrop-blur-lg flex flex-col justify-center items-center gap-6 md:hidden anim-fade">
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => { setMobileMenuOpen(false); scrollToServices(); }} 
            className="text-lg font-['Plus_Jakarta_Sans'] tracking-wide font-medium text-[#e8ded2]/85 hover:text-white transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); scrollToStylists(); }} 
            className="text-lg font-['Plus_Jakarta_Sans'] tracking-wide font-medium text-[#e8ded2]/85 hover:text-white transition-colors"
          >
            Stylists
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setIsAboutOpen(true); }} 
            className="text-lg font-['Plus_Jakarta_Sans'] tracking-wide font-medium text-[#e8ded2]/85 hover:text-white transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); setIsContactOpen(true); }} 
            className="text-lg font-['Plus_Jakarta_Sans'] tracking-wide font-medium text-[#e8ded2]/85 hover:text-white transition-colors"
          >
            Contact
          </button>

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-['Plus_Jakarta_Sans'] tracking-wide font-medium text-[#efc9a5] hover:text-white transition-colors"
          >
            Portal Login
          </Link>
          
          <button 
            onClick={() => { setMobileMenuOpen(false); openBookingFor('hair'); }} 
            className="mt-4 px-7 py-3 rounded-full border border-white/35 hover:border-white text-white font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: "EXPLORE OUR SERVICES" (Exact Match)
      ═══════════════════════════════════════════════════════════ */}
      <ServicesSection
        onOpenBookingFor={openBookingFor}
        onOpenAllServices={() => setIsServicesOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: "MOMENTS OF BEAUTY, ELEGANCE" (Exact Match)
      ═══════════════════════════════════════════════════════════ */}
      <MomentsSection
        onOpenBookingFor={openBookingFor}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: "THE EXPERIENCE" - MORE THAN A SALON (Exact Match)
      ═══════════════════════════════════════════════════════════ */}
      <ExperienceSection
        onOpenBooking={() => openBookingFor('hair')}
        onOpenBookingFor={openBookingFor}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: "LOVED BY OUR CLIENTS" (Exact Match)
      ═══════════════════════════════════════════════════════════ */}
      <TestimonialsSection
        onOpenBookingFor={openBookingFor}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: "NO MORE WAITING" / REAL-TIME BOOKING
      ═══════════════════════════════════════════════════════════ */}
      <BookingCtaSection
        onOpenBooking={() => openBookingFor('hair')}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: "MEET THE EXPERTS" / OUR ARTISTS
      ═══════════════════════════════════════════════════════════ */}
      <ArtistsSection
        onOpenBookingFor={openBookingFor}
        onOpenTeamModal={() => setIsStylistsOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: LUXURY FOOTER (Exact Match)
      ═══════════════════════════════════════════════════════════ */}
      <FooterSection
        onOpenBooking={() => openBookingFor('hair')}
        onOpenBookingFor={openBookingFor}
        onOpenServices={openServicesFor}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════
          INTERACTIVE LUXURY MODALS
      ═══════════════════════════════════════════════════════════ */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCategory={bookingCategory}
      />

      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
        initialCategory={servicesCategory}
        onOpenBooking={() => openBookingFor('hair')}
        onOpenBookingFor={openBookingFor}
      />

      <StylistsModal
        isOpen={isStylistsOpen}
        onClose={() => setIsStylistsOpen(false)}
        onOpenBooking={() => openBookingFor('hair')}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenBooking={() => openBookingFor('hair')}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
};
