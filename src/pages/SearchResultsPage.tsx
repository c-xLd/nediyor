import React, { useEffect, useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Search, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  List, 
  Tag, 
  RotateCcw,
  Flame,
  Star,
  Check
} from 'lucide-react';
import { useRouter } from '../lib/router.js';
import { api } from '../lib/api.js';
import { 
  SearchResultsResponse, 
  AdvancedFilterState, 
  Product 
} from '../types/index.js';
import { SearchBar } from '../components/search/SearchBar.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { AdvancedFilterSidebar } from '../components/search/AdvancedFilterSidebar.js';
import { ActiveFilterChips } from '../components/search/ActiveFilterChips.js';
import { ProductTableView } from '../components/search/ProductTableView.js';
import { QuickCompareBar } from '../components/search/QuickCompareBar.js';
import { ProductCardSkeleton } from '../components/ui/Skeleton.js';
import { EmptyState } from '../components/ui/EmptyState.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const SearchResultsPage: React.FC = () => {
  const { query: urlQuery, navigate } = useRouter();
  const [data, setData] = useState<SearchResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Selected Products for Quick Comparison (Max 4)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Parse filters from URL Query parameters
  const currentFilters: AdvancedFilterState = useMemo(() => {
    const q = urlQuery.q || '';
    const category = urlQuery.category || 'all';
    
    // Parse brands
    let brands: string[] = [];
    if (urlQuery.brands) {
      brands = urlQuery.brands.split(',').filter(Boolean);
    } else if (urlQuery.brand && urlQuery.brand !== 'all') {
      brands = [urlQuery.brand];
    }

    // Parse price
    const minPrice = urlQuery.minPrice ? parseInt(urlQuery.minPrice, 10) : undefined;
    const maxPrice = urlQuery.maxPrice ? parseInt(urlQuery.maxPrice, 10) : undefined;

    // Parse score
    const minScore = urlQuery.minScore ? parseFloat(urlQuery.minScore) : undefined;

    // Parse verdicts
    let verdicts: string[] = [];
    if (urlQuery.verdicts) {
      verdicts = urlQuery.verdicts.split(',').filter(Boolean);
    } else if (urlQuery.verdict && urlQuery.verdict !== 'all') {
      verdicts = [urlQuery.verdict];
    }

    // Parse sentiment & mentions
    const minPositive = urlQuery.minPositive ? parseInt(urlQuery.minPositive, 10) : undefined;
    const minMentions = urlQuery.minMentions ? parseInt(urlQuery.minMentions, 10) : undefined;

    // Parse discount
    const discountOnly = urlQuery.discountOnly === 'true' || urlQuery.discountOnly === '1';

    // Parse features
    let features: string[] = [];
    if (urlQuery.features) {
      features = urlQuery.features.split(',').filter(Boolean);
    }

    // Sort
    const sort = urlQuery.sort || 'score_desc';

    return {
      q,
      category,
      brands,
      minPrice,
      maxPrice,
      minScore,
      verdicts,
      minPositive,
      minMentions,
      discountOnly,
      features,
      sort
    };
  }, [urlQuery]);

  const loadResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.search({
        q: currentFilters.q,
        category: currentFilters.category,
        brands: currentFilters.brands,
        minPrice: currentFilters.minPrice,
        maxPrice: currentFilters.maxPrice,
        minScore: currentFilters.minScore,
        verdicts: currentFilters.verdicts,
        minPositive: currentFilters.minPositive,
        minMentions: currentFilters.minMentions,
        discountOnly: currentFilters.discountOnly,
        features: currentFilters.features,
        sort: currentFilters.sort
      });
      setData(res);
    } catch (err: any) {
      console.error('Search query error:', err);
      setError(err.message || 'Arama sonuçları alınırken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const titleText = currentFilters.q
      ? `"${currentFilters.q}" Gelişmiş Arama Sonuçları | NeDiyor`
      : 'Gelişmiş Ürün Filtreleme & Konsensüs Analizleri | NeDiyor';
    document.title = titleText;

    loadResults();
  }, [
    currentFilters.q,
    currentFilters.category,
    currentFilters.brands.join(','),
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.minScore,
    currentFilters.verdicts.join(','),
    currentFilters.minPositive,
    currentFilters.minMentions,
    currentFilters.discountOnly,
    currentFilters.features.join(','),
    currentFilters.sort
  ]);

  // Sync state changes back to URL Search Params
  const pushFiltersToUrl = (newPartial: Partial<AdvancedFilterState>) => {
    const nextState: AdvancedFilterState = {
      ...currentFilters,
      ...newPartial
    };

    const params = new URLSearchParams();
    if (nextState.q) params.set('q', nextState.q);
    if (nextState.category && nextState.category !== 'all') params.set('category', nextState.category);
    if (nextState.brands && nextState.brands.length > 0) params.set('brands', nextState.brands.join(','));
    if (nextState.minPrice !== undefined) params.set('minPrice', nextState.minPrice.toString());
    if (nextState.maxPrice !== undefined) params.set('maxPrice', nextState.maxPrice.toString());
    if (nextState.minScore !== undefined && nextState.minScore > 0) params.set('minScore', nextState.minScore.toString());
    if (nextState.verdicts && nextState.verdicts.length > 0) params.set('verdicts', nextState.verdicts.join(','));
    if (nextState.minPositive !== undefined && nextState.minPositive > 0) params.set('minPositive', nextState.minPositive.toString());
    if (nextState.minMentions !== undefined && nextState.minMentions > 0) params.set('minMentions', nextState.minMentions.toString());
    if (nextState.discountOnly) params.set('discountOnly', 'true');
    if (nextState.features && nextState.features.length > 0) params.set('features', nextState.features.join(','));
    if (nextState.sort && nextState.sort !== 'score_desc') params.set('sort', nextState.sort);

    navigate(`/ara?${params.toString()}`);
  };

  const handleSearchSubmit = (newQ: string) => {
    pushFiltersToUrl({ q: newQ.trim() });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    if (currentFilters.q) params.set('q', currentFilters.q);
    navigate(`/ara?${params.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const handleRemoveSingleFilter = (key: string, value?: string) => {
    if (key === 'category') {
      pushFiltersToUrl({ category: 'all' });
    } else if (key === 'brand' && value) {
      const updated = currentFilters.brands.filter(b => b !== value);
      pushFiltersToUrl({ brands: updated });
    } else if (key === 'price') {
      pushFiltersToUrl({ minPrice: undefined, maxPrice: undefined });
    } else if (key === 'minScore') {
      pushFiltersToUrl({ minScore: undefined });
    } else if (key === 'verdict' && value) {
      const updated = currentFilters.verdicts.filter(v => v !== value);
      pushFiltersToUrl({ verdicts: updated });
    } else if (key === 'minPositive') {
      pushFiltersToUrl({ minPositive: undefined });
    } else if (key === 'minMentions') {
      pushFiltersToUrl({ minMentions: undefined });
    } else if (key === 'discountOnly') {
      pushFiltersToUrl({ discountOnly: false });
    } else if (key === 'feature' && value) {
      const updated = currentFilters.features.filter(f => f !== value);
      pushFiltersToUrl({ features: updated });
    }
  };

  // Toggle selection for comparison
  const handleToggleCompare = (productId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          alert('En fazla 4 ürünü aynı anda karşılaştırabilirsiniz.');
          return prev;
        }
        return [...prev, productId];
      }
    });
  };

  // Active filter count calculation
  const totalActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (currentFilters.category && currentFilters.category !== 'all') count++;
    count += currentFilters.brands.length;
    if (currentFilters.minPrice !== undefined || currentFilters.maxPrice !== undefined) count++;
    if (currentFilters.minScore !== undefined && currentFilters.minScore > 0) count++;
    count += currentFilters.verdicts.length;
    if (currentFilters.minPositive !== undefined && currentFilters.minPositive > 0) count++;
    if (currentFilters.minMentions !== undefined && currentFilters.minMentions > 0) count++;
    if (currentFilters.discountOnly) count++;
    count += currentFilters.features.length;
    return count;
  }, [currentFilters]);

  return (
    <div className="min-h-screen py-6 sm:py-10 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Header & Search Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gelişmiş Konsensüs Filtreleme Sistemi</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
              Kriterlerinize En Uygun Ürünleri Filtreleyin
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Yapay zeka konsensüs skorları, gerçek kullanıcı memnuniyet oranları, donanım özellikleri ve canlı piyasa fiyatlarıyla filtreleyin.
            </p>

            <div className="pt-2">
              <SearchBar
                initialValue={currentFilters.q}
                size="large"
                onSearchSubmit={handleSearchSubmit}
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            <AdvancedFilterSidebar
              filterState={currentFilters}
              searchResults={data}
              onFilterChange={pushFiltersToUrl}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Right Column: Search Results & Controls */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            
            {/* Controls Bar: Title, Count, Mobile Trigger, View Switcher & Sorting */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Left: Result Count & Mobile Filter Button */}
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                    <span>Sonuçlar</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200">
                      {isLoading ? '...' : data?.filteredCount || 0} Ürün
                    </span>
                  </h2>
                  {currentFilters.q && (
                    <span className="text-xs text-slate-400 block mt-0.5">
                      "{currentFilters.q}" araması için
                    </span>
                  )}
                </div>

                {/* Mobile Filter Drawer Open Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtreler</span>
                  {totalActiveFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white text-indigo-900 text-[10px] flex items-center justify-center font-black">
                      {totalActiveFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Right: View Mode Toggle & Sort Dropdown */}
              <div className="flex items-center gap-2.5 justify-between sm:justify-end">
                
                {/* View Switcher: Grid vs Table */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-xl transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Katalog / Kart Görünümü"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-xl transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Karşılaştırmalı Liste / Tablo Görünümü"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <select
                    value={currentFilters.sort}
                    onChange={(e) => pushFiltersToUrl({ sort: e.target.value })}
                    aria-label="Sıralama Seçeneği"
                    className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="score_desc">NeDiyor Puanı (Yüksekten Düşüğe)</option>
                    <option value="score_asc">NeDiyor Puanı (Düşükten Yükseğe)</option>
                    <option value="price_asc">Fiyat (En Düşük)</option>
                    <option value="price_desc">Fiyat (En Yüksek)</option>
                    <option value="discount_desc">En Yüksek İndirim / Fırsat</option>
                    <option value="mentions_desc">En Çok Yorum Alan</option>
                    <option value="sentiment_desc">En Yüksek Memnuniyet Oranı</option>
                    <option value="release_desc">En Yeni Modeller</option>
                    <option value="name_asc">Ürün Adı (A'dan Z'ye)</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Active Filter Chips */}
            {data && (
              <ActiveFilterChips
                category={currentFilters.category}
                brands={currentFilters.brands}
                minPrice={currentFilters.minPrice}
                maxPrice={currentFilters.maxPrice}
                minScore={currentFilters.minScore}
                verdicts={currentFilters.verdicts}
                minPositive={currentFilters.minPositive}
                minMentions={currentFilters.minMentions}
                discountOnly={currentFilters.discountOnly}
                features={currentFilters.features}
                categoriesList={data.categories}
                brandsList={data.brands}
                featuresList={data.availableFeatures}
                onRemoveFilter={handleRemoveSingleFilter}
                onClearAll={handleClearAll}
              />
            )}

            {/* Results Grid / Table / Loading / Empty */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={loadResults} />
            ) : data && data.products.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelectedForCompare={selectedForCompare.includes(product.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              ) : (
                <ProductTableView
                  products={data.products}
                  selectedForCompare={selectedForCompare}
                  onToggleCompare={handleToggleCompare}
                />
              )
            ) : (
              <EmptyState
                title="Filtreleme kriterlerine uygun ürün bulunamadı"
                description={
                  currentFilters.q
                    ? `"${currentFilters.q}" araması ve seçtiğiniz filtrelerle eşleşen kayıt bulunamadı. Filtreleri esneterek tekrar deneyebilirsiniz.`
                    : 'Uyguladığınız filtreleme kriterleri çok kısıtlayıcı olabilir. Lütfen fiyat, puan veya marka filtrelerini sıfırlayın.'
                }
                actionLabel="Filtreleri Sıfırla"
                onAction={handleClearAll}
              />
            )}

          </main>

        </div>

      </div>

      {/* Mobile Slide-Over Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                  Filtreleri Düzenle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1">
              <AdvancedFilterSidebar
                filterState={currentFilters}
                searchResults={data}
                onFilterChange={pushFiltersToUrl}
                onClearAll={handleClearAll}
                isMobileDrawer={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Compare Bar (When products are selected) */}
      <QuickCompareBar
        selectedIds={selectedForCompare}
        allProducts={data?.products || []}
        onRemove={handleToggleCompare}
        onClear={() => setSelectedForCompare([])}
      />

    </div>
  );
};
