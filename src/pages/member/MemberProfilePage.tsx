import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Scissors, Star, Save, Sparkles, Award } from 'lucide-react';

export const MemberProfilePage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const staffProfile: StaffProfile = useMemo(() => {
    if (user?.id) {
      const found = db.getStaffByUserId(user.id, currentSalonId);
      if (found) return found;
    }
    const defaultStaff = db.getStaffBySalon(currentSalonId);
    return defaultStaff[0];
  }, [user?.id, currentSalonId]);

  const [title, setTitle] = useState(staffProfile?.title || 'Master Colorist & Stylist');
  const [bio, setBio] = useState(staffProfile?.bio || 'Trained in Paris and Milan. Specialist in balayage, corrective color, and botanical scalp rejuvenation.');
  const [experienceYears, setExperienceYears] = useState(staffProfile?.experienceYears || 8);
  const [specialties, setSpecialties] = useState('French Balayage, Lived-in Blonde, Botanical Scalp Facials');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffProfile) return;

    db.updateStaffProfile(staffProfile.id, {
      title,
      bio,
      experienceYears: Number(experienceYears),
      specialties: specialties.split(',').map(s => s.trim()),
    });

    showToast('Profile Saved', 'Artisan credentials & public biography refreshed.');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Artisan Biography & Credentials
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Public portfolio biography, certifications, and ritual specialties displayed in client exploration.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#41332b] text-[#efc9a5] text-xs font-semibold border border-[#b99470]/30">
          <Award className="w-4 h-4 text-[#b99470]" />
          <span>Senior Certified Specialist</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Preview */}
        <Card className="p-6 bg-[#201511] border-[#3a2820] text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#41332b] text-[#efc9a5] font-semibold text-2xl flex items-center justify-center mx-auto border-2 border-[#b99470]/50 shadow-lg">
            {staffProfile?.displayName?.charAt(0) || 'M'}
          </div>

          <div>
            <h2 className="font-['Montserrat'] text-lg font-light text-[#f5eee6]">
              {staffProfile?.displayName || user?.fullName || 'Marcus Reed'}
            </h2>
            <p className="text-xs text-[#b99470] font-semibold mt-0.5">{title}</p>
            <p className="text-[11px] text-[#a89582]">{user?.email || 'marcus.reed@glamoure.com'}</p>
          </div>

          <div className="flex items-center justify-center gap-1 text-xs text-amber-300 font-bold pt-2 border-t border-white/5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{staffProfile?.rating || 5.0} / 5.0</span>
            <span className="text-[#a89582] font-normal">({staffProfile?.reviewCount || 12} reviews)</span>
          </div>

          <div className="text-left text-xs bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#efc9a5] block">Specialties</span>
            <p className="text-[#c2b3a3] text-[11px]">{specialties}</p>
          </div>
        </Card>

        {/* Configuration Form */}
        <Card className="p-6 bg-[#201511] border-[#3a2820] md:col-span-2 space-y-4">
          <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6] pb-2 border-b border-white/10">
            Edit Artisan Dossier
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Professional Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <div>
              <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Experience (Years)</label>
              <input
                type="number"
                min="1"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <div>
              <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Core Specialties (Comma separated)</label>
              <input
                type="text"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <div>
              <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Editorial Biography</label>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] leading-relaxed focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Credentials</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
