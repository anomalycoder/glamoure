import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { AppointmentService } from '../../services/appointmentService';
import type { Appointment, AppointmentStatus } from '../../types/appointment';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Play, 
  Check, 
  User, 
  AlertTriangle, 
  Search, 
  Info,
  RotateCcw
} from 'lucide-react';

export const MemberAppointmentsPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Identify staff profile for logged in member (fallback to Marcus Reed)
  const staffProfile: StaffProfile = useMemo(() => {
    if (user?.id) {
      const found = db.getStaffByUserId(user.id, currentSalonId);
      if (found) return found;
    }
    const defaultStaff = db.getStaffBySalon(currentSalonId);
    return defaultStaff[0];
  }, [user?.id, currentSalonId]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [issueModalApt, setIssueModalApt] = useState<Appointment | null>(null);
  const [issueReason, setIssueReason] = useState('');

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return staffProfile ? db.getAppointmentsByStaff(staffProfile.id) : [];
  });

  const refreshData = () => {
    if (staffProfile) {
      setAppointments(db.getAppointmentsByStaff(staffProfile.id));
    }
  };

  // Status transitions
  const handleTransition = (apt: Appointment, toStatus: AppointmentStatus) => {
    if (!user) return;
    // Strict isolation check: member cannot modify another staff's appointments!
    if (apt.staffId !== staffProfile.id) {
      showToast('Permission Denied', 'You may only update appointments assigned to your chair.');
      return;
    }

    try {
      AppointmentService.updateStatus(
        apt.id, 
        toStatus, 
        user, 
        `Artisan ${staffProfile.displayName} marked ritual as ${toStatus}`
      );
      showToast('Status Updated', `Appointment is now ${toStatus.replace('_', ' ')}.`);
      refreshData();
    } catch (err: any) {
      showToast('Error', err.message);
    }
  };

  // Reschedule request
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt || !rescheduleDate || !rescheduleTime || !user) return;

    try {
      AppointmentService.rescheduleAppointment(
        rescheduleModalApt.id,
        rescheduleDate,
        rescheduleTime,
        staffProfile.id,
        user.id,
        staffProfile.displayName
      );
      showToast('Rescheduled', `Ritual rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
      setRescheduleModalApt(null);
      refreshData();
    } catch (err: any) {
      showToast('Reschedule Error', err.message);
    }
  };

  // Report Issue
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalApt || !issueReason.trim()) return;

    db.logAudit({
      salonId: currentSalonId,
      userId: user?.id || 'staff',
      userEmail: user?.email || 'staff@glamoure.com',
      action: 'APPOINTMENT_ISSUE_REPORTED',
      entity: 'appointments',
      entityId: issueModalApt.id,
      metadata: { issue: issueReason.trim(), reportedBy: staffProfile.displayName },
    });

    // Notify proprietor
    const salon = db.getSalonById(currentSalonId);
    if (salon) {
      db.createNotification({
        id: `notif-${Date.now()}`,
        userId: salon.ownerId,
        salonId: currentSalonId,
        title: 'Artisan Chair Alert',
        message: `${staffProfile.displayName} reported an issue on ${issueModalApt.serviceName}: "${issueReason.trim()}"`,
        type: 'reminder',
        isRead: false,
        link: '/owner/appointments',
        createdAt: new Date().toISOString(),
      });
    }

    showToast('Issue Dispatched', 'Salon owner alerted. Concierge will follow up.');
    setIssueModalApt(null);
    setIssueReason('');
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchSearch = searchTerm === '' ||
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [appointments, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Assigned Rituals & Station Schedule
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Specialist appointments exclusively assigned to {staffProfile?.displayName}. Check-in, service delivery, and issue resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest or ritual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-[#f5eee6] placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#201511] border border-[#3a2820] rounded-xl text-[#efc9a5] focus:outline-none"
          >
            <option value="all">All Rituals</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Appointment Cards Stream */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <Card className="p-10 text-center bg-[#201511] border-[#3a2820]">
            <Scissors className="w-8 h-8 text-[#a89582] mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-[#f5eee6]">No Assigned Appointments</p>
            <p className="text-xs text-[#a89582] mt-1">No bookings match your current filter parameters.</p>
          </Card>
        ) : (
          filteredAppointments.map(apt => (
            <Card
              key={apt.id}
              className="p-4 bg-[#201511] border-[#3a2820] hover:border-[#b99470]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="px-3 py-2 rounded-xl bg-[#41332b] text-[#efc9a5] font-mono text-xs font-semibold text-center shrink-0 border border-[#b99470]/30">
                  <span className="block text-[10px] uppercase text-[#a89582] font-sans font-bold">
                    {apt.appointmentDate.split('-').slice(1).join('/')}
                  </span>
                  <span>{apt.startTime}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#f5eee6]">{apt.customerName}</h3>
                    <Badge
                      variant={
                        apt.status === 'completed' ? 'success' :
                        apt.status === 'in_progress' ? 'default' :
                        apt.status === 'checked_in' ? 'info' : 'outline'
                      }
                      className="capitalize text-[10px]"
                    >
                      {apt.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#efc9a5] font-medium mt-0.5">
                    {apt.serviceName} • {apt.durationMinutes} mins • ₹{apt.price}
                  </p>

                  <p className="text-[11px] text-[#a89582]">
                    Contact: {apt.customerPhone || apt.customerEmail}
                  </p>
                </div>
              </div>

              {/* Station Action Operations */}
              <div className="flex items-center gap-2 flex-wrap">
                {apt.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => handleTransition(apt, 'checked_in')}
                    className="bg-white/5 hover:bg-emerald-950/40 text-emerald-400 text-xs px-3 py-1.5 rounded-xl border border-white/10"
                  >
                    Check In Guest
                  </Button>
                )}

                {apt.status === 'checked_in' && (
                  <Button
                    size="sm"
                    onClick={() => handleTransition(apt, 'in_progress')}
                    className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Ritual</span>
                  </Button>
                )}

                {apt.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleTransition(apt, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </Button>
                )}

                <button
                  onClick={() => setSelectedAptDetails(apt)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#c2b3a3] hover:text-[#f5eee6] transition-colors"
                  title="View Ritual Instructions & Dossier"
                >
                  <Info className="w-4 h-4" />
                </button>

                {['pending', 'confirmed'].includes(apt.status) && (
                  <button
                    onClick={() => {
                      setRescheduleModalApt(apt);
                      setRescheduleDate(apt.appointmentDate);
                      setRescheduleTime(apt.startTime);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a89582] hover:text-[#efc9a5] transition-colors"
                    title="Request Rescheduling"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIssueModalApt(apt);
                    setIssueReason('');
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/30 text-[#a89582] hover:text-rose-300 transition-colors"
                  title="Report Station Issue"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: SERVICE DETAILS & GUEST INSTRUCTIONS
      ═══════════════════════════════════════════════════════════════ */}
      {selectedAptDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">Ritual Instructions</h3>
              <button onClick={() => setSelectedAptDetails(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#a89582] font-semibold block">Guest</span>
                <span className="font-semibold text-sm text-[#f5eee6]">{selectedAptDetails.customerName}</span>
                <span className="text-[#a89582] block">{selectedAptDetails.customerEmail} • {selectedAptDetails.customerPhone}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#a89582] font-semibold block">Ritual Service</span>
                <span className="text-[#efc9a5] font-semibold text-sm">{selectedAptDetails.serviceName}</span>
                <span className="text-[#a89582] block">Duration: {selectedAptDetails.durationMinutes} mins | Tariff: ₹{selectedAptDetails.price}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] uppercase text-[#efc9a5] font-bold block mb-1">
                  Artisan Protocol Notes
                </span>
                <p className="text-[#c2b3a3] leading-relaxed">
                  {selectedAptDetails.notes || 'Perform consultation first. Verify scalp allergy sensitivity and drape with organic cotton linen.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button variant="outline" size="sm" onClick={() => setSelectedAptDetails(null)} className="text-xs px-3">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: RESCHEDULE REQUEST
      ═══════════════════════════════════════════════════════════════ */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">Reschedule Ritual</h3>
              <button onClick={() => setRescheduleModalApt(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">New Start Time</label>
                <input
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setRescheduleModalApt(null)} className="text-xs px-3">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Update Ritual
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: REPORT APPOINTMENT ISSUE
      ═══════════════════════════════════════════════════════════════ */}
      {issueModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-rose-900/50 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-rose-300">Report Station Issue</h3>
              <button onClick={() => setIssueModalApt(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Incident / Problem</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Client arrived 25 minutes late, product allergy indicated during consultation, or station water line disruption..."
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIssueModalApt(null)} className="text-xs px-3">
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Submit Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
