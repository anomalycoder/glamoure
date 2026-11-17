import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Salon, SalonBranch } from '../../types/salon';
import type { Appointment } from '../../types/appointment';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  Building, 
  Sliders, 
  Save, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Plus, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface HolidayClosure {
  id: string;
  name: string;
  date: string;
  branchId: string;
}

export const OwnerSettingsPage: React.FC = () => {
  const { salonId, user } = useAuth();
  const { activeBranchId, isBranchMatch } = useBranch();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'closures'>('profile');

  // Atelier Profile Form
  const [formData, setFormData] = useState({
    name: 'Glamouré Haute Beauté',
    phone: '+91 98840 12345',
    email: 'concierge@glamoure.com',
    address: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    country: 'India',
    description: 'Premier sanctuary for bespoke hair sculpting, organic botanical rituals, and editorial beauty.',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    allowOnlineBooking: true,
    requireDeposit: true,
    depositPercentage: 20,
    cancellationNoticeHours: 24,
    autoConfirmAppointments: false,
    bufferMinutesBetweenAppointments: 15,
    minAdvanceNoticeHours: 2,
    maxAdvanceBookingDays: 60,
    taxRatePercentage: 18,
  });

  // Operating Hours State
  const [operatingHours, setOperatingHours] = useState([
    { day: 'Monday', dayIndex: 1, open: '09:00', close: '20:00', isOpen: true },
    { day: 'Tuesday', dayIndex: 2, open: '09:00', close: '20:00', isOpen: true },
    { day: 'Wednesday', dayIndex: 3, open: '09:00', close: '20:00', isOpen: true },
    { day: 'Thursday', dayIndex: 4, open: '09:00', close: '20:00', isOpen: true },
    { day: 'Friday', dayIndex: 5, open: '09:00', close: '21:00', isOpen: true },
    { day: 'Saturday', dayIndex: 6, open: '08:30', close: '21:00', isOpen: true },
    { day: 'Sunday', dayIndex: 0, open: '10:00', close: '19:00', isOpen: true },
  ]);

  // Holiday Closures
  const [closures, setClosures] = useState<HolidayClosure[]>([
    { id: 'hol-1', name: 'Annual Atelier Deep Sanitization', date: '2026-12-25', branchId: 'all' },
    { id: 'hol-2', name: 'New Year Day', date: '2027-01-01', branchId: 'all' },
  ]);

  const [newClosureName, setNewClosureName] = useState('');
  const [newClosureDate, setNewClosureDate] = useState('2026-11-20');

  const branches = useMemo(() => db.getBranchesBySalon(currentSalonId), [currentSalonId]);
  const appointments = useMemo(() => db.getAppointmentsBySalon(currentSalonId), [currentSalonId]);

  // Schedule impact checker on proposed holiday closure
  const affectedAppointments = useMemo(() => {
    if (!newClosureDate) return [];
    return appointments.filter(a => a.appointmentDate === newClosureDate && a.status !== 'cancelled');
  }, [appointments, newClosureDate]);

  useEffect(() => {
    const s = db.getSalonById(currentSalonId);
    if (s) {
      setFormData(prev => ({
        ...prev,
        name: s.name || prev.name,
        phone: s.phone || prev.phone,
        email: s.email || prev.email,
        address: s.address || prev.address,
        city: s.city || prev.city,
        country: s.country || prev.country,
        description: s.description || prev.description,
        allowOnlineBooking: s.settings?.allowOnlineBooking ?? prev.allowOnlineBooking,
        requireDeposit: s.settings?.requireDeposit ?? prev.requireDeposit,
        depositPercentage: s.settings?.depositPercentage ?? prev.depositPercentage,
        cancellationNoticeHours: s.settings?.cancellationNoticeHours ?? prev.cancellationNoticeHours,
        bufferMinutesBetweenAppointments: s.settings?.bufferMinutesBetweenAppointments ?? prev.bufferMinutesBetweenAppointments,
        autoConfirmAppointments: s.settings?.autoConfirmAppointments ?? prev.autoConfirmAppointments,
      }));
    }
  }, [currentSalonId]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const current = db.getSalonById(currentSalonId);
      db.updateSalon(currentSalonId, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        description: formData.description,
        currency: formData.currency,
        timezone: formData.timezone,
        settings: {
          ...current?.settings,
          allowOnlineBooking: formData.allowOnlineBooking,
          requireDeposit: formData.requireDeposit,
          depositPercentage: Number(formData.depositPercentage),
          cancellationNoticeHours: Number(formData.cancellationNoticeHours),
          bufferMinutesBetweenAppointments: Number(formData.bufferMinutesBetweenAppointments),
          autoConfirmAppointments: formData.autoConfirmAppointments,
          businessHours: operatingHours.map(h => ({
            dayOfWeek: h.dayIndex,
            open: h.open,
            close: h.close,
            isOpen: h.isOpen
          })),
        },
      });

      showToast('Settings Saved', 'Atelier configurations and booking policies successfully updated.');
    } catch (err: any) {
      showToast('Save Error', err.message);
    }
  };

  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosureName.trim() || !newClosureDate) return;

    const newClosure: HolidayClosure = {
      id: `hol-${Date.now()}`,
      name: newClosureName.trim(),
      date: newClosureDate,
      branchId: activeBranchId,
    };

    setClosures([...closures, newClosure]);
    showToast(
      'Closure Scheduled',
      `${newClosure.name} on ${newClosure.date} recorded. ${affectedAppointments.length} existing bookings flagged.`
    );
    setNewClosureName('');
  };

  const handleDeleteClosure = (id: string) => {
    setClosures(closures.filter(c => c.id !== id));
    showToast('Closure Removed', 'Temporary closure removed.');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER & SUB-NAV TABS
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Salon Settings & Scheduling Policies
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Operational rules, branch operating hours, temporary closures with conflict impact detection, and booking limits.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            Atelier Profile & Policies
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'hours'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            Operating Hours & Buffers
          </button>
          <button
            onClick={() => setActiveTab('closures')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'closures'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            Holidays & Impact Check
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: ATELIER PROFILE & FISCAL POLICIES
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
              <Building className="w-4 h-4 text-[#B99470]" />
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                General Atelier Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Salon Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Official Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Concierge Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Currency & Settlement</label>
                <input
                  type="text"
                  disabled
                  value="INR (₹) - Indian Rupee"
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7]/60 dark:border-white/10 bg-[#FAF7F2]/50 dark:bg-white/5 text-[#806B5C]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Address Line</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">City & State</label>
                <input
                  type="text"
                  value={`${formData.city}, Telangana`}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-[#41332B] dark:text-[#f5eee6] text-xs">Editorial Brand Story</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-xs text-[#41332B] dark:text-[#f5eee6]"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
              <Sliders className="w-4 h-4 text-[#B99470]" />
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                Reservation, Deposit & Cancellation Rules
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowOnlineBooking}
                    onChange={e => setFormData({ ...formData, allowOnlineBooking: e.target.checked })}
                    className="mt-0.5 rounded border-[#E8D8C7] text-[#41332B]"
                  />
                  <div>
                    <span className="font-medium text-[#41332B] dark:text-[#f5eee6] block">Enable Online Guest Booking</span>
                    <span className="text-[#806B5C] dark:text-[#a89582] text-[11px]">Allow guests to reserve time slots directly via portal.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requireDeposit}
                    onChange={e => setFormData({ ...formData, requireDeposit: e.target.checked })}
                    className="mt-0.5 rounded border-[#E8D8C7] text-[#41332B]"
                  />
                  <div>
                    <span className="font-medium text-[#41332B] dark:text-[#f5eee6] block">Require Advance Deposit</span>
                    <span className="text-[#806B5C] dark:text-[#a89582] text-[11px]">Collect security token upon booking to minimize no-shows.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoConfirmAppointments}
                    onChange={e => setFormData({ ...formData, autoConfirmAppointments: e.target.checked })}
                    className="mt-0.5 rounded border-[#E8D8C7] text-[#41332B]"
                  />
                  <div>
                    <span className="font-medium text-[#41332B] dark:text-[#f5eee6] block">Auto-Confirm Eligible Bookings</span>
                    <span className="text-[#806B5C] dark:text-[#a89582] text-[11px]">Bypass pending review for verified returning guests.</span>
                  </div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Deposit Percentage (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.depositPercentage}
                    onChange={e => setFormData({ ...formData, depositPercentage: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Cancellation Notice Window (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={formData.cancellationNoticeHours}
                    onChange={e => setFormData({ ...formData, cancellationNoticeHours: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Statutory GST Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRatePercentage}
                    disabled
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7]/60 dark:border-white/10 bg-[#FAF7F2]/50 dark:bg-white/5 text-[#806B5C]"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Save Atelier Configuration
            </Button>
          </div>
        </form>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: OPERATING HOURS & SCHEDULING LIMITS
      ═════════════════════════════════════════════ */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
              <div>
                <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                  Weekly Atelier Operating Hours
                </h2>
                <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                  Sets the master schedule boundary for staff availability and online customer booking slots.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5 text-xs">
              {operatingHours.map((oh, idx) => (
                <div key={oh.day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-32 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={oh.isOpen}
                      onChange={e => {
                        const updated = [...operatingHours];
                        updated[idx].isOpen = e.target.checked;
                        setOperatingHours(updated);
                      }}
                      className="rounded border-[#E8D8C7] text-[#41332B]"
                    />
                    <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{oh.day}</span>
                  </div>

                  {oh.isOpen ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={oh.open}
                        onChange={e => {
                          const updated = [...operatingHours];
                          updated[idx].open = e.target.value;
                          setOperatingHours(updated);
                        }}
                        className="p-1.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                      />
                      <span className="text-[#806B5C]">to</span>
                      <input
                        type="time"
                        value={oh.close}
                        onChange={e => {
                          const updated = [...operatingHours];
                          updated[idx].close = e.target.value;
                          setOperatingHours(updated);
                        }}
                        className="p-1.5 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                      />
                    </div>
                  ) : (
                    <span className="text-[#806B5C] italic">Closed for Deep Atelier Reset</span>
                  )}

                  <Badge variant="outline" className="text-[10px] w-20 text-center">
                    {oh.isOpen ? 'Active' : 'Closed'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-4">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Buffer Times & Booking Advance Limits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Chair Prep Buffer (Mins)</label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={formData.bufferMinutesBetweenAppointments}
                  onChange={e => setFormData({ ...formData, bufferMinutesBetweenAppointments: Number(e.target.value) })}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
                <p className="text-[10px] text-[#806B5C] mt-1">Automatic station sanitation window between appointments.</p>
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Min Advance Notice (Hours)</label>
                <input
                  type="number"
                  min={1}
                  value={formData.minAdvanceNoticeHours}
                  onChange={e => setFormData({ ...formData, minAdvanceNoticeHours: Number(e.target.value) })}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
                <p className="text-[10px] text-[#806B5C] mt-1">Prevents last-minute bookings without artisan prep.</p>
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Max Future Window (Days)</label>
                <input
                  type="number"
                  min={7}
                  max={180}
                  value={formData.maxAdvanceBookingDays}
                  onChange={e => setFormData({ ...formData, maxAdvanceBookingDays: Number(e.target.value) })}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
                <p className="text-[10px] text-[#806B5C] mt-1">Limits how far in advance guests can schedule.</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => showToast('Operating Schedule Saved', 'Weekly hours and station buffers updated.')}
              variant="primary"
              size="sm"
              className="bg-[#41332B] text-white"
            >
              Update Scheduling Engine
            </Button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: HOLIDAYS, TEMPORARY CLOSURES & CONFLICT IMPACT CHECKER
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'closures' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
              <div>
                <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                  Schedule Temporary Closure & Conflict Impact Check
                </h2>
                <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                  When adding a closure date, Glamouré immediately scans the database for affected client reservations.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddClosure} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Closure Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Artisan Masterclass"
                  value={newClosureName}
                  onChange={e => setNewClosureName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Closure Date</label>
                <input
                  type="date"
                  required
                  value={newClosureDate}
                  onChange={e => setNewClosureDate(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <Button type="submit" variant="primary" size="sm" className="w-full bg-[#41332B] text-white">
                  Schedule Closure
                </Button>
              </div>
            </form>

            {/* Conflict Impact Preview Alert */}
            {affectedAppointments.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    Schedule Conflict Detected: {affectedAppointments.length} existing guest reservation(s) scheduled on {newClosureDate}!
                  </span>
                </div>
                <div className="divide-y divide-amber-200/60 dark:divide-amber-900/40 pt-1">
                  {affectedAppointments.map(apt => (
                    <div key={apt.id} className="py-1.5 flex items-center justify-between">
                      <span>{apt.customerName} — {apt.serviceName} ({apt.startTime})</span>
                      <span className="font-mono text-[11px] text-amber-800 dark:text-amber-300">Artisan: {apt.staffName}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 italic pt-1">
                  Adding this closure will flag these appointments for automated guest reschedule concierges.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero schedule conflicts: No guest bookings exist for {newClosureDate}. Clean closure.</span>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8D8C7]/80 dark:border-[#38271e] space-y-3">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Configured Atelier Closures & Holidays
            </h3>
            <div className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5 text-xs">
              {closures.map(closure => (
                <div key={closure.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{closure.name}</p>
                    <p className="text-[11px] text-[#806B5C]">{closure.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClosure(closure.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
