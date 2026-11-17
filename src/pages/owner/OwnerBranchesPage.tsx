import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, Plus, MapPin, Phone, Mail } from 'lucide-react';

export const OwnerBranchesPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const branches = db.getBranchesBySalon(currentSalonId);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    db.createBranch({
      id: `branch-${Date.now()}`,
      salonId: currentSalonId,
      name,
      code: code.toUpperCase(),
      address,
      city: 'Hyderabad',
      phone,
      email: 'branch@glamoure.in',
      isMainBranch: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    showToast('Branch Added', `Created ${name} (${code}).`, 'success');
    setShowAdd(false);
    setName('');
    setCode('');
    setAddress('');
    setPhone('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-['Montserrat'] text-2xl font-light text-[#41332B]">
            Multi-Branch Network
          </h2>
          <p className="text-xs text-[#806B5C] mt-1">
            Manage multiple physical studio locations under your salon umbrella.
          </p>
        </div>

        <Button size="sm" onClick={() => setShowAdd(!showAdd)} icon={<Plus className="w-4 h-4" />}>
          Add Studio Branch
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateBranch} className="p-6 rounded-3xl bg-white border border-[#41332B]/15 shadow-sm space-y-4">
          <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
            Register New Branch Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Branch Name" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Banjara Hills Studio" />
            <Input label="Branch Code" required value={code} onChange={e => setCode(e.target.value)} placeholder="BH-03" />
            <Input label="Address" required value={address} onChange={e => setAddress(e.target.value)} placeholder="Plot 14, Road No. 12" />
            <Input label="Direct Phone" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 00000" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" size="sm">Provision Branch</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map(b => (
          <Card key={b.id} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Montserrat'] text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8D8C7]/50 text-[#41332B] font-semibold">
                Code: {b.code}
              </span>
              {b.isMainBranch && (
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#41332B] text-white font-medium">
                  Flagship
                </span>
              )}
            </div>

            <h3 className="font-['Montserrat'] text-lg font-medium text-[#41332B] mb-2">
              {b.name}
            </h3>

            <div className="space-y-1.5 text-xs text-[#806B5C]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#41332B]" />
                <span>{b.address}, {b.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#41332B]" />
                <span>{b.phone}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
