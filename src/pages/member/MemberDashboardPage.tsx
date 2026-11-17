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
  // SECTION 8 SPECIFIED METRICS
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#b99470] font-semibold block mb-1">
            Artisan Station • Chair Bay #02
          </span>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Welcome, {staffProfile?.displayName || user?.fullName || 'Marcus Reed'}
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            {staffProfile?.title || 'Master Colorist & Stylist'} • Today's client rituals, formula stations, and earned commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/member/appointments">
            <Button className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer">
              My Appointments ({appointments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MEMBER OVERVIEW STATS (Section 8)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Appointments */}
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <div className="flex items-center justify-between text-[#a89582] text-[11px] font-semibold uppercase tracking-wider">
            <span>Today's Clients</span>
            <Calendar className="w-4 h-4 text-[#efc9a5]" />
          </div>
          <p className="font-['Montserrat'] text-2xl font-light text-[#efc9a5] mt-1">
            {todayAppointments.length} <span className="text-xs text-[#a89582] font-normal">rituals</span>
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">
            {todayAppointments.filter(a => a.status === 'completed').length} completed
          </p>
        </Card>

        {/* 2. Current Working Hours */}
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <div className="flex items-center justify-between text-[#a89582] text-[11px] font-semibold uppercase tracking-wider">
            <span>Working Shift</span>
            <Clock className="w-4 h-4 text-[#efc9a5]" />
          </div>
          <p className="font-['Montserrat'] text-2xl font-light text-[#f5eee6] mt-1 font-mono">
            09:00 - 18:00
          </p>
          <p className="text-[10px] text-[#efc9a5] mt-1">1h midday lunch break scheduled</p>
        </Card>

        {/* 3. Completed Rituals */}
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <div className="flex items-center justify-between text-[#a89582] text-[11px] font-semibold uppercase tracking-wider">
            <span>Completed Rituals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-['Montserrat'] text-2xl font-light text-[#f5eee6] mt-1">
            {completedAppointments.length}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">100% guest satisfaction rating</p>
        </Card>

        {/* 4. Commission & Earnings */}
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <div className="flex items-center justify-between text-[#a89582] text-[11px] font-semibold uppercase tracking-wider">
            <span>Earned Commission</span>
            <TrendingUp className="w-4 h-4 text-[#efc9a5]" />
          </div>
          <p className="font-['Montserrat'] text-2xl font-light text-[#efc9a5] mt-1 font-mono">
            ₹{commissionEarned.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">{staffProfile?.commissionPercentage}% contract tier</p>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NEXT APPOINTMENT SPOTLIGHT (HERO CARD)
      ═══════════════════════════════════════════════════════════════ */}
      {nextAppointment ? (
        <Card className="p-6 bg-gradient-to-r from-[#201511] to-[#2a1a15] border border-[#b99470]/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#b99470] font-bold">
                Next Appointment in Styling Bay
              </span>
            </div>

            <Badge
              variant={
                nextAppointment.status === 'in_progress' ? 'default' :
                nextAppointment.status === 'checked_in' ? 'info' : 'outline'
              }
              className="capitalize text-xs font-semibold px-3 py-1"
            >
              {nextAppointment.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="font-['Montserrat'] text-xl font-light text-[#f5eee6]">
                {nextAppointment.customerName}
              </h2>
              <p className="text-xs text-[#efc9a5] font-medium mt-1">
                {nextAppointment.serviceName} ({nextAppointment.durationMinutes} mins)
              </p>
              <p className="text-[11px] text-[#a89582] mt-0.5">
                Scheduled: {nextAppointment.appointmentDate} • {nextAppointment.startTime} - {nextAppointment.endTime}
              </p>
              {nextAppointment.notes && (
                <p className="text-xs text-[#c2b3a3] italic mt-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                  Guest Notes: "{nextAppointment.notes}"
                </p>
              )}
            </div>

            {/* Quick Action Progression */}
            <div className="flex items-center gap-2.5 shrink-0">
              {nextAppointment.status === 'confirmed' && (
                <Button
                  onClick={() => handleTransition(nextAppointment.id, 'checked_in')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl"
                >
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  <span>Check In Guest</span>
                </Button>
              )}

              {nextAppointment.status === 'checked_in' && (
                <Button
                  onClick={() => handleTransition(nextAppointment.id, 'in_progress')}
                  className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  <span>Commence Ritual</span>
                </Button>
              )}

              {nextAppointment.status === 'in_progress' && (
                <Button
                  onClick={() => handleTransition(nextAppointment.id, 'completed')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>Complete Ritual</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center bg-[#201511] border-[#3a2820]">
          <Coffee className="w-8 h-8 text-[#a89582] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-[#f5eee6]">Bay is in Repose</p>
          <p className="text-xs text-[#a89582] mt-1">No pending or active ritual clients right now. Enjoy your preparation time.</p>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          AI WORKSTATION INTELLIGENCE
      ═══════════════════════════════════════════════════════════════ */}
      {workstationIntel && (
        <Card className="p-5 bg-[#201511] border-[#3a2820] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#41332b] text-[#efc9a5] flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#efc9a5]" />
              </div>
              <div>
                <h4 className="font-['Montserrat'] text-sm font-medium text-[#f5eee6]">
                  Artisan Workstation Intelligence
                </h4>
                <p className="text-[11px] text-[#a89582]">
                  Bay Status: <span className="text-[#efc9a5] uppercase font-semibold">{workstationIntel.workstationStatus}</span> · Daily Efficiency: <span className="text-emerald-400 font-mono font-semibold">{workstationIntel.efficiencyScore}%</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-[#a89582] border border-white/10">
              Personal Rating: {workstationIntel.personalRating}★
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#a89582] block uppercase tracking-wider font-semibold">Suggested Station Preparation</span>
            <ul className="text-xs text-[#f5eee6] space-y-1 list-disc list-inside">
              {workstationIntel.suggestedPrep.map((prep, idx) => (
                <li key={idx} className="text-[#f5eee6]/90">{prep}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TODAY'S APPOINTMENT ROSTER
      ═══════════════════════════════════════════════════════════════ */}
      <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
              Today's Ritual Stream ({todayAppointments.length})
            </h3>
            <p className="text-xs text-[#a89582]">Chronological chair progression for {targetDate}</p>
          </div>
          <Link to="/member/appointments" className="text-xs text-[#b99470] hover:text-[#efc9a5] flex items-center gap-1 font-semibold">
            <span>View All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {todayAppointments.length === 0 ? (
            <p className="text-xs text-[#a89582] py-4 text-center italic">No further rituals scheduled for today.</p>
          ) : (
            todayAppointments.map(apt => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:border-[#b99470]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-[#41332b] text-[#efc9a5] font-mono text-xs font-semibold shrink-0">
                    {apt.startTime}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f5eee6]">{apt.customerName}</p>
                    <p className="text-[11px] text-[#a89582]">{apt.serviceName} ({apt.durationMinutes}m)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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

                  {apt.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => handleTransition(apt.id, 'checked_in')}
                      className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-emerald-950/40 text-emerald-400"
                    >
                      Check In
                    </Button>
                  )}
                  {apt.status === 'checked_in' && (
                    <Button
                      size="sm"
                      onClick={() => handleTransition(apt.id, 'in_progress')}
                      className="text-[11px] px-2.5 py-1 bg-[#41332b] text-[#efc9a5]"
                    >
                      Start
                    </Button>
                  )}
                  {apt.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleTransition(apt.id, 'completed')}
                      className="text-[11px] px-2.5 py-1 bg-emerald-700 text-white"
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
