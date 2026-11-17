import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../database/db';
import type { Appointment } from '../../types/appointment';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ChevronLeft, ChevronRight, Clock, User, Scissors, Calendar as CalendarIcon } from 'lucide-react';

export const MemberCalendarPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const staffProfile: StaffProfile = useMemo(() => {
    if (user?.id) {
      const found = db.getStaffByUserId(user.id, currentSalonId);
      if (found) return found;
    }
    const defaultStaff = db.getStaffBySalon(currentSalonId);
    return defaultStaff[0];
  }, [user?.id, currentSalonId]);

  const [selectedDate, setSelectedDate] = useState('2026-11-17');

  const appointments = useMemo(() => {
    return staffProfile ? db.getAppointmentsByStaff(staffProfile.id) : [];
  }, [staffProfile]);

  const dayAppointments = useMemo(() => {
    return appointments.filter(a => a.appointmentDate === selectedDate && a.status !== 'cancelled');
  }, [appointments, selectedDate]);

  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Station Timeline Calendar
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Personal appointment schedule across styling bays for {staffProfile?.displayName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
          />
        </div>
      </div>

      {/* Hourly Schedule View */}
      <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="font-semibold text-xs text-[#efc9a5]">
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-[#a89582]">{dayAppointments.length} bookings today</span>
        </div>

        <div className="divide-y divide-white/5">
          {hours.map(hour => {
            const aptAtHour = dayAppointments.find(a => a.startTime.startsWith(hour.slice(0, 2)));

            return (
              <div key={hour} className="py-3 flex items-start gap-4">
                <span className="font-mono text-xs text-[#a89582] w-14 shrink-0 pt-1">
                  {hour}
                </span>

                <div className="flex-1 min-h-[48px]">
                  {aptAtHour ? (
                    <div className="p-3 rounded-xl bg-[#41332b]/80 border border-[#b99470]/40 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#efc9a5]">{aptAtHour.customerName}</p>
                        <p className="text-[11px] text-[#f5eee6]">{aptAtHour.serviceName} ({aptAtHour.startTime} - {aptAtHour.endTime})</p>
                      </div>
                      <Badge
                        variant={aptAtHour.status === 'completed' ? 'success' : aptAtHour.status === 'in_progress' ? 'default' : 'outline'}
                        className="text-[10px] capitalize"
                      >
                        {aptAtHour.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ) : (
                    <div className="h-10 rounded-lg border border-dashed border-white/5 flex items-center px-3 text-[11px] text-[#a89582]/40">
                      Station available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
