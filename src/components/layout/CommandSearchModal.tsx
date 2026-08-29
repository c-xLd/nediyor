import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Flame, 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Laptop, 
  Smartphone, 
  Headphones, 
  CornerDownLeft, 
  Clock, 
  Trash2, 
  TrendingUp,
  Building2,
  Layers,
  ArrowLeftRight,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useRouter } from '../../lib/router.js';
import { api } from '../../lib/api.js';
import { SearchAutocompleteResult } from '../../types/index.js';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'products' | 'categories' | 'brands' | 'tools';

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [results, setResults] = useState<SearchAutocompleteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    { title: 'iPhone 16 Pro', slug: 'apple-iphone-16-pro', category: 'Telefon' },
    { title: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', category: 'Telefon' },
    { title: 'MacBook Air M3', slug: 'apple-macbook-air-m3', category: 'Laptop' },
    { title: 'Roborock S8 Pro Ultra', slug: 'roborock-s8-pro-ultra', category: 'Süpürge' },
    { title: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', category: 'Kulaklık' },
    { title: 'Dyson V15 Detect', slug: 'dyson-v15-detect-absolute', category: 'Süpürge' },
  ];

  const quickTools = [
    { 
      title: 'Akıllı Ürün Bulucu', 
      desc: 'Bütçe ve ihtiyacınıza göre AI konsensüs önerisi', 
      href: '/urun-bulucu', 
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
      badge: 'AI Asistan'
    },
    { 
      title: 'Fırsat & Dip Fiyat Radarı', 
      desc: 'Tarihi dip fiyata inen doğrulanmış modeller', 
      href: '/firsat-radari', 
      icon: <Flame className="w-4 h-4 text-rose-600" />,
      badge: 'Canlı Fiyat'
    },
    { 
      title: 'Yükseltme Danışmanı', 
      desc: 'Eski modelinizden yeni modele geçmeye değer mi?', 
      href: '/yukseltme-danismani', 
      icon: <ArrowLeftRight className="w-4 h-4 text-indigo-600" />,
      badge: 'Kıyaslama'
    },
    { 
      title: 'Çoklu Karşılaştırıcı', 
      desc: '4 cihaza kadar teknik ve konsensüs karşılaştırması', 
      href: '/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra', 
      icon: <Scale className="w-4 h-4 text-violet-600" />,
      badge: 'Matris'
    },
  ];

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem('nediyor_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 8));
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setRecentSearches([]);
  };

  const saveRecentSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    try {
      const existing = recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...existing].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('nediyor_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter(s => s !== term);
      setRecentSearches(updated);
      localStorage.setItem('nediyor_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('nediyor_recent_searches');
  };

  useEffect(() => {
    if (isOpen) {
      loadRecentSearches();
      setActiveTab('all');
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Autocomplete fetch with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.getAutocomplete(query);
        setResults(data);
        setFocusedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Collect flat list of actionable items for keyboard navigation
  const getFlattenedItems = () => {
    if (!query || !results) {
      return [];
    }
    const items: { type: 'product' | 'category' | 'brand'; data: any }[] = [];
    
    if (activeTab === 'all' || activeTab === 'products') {
      results.products.forEach(p => items.push({ type: 'product', data: p }));
    }
    if (activeTab === 'all' || activeTab === 'categories') {
      results.categories.forEach(c => items.push({ type: 'category', data: c }));
    }
    if (activeTab === 'all' || activeTab === 'brands') {
      results.brands.forEach(b => items.push({ type: 'brand', data: b }));
    }
    return items;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    const flatItems = getFlattenedItems();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setFocusedIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && flatItems[focusedIndex]) {
        const item = flatItems[focusedIndex];
        if (item.type === 'product') {
          handleSelectProduct(item.data.slug, item.data.name);
        } else if (item.type === 'category') {
          handleSelectCategory(item.data.slug, item.data.name);
        } else if (item.type === 'brand') {
          handleSelectBrand(item.data.slug, item.data.name);
        }
      } else if (query.trim()) {
        handleSubmitAll();
      }
    }
  };

  const handleSelectProduct = (slug: string, title?: string) => {
    if (title) saveRecentSearch(title);
    else saveRecentSearch(query);
    onClose();
    navigate(`/urun/${slug}`);
  };

  const handleSelectCategory = (slug: string, title?: string) => {
    if (title) saveRecentSearch(title);
    else saveRecentSearch(query);
    onClose();
    navigate(`/ara?category=${slug}`);
  };

  const handleSelectBrand = (slug: string, title?: string) => {
    if (title) saveRecentSearch(title);
    else saveRecentSearch(query);
    onClose();
    navigate(`/ara?brand=${slug}`);
  };

  const handleSubmitAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onClose();
      navigate(`/ara?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  const totalProductCount = results?.products?.length || 0;
  const totalCategoryCount = results?.categories?.length || 0;
  const totalBrandCount = results?.brands?.length || 0;
  const hasResults = totalProductCount > 0 || totalCategoryCount > 0 || totalBrandCount > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-2 sm:px-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <form onSubmit={handleSubmitAll} className="relative flex items-center border-b border-slate-200 bg-slate-50/70 px-3.5 sm:px-5 py-3 sm:py-3.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mr-2.5 sm:mr-3 border border-indigo-100">
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-indigo-600" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cihaz adı, marka, model veya kategori ara..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm md:text-base focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
                title="Temizle"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 text-[11px] font-bold transition-colors font-mono hidden sm:inline-block"
            >
              ESC
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-slate-500 hover:bg-slate-200 sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Filter Tabs Bar (Shown when query is typed) */}
        {query && results && hasResults && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Tümü ({totalProductCount + totalCategoryCount + totalBrandCount})
            </button>

            {totalProductCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'products'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>Ürünler</span>
                <span className="text-[10px] opacity-80">({totalProductCount})</span>
              </button>
            )}

            {totalCategoryCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'categories'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>Kategoriler</span>
                <span className="text-[10px] opacity-80">({totalCategoryCount})</span>
              </button>
            )}

            {totalBrandCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className={`px-3 py-1 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'brands'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>Markalar</span>
                <span className="text-[10px] opacity-80">({totalBrandCount})</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Scrollable Content Body */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 no-scrollbar">
          
          {/* Autocomplete Results State */}
          {!isLoading && query && results && (
            <div className="space-y-4">
              
              {/* Product Matches */}
              {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Eşleşen Ürünler ({results.products.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                      Doğrulanmış Konsensüs
                    </span>
                  </div>

                  <div className="space-y-1">
                    {results.products.map((p, idx) => {
                      const isFocused = focusedIndex === idx;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectProduct(p.slug, p.name)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left group ${
                            isFocused
                              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                              : 'hover:bg-slate-50 border-slate-100/80 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <Tag className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                                <span className="font-semibold text-slate-700">{p.brandName}</span>
                                <span>•</span>
                                <span>{p.categoryName}</span>
                                {p.mentionCount && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-600 font-medium">{p.mentionCount.toLocaleString('tr-TR')} inceleme</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-['Space_Grotesk']">
                              ★ {p.score ? p.score.toFixed(1) : '8.9'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories Matches */}
              {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Kategoriler ({results.categories.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {results.categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCategory(c.slug, c.name)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{c.productCount} ürün</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands Matches */}
              {(activeTab === 'all' || activeTab === 'brands') && results.brands.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Markalar ({results.brands.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {results.brands.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBrand(b.slug, b.name)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span>{b.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{b.productCount} model</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results fallback */}
              {!hasResults && (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Eşleşen doğrudan sonuç bulunamadı</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      "{query}" için arama filtresine giderek fiyat, kategori ve konsensüs skoruna göre arayabilirsiniz.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmitAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <span>"{query}" İçin Tüm Kataloğu Tara</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Default Initial State: Recent Searches, Popular Tags, and AI Decision Tools */}
          {!query && (
            <div className="space-y-5">
              
              {/* 1. Recent Search History */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Son Aramalarınız</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Temizle</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 rounded-md transition-colors"
                          title="Kaldır"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Decision & AI Tools */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Yapay Zeka & Karar Destek Araçları</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickTools.map((tool, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(tool.href);
                      }}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                            {tool.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-500 font-bold shrink-0">
                            {tool.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                          {tool.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Popular Searches Tags */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>En Çok Aranan ve Karşılaştırılan Modeller</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectProduct(item.slug, item.title)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{item.title}</span>
                      <span className="text-[9px] text-slate-400 font-normal">({item.category})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-300 font-mono text-[10px] text-slate-600 shadow-2xs">↵ Enter</kbd>
              <span>Seç / Ara</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-300 font-mono text-[10px] text-slate-600 shadow-2xs">↑↓</kbd>
              <span>Gezin</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-300 font-mono text-[10px] text-slate-600 shadow-2xs">ESC</kbd>
              <span>Kapat</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NeDiyor Doğrulanmış Arama</span>
          </div>
        </div>
      </div>
    </div>
  );
};
