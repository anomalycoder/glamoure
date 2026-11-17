import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import type { Service, ServiceCategory } from '../../types/salon';
import { Plus, Scissors, Check, X, Edit3, Trash2, Sparkles, Image, CheckCircle2, XCircle } from 'lucide-react';

export const OwnerServicesPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTabCategory, setActiveTabCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(4500);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [categoryId, setCategoryId] = useState('cat-hair');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/services/balayage.jpg');

  const [services, setServices] = useState<Service[]>(() => db.getServicesBySalon(currentSalonId));
  const categories: ServiceCategory[] = db.getCategoriesBySalon(currentSalonId);

  const refreshServices = () => {
    setServices(db.getServicesBySalon(currentSalonId));
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setPrice(4500);
    setDurationMinutes(60);
    setCategoryId('cat-hair');
    setDescription('');
    setImageUrl('/services/balayage.jpg');
    setShowModal(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setPrice(srv.price);
    setDurationMinutes(srv.durationMinutes);
    setCategoryId(srv.categoryId);
    setDescription(srv.description);
    setImageUrl(srv.imageUrl || '/services/balayage.jpg');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Validation Error', 'Service ritual name is required.');
      return;
    }

    // Backend validation: price > 0, duration >= 15
    if (price <= 0) {
      showToast('Validation Error', 'Service price must be greater than ₹0.');
      return;
    }
    if (durationMinutes < 15) {
      showToast('Validation Error', 'Service duration must be at least 15 minutes.');
      return;
    }

    const cat = categories.find(c => c.id === categoryId);

    if (editingService) {
      // Edit
      const updated = db.updateService(editingService.id, {
        name: name.trim(),
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        categoryId,
        categoryName: cat?.name || 'Hair',
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
      if (updated) {
        showToast('Ritual Updated', `${updated.name} parameters refreshed.`);
      }
    } else {
      // Create
      const newSrv = db.createService({
        id: `srv-${Date.now()}`,
        salonId: currentSalonId,
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        bufferMinutes: 15,
        categoryId,
        categoryName: cat?.name || 'Hair',
        description: description.trim(),
        isActive: true,
        imageUrl: imageUrl.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast('Ritual Published', `${newSrv.name} now live in catalogue.`);
    }

    setShowModal(false);
    refreshServices();
  };

  const handleToggleArchive = (srv: Service) => {
    const updated = db.updateService(srv.id, { isActive: !srv.isActive });
    if (updated) {
      showToast('Catalogue Updated', `${srv.name} is now ${updated.isActive ? 'active' : 'archived'}.`);
      refreshServices();
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = activeTabCategory === 'all' || s.categoryId === activeTabCategory;
      const matchSearch = searchTerm === '' ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, activeTabCategory, searchTerm]);

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Service Rituals & Formulary
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Curate signature treatments across Hair, Skin, Nails, and Spa & Wellness with real-time customer sync.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ritual</span>
        </Button>
      </div>

      {/* 4 Primary Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTabCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTabCategory === 'all'
              ? 'bg-[#41332b] text-[#efc9a5] border border-[#b99470]/40'
              : 'bg-white/5 text-[#c2b3a3] hover:text-[#f5eee6]'
          }`}
        >
          All Rituals ({services.length})
        </button>
        {categories.map(cat => {
          const count = services.filter(s => s.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTabCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTabCategory === cat.id
                  ? 'bg-[#41332b] text-[#efc9a5] border border-[#b99470]/40'
                  : 'bg-white/5 text-[#c2b3a3] hover:text-[#f5eee6]'
              }`}
            >
              <span>{cat.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(srv => (
          <Card
            key={srv.id}
            className="p-5 bg-[#201511] border-[#3a2820] hover:border-[#b99470]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={srv.isActive ? 'success' : 'outline'} className="text-[9px] uppercase tracking-wider mb-2">
                    {srv.categoryName || 'Ritual'}
                  </Badge>
                  <h3 className="font-semibold text-sm text-[#f5eee6]">{srv.name}</h3>
                </div>

                <span className="font-mono text-base font-bold text-[#efc9a5]">
                  ₹{srv.price.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-[#a89582] mt-2 line-clamp-2 leading-relaxed">
                {srv.description}
              </p>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-[#c2b3a3]">
                <span>Duration: <strong className="text-[#f5eee6]">{srv.durationMinutes} mins</strong></span>
                <span>Buffer: <strong className="text-[#a89582]">{srv.bufferMinutes || 15} mins</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={() => handleToggleArchive(srv)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                  srv.isActive 
                    ? 'border-neutral-700 text-neutral-400 hover:text-amber-300' 
                    : 'border-emerald-700 text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                {srv.isActive ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                <span>{srv.isActive ? 'Archive' : 'Restore'}</span>
              </button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(srv)}
                className="text-xs px-3 py-1 text-[#efc9a5] hover:text-[#f5eee6] border-white/10"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                <span>Configure</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Create or Edit Service */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-['Montserrat'] text-base text-[#f5eee6]">
                {editingService ? `Configure ${editingService.name}` : 'Curate New Service Ritual'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Ritual Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Scalp Rejuvenation & Ozone Steam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#2a1a15] border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] font-mono focus:outline-none focus:border-[#b99470]"
                  />
                </div>

                <div>
                  <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Image Asset Path</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89582] uppercase text-[10px] font-bold mb-1">Editorial Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Holistic botanical ritual purifying hair follicles and relieving tension..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs px-3 py-1.5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#b99470] hover:bg-[#a37f5d] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl">
                  {editingService ? 'Save Changes' : 'Publish Ritual'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
