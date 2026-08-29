import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Filter, 
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api.js';
import { DealsResponse, DealItem } from '../types/index.js';
import { Link } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { formatScore } from '../lib/scoring.js';

export const DealsRadarPage: React.FC = () => {
  const [dealsData, setDealsData] = useState<DealsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyDipPrice, setOnlyDipPrice] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'discount' | 'fp' | 'priceAsc'>('discount');

  useEffect(() => {
    setIsLoading(true);
    api.getDeals().then(data => {
      setDealsData(data);
    }).catch(err => {
      console.error('Deals fetch error:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const filteredDeals = (dealsData?.deals || []).filter(deal => {
    if (selectedCategory !== 'all' && deal.product.categoryId !== selectedCategory) {
      return false;
    }
    if (deal.discountPercentage < minDiscount) {
      return false;
    }
    if (onlyDipPrice && !deal.isAllTimeLowest) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'discount') {
      return b.discountPercentage - a.discountPercentage;
    } else if (sortBy === 'fp') {
      return (b.product.priceInfo?.fpScore || 0) - (a.product.priceInfo?.fpScore || 0);
    } else {
      return a.currentPrice - b.currentPrice;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Canlı İndirim & F/P Takibi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              F/P Fırsat & Dip Fiyat Radarı
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fiyatı son 6 ayın en dip seviyesine inen ürünler ve sahte indirim filtresinden başarıyla geçmiş doğrulanmış gerçek fırsatlar.
            </p>
          </div>
        </div>

        {/* Top Metric Highlights */}
        {dealsData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Aktif Fırsatlar</span>
                <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">{dealsData.totalDeals} Ürün</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Tarihsel Dip Fiyat</span>
                <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">{dealsData.allTimeLowestCount} Ürün</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Doğrulanmış Gerçek İndirim</span>
                <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">%{100} Güven</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tüm Kategoriler
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('akilli-telefonlar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'akilli-telefonlar'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Telefonlar
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('laptoplar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'laptoplar'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Laptoplar
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('kulakliklar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'kulakliklar'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kulaklıklar
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('robot-supurgeler')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'robot-supurgeler'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Robot Süpürgeler
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyDipPrice}
                onChange={(e) => setOnlyDipPrice(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
              />
              <span>Sadece Tarihsel Dip Fiyatlar</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="discount">En Yüksek İndirim (%)</option>
              <option value="fp">En Yüksek F/P Puanı</option>
              <option value="priceAsc">En Düşük Fiyat</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Fırsatlar ve mağaza fiyatları taranıyor...</p>
          </div>
        )}

        {/* Deals Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      %{deal.discountPercentage} İndirim
                    </span>
                    {deal.isAllTimeLowest && (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Tarihsel Dip Fiyat
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {deal.storeName}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={deal.product.imageUrl}
                      alt={deal.product.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {deal.product.brandName} • {deal.product.categoryName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {deal.product.name}
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        F/P Skoru: {deal.product.priceInfo?.fpScore || 9.0}/10
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({deal.product.score ? `${formatScore(deal.product.score.overallScore)}/10 Puan` : ''})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through block">
                      {deal.previousPrice.toLocaleString('tr-TR')} TL
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
                        {deal.currentPrice.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      -{deal.discountAmount.toLocaleString('tr-TR')} TL Kazanç
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Doğrulanmış Fiyat
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={deal.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" size="md" className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold" rightIcon={<ExternalLink className="w-4 h-4" />}>
                      {deal.storeName}'da Gör
                    </Button>
                  </a>

                  <Link href={`/urun/${deal.product.slug}`} className="flex-1">
                    <Button variant="outline" size="md" className="w-full font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Analizi İncele
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
