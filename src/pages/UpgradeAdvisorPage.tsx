import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Zap,
  Camera,
  BatteryCharging
} from 'lucide-react';
import { useRouter, Link } from '../lib/router.js';
import { api } from '../lib/api.js';
import { ProductDetailData, UpgradeAdviceResponse } from '../types/index.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

const POPULAR_UPGRADE_PAIRS = [
  { fromSlug: 'apple-iphone-12', fromName: 'iPhone 12', toSlug: 'apple-iphone-16-pro', toName: 'iPhone 16 Pro', label: '4 Nesil Atlama' },
  { fromSlug: 'samsung-galaxy-s21-ultra', fromName: 'Galaxy S21 Ultra', toSlug: 'samsung-galaxy-s24-ultra', toName: 'Galaxy S24 Ultra', label: '3 Nesil Atlama' },
  { fromSlug: 'apple-macbook-air-m1', fromName: 'MacBook Air M1', toSlug: 'apple-macbook-pro-14-m3-pro', toName: 'MacBook Pro M3', label: 'Pro Geçişi' },
  { fromSlug: 'sony-wh-1000xm4', fromName: 'Sony WH-1000XM4', toSlug: 'sony-wh-1000xm5', toName: 'Sony WH-1000XM5', label: 'Ses & ANC' }
];

