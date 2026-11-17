import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MapPin, Phone, Star, ArrowLeft } from 'lucide-react';

export const SalonDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const salon = db.getSalonBySlug(slug || '');

  if (!salon) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-['Montserrat'] text-2xl text-[#41332B] mb-2">Salon Not Found</h2>
        <p className="text-xs text-[#806B5C] mb-4">The requested salon studio does not exist or has been relocated.</p>
        <Link to="/salons">
          <Button variant="secondary" size="sm">Back to Salons Directory</Button>
        </Link>
      </div>
    );
  }

  const branches = db.getBranchesBySalon(salon.id);
  const categories = db.getCategoriesBySalon(salon.id);
  const services = db.getServicesBySalon(salon.id);
  const staff = db.getStaffBySalon(salon.id);

  return (
    <div className="min-h-screen bg-[#FAF6F1] font-['Plus_Jakarta_Sans'] text-[#241812] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#41332B]/10 bg-white/70 backdrop-blur-md px-6 sm:px-12 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/salons" className="flex items-center gap-2 text-xs font-medium text-[#41332B] hover:text-[#806B5C]">
            <ArrowLeft className="w-4 h-4" />
            <span>All Salons</span>
          </Link>

          <Link to="/" className="font-['Montserrat'] text-xl font-light tracking-[0.22em] uppercase text-[#41332B]">
            GLAMOURÉ
          </Link>

          <Link to="/login">
            <Button size="sm">Sign In / Book</Button>
          </Link>
        </div>
      </header>

      {/* Main Studio View */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-10 flex-1 text-left">
        {/* Banner */}
        <div className="bg-[#41332B] text-[#F5EFE7] rounded-3xl p-8 sm:p-12 mb-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#efc9a5] block mb-2">
              {salon.city}, {salon.country}
            </span>
            <h1 className="font-['Montserrat'] text-3xl sm:text-5xl font-light tracking-tight leading-tight mb-3">
              {salon.name}
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#d8c3a8] font-normal leading-relaxed mb-6">
              {salon.tagline || salon.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#F5EFE7]/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#efc9a5]" />
                <span>{salon.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#efc9a5]" />
                <span>{salon.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Services Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border-b border-[#41332B]/10 pb-4">
              <h2 className="font-['Montserrat'] text-2xl font-light text-[#41332B]">
                Curated Treatment Offerings
              </h2>
              <p className="text-xs text-[#806B5C] mt-1">
                Prices and durations for appointments at {salon.name}.
              </p>
            </div>

            {categories.map(cat => {
              const catServices = services.filter(s => s.categoryId === cat.id);
              if (catServices.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  <h3 className="font-['Montserrat'] text-sm font-semibold uppercase tracking-wider text-[#41332B] bg-[#E8D8C7]/30 px-4 py-2 rounded-xl">
                    {cat.name}
                  </h3>

                  <div className="divide-y divide-[#41332B]/10 bg-white rounded-2xl border border-[#41332B]/10 p-2">
                    {catServices.map(service => (
                      <div key={service.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF6F1]/50 rounded-xl transition-colors">
                        <div>
                          <h4 className="font-['Montserrat'] font-medium text-base text-[#41332B]">
                            {service.name}
                          </h4>
                          <p className="text-xs text-[#806B5C] leading-relaxed max-w-lg mt-0.5">
                            {service.description}
                          </p>
                          <span className="text-[11px] text-[#806B5C] font-semibold mt-1 inline-block">
                            {service.durationMinutes} minutes
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-['Montserrat'] font-semibold text-base text-[#41332B] block mb-2">
                            ₹{service.price.toLocaleString()}
                          </span>
                          <Link to="/login">
                            <Button size="sm">Book Slot</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Master Artisans */}
            <Card>
              <h3 className="font-['Montserrat'] text-xs uppercase tracking-wider font-semibold text-[#41332B] mb-4">
                Master Artisans ({staff.length})
              </h3>
              <div className="space-y-3">
                {staff.map(st => (
                  <div key={st.id} className="flex items-center gap-3">
                    <img
                      src={st.photoUrl || '/artists/karan.jpg'}
                      alt={st.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#41332B]/15"
                    />
                    <div>
                      <h4 className="font-['Montserrat'] text-xs font-semibold text-[#41332B]">
                        {st.displayName}
                      </h4>
                      <p className="text-[11px] text-[#806B5C]">{st.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{st.rating} ({st.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Branches */}
            <Card>
              <h3 className="font-['Montserrat'] text-xs uppercase tracking-wider font-semibold text-[#41332B] mb-3">
                Salon Branches ({branches.length})
              </h3>
              <div className="space-y-3 text-xs">
                {branches.map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-[#FAF6F1] border border-[#41332B]/10">
                    <div className="font-semibold text-[#41332B] flex items-center justify-between">
                      <span>{b.name}</span>
                      {b.isMainBranch && (
                        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#41332B] text-white">
                          Main Flagship
                        </span>
                      )}
                    </div>
                    <div className="text-[#806B5C] mt-1">{b.address}</div>
                    <div className="text-[#806B5C] mt-0.5">{b.phone}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
