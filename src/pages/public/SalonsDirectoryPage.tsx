import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MapPin, Phone, Star, ArrowUpRight, Search } from 'lucide-react';

export const SalonsDirectoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const salons = db.getAllSalons();

  const filteredSalons = salons.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF6F1] font-['Plus_Jakarta_Sans'] text-[#241812] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#41332B]/10 bg-white/70 backdrop-blur-md px-6 sm:px-12 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-block group text-left">
            <h1 className="font-['Montserrat'] text-2xl font-light tracking-[0.22em] uppercase text-[#41332B] group-hover:text-[#806B5C] transition-colors leading-none">
              GLAMOURÉ
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.24em] text-[#806B5C] mt-1 font-medium">
              Sanctuary Directory
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/services" className="text-xs text-[#41332B] font-medium hover:underline">
              Services
            </Link>
            <Link to="/login" className="text-xs text-[#41332B] font-medium hover:underline">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm">Register Salon</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-10 flex-1">
        {/* Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 text-left">
          <div>
            <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
              Independent Studios
            </span>
            <h2 className="font-['Montserrat'] text-3xl sm:text-4xl font-light tracking-tight text-[#41332B]">
              Discover Glamouré Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-[#806B5C] mt-1.5 max-w-lg">
              Explore curated atelier locations, reserve dedicated chair time, and experience bespoke artistry.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#806B5C] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by salon name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#41332B]/15 text-xs text-[#241812] placeholder-[#806B5C]/60 focus:outline-none focus:border-[#41332B]"
            />
          </div>
        </div>

        {/* Salons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons.map(salon => {
            const branches = db.getBranchesBySalon(salon.id);
            const staffList = db.getStaffBySalon(salon.id);

            return (
              <Card key={salon.id} className="flex flex-col justify-between p-6 hover:shadow-lg transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-['Montserrat'] text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8D8C7]/50 text-[#41332B] font-semibold">
                      {salon.city}, {salon.country}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>4.98</span>
                    </div>
                  </div>

                  <h3 className="font-['Montserrat'] text-xl font-medium text-[#41332B] group-hover:text-[#806B5C] transition-colors mb-1 text-left">
                    {salon.name}
                  </h3>
                  <p className="text-xs text-[#806B5C] line-clamp-2 leading-relaxed text-left mb-4">
                    {salon.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#41332B]/80 text-left border-t border-[#41332B]/10 pt-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#806B5C] shrink-0" />
                      <span className="truncate">{salon.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#806B5C] shrink-0" />
                      <span>{salon.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#806B5C] mb-6">
                    <span className="font-semibold text-[#41332B]">{branches.length}</span> Branches ·{' '}
                    <span className="font-semibold text-[#41332B]">{staffList.length}</span> Master Artisans
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link to={`/salons/${salon.slug}`} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full justify-between">
                      <span>View Services &amp; Book</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#41332B]" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#41332B]/10 bg-white/50 py-6 text-center text-xs text-[#806B5C]">
        © 2026 Glamouré Multi-Tenant Platform · Road No. 36, Jubilee Hills
      </footer>
    </div>
  );
};
