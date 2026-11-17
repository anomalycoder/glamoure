import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { StaffProfile, LeaveRequest, WorkingHours } from '../../types/staff';
import type { CustomerRecord, Review } from '../../types/common';
import type { Appointment, Invoice } from '../../types/appointment';
import type { CustomerProfile } from '../../types/auth';
import { 
  Users, 
  UserCheck, 
  Search, 
  Download, 
  Sparkles, 
  Heart, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  Star, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserPlus,
  Scissors,
  Coffee,
  Check,
  X,
  Sliders,
  ChevronRight,
  Eye,
  RefreshCw,
  Edit2
} from 'lucide-react';

export const OwnerPeoplePage: React.FC = () => {
  const { salonId, user } = useAuth();
  const { activeBranchId, isBranchMatch } = useBranch();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Master Section Tab: Team Members vs Customers
  const [activeMainTab, setActiveMainTab] = useState<'members' | 'customers'>('members');

  // =========================================================================
  // TEAM MEMBERS STATE
  // =========================================================================
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<string>('all');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [staffList, setStaffList] = useState<StaffProfile[]>(() => db.getStaffBySalon(currentSalonId));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => db.getLeaveRequests(currentSalonId));
  const branches = useMemo(() => db.getBranchesBySalon(currentSalonId), [currentSalonId]);
  const allServices = useMemo(() => db.getServicesBySalon(currentSalonId), [currentSalonId]);

  // Modals for Team
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [staffModalSection, setStaffModalSection] = useState<'overview' | 'services' | 'hours' | 'leave' | 'commission' | 'performance' | 'status'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('+91 98840 99999');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Receptionist' | 'Hairstylist' | 'Beautician' | 'Nail Artist' | 'Spa Therapist'>('Hairstylist');
  const [inviteTitle, setInviteTitle] = useState('Senior Artisan Stylist');
  const [inviteBranchId, setInviteBranchId] = useState(branches[0]?.id || '');
  const [inviteCommission, setInviteCommission] = useState(30);

  // Leave approval modal
  const [affectedLeaveData, setAffectedLeaveData] = useState<{
    request: LeaveRequest;
    appointments: Appointment[];
  } | null>(null);

  // =========================================================================
  // CUSTOMERS STATE
  // =========================================================================
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<'all' | 'new' | 'returning' | 'frequent' | 'inactive' | 'highValue'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [customerModalTab, setCustomerModalTab] = useState<'overview' | 'appointments' | 'spend' | 'formula' | 'preferences' | 'notes' | 'invoices' | 'reviews'>('overview');
  const [newCustomerNote, setNewCustomerNote] = useState('');

  // Formula vault editing
  const [colorFormula, setColorFormula] = useState('L\'Oréal Majirel 7.1 + 20 Vol (1:1.5)');
  const [developerVol, setDeveloperVol] = useState('20 Vol (6%)');
  const [processingTime, setProcessingTime] = useState('35 mins with scalp balm');
  const [skinSensitivities, setSkinSensitivities] = useState('Sensitive scalp, ammonia-free prefered');

  const refreshData = () => {
    setStaffList(db.getStaffBySalon(currentSalonId));
    setLeaveRequests(db.getLeaveRequests(currentSalonId));
  };

  // Branch-Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchBranch = isBranchMatch(s.branchId);
      const matchRole = memberRoleFilter === 'all' || s.role === memberRoleFilter;
      const matchStatus = memberStatusFilter === 'all' || 
        (memberStatusFilter === 'active' ? s.isActive : !s.isActive);
      const matchSearch = !memberSearchTerm.trim() || 
        s.displayName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        s.title.toLowerCase().includes(memberSearchTerm.toLowerCase());

      return matchBranch && matchRole && matchStatus && matchSearch;
    });
  }, [staffList, isBranchMatch, memberRoleFilter, memberStatusFilter, memberSearchTerm]);

  // Customer Records & Segments
  const segments = useMemo(() => {
    return db.getCustomerSegments(currentSalonId);
  }, [currentSalonId]);

  const allCustomers = useMemo(() => {
    const map = new Map<string, CustomerRecord>();
    Object.values(segments).forEach(list => {
      list.forEach(c => map.set(c.userId, c));
    });
    return Array.from(map.values());
  }, [segments]);

  const filteredCustomers = useMemo(() => {
    let list: CustomerRecord[] = [];
    if (activeSegment === 'all') list = allCustomers;
    else list = segments[activeSegment] || [];

    if (!customerSearchTerm.trim()) return list;

    return list.filter(c => 
      c.fullName.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearchTerm))
    );
  }, [activeSegment, allCustomers, segments, customerSearchTerm]);

  // Customer modal details
  const customerProfile = useMemo(() => {
    if (!selectedCustomer) return null;
    return db.getCustomerProfile(selectedCustomer.userId);
  }, [selectedCustomer]);

  const customerAppointments = useMemo(() => {
    if (!selectedCustomer) return [];
    return db.getAppointmentsByCustomer(selectedCustomer.userId);
  }, [selectedCustomer]);

  const customerReviews = useMemo(() => {
    if (!selectedCustomer) return [];
    return db.getReviewsByCustomer(selectedCustomer.userId);
  }, [selectedCustomer]);

  const customerInvoices = useMemo(() => {
    if (!selectedCustomer) return [];
    return db.getInvoicesBySalon(currentSalonId).filter(inv => inv.customerId === selectedCustomer.userId);
  }, [selectedCustomer, currentSalonId]);

  // Staff Modal Details
  const staffWorkingHours = useMemo(() => {
    if (!selectedStaff) return [];
    return db.getWorkingHours(selectedStaff.id);
  }, [selectedStaff]);

  const staffLeaveHistory = useMemo(() => {
    if (!selectedStaff) return [];
    return db.getLeaveRequestsByStaff(selectedStaff.id);
  }, [selectedStaff]);

  const staffAppointments = useMemo(() => {
    if (!selectedStaff) return [];
    return db.getAppointmentsBySalon(currentSalonId).filter(a => a.staffId === selectedStaff.id);
  }, [selectedStaff, currentSalonId]);

  // Handlers for Staff
  const handleToggleStaffActive = (staffId: string, currentStatus: boolean) => {
    const updated = db.updateStaffProfile(staffId, { isActive: !currentStatus });
    setStaffList(prev => prev.map(s => s.id === staffId ? updated : s));
    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff(updated);
    }
    showToast(
      !currentStatus ? 'Artisan Activated' : 'Artisan Deactivated',
      `Artisan status updated to ${!currentStatus ? 'Active' : 'Inactive'}. Historical appointments and ledger preserved.`
    );
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
      phone: invitePhone.trim(),
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
      bio: 'Dedicated salon artisan committed to luxury guest experiences.',
      experienceYears: 4,
      commissionPercentage: Number(inviteCommission),
      rating: 5.0,
      reviewCount: 0,
      isActive: true,
      joinedAt: new Date().toISOString(),
      servicesOffered: allServices.slice(0, 3).map(s => s.id),
      specialties: ['Artisan Precision', 'Color Consultation']
    });

    // Default working hours Monday through Saturday
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const hours: WorkingHours[] = days.map((day, idx) => ({
      id: `wh-${Date.now()}-${idx}`,
      staffProfileId: newStaff.id,
      salonId: currentSalonId,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '19:00',
      isWorking: true,
    }));
    db.updateWorkingHours(newStaff.id, hours);

    refreshData();
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    showToast('Artisan Onboarded', `${inviteName} has been welcomed to the team.`);
  };

  const handleReviewLeave = (request: LeaveRequest, action: 'approved' | 'rejected') => {
    const result = db.updateLeaveRequestStatus(request.id, action, user?.id || 'owner-glamoure');
    if (action === 'approved' && result.affectedAppointments.length > 0) {
      setAffectedLeaveData({
        request: result.request || request,
        appointments: result.affectedAppointments,
      });
    }
    refreshData();
    showToast(`Leave Request ${action.toUpperCase()}`, `Artisan notified accordingly.`);
  };

  // Handlers for Customers
  const handleSaveCustomerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newCustomerNote.trim()) return;

    const existingNotes = customerProfile?.preferredNotes || selectedCustomer.notes || '';
    const timestamp = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const appended = existingNotes ? `${existingNotes}\n[${timestamp}]: ${newCustomerNote.trim()}` : `[${timestamp}]: ${newCustomerNote.trim()}`;

    db.updateCustomerNotes(selectedCustomer.userId, appended);
    setNewCustomerNote('');
    showToast('Dossier Updated', 'Staff note recorded in client history.');
  };

  const handleExportCSV = () => {
    const headers = ['User ID', 'Full Name', 'Email', 'Phone', 'Total Visits', 'Total Spent (INR)', 'Last Visit'];
    const rows = filteredCustomers.map(c => [
      c.userId,
      `"${c.fullName}"`,
      c.email,
      c.phone || '',
      c.totalAppointments,
      c.totalSpent,
      c.lastVisitDate || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glamoure_clientele_${activeSegment}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Clientele records exported to CSV.');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          TOP HEADER & SUB-NAV TABS
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Members & Customers
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Unified human directory: Manage salon artisans, shifts, leave conflicts, and client dossiers.
          </p>
        </div>

        {/* Master Tab Pill Selector */}
        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveMainTab('members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeMainTab === 'members'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Team Members ({staffList.length})
          </button>
          <button
            onClick={() => setActiveMainTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeMainTab === 'customers'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Customers ({allCustomers.length})
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 1: TEAM MEMBERS TAB
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'members' && (
        <div className="space-y-6">
          {/* Operational Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Total Artisans</span>
              <p className="text-xl font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">{staffList.length}</p>
            </Card>
            <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Active On-Floor</span>
              <p className="text-xl font-light text-emerald-600 dark:text-emerald-400 mt-0.5">
                {staffList.filter(s => s.isActive).length}
              </p>
            </Card>
            <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Pending Leave</span>
              <p className="text-xl font-light text-amber-600 dark:text-amber-400 mt-0.5">
                {leaveRequests.filter(l => l.status === 'pending').length}
              </p>
            </Card>
            <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <span className="text-[10px] tracking-wider uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Avg Team Rating</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xl font-light text-[#41332B] dark:text-[#f5eee6]">4.92</span>
              </div>
            </Card>
          </div>

          {/* Action and Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#806B5C]" />
                <input
                  type="text"
                  placeholder="Search artisan by name or title..."
                  value={memberSearchTerm}
                  onChange={e => setMemberSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#41332B]"
                />
              </div>

              {/* Role filter */}
              <select
                value={memberRoleFilter}
                onChange={e => setMemberRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
              >
                <option value="all">All Roles</option>
                <option value="Hairstylist">Hairstylist</option>
                <option value="Beautician">Beautician</option>
                <option value="Nail Artist">Nail Artist</option>
                <option value="Spa Therapist">Spa Therapist</option>
                <option value="Manager">Manager</option>
              </select>

              {/* Status filter */}
              <select
                value={memberStatusFilter}
                onChange={e => setMemberStatusFilter(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 text-xs shrink-0 bg-[#41332B] hover:bg-[#2b1810] text-white"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Onboard Artisan
            </Button>
          </div>

          {/* Members Table */}
          <Card className="bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Artisan</th>
                    <th className="py-3 px-4 font-semibold">Role & Title</th>
                    <th className="py-3 px-4 font-semibold">Branch</th>
                    <th className="py-3 px-4 font-semibold">Services Offered</th>
                    <th className="py-3 px-4 font-semibold">Commission</th>
                    <th className="py-3 px-4 font-semibold">Rating</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#806B5C] dark:text-[#a89582]">
                        No team members match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(staff => {
                      const branch = branches.find(b => b.id === staff.branchId);
                      return (
                        <tr key={staff.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#E8D8C7] dark:bg-white/10 text-[#41332B] dark:text-[#f5eee6] flex items-center justify-center font-serif font-medium text-xs">
                                {staff.displayName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{staff.displayName}</p>
                                <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">Joined {new Date(staff.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{staff.role || 'Artisan'}</span>
                            <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">{staff.title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px] border-[#E8D8C7] dark:border-white/10 text-[#806B5C] dark:text-[#c2b3a3]">
                              {branch?.name || 'Flagship'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-medium text-[#41332B] dark:text-[#f5eee6]">
                              <Scissors className="w-3 h-3 text-[#B99470]" />
                              {staff.servicesOffered.length} rituals
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                            {staff.commissionPercentage}%
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{staff.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-[#806B5C]">({staff.reviewCount})</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {staff.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setStaffModalSection('overview');
                                }}
                                className="text-xs px-2.5 py-1 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
                              >
                                View Dossier
                              </Button>
                              <button
                                onClick={() => handleToggleStaffActive(staff.id, staff.isActive)}
                                title={staff.isActive ? "Deactivate (keep past records)" : "Activate"}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  staff.isActive 
                                    ? 'border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                                    : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {staff.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pending Leave Requests Strip */}
          {leaveRequests.some(l => l.status === 'pending') && (
            <Card className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                  Pending Artisan Leave Requests Needing Review
                </h3>
              </div>
              <div className="space-y-2">
                {leaveRequests.filter(l => l.status === 'pending').map(req => {
                  const staff = staffList.find(s => s.id === req.staffProfileId);
                  return (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#1f1511] border border-amber-200/80 dark:border-amber-900/50 text-xs">
                      <div>
                        <span className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{staff?.displayName || 'Artisan'}</span>
                        <span className="text-[#806B5C] dark:text-[#a89582] ml-2">
                          {req.startDate} to {req.endDate} • {req.reason}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewLeave(req, 'rejected')}
                          className="text-[11px] px-2.5 py-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReviewLeave(req, 'approved')}
                          className="text-[11px] px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Approve Leave
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 2: CUSTOMERS TAB
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'customers' && (
        <div className="space-y-6">
          {/* Customer Segments Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#221612] rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21] text-xs">
            <button
              onClick={() => setActiveSegment('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'all'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              All Clients ({allCustomers.length})
            </button>
            <button
              onClick={() => setActiveSegment('highValue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'highValue'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B99470]" />
              VIP High Value ({segments.highValue.length})
            </button>
            <button
              onClick={() => setActiveSegment('frequent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'frequent'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              Frequent ({segments.frequent.length})
            </button>
            <button
              onClick={() => setActiveSegment('new')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'new'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              New Guests ({segments.new.length})
            </button>
            <button
              onClick={() => setActiveSegment('returning')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'returning'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              Returning ({segments.returning.length})
            </button>
            <button
              onClick={() => setActiveSegment('inactive')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSegment === 'inactive'
                  ? 'bg-[#41332B] text-white shadow-xs'
                  : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
              }`}
            >
              At Risk / Inactive ({segments.inactive.length})
            </button>
          </div>

          {/* Search & Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#806B5C]" />
              <input
                type="text"
                placeholder="Search clients by name, email, or phone..."
                value={customerSearchTerm}
                onChange={e => setCustomerSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#41332B]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs shrink-0 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
            >
              <Download className="w-3.5 h-3.5 text-[#B99470]" />
              Export Clientele CSV
            </Button>
          </div>

          {/* Customers Table */}
          <Card className="bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Client Dossier</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Visits</th>
                    <th className="py-3 px-4 font-semibold">Total Spend (INR)</th>
                    <th className="py-3 px-4 font-semibold">Last Visit</th>
                    <th className="py-3 px-4 font-semibold">Tier & Loyalty</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#806B5C] dark:text-[#a89582]">
                        No client records found under current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => {
                      const isVip = customer.totalSpent > 15000 || customer.totalAppointments >= 5;
                      return (
                        <tr key={customer.userId} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#E8D8C7] dark:bg-white/10 text-[#41332B] dark:text-[#f5eee6] flex items-center justify-center font-serif font-medium text-xs">
                                {customer.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-[#41332B] dark:text-[#f5eee6] flex items-center gap-1.5">
                                  {customer.fullName}
                                  {isVip && (
                                    <Badge variant="outline" className="text-[9px] py-0 border-[#B99470]/60 text-[#B99470] bg-[#B99470]/10">
                                      VIP
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">ID: {customer.userId.slice(0, 12)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-[#41332B] dark:text-[#f5eee6]">{customer.email}</p>
                            <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">{customer.phone || 'Phone unlisted'}</p>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                            {customer.totalAppointments} visits
                          </td>
                          <td className="py-3 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                            ₹{customer.totalSpent.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-[#806B5C] dark:text-[#a89582]">
                            {customer.lastVisitDate ? customer.lastVisitDate : 'None yet'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B99470]">
                              <Sparkles className="w-3 h-3" />
                              {customer.loyaltyPoints} pts
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setCustomerModalTab('overview');
                              }}
                              className="text-xs px-2.5 py-1 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
                            >
                              Client Dossier
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 1: 7-SECTION ARTISAN PROFILE DOSSIER
      ═════════════════════════════════════════════════════════════════════ */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl flex flex-col overflow-hidden text-left font-['Plus_Jakarta_Sans']">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#251a14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8D8C7] dark:bg-white/10 text-[#41332B] dark:text-[#f5eee6] flex items-center justify-center font-serif text-base font-semibold">
                  {selectedStaff.displayName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-light font-['Montserrat'] text-[#41332B] dark:text-[#f5eee6] flex items-center gap-2">
                    {selectedStaff.displayName}
                    <Badge variant="outline" className="text-[10px] border-[#B99470]/60 text-[#B99470]">
                      {selectedStaff.role || 'Artisan'}
                    </Badge>
                  </h3>
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582]">{selectedStaff.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 rounded-lg text-[#806B5C] hover:text-[#41332B] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal 7 Section Pills */}
            <div className="flex overflow-x-auto border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] px-4 pt-2 bg-white dark:bg-[#1f1511] text-xs gap-1">
              {[
                { id: 'overview', label: '1. Overview' },
                { id: 'services', label: '2. Services' },
                { id: 'hours', label: '3. Shift Hours' },
                { id: 'leave', label: '4. Leave History' },
                { id: 'commission', label: '5. Commission' },
                { id: 'performance', label: '6. Performance' },
                { id: 'status', label: '7. Operations Status' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStaffModalSection(tab.id as any)}
                  className={`pb-2 px-2.5 font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    staffModalSection === tab.id
                      ? 'border-[#41332B] dark:border-[#B99470] text-[#41332B] dark:text-[#f5eee6]'
                      : 'border-transparent text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content Sections */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Section 1: Overview */}
              {staffModalSection === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10">
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Assigned Branch</span>
                      <p className="font-medium text-[#41332B] dark:text-[#f5eee6] mt-0.5">
                        {branches.find(b => b.id === selectedStaff.branchId)?.name || 'Flagship'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Experience</span>
                      <p className="font-medium text-[#41332B] dark:text-[#f5eee6] mt-0.5">{selectedStaff.experienceYears || 4} Years</p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Client Rating</span>
                      <p className="font-medium text-[#41332B] dark:text-[#f5eee6] mt-0.5">★ {selectedStaff.rating.toFixed(2)} ({selectedStaff.reviewCount} verified reviews)</p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Status</span>
                      <p className="font-medium mt-0.5 text-emerald-600 dark:text-emerald-400">
                        {selectedStaff.isActive ? 'Active on Floor' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#41332B] dark:text-[#f5eee6] mb-1">Artisan Biography</h4>
                    <p className="text-[#806B5C] dark:text-[#a89582] leading-relaxed">
                      {selectedStaff.bio || 'Dedicated beauty specialist with mastery in custom color mixing, Balayage sculpting, and scalp restoration rituals.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Section 2: Services Offered */}
              {staffModalSection === 'services' && (
                <div className="space-y-3">
                  <p className="text-[#806B5C] dark:text-[#a89582]">
                    Rituals and treatments this artisan is qualified to perform in client bookings:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allServices.map(srv => {
                      const isAssigned = selectedStaff.servicesOffered.includes(srv.id);
                      return (
                        <div
                          key={srv.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            isAssigned
                              ? 'bg-[#FAF7F2] dark:bg-white/5 border-[#B99470]/60'
                              : 'bg-white dark:bg-[#1a120e] border-[#E8D8C7]/50 dark:border-white/5 opacity-60'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{srv.name}</p>
                            <p className="text-[10px] text-[#806B5C] dark:text-[#a89582]">₹{srv.price} • {srv.durationMinutes}m</p>
                          </div>
                          {isAssigned && <Check className="w-4 h-4 text-[#B99470]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Shift Hours */}
              {staffModalSection === 'hours' && (
                <div className="space-y-3">
                  <p className="text-[#806B5C] dark:text-[#a89582]">
                    Weekly operating schedule determining online booking slot availability:
                  </p>
                  <div className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5 border border-[#E8D8C7]/80 dark:border-white/10 rounded-xl overflow-hidden">
                    {staffWorkingHours.length === 0 ? (
                      <p className="p-4 text-center text-[#806B5C]">Default schedule applied (Mon-Sat, 09:00 - 19:00).</p>
                    ) : (
                      staffWorkingHours.map(wh => (
                        <div key={wh.id} className="p-3 flex items-center justify-between bg-white dark:bg-white/5">
                          <span className="font-medium capitalize text-[#41332B] dark:text-[#f5eee6]">{wh.dayOfWeek}</span>
                          <span className="text-[#806B5C] dark:text-[#a89582]">
                            {wh.isWorking ? `${wh.startTime} - ${wh.endTime}` : 'Off Day'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Section 4: Leave History */}
              {staffModalSection === 'leave' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[#806B5C] dark:text-[#a89582]">Historical and planned leave dates:</p>
                  </div>
                  {staffLeaveHistory.length === 0 ? (
                    <p className="p-4 text-center text-[#806B5C] bg-[#FAF7F2] dark:bg-white/5 rounded-xl">No leave requests recorded for this artisan.</p>
                  ) : (
                    <div className="space-y-2">
                      {staffLeaveHistory.map(lr => (
                        <div key={lr.id} className="p-3 rounded-lg border border-[#E8D8C7]/80 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{lr.startDate} to {lr.endDate}</span>
                            <p className="text-[11px] text-[#806B5C]">{lr.reason}</p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${
                            lr.status === 'approved' ? 'text-emerald-600 border-emerald-300' :
                            lr.status === 'rejected' ? 'text-red-600 border-red-300' : 'text-amber-600 border-amber-300'
                          }`}>
                            {lr.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Section 5: Commission & Ledger */}
              {staffModalSection === 'commission' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10">
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Commission Rate</span>
                      <p className="text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">{selectedStaff.commissionPercentage}%</p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Completed Rituals</span>
                      <p className="text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">
                        {staffAppointments.filter(a => a.status === 'completed').length}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Revenue Generated</span>
                      <p className="text-lg font-light text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ₹{staffAppointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">
                    Commissions are settled automatically per payroll cycle based on verified invoice payments.
                  </p>
                </div>
              )}

              {/* Section 6: Performance */}
              {staffModalSection === 'performance' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#806B5C] dark:text-[#a89582]">Punctuality & Chair Turnover</span>
                      <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">98.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#806B5C] dark:text-[#a89582]">Repeat Guest Request Rate</span>
                      <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">74%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#806B5C] dark:text-[#a89582]">Total Reviews Logged</span>
                      <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{selectedStaff.reviewCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 7: Operations Status */}
              {staffModalSection === 'status' && (
                <div className="space-y-4 p-4 rounded-xl border border-[#E8D8C7]/80 dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-[#41332B] dark:text-[#f5eee6]">Floor Availability & Booking Engine Status</h4>
                      <p className="text-[11px] text-[#806B5C] dark:text-[#a89582] mt-1 leading-relaxed">
                        Deactivating temporarily unlists this artisan from customer booking flows. All past appointments, customer formulas, and commission ledger records are permanently preserved.
                      </p>
                    </div>
                    <Button
                      variant={selectedStaff.isActive ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStaffActive(selectedStaff.id, selectedStaff.isActive)}
                      className={`text-xs shrink-0 ${selectedStaff.isActive ? 'text-stone-700 dark:text-stone-300' : 'bg-emerald-600 text-white'}`}
                    >
                      {selectedStaff.isActive ? 'Deactivate Artisan' : 'Activate Artisan'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21] bg-[#FAF7F2] dark:bg-[#251a14] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStaff(null)}
                className="text-xs"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 2: 8-SECTION CUSTOMER DOSSIER MODAL
      ═════════════════════════════════════════════════════════════════════ */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl flex flex-col overflow-hidden text-left font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#251a14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8D8C7] dark:bg-white/10 text-[#41332B] dark:text-[#f5eee6] flex items-center justify-center font-serif text-base font-semibold">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-light font-['Montserrat'] text-[#41332B] dark:text-[#f5eee6] flex items-center gap-2">
                    {selectedCustomer.fullName}
                    <Badge variant="outline" className="text-[10px] border-[#B99470]/60 text-[#B99470]">
                      VIP Client
                    </Badge>
                  </h3>
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582]">{selectedCustomer.email} • {selectedCustomer.phone || 'Phone unlisted'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-[#806B5C] hover:text-[#41332B] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 8 Tabs Header */}
            <div className="flex overflow-x-auto border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] px-4 pt-2 bg-white dark:bg-[#1f1511] text-xs gap-1">
              {[
                { id: 'overview', label: '1. Overview' },
                { id: 'appointments', label: '2. History' },
                { id: 'spend', label: '3. Spend' },
                { id: 'formula', label: '4. Formula Vault' },
                { id: 'preferences', label: '5. Preferences' },
                { id: 'notes', label: '6. Staff Notes' },
                { id: 'invoices', label: '7. Ledger' },
                { id: 'reviews', label: '8. Feedback' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCustomerModalTab(tab.id as any)}
                  className={`pb-2 px-2.5 font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    customerModalTab === tab.id
                      ? 'border-[#41332B] dark:border-[#B99470] text-[#41332B] dark:text-[#f5eee6]'
                      : 'border-transparent text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Tab 1: Overview */}
              {customerModalTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10">
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Total Visits</span>
                      <p className="text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">{selectedCustomer.totalAppointments}</p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Total Spent</span>
                      <p className="text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Loyalty Points</span>
                      <p className="text-lg font-light text-[#B99470] mt-0.5">{selectedCustomer.loyaltyPoints} pts</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-white/10 space-y-1.5">
                    <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">Registered Customer Profile</p>
                    <p className="text-[#806B5C] dark:text-[#a89582]">
                      Hair Type: {customerProfile?.hairType || 'Wavy / Fine Color-Treated'} • Skin Type: {customerProfile?.skinType || 'Sensitive / Normal'}
                    </p>
                    <p className="text-[#806B5C] dark:text-[#a89582]">
                      Emergency Contact: {customerProfile?.emergencyContact || '+91 98840 12345'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Appointment History */}
              {customerModalTab === 'appointments' && (
                <div className="space-y-2">
                  {customerAppointments.length === 0 ? (
                    <p className="p-4 text-center text-[#806B5C]">No appointment records found for this client.</p>
                  ) : (
                    customerAppointments.map(apt => (
                      <div key={apt.id} className="p-3 rounded-lg border border-[#E8D8C7]/80 dark:border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{apt.serviceName}</p>
                          <p className="text-[11px] text-[#806B5C]">{apt.appointmentDate} at {apt.startTime} • Artisan: {apt.staffName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">₹{apt.price}</p>
                          <Badge variant="outline" className="text-[9px] uppercase border-[#B99470]">
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Spend Analytics */}
              {customerModalTab === 'spend' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10">
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Average Ticket Value</span>
                      <p className="text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">
                        ₹{selectedCustomer.totalAppointments > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalAppointments).toLocaleString('en-IN') : 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#806B5C] dark:text-[#a89582]">Client Tier</span>
                      <p className="text-lg font-light text-[#B99470] mt-0.5">Platinum Haute</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Formula Vault */}
              {customerModalTab === 'formula' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-[#B99470]/40 bg-[#FAF7F2] dark:bg-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-[#41332B] dark:text-[#f5eee6] font-medium">
                      <Sparkles className="w-4 h-4 text-[#B99470]" />
                      Color Technical Sheet & Scalp Notes
                    </div>
                    <div>
                      <label className="text-[10px] text-[#806B5C] uppercase tracking-wider">Color Formula</label>
                      <input
                        type="text"
                        value={colorFormula}
                        onChange={e => setColorFormula(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-white dark:bg-[#1a120e] text-[#41332B] dark:text-[#f5eee6]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#806B5C] uppercase tracking-wider">Developer</label>
                        <input
                          type="text"
                          value={developerVol}
                          onChange={e => setDeveloperVol(e.target.value)}
                          className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-white dark:bg-[#1a120e] text-[#41332B] dark:text-[#f5eee6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#806B5C] uppercase tracking-wider">Processing Time</label>
                        <input
                          type="text"
                          value={processingTime}
                          onChange={e => setProcessingTime(e.target.value)}
                          className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-white dark:bg-[#1a120e] text-[#41332B] dark:text-[#f5eee6]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#806B5C] uppercase tracking-wider">Skin & Scalp Sensitivity</label>
                      <input
                        type="text"
                        value={skinSensitivities}
                        onChange={e => setSkinSensitivities(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-white dark:bg-[#1a120e] text-[#41332B] dark:text-[#f5eee6]"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => showToast('Formula Vault Updated', 'Technical color notes saved.')}
                      className="text-xs bg-[#41332B] text-white"
                    >
                      Save Formula Sheet
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 5: Preferences */}
              {customerModalTab === 'preferences' && (
                <div className="space-y-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10">
                  <div className="space-y-2">
                    <p className="text-[#806B5C] dark:text-[#a89582]">Beverage: <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">Iced Oat Latte / Sparkling Water with Lemon</span></p>
                    <p className="text-[#806B5C] dark:text-[#a89582]">Atmosphere: <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">Quiet Relaxation (Minimal Conversation Preferred)</span></p>
                    <p className="text-[#806B5C] dark:text-[#a89582]">Favorite Stylist: <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">Elena Vance</span></p>
                  </div>
                </div>
              )}

              {/* Tab 6: Staff Notes */}
              {customerModalTab === 'notes' && (
                <div className="space-y-3">
                  <form onSubmit={handleSaveCustomerNote} className="space-y-2">
                    <textarea
                      placeholder="Enter new confidential consultation or service note..."
                      rows={3}
                      value={newCustomerNote}
                      onChange={e => setNewCustomerNote(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-white dark:bg-[#1a120e] text-[#41332B] dark:text-[#f5eee6]"
                    />
                    <Button type="submit" variant="primary" size="sm" className="text-xs bg-[#41332B] text-white">
                      Add Note to Dossier
                    </Button>
                  </form>
                  <div className="p-3 rounded-lg border border-[#E8D8C7]/80 dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-xs text-[#806B5C] dark:text-[#a89582] whitespace-pre-line">
                    {customerProfile?.preferredNotes || selectedCustomer.notes || 'No historical staff notes recorded.'}
                  </div>
                </div>
              )}

              {/* Tab 7: Ledger & Invoices */}
              {customerModalTab === 'invoices' && (
                <div className="space-y-2">
                  {customerInvoices.length === 0 ? (
                    <p className="p-4 text-center text-[#806B5C]">No formal tax invoices on file for this guest.</p>
                  ) : (
                    customerInvoices.map(inv => (
                      <div key={inv.id} className="p-3 rounded-lg border border-[#E8D8C7]/80 dark:border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">Invoice #{inv.id}</p>
                          <p className="text-[11px] text-[#806B5C]">{inv.issuedAt} • GST: ₹{inv.taxAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">₹{inv.totalAmount}</p>
                          <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-300">
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 8: Feedback */}
              {customerModalTab === 'reviews' && (
                <div className="space-y-2">
                  {customerReviews.length === 0 ? (
                    <p className="p-4 text-center text-[#806B5C]">No public reviews submitted yet.</p>
                  ) : (
                    customerReviews.map(rev => (
                      <div key={rev.id} className="p-3 rounded-lg border border-[#E8D8C7]/80 dark:border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#806B5C]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#41332B] dark:text-[#f5eee6]">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21] bg-[#FAF7F2] dark:bg-[#251a14] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
                className="text-xs"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 3: ONBOARD ARTISAN DIALOG
      ═════════════════════════════════════════════════════════════════════ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6]">
                Onboard New Salon Artisan
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#806B5C] hover:text-[#41332B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteEmployee} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Krishnan"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="maya@glamoure.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Phone</label>
                  <input
                    type="text"
                    value={invitePhone}
                    onChange={e => setInvitePhone(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  >
                    <option value="Hairstylist">Hairstylist</option>
                    <option value="Beautician">Beautician</option>
                    <option value="Nail Artist">Nail Artist</option>
                    <option value="Spa Therapist">Spa Therapist</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Title</label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={e => setInviteTitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Branch Location</label>
                  <select
                    value={inviteBranchId}
                    onChange={e => setInviteBranchId(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Commission Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inviteCommission}
                    onChange={e => setInviteCommission(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#41332B] text-white hover:bg-[#2b1810]"
                >
                  Complete Onboarding
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
