import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays,
  Users, 
  Scissors, 
  UserCheck, 
  Building2,
  Clock3,
  CreditCard, 
  Package, 
  Tag,
  Star,
  TrendingUp, 
  Sparkles,
  Brain,
  Settings, 
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  // Exactly 15 Owner Navigation items in precise order specified by Phase 3 Section 2
  const ownerNavItems = [
    { label: 'Overview', to: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', to: '/owner/appointments', icon: Calendar },
    { label: 'Calendar', to: '/owner/calendar', icon: CalendarDays },
    { label: 'Customers', to: '/owner/customers', icon: Users },
    { label: 'Services', to: '/owner/services', icon: Scissors },
    { label: 'Team Members', to: '/owner/team', icon: UserCheck },
    { label: 'Branches', to: '/owner/branches', icon: Building2 },
    { label: 'Walk-ins & Queue', to: '/owner/queue', icon: Clock3 },
    { label: 'Payments & Billing', to: '/owner/payments', icon: CreditCard },
    { label: 'Inventory', to: '/owner/inventory', icon: Package },
    { label: 'Offers & Discounts', to: '/owner/offers', icon: Tag },
    { label: 'Reviews', to: '/owner/reviews', icon: Star },
    { label: 'Reports & Analytics', to: '/owner/reports', icon: TrendingUp },
    { label: 'AI Scheduling', to: '/owner/ai-scheduling', icon: Sparkles },
    { label: 'Intelligence Engine', to: '/owner/intelligence', icon: Brain },
    { label: 'Business Settings', to: '/owner/settings', icon: Settings },
  ];

  const filteredItems = navSearch.trim()
    ? ownerNavItems.filter(item => item.label.toLowerCase().includes(navSearch.toLowerCase()))
    : ownerNavItems;

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 bg-[#201511] text-[#f5eee6] flex flex-col justify-between border-r border-[#3a2820] select-none shrink-0 transition-all duration-300 ease-in-out z-30 shadow-2xl`}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
          {!isCollapsed ? (
            <Link to="/" className="inline-block group overflow-hidden">
              <h1 className="font-['Montserrat'] text-lg font-light tracking-[0.22em] uppercase text-[#f5eee6] group-hover:text-[#efc9a5] transition-colors leading-none truncate">
                GLAMOURÉ
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[9px] uppercase tracking-[0.24em] text-[#d8c3a8]/80 mt-1 font-medium truncate">
                Salon Owner Portal
              </p>
            </Link>
          ) : (
            <Link to="/" className="w-full flex justify-center py-1">
              <span className="font-['Montserrat'] text-lg font-bold text-[#efc9a5] tracking-widest">
                G
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Navigation Filter */}
        {!isCollapsed && (
          <div className="p-3 pb-1 border-b border-white/5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-[#f5eee6] placeholder-[#a89582] focus:outline-none focus:border-[#b99470] font-['Plus_Jakarta_Sans'] transition-all"
              />
            </div>
          </div>
        )}

        {/* 15 Navigation Items with Active Indicators */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/owner/dashboard'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#41332B] text-[#efc9a5] shadow-sm font-semibold border-l-2 border-[#b99470]'
                      : 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" strokeWidth={1.8} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Snippet & Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#1c120e]/80">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="w-7 h-7 rounded-full bg-[#41332B] border border-[#b99470]/40 flex items-center justify-center text-xs font-semibold text-[#efc9a5] shrink-0">
                {user?.fullName?.charAt(0) || 'O'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#f5eee6] truncate font-['Plus_Jakarta_Sans']">
                  {user?.fullName || 'Elena Vance'}
                </p>
                <p className="text-[10px] text-[#efc9a5] tracking-wider uppercase font-semibold">
                  Proprietor
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              title={isCollapsed ? 'Public Sanctuary' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5 transition-colors ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Public Sanctuary</span>}
            </Link>

            <button
              onClick={logout}
              title={isCollapsed ? 'Sign Out' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] text-rose-300 hover:text-rose-100 hover:bg-rose-950/30 transition-colors cursor-pointer text-left ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
