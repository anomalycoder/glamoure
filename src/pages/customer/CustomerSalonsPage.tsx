import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  Scissors, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CustomerSalonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const salons = db.getAllSalons();

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'name'>('relevance');

  const cities = ['all', ...Array.from(new Set(salons.map(s => s.city)))];

  const handleToggleFavorite = (salonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      addToast('Please sign in to save your favorite atelier.', 'info');
      return;
    }
    const isNowFav = db.toggleFavorite(user.id, 'salon', salonId);
    addToast(isNowFav ? 'Salon saved to your favorites' : 'Salon removed from favorites', 'success');
  };

  const filteredSalons = salons
    .filter(salon => {
      const matchesSearch = salon.name.toLowerCase().includes(search.toLowerCase()) ||
        salon.city.toLowerCase().includes(search.toLowerCase()) ||
        salon.address.toLowerCase().includes(search.toLowerCase()) ||
        (salon.description || '').toLowerCase().includes(search.toLowerCase());

      const matchesCity = selectedCity === 'all' || salon.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesRating = minRating === 0 || 4.9 >= minRating; // All Glamouré flagship salons maintain 4.9+
      return matchesSearch && matchesCity && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return 4.98 - 4.92;
      return 0; // relevance
    });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-[#E8D8C7]/60 pb-6">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
          Atelier Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
          Glamouré Sanctuaries &amp; Flagship Salons
        </h1>
        <p className="font-sans text-sm text-[#806B5C] mt-2 max-w-2xl">
          Explore architectural luxury destinations offering high-fashion color, clinical esthetics, and restorative Japanese scalp therapies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#806B5C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by atelier name, district, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] placeholder:text-[#806B5C]/60 focus:outline-none focus:border-[#B99470]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* City Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#806B5C] font-mono">Location:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470] capitalize cursor-pointer"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All Locations' : c}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#806B5C] font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470] cursor-pointer"
              >
                <option value="relevance">Curated Relevance</option>
                <option value="rating">Top Guest Rating</option>
                <option value="name">Atelier Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Salons Grid */}
      {filteredSalons.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7]">
          <p className="font-serif text-lg text-[#41332B]">No sanctuaries found matching your criteria</p>
          <p className="text-xs text-[#806B5C] mt-1">Try broadening your search keyword or location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSalons.map((salon) => {
            const branches = db.getBranchesBySalon(salon.id);
            const salonServices = db.getServicesBySalon(salon.id);
            const staffList = db.getStaffBySalon(salon.id);
            const isFav = user ? db.isFavorite(user.id, 'salon', salon.id) : false;

            return (
              <div 
                key={salon.id}
                className="bg-white/90 rounded-3xl border border-[#E8D8C7] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Salon Cover Header */}
                  <div className="h-44 bg-[#41332B] relative overflow-hidden flex items-end p-6 text-[#F5EFE7]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                    
                    {/* Cover photo or ambient gradient */}
                    <img 
                      src="/booking/ai_recommended_lounge.jpg" 
                      alt={salon.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(salon.id, e)}
                      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors cursor-pointer"
                      title={isFav ? "Saved to Favorites" : "Save Atelier"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>

                    <div className="relative z-20">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B99470] font-bold block mb-1">
                        HAUTE ATELIER
                      </span>
                      <h2 className="font-serif text-2xl text-white font-light">{salon.name}</h2>
                      <p className="text-xs text-[#E8D8C7]/90 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B99470]" /> {salon.address}, {salon.city}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-xs text-[#806B5C] leading-relaxed line-clamp-2">
                      {salon.description || 'Flagship sanctuary featuring private balayage suites, organic hair glazes, and botanical facial therapy.'}
                    </p>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F5EFE7]/60 border border-[#E8D8C7]/60 text-center">
                      <div>
                        <span className="text-[10px] font-mono text-[#806B5C] block uppercase">Rating</span>
                        <span className="font-serif text-sm font-semibold text-[#41332B] flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.98
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#806B5C] block uppercase">Master Artisans</span>
                        <span className="font-serif text-sm font-semibold text-[#41332B]">{staffList.length} Stylists</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#806B5C] block uppercase">Rituals</span>
                        <span className="font-serif text-sm font-semibold text-[#41332B]">{salonServices.length} Offerings</span>
                      </div>
                    </div>

                    {/* Branches Preview */}
                    {branches.length > 0 && (
                      <div className="text-xs text-[#806B5C] space-y-1">
                        <span className="font-mono text-[10px] uppercase font-semibold text-[#41332B] block">Operating Suites:</span>
                        <p className="text-xs">
                          {branches.map(b => `${b.name} (${b.city})`).join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-[#E8D8C7]/60 mt-4 pt-4">
                  <Link 
                    to={`/customer/salons/${salon.slug}`}
                    className="text-xs font-medium text-[#806B5C] hover:text-[#41332B] transition-colors"
                  >
                    View Full Atelier Dossier &rarr;
                  </Link>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/customer/book?salonId=${salon.id}`)}
                    className="rounded-full text-xs shadow-xs"
                  >
                    Reserve at {salon.name.split(' ')[0]}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
