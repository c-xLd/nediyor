import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Check, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Bot, 
  Watch, 
  Tv, 
  DollarSign, 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Award, 
  Zap, 
  Tag, 
  Scale,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useRouter, Link } from '../lib/router.js';
import { api } from '../lib/api.js';
import { ProductFinderMatch } from '../types/index.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { formatScore } from '../lib/scoring.js';

interface CategoryConfig {
  id: string;
  name: string;
  icon: any;
  topics: { id: string; label: string; icon: string }[];
}

const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    id: 'akilli-telefonlar',
    name: 'Akıllı Telefonlar',
    icon: Smartphone,
    topics: [
      { id: 'kamera', label: '📸 Profesyonel Kamera & Gece Çekimi', icon: 'camera' },
      { id: 'pil', label: '🔋 Uzun Pil Ömrü & Hızlı Şarj', icon: 'battery' },
      { id: 'ekran', label: '📱 Parlak 120Hz OLED Ekran', icon: 'screen' },
      { id: 'performans', label: '⚡ Yüksek Oyun & İşlemci Gücü', icon: 'cpu' },
      { id: 'malzeme', label: '💎 Premium Titanyum/Cam Kasa', icon: 'shield' },
      { id: 'fiyat-performans', label: '💰 Yüksek Fiyat/Performans Dengesi', icon: 'tag' }
    ]
  },
  {
    id: 'dizustu-bilgisayarlar',
    name: 'Dizüstü Bilgisayarlar',
    icon: Laptop,
    topics: [
      { id: 'pil', label: '🔋 Tüm Gün Süren Pil Ömrü', icon: 'battery' },
      { id: 'performans', label: '⚡ Güçlü İşlemci & Render Hızı', icon: 'cpu' },
      { id: 'ekran', label: '💻 Renk Doğruluğu Yüksek Ekran', icon: 'screen' },
      { id: 'tasinabilirlik', label: '🪶 Hafif ve İnce Kasa', icon: 'feather' },
      { id: 'klavye', label: '⌨️ Sessiz & Konforlu Klavye', icon: 'keyboard' },
      { id: 'fiyat-performans', label: '💰 Bütçe Dostu Verimlilik', icon: 'tag' }
    ]
  },
  {
    id: 'kulakliklar',
    name: 'Kablosuz Kulaklıklar',
    icon: Headphones,
    topics: [
      { id: 'anc', label: '🔇 Üstün Aktif Gürültü Engelleme (ANC)', icon: 'anc' },
      { id: 'ses', label: '🎵 Yüksek Çözünürlüklü Ses & Derin Bas', icon: 'sound' },
      { id: 'konfor', label: '🎧 Uzun Süreli Ergonomik Konfor', icon: 'comfort' },
      { id: 'mikrofon', label: '🎙️ Net Görüşme Mikrofonu', icon: 'mic' },
      { id: 'pil', label: '🔋 Kutuyla 30+ Saat Pil Süresi', icon: 'battery' }
    ]
  },
  {
    id: 'robot-supurgeler',
    name: 'Robot Süpürgeler',
    icon: Bot,
    topics: [
      { id: 'haritalama', label: '🗺️ LiDAR Lazer Haritalama & Engel Tanıma', icon: 'map' },
      { id: 'emis', label: '🌪️ Güçlü Emiş Gücü (Halı Derin Temizlik)', icon: 'vacuum' },
      { id: 'mop', label: '💧 Otomatik Paspas & Mop Yıkama', icon: 'mop' },
      { id: 'istasyon', label: '📦 Otomatik Çöp Boşaltma İstasyonu', icon: 'box' },
      { id: 'sessiz', label: '🤫 Sessiz Çalışma Modu', icon: 'mute' }
    ]
  }
];

