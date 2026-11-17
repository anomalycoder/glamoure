import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { QueueItem, QueueStatus } from '../../types/appointment';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Users, 
  Clock, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  Sparkles,
  Phone,
  UserCheck
} from 'lucide-react';

export const OwnerQueuePage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [branches] = useState(() => db.getBranchesBySalon(currentSalonId));
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'branch-jubilee-hills');
  const [services] = useState(() => db.getServicesBySalon(currentSalonId));
  const [staffList] = useState(() => db.getStaffBySalon(currentSalonId));

  // Walk-in Registration Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [notes, setNotes] = useState('');

  const loadQueue = () => {
    const list = db.getQueue(currentSalonId, selectedBranchId);
    setQueue(list);
  };

  useEffect(() => {
    loadQueue();
  }, [currentSalonId, selectedBranchId]);

  const handleRegisterWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !selectedServiceId) {
      showToast('Validation Error', 'Guest name and service are required.');
      return;
    }

    const srv = services.find(s => s.id === selectedServiceId);
    const stylist = staffList.find(st => st.id === selectedStaffId);

    const result = db.addToQueue({
      salonId: currentSalonId,
      branchId: selectedBranchId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      customerEmail: customerEmail.trim() || undefined,
      serviceId: selectedServiceId,
      serviceName: srv ? srv.name : 'Custom Ritual',
      staffId: stylist?.id,
      staffName: stylist?.displayName,
      notes: notes.trim() || undefined,
    });

    if (!result.success) {
      showToast('Queue Conflict', result.error || 'Guest could not be added to queue.');
      return;
    }

    showToast('Walk-in Enrolled', `${customerName} added at position #${result.item?.position}. Est wait: ${result.item?.estimatedWaitMinutes}m.`);
    setShowAddModal(false);
    resetForm();
    loadQueue();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
  };

  const handleUpdateStatus = (id: string, status: QueueStatus) => {
    const updated = db.updateQueueStatus(id, status);
    if (updated) {
      showToast('Queue Updated', `Guest status transitioned to ${status.replace('_', ' ')}.`);
      loadQueue();
    }
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const ok = db.reorderQueue(id, direction);
    if (ok) {
      showToast('Order Adjusted', `Queue priority updated.`);
      loadQueue();
    }
  };

  const handleNotifyGuest = (q: QueueItem) => {
    showToast('Dispatch Alert Sent', `SMS notification dispatched to ${q.customerName}: "Your ritual suite is preparing."`);
  };

  const activeQueue = queue.filter(q => ['waiting', 'next_in_line', 'in_service'].includes(q.status));
  const completedQueue = queue.filter(q => ['completed', 'cancelled'].includes(q.status));

  // Workload wait time calculation
  const totalWaitWorkload = activeQueue
    .filter(q => ['waiting', 'next_in_line'].includes(q.status))
    .reduce((acc, curr) => acc + (services.find(s => s.id === curr.serviceId)?.durationMinutes || 30), 0);

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#2B2118] dark:text-[#f5eee6]">
            Live Walk-in & Bay Queue
          </h1>
          <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-0.5">
            Workload-calculated wait times, dynamic queue reordering, and turn alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-xl text-xs text-[#2B2118] dark:text-[#efc9a5] focus:outline-none"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Walk-in</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Active in Queue</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#efc9a5] mt-1 font-light">{activeQueue.length}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Real-time floor count</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">In Service Now</p>
          <p className="font-['Montserrat'] text-2xl text-emerald-600 dark:text-emerald-400 mt-1 font-light">
            {activeQueue.filter(q => q.status === 'in_service').length}
          </p>
          <p className="text-[10px] text-[#7A6658] dark:text-[#a89582] mt-1">Occupying styling bays</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Total Wait Workload</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#f5eee6] mt-1 font-light">
            {totalWaitWorkload} <span className="text-xs text-[#7A6658] dark:text-[#a89582]">mins</span>
          </p>
          <p className="text-[10px] text-[#B99470] dark:text-[#efc9a5] mt-1">Calculated service duration</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Completed Today</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#f5eee6] mt-1 font-light">
            {completedQueue.filter(q => q.status === 'completed').length}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Finished rituals</p>
        </Card>
      </div>

      {/* Live Queue Cards Stream */}
      <div className="space-y-4">
        <h2 className="font-['Montserrat'] text-base font-light text-[#2B2118] dark:text-[#f5eee6]">
          Current Lounge Standby ({activeQueue.length})
        </h2>

        {activeQueue.length === 0 ? (
          <Card className="p-10 text-center bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
            <Clock className="w-8 h-8 text-[#7A6658] dark:text-[#a89582] mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-[#2B2118] dark:text-[#f5eee6]">Lounge is Peaceful</p>
            <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-1">No walk-in guests presently waiting in standby queue.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeQueue.map((q, idx) => (
              <Card
                key={q.id}
                className={`p-4 bg-white dark:bg-[#201511] border transition-all shadow-xs ${
                  q.status === 'in_service' 
                    ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10' 
                    : q.status === 'next_in_line'
                    ? 'border-[#B99470] bg-[#FAF8F5] dark:bg-[#41332b]/20'
                    : 'border-[#E8DFD5] dark:border-[#3a2820]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Position Badge & Guest Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#41332b] text-[#2B2118] dark:text-[#efc9a5] font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-[#E8DFD5] dark:border-[#b99470]/30">
                      #{q.position}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#2B2118] dark:text-[#f5eee6]">{q.customerName}</h3>
                        <Badge
                          variant={
                            q.status === 'in_service' ? 'success' :
                            q.status === 'next_in_line' ? 'default' : 'warning'
                          }
                          className="capitalize text-[10px]"
                        >
                          {q.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-0.5">
                        {q.serviceName} • Stylist: <span className="text-[#B99470] dark:text-[#efc9a5] font-medium">{q.staffName || 'Any Available'}</span>
                      </p>

                      {q.notes && (
                        <p className="text-[11px] text-[#7A6658] dark:text-[#c2b3a3] italic mt-1">
                          Note: "{q.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Wait Time & Live Controls */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#B99470] dark:text-[#efc9a5] font-bold block">
                        {q.status === 'in_service' ? 'In Bay' : `~${q.estimatedWaitMinutes} mins`}
                      </span>
                      <span className="text-[10px] text-[#7A6658] dark:text-[#a89582]">
                        Checked in: {new Date(q.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Reorder Buttons */}
                    {['waiting', 'next_in_line'].includes(q.status) && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleReorder(q.id, 'up')}
                          disabled={q.position === 1}
                          className="p-1 rounded bg-[#FAF8F5] dark:bg-white/5 hover:bg-[#E8DFD5] dark:hover:bg-white/10 text-[#2B2118] dark:text-[#c2b3a3] disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleReorder(q.id, 'down')}
                          disabled={q.position === activeQueue.length}
                          className="p-1 rounded bg-[#FAF8F5] dark:bg-white/5 hover:bg-[#E8DFD5] dark:hover:bg-white/10 text-[#2B2118] dark:text-[#c2b3a3] disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Notify Button */}
                    {q.status === 'next_in_line' && (
                      <button
                        onClick={() => handleNotifyGuest(q)}
                        className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 transition-colors cursor-pointer"
                        title="Alert Guest Turn Approaching"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    )}

                    {/* Action buttons */}
                    {q.status === 'next_in_line' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(q.id, 'in_service')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-xl cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Seat in Bay</span>
                      </Button>
                    )}

                    {q.status === 'in_service' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(q.id, 'completed')}
                        className="bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-xl cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Ritual</span>
                      </Button>
                    )}

                    {q.status === 'waiting' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(q.id, 'next_in_line')}
                        className="text-xs px-2.5 py-1 text-[#2B2118] dark:text-[#efc9a5] border-[#E8DFD5] dark:border-white/10 hover:bg-[#FAF8F5] cursor-pointer"
                      >
                        <span>Call Next</span>
                      </Button>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(q.id, 'cancelled')}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Cancel Walk-in"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Enroll Walk-in Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5] dark:border-white/10">
              <h2 className="font-['Montserrat'] text-base text-[#2B2118] dark:text-[#f5eee6] font-medium">Enroll Walk-in Guest</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#7A6658] dark:text-[#a89582] hover:text-[#2B2118] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleRegisterWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Deshmukh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98840 54321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Desired Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} mins - ₹{s.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Preferred Artisan</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                >
                  <option value="">Any Available Specialist</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName} ({s.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Service Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Wants gentle scalp wash, scalp sensitivity"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="text-xs px-3 py-1.5 border-[#E8DFD5] text-[#2B2118] cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-4 py-1.5 rounded-xl cursor-pointer shadow-xs">
                  Add to Standby Queue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
