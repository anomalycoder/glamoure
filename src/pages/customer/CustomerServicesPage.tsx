import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Scissors, 
  Clock, 
  Sparkles, 
  Search, 
  User, 
  Building2, 
  ArrowRight, 
  Filter, 
  Check, 
  Heart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CustomerServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const services = db.getAllServices();
  const categories = db.getAllCategories();
  const salons = db.getAllSalons();

  const initialCat = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState<'default' | 'low_high' | 'high_low'>('default');

  const handleToggleFavorite = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      addToast('Please log in to save to favorites.', 'info');
      return;
    }
    const isNowFav = db.toggleFavorite(user.id, 'service', serviceId);
    addToast(isNowFav ? 'Ritual saved to favorites' : 'Removed from favorites', 'success');
  };

  const filteredServices = services
    .filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (priceSort === 'low_high') return a.price - b.price;
      if (priceSort === 'high_low') return b.price - a.price;
      return 0;
    });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-[#E8D8C7]/60 pb-6">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
          Menu of Offerings
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
          Sanctuary Rituals &amp; Protocols
        </h1>
        <p className="font-sans text-sm text-[#806B5C] mt-2 max-w-2xl">
          Browse our four primary disciplines: Hair Artistry, Clinical Skin, Nail Architecture, and Japanese Scalp Spa. Real-time availability and qualified artisans attached to every service.
        </p>
      </div>

      {/* Filter and Category Pills */}
      <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-5 shadow-xs space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#41332B] text-white shadow-2xs font-semibold'
                : 'bg-[#F5EFE7]/80 border border-[#E8D8C7] text-[#806B5C] hover:border-[#B99470]'
            }`}
          >
            All Disciplines ({services.length})
          </button>
          {categories.map(c => {
            const count = services.filter(s => s.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#41332B] text-white shadow-2xs font-semibold'
                    : 'bg-[#F5EFE7]/80 border border-[#E8D8C7] text-[#806B5C] hover:border-[#B99470]'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#E8D8C7]/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#806B5C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ritual name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5EFE7]/40 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] placeholder:text-[#806B5C]/60 focus:outline-none focus:border-[#B99470]"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-[#806B5C] font-mono">Price Sort:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470] cursor-pointer"
            >
              <option value="default">Standard</option>
              <option value="low_high">Price: Low to High</option>
              <option value="high_low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7]">
          <p className="font-serif text-lg text-[#41332B]">No rituals found matching your criteria</p>
          <p className="text-xs text-[#806B5C] mt-1">Try selecting another discipline category or clearing search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const qualifiedStaff = db.getStaffBySalon(service.salonId).filter(st => st.servicesOffered.includes(service.id));
            const salon = db.getSalonById(service.salonId);
            const isFav = user ? db.isFavorite(user.id, 'service', service.id) : false;

            return (
              <div 
                key={service.id}
                className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between hover:border-[#B99470] hover:shadow-md transition-all group"
              >
                <div>
                  {/* Category Pill and Duration */}
                  <div className="flex items-center justify-between text-xs text-[#806B5C] mb-3">
                    <span className="font-mono text-[10px] uppercase font-bold bg-[#F5EFE7] px-2.5 py-1 rounded text-[#41332B]">
                      {service.categoryName || 'Ritual'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs flex items-center gap-1 text-[#806B5C]">
                        <Clock className="w-3.5 h-3.5 text-[#B99470]" /> {service.durationMinutes}m
                      </span>
                      <button
                        onClick={(e) => handleToggleFavorite(service.id, e)}
                        className="p-1 text-[#806B5C] hover:text-rose-500 transition-colors cursor-pointer"
                        title={isFav ? "Saved" : "Save Ritual"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#41332B] group-hover:text-[#B99470] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#806B5C] mt-2 line-clamp-2 leading-relaxed">
                    {service.description || 'Comprehensive bespoke ritual including scalp/skin assessment, organic botanical infusion, and blowout finish.'}
                  </p>

                  {/* Qualified Artisans & Atelier Indicator */}
                  <div className="mt-4 pt-3 border-t border-[#E8D8C7]/60 space-y-1.5 text-xs text-[#806B5C]">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B99470]" />
                      <span>{salon?.name || 'Glamouré Flagship Sanctuary'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B99470]" />
                      <span>{qualifiedStaff.length} Qualified Master Artisans</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#806B5C] uppercase font-mono block">Investment</span>
                    <span className="font-serif text-2xl font-semibold text-[#41332B]">${service.price}</span>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/customer/book?salonId=${service.salonId}&serviceId=${service.id}`)}
                    className="rounded-full text-xs shadow-xs"
                  >
                    Reserve Ritual &rarr;
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
