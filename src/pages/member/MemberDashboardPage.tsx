import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Play, 
  Check, 
  TrendingUp, 
  Sparkles, 
  User, 
  Scissors, 
  ArrowRight,
  Coffee,
  Brain
} from 'lucide-react';
import { IntelligenceApi } from '../../intelligence/api/intelligenceApi';

export const MemberDashboardPage: React.FC = () => {
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

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return staffProfile ? db.getAppointmentsByStaff(staffProfile.id) : [];
  });

  const refreshData = () => {
    if (staffProfile) {
      setAppointments(db.getAppointmentsByStaff(staffProfile.id));
    }
  };

  const targetDate = '2026-11-17'; // Current system date

  // ═════════════════════════════════════════════════════════════════════════
  // ROLE-SCOPED ARTISAN METRICS
  // ═════════════════════════════════════════════════════════════════════════
  const todayAppointments = useMemo(() => {
    return appointments.filter(a => a.appointmentDate === targetDate && a.status !== 'cancelled');
  }, [appointments, targetDate]);

  const upcomingAppointments = useMemo(() => {
    return appointments.filter(a => a.appointmentDate >= targetDate && ['pending', 'confirmed'].includes(a.status));
  }, [appointments, targetDate]);

  const completedAppointments = useMemo(() => {
    return appointments.filter(a => a.status === 'completed');
  }, [appointments]);

  const workstationIntel = useMemo(() => {
    if (!staffProfile?.id) return null;
    return IntelligenceApi.getMemberWorkstation(staffProfile.id, targetDate);
  }, [staffProfile?.id, targetDate]);

  // Next appointment spotlight
  const nextAppointment = useMemo(() => {
    const activeOrUpcoming = appointments
      .filter(a => a.appointmentDate >= targetDate && ['confirmed', 'checked_in', 'in_progress'].includes(a.status))
      .sort((a, b) => `${a.appointmentDate} ${a.startTime}`.localeCompare(`${b.appointmentDate} ${b.startTime}`));
    return activeOrUpcoming[0] || null;
  }, [appointments, targetDate]);

  // Earnings & Commission
  const totalRevenueGenerated = useMemo(() => {
    return completedAppointments.reduce((acc, curr) => acc + curr.price, 0);
  }, [completedAppointments]);

  const commissionEarned = useMemo(() => {
    const rate = staffProfile?.commissionPercentage || 30;
    return Math.round((totalRevenueGenerated * rate) / 100);
  }, [totalRevenueGenerated, staffProfile]);

  // Status progression: checked_in -> in_progress -> completed
  const handleTransition = (aptId: string, toStatus: AppointmentStatus) => {
    if (!user) return;
    try {
      AppointmentService.updateStatus(aptId, toStatus, user, `Artisan ${staffProfile.displayName} transitioned ritual to ${toStatus}`);
      showToast('Status Transitioned', `Ritual is now ${toStatus.replace('_', ' ')}.`);
      refreshData();
    } catch (err: any) {
      showToast('Error', err.message);
    }
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B99470] font-semibold block mb-0.5">
            Artisan Workstation • Bay #02
          </span>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Welcome, {staffProfile?.displayName || user?.fullName || 'Marcus Reed'}
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            {staffProfile?.title || 'Master Colorist & Stylist'} • Today's client rituals, technical formula notes, and accrued commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/member/appointments">
            <Button variant="primary" size="sm" className="bg-[#41332B] hover:bg-[#2b1810] text-white text-xs px-3.5 py-1.5 rounded-xl cursor-pointer">
              My Appointments ({appointments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MEMBER OVERVIEW STATS (Section 8)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Today's Appointments */}
        <Card className="p-3.5 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820]">
          <div className="flex items-center justify-between text-[#806B5C] dark:text-[#a89582] text-[10px] font-semibold uppercase tracking-wider">
            <span>Today's Clients</span>
            <Calendar className="w-3.5 h-3.5 text-[#B99470]" />
          </div>
          <p className="font-['Montserrat'] text-xl font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">
            {todayAppointments.length} <span className="text-xs text-[#806B5C] font-normal">rituals</span>
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            {todayAppointments.filter(a => a.status === 'completed').length} completed
          </p>
        </Card>

        {/* 2. Current Working Hours */}
        <Card className="p-3.5 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820]">
          <div className="flex items-center justify-between text-[#806B5C] dark:text-[#a89582] text-[10px] font-semibold uppercase tracking-wider">
            <span>Shift Hours</span>
            <Clock className="w-3.5 h-3.5 text-[#B99470]" />
          </div>
          <p className="font-['Montserrat'] text-xl font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-mono">
            09:00 - 18:00
          </p>
          <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] mt-0.5">1h midday break allocated</p>
        </Card>

        {/* 3. Completed Rituals */}
        <Card className="p-3.5 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820]">
          <div className="flex items-center justify-between text-[#806B5C] dark:text-[#a89582] text-[10px] font-semibold uppercase tracking-wider">
            <span>Completed Rituals</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="font-['Montserrat'] text-xl font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">
            {completedAppointments.length}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5">5.0★ verified guest rating</p>
        </Card>

        {/* 4. Commission & Earnings */}
        <Card className="p-3.5 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820]">
          <div className="flex items-center justify-between text-[#806B5C] dark:text-[#a89582] text-[10px] font-semibold uppercase tracking-wider">
            <span>Earned Commission</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#B99470]" />
          </div>
          <p className="font-['Montserrat'] text-xl font-light text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            ₹{commissionEarned.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#806B5C] mt-0.5">{staffProfile?.commissionPercentage || 30}% contract tier</p>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NEXT APPOINTMENT SPOTLIGHT (HERO CARD)
      ═══════════════════════════════════════════════════════════════ */}
      {nextAppointment ? (
        <Card className="p-5 bg-gradient-to-r from-[#FAF7F2] to-[#F5EFE7] dark:from-[#201511] dark:to-[#2a1a15] border border-[#B99470]/60 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#B99470] font-bold">
                Next Ritual in Styling Bay
              </span>
            </div>

            <Badge
              variant="outline"
              className="capitalize text-xs font-semibold px-2.5 py-0.5 border-[#B99470] text-[#B99470]"
            >
              {nextAppointment.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="font-['Montserrat'] text-xl font-light text-[#41332B] dark:text-[#f5eee6]">
                {nextAppointment.customerName}
              </h2>
              <p className="text-xs text-[#B99470] font-medium mt-0.5">
                {nextAppointment.serviceName} ({nextAppointment.durationMinutes} mins)
              </p>
              <p className="text-[11px] text-[#806B5C] dark:text-[#a89582] mt-0.5">
                Scheduled: {nextAppointment.appointmentDate} • {nextAppointment.startTime} - {nextAppointment.endTime}
              </p>
              {nextAppointment.notes && (
                <p className="text-xs text-[#806B5C] dark:text-[#c2b3a3] italic mt-2 bg-white/60 dark:bg-black/20 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/5">
                  Guest Notes: "{nextAppointment.notes}"
                </p>
              )}
            </div>

            {/* Quick Action Progression */}
            <div className="flex items-center gap-2 shrink-0">
              {nextAppointment.status === 'confirmed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleTransition(nextAppointment.id, 'checked_in')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded-xl"
                >
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  <span>Check In Guest</span>
                </Button>
              )}

              {nextAppointment.status === 'checked_in' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleTransition(nextAppointment.id, 'in_progress')}
                  className="bg-[#41332B] hover:bg-[#2b1810] text-white text-xs px-3.5 py-1.5 rounded-xl"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  <span>Commence Ritual</span>
                </Button>
              )}

              {nextAppointment.status === 'in_progress' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleTransition(nextAppointment.id, 'completed')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded-xl"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>Complete Ritual</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820]">
          <Coffee className="w-6 h-6 text-[#806B5C] mx-auto mb-1.5 opacity-60" />
          <p className="text-sm font-medium text-[#41332B] dark:text-[#f5eee6]">Station is in Repose</p>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">No active ritual client in bay right now. Prepare color formulations for upcoming bookings.</p>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          AI WORKSTATION INTELLIGENCE
      ═══════════════════════════════════════════════════════════════ */}
      {workstationIntel && (
        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#E8D8C7]/60 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] dark:bg-[#41332b] text-[#41332B] dark:text-[#efc9a5] flex items-center justify-center border border-[#E8D8C7] dark:border-transparent">
                <Brain className="w-4 h-4 text-[#B99470]" />
              </div>
              <div>
                <h4 className="font-['Montserrat'] text-xs font-medium text-[#41332B] dark:text-[#f5eee6]">
                  Artisan Station Intelligence
                </h4>
                <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">
                  Status: <span className="text-[#B99470] uppercase font-semibold">{workstationIntel.workstationStatus}</span> · Daily Efficiency: <span className="text-emerald-600 font-mono font-semibold">{workstationIntel.efficiencyScore}%</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-white/5 text-[#806B5C] dark:text-[#a89582] border border-[#E8D8C7] dark:border-white/10">
              Personal Rating: {workstationIntel.personalRating}★
            </span>
          </div>

          <div className="space-y-1 pt-1 text-xs">
            <span className="text-[10px] text-[#806B5C] dark:text-[#a89582] block uppercase tracking-wider font-semibold">Suggested Station Preparation</span>
            <ul className="text-xs text-[#41332B] dark:text-[#f5eee6] space-y-1 list-disc list-inside">
              {workstationIntel.suggestedPrep.map((prep, idx) => (
                <li key={idx} className="text-[#806B5C] dark:text-[#f5eee6]/90">{prep}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TODAY'S APPOINTMENT ROSTER
      ═══════════════════════════════════════════════════════════════ */}
      <Card className="p-5 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#3a2820] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8D8C7]/60 dark:border-white/10">
          <div>
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Today's Ritual Stream ({todayAppointments.length})
            </h3>
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">Chronological chair progression for {targetDate}</p>
          </div>
          <Link to="/member/appointments" className="text-xs text-[#B99470] hover:underline flex items-center gap-1 font-semibold">
            <span>View All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {todayAppointments.length === 0 ? (
            <p className="text-xs text-[#806B5C] py-4 text-center italic">No further rituals scheduled for today.</p>
          ) : (
            todayAppointments.map(apt => (
              <div
                key={apt.id}
                className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/[0.02] border border-[#E8D8C7]/60 dark:border-white/5 flex items-center justify-between gap-3 hover:border-[#B99470]/60 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-lg bg-[#E8D8C7]/60 dark:bg-[#41332B] text-[#41332B] dark:text-[#f5eee6] font-mono text-xs font-semibold shrink-0">
                    {apt.startTime}
                  </div>
                  <div>
                    <p className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{apt.customerName}</p>
                    <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">{apt.serviceName} ({apt.durationMinutes}m)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="capitalize text-[10px]"
                  >
                    {apt.status.replace('_', ' ')}
                  </Badge>

                  {apt.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTransition(apt.id, 'checked_in')}
                      className="text-[11px] px-2.5 py-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    >
                      Check In
                    </Button>
                  )}
                  {apt.status === 'checked_in' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleTransition(apt.id, 'in_progress')}
                      className="text-[11px] px-2.5 py-1 bg-[#41332B] text-white"
                    >
                      Start
                    </Button>
                  )}
                  {apt.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleTransition(apt.id, 'completed')}
                      className="text-[11px] px-2.5 py-1 bg-emerald-600 text-white"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
