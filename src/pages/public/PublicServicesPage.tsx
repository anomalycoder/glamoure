import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../database/db';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const PublicServicesPage: React.FC = () => {
  const salons = db.getAllSalons();
  const defaultSalon = salons[0];
  const categories = defaultSalon ? db.getCategoriesBySalon(defaultSalon.id) : [];
  const services = defaultSalon ? db.getServicesBySalon(defaultSalon.id) : [];

  return (
    <div className="min-h-screen bg-[#FAF6F1] font-['Plus_Jakarta_Sans'] text-[#241812] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#41332B]/10 bg-white/70 backdrop-blur-md px-6 sm:px-12 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-medium text-[#41332B] hover:text-[#806B5C]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="font-['Montserrat'] text-xl font-light tracking-[0.22em] uppercase text-[#41332B]">
            GLAMOURÉ
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/salons" className="text-xs text-[#41332B] font-medium hover:underline">
              Browse Salons
            </Link>
            <Link to="/login">
              <Button size="sm">Sign In / Book</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-6 py-12 flex-1 text-left">
        <div className="mb-10 text-center">
          <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
            Haute Couture Aesthetics
          </span>
          <h2 className="font-['Montserrat'] text-3xl sm:text-4xl font-light tracking-tight text-[#41332B]">
            Treatment &amp; Ritual Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#806B5C] mt-2 max-w-md mx-auto">
            Discover our comprehensive menu of precision cuts, bespoke balayage, and clinical facial therapies.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map(cat => {
            const catServices = services.filter(s => s.categoryId === cat.id);
            if (catServices.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#41332B]/10 pb-2">
                  <h3 className="font-['Montserrat'] text-base uppercase tracking-wider font-semibold text-[#41332B]">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-[#806B5C]">{catServices.length} offerings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catServices.map(service => (
                    <div
                      key={service.id}
                      className="p-5 rounded-2xl bg-white border border-[#41332B]/10 hover:border-[#41332B]/25 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-['Montserrat'] font-medium text-base text-[#41332B]">
                            {service.name}
                          </h4>
                          <span className="font-['Montserrat'] font-semibold text-sm text-[#41332B] shrink-0">
                            ₹{service.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#806B5C] leading-relaxed mb-3">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#41332B]/5">
                        <span className="text-[11px] text-[#806B5C] font-semibold">
                          {service.durationMinutes} minutes
                        </span>
                        <Link to="/login">
                          <Button variant="outline" size="sm">
                            <span>Book Now</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-[#41332B]/10 bg-white/50 py-6 text-center text-xs text-[#806B5C]">
        © 2026 Glamouré Salon Management &amp; Customer Booking Platform.
      </footer>
    </div>
  );
};
