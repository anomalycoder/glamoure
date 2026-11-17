import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Appointment } from '../../types/appointment';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Building2, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const OwnerCalendarPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Views: Day, Week, Month, Employee, Branch
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'employee' | 'branch'>('day');
  const [selectedDate, setSelectedDate] = useState('2026-11-17');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  // Quick reservation modal
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotTime, setSlotTime] = useState('14:00');
  const [slotStaffId, setSlotStaffId] = useState('');
  const [slotCustomerName, setSlotCustomerName] = useState('');
  const [slotServiceId, setSlotServiceId] = useState('');

  const branches = db.getBranchesBySalon(currentSalonId);
  const staff = db.getStaffBySalon(currentSalonId);
  const services = db.getServicesBySalon(currentSalonId);
  const allAppointments = db.getAppointmentsBySalon(currentSalonId);

  const hours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const weekDays = [
    { name: 'Mon', date: '2026-11-16' },
    { name: 'Tue', date: '2026-11-17' },
    { name: 'Wed', date: '2026-11-18' },
    { name: 'Thu', date: '2026-11-19' },
    { name: 'Fri', date: '2026-11-20' },
    { name: 'Sat', date: '2026-11-21' },
    { name: 'Sun', date: '2026-11-22' },
  ];

  const handleCreateSlotAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotCustomerName.trim() || !slotServiceId || !slotStaffId) {
      showToast('Validation Error', 'All slot reservation details are required.');
      return;
    }

    const srv = services.find(s => s.id === slotServiceId);
    const targetStaff = staff.find(s => s.id === slotStaffId);
    if (!srv || !targetStaff) return;

    // Check conflict
    const [h, m] = slotTime.split(':').map(Number);
    const endMinutes = h * 60 + m + srv.durationMinutes;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const conflict = allAppointments.find(a => 
      a.staffId === slotStaffId &&
      a.appointmentDate === selectedDate &&
      ['confirmed', 'in_progress'].includes(a.status) &&
      ((slotTime >= a.startTime && slotTime < a.endTime) ||
       (endTime > a.startTime && endTime <= a.endTime))
    );

    if (conflict) {
      showToast('Booking Conflict', `${targetStaff.displayName} already has an active appointment at this time.`);
      return;
    }

    db.createAppointment({
      salonId: currentSalonId,
      branchId: branches[0]?.id || 'branch-jubilee-hills',
      customerId: `user-guest-${Date.now()}`,
      customerName: slotCustomerName.trim(),
      customerEmail: 'guest@example.com',
      staffId: targetStaff.id,
      staffName: targetStaff.displayName,
      serviceId: srv.id,
      serviceName: srv.name,
      appointmentDate: selectedDate,
      startTime: slotTime,
      endTime,
      durationMinutes: srv.durationMinutes,
      status: 'confirmed',
      price: srv.price,
      depositAmount: 0,
      paymentStatus: 'paid',
    });

    showToast('Slot Reserved', `Confirmed ${srv.name} for ${slotCustomerName} at ${slotTime}.`);
    setShowSlotModal(false);
    setSlotCustomerName('');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Artisan Bay & Schedule Calendar
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Synchronized timeline view across suites, master colorists, and treatment suites.
          </p>
        </div>

        {/* 5 View Mode Pills (Day, Week, Month, Employee, Branch) */}
        <div className="flex rounded-lg bg-white/5 p-1 border border-white/10 text-xs overflow-x-auto">
          {(['day', 'week', 'month', 'employee', 'branch'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                viewMode === mode ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation & Controls */}
      <Card className="p-4 bg-[#201511] border-[#3a2820] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          />
          <span className="text-xs text-[#efc9a5] font-semibold">
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === 'employee' && (
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="px-3 py-1.5 bg-[#2a1a15] border border-white/10 rounded-xl text-[#f5eee6]"
            >
              <option value="all">All Artisans</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.displayName}</option>
              ))}
            </select>
          )}

          {viewMode === 'branch' && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-3 py-1.5 bg-[#2a1a15] border border-white/10 rounded-xl text-[#f5eee6]"
            >
              <option value="all">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}

          <Button
            size="sm"
            onClick={() => {
              setSlotStaffId(staff[0]?.id || '');
              setSlotServiceId(services[0]?.id || '');
              setShowSlotModal(true);
            }}
            className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Book Slot</span>
          </Button>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 1: DAY TIMELINE (ARTISAN BAYS)
      ═══════════════════════════════════════════════════════════════ */}
      {(viewMode === 'day' || viewMode === 'employee') && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Staff Headers */}
            <div className="grid grid-cols-12 gap-2 pb-3 border-b border-white/10 text-xs">
              <div className="col-span-2 text-[#a89582] uppercase text-[10px] font-bold">Artisan Bay</div>
              <div className="col-span-10 grid grid-cols-11 gap-1 text-center font-mono text-[10px] text-[#a89582]">
                {hours.map(h => <span key={h}>{h}</span>)}
              </div>
            </div>

            {/* Artisan Rows */}
            <div className="divide-y divide-white/5 pt-2">
              {staff
                .filter(s => selectedStaffId === 'all' || s.id === selectedStaffId)
                .map(artisan => {
                  const dayAppointments = allAppointments.filter(
                    a => a.staffId === artisan.id && a.appointmentDate === selectedDate && a.status !== 'cancelled'
                  );

                  return (
                    <div key={artisan.id} className="grid grid-cols-12 gap-2 py-3 items-center">
                      <div className="col-span-2">
                        <p className="font-semibold text-xs text-[#f5eee6] truncate">{artisan.displayName}</p>
                        <p className="text-[10px] text-[#b99470] truncate">{artisan.title}</p>
                      </div>

                      <div className="col-span-10 grid grid-cols-11 gap-1 relative h-12 bg-white/[0.01] rounded-lg p-1 border border-white/5">
                        {dayAppointments.map(apt => {
                          const [startH] = apt.startTime.split(':').map(Number);
                          const colStart = Math.max(1, startH - 8);
                          const colSpan = Math.max(1, Math.ceil(apt.durationMinutes / 60));

                          return (
                            <div
                              key={apt.id}
                              style={{
                                gridColumn: `${colStart} / span ${colSpan}`,
                              }}
                              className="h-full rounded-md bg-[#41332b] border border-[#b99470]/60 p-1.5 flex flex-col justify-center text-[10px] overflow-hidden shadow-sm"
                            >
                              <span className="font-semibold text-[#efc9a5] truncate leading-tight">
                                {apt.customerName}
                              </span>
                              <span className="text-[9px] text-[#c2b3a3] truncate">
                                {apt.serviceName} ({apt.startTime})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 2: WEEK TIMELINE
      ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'week' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[700px]">
            {weekDays.map(d => {
              const dayApts = allAppointments.filter(a => a.appointmentDate === d.date && a.status !== 'cancelled');
              const isToday = d.date === selectedDate;

              return (
                <div key={d.date} className={`p-3 rounded-xl border ${isToday ? 'bg-[#41332b]/30 border-[#b99470]' : 'bg-white/[0.02] border-[#3a2820]'}`}>
                  <div className="text-center pb-2 border-b border-white/10">
                    <p className="text-[10px] uppercase font-bold text-[#a89582]">{d.name}</p>
                    <p className={`font-mono text-sm font-semibold ${isToday ? 'text-[#efc9a5]' : 'text-[#f5eee6]'}`}>
                      {d.date.split('-')[2]}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 text-[10px]">
                    {dayApts.length === 0 ? (
                      <p className="text-[#a89582] italic text-center py-4">No rituals</p>
                    ) : (
                      dayApts.map(a => (
                        <div key={a.id} className="p-1.5 rounded bg-white/5 border border-white/5">
                          <p className="font-semibold text-[#efc9a5] truncate">{a.customerName}</p>
                          <p className="text-[#a89582] truncate">{a.startTime} • {a.staffName}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 3: MONTH TIMELINE
      ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'month' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <h2 className="font-['Montserrat'] text-base text-[#f5eee6]">November 2026 Monthly Grid</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(h => (
              <span key={h} className="text-[#a89582] uppercase text-[10px] font-bold pb-2">{h}</span>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
              const count = allAppointments.filter(a => a.appointmentDate === dateStr && a.status !== 'cancelled').length;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setViewMode('day');
                  }}
                  className={`p-2 rounded-xl border min-h-[60px] flex flex-col justify-between cursor-pointer transition-all ${
                    dateStr === selectedDate ? 'bg-[#41332b] border-[#b99470]' : 'bg-white/[0.02] border-[#3a2820] hover:border-white/20'
                  }`}
                >
                  <span className="font-mono text-xs font-semibold text-[#f5eee6]">{dayNum}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#b99470]/30 text-[#efc9a5] text-[9px] font-bold">
                      {count} apts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 4: BRANCH CONSOLIDATED
      ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'branch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map(b => {
            const branchApts = allAppointments.filter(a => a.branchId === b.id && a.appointmentDate === selectedDate && a.status !== 'cancelled');
            return (
              <Card key={b.id} className="p-5 bg-[#201511] border-[#3a2820] space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h3 className="font-semibold text-sm text-[#efc9a5]">{b.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{branchApts.length} Slots Today</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {branchApts.length === 0 ? (
                    <p className="text-xs text-[#a89582] py-4 text-center">No reservations for this branch today.</p>
                  ) : (
                    branchApts.map(a => (
                      <div key={a.id} className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#f5eee6]">{a.customerName} ({a.serviceName})</p>
                          <p className="text-[11px] text-[#a89582]">{a.startTime} • Artisan: {a.staffName}</p>
                        </div>
                        <span className="font-mono text-xs text-[#efc9a5]">₹{a.price}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Booking Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">Quick Bay Reservation</h3>
              <button onClick={() => setShowSlotModal(false)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleCreateSlotAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Pandey"
                  value={slotCustomerName}
                  onChange={(e) => setSlotCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Ritual</label>
                  <select
                    value={slotServiceId}
                    onChange={(e) => setSlotServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#2a1a15] border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes}m)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Stylist Bay</label>
                  <select
                    value={slotStaffId}
                    onChange={(e) => setSlotStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#2a1a15] border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.displayName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowSlotModal(false)} className="text-xs px-3 py-1.5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Reserve Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
