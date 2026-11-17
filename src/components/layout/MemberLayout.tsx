import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays,
  Clock, 
  Users, 
  TrendingUp, 
  Bell, 
  User, 
  LogOut, 
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  Coffee
} from 'lucide-react';

export const MemberLayout: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artisanStatus, setArtisanStatus] = useState<'available' | 'in_service' | 'break'>('available');

  const memberNavItems = [
    { label: 'My Overview', to: '/member/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', to: '/member/appointments', icon: Calendar },
    { label: 'My Calendar', to: '/member/calendar', icon: CalendarDays },
    { label: 'My Availability', to: '/member/availability', icon: Clock },
    { label: 'My Customers', to: '/member/customers', icon: Users },
    { label: 'My Performance', to: '/member/performance', icon: TrendingUp },
    { label: 'Notifications', to: '/member/notifications', icon: Bell, badge: unreadCount },
    { label: 'My Profile', to: '/member/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#18110e] text-[#f5eee6] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* ═══════════════════════════════════════════════════════════════
          ARTISAN WORKSTATION TOP BAR
      ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#221612]/95 backdrop-blur-md border-b border-[#3d2a21] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Workspace Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b99470] to-[#806b5c] text-[#18110e] font-['Montserrat'] font-bold flex items-center justify-center text-sm shadow-md">
              G
            </span>
            <div>
              <span className="font-['Montserrat'] text-base tracking-[0.2em] uppercase font-light text-[#f5eee6] group-hover:text-[#efc9a5] transition-colors leading-none">
                GLAMOURÉ
              </span>
              <span className="block text-[9px] uppercase tracking-[0.22em] text-[#b99470] font-semibold">
                Artisan Workstation
              </span>
            </div>
          </Link>
        </div>

        {/* Chair Status Indicator & Next Client Spotlight */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Status pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
            <span className="text-[#a89582] text-[11px] uppercase tracking-wider font-semibold">Chair:</span>
            <select
              value={artisanStatus}
              onChange={(e) => setArtisanStatus(e.target.value as any)}
              className="bg-transparent text-xs font-medium text-[#efc9a5] focus:outline-none cursor-pointer"
            >
              <option value="available" className="bg-[#221612] text-[#efc9a5]">Ready for Client</option>
              <option value="in_service" className="bg-[#221612] text-amber-300">In Ritual Service</option>
              <option value="break" className="bg-[#221612] text-neutral-400">On Micro-Break</option>
            </select>
            <span 
              className={`w-2 h-2 rounded-full ${
                artisanStatus === 'available' ? 'bg-emerald-400 animate-pulse' :
                artisanStatus === 'in_service' ? 'bg-amber-400' : 'bg-neutral-500'
              }`}
            />
          </div>

          {/* Next Client Banner */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#41332b]/60 border border-[#b99470]/30 text-xs text-[#efc9a5]">
            <Sparkles className="w-3.5 h-3.5 text-[#b99470]" />
            <span>Next: <strong>Sophia Chen</strong> (11:15 AM)</span>
          </div>
        </div>

        {/* Quick Role Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Role switcher for quick verification */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-[#a89582] text-[10px] uppercase font-bold">Role:</span>
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value as any;
                switchRole(newRole);
                if (newRole === 'salon_owner') navigate('/owner/dashboard');
                else if (newRole === 'customer') navigate('/customer/dashboard');
              }}
              className="bg-transparent text-xs text-[#efc9a5] focus:outline-none cursor-pointer"
            >
              <option value="salon_member" className="bg-[#221612]">Salon Member</option>
              <option value="salon_owner" className="bg-[#221612]">Salon Owner</option>
              <option value="customer" className="bg-[#221612]">Customer</option>
            </select>
          </div>

          <Link
            to="/member/notifications"
            className="relative p-2 rounded-lg text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b99470]" />
            )}
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#41332b] border border-[#b99470]/40 flex items-center justify-center text-xs font-semibold text-[#efc9a5]">
              {user?.fullName?.charAt(0) || 'M'}
            </div>
            <span className="hidden md:inline text-xs font-medium text-[#f5eee6] truncate max-w-[100px]">
              {user?.fullName || 'Marcus Reed'}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-950/30 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          ARTISAN WORKSPACE SUB-NAV (8 MEMBER ITEMS)
      ═══════════════════════════════════════════════════════════════ */}
      <nav className="hidden md:flex bg-[#1f1410] border-b border-[#3a2820] px-6 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 py-1">
          {memberNavItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/member/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#41332b] text-[#efc9a5] shadow-sm font-semibold border-b-2 border-[#b99470]'
                      : 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#b99470] text-[#18110e] text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f1410] border-b border-[#3a2820] p-4 space-y-1">
          {memberNavItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/member/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#41332b] text-[#efc9a5] font-semibold'
                      : 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#b99470] text-[#18110e] text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#c2b3a3] hover:text-[#f5eee6]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Sanctuary</span>
            </Link>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE CONTENT WRAPPER
      ═══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
