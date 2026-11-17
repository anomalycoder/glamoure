import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { CustomerRecord, Review } from '../../types/common';
import type { Appointment } from '../../types/appointment';
import { 
  Users, 
  Search, 
  Download, 
  Sparkles, 
  Heart, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  Star, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

export const OwnerCustomersPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Segment tabs
  const [activeSegment, setActiveSegment] = useState<'all' | 'new' | 'returning' | 'frequent' | 'inactive' | 'highValue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected customer dossier modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [newNote, setNewNote] = useState('');

  // Real database customer segments
  const segments = useMemo(() => {
    return db.getCustomerSegments(currentSalonId);
  }, [currentSalonId]);

  const allCustomers = useMemo(() => {
    // Combine unique records
    const map = new Map<string, CustomerRecord>();
    Object.values(segments).forEach(list => {
      list.forEach(c => map.set(c.userId, c));
    });
    return Array.from(map.values());
  }, [segments]);

  const displayedCustomers = useMemo(() => {
    let list: CustomerRecord[] = [];
    if (activeSegment === 'all') list = allCustomers;
    else list = segments[activeSegment] || [];

    if (!searchTerm.trim()) return list;

    return list.filter(c => 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
  }, [activeSegment, allCustomers, segments, searchTerm]);

  // Appointments & Reviews for selected customer
  const customerAppointments = useMemo(() => {
    if (!selectedCustomer) return [];
    return db.getAppointmentsByCustomer(selectedCustomer.userId);
  }, [selectedCustomer]);

  const customerReviews = useMemo(() => {
    if (!selectedCustomer) return [];
    return db.getReviewsByCustomer(selectedCustomer.userId);
  }, [selectedCustomer]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['User ID', 'Full Name', 'Email', 'Phone', 'Total Visits', 'Total Spent (INR)', 'Last Visit'];
    const rows = displayedCustomers.map(c => [
      c.userId,
      `"${c.fullName}"`,
      c.email,
      c.phone || '',
      c.totalAppointments,
      c.totalSpent,
      c.lastVisitDate || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glamoure_crm_export_${activeSegment}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Complete', `Exported ${displayedCustomers.length} clientele records.`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;

    db.updateCustomerNotes(selectedCustomer.userId, newNote.trim());
    showToast('Formula Saved', 'Client preference notes updated in dossier.');
    selectedCustomer.notes = (selectedCustomer.notes ? selectedCustomer.notes + ' | ' : '') + newNote.trim();
    setNewNote('');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Clientele Dossier & CRM
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Holistic guest profiles, ritual histories, formula vaults, and spending intelligence.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-2 border-[#b99470] text-[#41332B] dark:text-[#efc9a5] hover:bg-[#FAF6F1] dark:hover:bg-[#41332b]/40 text-xs px-3.5 py-2 rounded-xl cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Segment CSV</span>
        </Button>
      </div>

      {/* 5 Customer Segments Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { key: 'all', label: 'All Guests', count: allCustomers.length },
          { key: 'new', label: 'New Guests', count: segments.new.length },
          { key: 'returning', label: 'Returning', count: segments.returning.length },
          { key: 'frequent', label: 'Frequent Regulars', count: segments.frequent.length },
          { key: 'highValue', label: 'High-Value VIPs', count: segments.highValue.length },
          { key: 'inactive', label: 'Inactive (60d+)', count: segments.inactive.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSegment(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === tab.key
                ? 'bg-[#41332B] dark:bg-[#41332b] text-white dark:text-[#efc9a5] border border-[#b99470]/40 shadow-xs'
                : 'bg-white dark:bg-white/5 border border-[#E8D8C7] dark:border-transparent text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6] hover:bg-[#FAF6F1] dark:hover:bg-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#806B5C] dark:text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email, or telephone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-xl text-[#41332B] dark:text-[#f5eee6] placeholder-[#806B5C] dark:placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
        />
      </div>

      {/* Customers Table */}
      <Card className="bg-white dark:bg-[#201511] border-[#E8D8C7] dark:border-[#3a2820] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#806B5C] dark:text-[#c2b3a3]">
            <thead>
              <tr className="border-b border-[#E8D8C7] dark:border-white/10 text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold bg-[#FAF7F2] dark:bg-transparent">
                <th className="p-4">Client Dossier</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Rituals</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Last Sanctuary Visit</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8C7]/60 dark:divide-white/5">
              {displayedCustomers.map(customer => (
                <tr key={customer.userId} className="hover:bg-[#FAF6F1] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F1] dark:bg-[#41332b] text-[#41332B] dark:text-[#efc9a5] font-semibold text-xs flex items-center justify-center border border-[#b99470]/30 shrink-0">
                        {customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{customer.fullName}</p>
                        <p className="text-[10px] text-[#806B5C] dark:text-[#a89582]">ID: {customer.userId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="text-[#41332B] dark:text-[#f5eee6]">{customer.email}</p>
                    <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">{customer.phone || 'N/A'}</p>
                  </td>

                  <td className="p-4 font-semibold text-[#41332B] dark:text-[#f5eee6]">
                    {customer.totalAppointments} visits
                  </td>

                  <td className="p-4 font-mono font-bold text-[#b99470] dark:text-[#efc9a5]">
                    ₹{customer.totalSpent.toLocaleString()}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-[#806B5C] dark:text-[#c2b3a3]">
                    {customer.lastVisitDate || 'First reservation'}
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-xs px-3 py-1 text-[#41332B] dark:text-[#efc9a5] hover:text-[#b99470] dark:hover:text-[#f5eee6] border-[#E8D8C7] dark:border-white/10 cursor-pointer"
                    >
                      Open Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          CLIENT DOSSIER MODAL (HISTORIES, FORMULAS, REVIEWS)
      ═══════════════════════════════════════════════════════════════ */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F1] dark:bg-[#41332b] text-[#41332B] dark:text-[#efc9a5] font-semibold text-sm flex items-center justify-center border border-[#b99470]/40">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-['Montserrat'] text-base text-[#41332B] dark:text-[#f5eee6] font-medium">{selectedCustomer.fullName}</h2>
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582]">{selectedCustomer.email} • {selectedCustomer.phone || 'No phone'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-[#806B5C] dark:text-[#a89582] hover:text-[#41332B] dark:hover:text-[#f5eee6] cursor-pointer">✕</button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF6F1] dark:bg-white/5 text-center">
                <p className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Total Visits</p>
                <p className="font-['Montserrat'] text-lg font-light text-[#41332B] dark:text-[#f5eee6] mt-0.5">{selectedCustomer.totalAppointments}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF6F1] dark:bg-white/5 text-center">
                <p className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Lifetime Investment</p>
                <p className="font-['Montserrat'] text-lg font-light text-[#b99470] dark:text-[#efc9a5] mt-0.5">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF6F1] dark:bg-white/5 text-center">
                <p className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] font-semibold">Loyalty Balance</p>
                <p className="font-['Montserrat'] text-lg font-light text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedCustomer.loyaltyPoints} pts</p>
              </div>
            </div>

            {/* Formula Vault & Clinical Notes */}
            <div className="space-y-2">
              <h3 className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#b99470] dark:text-[#efc9a5] font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Client Formula Vault & Preferences</span>
              </h3>
              <div className="p-3 rounded-xl bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/5 text-xs text-[#41332B] dark:text-[#c2b3a3] leading-relaxed">
                {selectedCustomer.notes || 'Prefers warm organic herbal tea before scalp service. Sensitive to high heat blow dryers. Color formula: 7.1 + 8.23 on 20vol.'}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Append consultation note or formula update..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
                <Button type="submit" size="sm" className="bg-[#b99470] hover:bg-[#a37f5d] text-white text-xs font-semibold px-3 rounded-xl cursor-pointer">
                  Save Note
                </Button>
              </form>
            </div>

            {/* Appointment History */}
            <div className="space-y-2">
              <h3 className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#b99470] dark:text-[#efc9a5] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointment Journey ({customerAppointments.length})</span>
              </h3>
              <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar">
                {customerAppointments.length === 0 ? (
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582] italic">No prior bookings registered.</p>
                ) : (
                  customerAppointments.map(a => (
                    <div key={a.id} className="p-2.5 rounded-lg bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-transparent flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{a.serviceName}</p>
                        <p className="text-[11px] text-[#806B5C] dark:text-[#a89582]">{a.appointmentDate} at {a.startTime} • Artisan: {a.staffName}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-[#b99470] dark:text-[#efc9a5] font-semibold block">₹{a.price.toLocaleString()}</span>
                        <Badge variant={a.status === 'completed' ? 'success' : 'default'} className="capitalize text-[9px]">
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reviews by Guest */}
            {customerReviews.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-['Montserrat'] text-xs uppercase tracking-wider text-[#b99470] dark:text-[#efc9a5] font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>Feedback Provided</span>
                </h3>
                <div className="space-y-2">
                  {customerReviews.map(r => (
                    <div key={r.id} className="p-2.5 rounded-lg bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-transparent text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#b99470] dark:text-[#efc9a5] font-medium">{r.rating} Stars with {r.staffName}</span>
                        <span className="text-[10px] text-[#806B5C] dark:text-[#a89582]">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#806B5C] dark:text-[#c2b3a3] italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-right border-t border-[#E8D8C7] dark:border-white/10">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)} className="text-xs px-4 py-1.5 cursor-pointer">
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