export const ProductFinderPage: React.FC = () => {
  const { navigate } = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('akilli-telefonlar');
  const [budgetTier, setBudgetTier] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(100000);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['kamera', 'pil']);
  const [results, setResults] = useState<ProductFinderMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    document.title = 'Akıllı Ürün Bulucu & İhtiyaç Sihirbazı | NeDiyor';
  }, []);

  const currentCategoryConfig = CATEGORIES_CONFIG.find(c => c.id === selectedCategory) || CATEGORIES_CONFIG[0];

  const handleToggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSearched(true);
    setStep(4);
    try {
      const response = await api.findProducts({
        categoryId: selectedCategory,
        budgetTier: budgetTier !== 'all' ? budgetTier : undefined,
        maxBudget: maxBudget < 100000 ? maxBudget : undefined,
        priorityTopics: selectedTopics
      });
      setResults(response.matches || []);
    } catch (err) {
      console.error('Finder error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setBudgetTier('all');
    setMaxBudget(100000);
    setSelectedTopics(['kamera', 'pil']);
    setSearched(false);
    setResults([]);
  };

  return (
    <div className="min-h-screen py-8 md:py-12 relative bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NeDiyor Akıllı İhtiyaç Sihirbazı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Size En Uygun Ürünü 3 Adımda Bulun
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Bütçenizi ve öncelik verdiğiniz özellikleri seçin, binlerce kullanıcı konsensüsü içinden size en ideal ürünü eşleştirelim.
          </p>
        </div>

        {/* Wizard Step Indicator */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {[
            { num: 1, label: '1. Kategori' },
            { num: 2, label: '2. Bütçe' },
            { num: 3, label: '3. Öncelikler' },
            { num: 4, label: '4. Sonuçlar' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num <= step && setStep(s.num)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                s.num <= step ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              } ${
                step === s.num
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                  : s.num < step
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <span className="text-xs sm:text-sm block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Wizard Body Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 relative">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">1. Adım: Hangi Kategoride Ürün Arıyorsunuz?</h3>
                <p className="text-xs text-slate-500">İncelemek istediğiniz ana ürün tipini seçin</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CATEGORIES_CONFIG.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedTopics(cat.topics.slice(0, 2).map(t => t.id));
                      }}
                      className={`p-5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Bütçe Seçimine Geç
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET SELECTION */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">2. Adım: Bütçe Tercihiniz Nedir?</h3>
                <p className="text-xs text-slate-500">Hedeflediğiniz fiyat aralığını veya maksimum limiti belirleyin</p>
              </div>

              {/* Budget Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'budget',
                    title: 'Ekonomik & F/P',
                    desc: 'Fiyat/Performans odaklı, bütçeyi zorlamayan modeller',
                    range: '< 25.000 TL'
                  },
                  {
                    id: 'mid',
                    title: 'Dengeli Orta Segment',
                    desc: 'Çoğu kullanıcı için ideal özellik ve kalite dengesi',
                    range: '25.000 - 55.000 TL'
                  },
                  {
                    id: 'flagship',
                    title: 'Amiral Gemisi & Premium',
                    desc: 'Tavizsiz en üst düzey teknoloji ve malzeme kalitesi',
                    range: '> 55.000 TL'
                  }
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setBudgetTier(tier.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      budgetTier === tier.id
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{tier.title}</span>
                      {budgetTier === tier.id && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tier.desc}</p>
                    <div className="text-xs font-bold text-emerald-800 pt-1">{tier.range}</div>
                  </div>
                ))}
              </div>

              {/* Slider for max budget */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Veya Maksimum Bütçe Limiti Belirleyin
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {maxBudget >= 100000 ? 'Limitsiz (Tüm Fiyatlar)' : `${maxBudget.toLocaleString('tr-TR')} TL`}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={maxBudget}
                  onChange={(e) => {
                    setMaxBudget(Number(e.target.value));
                    setBudgetTier('all');
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>5.000 TL</span>
                  <span>50.000 TL</span>
                  <span>100.000+ TL</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Geri
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Öncelik Kriterlerine Geç
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PRIORITY TOPICS */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">3. Adım: Sizin İçin En Önemli Özellikler Neler?</h3>
                <p className="text-xs text-slate-500">
                  Birden fazla öncelik seçebilirsiniz. Algoritmamız bu kriterleri yüksek olan ürünlere öncelik verecektir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCategoryConfig.topics.map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{topic.label}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Geri
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSearch}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold"
                >
                  Bana En Uygun Ürünleri Bul
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS VIEW */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Eşleşen En İyi Ürünler
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {results.length} Model Bulundu
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Seçtiğiniz kriterler ({selectedTopics.join(', ')}) ve bütçenize göre sıralandı
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(3)}
                    leftIcon={<Sliders className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Kriterleri Düzenle
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Sıfırla
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto animate-spin">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Kriterleriniz Analiz Ediliyor...</h4>
                  <p className="text-xs text-slate-500">En yüksek memnuniyet ve F/P skoruna sahip modeller sıralanıyor</p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-600">Seçtiğiniz bütçe ve kriter filtrelerine tam uyan ürün bulunamadı.</p>
                  <Button variant="primary" size="sm" onClick={() => setStep(2)}>
                    Bütçeyi Genişlet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <div
                      key={result.product.id}
                      className="p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Left info */}
                      <div className="flex flex-col sm:flex-row items-start gap-4 w-full md:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 relative">
                          {result.product.imageUrl ? (
                            <img
                              src={result.product.imageUrl}
                              alt={result.product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Tag className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                            #{idx + 1}
                          </div>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3" /> %{result.matchScore} Uyumlu
                            </span>
                            <Badge variant="indigo" size="sm">
                              {result.product.brandName}
                            </Badge>
                            <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                              ★ {formatScore(result.product.score?.overallScore)} / 10
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                            {result.product.name}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                            <span className="font-semibold text-slate-900">Neden Size Uygun: </span>
                            {result.suitabilityReason}
                          </p>

                          {/* Price & F/P */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            {result.product.priceInfo ? (
                              <>
                                <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                                  {result.product.priceInfo.formattedPrice}
                                </span>
                                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                  F/P: {result.product.priceInfo.fpScore.toFixed(1)}/10 ({result.product.priceInfo.fpVerdict})
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-500">{result.product.priceRange}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-row md:flex-col items-center justify-end gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                        <Link href={`/urun/${result.product.slug}`} className="w-full sm:w-auto">
                          <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                            Detaylı Rapor <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                        <Link
                          href={`/karsilastir?p1=${result.product.slug}&p2=samsung-galaxy-s24-ultra`}
                          className="w-full sm:w-auto"
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Scale className="w-3.5 h-3.5" />}>
                            Kıyasla
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
