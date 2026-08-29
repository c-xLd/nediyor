import React from 'react';
import { Star, ShieldCheck, Flame, ExternalLink, ArrowRight, Check, Plus, MessageSquare, ThumbsUp } from 'lucide-react';
import { Product, ProductScore, PriceInfo } from '../../types/index.js';
import { useRouter } from '../../lib/router.js';

interface ProductTableViewProps {
  products: (Product & { 
    score?: ProductScore | null; 
    priceInfo?: PriceInfo; 
    tags?: string[];
  })[];
  selectedForCompare: string[];
  onToggleCompare: (productId: string) => void;
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  selectedForCompare,
  onToggleCompare
}) => {
  const { navigate } = useRouter();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 w-10 text-center">Seç</th>
              <th className="py-3.5 px-4 min-w-[260px]">Ürün & Model</th>
              <th className="py-3.5 px-4 text-center">NeDiyor Skoru</th>
              <th className="py-3.5 px-4 text-center">Karar</th>
              <th className="py-3.5 px-4">Canlı Fiyat & F/P</th>
              <th className="py-3.5 px-4 text-center">Memnuniyet</th>
              <th className="py-3.5 px-4 text-center">Yorum Sayısı</th>
              <th className="py-3.5 px-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {products.map((p) => {
              const isSelected = selectedForCompare.includes(p.id);
              const score = p.score?.overallScore || 0;
              const verdict = p.score?.verdict || 'DUSUNULEBILIR';
              const price = p.priceInfo;

              let verdictBadge = {
                text: 'Düşünülebilir',
                bg: 'bg-amber-50 text-amber-800 border-amber-200'
              };
              if (verdict === 'ALINIR') {
                verdictBadge = {
                  text: 'Alınır',
                  bg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                };
              } else if (verdict === 'ALTERNATIFLERE_BAK' || verdict === 'ALTERNATIFE_BAK') {
                verdictBadge = {
                  text: 'Alternatif Ara',
                  bg: 'bg-rose-50 text-rose-800 border-rose-200'
                };
              }

              return (
                <tr 
                  key={p.id} 
                  className={`hover:bg-indigo-50/30 transition-colors ${
                    isSelected ? 'bg-indigo-50/60' : ''
                  }`}
                >
                  {/* Compare Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleCompare(p.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                      title="Karşılaştırmaya Ekle"
                    />
                  </td>

                  {/* Product Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {p.brandName} • {p.categoryName}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(`/urun/${p.slug}`)}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left truncate block max-w-[280px]"
                        >
                          {p.name}
                        </button>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* NeDiyor Score */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-black font-['Space_Grotesk'] text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{score > 0 ? score.toFixed(1) : '-'}</span>
                    </div>
                  </td>

                  {/* Verdict */}
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${verdictBadge.bg}`}>
                      {verdictBadge.text}
                    </span>
                  </td>

                  {/* Live Price & F/P */}
                  <td className="py-4 px-4">
                    {price ? (
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">
                          {price.formattedPrice}
                        </div>
                        {price.originalPrice && price.originalPrice > price.currentPrice && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 line-through">
                              {price.originalPrice.toLocaleString('tr-TR')} ₺
                            </span>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                              -%{Math.round(((price.originalPrice - price.currentPrice) / price.originalPrice) * 100)}
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {price.offers.length} Satıcı Teklifi
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Fiyat Yok</span>
                    )}
                  </td>

                  {/* Sentiment */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                      <ThumbsUp className="w-3 h-3" />
                      <span>%{p.score?.positiveRatio || 0}</span>
                    </div>
                  </td>

                  {/* Mention Count */}
                  <td className="py-4 px-4 text-center text-slate-600 font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <span>{(p.score?.mentionCount || 0).toLocaleString('tr-TR')}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(p.id)}
                        className={`p-1.5 rounded-xl border text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                        title={isSelected ? 'Seçimi Kaldır' : 'Karşılaştırmaya Ekle'}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/urun/${p.slug}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>İncele</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
