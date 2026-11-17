import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Service, ServiceCategory, Offer } from '../../types/salon';
import { 
  Scissors, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Tag, 
  Layers, 
  PlusCircle, 
  CheckCircle2, 
  X, 
  Clock, 
  Check, 
  ShieldCheck, 
  Percent, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ServiceAddon {
  id: string;
  salonId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

const DEFAULT_ADDONS: ServiceAddon[] = [
  {
    id: 'addon-1',
    salonId: 'salon-glamoure-jubilee',
    name: 'Olaplex No. 1 & 2 Bond Multiplier',
    description: 'Patented bis-aminopropyl diglycol dimaleate complex protecting bonds during lightening.',
    price: 1800,
    durationMinutes: 15,
    category: 'Hair Color & Lightening',
    isActive: true,
  },
  {
    id: 'addon-2',
    salonId: 'salon-glamoure-jubilee',
    name: 'K18 Molecular Repair Mist',
    description: 'Bioactive peptide treatment reversing chemical damage in 4 minutes.',
    price: 1500,
    durationMinutes: 10,
    category: 'Hair Care',
    isActive: true,
  },
  {
    id: 'addon-3',
    salonId: 'salon-glamoure-jubilee',
    name: 'Caviar Scalp Exfoliation & Steam',
    description: 'Micro-exfoliating salicylic acid ritual with soothing ozone aromatherapy mist.',
    price: 2200,
    durationMinutes: 20,
    category: 'Scalp & Rituals',
    isActive: true,
  },
  {
    id: 'addon-4',
    salonId: 'salon-glamoure-jubilee',
    name: '24K Gold Collagen Eye Contour Patch',
    description: 'Cooling hydrogel infusion brightening periorbital zone during hair styling.',
    price: 950,
    durationMinutes: 15,
    category: 'Aesthetic Add-on',
    isActive: true,
  },
];

export const OwnerServicesPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // 4 Core Tabs: Services, Categories, Add-ons, Offers
  const [activeTab, setActiveTab] = useState<'services' | 'categories' | 'addons' | 'offers'>('services');

  // Common Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Data Sources
  const [services, setServices] = useState<Service[]>(() => db.getServicesBySalon(currentSalonId));
  const [categories, setCategories] = useState<ServiceCategory[]>(() => db.getCategoriesBySalon(currentSalonId));
  const [offers, setOffers] = useState<Offer[]>(() => db.getOffersBySalon(currentSalonId));
  const [addons, setAddons] = useState<ServiceAddon[]>(() => {
    const saved = localStorage.getItem(`glamoure_addons_${currentSalonId}`);
    return saved ? JSON.parse(saved) : DEFAULT_ADDONS;
  });

  const persistAddons = (items: ServiceAddon[]) => {
    setAddons(items);
    localStorage.setItem(`glamoure_addons_${currentSalonId}`, JSON.stringify(items));
  };

  const refreshData = () => {
    setServices(db.getServicesBySalon(currentSalonId));
    setCategories(db.getCategoriesBySalon(currentSalonId));
    setOffers(db.getOffersBySalon(currentSalonId));
  };

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(4500);
  const [serviceDuration, setServiceDuration] = useState<number>(60);
  const [serviceCategoryId, setServiceCategoryId] = useState('cat-hair');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceBuffer, setServiceBuffer] = useState<number>(10);

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // Add-on Modal
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [addonName, setAddonName] = useState('');
  const [addonDesc, setAddonDesc] = useState('');
  const [addonPrice, setAddonPrice] = useState<number>(1200);
  const [addonDuration, setAddonDuration] = useState<number>(15);

  // Offer Modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerCode, setOfferCode] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerPercent, setOfferPercent] = useState<number>(15);
  const [offerMinSpend, setOfferMinSpend] = useState<number>(3000);
  const [offerValidTo, setOfferValidTo] = useState('2026-12-31');

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = activeCategoryFilter === 'all' || s.categoryId === activeCategoryFilter;
      const matchSearch = !searchTerm.trim() || 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, activeCategoryFilter, searchTerm]);

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    if (!searchTerm.trim()) return offers;
    return offers.filter(o => 
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  // Handlers
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceName('');
    setServicePrice(4500);
    setServiceDuration(60);
    setServiceCategoryId(categories[0]?.id || 'cat-hair');
    setServiceDescription('');
    setServiceBuffer(10);
    setShowServiceModal(true);
  };

  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceName(srv.name);
    setServicePrice(srv.price);
    setServiceDuration(srv.durationMinutes);
    setServiceCategoryId(srv.categoryId);
    setServiceDescription(srv.description);
    setServiceBuffer(srv.bufferMinutes || 10);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      showToast('Validation Error', 'Service name is required.');
      return;
    }

    const cat = categories.find(c => c.id === serviceCategoryId);

    if (editingService) {
      db.updateService(editingService.id, {
        name: serviceName.trim(),
        price: Number(servicePrice),
        durationMinutes: Number(serviceDuration),
        bufferMinutes: Number(serviceBuffer),
        categoryId: serviceCategoryId,
        categoryName: cat?.name || 'Hair',
        description: serviceDescription.trim(),
      });
      showToast('Ritual Updated', `${serviceName} saved. Note: Historic appointments preserve their snapshot price.`);
    } else {
      const newService: Service = {
        id: `srv-${Date.now()}`,
        salonId: currentSalonId,
        categoryId: serviceCategoryId,
        categoryName: cat?.name || 'Hair',
        name: serviceName.trim(),
        slug: serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: serviceDescription.trim(),
        durationMinutes: Number(serviceDuration),
        price: Number(servicePrice),
        bufferMinutes: Number(serviceBuffer),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.createService(newService);
      showToast('Ritual Added', `${serviceName} is now live in the booking catalogue.`);
    }

    refreshData();
    setShowServiceModal(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: ServiceCategory = {
      id: `cat-${Date.now()}`,
      salonId: currentSalonId,
      name: catName.trim(),
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catDescription.trim(),
      sortOrder: categories.length + 1,
      isActive: true,
    };

    db.createCategory(newCat);
    refreshData();
    setShowCategoryModal(false);
    setCatName('');
    setCatDescription('');
    showToast('Category Created', `${newCat.name} added to service taxonomy.`);
  };

  const handleCreateAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonName.trim()) return;

    const newAddon: ServiceAddon = {
      id: `addon-${Date.now()}`,
      salonId: currentSalonId,
      name: addonName.trim(),
      description: addonDesc.trim(),
      price: Number(addonPrice),
      durationMinutes: Number(addonDuration),
      category: 'Treatment Booster',
      isActive: true,
    };

    const updated = [...addons, newAddon];
    persistAddons(updated);
    setShowAddonModal(false);
    setAddonName('');
    setAddonDesc('');
    showToast('Add-on Added', `${newAddon.name} treatment booster created.`);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCode.trim() || !offerTitle.trim()) return;

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      salonId: currentSalonId,
      code: offerCode.trim().toUpperCase(),
      title: offerTitle.trim(),
      type: 'percentage',
      discountPercent: Number(offerPercent),
      minSpend: Number(offerMinSpend),
      validFrom: new Date().toISOString().split('T')[0],
      validTo: offerValidTo,
      usageCount: 0,
      isActive: true,
    };

    db.createOffer(newOffer);
    refreshData();
    setShowOfferModal(false);
    setOfferCode('');
    setOfferTitle('');
    showToast('Promotion Created', `Campaign ${newOffer.code} is now active.`);
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER & 4-TAB NAVIGATION
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Services & Pricing
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Manage salon ritual catalogue, category taxonomy, treatment add-ons, and promotional offers.
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'addons'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add-ons ({addons.length})
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#41332B] text-white shadow-xs'
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Offers ({offers.length})
          </button>
        </div>
      </div>

      {/* Snapshot Preservation Transparency Note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
        <ShieldCheck className="w-4 h-4 text-[#B99470] shrink-0" />
        <span>
          <strong>Price Snapshot Integrity:</strong> Editing a ritual's price applies immediately to new appointments. Past appointments and issued GST tax invoices retain their exact historical price snapshots.
        </span>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: SERVICES
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {/* Action and Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[220px] flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#806B5C]" />
                <input
                  type="text"
                  placeholder="Search services by ritual name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#41332B]"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#41332B] text-white border-[#41332B]'
                      : 'border-[#E8D8C7] dark:border-white/10 text-[#806B5C] hover:text-[#41332B]'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategoryFilter === cat.id
                        ? 'bg-[#41332B] text-white border-[#41332B]'
                        : 'border-[#E8D8C7] dark:border-white/10 text-[#806B5C] hover:text-[#41332B]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateService}
              className="flex items-center gap-1.5 text-xs shrink-0 bg-[#41332B] hover:bg-[#2b1810] text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ritual Service
            </Button>
          </div>

          {/* Services Table */}
          <Card className="bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ritual Name</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Duration</th>
                    <th className="py-3 px-4 font-semibold">Station Buffer</th>
                    <th className="py-3 px-4 font-semibold">Current Price (INR)</th>
                    <th className="py-3 px-4 font-semibold">Catalogue Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#806B5C] dark:text-[#a89582]">
                        No services match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map(service => {
                      const category = categories.find(c => c.id === service.categoryId);
                      return (
                        <tr key={service.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{service.name}</p>
                            <p className="text-[11px] text-[#806B5C] dark:text-[#a89582] max-w-sm truncate">{service.description}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px] border-[#E8D8C7] dark:border-white/10 text-[#806B5C]">
                              {category?.name || service.categoryName || 'Hair'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-[#41332B] dark:text-[#f5eee6]">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-[#B99470]" />
                              {service.durationMinutes} mins
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#806B5C] dark:text-[#a89582]">
                            +{service.bufferMinutes || 10}m prep
                          </td>
                          <td className="py-3 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                            ₹{service.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              Active in Booking
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditService(service)}
                              className="text-xs px-2.5 py-1 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit Pricing
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: CATEGORIES
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              Categories structure the client booking navigation flow and service allocation.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCategoryModal(true)}
              className="text-xs bg-[#41332B] text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat, idx) => {
              const count = services.filter(s => s.categoryId === cat.id).length;
              return (
                <Card key={cat.id} className="p-4 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-wider uppercase text-[#B99470] font-semibold">Tier {idx + 1}</span>
                    <Badge variant="outline" className="text-[10px] border-[#E8D8C7] text-[#806B5C]">
                      {count} Rituals
                    </Badge>
                  </div>
                  <h3 className="font-medium text-[#41332B] dark:text-[#f5eee6]">{cat.name}</h3>
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582] line-clamp-2">
                    {cat.description || 'Curated luxury salon services and artisan care.'}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: ADD-ONS & TREATMENT BOOSTERS
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'addons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              Add-ons are modular upgrades attached during checkout or on-floor consultation.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddonModal(true)}
              className="text-xs bg-[#41332B] text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Treatment Add-on
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addons.map(addon => (
              <Card key={addon.id} className="p-4 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-wider uppercase text-[#B99470] font-semibold">{addon.category}</span>
                  <span className="font-semibold text-sm text-[#41332B] dark:text-[#f5eee6]">₹{addon.price.toLocaleString('en-IN')}</span>
                </div>
                <h3 className="font-medium text-sm text-[#41332B] dark:text-[#f5eee6]">{addon.name}</h3>
                <p className="text-xs text-[#806B5C] dark:text-[#a89582]">{addon.description}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#E8D8C7]/50 dark:border-white/5 text-[11px] text-[#806B5C]">
                  <Clock className="w-3.5 h-3.5 text-[#B99470]" />
                  <span>+{addon.durationMinutes} mins service time</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 4: OFFERS & PROMOTIONAL CAMPAIGNS
      ═════════════════════════════════════════════ */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#221612] p-3 rounded-xl border border-[#E8D8C7]/80 dark:border-[#3d2a21]">
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              Manage promotional promo codes, first-visit privileges, and seasonal vouchers.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowOfferModal(true)}
              className="text-xs bg-[#41332B] text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Launch Promo Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOffers.map(offer => (
              <Card key={offer.id} className="p-4 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs border-[#B99470] text-[#B99470]">
                    {offer.code}
                  </Badge>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {offer.discountPercent ? `${offer.discountPercent}% OFF` : `₹${offer.discountAmount} FLAT`}
                  </span>
                </div>
                <h3 className="font-medium text-sm text-[#41332B] dark:text-[#f5eee6]">{offer.title}</h3>
                <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                  Valid until {offer.validTo} • Min spend ₹{offer.minSpend || 0}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8D8C7]/50 dark:border-white/5 text-[11px] text-[#806B5C]">
                  <span>Used {offer.usageCount} times</span>
                  <span className="text-emerald-600">Active</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          SERVICE EDIT/CREATE MODAL
      ═════════════════════════════════════════════ */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6]">
                {editingService ? `Edit ${editingService.name}` : 'Create New Ritual'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="text-[#806B5C] hover:text-[#41332B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Ritual Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature Haute Balayage"
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={servicePrice}
                    onChange={e => setServicePrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Category</label>
                  <select
                    value={serviceCategoryId}
                    onChange={e => setServiceCategoryId(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Service Duration (mins)</label>
                  <input
                    type="number"
                    required
                    min={15}
                    step={15}
                    value={serviceDuration}
                    onChange={e => setServiceDuration(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Buffer / Prep (mins)</label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={serviceBuffer}
                    onChange={e => setServiceBuffer(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Editorial Description</label>
                <textarea
                  rows={3}
                  value={serviceDescription}
                  onChange={e => setServiceDescription(e.target.value)}
                  placeholder="Describe the consultation, application technique, and hair finish..."
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowServiceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#41332B] text-white hover:bg-[#2b1810]"
                >
                  {editingService ? 'Save Ritual Changes' : 'Create Ritual'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6] pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              Add Category
            </h3>
            <form onSubmit={handleCreateCategory} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal & Haute Styling"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Description</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={e => setCatDescription(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDON MODAL */}
      {showAddonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6] pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              Add Treatment Add-on
            </h3>
            <form onSubmit={handleCreateAddon} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Add-on Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerastase Fusio-Dose Concentrate"
                  value={addonName}
                  onChange={e => setAddonName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={addonPrice}
                    onChange={e => setAddonPrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={addonDuration}
                    onChange={e => setAddonDuration(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Description</label>
                <textarea
                  rows={2}
                  value={addonDesc}
                  onChange={e => setAddonDesc(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddonModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white">Save Add-on</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1f1511] rounded-2xl border border-[#E8D8C7] dark:border-[#3d2a21] shadow-2xl p-5 text-left font-['Plus_Jakarta_Sans']">
            <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6] pb-3 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
              Launch Campaign Offer
            </h3>
            <form onSubmit={handleCreateOffer} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUXE20"
                    value={offerCode}
                    onChange={e => setOfferCode(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Discount %</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={offerPercent}
                    onChange={e => setOfferPercent(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Haute Privilege"
                  value={offerTitle}
                  onChange={e => setOfferTitle(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Min Spend (INR)</label>
                  <input
                    type="number"
                    min={0}
                    value={offerMinSpend}
                    onChange={e => setOfferMinSpend(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#41332B] dark:text-[#f5eee6]">Valid Until</label>
                  <input
                    type="date"
                    value={offerValidTo}
                    onChange={e => setOfferValidTo(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8D8C7]/80 dark:border-[#3d2a21]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#41332B] text-white">Activate Offer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
