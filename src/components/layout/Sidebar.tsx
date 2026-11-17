import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUiTheme } from '../ui/ThemeContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  Users, 
  Scissors, 
  CreditCard, 
  Package, 
  Tag, 
  TrendingUp, 
  Settings, 
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Video,
  Clock,
  Bell
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const theme = useUiTheme();
  const isDark = theme === 'dark';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const isMember = role === 'salon_member';

  // Section 4 Standardized Owner Navigation (11 clean, unified menu entries)
  const ownerNavItems = [
    { label: 'Overview', to: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', to: '/owner/appointments', icon: Calendar },
    { label: 'Calendar', to: '/owner/calendar', icon: CalendarDays },
    { label: 'Members & Customers', to: '/owner/people', icon: Users },
    { label: 'Services & Pricing', to: '/owner/services', icon: Scissors },
    { label: 'Payments & Ledger', to: '/owner/payments', icon: CreditCard },
    { label: 'Analytics', to: '/owner/reports', icon: TrendingUp },
    { label: 'Inventory', to: '/owner/inventory', icon: Package },
    { label: 'Live Monitor', to: '/owner/live-monitor', icon: Video },
    { label: 'Offers & Promotions', to: '/owner/offers', icon: Tag },
    { label: 'Salon Settings', to: '/owner/settings', icon: Settings },
  ];

  // Section 4 Standardized Member Navigation
  const memberNavItems = [
    { label: 'Overview', to: '/member/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', to: '/member/appointments', icon: Calendar },
    { label: 'Calendar', to: '/member/calendar', icon: CalendarDays },
    { label: 'My Customers', to: '/member/customers', icon: Users },
    { label: 'My Schedule', to: '/member/availability', icon: Clock },
    { label: 'My Performance', to: '/member/performance', icon: TrendingUp },
    { label: 'Notifications', to: '/member/notifications', icon: Bell },
  ];

  const activeNavItems = isMember ? memberNavItems : ownerNavItems;

  const filteredItems = navSearch.trim()
    ? activeNavItems.filter(item => item.label.toLowerCase().includes(navSearch.toLowerCase()))
    : activeNavItems;

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 flex flex-col justify-between select-none shrink-0 transition-all duration-300 ease-in-out z-30 border-r ${
        isDark 
          ? 'bg-[#201511] text-[#f5eee6] border-[#3a2820] shadow-2xl' 
          : 'bg-white text-[#2B2118] border-[#E8DFD5] shadow-xs'
      }`}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Brand Header */}
        <div className={`p-4 flex items-center justify-between gap-2 border-b ${
          isDark ? 'border-white/10' : 'border-[#E8DFD5]'
        }`}>
          {!isCollapsed ? (
            <Link to="/" className="inline-block group overflow-hidden text-left">
              <h1 className={`font-['Montserrat'] text-lg font-light tracking-[0.22em] uppercase transition-colors leading-none truncate ${
                isDark ? 'text-[#f5eee6] group-hover:text-[#efc9a5]' : 'text-[#2B2118] group-hover:text-[#B99470]'
              }`}>
                GLAMOURÉ
              </h1>
              <p className={`font-['Plus_Jakarta_Sans'] text-[9px] uppercase tracking-[0.24em] mt-1 font-medium truncate ${
                isDark ? 'text-[#d8c3a8]/80' : 'text-[#7A6658]'
              }`}>
                {isMember ? 'Artisan Workspace' : 'Salon Operating Platform'}
              </p>
            </Link>
          ) : (
            <Link to="/" className="w-full flex justify-center py-1">
              <span className={`font-['Montserrat'] text-lg font-bold tracking-widest ${
                isDark ? 'text-[#efc9a5]' : 'text-[#2B2118]'
              }`}>
                G
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDark ? 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5' : 'text-[#7A6658] hover:text-[#2B2118] hover:bg-[#FAF8F5]'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Navigation Filter */}
        {!isCollapsed && (
          <div className={`p-3 pb-1 border-b ${
            isDark ? 'border-white/5' : 'border-[#E8DFD5]/60'
          }`}>
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#a89582]' : 'text-[#7A6658]'
              }`} />
              <input
                type="text"
                placeholder="Search menu..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg font-['Plus_Jakarta_Sans'] transition-all focus:outline-none border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-[#f5eee6] placeholder-[#a89582] focus:border-[#b99470]' 
                    : 'bg-[#FAF8F5] border-[#E8DFD5] text-[#2B2118] placeholder-[#7A6658] focus:border-[#B99470]'
                }`}
              />
            </div>
          </div>
        )}

        {/* Navigation Items with Active Indicators */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/owner/dashboard' || item.to === '/member/dashboard'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[12.5px] font-medium transition-all group relative ${
                    isActive
                      ? isDark
                        ? 'bg-[#41332B] text-[#efc9a5] shadow-xs font-semibold border-l-2 border-[#b99470]'
                        : 'bg-[#FAF8F5] text-[#2B2118] shadow-xs font-semibold border-l-2 border-[#B99470]'
                      : isDark
                        ? 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5'
                        : 'text-[#7A6658] hover:text-[#2B2118] hover:bg-[#FAF8F5]'
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
        <div className={`p-3 space-y-2 border-t ${
          isDark ? 'border-white/10 bg-[#1c120e]/80' : 'border-[#E8DFD5] bg-[#FAF8F5]'
        }`}>
          {!isCollapsed && (
            <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg border ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-white border-[#E8DFD5]'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border ${
                isDark 
                  ? 'bg-[#41332B] border-[#b99470]/40 text-[#efc9a5]' 
                  : 'bg-[#2B2118] border-[#B99470] text-white'
              }`}>
                {user?.fullName?.charAt(0) || (isMember ? 'M' : 'O')}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className={`text-xs font-medium truncate font-['Plus_Jakarta_Sans'] ${
                  isDark ? 'text-[#f5eee6]' : 'text-[#2B2118]'
                }`}>
                  {user?.fullName || (isMember ? 'Marcus Reed' : 'Elena Vance')}
                </p>
                <p className={`text-[10px] tracking-wider uppercase font-semibold ${
                  isDark ? 'text-[#efc9a5]' : 'text-[#B99470]'
                }`}>
                  {isMember ? 'Artisan Stylist' : 'Salon Proprietor'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              title={isCollapsed ? 'Public Sanctuary' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] transition-colors ${
                isDark ? 'text-[#c2b3a3] hover:text-[#f5eee6] hover:bg-white/5' : 'text-[#7A6658] hover:text-[#2B2118] hover:bg-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Public Sanctuary</span>}
            </Link>

            <button
              onClick={logout}
              title={isCollapsed ? 'Sign Out' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left ${
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
