import React from 'react';
import { Layers, X, ArrowRight, Star } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useRouter } from '../../lib/router.js';

interface QuickCompareBarProps {
  selectedIds: string[];
  allProducts: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const QuickCompareBar: React.FC<QuickCompareBarProps> = ({
  selectedIds,
  allProducts,
  onRemove,
  onClear
}) => {
  const { navigate } = useRouter();

  if (selectedIds.length === 0) return null;

  const selectedProducts = selectedIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleCompareClick = () => {
    if (selectedProducts.length < 2) return;
    const slugs = selectedProducts.map(p => p.slug);
    const params = new URLSearchParams();
    slugs.forEach((slug, idx) => {
      params.set(`p${idx + 1}`, slug);
    });
    navigate(`/karsilastir?${params.toString()}`);
  };

  return (
    <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-3xl p-3.5 sm:p-4 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Info & Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold shrink-0">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{selectedProducts.length}/4 Seçildi</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedProducts.map((p) => (
              <div
                key={p.id}
                className="relative group bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5 pr-2 flex items-center gap-2 text-xs shrink-0"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-7 h-7 rounded-xl object-contain bg-white/10 p-0.5"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-slate-200 truncate max-w-[120px]">
                  {p.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="w-4 h-4 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  title="Kaldır"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            Temizle
          </button>

          <button
            type="button"
            disabled={selectedProducts.length < 2}
            onClick={handleCompareClick}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              selectedProducts.length >= 2
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{selectedProducts.length >= 2 ? 'Karşılaştır' : 'En az 2 ürün seçin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
