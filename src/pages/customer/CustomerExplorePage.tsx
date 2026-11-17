import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../database/db';
import { IntelligenceApi } from '../../intelligence/api/intelligenceApi';
import { Button } from '../../components/ui/Button';
import { 
  Sparkles, 
  Star, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Award, 
  Scissors, 
  Compass 
} from 'lucide-react';

export const CustomerExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const salons = db.getAllSalons();
  const services = db.getAllServices();
  const categories = db.getAllCategories();
  const offers = db.getAllOffers();
  const primarySalon = salons[0];
  const staff = primarySalon ? db.getStaffBySalon(primarySalon.id) : [];

  const personalization = useMemo(() => {
    return IntelligenceApi.getPersonalizedRecommendations(primarySalon?.id || 'salon-glamoure-jubilee', user?.id);
  }, [primarySalon?.id, user?.id]);

  const handleBookService = (serviceId: string) => {
    navigate(`/customer/book?serviceId=${serviceId}`);
  };

  const handleBookStaff = (staffId: string) => {
    navigate(`/customer/book?staffId=${staffId}`);
  };

  return (
    <div className="space-y-12 animate-fade-in text-left">
      {/* ─────────────────────────────────────────────────────────────
          1. EDITORIAL CURATION HERO
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#41332B] text-[#F5EFE7] p-8 sm:p-12 shadow-lg border border-[#E8D8C7]/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B99470] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B99470] font-semibold">
              Curated Sanctuary Dossier
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
            Discover Bespoke Hair Artistry &amp; Clinical Skin Therapies
          </h1>
          <p className="text-xs sm:text-sm text-[#E8D8C7] leading-relaxed font-light">
            Every ritual at Glamouré is choreographed with organic botanical infusions, precision formulation, and restorative scalp wellness protocols.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/customer/book">
              <Button variant="primary" size="lg" className="rounded-full shadow-md">
                Reserve Live Ritual <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/customer/salons">
              <Button variant="outline" size="lg" className="rounded-full border-[#E8D8C7] text-[#F5EFE7] hover:bg-white/10">
                Explore Ateliers
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient Warm Silhouette Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#B99470]/20 via-[#B99470]/5 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1.5 AI PERSONALIZED RECOMMENDATIONS (CURATED DOSSIER)
      ───────────────────────────────────────────────────────────── */}
      {personalization && personalization.recommendedServices.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8D8C7]/60 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#B99470]" />
                <span>AI Bespoke Curation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#B99470] border border-[#E8D8C7]">
                  {personalization.fallbackStrategy === 'content_based' ? 'Client Affinity Model' : 'Signature Flagship'}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
                Curated for Your Aesthetic
              </h2>
            </div>
            <span className="text-xs text-[#806B5C]">
              Focused on <span className="font-medium text-[#41332B]">{personalization.preferredCategory}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalization.recommendedServices.slice(0, 3).map((rec) => (
              <div 
                key={rec.serviceId}
                onClick={() => handleBookService(rec.serviceId)}
                className="bg-white rounded-2xl border border-[#E8D8C7] p-5 shadow-xs hover:border-[#B99470] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#806B5C] px-2 py-0.5 bg-[#FAF6F0] rounded border border-[#E8D8C7]/60">
                      {rec.categoryName}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {rec.matchScore}% Match
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#41332B] group-hover:text-[#B99470] transition-colors">
                    {rec.serviceName}
                  </h3>
                  <p className="text-xs text-[#806B5C] leading-relaxed line-clamp-2">
                    {rec.reasoning}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                  <span className="font-mono font-semibold text-sm text-[#41332B]">
                    ₹{rec.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-medium text-[#41332B] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Reserve <ArrowRight className="w-3 h-3 text-[#B99470]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. RITUAL CATEGORIES SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8D8C7]/60 pb-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
              Sanctuary Disciplines
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
              Four Core Ritual Pillars
            </h2>
          </div>
          <Link to="/customer/services" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium flex items-center gap-1">
            View All Services ({services.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const catServices = services.filter(s => s.categoryId === cat.id);
            return (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/customer/services?category=${cat.id}`)}
                className="group p-6 rounded-2xl border border-[#E8D8C7] bg-white/70 hover:bg-white hover:border-[#B99470] shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE7] text-[#41332B] flex items-center justify-center mb-4 group-hover:bg-[#41332B] group-hover:text-[#F5EFE7] transition-all">
                    <Scissors className="w-4 h-4 text-[#B99470]" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#41332B] group-hover:text-[#B99470] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#806B5C] mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || 'Master precision techniques and bespoke organic therapies.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between text-xs text-[#806B5C]">
                  <span>{catServices.length} Rituals</span>
                  <span className="font-medium text-[#41332B] group-hover:translate-x-1 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED SIGNATURE SERVICES
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8D8C7]/60 pb-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
              Signature Treatments
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
              Most Coveted Atelier Experiences
            </h2>
          </div>
          <Link to="/customer/book" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium flex items-center gap-1">
            Live Slot Booking &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div 
              key={service.id}
              className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#806B5C] mb-2">
                  <span className="uppercase tracking-wider font-semibold font-mono text-[10px] bg-[#F5EFE7] px-2 py-0.5 rounded">
                    {service.categoryName || 'Ritual'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#B99470]" /> {service.durationMinutes}m
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-[#41332B] group-hover:text-[#B99470] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-[#806B5C] mt-2 line-clamp-2 leading-relaxed">
                  {service.description || 'Full sensory consultation, organic wash, bespoke treatment and blowout.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#806B5C] block uppercase font-mono">Investment</span>
                  <span className="font-serif text-xl font-semibold text-[#41332B]">${service.price}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => handleBookService(service.id)}
                  className="text-xs rounded-full"
                >
                  Reserve Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MASTER ARTISAN ROSTER
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8D8C7]/60 pb-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
              Haute Artistry
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
              Meet Our Master Artisans
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((stylist) => (
            <div 
              key={stylist.id} 
              className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between hover:border-[#B99470] transition-all"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#41332B] text-[#F5EFE7] flex items-center justify-center font-serif text-xl border-2 border-[#B99470]">
                    {stylist.avatarUrl || stylist.photoUrl ? (
                      <img src={stylist.avatarUrl || stylist.photoUrl} alt={stylist.displayName} className="w-full h-full object-cover" />
                    ) : (
                      stylist.displayName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#41332B]">{stylist.displayName}</h3>
                    <p className="text-xs text-[#806B5C]">{stylist.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{stylist.rating?.toFixed(2) || '4.95'}</span>
                      <span className="text-[10px] text-[#806B5C]">({stylist.reviewCount || 42} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(stylist.specialties || ['Bespoke Balayage', 'French Color', 'Scalp Therapy']).map((spec, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5EFE7] text-[#41332B]">
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#806B5C] line-clamp-2 italic leading-relaxed">
                  "{stylist.bio || 'Honed at Vidal Sassoon Academy with precision couture techniques.'}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleBookStaff(stylist.id)}
                  className="text-xs w-full rounded-full"
                >
                  Book with {stylist.displayName.split(' ')[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ACTIVE ATELIER PRIVILEGES (OFFERS)
      ───────────────────────────────────────────────────────────── */}
      {offers.length > 0 && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#E8D8C7] to-[#F5EFE7] border border-[#B99470]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#806B5C] font-bold">
              Exclusive Sanctuary Voucher
            </span>
            <h3 className="font-serif text-2xl text-[#41332B] font-light">{offers[0].title}</h3>
            <p className="text-xs text-[#806B5C]">
              Use code <span className="font-mono font-bold text-[#41332B] uppercase bg-white px-2 py-0.5 rounded border border-[#E8D8C7]">{offers[0].code}</span> for {offers[0].discountPercent}% off during reservation checkout.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate(`/customer/book?offerCode=${offers[0].code}`)}
            className="rounded-full shadow-xs whitespace-nowrap"
          >
            Claim Privilege
          </Button>
        </div>
      )}
    </div>
  );
};
