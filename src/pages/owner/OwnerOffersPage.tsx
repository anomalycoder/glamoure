import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Offer } from '../../types/salon';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tag, Plus, Calendar, CheckCircle2, XCircle, Trash2, Edit3, Search, Sparkles } from 'lucide-react';

export const OwnerOffersPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [offers, setOffers] = useState<Offer[]>(() => db.getOffersBySalon(currentSalonId));
  const [services] = useState(() => db.getServicesBySalon(currentSalonId));
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offerType, setOfferType] = useState<'percentage' | 'fixed' | 'bundle' | 'first_visit'>('percentage');
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [discountAmount, setDiscountAmount] = useState<number>(500);
  const [minSpend, setMinSpend] = useState<number>(2000);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [validFrom, setValidFrom] = useState('2026-11-01');
  const [validTo, setValidTo] = useState('2026-12-31');
  const [serviceId, setServiceId] = useState<string>('');

  const refreshOffers = () => {
    setOffers(db.getOffersBySalon(currentSalonId));
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      showToast('Offer code and title are required.', 'error');
      return;
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      salonId: currentSalonId,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      type: offerType,
      discountPercent: offerType === 'percentage' || offerType === 'first_visit' ? Number(discountPercent) : undefined,
      discountAmount: offerType === 'fixed' || offerType === 'bundle' ? Number(discountAmount) : undefined,
      minSpend: Number(minSpend) || 0,
      maxUses: Number(maxUses) || undefined,
      serviceId: serviceId || undefined,
      validFrom,
      validTo,
      usageCount: 0,
      isActive: true,
    };

    db.createOffer(newOffer);
    showToast(`Campaign ${newOffer.code} launched successfully.`, 'success');
    setShowModal(false);
    resetForm();
    refreshOffers();
  };

  const resetForm = () => {
    setCode('');
    setTitle('');
    setDescription('');
    setOfferType('percentage');
    setDiscountPercent(15);
    setDiscountAmount(500);
    setMinSpend(2000);
    setMaxUses(100);
    setServiceId('');
  };

  const handleToggleActive = (offer: Offer) => {
    db.updateOffer(offer.id, { isActive: !offer.isActive });
    showToast(`Campaign ${offer.code} ${offer.isActive ? 'paused' : 'activated'}.`, 'success');
    refreshOffers();
  };

  const handleDelete = (offerId: string) => {
    if (confirm('Are you sure you want to retire this promotional campaign?')) {
      db.deleteOffer(offerId);
      showToast('Offer retired from circulation.', 'success');
      refreshOffers();
    }
  };

  const filteredOffers = offers.filter(o => 
    o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = offers.filter(o => o.isActive).length;
  const totalRedeemed = offers.reduce((acc, curr) => acc + (curr.usageCount || 0), 0);

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#2B2118] dark:text-[#f5eee6]">
            Offers & Promotional Campaigns
          </h1>
          <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-1">
            Design targeted seasonal discounts, first-visit privileges, and ritual bundle rewards.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </Button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Active Campaigns</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#efc9a5] mt-1 font-light">{activeCount}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Currently bookable</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Total Redemptions</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#f5eee6] mt-1 font-light">{totalRedeemed}</p>
          <p className="text-[10px] text-[#7A6658] dark:text-[#a89582] mt-1">Client checkouts</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Campaign Types</p>
          <p className="font-['Montserrat'] text-2xl text-[#2B2118] dark:text-[#f5eee6] mt-1 font-light">4 Variants</p>
          <p className="text-[10px] text-[#7A6658] dark:text-[#a89582] mt-1">% / Fixed / Bundles / First-Visit</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Top Performing</p>
          <p className="font-['Montserrat'] text-xl text-[#B99470] dark:text-[#efc9a5] mt-1 font-medium truncate">GLAMFIRST</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">12 redemptions this month</p>
        </Card>
      </div>

      {/* Search & Offers Table */}
      <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7A6658] dark:text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 rounded-xl text-[#2B2118] dark:text-[#f5eee6] placeholder-[#7A6658] dark:placeholder-[#a89582] focus:outline-none focus:border-[#B99470]"
            />
          </div>
          <span className="text-xs text-[#7A6658] dark:text-[#a89582]">Showing {filteredOffers.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2B2118] dark:text-[#c2b3a3]">
            <thead>
              <tr className="border-b border-[#E8DFD5] dark:border-white/10 text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                <th className="pb-3">Campaign Code</th>
                <th className="pb-3">Title & Benefit</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Min Spend</th>
                <th className="pb-3">Redemptions</th>
                <th className="pb-3">Validity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-white/5">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#B99470] dark:text-[#efc9a5]">
                    <span className="px-2 py-1 rounded bg-[#FAF8F5] dark:bg-[#41332b]/80 border border-[#E8DFD5] dark:border-[#b99470]/30">
                      {offer.code}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <p className="font-medium text-[#2B2118] dark:text-[#f5eee6]">{offer.title}</p>
                    <p className="text-[11px] text-[#7A6658] dark:text-[#a89582] truncate max-w-xs">{offer.description || 'Exclusive luxury benefit'}</p>
                  </td>
                  <td className="py-3.5 uppercase text-[10px] tracking-wider text-[#7A6658] dark:text-[#d8c3a8]">
                    {offer.type || (offer.discountPercent ? `${offer.discountPercent}% OFF` : 'Fixed')}
                  </td>
                  <td className="py-3.5 font-medium text-[#2B2118] dark:text-[#f5eee6]">
                    ₹{(offer.minSpend || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span className="text-[#2B2118] dark:text-[#f5eee6] font-semibold">{offer.usageCount}</span>
                    {offer.maxUses && <span className="text-[#7A6658] dark:text-[#a89582]"> / {offer.maxUses}</span>}
                  </td>
                  <td className="py-3.5 text-[11px] text-[#7A6658] dark:text-[#a89582]">
                    {offer.validFrom} <span className="text-[#7A6658] dark:text-[#a89582]">to</span> {offer.validTo}
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                        offer.isActive 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100' 
                          : 'bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700 hover:bg-stone-200'
                      }`}
                    >
                      {offer.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{offer.isActive ? 'Active' : 'Paused'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-200 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Retire campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Launch Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5] dark:border-white/10">
              <div className="flex items-center gap-2 text-[#2B2118] dark:text-[#efc9a5]">
                <Sparkles className="w-5 h-5 text-[#B99470]" />
                <h2 className="font-['Montserrat'] text-lg font-light text-[#2B2118] dark:text-[#f5eee6]">Launch New Campaign</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#7A6658] dark:text-[#a89582] hover:text-[#2B2118] dark:hover:text-[#f5eee6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUXURY20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] font-mono uppercase focus:outline-none focus:border-[#B99470]"
                  />
                </div>
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Campaign Type</label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Currency Discount (₹)</option>
                    <option value="bundle">Service Bundle Reward</option>
                    <option value="first_visit">First-Time Guest Privilege</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Equinox Sanctuary Privilege"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Client Terms / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Valid on hair coloring and skin rituals."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {offerType === 'percentage' || offerType === 'first_visit' ? (
                  <div>
                    <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Discount Amount (₹)</label>
                    <input
                      type="number"
                      min="50"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Minimum Cart Total (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Valid From</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
                <div>
                  <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Valid To</label>
                  <input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">Service Restriction (Optional)</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                >
                  <option value="">Applicable across all salon rituals</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs border-[#E8DFD5] text-[#2B2118]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold px-4 py-2 text-xs rounded-xl shadow-xs"
                >
                  Publish Campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
