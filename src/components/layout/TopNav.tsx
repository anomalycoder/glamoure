import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Bell, ChevronDown, Check, Building2, UserCircle } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, role, salonId, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSalonsMenu, setShowSalonsMenu] = useState(false);

  const salons = db.getAllSalons();
  const activeSalon = salons.find(s => s.id === salonId) || salons[0];

  return (
    <header className="h-16 bg-[#F5EFE7] border-b border-[#41332B]/10 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Active Salon Tenant Indicator & Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowSalonsMenu(!showSalonsMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#41332B]/15 text-[#41332B] font-['Montserrat'] text-xs uppercase tracking-wider font-medium hover:border-[#41332B]/40 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-[#806B5C]" />
          <span>{activeSalon ? activeSalon.name : 'Glamouré Sanctuary'}</span>
          <ChevronDown className="w-3 h-3 text-[#806B5C]" />
        </button>

        {showSalonsMenu && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#41332B]/15 p-2 z-40">
            <span className="block px-3 py-1.5 text-[10.5px] font-['Montserrat'] font-semibold uppercase tracking-wider text-[#806B5C]">
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
                  s.id === salonId ? 'bg-[#E8D8C7]/50 font-semibold text-[#41332B]' : 'hover:bg-black/5 text-[#41332B]'
                }`}
              >
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-[10px] text-[#806B5C]">{s.city}, {s.country}</div>
                </div>
                {s.id === salonId && <Check className="w-3.5 h-3.5 text-[#41332B]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dynamic Role Switcher (Multi-Role Support) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8D8C7]/70 border border-[#41332B]/20 text-[#41332B] font-['Plus_Jakarta_Sans'] text-xs font-semibold cursor-pointer hover:bg-[#E8D8C7] transition-colors"
          >
            <UserCircle className="w-3.5 h-3.5 text-[#41332B]" />
            <span className="capitalize">
              {role === 'salon_owner' ? 'Role: Owner' : role === 'salon_member' ? 'Role: Artisan' : 'Role: Customer'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#41332B]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#41332B]/15 p-2 z-40">
              <span className="block px-3 py-1.5 text-[10.5px] font-['Montserrat'] font-semibold uppercase tracking-wider text-[#806B5C]">
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
                    role === r.roleId ? 'bg-[#E8D8C7]/60 font-semibold text-[#41332B]' : 'hover:bg-black/5 text-[#41332B]'
                  }`}
                >
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className="text-[10px] text-[#806B5C]">{r.desc}</div>
                  </div>
                  {role === r.roleId && <Check className="w-3.5 h-3.5 text-[#41332B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-full hover:bg-black/5 text-[#41332B] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#41332B]/15 overflow-hidden z-40 text-left">
              <div className="p-3.5 border-b border-[#41332B]/10 flex items-center justify-between bg-[#F5EFE7]">
                <h4 className="font-['Montserrat'] text-xs uppercase tracking-wider font-semibold text-[#41332B]">
                  Notifications ({notifications.length})
                </h4>
                {unreadCount > 0 && (
                  <span className="text-[10.5px] font-['Plus_Jakarta_Sans'] font-medium text-amber-700">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#41332B]/5">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#806B5C]">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 text-xs transition-colors cursor-pointer ${
                        n.isRead ? 'bg-white opacity-75' : 'bg-[#E8D8C7]/20 font-medium'
                      } hover:bg-[#E8D8C7]/30`}
                    >
                      <div className="font-semibold text-[#41332B]">{n.title}</div>
                      <div className="text-[11.5px] text-[#806B5C] mt-0.5">{n.message}</div>
                      <div className="text-[9.5px] text-[#806B5C]/70 mt-1">
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
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#41332B]/15">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border border-[#41332B]/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#41332B] text-[#F5EFE7] flex items-center justify-center text-xs font-semibold">
              {user?.fullName?.charAt(0) || 'G'}
            </div>
          )}
          <div className="hidden sm:block text-left leading-tight">
            <span className="text-xs font-medium text-[#41332B] block">
              {user?.fullName || 'Guest User'}
            </span>
            <span className="text-[10px] text-[#806B5C] block">
              {user?.email || 'guest@glamoure.in'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
