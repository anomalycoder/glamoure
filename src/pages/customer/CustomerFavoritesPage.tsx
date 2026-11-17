import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { CustomerFavorites } from '../../types/common';
import { Button } from '../../components/ui/Button';
import { 
  Heart, 
  Building2, 
  Scissors, 
  User, 
  Star, 
  Clock, 
  MapPin, 
  ArrowRight,
  Trash2
} from 'lucide-react';

export const CustomerFavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'salons' | 'services' | 'staff'>('salons');
  const [refreshKey, setRefreshKey] = useState(0);

  const favorites: CustomerFavorites = user ? db.getFavorites(user.id) : { userId: '', salonIds: [], serviceIds: [], staffIds: [] };

  const allSalons = db.getAllSalons();
  const allServices = db.getAllServices();
  const primarySalon = allSalons[0];
  const allStaff = primarySalon ? db.getStaffBySalon(primarySalon.id) : [];

  const savedSalons = allSalons.filter(s => favorites.salonIds.includes(s.id));
  const savedServices = allServices.filter(srv => favorites.serviceIds.includes(srv.id));
  const savedStaff = allStaff.filter(st => favorites.staffIds.includes(st.id));

  const handleRemoveFavorite = (type: 'salon' | 'service' | 'staff', id: string, name: string) => {
    if (!user) return;
    db.toggleFavorite(user.id, type, id);
    addToast(`Removed ${name} from your saved favorites`, 'info');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="border-b border-[#E8D8C7]/60 pb-6">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
          Curated Sanctuary Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
          Saved Favorites &amp; Preferred Artisans
        </h1>
        <p className="font-sans text-sm text-[#806B5C] mt-2 max-w-2xl">
          Quickly access and book your preferred ateliers, bespoke ritual formulas, and trusted master stylists.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E8D8C7]/60 pb-3">
        <button
          onClick={() => setActiveTab('salons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'salons'
              ? 'bg-[#41332B] text-white shadow-xs font-semibold'
              : 'text-[#806B5C] hover:bg-[#E8D8C7]/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Ateliers ({savedSalons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#41332B] text-white shadow-xs font-semibold'
              : 'text-[#806B5C] hover:bg-[#E8D8C7]/50'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Rituals ({savedServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-[#41332B] text-white shadow-xs font-semibold'
              : 'text-[#806B5C] hover:bg-[#E8D8C7]/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Master Artisans ({savedStaff.length})</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: SAVED SALONS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'salons' && (
        <div>
          {savedSalons.length === 0 ? (
            <div className="py-16 text-center bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7] space-y-3">
              <Building2 className="w-8 h-8 text-[#B99470] mx-auto" />
              <p className="font-serif text-lg text-[#41332B]">No Ateliers Saved Yet</p>
              <p className="text-xs text-[#806B5C]">Explore our flagship sanctuaries and click the heart icon to save.</p>
              <Link to="/customer/salons">
                <Button variant="primary" size="sm">Explore Ateliers</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSalons.map(s => (
                <div key={s.id} className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#B99470] font-bold">
                        SANCTUARY
                      </span>
                      <button
                        onClick={() => handleRemoveFavorite('salon', s.id, s.name)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Remove Favorite"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#41332B]">{s.name}</h3>
                    <p className="text-xs text-[#806B5C] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B99470]" /> {s.address}, {s.city}
                    </p>
                    <p className="text-xs text-[#806B5C] mt-3 line-clamp-2">{s.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                    <Link to={`/customer/salons/${s.slug}`} className="text-xs text-[#806B5C] hover:text-[#41332B]">
                      View Dossier &rarr;
                    </Link>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => navigate(`/customer/book?salonId=${s.id}`)}
                      className="text-xs rounded-full"
                    >
                      Reserve Slot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: SAVED SERVICES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'services' && (
        <div>
          {savedServices.length === 0 ? (
            <div className="py-16 text-center bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7] space-y-3">
              <Scissors className="w-8 h-8 text-[#B99470] mx-auto" />
              <p className="font-serif text-lg text-[#41332B]">No Rituals Saved Yet</p>
              <p className="text-xs text-[#806B5C]">Explore our menu of hair, skin, and spa rituals and bookmark your favorites.</p>
              <Link to="/customer/services">
                <Button variant="primary" size="sm">Explore Rituals</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedServices.map(srv => (
                <div key={srv.id} className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#806B5C] uppercase bg-[#F5EFE7] px-2 py-0.5 rounded">
                        {srv.categoryName}
                      </span>
                      <button
                        onClick={() => handleRemoveFavorite('service', srv.id, srv.name)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Remove Favorite"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#41332B]">{srv.name}</h3>
                    <p className="text-xs text-[#806B5C] mt-1 line-clamp-2">{srv.description}</p>
                    <span className="text-xs font-mono text-[#806B5C] flex items-center gap-1 mt-3">
                      <Clock className="w-3 h-3 text-[#B99470]" /> {srv.durationMinutes} mins
                    </span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex items-center justify-between">
                    <span className="font-serif text-xl font-semibold text-[#41332B]">${srv.price}</span>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => navigate(`/customer/book?serviceId=${srv.id}`)}
                      className="text-xs rounded-full"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: SAVED MASTER ARTISANS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'staff' && (
        <div>
          {savedStaff.length === 0 ? (
            <div className="py-16 text-center bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7] space-y-3">
              <User className="w-8 h-8 text-[#B99470] mx-auto" />
              <p className="font-serif text-lg text-[#41332B]">No Artisans Saved Yet</p>
              <p className="text-xs text-[#806B5C]">Bookmark stylists who deliver exceptional results.</p>
              <Link to="/customer/explore">
                <Button variant="primary" size="sm">Discover Artisans</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedStaff.map(st => (
                <div key={st.id} className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase text-[#B99470] font-bold">MASTER ARTISAN</span>
                      <button
                        onClick={() => handleRemoveFavorite('staff', st.id, st.displayName)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Remove Favorite"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#41332B] text-white flex items-center justify-center font-serif text-base border-2 border-[#B99470]">
                        {st.displayName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-medium text-[#41332B]">{st.displayName}</h3>
                        <p className="text-xs text-[#806B5C]">{st.title}</p>
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {st.rating.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#806B5C] italic line-clamp-2">"{st.bio}"</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8D8C7]/60 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => navigate(`/customer/book?staffId=${st.id}`)}
                      className="text-xs rounded-full w-full"
                    >
                      Book with {st.displayName.split(' ')[0]}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
