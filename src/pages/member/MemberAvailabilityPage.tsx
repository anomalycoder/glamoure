import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { StaffProfile, LeaveRequest, WorkingHours, DayOfWeek } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Clock, 
  Calendar, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Save,
  Plane
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const MemberAvailabilityPage: React.FC = () => {
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

  const [activeTab, setActiveTab] = useState<'schedule' | 'leave'>('schedule');
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(() => {
    return staffProfile ? db.getWorkingHours(staffProfile.id) : [];
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return staffProfile ? db.getLeaveRequestsByStaff(staffProfile.id) : [];
  });

  // Leave request form states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [startDate, setStartDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-11-27');
  const [leaveReason, setLeaveReason] = useState('Attending Advanced Coloration Masterclass in Paris');

  const refreshData = () => {
    if (staffProfile) {
      setWorkingHours(db.getWorkingHours(staffProfile.id));
      setLeaveRequests(db.getLeaveRequestsByStaff(staffProfile.id));
    }
  };

  const handleUpdateShift = (day: string, field: 'startTime' | 'endTime' | 'isWorking', value: any) => {
    setWorkingHours(prev => prev.map(item => {
      if (item.dayOfWeek === day) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSaveSchedule = () => {
    if (!staffProfile) return;
    db.updateWorkingHours(staffProfile.id, workingHours);
    showToast('Schedule Saved', 'Weekly working hours & styling bay availability persisted.');
  };

  const handleCreateLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveReason.trim() || !staffProfile) {
      showToast('Validation Error', 'Start date, end date, and purpose of absence are required.');
      return;
    }

    if (endDate < startDate) {
      showToast('Date Error', 'Leave end date cannot precede start date.');
      return;
    }

    const newReq = db.createLeaveRequest({
      salonId: currentSalonId,
      staffProfileId: staffProfile.id,
      startDate,
      endDate,
      reason: leaveReason.trim(),
    });

    showToast('Leave Submitted', `Application dispatched to salon proprietor for ${startDate} to ${endDate}.`);
    setShowLeaveModal(false);
    setLeaveReason('');
    refreshData();
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Availability, Shifts & Leave
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Manage your weekly bay hours, scheduled breaks, and submit sabbatical or travel leave requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-white/5 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'schedule' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'leave' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              My Leave ({leaveRequests.length})
            </button>
          </div>

          <Button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer"
          >
            <Plane className="w-4 h-4" />
            <span>Request Leave</span>
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: WEEKLY SHIFT SCHEDULE & BREAKS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'schedule' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
                Weekly Working Hours Roster
              </h2>
              <p className="text-xs text-[#a89582]">
                These hours determine real-time booking availability in the customer reservation portal.
              </p>
            </div>

            <Button
              onClick={handleSaveSchedule}
              size="sm"
              className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Schedule</span>
            </Button>
          </div>

          <div className="divide-y divide-white/5 space-y-1">
            {DAYS.map(day => {
              const current = workingHours.find(w => w.dayOfWeek === day) || {
                id: `wh-${day}`,
                staffProfileId: staffProfile.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                isWorking: day !== 'sunday',
              };

              return (
                <div key={day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 w-36">
                    <input
                      type="checkbox"
                      id={`check-${day}`}
                      checked={current.isWorking}
                      onChange={(e) => handleUpdateShift(day, 'isWorking', e.target.checked)}
                      className="w-4 h-4 rounded bg-white/5 border-white/20 text-[#b99470] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor={`check-${day}`} className="capitalize font-semibold text-sm text-[#f5eee6] cursor-pointer">
                      {day}
                    </label>
                  </div>

                  {current.isWorking ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#a89582] text-[11px]">Start:</span>
                        <input
                          type="time"
                          value={current.startTime}
                          onChange={(e) => handleUpdateShift(day, 'startTime', e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                        />
                      </div>

                      <span className="text-[#a89582]">—</span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[#a89582] text-[11px]">End:</span>
                        <input
                          type="time"
                          value={current.endTime}
                          onChange={(e) => handleUpdateShift(day, 'endTime', e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                        />
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#b99470] pl-2 border-l border-white/10">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Break: 13:00 - 14:00</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-[#a89582] italic">Station in Repose (Off Duty)</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: LEAVE APPLICATIONS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'leave' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
                Leave & Sabbatical Applications
              </h2>
              <p className="text-xs text-[#a89582]">
                Track approval status from the salon owner. Appointments during approved leave will be safely reassigned.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {leaveRequests.length === 0 ? (
              <p className="text-xs text-[#a89582] py-8 text-center italic">No leave requests on file.</p>
            ) : (
              leaveRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-[#3a2820] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#f5eee6] font-mono">
                        {req.startDate} to {req.endDate}
                      </span>
                      <Badge
                        variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}
                        className="capitalize text-[10px]"
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <p className="text-[#a89582] mt-1">
                      Reason: "{req.reason}"
                    </p>

                    <p className="text-[10px] text-[#b99470] mt-0.5">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {req.status === 'approved' && (
                    <div className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved by Proprietor</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">Request Leave / Sabbatical</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleCreateLeaveRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>

                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Masterclass training, personal sabbatical, or family ceremony..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                Once approved by the proprietor, any bookings during this period will be surfaced for alternative rescheduling without being dropped.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowLeaveModal(false)} className="text-xs px-3">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Dispatch Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
