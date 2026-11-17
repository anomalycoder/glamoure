import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
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
  Boxes,
  Truck,
  Building2,
  Filter,
  X,
  PlusCircle
} from 'lucide-react';

export const OwnerInventoryPage: React.FC = () => {
  const { user, salonId } = useAuth();
  const { isBranchMatch } = useBranch();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTab, setActiveTab] = useState<'catalogue' | 'movements'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Stock Adjustment Modal
  const [stockModalItem, setStockModalItem] = useState<{
    item: InventoryItem;
    type: 'add' | 'use';
  } | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(5);
  const [stockReason, setStockReason] = useState<string>('restock');
  const [stockNotes, setStockNotes] = useState('');

  // New Product Modal
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Hair Color');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(20);
  const [newItemMinThreshold, setNewItemMinThreshold] = useState<number>(5);
  const [newItemCostPrice, setNewItemCostPrice] = useState<number>(650);
  const [newItemRetailPrice, setNewItemRetailPrice] = useState<number>(1200);
  const [newItemSupplier, setNewItemSupplier] = useState('L\'Oréal Professionnel Paris');

  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventoryBySalon(currentSalonId));
  const [movements, setMovements] = useState<InventoryMovement[]>(() => db.getInventoryMovements(currentSalonId));

  const refreshData = () => {
    setInventory(db.getInventoryBySalon(currentSalonId));
    setMovements(db.getInventoryMovements(currentSalonId));
  };

  // Branch-Filtered Inventory
  const branchInventory = useMemo(() => {
    return inventory.filter(i => isBranchMatch(i.branchId));
  }, [inventory, isBranchMatch]);

  const lowStockItems = useMemo(() => {
    return branchInventory.filter(i => i.quantity <= (i.minThreshold || 5));
  }, [branchInventory]);

  const categories = useMemo(() => {
    const set = new Set(branchInventory.map(i => i.category));
    return Array.from(set);
  }, [branchInventory]);

  const filteredInventory = useMemo(() => {
    return branchInventory.filter(i => {
      const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
      const matchSearch = searchTerm === '' ||
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.supplier && i.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [branchInventory, categoryFilter, searchTerm]);

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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemSku.trim()) return;

    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      salonId: currentSalonId,
      branchId: 'branch-jubilee-flagship',
      name: newItemName.trim(),
      sku: newItemSku.trim().toUpperCase(),
      category: newItemCategory,
      quantity: Number(newItemQuantity),
      minThreshold: Number(newItemMinThreshold),
      reorderThreshold: Number(newItemMinThreshold) * 2,
      unitPrice: Number(newItemRetailPrice),
      price: Number(newItemRetailPrice),
      costPrice: Number(newItemCostPrice),
      supplier: newItemSupplier.trim(),
      updatedAt: new Date().toISOString(),
    };

    db.createInventoryItem(newItem);
    showToast('Product Catalogued', `${newItem.name} added to salon inventory.`);
    setShowNewItemModal(false);
    setNewItemName('');
    setNewItemSku('');
    refreshData();
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER & SUB-NAV
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Inventory & Professional Formulary
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Stock control, safety threshold alerts, treatment-linked consumption audit logs, and professional backbar formulations.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'catalogue'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            Product Catalogue ({branchInventory.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'movements'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            Movement Audit Log ({movements.length})
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Total Stock Units</p>
          <p className="font-['Montserrat'] text-xl text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-light">
            {branchInventory.reduce((a, b) => a + b.quantity, 0)}
          </p>
          <p className="text-[10px] text-[#806B5C] mt-0.5">Across active salon bay stock</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Low-Stock Alerts</p>
          <p className="font-['Montserrat'] text-xl text-rose-600 dark:text-rose-400 mt-0.5 font-light">
            {lowStockItems.length}
          </p>
          <p className="text-[10px] text-rose-500 mt-0.5">Under minimum buffer</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Catalogue Value</p>
          <p className="font-['Montserrat'] text-xl text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-light">
            ₹{branchInventory.reduce((a, b) => a + (b.quantity * (b.costPrice || b.unitPrice || 800)), 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5">At wholesale cost</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Active Categories</p>
          <p className="font-['Montserrat'] text-xl text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-light">
            {categories.length}
          </p>
          <p className="text-[10px] text-[#806B5C] mt-0.5">Color, Scalp, Skincare, Nails</p>
        </Card>
      </div>

      {/* Low-stock warning banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Reorder Alert:</strong> {lowStockItems.map(i => `${i.name} (${i.quantity} units remaining)`).join(', ')}.
            </span>
          </div>
          <button
            onClick={() => {
              const item = lowStockItems[0];
              setStockModalItem({ item, type: 'add' });
              setStockDelta(12);
              setStockReason('restock');
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium cursor-pointer shrink-0"
          >
            Quick Restock
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: PRODUCT CATALOGUE
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'catalogue' && (
        <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[200px] flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#806B5C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product name, SKU or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-lg text-[#41332B] dark:text-[#f5eee6] focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-lg text-[#41332B] dark:text-[#f5eee6] focus:outline-none"
              >
                <option value="all">All Product Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNewItemModal(true)}
              className="text-xs bg-[#41332B] hover:bg-[#2b1810] text-white flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Product
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Product Item</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Wholesale / Retail</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-right">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                {filteredInventory.map(item => {
                  const isLow = item.quantity <= (item.minThreshold || 5);
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF6F1]/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{item.name}</p>
                        <p className="text-[10px] text-[#806B5C] dark:text-[#a89582]">Buffer safety: {item.minThreshold || 5} units</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#B99470]">{item.sku}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[10px] uppercase font-semibold text-[#806B5C] dark:text-[#c2b3a3]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono text-sm font-bold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-[#41332B] dark:text-[#f5eee6]'}`}>
                          {item.quantity}
                        </span>
                        {isLow && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[9px] font-bold border border-rose-300 dark:border-rose-800">
                            LOW
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span>₹{item.costPrice || item.unitPrice || 650}</span>
                        {item.price && <span className="text-[#806B5C]"> / ₹{item.price}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-[#806B5C] text-[11px]">{item.supplier || 'Luxury Salon Importers'}</td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setStockModalItem({ item, type: 'add' });
                            setStockDelta(10);
                            setStockReason('restock');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-300 dark:border-emerald-800/40 cursor-pointer"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => {
                            setStockModalItem({ item, type: 'use' });
                            setStockDelta(1);
                            setStockReason('service_usage');
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-semibold border border-amber-300 dark:border-amber-800/40 cursor-pointer"
                        >
                          - Use in Ritual
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

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: STOCK MOVEMENT AUDIT TRAIL
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'movements' && (
        <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8D8C7]/60 dark:border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                Auditable Stock Movements
              </h2>
              <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                Permanent history of intake deliveries, ritual consumption, and shrinkage adjustments.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {movements.map(mov => (
              <div
                key={mov.id}
                className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/[0.02] border border-[#E8D8C7]/60 dark:border-[#3a2820] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      mov.quantityDelta > 0 
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {mov.quantityDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{mov.itemName}</h4>
                    <p className="text-[11px] text-[#806B5C]">
                      Reason: <span className="capitalize">{mov.reason.replace('_', ' ')}</span> • {mov.notes || 'Routine inventory action'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-bold text-xs ${mov.quantityDelta > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta} units
                  </span>
                  <p className="text-[10px] text-[#806B5C] mt-0.5">
                    {new Date(mov.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          STOCK ADJUSTMENT MODAL
      ═════════════════════════════════════════════════════════════════════ */}
      {stockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6] pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              {stockModalItem.type === 'add' ? 'Restock Product Units' : 'Record Service Consumption'}
            </h3>

            <p className="text-xs text-[#806B5C] mt-2">
              Product: <span className="font-semibold text-[#41332B] dark:text-[#f5eee6]">{stockModalItem.item.name}</span>
            </p>

            <form onSubmit={handleStockSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Units to {stockModalItem.type === 'add' ? 'Add' : 'Deduct'}</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={stockDelta}
                  onChange={e => setStockDelta(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Reason Code</label>
                <select
                  value={stockReason}
                  onChange={e => setStockReason(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                >
                  <option value="restock">Direct Supplier Intake / Restock</option>
                  <option value="service_usage">Used in Guest Treatment Ritual</option>
                  <option value="retail_sale">Sold at Front Desk POS</option>
                  <option value="adjustment">Audit Recount & Spoilage Adjustment</option>
                  <option value="transfer">Inter-Branch Stock Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Audit Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={stockNotes}
                  onChange={e => setStockNotes(e.target.value)}
                  placeholder="e.g. Received PO-8821 from importer"
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button type="button" variant="outline" size="sm" onClick={() => setStockModalItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white">
                  Confirm Movement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          ADD PRODUCT MODAL
      ═════════════════════════════════════════════════════════════════════ */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6] pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              Catalogue New Product Formulary
            </h3>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kérastase Chronologiste Masque"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KER-CHRON-500"
                    value={newItemSku}
                    onChange={e => setNewItemSku(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  >
                    <option value="Hair Color">Hair Color & Developer</option>
                    <option value="Hair Care">Hair Care & Masks</option>
                    <option value="Scalp Care">Scalp Rituals</option>
                    <option value="Nails">Nail & Cuticle Care</option>
                    <option value="Skincare">Facial & Aesthetic Serums</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Initial Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={newItemQuantity}
                    onChange={e => setNewItemQuantity(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Min Safety Buffer</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemMinThreshold}
                    onChange={e => setNewItemMinThreshold(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Wholesale Cost (INR)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItemCostPrice}
                    onChange={e => setNewItemCostPrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Retail Price (INR)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItemRetailPrice}
                    onChange={e => setNewItemRetailPrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Supplier</label>
                <input
                  type="text"
                  value={newItemSupplier}
                  onChange={e => setNewItemSupplier(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewItemModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white">
                  Add to Formulary
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
