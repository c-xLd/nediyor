import React, { useState } from 'react';
import { 
  TrendingDown, 
  Store, 
  ExternalLink, 
  Bell, 
  ShieldCheck, 
  Award, 
  Info,
  Calendar,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { PriceInfo } from '../../types/index.js';
import { PriceAlertModal } from './PriceAlertModal.js';

interface PriceTrackingSectionProps {
  productName: string;
  priceInfo?: PriceInfo;
}

export const PriceTrackingSection: React.FC<PriceTrackingSectionProps> = ({
  productName,
  priceInfo
}) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeHistoryPoint, setActiveHistoryPoint] = useState<number | null>(null);

  if (!priceInfo) return null;

  // Chart calculation
  const history = priceInfo.history || [];
  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices, priceInfo.lowestPrice);
  const maxPrice = Math.max(...prices, priceInfo.highestPrice);
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 120;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  // Generate SVG path coordinates
  const points = history.map((h, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const normalizedY = (h.price - minPrice) / priceRange;
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, ...h };
  });

  const pathD = points.length > 0 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  // Area under path
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`
    : '';

  const lowestOffer = priceInfo.offers.find(o => o.isLowest) || priceInfo.offers[0];
  const firstPrice = history.length > 0 ? history[0].price : priceInfo.currentPrice;
  const priceDiff = priceInfo.currentPrice - firstPrice;
  const priceDiffPct = Math.round((priceDiff / firstPrice) * 100);

  return (
    <div id="price-tracking-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Fiyat / Performans & Piyasa Takibi
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Canlı Veri
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Türkiye'nin popüler e-ticaret mağazalarındaki fiyatlar ve NeDiyor F/P algoritması
            </p>
          </div>
        </div>

        {/* Price Alert Button */}
        <button
          onClick={() => setIsAlertModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-xl border border-emerald-200 transition-colors shadow-xs group"
        >
          <Bell className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>Fiyat Alarmı Kur</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* F/P Score Box */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-xl p-5 border border-emerald-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
              <span>NeDiyor F/P Endeksi</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {priceInfo.fpScore.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 10</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-emerald-200/60">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {priceInfo.fpVerdict}
            </span>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              Donanım kalitesi ve memnuniyetin fiyata oranı.
            </p>
          </div>
        </div>

        {/* Current Best Price */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
              <span>En Uygun Fiyat</span>
              <Store className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900 truncate">
                {lowestOffer?.price.toLocaleString('tr-TR')}₺
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60">
             {priceInfo.originalPrice && priceInfo.originalPrice > priceInfo.currentPrice ? (
                <div className="text-[11px] text-slate-500">
                  Önceki: <span className="line-through">{priceInfo.originalPrice.toLocaleString('tr-TR')}₺</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  En ucuz: <span className="font-semibold text-slate-700">{lowestOffer?.storeName}</span>
                </div>
              )}
          </div>
        </div>

        {/* Price Trend Summary */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
              <span>6 Aylık Trend</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-xl font-bold ${priceDiff <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {priceDiff <= 0 ? `${Math.abs(priceDiffPct)}% İndirimde` : `+%${priceDiffPct} Artış`}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
            Tarihsel dip: <span className="font-semibold text-emerald-700">{priceInfo.lowestPrice.toLocaleString('tr-TR')}₺</span>
          </div>
        </div>

        {/* Value Retention (Amortisman) Score Box */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/40 rounded-xl p-5 border border-indigo-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
              <span>2. El Değer Koruma</span>
              <TrendingDown className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">
                A-
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-md">
                Yüksek
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-indigo-200/60">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Bu cihaz ilk 1 yılın sonunda ortalama <strong>%15-20</strong> değer kaybeder.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Price History Chart */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Aylık Fiyat Değişim Grafiği (Son 6 Ay)</h4>
          </div>
          <span className="text-xs text-slate-400">Noktalara tıklayarak fiyatı inceleyin</span>
        </div>

        {/* SVG Chart Container */}
        <div className="w-full overflow-x-auto pt-2">
          <div className="min-w-[460px] h-32 relative">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Area */}
              <path d={areaD} fill="url(#priceGradient)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Interactive Points */}
              {points.map((p, idx) => (
                <g key={idx} className="cursor-pointer" onClick={() => setActiveHistoryPoint(idx)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeHistoryPoint === idx ? 6 : 4}
                    className="fill-white stroke-emerald-600 stroke-2 hover:r-6 transition-all"
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-slate-500 select-none"
                  >
                    {p.date}
                  </text>
                  {(activeHistoryPoint === idx || idx === points.length - 1) && (
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-slate-900 select-none drop-shadow-sm"
                    >
                      {p.price.toLocaleString('tr-TR')} TL
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Store Offers List */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Mağaza Fiyat Karşılaştırması</span>
          <span className="text-xs font-normal text-slate-500">
            {priceInfo.offers.length} mağaza teklifi bulundu
          </span>
        </h4>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {priceInfo.offers.map((offer, idx) => (
            <div 
              key={idx} 
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                offer.isLowest ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'bg-white hover:bg-slate-50'
              }`}
            >
              {/* Store details */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-2xs">
                  {offer.storeName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{offer.storeName}</span>
                    {offer.isLowest && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                        En Uygun Fiyat
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    {offer.shippingInfo && <span>{offer.shippingInfo}</span>}
                    {offer.sellerRating && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">★ {offer.sellerRating}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 block">
                    {offer.price.toLocaleString('tr-TR')} TL
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block">
                    {offer.inStock ? 'Stokta Var' : 'Tükendi'}
                  </span>
                </div>

                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-2xs ${
                    offer.isLowest
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Mağazaya Git</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Note */}
      <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          NeDiyor bağımsız bir konsensüs platformudur. Fiyatlar otomatik güncellenir ve kargo/stok koşulları ilgili mağazanın web sitesinde geçerlidir.
        </span>
      </div>

      {/* Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        productName={productName}
        priceInfo={priceInfo}
      />
    </div>
  );
};
