import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { StaffProfile, LeaveRequest } from '../../types/staff';
import type { Appointment } from '../../types/appointment';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  UserCheck, 
  Plus, 
  Mail, 
  Calendar, 
  Clock, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  ShieldCheck, 
  Coffee,
  UserPlus
} from 'lucide-react';

export const OwnerTeamPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTab, setActiveTab] = useState<'roster' | 'leave'>('roster');
  const [staffList, setStaffList] = useState<StaffProfile[]>(() => db.getStaffBySalon(currentSalonId));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => db.getLeaveRequests(currentSalonId));
  const [branches] = useState(() => db.getBranchesBySalon(currentSalonId));
  const [services] = useState(() => db.getServicesBySalon(currentSalonId));

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Receptionist' | 'Hairstylist' | 'Beautician' | 'Nail Artist' | 'Spa Therapist' | 'Custom'>('Hairstylist');
  const [inviteTitle, setInviteTitle] = useState('Senior Artisan');
  const [inviteBranchId, setInviteBranchId] = useState(branches[0]?.id || '');
  const [commissionRate, setCommissionRate] = useState(30);

  // Leave approval & affected appointments dialog
  const [affectedModalData, setAffectedModalData] = useState<{
    request: LeaveRequest;
    appointments: Appointment[];
  } | null>(null);

  const refreshData = () => {
    setStaffList(db.getStaffBySalon(currentSalonId));
    setLeaveRequests(db.getLeaveRequests(currentSalonId));
  };

  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Validation Error', 'Name and email are required.');
      return;
    }

    const newUserId = `user-artisan-${Date.now()}`;
    db.createUser({
      id: newUserId,
      email: inviteEmail.trim().toLowerCase(),
      fullName: inviteName.trim(),
      phone: '+91 98840 99999',
      isEmailVerified: true,
      passwordHash: 'hash_glamoure_artisan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addMembership({
      id: `m-${Date.now()}`,
      userId: newUserId,
      salonId: currentSalonId,
      branchId: inviteBranchId,
      role: 'salon_member',
      permissions: ['appointments:read', 'appointments:status', 'staff:schedule'],
      status: 'active',
      joinedAt: new Date().toISOString(),
    });

    const newStaff = db.createStaffProfile({
      id: `staff-${Date.now()}`,
      salonId: currentSalonId,
      userId: newUserId,
      branchId: inviteBranchId,
      displayName: inviteName.trim(),
      title: inviteTitle.trim(),
      role: inviteRole,
      bio: `Dedicated specialist with mastery in luxury salon rituals.`,
      experienceYears: 5,
      commissionPercentage: Number(commissionRate) || 25,
      rating: 5.0,
      reviewCount: 1,
      isActive: true,
      servicesOffered: services.slice(0, 3).map(s => s.id),
      specialties: ['Hairstyling', 'Coloration', 'Scalp Care'],
      joinedAt: new Date().toISOString(),
    });

    showToast('Artisan Enrolled', `Invitation dispatched to ${inviteName} as ${inviteRole}.`);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    refreshData();
  };

  const handleToggleActive = (staffMember: StaffProfile) => {
    const updated = db.updateStaffProfile(staffMember.id, { isActive: !staffMember.isActive });
    if (updated) {
      showToast('Status Updated', `${staffMember.displayName} is now ${updated.isActive ? 'active' : 'deactivated'}.`);
      refreshData();
    }
  };

  const handleApproveLeave = (leaveId: string) => {
    if (!user) return;
    const result = db.updateLeaveRequestStatus(leaveId, 'approved', user.id);
    if (result.request) {
      if (result.affectedAppointments.length > 0) {
        setAffectedModalData({
          request: result.request,
          appointments: result.affectedAppointments,
        });
      } else {
        showToast('Leave Approved', 'Leave granted. No conflicting bookings detected.');
      }
      refreshData();
    }
  };

  const handleRejectLeave = (leaveId: string) => {
    if (!user) return;
    const result = db.updateLeaveRequestStatus(leaveId, 'rejected', user.id);
    if (result.request) {
      showToast('Leave Declined', 'Request marked as declined.');
      refreshData();
    }
  };

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#2B2118] dark:text-[#f5eee6]">
            Team Roster & Human Capital
          </h1>
          <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-0.5">
            Artisan role governance, commission structures, weekly shifts, and leave approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#F2ECE4] dark:bg-white/5 p-1 border border-[#E8DFD5] dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'roster'
                  ? 'bg-white dark:bg-[#34241c] text-[#2B2118] dark:text-[#efc9a5] shadow-xs font-semibold'
                  : 'text-[#7A6658] dark:text-[#c2b3a3] hover:text-[#2B2118] dark:hover:text-[#f5eee6]'
              }`}
            >
              Artisans ({staffList.length})
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'leave'
                  ? 'bg-white dark:bg-[#34241c] text-[#2B2118] dark:text-[#efc9a5] shadow-xs font-semibold'
                  : 'text-[#7A6658] dark:text-[#c2b3a3] hover:text-[#2B2118] dark:hover:text-[#f5eee6]'
              }`}
            >
              <span>Leave Approvals</span>
              {pendingLeaves.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          <Button
            onClick={() => {
              setInviteBranchId(branches[0]?.id || '');
              setShowInviteModal(true);
            }}
            className="flex items-center gap-2 bg-[#2B2118] hover:bg-[#1D1610] text-white dark:bg-[#b99470] dark:hover:bg-[#a37f5d] dark:text-[#18110e] font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: ARTISANS ROSTER
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(member => {
            const branch = branches.find(b => b.id === member.branchId);
            return (
              <Card
                key={member.id}
                className="p-5 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs hover:border-[#B99470]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#FAF6F1] dark:bg-[#41332b] text-[#2B2118] dark:text-[#efc9a5] font-semibold flex items-center justify-center border border-[#E8DFD5] dark:border-[#b99470]/40 text-sm">
                        {member.displayName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#2B2118] dark:text-[#f5eee6]">{member.displayName}</h3>
                        <p className="text-xs text-[#B99470] font-medium">{member.role || member.title}</p>
                      </div>
                    </div>

                    <Badge variant={member.isActive ? 'success' : 'outline'} className="text-[10px]">
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-3 leading-relaxed">
                    {member.bio || 'Master craftsman providing customized treatments.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8DFD5] dark:border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-[#7A6658] dark:text-[#a89582] font-semibold block">Rating</span>
                      <span className="text-[#2B2118] dark:text-[#efc9a5] font-semibold flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {member.rating} ({member.reviewCount})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-[#7A6658] dark:text-[#a89582] font-semibold block">Commission</span>
                      <span className="text-[#2B2118] dark:text-[#f5eee6] font-mono mt-0.5 block">{member.commissionPercentage}%</span>
                    </div>

                    <div className="col-span-2 pt-1 text-[11px] text-[#7A6658] dark:text-[#a89582] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B99470]" />
                      <span>{branch?.name || 'Jubilee Hills Suite'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD5] dark:border-white/5">
                  <span className="text-[10px] text-[#7A6658] dark:text-[#a89582]">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleToggleActive(member)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      member.isActive
                        ? 'border-[#E8DFD5] dark:border-neutral-700 text-[#7A6658] dark:text-neutral-400 hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-300 dark:hover:border-rose-800'
                        : 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    {member.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: LEAVE REQUESTS & SCHEDULING CONFLICTS
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'leave' && (
        <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD5] dark:border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-medium text-[#2B2118] dark:text-[#f5eee6]">
                Artisan Absence & Leave Requests
              </h2>
              <p className="text-xs text-[#7A6658] dark:text-[#a89582]">
                Review leave applications with automated detection of affected customer bookings.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {leaveRequests.length === 0 ? (
              <p className="text-xs text-[#7A6658] dark:text-[#a89582] py-8 text-center italic">No leave requests currently on file.</p>
            ) : (
              leaveRequests.map(req => {
                const staffMember = staffList.find(s => s.id === req.staffProfileId);
                const affectedCount = db.getAffectedAppointments(req.staffProfileId, req.startDate, req.endDate).length;

                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.02] border border-[#E8DFD5] dark:border-[#3a2820] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#2B2118] dark:text-[#f5eee6]">
                          {staffMember?.displayName || 'Artisan Specialist'}
                        </span>
                        <Badge
                          variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}
                          className="capitalize text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-[#B99470] dark:text-[#efc9a5] font-mono mt-1">
                        {req.startDate} to {req.endDate}
                      </p>

                      <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-0.5">
                        Reason: "{req.reason}"
                      </p>

                      {affectedCount > 0 && req.status === 'pending' && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{affectedCount} active appointments will require reassignment</span>
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApproveLeave(req.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Leave</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectLeave(req.id)}
                          className="border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: AFFECTED APPOINTMENTS ALERT
      ═══════════════════════════════════════════════════════════════ */}
      {affectedModalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 pb-3 border-b border-[#E8DFD5] dark:border-white/10">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-['Montserrat'] text-base font-semibold text-[#2B2118] dark:text-[#f5eee6]">
                  Leave Approved — Rescheduling Required
                </h3>
                <p className="text-xs text-[#7A6658] dark:text-[#a89582]">
                  The following {affectedModalData.appointments.length} appointments coincide with the approved leave window.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#7A6658] dark:text-[#c2b3a3] leading-relaxed">
              Per salon policy, affected bookings are preserved and not automatically cancelled. Please reassign to an alternate specialist or reschedule with the guest:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
              {affectedModalData.appointments.map(apt => (
                <div key={apt.id} className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/5 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#2B2118] dark:text-[#f5eee6]">{apt.customerName} ({apt.customerPhone || 'Guest'})</p>
                    <p className="text-[11px] text-[#7A6658] dark:text-[#efc9a5]">{apt.serviceName} • {apt.appointmentDate} at {apt.startTime}</p>
                  </div>
                  <span className="font-mono text-xs text-[#B99470] font-semibold">₹{apt.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E8DFD5] dark:border-white/10">
              <Button
                onClick={() => setAffectedModalData(null)}
                className="bg-[#2B2118] hover:bg-[#1D1610] text-white dark:bg-[#b99470] dark:text-[#18110e] font-semibold text-xs px-4 py-2 rounded-xl"
              >
                Acknowledge & Manage Bookings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: INVITE EMPLOYEE (7 SUPPORTED ROLES)
      ═══════════════════════════════════════════════════════════════ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5] dark:border-white/10">
              <h2 className="font-['Montserrat'] text-base font-semibold text-[#2B2118] dark:text-[#f5eee6]">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-[#7A6658] dark:text-[#a89582] hover:text-[#2B2118] dark:hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleInviteEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Dubois"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jeanluc@glamoure.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Supported Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Hairstylist">Hairstylist</option>
                    <option value="Beautician">Beautician</option>
                    <option value="Nail Artist">Nail Artist</option>
                    <option value="Spa Therapist">Spa Therapist</option>
                    <option value="Custom">Custom Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Branch</label>
                  <select
                    value={inviteBranchId}
                    onChange={(e) => setInviteBranchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Artisan Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Balayage Specialist"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>

                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)} className="text-xs px-3 py-1.5 border-[#E8DFD5] text-[#2B2118]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2B2118] hover:bg-[#1D1610] text-white dark:bg-[#b99470] dark:hover:bg-[#a37f5d] dark:text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl shadow-xs">
                  Dispatch Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
