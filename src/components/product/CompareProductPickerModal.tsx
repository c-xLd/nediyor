import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Tag, Check, Award, Layers, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api.js';
import { SearchAutocompleteResult } from '../../types/index.js';

interface CompareProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  alreadySelectedSlugs: string[];
  targetCategoryId?: string;
  targetCategoryName?: string;
}

export const CompareProductPickerModal: React.FC<CompareProductPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  alreadySelectedSlugs,
  targetCategoryId,
  targetCategoryName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load category-matching items or popular items for quick selection
      if (targetCategoryId) {
        api.search({ category: targetCategoryId, sort: 'score' }).then(data => {
          setPopularProducts(data.products || []);
        }).catch(err => {
          console.error(err);
          // Fallback to home data
          api.getHomeData().then(d => {
            const filtered = (d.popularProducts || []).filter(p => !targetCategoryId || p.categoryId === targetCategoryId);
            setPopularProducts(filtered);
          });
        });
      } else {
        api.getHomeData().then(data => {
          setPopularProducts(data.popularProducts || []);
        }).catch(err => console.error(err));
      }
    }
  }, [isOpen, targetCategoryId]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getAutocomplete(searchTerm, targetCategoryId);
        setSearchResults(res.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, targetCategoryId]);

  if (!isOpen) return null;

  const displayList = searchTerm.trim() ? searchResults : popularProducts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden transition-all flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Karşılaştırmaya Ürün Ekle</h3>
            <p className="text-xs text-slate-500">Maksimum 4 ürünü aynı anda kıyaslayabilirsiniz</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Enforcement Banner */}
        {targetCategoryName && (
          <div className="px-5 py-2.5 bg-indigo-50/80 border-b border-indigo-100 flex items-center gap-2 text-xs text-indigo-800">
            <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Aynı Kategori Zorunlu:</strong> Yalnızca <span className="font-bold underline decoration-indigo-300">{targetCategoryName}</span> modelleri karşılaştırılabilir.
            </span>
          </div>
        )}

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder={targetCategoryName ? `${targetCategoryName} model veya marka ara...` : "Model veya marka adı yazın..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* List of selectable products */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
            <span>{searchTerm.trim() ? 'Arama Sonuçları' : (targetCategoryName ? `${targetCategoryName} Modelleri` : 'Popüler Önerilen Ürünler')}</span>
            {targetCategoryName && (
              <span className="text-[10px] text-indigo-600 font-semibold lowercase">aynı kategori filtresi aktif</span>
            )}
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-400">Aranıyor...</div>
          ) : displayList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {targetCategoryName ? `Bu kategoride (${targetCategoryName}) uygun ürün bulunamadı.` : 'Ürün bulunamadı.'}
            </div>
          ) : (
            displayList.map((item) => {
              const isAlreadyAdded = alreadySelectedSlugs.includes(item.slug);
              const isCategoryMismatch = targetCategoryId && item.categoryId && item.categoryId !== targetCategoryId;

              return (
                <div
                  key={item.id || item.slug}
                  onClick={() => {
                    if (!isAlreadyAdded && !isCategoryMismatch) {
                      onSelectProduct(item.slug);
                      onClose();
                    }
                  }}
                  className={`py-3 px-2 flex items-center justify-between rounded-xl transition-all ${
                    isAlreadyAdded || isCategoryMismatch
                      ? 'opacity-40 cursor-not-allowed bg-slate-50'
                      : 'cursor-pointer hover:bg-indigo-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Tag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span>{item.brandName || item.categoryName}</span>
                        {item.score && (
                          <span className="font-semibold text-emerald-700">★ {typeof item.score === 'object' ? item.score.overallScore : item.score}</span>
                        )}
                        {item.categoryName && (
                          <span className="text-[10px] text-slate-400 font-medium">({item.categoryName})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAlreadyAdded ? (
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Eklendi
                      </span>
                    ) : isCategoryMismatch ? (
                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Farklı Kategori
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs">
                        <Plus className="w-3.5 h-3.5" /> Seç
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
