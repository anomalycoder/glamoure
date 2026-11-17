import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { AppointmentService } from '../../services/appointmentService';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Appointment, AppointmentStatus, AppointmentStatusHistory } from '../../types/appointment';
import { 
  CheckCircle2, 
  UserCheck, 
  Play, 
  Check, 
  XCircle, 
  Search, 
  Clock, 
  Calendar, 
  Plus, 
  History, 
  Edit3, 
  UserPlus, 
  Filter,
  DollarSign,
  FileText
} from 'lucide-react';

export const OwnerAppointmentsPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [reassignApt, setReassignApt] = useState<Appointment | null>(null);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [historyApt, setHistoryApt] = useState<Appointment | null>(null);
  const [statusHistory, setStatusHistory] = useState<AppointmentStatusHistory[]>([]);

  // Manual booking form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [manualBranchId, setManualBranchId] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualStaffId, setManualStaffId] = useState('');
  const [manualDate, setManualDate] = useState('2026-11-18');
  const [manualTime, setManualTime] = useState('11:00');

  // Reschedule form states
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Reassign form states
  const [newStaffId, setNewStaffId] = useState('');

  // Cancel form states
  const [cancelReason, setCancelReason] = useState('Proprietor rescheduled at customer request');

  const branches = db.getBranchesBySalon(currentSalonId);
  const staff = db.getStaffBySalon(currentSalonId);
  const services = db.getServicesBySalon(currentSalonId);
  const appointments = db.getAppointmentsBySalon(currentSalonId);

  const refreshList = () => {
    // triggers re-render
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchBranch = branchFilter === 'all' || a.branchId === branchFilter;
      const matchStaff = staffFilter === 'all' || a.staffId === staffFilter;
      const matchService = serviceFilter === 'all' || a.serviceId === serviceFilter;
      const matchDate = !dateFilter || a.appointmentDate === dateFilter;
      const matchSearch = searchTerm === '' || 
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchStatus && matchBranch && matchStaff && matchService && matchDate && matchSearch;
    });
  }, [appointments, statusFilter, branchFilter, staffFilter, serviceFilter, dateFilter, searchTerm]);

  // Handle status transitions through AppointmentService backend validation
  const handleStatusChange = (appointmentId: string, toStatus: AppointmentStatus, reason?: string) => {
    if (!user) return;
    try {
      AppointmentService.updateStatus(appointmentId, toStatus, user, reason || `Owner transitioned status to ${toStatus}`);
      showToast('Status Updated', `Appointment transitioned to ${toStatus}.`);
      refreshList();
    } catch (err: any) {
      showToast('Transition Error', err.message);
    }
  };

  // Manual appointment creation
  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !manualServiceId || !manualStaffId) {
      showToast('Validation Error', 'Please complete all appointment fields.');
      return;
    }

    try {
      const targetService = services.find(s => s.id === manualServiceId);
      const targetStaff = staff.find(s => s.id === manualStaffId);
      const targetBranch = branches.find(b => b.id === manualBranchId) || branches[0];

      if (!targetService || !targetStaff) {
        showToast('Error', 'Selected service or artisan profile not found.');
        return;
      }

      // Calculate end time
      const [h, m] = manualTime.split(':').map(Number);
      const endTotalMinutes = h * 60 + m + targetService.durationMinutes;
      const endH = Math.floor(endTotalMinutes / 60);
      const endM = endTotalMinutes % 60;
      const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      const created = db.createAppointment({
        salonId: currentSalonId,
        branchId: targetBranch.id,
        customerId: `user-walkin-${Date.now()}`,
        customerName: clientName.trim(),
        customerEmail: clientEmail.trim(),
        customerPhone: clientPhone.trim() || '+91 98840 00000',
        staffId: targetStaff.id,
        staffName: targetStaff.displayName,
        serviceId: targetService.id,
        serviceName: targetService.name,
        appointmentDate: manualDate,
        startTime: manualTime,
        endTime,
        durationMinutes: targetService.durationMinutes,
        status: 'confirmed',
        price: targetService.price,
        depositAmount: 0,
        paymentStatus: 'paid',
        notes: 'Manual front-desk reservation by proprietor',
      });

      showToast('Booking Created', `Reserved ${created.serviceName} for ${created.customerName}.`);
      setShowManualBookingModal(false);
      refreshList();
    } catch (err: any) {
      showToast('Booking Error', err.message);
    }
  };

  // Reschedule appointment
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newTime || !user) return;

    try {
      AppointmentService.rescheduleAppointment(
        rescheduleApt.id,
        newDate,
        newTime,
        rescheduleApt.staffId,
        user.id,
        user.fullName
      );
      showToast('Rescheduled', `Appointment updated to ${newDate} at ${newTime}.`);
      setRescheduleApt(null);
      refreshList();
    } catch (err: any) {
      showToast('Reschedule Error', err.message);
    }
  };

  // Reassign staff
  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignApt || !newStaffId) return;

    const newStaff = staff.find(s => s.id === newStaffId);
    if (!newStaff) return;

    try {
      reassignApt.staffId = newStaff.id;
      reassignApt.staffName = newStaff.displayName;
      reassignApt.updatedAt = new Date().toISOString();

      db.logAudit({
        salonId: currentSalonId,
        userId: user?.id || 'owner',
        userEmail: user?.email || 'owner@glamoure.com',
        action: 'STAFF_REASSIGNED',
        entity: 'appointments',
        entityId: reassignApt.id,
        metadata: { newStaffId: newStaff.id, newStaffName: newStaff.displayName },
      });

      showToast('Artisan Reassigned', `Reassigned ritual to ${newStaff.displayName}.`);
      setReassignApt(null);
      refreshList();
    } catch (err: any) {
      showToast('Reassignment Error', err.message);
    }
  };

  // Cancellation
  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelApt || !user) return;

    try {
      AppointmentService.cancelAppointment(cancelApt.id, user, cancelReason);
      showToast('Cancelled', 'Appointment cancelled in accordance with salon policies.');
      setCancelApt(null);
      refreshList();
    } catch (err: any) {
      showToast('Cancellation Error', err.message);
    }
  };

  // Audit history
  const handleOpenHistory = (apt: Appointment) => {
    setHistoryApt(apt);
    const history = db.getAppointmentHistory(apt.id);
    setStatusHistory(history);
  };

  // Table columns definition
  const columns: Column<Appointment>[] = [
    {
      header: 'Client & Ritual',
      render: (row: Appointment) => (
        <div>
          <span className="font-medium text-[#f5eee6] block">{row.customerName}</span>
          <span className="text-[11px] text-[#a89582]">{row.serviceName}</span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (row: Appointment) => (
        <div>
          <span className="text-[#f5eee6] font-mono text-xs block">{row.appointmentDate}</span>
          <span className="text-[11px] text-[#efc9a5] font-mono">{row.startTime} - {row.endTime}</span>
        </div>
      ),
    },
    {
      header: 'Artisan',
      render: (row: Appointment) => (
        <span className="text-xs text-[#efc9a5] font-medium">{row.staffName}</span>
      ),
    },
    {
      header: 'Tariff',
      render: (row: Appointment) => (
        <div>
          <span className="font-mono text-xs text-[#f5eee6] block">₹{row.price.toLocaleString()}</span>
          <span className={`text-[10px] uppercase font-bold ${row.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {row.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row: Appointment) => (
        <Badge
          variant={
            row.status === 'completed' ? 'success' :
            row.status === 'in_progress' ? 'default' :
            row.status === 'checked_in' ? 'info' :
            row.status === 'confirmed' ? 'outline' :
            row.status === 'cancelled' ? 'danger' : 'warning'
          }
          className="capitalize text-[10px]"
        >
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Operations',
      render: (row: Appointment) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick status transitions */}
          {row.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange(row.id, 'checked_in')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-200 transition-colors cursor-pointer"
              title="Check In Guest"
            >
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          )}

          {row.status === 'checked_in' && (
            <button
              onClick={() => handleStatusChange(row.id, 'in_progress')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#41332b] text-[#efc9a5] transition-colors cursor-pointer"
              title="Commence Ritual (In Progress)"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          {row.status === 'in_progress' && (
            <button
              onClick={() => handleStatusChange(row.id, 'completed')}
              className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 transition-colors cursor-pointer"
              title="Complete Ritual"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Reassign Artisan */}
          {['pending', 'confirmed'].includes(row.status) && (
            <button
              onClick={() => {
                setReassignApt(row);
                setNewStaffId(row.staffId);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a89582] hover:text-[#f5eee6] transition-colors cursor-pointer"
              title="Reassign Stylist"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Reschedule */}
          {['pending', 'confirmed'].includes(row.status) && (
            <button
              onClick={() => {
                setRescheduleApt(row);
                setNewDate(row.appointmentDate);
                setNewTime(row.startTime);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a89582] hover:text-[#f5eee6] transition-colors cursor-pointer"
              title="Reschedule Appointment"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cancel */}
          {!['completed', 'cancelled', 'no_show'].includes(row.status) && (
            <button
              onClick={() => {
                setCancelApt(row);
                setCancelReason('Proprietor rescheduled at customer request');
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
              title="Cancel Booking"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Audit History */}
          <button
            onClick={() => handleOpenHistory(row)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a89582] hover:text-[#f5eee6] transition-colors cursor-pointer"
            title="View Audit Trail"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Appointment Operations
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Real-time multi-branch dispatch, manual salon reservations, and status lifecycle control.
          </p>
        </div>

        <Button
          onClick={() => {
            setManualBranchId(branches[0]?.id || '');
            setManualServiceId(services[0]?.id || '');
            setManualStaffId(staff[0]?.id || '');
            setShowManualBookingModal(true);
          }}
          className="flex items-center gap-2 bg-[#b99470] hover:bg-[#a37f5d] text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Manual Reservation</span>
        </Button>
      </div>

      {/* Multi-Filters Grid */}
      <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8D8C7] dark:border-[#3a2820] space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-[#806B5C] dark:text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, ritual or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] placeholder-[#806B5C] dark:placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          >
            <option value="all">All Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Stylist Filter */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          >
            <option value="all">All Stylists</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.displayName}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          />
        </div>
      </Card>

      {/* Appointments Table */}
      <Card className="bg-white dark:bg-[#201511] border-[#E8D8C7] dark:border-[#3a2820] overflow-hidden shadow-xs">
        <DataTable<Appointment>
          columns={columns}
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
        />
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: MANUAL APPOINTMENT CREATION
      ═══════════════════════════════════════════════════════════════ */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <h2 className="font-['Montserrat'] text-base text-[#41332B] dark:text-[#f5eee6] font-medium">Create Manual Reservation</h2>
              <button onClick={() => setShowManualBookingModal(false)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateManualAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Apte"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Guest Email</label>
                  <input
                    type="email"
                    required
                    placeholder="radhika@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Guest Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98840 12345"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Branch</label>
                  <select
                    value={manualBranchId}
                    onChange={(e) => setManualBranchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Ritual Service</label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Assigned Artisan</label>
                <select
                  value={manualStaffId}
                  onChange={(e) => setManualStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName} ({s.title})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
                <div>
                  <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8D8C7] dark:border-white/10">
                <Button type="button" variant="outline" onClick={() => setShowManualBookingModal(false)} className="text-xs px-3 py-1.5 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] hover:bg-[#a37f5d] text-white font-semibold text-xs px-4 py-1.5 rounded-xl cursor-pointer">
                  Confirm Manual Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: RESCHEDULE APPOINTMENT
      ═══════════════════════════════════════════════════════════════ */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#41332B] dark:text-[#f5eee6] font-medium">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleApt(null)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#806B5C] dark:text-[#c2b3a3]">
              Rescheduling ritual for <strong className="text-[#41332B] dark:text-[#f5eee6]">{rescheduleApt.customerName}</strong> ({rescheduleApt.serviceName}).
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">New Start Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setRescheduleApt(null)} className="text-xs px-3 py-1.5 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-white font-semibold text-xs px-4 py-1.5 rounded-xl cursor-pointer">
                  Save New Time
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: REASSIGN ARTISAN
      ═══════════════════════════════════════════════════════════════ */}
      {reassignApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#41332B] dark:text-[#f5eee6] font-medium">Reassign Artisan</h3>
              <button onClick={() => setReassignApt(null)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#806B5C] dark:text-[#c2b3a3]">
              Assigning new specialist for <span className="text-[#41332B] dark:text-[#f5eee6] font-medium">{reassignApt.customerName}'s {reassignApt.serviceName}</span>.
            </p>

            <form onSubmit={handleReassignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Specialist</label>
                <select
                  value={newStaffId}
                  onChange={(e) => setNewStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName} ({s.title})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setReassignApt(null)} className="text-xs px-3 py-1.5 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-white font-semibold text-xs px-4 py-1.5 rounded-xl cursor-pointer">
                  Confirm Reassignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: CANCEL APPOINTMENT WITH REASON
      ═══════════════════════════════════════════════════════════════ */}
      {cancelApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <h3 className="font-['Montserrat'] text-base text-rose-600 dark:text-rose-400 font-medium">Cancel Appointment</h3>
              <button onClick={() => setCancelApt(null)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#806B5C] dark:text-[#c2b3a3]">
              Are you sure you want to cancel the booking for <strong className="text-[#41332B] dark:text-[#f5eee6]">{cancelApt.customerName}</strong>?
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Cancellation Reason</label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setCancelApt(null)} className="text-xs px-3 py-1.5 cursor-pointer">
                  Back
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-1.5 rounded-xl cursor-pointer">
                  Confirm Cancellation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          DRAWER: AUDIT STATUS HISTORY
      ═══════════════════════════════════════════════════════════════ */}
      {historyApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#b99470]" />
                <h3 className="font-['Montserrat'] text-base text-[#41332B] dark:text-[#f5eee6] font-medium">Audit History</h3>
              </div>
              <button onClick={() => setHistoryApt(null)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#41332B] dark:text-[#efc9a5] font-semibold">{historyApt.serviceName} for {historyApt.customerName}</p>
              <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">Reference ID: {historyApt.id}</p>
            </div>

            <div className="space-y-3 pt-2 max-h-60 overflow-y-auto custom-scrollbar">
              {statusHistory.length === 0 ? (
                <p className="text-xs text-[#806B5C] dark:text-[#a89582] italic">No prior status transitions logged.</p>
              ) : (
                statusHistory.map((h, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#b99470] dark:text-[#efc9a5] uppercase text-[10px]">
                        {h.fromStatus ? `${h.fromStatus} → ` : ''}{h.toStatus}
                      </span>
                      <span className="text-[10px] text-[#806B5C] dark:text-[#a89582]">
                        {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#806B5C] dark:text-[#c2b3a3]">By: {h.changedByName}</p>
                    {h.reason && <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] italic">"{h.reason}"</p>}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <Button type="button" variant="outline" onClick={() => setHistoryApt(null)} className="text-xs px-3 py-1.5 cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
