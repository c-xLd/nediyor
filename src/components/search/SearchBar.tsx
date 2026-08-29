import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, Sparkles, Tag, Layers, ArrowRight, X, AlertCircle, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../../lib/router.js';
import { api } from '../../lib/api.js';
import { SearchAutocompleteResult } from '../../types/index.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { formatScore } from '../../lib/scoring.js';

export interface SearchBarProps {
  initialValue?: string;
  size?: 'large' | 'compact';
  autoFocus?: boolean;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

type AutocompleteState = 'idle' | 'loading' | 'results' | 'no_results' | 'error';

const RECENT_SEARCHES_KEY = 'nediyor_recent_searches_v1';

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  size = 'large',
  autoFocus = false,
  className = '',
  onSearchSubmit
}) => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [autocompleteState, setAutocompleteState] = useState<AutocompleteState>('idle');
  const [results, setResults] = useState<SearchAutocompleteResult>({
    products: [],
    brands: [],
    categories: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      const existing = recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...existing].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Sync initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Global hotkey listener: ⌘K or Ctrl+K or / to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch autocomplete on query change with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 1) {
      setAutocompleteState('idle');
      setResults({ products: [], brands: [], categories: [] });
      setHighlightedIndex(-1);
      return;
    }

    setAutocompleteState('loading');
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await api.getAutocomplete(trimmed);
        const hasItems =
          data.products.length > 0 ||
          data.brands.length > 0 ||
          data.categories.length > 0;

        setResults(data);
        setAutocompleteState(hasItems ? 'results' : 'no_results');
        setHighlightedIndex(-1);
      } catch (err) {
        console.error('Autocomplete fetch error:', err);
        setAutocompleteState('error');
      }
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSubmit = (customTerm?: string) => {
    const term = customTerm !== undefined ? customTerm : query;
    const clean = term.trim();
    if (!clean) return;

    saveRecentSearch(clean);
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(clean);
    } else {
      navigate(`/ara?q=${encodeURIComponent(clean)}`);
    }
  };

  const handleSelectProduct = (slug: string, productName: string) => {
    saveRecentSearch(productName);
    setIsOpen(false);
    navigate(`/urun/${slug}`);
  };

  const handleSelectBrand = (slug: string, brandName: string) => {
    saveRecentSearch(brandName);
    setIsOpen(false);
    navigate(`/ara?brand=${slug}`);
  };

  const handleSelectCategory = (slug: string, catName: string) => {
    saveRecentSearch(catName);
    setIsOpen(false);
    navigate(`/ara?category=${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
      return;
    }
  };

  const isLarge = size === 'large';
  const showRecentOnly = isOpen && (!query.trim() || query.trim().length === 0) && recentSearches.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full max-w-3xl mx-auto ${className}`}>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="relative w-full">
        <div
          className={`flex items-center w-full transition-all duration-300 bg-white border backdrop-blur-xl ${
            isOpen
              ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl bg-white'
              : 'border-slate-300 hover:border-slate-400 shadow-sm'
          } rounded-2xl p-1 sm:p-1.5`}
        >
          {/* Left search icon with subtle pulsing when focused */}
          <div className="pl-2.5 sm:pl-3.5 pr-1.5 sm:pr-2 flex items-center text-slate-400 shrink-0">
            {autocompleteState === 'loading' ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-indigo-600" />
            ) : (
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? 'text-indigo-600 scale-105' : 'text-slate-400'} transition-all`} />
            )}
          </div>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => {
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder="Cihaz veya marka ara (örn: iPhone 16, M3 Max)..."
            className={`w-full min-w-0 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none ${
              isLarge 
                ? 'text-sm sm:text-base md:text-lg py-2 sm:py-2.5 px-1 sm:px-2 font-medium' 
                : 'text-xs sm:text-sm py-1.5 px-1 sm:px-2 font-medium'
            }`}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Shortcut badge if empty and large (hidden on mobile) */}
          {!query && isLarge && (
            <div className="hidden md:flex items-center gap-1 mr-2 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 font-mono select-none shrink-0">
              <span>⌘K</span>
            </div>
          )}

          {/* Clear button if input is filled */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors mr-0.5 sm:mr-1 shrink-0"
              aria-label="Temizle"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* CTA Button - Adaptive on mobile vs desktop */}
          <Button
            type="submit"
            variant="primary"
            size={isLarge ? 'md' : 'sm'}
            className={`shrink-0 ${
              isLarge 
                ? 'px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-md shadow-indigo-500/20' 
                : 'px-2.5 sm:px-3 py-1.5 text-xs'
            }`}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden xs:inline" />}
          >
            <span className="hidden xs:inline">Ne Diyor?</span>
            <span className="xs:hidden">Ara</span>
          </Button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-[80vh] sm:max-h-[520px] overflow-y-auto no-scrollbar"
          >
            {/* 1. RECENT SEARCHES (when input is empty or focused) */}
            {showRecentOnly && (
              <div className="p-3">
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Son Aramalar</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    Temizle
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(term);
                        handleSubmit(term);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 text-xs text-slate-700 hover:text-slate-900 transition-all group font-medium"
                    >
                      <Clock className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      <span>{term}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. LOADING STATE */}
            {autocompleteState === 'loading' && results.products.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Konsensüs veritabanı taranıyor...</span>
              </div>
            )}

            {/* 3. ERROR STATE */}
            {autocompleteState === 'error' && (
              <div className="p-4 text-center text-sm text-rose-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Arama sonuçları yüklenirken bir sorun oluştu.</span>
              </div>
            )}

            {/* 4. NO RESULTS */}
            {autocompleteState === 'no_results' && (
              <div className="p-6 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  "{query}" ile eşleşen ürün veya marka bulunamadı.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Farklı bir model veya marka adı deneyebilir veya tüm sonuçları listelemek için Enter'a basabilirsiniz.
                </p>
              </div>
            )}

            {/* 5. RESULTS LIST */}
            {autocompleteState === 'results' && (
              <div>
                {/* Product Results */}
                {results.products.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Doğrudan Eşleşen Ürünler ({results.products.length})
                    </div>
                    <div className="space-y-1 mt-1">
                      {results.products.map(product => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.slug, product.name)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-11 h-11 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                <Tag className="w-4 h-4" />
                              </div>
                            )}
                            <div className="truncate">
                              <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                <span className="text-indigo-600 font-medium">{product.brandName}</span>
                                <span>•</span>
                                <span>{product.categoryName}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            {product.score !== undefined ? (
                              <div className="text-right">
                                <Badge
                                  variant={
                                    product.score >= 8.0
                                      ? 'emerald'
                                      : product.score >= 6.5
                                      ? 'amber'
                                      : 'rose'
                                  }
                                  size="sm"
                                  className="font-bold shadow-xs"
                                >
                                  ★ {formatScore(product.score)} / 10
                                </Badge>
                                {product.mentionCount ? (
                                  <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                                    {product.mentionCount} görüş
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Puan yok</span>
                            )}
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand & Category Matches */}
                {(results.brands.length > 0 || results.categories.length > 0) && (
                  <div className="p-2 bg-slate-50 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Brands */}
                      {results.brands.length > 0 && (
                        <div>
                          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-indigo-600" />
                            Markalar
                          </div>
                          <div className="space-y-0.5 mt-1">
                            {results.brands.map(brand => (
                              <div
                                key={brand.id}
                                onClick={() => handleSelectBrand(brand.slug, brand.name)}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer text-xs group"
                              >
                                <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                                  {brand.name}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {brand.productCount} ürün
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {results.categories.length > 0 && (
                        <div>
                          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                            Kategoriler
                          </div>
                          <div className="space-y-0.5 mt-1">
                            {results.categories.map(cat => (
                              <div
                                key={cat.id}
                                onClick={() => handleSelectCategory(cat.slug, cat.name)}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer text-xs group"
                              >
                                <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                                  {cat.name}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {cat.productCount} ürün
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View all results footer */}
                <div
                  onClick={() => handleSubmit()}
                  className="px-4 py-3 bg-slate-50 hover:bg-indigo-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-indigo-600" />
                    "{query}" için tüm konsensüs sonuçlarını incele
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-mono shadow-xs">
                      Enter ↵
                    </kbd>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
