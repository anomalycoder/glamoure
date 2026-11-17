import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { AppointmentService } from '../../services/appointmentService';
import { AvailabilityService } from '../../services/availabilityService';
import { PaymentService } from '../../services/paymentService';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Appointment } from '../../types/appointment';
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  RotateCcw, 
  XCircle, 
  Receipt, 
  Star, 
  ArrowRight, 
  X,
  AlertCircle
} from 'lucide-react';

export const CustomerBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Reschedule Modal state
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [rescheduleSlots, setRescheduleSlots] = useState<{ time: string; available: boolean }[]>([]);

  // Cancel Modal state
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Personal schedule conflict');

  const [refreshKey, setRefreshKey] = useState(0);

  const appointments = user ? db.getAppointmentsByCustomer(user.id) : [];

  const filtered = appointments.filter(a => {
    if (filter === 'upcoming') return ['pending', 'confirmed', 'checked_in', 'in_progress'].includes(a.status);
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'cancelled') return ['cancelled', 'no_show'].includes(a.status);
    return true;
  });

  // Calculate slots when reschedule date is chosen
  const handleDateChange = (dateStr: string) => {
    setNewDate(dateStr);
    setNewTime('');
    if (rescheduleApt) {
      const slots = AvailabilityService.getAvailableSlots(
        rescheduleApt.staffId,
        rescheduleApt.durationMinutes,
        dateStr
      );
      setRescheduleSlots(slots);
    }
  };

  const handleExecuteReschedule = () => {
    if (!rescheduleApt || !newDate || !newTime || !user) return;
    try {
      AppointmentService.rescheduleAppointment(
        rescheduleApt.id,
        newDate,
        newTime,
        rescheduleApt.staffId,
        user
      );
      addToast(`Appointment successfully rescheduled to ${newDate} at ${newTime}`, 'success');
      setRescheduleApt(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      addToast(err.message || 'Rescheduling failed', 'error');
    }
  };

  const handleExecuteCancel = () => {
    if (!cancelApt || !user) return;
    try {
      AppointmentService.cancelAppointment(
        cancelApt.id,
        user,
        cancelReason
      );
      addToast('Reservation cancelled according to atelier policy', 'info');
      setCancelApt(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      addToast(err.message || 'Cancellation failed', 'error');
    }
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'serviceName',
      header: 'Sanctuary Ritual',
      render: apt => (
        <div>
          <div className="font-serif text-sm font-medium text-[#41332B]">{apt.serviceName}</div>
          <div className="text-[11px] font-mono text-[#806B5C] flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-[#B99470]" /> {apt.durationMinutes} minutes
          </div>
        </div>
      ),
    },
    {
      key: 'staffName',
      header: 'Master Artisan',
      render: apt => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#41332B] text-white flex items-center justify-center font-serif text-[10px]">
            {apt.staffName.charAt(0)}
          </div>
          <span className="text-xs font-medium text-[#41332B]">{apt.staffName}</span>
        </div>
      ),
    },
    {
      key: 'appointmentDate',
      header: 'Date & Time',
      render: apt => (
        <div>
          <div className="font-mono text-xs font-semibold text-[#41332B]">{apt.appointmentDate}</div>
          <div className="text-[11px] font-mono text-[#806B5C]">{apt.startTime} – {apt.endTime}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: apt => <Badge variant={apt.status} />,
    },
    {
      key: 'price',
      header: 'Investment',
      render: apt => (
        <div>
          <span className="font-serif text-sm font-semibold text-[#41332B]">${apt.price}</span>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#806B5C]">{apt.paymentStatus}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Manage',
      className: 'text-right',
      render: apt => {
        const canModify = ['pending', 'confirmed'].includes(apt.status);
        const isCompleted = apt.status === 'completed';

        return (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/customer/bookings/${apt.id}`}>
              <Button size="sm" variant="outline" className="text-xs">
                Dossier &rarr;
              </Button>
            </Link>

            {canModify && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRescheduleApt(apt);
                    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    handleDateChange(tomorrow);
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reschedule
                </Button>
                <button
                  onClick={() => setCancelApt(apt)}
                  className="text-xs text-rose-700 hover:text-rose-900 px-2 py-1 transition-colors cursor-pointer"
                  title="Cancel Ritual"
                >
                  Cancel
                </button>
              </>
            )}

            {isCompleted && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/customer/reviews?appointmentId=${apt.id}`)}
                className="text-xs"
              >
                <Star className="w-3 h-3 mr-1 text-amber-500" /> Review
              </Button>
            )}

            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/customer/book?serviceId=${apt.serviceId}&staffId=${apt.staffId}`)}
              className="text-xs"
            >
              Rebook
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D8C7]/60 pb-6">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
            Itinerary Dossier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
            My Sanctuary Bookings
          </h1>
          <p className="font-sans text-sm text-[#806B5C] mt-1">
            Track upcoming atelier appointments, review past formulas, self-reschedule, and download receipts.
          </p>
        </div>

        <Link to="/customer/book">
          <Button variant="primary" size="sm" className="rounded-full shadow-xs">
            <Plus className="w-4 h-4 mr-2" /> Reserve New Ritual
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8D8C7]/60 pb-3">
        {[
          { id: 'all', label: `All Visits (${appointments.length})` },
          { id: 'upcoming', label: 'Upcoming / Active' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#41332B] text-white shadow-xs font-semibold'
                : 'text-[#806B5C] hover:bg-[#E8D8C7]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={a => a.id}
          emptyMessage="No bookings found matching your selected filter."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RESCHEDULE MODAL
      ───────────────────────────────────────────────────────────── */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8D8C7] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8D8C7]/60">
              <div>
                <h3 className="font-serif text-2xl text-[#41332B]">Reschedule Sanctuary Visit</h3>
                <p className="text-xs text-[#806B5C] mt-0.5">{rescheduleApt.serviceName} with {rescheduleApt.staffName}</p>
              </div>
              <button 
                onClick={() => setRescheduleApt(null)}
                className="p-2 text-[#806B5C] hover:text-[#41332B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#806B5C]">Select New Date:</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs font-mono text-[#41332B]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#806B5C]">Available Slots on {newDate}:</label>
                {rescheduleSlots.length === 0 ? (
                  <p className="text-xs text-[#806B5C] italic p-4 bg-[#F5EFE7]/40 rounded-xl">
                    No slots open for this date. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {rescheduleSlots.map(s => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setNewTime(s.time)}
                        className={`py-2 px-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          !s.available
                            ? 'bg-gray-100 text-gray-400 opacity-40 line-through cursor-not-allowed'
                            : newTime === s.time
                            ? 'bg-[#41332B] text-white font-bold border-[#41332B]'
                            : 'bg-[#F5EFE7] hover:border-[#B99470] text-[#41332B]'
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C7]/60">
              <Button variant="outline" size="sm" onClick={() => setRescheduleApt(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                disabled={!newDate || !newTime}
                onClick={handleExecuteReschedule}
              >
                Confirm Reschedule to {newTime || '...'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CANCEL CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {cancelApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E8D8C7] space-y-6">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-xl">Cancel Reservation</h3>
            </div>

            <div className="text-xs text-[#806B5C] space-y-2">
              <p>
                You are about to cancel <strong className="text-[#41332B]">{cancelApt.serviceName}</strong> scheduled for <strong className="text-[#41332B]">{cancelApt.appointmentDate} at {cancelApt.startTime}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Atelier Notice Policy:</strong> Cancellations made within 24 hours of arrival may forfeit the advance deposit to protect artisan station commitments.
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#806B5C]">Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B]"
              >
                <option value="Personal schedule conflict">Personal schedule conflict</option>
                <option value="Travel / Out of city">Travel / Out of city</option>
                <option value="Illness or health reason">Illness or health reason</option>
                <option value="Booking error">Booking error</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C7]/60">
              <Button variant="outline" size="sm" onClick={() => setCancelApt(null)}>
                Keep Reservation
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleExecuteCancel}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
