import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../database/db';
import type { CustomerFavorites } from '../../types/common';
import { MetricCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Building2, 
  Scissors, 
  Bell, 
  Star 
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const appointments = user ? db.getAppointmentsByCustomer(user.id) : [];
  const customerProfile = user ? db.getCustomerProfile(user.id) : null;
  const notifications = user ? db.getNotificationsByUser(user.id) : [];
  const favorites: CustomerFavorites = user ? db.getFavorites(user.id) : { userId: '', salonIds: [], serviceIds: [], staffIds: [] };
  const allServices = db.getAllServices();
  const allSalons = db.getAllSalons();
  const allOffers = db.getAllOffers();

  // Find next upcoming appointment
  const upcomingApt = appointments.find(a => ['confirmed', 'checked_in', 'in_progress'].includes(a.status));
  const recentBookings = appointments.slice(0, 4);

  // Recommended services based on profile or popularity
  const recommendedServices = allServices.slice(0, 3);

  // Favorite entities
  const primarySalon = allSalons[0];
  const allStaff = primarySalon ? db.getStaffBySalon(primarySalon.id) : [];
  const favoriteStylists = allStaff.filter(st => favorites.staffIds.includes(st.id));

  return (
    <div className="space-y-10 animate-fade-in text-left">
      {/* ─────────────────────────────────────────────────────────────
          1. GUEST SANCTUARY WELCOME BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#41332B] via-[#2d211b] to-[#201511] text-[#F5EFE7] p-8 sm:p-10 shadow-lg border border-[#E8D8C7]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B99470] font-bold">
              SANCTUARY MEMBER PRIVILEGE
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Esteemed Guest'}
          </h1>
          <p className="text-xs sm:text-sm text-[#E8D8C7]/80 font-light leading-relaxed">
            Your personalized beauty and wellness itinerary. Track upcoming visits, rebook previous rituals, or explore new botanical therapies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link to="/customer/book">
            <Button variant="primary" size="lg" className="rounded-full shadow-md whitespace-nowrap">
              <Calendar className="w-4 h-4 mr-2" /> Reserve New Ritual
            </Button>
          </Link>
          <Link to="/customer/explore">
            <Button variant="outline" size="lg" className="rounded-full border-[#E8D8C7] text-[#F5EFE7] hover:bg-white/10 whitespace-nowrap">
              Explore Ateliers
            </Button>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. UPCOMING VISIT SPOTLIGHT (If active)
      ───────────────────────────────────────────────────────────── */}
      {upcomingApt && (
        <div className="bg-white/90 rounded-3xl border border-[#B99470] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8D8C7]/60">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#806B5C] font-semibold">Your Next Confirmed Sanctuary Visit</span>
                <h2 className="font-serif text-2xl text-[#41332B] font-light">{upcomingApt.serviceName}</h2>
              </div>
            </div>
            <Badge variant={upcomingApt.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#806B5C] font-mono text-[10px] uppercase">Date &amp; Time:</span>
              <p className="font-serif text-base font-medium text-[#41332B]">{upcomingApt.appointmentDate}</p>
              <p className="text-[#806B5C] font-mono">{upcomingApt.startTime} - {upcomingApt.endTime} ({upcomingApt.durationMinutes}m)</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#806B5C] font-mono text-[10px] uppercase">Master Artisan:</span>
              <p className="font-serif text-base font-medium text-[#41332B]">{upcomingApt.staffName}</p>
              <p className="text-[#806B5C]">Station &amp; Chair Prepared</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#806B5C] font-mono text-[10px] uppercase">Atelier Sanctuary:</span>
              <p className="font-serif text-base font-medium text-[#41332B]">Glamouré Flagship</p>
              <p className="text-[#806B5C]">Jubilee Hills Flagship</p>
            </div>
            <div className="flex items-end justify-start sm:justify-end gap-2">
              <Link to={`/customer/bookings/${upcomingApt.id}`}>
                <Button size="sm" variant="outline" className="text-xs rounded-full">
                  Manage Visit &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. KEY GUEST METRICS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Completed Rituals"
          value={appointments.filter(a => a.status === 'completed').length.toString()}
          subtitle="Haute hair and skin treatments"
          icon={<CheckCircle2 className="w-5 h-5 text-[#B99470]" />}
        />
        <MetricCard
          title="Sanctuary Loyalty Tier"
          value={`${customerProfile?.loyaltyPoints || 450} Points`}
          subtitle="Silver Botanical Privileges"
          icon={<Sparkles className="w-5 h-5 text-[#B99470]" />}
        />
        <MetricCard
          title="Active Atelier Vouchers"
          value={allOffers.length.toString()}
          subtitle="Ready to redeem at checkout"
          icon={<Building2 className="w-5 h-5 text-[#B99470]" />}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. RECOMMENDED SERVICES & RECENT VISITS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Rituals */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8D8C7]/60">
            <div>
              <h2 className="font-serif text-xl text-[#41332B]">Recommended for You</h2>
              <p className="text-xs text-[#806B5C]">Tailored to your hair &amp; skin dossier</p>
            </div>
            <Link to="/customer/services" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedServices.map(srv => (
              <div 
                key={srv.id}
                className="p-4 rounded-xl border border-[#E8D8C7] bg-[#F5EFE7]/30 hover:bg-[#F5EFE7]/70 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif text-base font-medium text-[#41332B]">{srv.name}</h3>
                  <p className="text-xs text-[#806B5C] mt-0.5">{srv.durationMinutes} mins • Organic botanical infusion</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-base font-semibold text-[#41332B]">${srv.price}</span>
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => navigate(`/customer/book?serviceId=${srv.id}`)}
                    className="text-xs rounded-full"
                  >
                    Reserve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Booking History with 1-click Rebook */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8D8C7]/60">
            <div>
              <h2 className="font-serif text-xl text-[#41332B]">Recent Visits</h2>
              <p className="text-xs text-[#806B5C]">1-click rebooking and visit receipts</p>
            </div>
            <Link to="/customer/bookings" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium">
              Full History &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#806B5C]">No previous visits recorded yet.</div>
            ) : (
              recentBookings.map(apt => (
                <div 
                  key={apt.id}
                  className="p-4 rounded-xl border border-[#E8D8C7] bg-[#F5EFE7]/30 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-serif text-sm font-medium text-[#41332B] block">{apt.serviceName}</span>
                    <span className="text-[11px] font-mono text-[#806B5C]">{apt.appointmentDate} • {apt.staffName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={apt.status} />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/customer/book?serviceId=${apt.serviceId}&staffId=${apt.staffId}`)}
                      className="text-xs rounded-full"
                    >
                      Rebook
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FAVORITES & ACTIVE OFFERS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Favorite Stylists / Salons */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8D8C7]/60">
            <h2 className="font-serif text-xl text-[#41332B]">Saved Artisans &amp; Ateliers</h2>
            <Link to="/customer/favorites" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium">
              View All Favorites &rarr;
            </Link>
          </div>

          {favorites.staffIds.length === 0 && favorites.salonIds.length === 0 ? (
            <p className="text-xs text-[#806B5C] py-4">Save favorite salons and stylists to access them here.</p>
          ) : (
            <div className="space-y-2.5">
              {favoriteStylists.map(st => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E8D8C7] bg-[#F5EFE7]/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#41332B] text-white flex items-center justify-center font-serif text-xs">
                      {st.displayName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-serif text-sm font-medium text-[#41332B] block">{st.displayName}</span>
                      <span className="text-[11px] text-[#806B5C]">{st.title}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/customer/book?staffId=${st.id}`)} className="text-xs rounded-full">
                    Book
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Vouchers & Notifications */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8D8C7]/60">
            <h2 className="font-serif text-xl text-[#41332B]">Sanctuary Notifications</h2>
            <Link to="/customer/notifications" className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium">
              All Notifications &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map(notif => (
              <div key={notif.id} className="p-3 rounded-xl border border-[#E8D8C7] bg-[#F5EFE7]/30 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#41332B]">{notif.title}</span>
                  <span className="text-[10px] font-mono text-[#806B5C]">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#806B5C]">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
