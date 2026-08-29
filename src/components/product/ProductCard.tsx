import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Tag, 
  Scale, 
  Heart, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Product, ProductScore, PriceInfo } from '../../types/index.js';
import { Link, useRouter } from '../../lib/router.js';
import { formatScore, formatNumber, calculateVerdict } from '../../lib/scoring.js';
import { useToast } from '../ui/Toast.js';

export interface ProductCardProps {
  product: Product & { 
    score?: ProductScore | null; 
    priceInfo?: PriceInfo;
    tags?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  className = '',
  isSelectedForCompare = false,
  onToggleCompare
}) => {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const score = product.score;
  const priceInfo = product.priceInfo;

  const verdict = score
    ? calculateVerdict(score.overallScore, score.mentionCount, score.confidenceScore, score.positiveRatio)
    : calculateVerdict(null, 0, 0, 0);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('nediyor_favorites') || '[]');
      setIsFavorite(favs.includes(product.slug));
    } catch {
      setIsFavorite(false);
    }
  }, [product.slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('nediyor_favorites') || '[]');
      let updated: string[];
      if (favs.includes(product.slug)) {
        updated = favs.filter(s => s !== product.slug);
        setIsFavorite(false);
        showToast(`${product.name} takip listenizden çıkarıldı.`, 'info');
      } else {
        updated = [...favs, product.slug];
        setIsFavorite(true);
        showToast(`${product.name} takip listenize eklendi!`, 'success');
      }
      localStorage.setItem('nediyor_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product detail
    navigate(`/urun/${product.slug}`);
  };

  const getScoreColor = (val?: number | null) => {
    if (!val) return 'text-slate-600 bg-slate-100 border-slate-200';
    if (val >= 8.5) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 7.0) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (val >= 6.0) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white border border-slate-200/90 hover:border-indigo-300/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer select-none ${
        isSelectedForCompare ? 'ring-2 ring-indigo-600 border-transparent bg-indigo-50/20' : ''
      } ${className}`}
    >
      <div>
        {/* Visual Product Stage */}
        <div className="relative rounded-xl bg-gradient-to-b from-slate-50/90 to-slate-100/50 border border-slate-100 p-4 aspect-4/3 flex items-center justify-center overflow-hidden mb-3.5">
          
          {/* Top-Left Verdict / Score Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            {score && verdict.status !== 'YETERSIZ_VERI' ? (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  verdict.variant === 'positive'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : verdict.variant === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  verdict.variant === 'positive'
                    ? 'bg-emerald-500'
                    : verdict.variant === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`} />
                <span>{verdict.label}</span>
              </span>
            ) : product.isTrending ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 shadow-2xs">
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Popüler</span>
              </span>
            ) : null}
          </div>

          {/* Top-Right Actions: Compare Checkbox & Favorite */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={handleCompareClick}
                title={isSelectedForCompare ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  isSelectedForCompare
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20'
                    : 'bg-white/90 hover:bg-white border-slate-200 text-slate-500 hover:text-indigo-600'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={toggleFavorite}
              title={isFavorite ? 'Takip listesinden çıkar' : 'Takip listesine ekle'}
              className={`p-1.5 rounded-xl border transition-all duration-200 shadow-2xs cursor-pointer ${
                isFavorite 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105' 
                  : 'bg-white/90 hover:bg-white border-slate-200/80 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Image */}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Tag className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Brand & Category Label */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <span className="text-indigo-600 font-bold">{product.brandName}</span>
          <span>•</span>
          <span className="truncate">{product.categoryName}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-[15px] font-bold text-slate-900 font-['Space_Grotesk'] leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
          {product.description}
        </p>

        {/* Price & Offer snippet if available */}
        {priceInfo && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-sm font-extrabold text-slate-900 font-['Space_Grotesk']">
                {priceInfo.formattedPrice}
              </span>
              {priceInfo.originalPrice && priceInfo.originalPrice > priceInfo.currentPrice && (
                <span className="text-[10px] text-slate-400 line-through ml-1.5 font-medium">
                  {priceInfo.originalPrice.toLocaleString('tr-TR')} ₺
                </span>
              )}
            </div>
            {priceInfo.originalPrice && priceInfo.originalPrice > priceInfo.currentPrice ? (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                -%{Math.round(((priceInfo.originalPrice - priceInfo.currentPrice) / priceInfo.originalPrice) * 100)} Fırsat
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                {priceInfo.offers.length} satıcı
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Consensus Score & Details */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Consensus Score Pill */}
        {score && score.overallScore !== undefined ? (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center font-['Space_Grotesk'] font-black text-xs px-2 py-0.5 rounded-lg border ${getScoreColor(score.overallScore)}`}>
              ★ {formatScore(score.overallScore)}
            </span>
            <div className="text-[11px] text-slate-500 font-medium">
              <span className="text-slate-700 font-bold">%{score.positiveRatio}</span> olumlu
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-slate-400">{formatNumber(score.mentionCount)} yorum</span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Konsensüs hazırlanıyor</span>
        )}

        {/* Arrow Action Icon */}
        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
