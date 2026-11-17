import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useThemeControls } from '../ui/ThemeContext';
import { db } from '../../database/db';
import { Bell, ChevronDown, Check, Building2, UserCircle, Sun, Moon } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, role, salonId, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const { theme, toggleTheme } = useThemeControls();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSalonsMenu, setShowSalonsMenu] = useState(false);

  const salons = db.getAllSalons();
  const activeSalon = salons.find(s => s.id === salonId) || salons[0];

  const isDark = theme === 'dark';

  return (
    <header className={`h-16 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none transition-colors duration-200 border-b ${
      isDark 
        ? 'bg-[#1c1410] border-[#2f2119] text-[#f5eee6]' 
        : 'bg-white border-[#E8D8C7] text-[#41332B] shadow-xs'
    }`}>
      {/* Left: Active Salon Tenant Indicator & Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowSalonsMenu(!showSalonsMenu)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-['Montserrat'] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer border ${
            isDark
              ? 'bg-white/5 border-white/10 text-[#f5eee6] hover:border-[#b99470]/50 hover:bg-white/10'
              : 'bg-[#FAF6F1] border-[#E8D8C7] text-[#41332B] hover:bg-[#F5EFE7] hover:border-[#B99470]'
          }`}
        >
          <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#efc9a5]' : 'text-[#B99470]'}`} />
          <span>{activeSalon ? activeSalon.name : 'Glamouré Sanctuary'}</span>
          <ChevronDown className={`w-3 h-3 ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`} />
        </button>

        {showSalonsMenu && (
          <div className={`absolute left-0 mt-2 w-64 rounded-2xl shadow-2xl p-2 z-40 border text-left ${
            isDark 
              ? 'bg-[#221813] border-[#38271e]' 
              : 'bg-white border-[#E8D8C7] shadow-[0_12px_36px_rgba(65,51,43,0.12)]'
          }`}>
            <span className={`block px-3 py-1.5 text-[10.5px] font-['Montserrat'] font-semibold uppercase tracking-wider ${
              isDark ? 'text-[#a89582]' : 'text-[#806B5C]'
            }`}>
              Select Salon Tenant
            </span>
            {salons.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  switchRole(role, s.id);
                  setShowSalonsMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] text-left cursor-pointer transition-colors ${
                  s.id === salonId 
                    ? isDark ? 'bg-[#b99470]/20 font-semibold text-[#efc9a5]' : 'bg-[#FAF6F1] font-semibold text-[#41332B] border border-[#B99470]/30'
                    : isDark ? 'hover:bg-white/5 text-[#f5eee6]' : 'hover:bg-[#FAF6F1] text-[#41332B]'
                }`}
              >
                <div>
                  <div className={`font-medium ${isDark ? 'text-[#f5eee6]' : 'text-[#41332B]'}`}>{s.name}</div>
                  <div className={`text-[10px] ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`}>{s.city}, {s.country}</div>
                </div>
                {s.id === salonId && <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#efc9a5]' : 'text-[#B99470]'}`} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Theme Toggle, Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Dark / Light Theme Toggle (Maintains Light Theme as First Preference) */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-['Plus_Jakarta_Sans'] font-medium transition-colors cursor-pointer border ${
            isDark
              ? 'bg-white/5 border-white/10 text-[#efc9a5] hover:bg-white/10'
              : 'bg-[#FAF6F1] border-[#E8D8C7] text-[#41332B] hover:bg-[#F5EFE7] hover:border-[#B99470]'
          }`}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#806B5C]" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Dynamic Role Switcher (Multi-Role Support) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-['Plus_Jakarta_Sans'] text-xs font-semibold cursor-pointer transition-colors border ${
              isDark
                ? 'bg-[#b99470]/15 border-[#b99470]/30 text-[#efc9a5] hover:bg-[#b99470]/25'
                : 'bg-[#E8D8C7]/60 border-[#B99470]/40 text-[#41332B] hover:bg-[#E8D8C7]'
            }`}
          >
            <UserCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#efc9a5]' : 'text-[#41332B]'}`} />
            <span className="capitalize">
              {role === 'salon_owner' ? 'Owner Portal' : role === 'salon_member' ? 'Artisan Workspace' : 'Customer Portal'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showRoleMenu && (
            <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-2 z-40 border text-left ${
              isDark 
                ? 'bg-[#221813] border-[#38271e]' 
                : 'bg-white border-[#E8D8C7] shadow-[0_12px_36px_rgba(65,51,43,0.12)]'
            }`}>
              <span className={`block px-3 py-1.5 text-[10.5px] font-['Montserrat'] font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#a89582]' : 'text-[#806B5C]'
              }`}>
                Switch Active Role
              </span>
              {[
                { roleId: 'salon_owner', label: 'Salon Owner', desc: 'Full business & staff control' },
                { roleId: 'salon_member', label: 'Salon Member / Staff', desc: 'Assigned bookings & schedule' },
                { roleId: 'customer', label: 'Customer', desc: 'Discovery & personal booking' },
              ].map(r => (
                <button
                  key={r.roleId}
                  onClick={() => {
                    switchRole(r.roleId as any, salonId);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-['Plus_Jakarta_Sans'] text-left cursor-pointer transition-colors ${
                    role === r.roleId 
                      ? isDark ? 'bg-[#b99470]/20 font-semibold text-[#efc9a5]' : 'bg-[#FAF6F1] font-semibold text-[#41332B] border border-[#B99470]/30'
                      : isDark ? 'hover:bg-white/5 text-[#f5eee6]' : 'hover:bg-[#FAF6F1] text-[#41332B]'
                  }`}
                >
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className={`text-[10px] ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`}>{r.desc}</div>
                  </div>
                  {role === r.roleId && <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#efc9a5]' : 'text-[#B99470]'}`} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/5 text-[#f5eee6]' : 'hover:bg-[#FAF6F1] text-[#41332B]'
            }`}
            aria-label="Notifications"
          >
            <Bell className={`w-5 h-5 ${isDark ? 'text-[#efc9a5]' : 'text-[#41332B]'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-40 border text-left ${
              isDark 
                ? 'bg-[#221813] border-[#38271e]' 
                : 'bg-white border-[#E8D8C7] shadow-[0_12px_36px_rgba(65,51,43,0.12)]'
            }`}>
              <div className={`p-3.5 border-b flex items-center justify-between ${
                isDark ? 'bg-[#291d17] border-[#38271e]' : 'bg-[#FAF6F1] border-[#E8D8C7]'
              }`}>
                <h4 className={`font-['Montserrat'] text-xs uppercase tracking-wider font-semibold ${
                  isDark ? 'text-[#efc9a5]' : 'text-[#41332B]'
                }`}>
                  Notifications ({notifications.length})
                </h4>
                {unreadCount > 0 && (
                  <span className={`text-[10.5px] font-['Plus_Jakarta_Sans'] font-medium ${
                    isDark ? 'text-amber-300' : 'text-amber-700'
                  }`}>
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className={`max-h-72 overflow-y-auto divide-y ${
                isDark ? 'divide-[#38271e]/60' : 'divide-[#E8D8C7]/50'
              }`}>
                {notifications.length === 0 ? (
                  <div className={`py-8 text-center text-xs ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 text-xs transition-colors cursor-pointer ${
                        n.isRead ? 'bg-transparent opacity-65' : isDark ? 'bg-white/5 font-medium' : 'bg-[#FAF6F1]/50 font-medium'
                      } ${isDark ? 'hover:bg-white/10' : 'hover:bg-[#FAF6F1]'}`}
                    >
                      <div className={`font-semibold ${isDark ? 'text-[#f5eee6]' : 'text-[#41332B]'}`}>{n.title}</div>
                      <div className={`text-[11.5px] mt-0.5 ${isDark ? 'text-[#a89582]' : 'text-[#806B5C]'}`}>{n.message}</div>
                      <div className={`text-[9.5px] mt-1 ${isDark ? 'text-[#a89582]/70' : 'text-[#806B5C]/70'}`}>
                        {new Date(n.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Lockup */}
        <div className={`flex items-center gap-2.5 pl-2 border-l ${
          isDark ? 'border-white/10' : 'border-[#E8D8C7]'
        }`}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className={`w-8 h-8 rounded-full object-cover border ${
                isDark ? 'border-[#b99470]/30' : 'border-[#B99470]'
              }`}
            />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              isDark ? 'bg-[#b99470] text-[#16110e]' : 'bg-[#41332B] text-[#F5EFE7]'
            }`}>
              {user?.fullName?.charAt(0) || 'G'}
            </div>
          )}
          <div className="hidden sm:block text-left leading-tight">
            <span className={`text-xs font-medium block ${
              isDark ? 'text-[#f5eee6]' : 'text-[#41332B]'
            }`}>
              {user?.fullName || 'Guest User'}
            </span>
            <span className={`text-[10px] block ${
              isDark ? 'text-[#a89582]' : 'text-[#806B5C]'
            }`}>
              {user?.email || 'guest@glamoure.in'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
