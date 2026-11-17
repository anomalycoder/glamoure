import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  Scissors, 
  Calendar, 
  CheckCircle2, 
  Heart, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CustomerSalonDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const salon = db.getSalonBySlug(slug || '');

  if (!salon) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#41332B]">Atelier Not Found</h2>
        <p className="text-xs text-[#806B5C]">The sanctuary location requested is not registered in our catalog.</p>
        <Link to="/customer/salons">
          <Button variant="primary">Return to Salons Directory</Button>
        </Link>
      </div>
    );
  }

  const branches = db.getBranchesBySalon(salon.id);
  const services = db.getServicesBySalon(salon.id);
  const categories = db.getCategoriesBySalon(salon.id);
  const staff = db.getStaffBySalon(salon.id);
  const reviews = db.getReviewsBySalon(salon.id);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const isFav = user ? db.isFavorite(user.id, 'salon', salon.id) : false;

  const handleToggleFavorite = () => {
    if (!user) {
      addToast('Please log in to save to favorites.', 'info');
      return;
    }
    const isNowFav = db.toggleFavorite(user.id, 'salon', salon.id);
    addToast(isNowFav ? 'Salon saved to favorites' : 'Removed from favorites', 'success');
  };

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.categoryId === activeCategory);

  return (
    <div className="space-y-10 animate-fade-in text-left">
      {/* Back button */}
      <div>
        <Link to="/customer/salons" className="inline-flex items-center gap-2 text-xs font-medium text-[#806B5C] hover:text-[#41332B] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ateliers Directory
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. ATELIER HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-[#41332B] text-[#F5EFE7] shadow-xl relative border border-[#E8D8C7]/30">
        <div className="h-64 sm:h-80 relative overflow-hidden flex items-end p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#201511] via-[#201511]/50 to-transparent z-10" />
          <img 
            src="/booking/ai_recommended_lounge.jpg" 
            alt={salon.name} 
            className="absolute inset-0 w-full h-full object-cover" 
          />

          <div className="relative z-20 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B99470] font-bold">
                FLAGSHIP SANCTUARY
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">{salon.name}</h1>
              <p className="text-xs sm:text-sm text-[#E8D8C7] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B99470]" /> {salon.address}, {salon.city}, {salon.country}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors cursor-pointer"
                title="Save Salon"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate(`/customer/book?salonId=${salon.id}`)}
                className="rounded-full shadow-lg"
              >
                Reserve Slot at this Atelier
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="bg-[#2a1e18] px-6 sm:px-10 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E8D8C7]">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#B99470]" /> {salon.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#B99470]" /> {salon.email}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#B99470]" /> Tuesday – Sunday • 09:00 – 20:00
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>4.98 / 5.0 Rating</span>
            <span className="text-[#E8D8C7]/60 text-[11px]">({reviews.length || 42} verified reviews)</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SANCTUARY NARRATIVE & BRANCHES
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs">
          <h2 className="font-serif text-2xl text-[#41332B] font-light">Atelier Philosophy</h2>
          <p className="text-xs sm:text-sm text-[#806B5C] leading-relaxed">
            {salon.description || 'Welcome to our bespoke sanctuary where timeless French balayage meets Japanese restorative head spa rituals. Designed with ambient lighting, acoustically secluded bays, and customized organic botanical formulas for each guest.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8D8C7]/60">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#B99470] mt-0.5" />
              <div>
                <span className="font-serif text-sm font-medium text-[#41332B] block">Organic Botanical Backbar</span>
                <span className="text-xs text-[#806B5C]">Free of harsh ammonias, featuring Kérastase and Olaplex active bond rebuilding.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#B99470] mt-0.5" />
              <div>
                <span className="font-serif text-sm font-medium text-[#41332B] block">Guaranteed Zero Waiting</span>
                <span className="text-xs text-[#806B5C]">Algorithmic bay scheduling guarantees your chair is prepared before arrival.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Branches */}
        <div className="space-y-4 bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs">
          <h2 className="font-serif text-xl text-[#41332B]">Suites &amp; Branches</h2>
          <div className="space-y-3">
            {branches.map(b => (
              <div key={b.id} className="p-3.5 rounded-xl border border-[#E8D8C7] bg-[#F5EFE7]/40 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-sm font-medium text-[#41332B]">{b.name}</span>
                  {b.isMainBranch && <span className="text-[10px] font-mono text-[#B99470] font-bold">FLAGSHIP</span>}
                </div>
                <p className="text-xs text-[#806B5C]">{b.address}, {b.city}</p>
                <p className="text-xs text-[#806B5C] font-mono">{b.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RITUAL OFFERINGS & PRICING
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D8C7]/60 pb-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
              Live Menu
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
              Sanctuary Rituals &amp; Protocols
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#41332B] text-white'
                  : 'bg-white border border-[#E8D8C7] text-[#806B5C] hover:border-[#B99470]'
              }`}
            >
              All Rituals
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#41332B] text-white'
                    : 'bg-white border border-[#E8D8C7] text-[#806B5C] hover:border-[#B99470]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div 
              key={service.id}
              className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between hover:border-[#B99470] transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#806B5C] bg-[#F5EFE7] px-2 py-0.5 rounded">
                    {service.categoryName || 'Bespoke'}
                  </span>
                  <span className="text-xs font-mono text-[#806B5C] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B99470]" /> {service.durationMinutes}m
                  </span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#41332B]">{service.name}</h3>
                <p className="text-xs text-[#806B5C] mt-2 line-clamp-2 leading-relaxed">
                  {service.description || 'Full hair/skin analysis with specialized organic botanical application.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                <span className="font-serif text-xl font-semibold text-[#41332B]">${service.price}</span>
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => navigate(`/customer/book?salonId=${salon.id}&serviceId=${service.id}`)}
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
          4. MASTER ARTISANS TEAM
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="border-b border-[#E8D8C7]/60 pb-4">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
            Resident Pedigree
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
            Artisans at {salon.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(stylist => (
            <div 
              key={stylist.id}
              className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-5 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#41332B] text-[#F5EFE7] flex items-center justify-center font-serif text-base border-2 border-[#B99470]">
                  {stylist.avatarUrl || stylist.photoUrl ? (
                    <img src={stylist.avatarUrl || stylist.photoUrl} alt={stylist.displayName} className="w-full h-full object-cover" />
                  ) : (
                    stylist.displayName.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium text-[#41332B]">{stylist.displayName}</h3>
                  <p className="text-xs text-[#806B5C]">{stylist.title}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {stylist.rating?.toFixed(2) || '4.95'}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/customer/book?salonId=${salon.id}&staffId=${stylist.id}`)}
                className="text-xs rounded-full"
              >
                Book
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. VERIFIED GUEST REVIEWS
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="border-b border-[#E8D8C7]/60 pb-4">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#806B5C] font-semibold">
            Guest Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#41332B] font-light mt-1">
            Verified Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-[#806B5C]">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="font-serif italic text-sm text-[#41332B]">"{rev.comment}"</p>
              <div className="pt-2 border-t border-[#E8D8C7]/60 flex items-center justify-between text-xs text-[#806B5C]">
                <span className="font-medium text-[#41332B]">{rev.customerName || 'Sanctuary Regular'}</span>
                <span>Artisan: {rev.staffName || 'Aria Chen'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
