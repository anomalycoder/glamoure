import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bell, Lock } from 'lucide-react';

export const CustomerSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Your communication preferences have been updated.', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="font-['Montserrat'] text-2xl font-light text-[#41332B]">
          Account &amp; Privacy Settings
        </h2>
        <p className="text-xs text-[#806B5C] mt-1">
          Manage concierge alerts, notifications, and security.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#41332B]" />
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
              Concierge Communications
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#41332B]/10 cursor-pointer">
              <div>
                <span className="font-semibold text-[#41332B] block">SMS &amp; WhatsApp Slot Reminders</span>
                <span className="text-[#806B5C]">Receive arrival reminders 24 hours and 2 hours before scheduled visits.</span>
              </div>
              <input
                type="checkbox"
                checked={smsReminders}
                onChange={e => setSmsReminders(e.target.checked)}
                className="w-4 h-4 accent-[#41332B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#41332B]/10 cursor-pointer">
              <div>
                <span className="font-semibold text-[#41332B] block">Formula &amp; Invoice Email Receipts</span>
                <span className="text-[#806B5C]">Digital invoices and color formula notes dispatched automatically after each appointment.</span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={e => setEmailDigest(e.target.checked)}
                className="w-4 h-4 accent-[#41332B]"
              />
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-[#41332B]" />
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
              Security &amp; Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
