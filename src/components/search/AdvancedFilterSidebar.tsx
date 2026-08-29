import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Check, 
  Star, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Layers, 
  Tag, 
  SlidersHorizontal,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tv,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { 
  Category, 
  Brand, 
  SearchResultsResponse, 
  AvailableFeatureFacet,
  AdvancedFilterState 
} from '../../types/index.js';

interface AdvancedFilterSidebarProps {
  filterState: AdvancedFilterState;
  searchResults: SearchResultsResponse | null;
  onFilterChange: (newPartialState: Partial<AdvancedFilterState>) => void;
  onClearAll: () => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const AdvancedFilterSidebar: React.FC<AdvancedFilterSidebarProps> = ({
  filterState,
  searchResults,
  onFilterChange,
  onClearAll,
  isMobileDrawer = false,
  onCloseMobile
}) => {
  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    score: true,
    verdict: true,
    features: true,
    sentiment: false,
    mentions: false
  });

  // Local state for brand search within filter
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // Local price input values
  const [localMinPrice, setLocalMinPrice] = useState<string>(
    filterState.minPrice !== undefined ? String(filterState.minPrice) : ''
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    filterState.maxPrice !== undefined ? String(filterState.maxPrice) : ''
  );

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = searchResults?.categories || [];
  const brands = searchResults?.brands || [];
  const availableCategories = searchResults?.availableCategories || [];
  const availableBrands = searchResults?.availableBrands || [];
  const availableFeatures = searchResults?.availableFeatures || [];
  const facets = searchResults?.facets;

  // Filter brands by inline search
  const filteredBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return brands;
    const q = brandSearchQuery.toLowerCase();
    return brands.filter(b => b.name.toLowerCase().includes(q));
  }, [brands, brandSearchQuery]);

  // Handle Brand Toggle (Multi-select)
  const handleBrandToggle = (brandSlug: string) => {
    const current = [...filterState.brands];
    const index = current.indexOf(brandSlug);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(brandSlug);
    }
    onFilterChange({ brands: current });
  };

  // Handle Verdict Toggle (Multi-select)
  const handleVerdictToggle = (verdict: string) => {
    const current = [...filterState.verdicts];
    const index = current.indexOf(verdict);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(verdict);
    }
    onFilterChange({ verdicts: current });
  };

  // Handle Feature Tag Toggle
  const handleFeatureToggle = (featureId: string) => {
    const current = [...filterState.features];
    const index = current.indexOf(featureId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(featureId);
    }
    onFilterChange({ features: current });
  };

  // Apply Price Inputs
  const handlePriceApply = () => {
    const min = localMinPrice ? parseInt(localMinPrice, 10) : undefined;
    const max = localMaxPrice ? parseInt(localMaxPrice, 10) : undefined;
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  // Quick price preset chips
  const handlePricePreset = (min?: number, max?: number) => {
    setLocalMinPrice(min !== undefined ? String(min) : '');
    setLocalMaxPrice(max !== undefined ? String(max) : '');
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (filterState.category && filterState.category !== 'all') count++;
    count += filterState.brands.length;
    if (filterState.minPrice !== undefined || filterState.maxPrice !== undefined) count++;
    if (filterState.minScore !== undefined && filterState.minScore > 0) count++;
    count += filterState.verdicts.length;
    if (filterState.minPositive !== undefined && filterState.minPositive > 0) count++;
    if (filterState.minMentions !== undefined && filterState.minMentions > 0) count++;
    if (filterState.discountOnly) count++;
    count += filterState.features.length;
    return count;
  }, [filterState]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
              Gelişmiş Filtreler
            </h3>
            {activeCount > 0 && (
              <span className="text-[11px] font-bold text-indigo-600">
                {activeCount} Aktif Filtre
              </span>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* Main Filter Sections Accordion */}
      <div className="p-4 sm:p-5 space-y-6 divide-y divide-slate-100 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">

        {/* 1. SADECE İNDİRİM & FIRSAT TOGGLE */}
        <div className="pt-2">
          <label className="relative flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 cursor-pointer hover:border-amber-300 transition-all select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                <Flame className="w-4 h-4 fill-amber-200 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  Sadece Fırsat Ürünleri
                </span>
                <span className="text-[10px] text-amber-800 font-medium">
                  Doğrulanmış indirim veya üstün F/P
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={filterState.discountOnly || false}
              onChange={(e) => onFilterChange({ discountOnly: e.target.checked })}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
            />
          </label>
        </div>

        {/* 2. KATEGORİLER */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Kategori</span>
            </div>
            {openSections.categories ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.categories && (
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => onFilterChange({ category: 'all' })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterState.category === 'all' || !filterState.category
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tüm Kategoriler</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold">
                  {searchResults?.total || 0}
                </span>
              </button>

              {categories.map((cat) => {
                const isSelected = filterState.category === cat.slug || filterState.category === cat.id;
                const matchedCount = availableCategories.find(c => c.id === cat.id)?.count || 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onFilterChange({ category: cat.slug })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {matchedCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. MARKALAR (Çoklu Seçim) */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Markalar {filterState.brands.length > 0 && `(${filterState.brands.length})`}</span>
            </div>
            {openSections.brands ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.brands && (
            <div className="space-y-2.5 pt-1">
              {/* Inline Brand Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Marka ara..."
                  value={brandSearchQuery}
                  onChange={(e) => setBrandSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {brandSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setBrandSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Brands Checkbox List */}
              <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {filteredBrands.map((b) => {
                  const isChecked = filterState.brands.includes(b.slug) || filterState.brands.includes(b.id);
                  const count = availableBrands.find(ab => ab.id === b.id)?.count || 0;

                  return (
                    <label
                      key={b.id}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors select-none ${
                        isChecked ? 'bg-indigo-50/70 font-bold text-indigo-950' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(b.slug)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="truncate">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-1">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. FİYAT ARALIĞI (TL) */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-indigo-500 font-black text-xs">₺</span>
              <span>Fiyat Aralığı</span>
            </div>
            {openSections.price ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.price && (
            <div className="space-y-3 pt-1">
              {/* Preset Price Chips */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePricePreset(undefined, 15000)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-center"
                >
                  &lt; 15.000 ₺
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(15000, 35000)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-center"
                >
                  15k - 35k ₺
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(35000, 65000)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-center"
                >
                  35k - 65k ₺
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset(65000, undefined)}
                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-center"
                >
                  65.000 ₺+
                </button>
              </div>

              {/* Min - Max Inputs */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">En Az</span>
                  <input
                    type="number"
                    placeholder="0 ₺"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-slate-300 self-end pb-2">-</span>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">En Çok</span>
                  <input
                    type="number"
                    placeholder="Max ₺"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handlePriceApply}
                className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Fiyatı Uygula
              </button>
            </div>
          )}
        </div>

        {/* 5. NEDİYOR KONSENSÜS SKORU */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('score')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>NeDiyor Puanı</span>
            </div>
            {openSections.score ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.score && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { label: 'Tümü', value: undefined },
                { label: '9.0+ Efsane', value: 9.0 },
                { label: '8.5+ Üstün', value: 8.5 },
                { label: '8.0+ Çok İyi', value: 8.0 },
                { label: '7.0+ İyi', value: 7.0 }
              ].map((tier) => {
                const isSelected = filterState.minScore === tier.value;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => onFilterChange({ minScore: tier.value })}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 border border-slate-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. SATIN ALMA KARARI (VERDICT) */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('verdict')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Satın Alma Kararı</span>
            </div>
            {openSections.verdict ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.verdict && (
            <div className="space-y-1.5 pt-1">
              {[
                { 
                  id: 'ALINIR', 
                  label: 'Alınır (Önerilen)', 
                  badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  count: facets?.verdictCounts?.ALINIR || 0 
                },
                { 
                  id: 'DUSUNULEBILIR', 
                  label: 'Düşünülebilir', 
                  badge: 'bg-amber-50 text-amber-800 border-amber-200',
                  count: facets?.verdictCounts?.DUSUNULEBILIR || 0 
                },
                { 
                  id: 'ALTERNATIFLERE_BAK', 
                  label: 'Alternatif Ara', 
                  badge: 'bg-rose-50 text-rose-800 border-rose-200',
                  count: facets?.verdictCounts?.ALTERNATIFLERE_BAK || 0 
                }
              ].map((v) => {
                const isChecked = filterState.verdicts.includes(v.id);
                return (
                  <label
                    key={v.id}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors select-none ${
                      isChecked ? 'bg-indigo-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleVerdictToggle(v.id)}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${v.badge}`}>
                        {v.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{v.count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. ÖNE ÇIKAN DONANIM VE ÖZELLİKLER */}
        {availableFeatures.length > 0 && (
          <div className="pt-5 space-y-3">
            <button
              type="button"
              onClick={() => toggleSection('features')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Özellik & Donanım</span>
              </div>
              {openSections.features ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.features && (
              <div className="space-y-1 pt-1 max-h-48 overflow-y-auto no-scrollbar">
                {availableFeatures.map((feat) => {
                  const isChecked = filterState.features.includes(feat.id);
                  return (
                    <label
                      key={feat.id}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors select-none ${
                        isChecked ? 'bg-indigo-50 font-bold text-indigo-950' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFeatureToggle(feat.id)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="truncate">{feat.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-1">
                        {feat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 8. TÜKETİCİ MEMNUNİYET ORANI (% OLUMLU) */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('sentiment')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Memnuniyet Oranı</span>
            </div>
            {openSections.sentiment ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sentiment && (
            <div className="space-y-1 pt-1">
              {[
                { label: 'Tüm Oranlar', value: undefined },
                { label: '%90 ve Üzeri Olumlu', value: 90 },
                { label: '%80 ve Üzeri Olumlu', value: 80 },
                { label: '%70 ve Üzeri Olumlu', value: 70 }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onFilterChange({ minPositive: item.value })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    filterState.minPositive === item.value
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 9. BAHİS & YORUM HACMİ */}
        <div className="pt-5 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('mentions')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Bahis & Yorum Sayısı</span>
            </div>
            {openSections.mentions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.mentions && (
            <div className="space-y-1 pt-1">
              {[
                { label: 'Tüm Modeller', value: undefined },
                { label: '500+ Yorum & Bahis', value: 500 },
                { label: '1.000+ Yorum (Popüler)', value: 1000 },
                { label: '2.500+ Yorum (Kanıtlanmış)', value: 2500 }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onFilterChange({ minMentions: item.value })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    filterState.minMentions === item.value
                      ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Footer with Apply Button */}
      {isMobileDrawer && (
        <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 flex gap-2">
          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            Sıfırla
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-md"
          >
            {searchResults?.filteredCount || 0} Sonucu Göster
          </button>
        </div>
      )}

    </div>
  );
};
