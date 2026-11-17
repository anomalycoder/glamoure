import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, FileText, Sparkles, User, Calendar, Edit3, Save } from 'lucide-react';

interface ArtisanClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  lastService: string;
  lastVisit: string;
  hairType: string;
  formula: string;
  notes: string;
}

export const MemberCustomersPage: React.FC = () => {
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

  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ArtisanClient | null>(null);
  const [editedFormula, setEditedFormula] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  const appointments = useMemo(() => {
    return staffProfile ? db.getAppointmentsByStaff(staffProfile.id) : [];
  }, [staffProfile]);

  // Derive unique clients served by this artisan
  const clients: ArtisanClient[] = useMemo(() => {
    const map = new Map<string, ArtisanClient>();

    appointments.forEach(a => {
      if (!map.has(a.customerId)) {
        const profile = db.getCustomerProfile(a.customerId);
        map.set(a.customerId, {
          id: a.customerId,
          name: a.customerName,
          email: a.customerEmail,
          phone: a.customerPhone,
          lastService: a.serviceName,
          lastVisit: a.appointmentDate,
          hairType: profile?.hairType || 'Wavy 2B Fine Strand',
          formula: 'Redken Shades EQ: 09V + 09GI with 20-volume Flash Lift',
          notes: profile?.preferredNotes || 'Prefers low-heat diffuser; sensitive scalp.',
        });
      }
    });

    if (map.size === 0) {
      map.set('user-customer-sophia', {
        id: 'user-customer-sophia',
        name: 'Sophia Chen',
        email: 'customer@glamoure.com',
        phone: '+91 98840 12345',
        lastService: 'French Balayage & Gloss',
        lastVisit: '2026-11-17',
        hairType: 'Fine Texture / Cool Ash Preference',
        formula: 'Toner 9V (30g) + 9T (15g) + Crystal Clear on 10vol',
        notes: 'Requested lavender mist aromatherapy during rinse cycle.',
      });
    }

    return Array.from(map.values());
  }, [appointments]);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.formula.toLowerCase().includes(search.toLowerCase()) ||
    c.notes.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEdit = (client: ArtisanClient) => {
    setSelectedClient(client);
    setEditedFormula(client.formula);
    setEditedNotes(client.notes);
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    selectedClient.formula = editedFormula;
    selectedClient.notes = editedNotes;
    db.updateCustomerNotes(selectedClient.id, `Formula: ${editedFormula} | Notes: ${editedNotes}`);
    showToast('Vault Updated', `Technical formula saved for ${selectedClient.name}.`);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Client Formula Vault & Profiles
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Color chemistry recipes, scalp health records, and bespoke aesthetic dossiers for your clientele.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client or formula note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-[#f5eee6] placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
          />
        </div>
      </div>

      {/* Client Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map(client => (
          <Card
            key={client.id}
            className="p-5 bg-[#201511] border-[#3a2820] hover:border-[#b99470]/40 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#41332b] text-[#efc9a5] font-semibold text-xs flex items-center justify-center border border-[#b99470]/30 shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#f5eee6]">{client.name}</h3>
                  <p className="text-xs text-[#b99470]">{client.lastService}</p>
                </div>
              </div>

              <span className="text-[10px] text-[#a89582] font-mono">
                Last: {client.lastVisit}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#2a1a15] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#efc9a5] block">
                  Color & Chemical Formulary
                </span>
                <p className="text-[#f5eee6] font-mono text-[11px] leading-relaxed">
                  {client.formula}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#a89582] block">
                  Special Instructions
                </span>
                <p className="text-[#c2b3a3] text-[11px] leading-relaxed">
                  {client.notes}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-[#a89582]">{client.hairType}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(client)}
                className="text-xs px-2.5 py-1 text-[#efc9a5] hover:text-[#f5eee6] border-white/10"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                <span>Update Formula</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Edit Client Formula */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">
                Formula Dossier: {selectedClient.name}
              </h3>
              <button onClick={() => setSelectedClient(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">
                  Chemical Formulation / Color Recipe
                </label>
                <textarea
                  rows={3}
                  required
                  value={editedFormula}
                  onChange={(e) => setEditedFormula(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">
                  Hair Profile & Preferences
                </label>
                <textarea
                  rows={3}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedClient(null)} className="text-xs px-3">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Save to Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
