import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Salon } from '../../types/salon';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building, Sliders, Save } from 'lucide-react';

export const OwnerSettingsPage: React.FC = () => {
  const { currentSalonId, user } = useAuth();
  const { addToast } = useNotification();
  const [, setSalon] = useState<Salon | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    description: '',
    currency: 'USD',
    timezone: 'America/New_York',
    allowOnlineBooking: true,
    requireDeposit: true,
    depositPercentage: 20,
    cancellationNoticeHours: 24,
    autoConfirmAppointments: false,
    taxRatePercentage: 18,
  });

  useEffect(() => {
    if (!currentSalonId) return;
    const s = db.getSalonById(currentSalonId);
    if (s) {
      setSalon(s);
      setFormData({
        name: s.name,
        phone: s.phone,
        email: s.email,
        address: s.address,
        city: s.city,
        country: s.country,
        description: s.description || '',
        currency: s.currency,
        timezone: s.timezone,
        allowOnlineBooking: s.settings.allowOnlineBooking,
        requireDeposit: s.settings.requireDeposit,
        depositPercentage: s.settings.depositPercentage,
        cancellationNoticeHours: s.settings.cancellationNoticeHours,
        autoConfirmAppointments: s.settings.autoConfirmAppointments,
        taxRatePercentage: 18,
      });
    }
  }, [currentSalonId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSalonId) return;

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
          bufferMinutesBetweenAppointments: current?.settings.bufferMinutesBetweenAppointments || 15,
          autoConfirmAppointments: formData.autoConfirmAppointments,
          businessHours: current?.settings.businessHours || [],
        },
      });

      db.logAudit({
        salonId: currentSalonId,
        userId: user?.id || 'owner-1',
        userEmail: user?.email || 'owner@glamoure.com',
        action: 'update_salon_settings',
        entity: 'salon',
        entityId: currentSalonId,
        metadata: { updatedSettings: formData },
      });

      addToast('Atelier settings updated successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8D8C7]/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">Configuration</span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#41332B] font-light mt-1">Salon Settings & Policies</h1>
          <p className="font-sans text-sm text-[#806B5C] mt-2">
            Configure atelier business rules, online reservation policies, and fiscal parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Business Information */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7]/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#E8D8C7]/60">
            <Building className="w-5 h-5 text-[#B99470]" />
            <h2 className="font-serif text-xl text-[#41332B]">Atelier Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Salon / Atelier Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Contact Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            />
            <Input
              label="Address Line"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#41332B] uppercase tracking-wider">
              Brand Narrative / Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8D8C7] rounded-xl text-sm text-[#41332B] focus:outline-none focus:border-[#B99470] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Booking Rules & Fiscal Policies */}
        <div className="bg-white/80 rounded-2xl border border-[#E8D8C7]/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#E8D8C7]/60">
            <Sliders className="w-5 h-5 text-[#B99470]" />
            <h2 className="font-serif text-xl text-[#41332B]">Reservation & Deposit Policies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowOnlineBooking}
                  onChange={(e) => setFormData({ ...formData, allowOnlineBooking: e.target.checked })}
                  className="mt-1 rounded border-[#E8D8C7] text-[#41332B] focus:ring-[#B99470]"
                />
                <div>
                  <span className="font-serif text-sm font-medium text-[#41332B] block">Enable Online Guest Booking</span>
                  <span className="text-xs text-[#806B5C]">Allow public visitors to book appointments on the Glamouré portal.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireDeposit}
                  onChange={(e) => setFormData({ ...formData, requireDeposit: e.target.checked })}
                  className="mt-1 rounded border-[#E8D8C7] text-[#41332B] focus:ring-[#B99470]"
                />
                <div>
                  <span className="font-serif text-sm font-medium text-[#41332B] block">Require Advance Deposit</span>
                  <span className="text-xs text-[#806B5C]">Guests pay a percentage deposit upon checkout to secure their slot.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoConfirmAppointments}
                  onChange={(e) => setFormData({ ...formData, autoConfirmAppointments: e.target.checked })}
                  className="mt-1 rounded border-[#E8D8C7] text-[#41332B] focus:ring-[#B99470]"
                />
                <div>
                  <span className="font-serif text-sm font-medium text-[#41332B] block">Instant Confirmation</span>
                  <span className="text-xs text-[#806B5C]">Automatically transition new bookings to confirmed without manual approval.</span>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <Input
                label="Deposit Percentage (%)"
                type="number"
                min="0"
                max="100"
                value={formData.depositPercentage.toString()}
                onChange={(e) => setFormData({ ...formData, depositPercentage: Number(e.target.value) })}
              />
              <Input
                label="Cancellation Notice (Hours)"
                type="number"
                min="1"
                max="168"
                value={formData.cancellationNoticeHours.toString()}
                onChange={(e) => setFormData({ ...formData, cancellationNoticeHours: Number(e.target.value) })}
              />
              <Input
                label="Applicable GST / VAT Tax Rate (%)"
                type="number"
                min="0"
                max="50"
                value={formData.taxRatePercentage.toString()}
                onChange={(e) => setFormData({ ...formData, taxRatePercentage: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Atelier Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
