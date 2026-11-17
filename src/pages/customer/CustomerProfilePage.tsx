import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sparkles, Shield, User } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [allergies, setAllergies] = useState('Mild sensitivity to ammonia; prefers organic botanical glazes.');
  const [preferredNotes, setPreferredNotes] = useState('Silent appointments preferred during balayage; warm chamomile tea.');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00001');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile Saved', 'Your bespoke beauty profile has been updated.', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="font-['Montserrat'] text-2xl font-light text-[#41332B]">
          Bespoke Beauty Profile
        </h2>
        <p className="text-xs text-[#806B5C] mt-1">
          Formula history, skin patch assessment, and personal comfort preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#41332B]" />
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
              Personal Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={user?.fullName || ''} disabled />
            <Input label="Email Address" value={user?.email || ''} disabled />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#41332B]" />
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
              Hair &amp; Skin Health Assessments
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#41332B] block mb-1">
                Known Sensitivities or Product Allergies
              </label>
              <textarea
                rows={3}
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#41332B]/15 text-xs text-[#241812] focus:outline-none focus:border-[#41332B]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#41332B] block mb-1">
                Sanctuary Comfort &amp; Hospitality Preferences
              </label>
              <textarea
                rows={3}
                value={preferredNotes}
                onChange={e => setPreferredNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#41332B]/15 text-xs text-[#241812] focus:outline-none focus:border-[#41332B]"
              />
            </div>

            <Input
              label="Emergency Contact"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Profile Updates</Button>
        </div>
      </form>
    </div>
  );
};
