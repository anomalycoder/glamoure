import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Notification } from '../../types/common';
import { Bell, CheckCheck, Clock, Calendar, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { markAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = () => {
    if (!user?.id) return;
    const list = db.getNotificationsByUser(user.id);
    setNotifications(list);
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) markAsRead(n.id);
    });
    loadNotifications();
  };

  const displayedList = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4 text-[#efc9a5]" />;
      case 'system': return <Sparkles className="w-4 h-4 text-emerald-300" />;
      case 'reminder': return <Clock className="w-4 h-4 text-amber-300" />;
      default: return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Artisan Dispatch & Alerts
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#a89582] mt-1">
            Real-time notifications for schedule updates, chair assignments, and salon notices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'unread' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              Unread ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#c2b3a3] hover:text-[#f5eee6] border border-white/10 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-[#3d2a21]">
            <Bell className="w-8 h-8 text-[#a89582] mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-[#f5eee6]">All clear at your chair</p>
            <p className="text-xs text-[#a89582] mt-1">No dispatch alerts or schedule revisions at this moment.</p>
          </div>
        ) : (
          displayedList.map(item => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.isRead) {
                  markAsRead(item.id);
                  loadNotifications();
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                item.isRead 
                  ? 'bg-white/[0.01] border-[#3d2a21] opacity-75' 
                  : 'bg-[#41332b]/30 border-[#b99470]/40 shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm ${item.isRead ? 'font-medium text-[#f5eee6]' : 'font-semibold text-[#efc9a5]'}`}>
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-[#a89582] shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#c2b3a3] mt-1 leading-relaxed">
                  {item.message}
                </p>
                {item.link && (
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1 text-[11px] text-[#b99470] hover:text-[#efc9a5] font-semibold mt-2 group"
                  >
                    <span>View ritual</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
