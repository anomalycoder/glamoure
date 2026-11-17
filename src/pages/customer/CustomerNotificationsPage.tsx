import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Tag, 
  AlertCircle, 
  Check, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CustomerNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'offer'>('all');

  const notifications = user ? db.getNotificationsByUser(user.id) : [];

  const handleMarkAsRead = (id: string) => {
    db.markNotificationAsRead(id);
    showToast('Updated', 'Notification marked as read.', 'info');
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.isRead);
    unread.forEach(n => db.markNotificationAsRead(n.id));
    showToast('All Read', `${unread.length} notifications marked as read.`, 'success');
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'booking') return n.type === 'appointment' || n.type === 'reminder';
    if (filter === 'offer') return n.type === 'system' || n.type === 'payment';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'reminder':
        return <AlertCircle className="w-4 h-4 text-[#B99470]" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'system':
        return <Sparkles className="w-4 h-4 text-[#B99470]" />;
      default:
        return <Tag className="w-4 h-4 text-[#806B5C]" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#41332B]/10">
        <div>
          <span className="font-['Montserrat'] text-[11px] uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
            Concierge Activity Log
          </span>
          <h1 className="font-['Montserrat'] text-3xl font-light text-[#41332B]">
            Notifications &amp; Alerts
          </h1>
          <p className="text-xs text-[#806B5C] mt-1">
            Live updates regarding your reservations, privilege offers, and sanctuary news.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#41332B]/10 pb-4 overflow-x-auto">
        {(['all', 'unread', 'booking', 'offer'] as const).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setFilter(tabKey)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all capitalize whitespace-nowrap ${
              filter === tabKey
                ? 'bg-[#41332B] text-white shadow-sm'
                : 'bg-white text-[#806B5C] hover:bg-[#FAF6F1] border border-[#41332B]/10'
            }`}
          >
            {tabKey === 'all' && `All (${notifications.length})`}
            {tabKey === 'unread' && `Unread (${notifications.filter(n => !n.isRead).length})`}
            {tabKey === 'booking' && 'Reservations'}
            {tabKey === 'offer' && 'Privileges & Offers'}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#41332B]/10 p-10 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F1] flex items-center justify-center mx-auto text-[#806B5C]">
            <Bell className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-['Montserrat'] text-lg font-medium text-[#41332B]">
            No Notifications Found
          </h3>
          <p className="text-xs text-[#806B5C] max-w-sm mx-auto">
            You're completely up to date. Verified bookings and concierge dispatch confirmations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                notif.isRead
                  ? 'bg-white border-[#41332B]/10 opacity-75 hover:opacity-100'
                  : 'bg-white border-[#B99470]/40 shadow-sm ring-1 ring-[#B99470]/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F1] border border-[#41332B]/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-['Montserrat'] text-sm font-medium text-[#41332B]">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#B99470]" />
                      )}
                    </div>
                    <p className="text-xs text-[#635349] leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-[#806B5C] block pt-1">
                      {new Date(notif.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="p-2 rounded-xl text-[#806B5C] hover:text-[#41332B] hover:bg-[#FAF6F1] transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