export const UpgradeAdvisorPage: React.FC = () => {
  const { query, navigate, replace } = useRouter();

  const [fromSlug, setFromSlug] = useState<string>((query.from as string) || 'apple-iphone-12');
  const [toSlug, setToSlug] = useState<string>((query.to as string) || 'apple-iphone-16-pro');
  const [advice, setAdvice] = useState<UpgradeAdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductDetailData[]>([]);

  useEffect(() => {
    // Load home products to populate dropdowns
    api.search({}).then(res => {
      // Map basic list to detailed if possible
      const list = res.products.map(p => ({
        ...p,
        score: p.score || null,
        confidenceInfo: { level: 'Yüksek' as const, score: 90, color: 'text-emerald-600', description: '' },
        verdictInfo: { status: 'ALINIR' as const, label: 'Alınır', variant: 'positive' as const, description: '' },
        aiSummary: null,
        topicScores: [],
        mostPraisedTopics: [],
        mostCriticizedTopics: [],
        sources: [],
        mentions: [],
        alternatives: []
      }));
      setAvailableProducts(list as any);
    }).catch(console.error);
  }, []);

  const fetchAdvice = async (from: string, to: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getUpgradeAdvice(from, to);
      setAdvice(data);
      replace(`/yukseltme-danismani?from=${from}&to=${to}`);
    } catch (err: any) {
      console.error('Upgrade advice fetch error:', err);
      setError(err?.message || 'Yükseltme tavsiyesi alınırken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fromSlug && toSlug) {
      fetchAdvice(fromSlug, toSlug);
    }
  }, [fromSlug, toSlug]);

  const selectPair = (pair: { fromSlug: string; toSlug: string }) => {
    setFromSlug(pair.fromSlug);
    setToSlug(pair.toSlug);
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'KESINLIKLE_DEGER':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Kesinlikle Değer
          </span>
        );
      case 'DUSUNULEBILIR':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            Bütçeye Göre Düşünülebilir
          </span>
        );
      case 'DEGECEK_KADAR_DEGIL':
      case 'GECILMEMELI':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-600 text-white shadow-sm">
            <XCircle className="w-4 h-4" />
            Geçmeye Değmez / Fark Az
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Cihaz Değiştirme Danışmanı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Yükseltmeye Değer mi?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mevcut kullandığınız eski cihaz ile hedeflediğiniz yeni modeli seçin; günlük kullanımda hissedeceğiniz gerçek farkları, maliyet/fayda oranını ve konsensüs kararını anında görün.
            </p>
          </div>
        </div>

        {/* Quick Popular Pairs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Popüler Geçişler:
          </span>
          {POPULAR_UPGRADE_PAIRS.map((pair, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectPair(pair)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                fromSlug === pair.fromSlug && toSlug === pair.toSlug
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {pair.fromName} ➔ {pair.toName}
            </button>
          ))}
        </div>

        {/* Device Selection Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* From Device */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                1. Mevcut (Eski) Cihazınız
              </span>
              <select
                value={fromSlug}
                onChange={(e) => setFromSlug(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              >
                <optgroup label="Akıllı Telefonlar">
                  <option value="apple-iphone-12">Apple iPhone 12 (2020)</option>
                  <option value="apple-iphone-13-pro">Apple iPhone 13 Pro (2021)</option>
                  <option value="apple-iphone-14-pro">Apple iPhone 14 Pro (2022)</option>
                  <option value="samsung-galaxy-s21-ultra">Samsung Galaxy S21 Ultra (2021)</option>
                  <option value="samsung-galaxy-s22-ultra">Samsung Galaxy S22 Ultra (2022)</option>
                </optgroup>
                <optgroup label="Dizüstü Bilgisayarlar">
                  <option value="apple-macbook-air-m1">Apple MacBook Air 13" M1 (2020)</option>
                </optgroup>
                <optgroup label="Kulaklık & Ses">
                  <option value="sony-wh-1000xm4">Sony WH-1000XM4 (2020)</option>
                </optgroup>
                <optgroup label="Robot Süpürgeler">
                  <option value="roborock-s5-max">Roborock S5 Max (2020)</option>
                </optgroup>
              </select>
              <p className="text-[11px] text-slate-500">
                Şu anda elinizde olan veya takas etmeyi düşündüğünüz model.
              </p>
            </div>

            {/* To Device */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block">
                2. Hedef (Yeni) Cihazınız
              </span>
              <select
                value={toSlug}
                onChange={(e) => setToSlug(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white border border-indigo-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              >
                <optgroup label="Akıllı Telefonlar">
                  <option value="apple-iphone-16-pro">Apple iPhone 16 Pro (2024)</option>
                  <option value="samsung-galaxy-s24-ultra">Samsung Galaxy S24 Ultra (2024)</option>
                  <option value="google-pixel-9-pro">Google Pixel 9 Pro (2024)</option>
                </optgroup>
                <optgroup label="Dizüstü Bilgisayarlar">
                  <option value="apple-macbook-pro-14-m3-pro">Apple MacBook Pro 14" M3 Pro (2024)</option>
                  <option value="apple-macbook-air-13-m3">Apple MacBook Air 13" M3 (2024)</option>
                </optgroup>
                <optgroup label="Kulaklık & Ses">
                  <option value="sony-wh-1000xm5">Sony WH-1000XM5 (2024)</option>
                </optgroup>
                <optgroup label="Robot Süpürgeler">
                  <option value="roborock-q-revo">Roborock Q Revo (2024)</option>
                  <option value="roborock-s8-pro-ultra">Roborock S8 Pro Ultra (2024)</option>
                </optgroup>
              </select>
              <p className="text-[11px] text-indigo-600 font-medium">
                Satın almayı planladığınız güncel amiral gemisi veya model.
              </p>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Yükseltme Tavsiyesi Hesaplanamadı</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdvice(fromSlug, toSlug)}
              className="text-xs"
            >
              Yeniden Dene
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Yükseltme matrisi ve konsensüs verileri hesaplanıyor...</p>
          </div>
        )}

        {/* Results Matrix */}
        {!isLoading && advice && (
          <div className="space-y-6">
            
            {/* Top Consensus Verdict Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getVerdictBadge(advice.verdict)}
                    <span className="text-xs font-bold text-slate-500">
                      Topluluğun %{advice.recommendationPercentage}'i Öneriyor
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Space_Grotesk']">
                    {advice.verdictTitle}
                  </h2>
                  <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                    {advice.summary}
                  </p>
                </div>

                {/* Financial Summary Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 w-full lg:w-auto lg:min-w-[300px] space-y-2.5 flex-shrink-0">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
                    Tahmini Maliyet Hesabı
                  </span>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Eski Cihaz 2. El Değeri:</span>
                    <span className="font-bold text-slate-900">~{advice.estimatedOldDeviceResaleValue.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Yeni Cihaz Fiyatı:</span>
                    <span className="font-bold text-slate-900">{advice.newDevicePrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Tahmini Net Fark:</span>
                    <span className="text-indigo-600">{advice.netUpgradeCost.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl text-center border border-emerald-200/60">
                    Maliyet Değerlendirmesi: {advice.costValueRating}
                  </div>
                </div>
              </div>

              {/* 5 Big Improvements */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Günlük Kullanımda Hissedeceğiniz Net Farklar:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advice.keyImprovements.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <Badge variant="indigo" size="sm">
                          +{item.improvementScore}/10 Gelişim
                        </Badge>
                      </div>

                      {/* Before / After comparison */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Eski</span>
                          <span>{item.oldValue}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-medium">
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">Yeni Model</span>
                          <span>{item.newValue}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unchanged Aspects */}
              {advice.unchangedAspects && advice.unchangedAspects.length > 0 && (
                <div className="mt-8 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Neler Aynı Kalacak / Fark Hissedilmeyecek?
                  </h4>
                  <ul className="space-y-1.5">
                    {advice.unchangedAspects.map((unchanged, uIdx) => (
                      <li key={uIdx} className="text-xs text-amber-900/90 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{unchanged}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* User Persona Matrix */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Kullanım Profilinize Göre Geçiş Tavsiyesi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {advice.targetUserTypes.map((user, uIdx) => (
                    <div key={uIdx} className="p-4 rounded-2xl border bg-slate-50/80 border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{user.userType}</span>
                        {user.shouldUpgrade ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Önerilir
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                            Gerek Yok
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {user.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Page Action */}
              <div className="mt-8 flex justify-end">
                <Link href={`/urun/${toSlug}`}>
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {advice.toProduct.name} Detaylı Konsensüs İncelemesini Aç
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
