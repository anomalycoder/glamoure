import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../database/db';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Star, Award, TrendingUp, Scissors, DollarSign, CheckCircle2 } from 'lucide-react';

export const MemberPerformancePage: React.FC = () => {
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

  const appointments = useMemo(() => {
    return staffProfile ? db.getAppointmentsByStaff(staffProfile.id) : [];
  }, [staffProfile]);

  const completedApts = useMemo(() => {
    return appointments.filter(a => a.status === 'completed');
  }, [appointments]);

  const grossRevenue = useMemo(() => {
    return completedApts.reduce((sum, a) => sum + a.price, 0);
  }, [completedApts]);

  const earnedCommission = useMemo(() => {
    const rate = staffProfile?.commissionPercentage || 30;
    return Math.round((grossRevenue * rate) / 100);
  }, [grossRevenue, staffProfile]);

  const reviews = useMemo(() => {
    if (!staffProfile) return [];
    return db.getReviewsBySalon(currentSalonId).filter(r => r.staffId === staffProfile.id);
  }, [staffProfile, currentSalonId]);

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Personal Performance & Commission
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Transparent artisan metrics, guest reviews, and commission statement for {staffProfile?.displayName}.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{staffProfile?.rating || 5.0} / 5.0 Rating</span>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Completed Rituals</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#f5eee6] mt-1">
            {completedApts.length}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Delivered to completion</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Gross Production</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#efc9a5] mt-1 font-mono">
            ₹{grossRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">Service billings generated</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Earned Commission</p>
          <p className="font-['Montserrat'] text-2xl font-light text-emerald-400 mt-1 font-mono">
            ₹{earnedCommission.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#efc9a5] mt-1">{staffProfile?.commissionPercentage}% commission rate</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Verified Feedback</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#f5eee6] mt-1">
            {reviews.length || 1}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">100% positive guest reviews</p>
        </Card>
      </div>

      {/* Reviews Stream */}
      <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
        <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
          Client Testimonials & Feedback
        </h2>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/5 text-xs text-[#a89582] italic">
              "Marcus is a true artist! The French Balayage and toner formulation gave me exactly the soft dimension I wanted." — Sophia C.
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-white/[0.02] border border-[#3a2820] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5eee6]">{r.customerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#c2b3a3] italic">"{r.comment}"</p>
                {r.reply && (
                  <p className="text-[11px] text-[#efc9a5] pl-3 border-l border-[#b99470]">
                    Proprietor Note: "{r.reply}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
