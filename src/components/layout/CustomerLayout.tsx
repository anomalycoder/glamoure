import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { CustomerAiDrawer } from '../customer/CustomerAiDrawer';
import { NotificationToastContainer } from '../ui/NotificationToast';
import { UiThemeProvider } from '../ui/ThemeContext';
import { 
  Sparkles, 
  Bell, 
  User, 
  Heart, 
  Calendar, 
  Compass, 
  Building2, 
  Scissors, 
  Star, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Settings,
  ChevronDown
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, logout, role, memberships, switchRole } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Sanctuary', path: '/customer/dashboard', icon: <Compass className="w-4 h-4" /> },
    { label: 'Explore', path: '/customer/explore', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Ateliers', path: '/customer/salons', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Rituals', path: '/customer/services', icon: <Scissors className="w-4 h-4" /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Saved', path: '/customer/favorites', icon: <Heart className="w-4 h-4" /> },
    { label: 'Reviews', path: '/customer/reviews', icon: <Star className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <UiThemeProvider theme="light">
      <div className="min-h-screen bg-[#F5EFE7] text-[#41332B] flex flex-col font-sans selection:bg-[#B99470]/30 selection:text-[#41332B]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP PRIVILEGE ANNOUNCEMENT BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#41332B] text-[#E8D8C7] px-4 py-2 text-center text-xs tracking-wider font-light flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#B99470]" />
          Exclusive Atelier Privilege: Use code <span className="font-mono font-bold text-white uppercase ml-1">GLAMOUR15</span> for 15% off first ritual
        </span>
        <Link to="/customer/book" className="underline hover:text-white transition-colors hidden sm:inline">
          Reserve Now &rarr;
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LUXURY EDITORIAL NAVIGATION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F5EFE7]/90 backdrop-blur-md border-b border-[#E8D8C7]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex flex-col items-start">
              <span className="font-serif text-2xl tracking-[0.18em] text-[#41332B] font-light group-hover:text-[#B99470] transition-colors">
                GLAMOURÉ
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#806B5C] -mt-1">
                Client Sanctuary
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/customer/dashboard' && location.pathname.startsWith(link.path));
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#E8D8C7] text-[#41332B] font-semibold shadow-2xs'
                        : 'text-[#806B5C] hover:text-[#41332B] hover:bg-[#E8D8C7]/40'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Action Hub (Right) */}
          <div className="flex items-center gap-3">
            {/* AI Concierge Pill */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E8D8C7] to-[#F5EFE7] border border-[#B99470]/40 text-[#41332B] hover:border-[#B99470] text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B99470] animate-pulse" />
              <span>AI Concierge</span>
            </button>

            {/* Book Now Primary CTA */}
            <Link to="/customer/book">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#41332B] hover:bg-[#2e231d] text-[#F5EFE7] text-xs font-medium tracking-wider uppercase transition-all shadow-xs cursor-pointer">
                <span>Reserve Ritual</span>
              </button>
            </Link>

            {/* Notifications Bell */}
            <Link
              to="/customer/notifications"
              className="relative p-2.5 rounded-full hover:bg-[#E8D8C7]/50 text-[#41332B] transition-colors"
              title="Sanctuary Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B99470] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-[#E8D8C7] bg-white/80 hover:bg-white text-xs text-[#41332B] transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#41332B] text-[#F5EFE7] flex items-center justify-center font-serif text-xs">
                  {user?.fullName?.charAt(0) || 'G'}
                </div>
                <span className="hidden md:inline font-medium max-w-[100px] truncate">
                  {user?.fullName?.split(' ')[0] || 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#806B5C]" />
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8D8C7] py-2 z-50 animate-fade-in"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-[#E8D8C7]/60">
                    <p className="font-serif text-sm font-medium text-[#41332B]">{user?.fullName}</p>
                    <p className="text-[11px] font-mono text-[#806B5C] truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono uppercase bg-[#F5EFE7] px-2 py-0.5 rounded text-[#B99470] font-semibold">
                      Client Privilege
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/customer/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#41332B] hover:bg-[#F5EFE7] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#B99470]" />
                      Hair & Skin Dossier
                    </Link>
                    <Link
                      to="/customer/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#41332B] hover:bg-[#F5EFE7] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#B99470]" />
                      Communication & Security
                    </Link>
                  </div>

                  {/* Multi-role quick switch if user has owner or staff memberships */}
                  {memberships.some(m => m.role === 'salon_owner') && (
                    <div className="py-1 border-t border-[#E8D8C7]/60">
                      <button
                        onClick={() => {
                          switchRole('salon_owner');
                          navigate('/owner/dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#806B5C] hover:text-[#41332B] hover:bg-[#F5EFE7] flex items-center gap-2 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#B99470]" /> Switch to Salon Director
                      </button>
                    </div>
                  )}

                  {memberships.some(m => m.role === 'salon_member') && (
                    <div className="py-1 border-t border-[#E8D8C7]/60">
                      <button
                        onClick={() => {
                          switchRole('salon_member');
                          navigate('/member/dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#806B5C] hover:text-[#41332B] hover:bg-[#F5EFE7] flex items-center gap-2 cursor-pointer"
                      >
                        <Scissors className="w-3.5 h-3.5 text-[#B99470]" /> Switch to Artisan Portal
                      </button>
                    </div>
                  )}

                  <div className="pt-1 border-t border-[#E8D8C7]/60">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="xl:hidden p-2 rounded-xl text-[#41332B] hover:bg-[#E8D8C7]/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E8D8C7] bg-[#F5EFE7] px-4 py-4 space-y-1 shadow-lg animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-[#E8D8C7] text-[#41332B]' : 'text-[#806B5C] hover:bg-[#E8D8C7]/40'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-[#E8D8C7]/60">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAiDrawerOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8D8C7] text-[#41332B] font-medium text-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#B99470]" /> Open AI Sanctuary Concierge
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. SANCTUARY FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#E8D8C7] bg-[#E8D8C7]/30 py-8 px-4 text-center text-xs text-[#806B5C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-sm text-[#41332B]">
            GLAMOURÉ <span className="font-sans text-xs text-[#806B5C]">© 2026 Haute Beauté &amp; Wellness Sanctuary</span>
          </p>
          <div className="flex gap-6 text-xs text-[#806B5C]">
            <Link to="/customer/explore" className="hover:text-[#41332B]">Explore</Link>
            <Link to="/customer/salons" className="hover:text-[#41332B]">Ateliers</Link>
            <Link to="/customer/services" className="hover:text-[#41332B]">Rituals</Link>
            <Link to="/customer/settings" className="hover:text-[#41332B]">Security &amp; Consent</Link>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          5. INTEGRATED CONCIERGE & TOAST OVERLAYS
      ───────────────────────────────────────────────────────────── */}
      <CustomerAiDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      <NotificationToastContainer />
    </div>
    </UiThemeProvider>
  );
};
