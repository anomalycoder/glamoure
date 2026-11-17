import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { InventoryItem } from '../../types/salon';
import type { InventoryMovement } from '../../types/appointment';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2,
  Boxes
} from 'lucide-react';

export const OwnerInventoryPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTab, setActiveTab] = useState<'catalogue' | 'movements'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Stock modal
  const [stockModalItem, setStockModalItem] = useState<{
    item: InventoryItem;
    type: 'add' | 'use';
  } | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(5);
  const [stockReason, setStockReason] = useState<string>('restock');
  const [stockNotes, setStockNotes] = useState('');

  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventoryBySalon(currentSalonId));
  const [movements, setMovements] = useState<InventoryMovement[]>(() => db.getInventoryMovements(currentSalonId));

  const refreshData = () => {
    setInventory(db.getInventoryBySalon(currentSalonId));
    setMovements(db.getInventoryMovements(currentSalonId));
  };

  const lowStockItems = useMemo(() => {
    return inventory.filter(i => i.quantity <= (i.minThreshold || 5));
  }, [inventory]);

  const categories = useMemo(() => {
    const set = new Set(inventory.map(i => i.category));
    return Array.from(set);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => {
      const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
      const matchSearch = searchTerm === '' ||
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.supplier && i.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [inventory, categoryFilter, searchTerm]);

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalItem || !user) return;

    const delta = stockModalItem.type === 'add' ? Number(stockDelta) : -Number(stockDelta);

    db.recordStockMovement({
      salonId: currentSalonId,
      branchId: stockModalItem.item.branchId,
      itemId: stockModalItem.item.id,
      quantityDelta: delta,
      reason: (stockReason as any) || (stockModalItem.type === 'add' ? 'restock' : 'service_usage'),
      performedByUserId: user.id,
      notes: stockNotes.trim() || undefined,
    });

    showToast('Inventory Updated', `Adjusted ${stockModalItem.item.name} by ${delta > 0 ? '+' : ''}${delta} units.`);
    setStockModalItem(null);
    setStockNotes('');
    refreshData();
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Inventory & Professional Formulary
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Stock control, low-threshold alarms, treatment consumption audit trails, and supplier catalogs.
          </p>
        </div>

        <div className="flex rounded-lg bg-white/5 p-1 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'catalogue' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
            }`}
          >
            Product Catalogue ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'movements' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
            }`}
          >
            Movement Audit Log ({movements.length})
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Total Stock Units</p>
          <p className="font-['Montserrat'] text-2xl text-[#efc9a5] mt-1 font-light">
            {inventory.reduce((a, b) => a + b.quantity, 0)}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">Across all salon bays</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Low-Stock Alerts</p>
          <p className="font-['Montserrat'] text-2xl text-rose-400 mt-1 font-light">
            {lowStockItems.length}
          </p>
          <p className="text-[10px] text-rose-300 mt-1">Under safety buffer</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Catalogue Value</p>
          <p className="font-['Montserrat'] text-2xl text-[#f5eee6] mt-1 font-light">
            ₹{inventory.reduce((a, b) => a + (b.quantity * (b.costPrice || b.unitPrice || 800)), 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">At wholesale valuation</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Active Categories</p>
          <p className="font-['Montserrat'] text-2xl text-[#f5eee6] mt-1 font-light">
            {categories.length}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">Color, Scalp, Skincare, Nails</p>
        </Card>
      </div>

      {/* Low-stock warning banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Reorder Alert:</strong> {lowStockItems.map(i => `${i.name} (${i.quantity} left)`).join(', ')}.
            </span>
          </div>
          <button
            onClick={() => {
              const item = lowStockItems[0];
              setStockModalItem({ item, type: 'add' });
              setStockDelta(12);
              setStockReason('restock');
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 font-semibold cursor-pointer shrink-0"
          >
            Quick Restock
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: PRODUCT CATALOGUE
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'catalogue' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by product, SKU or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-[#f5eee6] placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[#2a1a15] border border-white/10 rounded-xl text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
            >
              <option value="all">All Product Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-white/10 text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Product Item</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Available Stock</th>
                  <th className="pb-3">Cost / Retail</th>
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3 text-right">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInventory.map(item => {
                  const isLow = item.quantity <= (item.minThreshold || 5);
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <p className="font-semibold text-[#f5eee6]">{item.name}</p>
                        <p className="text-[10px] text-[#a89582]">Buffer min: {item.minThreshold || 5} units</p>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-[#efc9a5]">{item.sku}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`font-mono text-sm font-bold ${isLow ? 'text-rose-400' : 'text-[#f5eee6]'}`}>
                          {item.quantity}
                        </span>
                        {isLow && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[9px] font-bold">
                            LOW
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-mono text-[11px]">
                        <span>₹{item.costPrice || item.unitPrice || 650}</span>
                        {item.price && <span className="text-[#a89582]"> / ₹{item.price}</span>}
                      </td>
                      <td className="py-3.5 text-[#a89582] text-[11px]">{item.supplier || 'Luxury Salon Importers'}</td>
                      <td className="py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setStockModalItem({ item, type: 'add' });
                            setStockDelta(10);
                            setStockReason('restock');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-[11px] font-semibold border border-emerald-800/40 cursor-pointer"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => {
                            setStockModalItem({ item, type: 'use' });
                            setStockDelta(1);
                            setStockReason('service_usage');
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 text-[11px] font-semibold border border-amber-800/40 cursor-pointer"
                        >
                          - Use
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: STOCK MOVEMENT AUDIT TRAIL
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'movements' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
                Auditable Stock Movements
              </h2>
              <p className="text-xs text-[#a89582]">
                Permanent history of intake, treatment-linked consumption, and adjustments.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {movements.map(mov => (
              <div
                key={mov.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-[#3a2820] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      mov.quantityDelta > 0 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' 
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {mov.quantityDelta > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#f5eee6]">{mov.itemName}</h4>
                    <p className="text-[11px] text-[#a89582]">
                      Reason: <span className="text-[#efc9a5] uppercase text-[10px] font-bold">{mov.reason.replace('_', ' ')}</span>
                      {mov.notes && ` • "${mov.notes}"`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono text-sm font-bold block ${
                      mov.quantityDelta > 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta}
                  </span>
                  <span className="text-[10px] text-[#a89582]">
                    Balance: {mov.newQuantity} units • {new Date(mov.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stock Adjustment Modal */}
      {stockModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">
                {stockModalItem.type === 'add' ? 'Intake / Restock Stock' : 'Record Service Consumption'}
              </h3>
              <button onClick={() => setStockModalItem(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <p className="text-xs text-[#c2b3a3]">
              Adjusting: <strong>{stockModalItem.item.name}</strong> (Currently {stockModalItem.item.quantity} in stock).
            </p>

            <form onSubmit={handleStockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">
                  Units to {stockModalItem.type === 'add' ? 'Add' : 'Deduct'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockDelta}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Reason / Category</label>
                <select
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#2a1a15] border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                >
                  {stockModalItem.type === 'add' ? (
                    <>
                      <option value="restock">Quarterly Supplier Intake (Restock)</option>
                      <option value="adjustment">Audit Recalibration (+)</option>
                      <option value="manual">Emergency Stock Purchase</option>
                    </>
                  ) : (
                    <>
                      <option value="service_usage">Artisan Service Ritual Usage</option>
                      <option value="wastage">Formulation Spillage / Wastage</option>
                      <option value="adjustment">Stock Count Audit Deduction (-)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Notes / PO Number</label>
                <input
                  type="text"
                  placeholder="e.g. PO-2026-981 or Client hair formula prep"
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setStockModalItem(null)} className="text-xs px-3 py-1.5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  Commit Movement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
