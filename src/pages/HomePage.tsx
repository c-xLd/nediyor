import React, { useEffect, useState } from 'react';
import { 
  Sparkles, Layers, ShieldCheck, Flame, Compass, ArrowRight, Bot, Database, 
  CheckCircle2, Smartphone, Laptop, Headphones, Watch, Camera, Tv, Scale, 
  Star, Zap, Search, Activity, ArrowLeftRight, TrendingUp, ChevronRight,
  Award, RefreshCw, BarChart3, AlertCircle, LayoutGrid, SlidersHorizontal,
  Building2
} from 'lucide-react';
import { api } from '../lib/api.js';
import { HomeDataResponse, Product, ProductScore } from '../types/index.js';
import { SearchBar } from '../components/search/SearchBar.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { CategoryProductSlider } from '../components/home/CategoryProductSlider.js';
import { ProductCardSkeleton } from '../components/ui/Skeleton.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { Badge } from '../components/ui/Badge.js';
import { Link, useRouter } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { formatNumber } from '../lib/scoring.js';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [data, setData] = useState<HomeDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'SLIDERS' | 'GRID'>('SLIDERS');
  const [activeTab, setActiveTab] = useState<'POPULAR' | 'TOP_RATED' | 'BEST_BUY'>('POPULAR');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getHomeData();
      setData(res);
    } catch (err: any) {
      console.error('Home data load error:', err);
      setError(err.message || 'Ana sayfa verileri yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'NeDiyor — Binlerce Görüş. Tek Net Cevap.';
    loadData();
  }, []);

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('telefon')) return <Smartphone className="w-5 h-5 text-indigo-600" />;
    if (slug.includes('bilgisayar') || slug.includes('laptop')) return <Laptop className="w-5 h-5 text-violet-600" />;
    if (slug.includes('kulaklik') || slug.includes('ses')) return <Headphones className="w-5 h-5 text-emerald-600" />;
    if (slug.includes('saat')) return <Watch className="w-5 h-5 text-amber-600" />;
    if (slug.includes('kamera') || slug.includes('fotograf')) return <Camera className="w-5 h-5 text-rose-600" />;
    if (slug.includes('televizyon') || slug.includes('tv')) return <Tv className="w-5 h-5 text-sky-600" />;
    return <Layers className="w-5 h-5 text-indigo-600" />;
  };

  // Filter products based on selected tab and category
  let baseProducts: Product[] = [];
  if (activeTab === 'POPULAR') {
    baseProducts = data?.popularProducts || [];
  } else if (activeTab === 'TOP_RATED') {
    baseProducts = data?.topRatedProducts || [];
  } else {
    // Best Buy (ALINIR verdict)
    baseProducts = (data?.popularProducts || []).filter(p => p.score?.verdict === 'ALINIR');
  }

  const displayedProducts = selectedCategoryFilter === 'ALL'
    ? baseProducts
    : baseProducts.filter(p => p.categoryId === selectedCategoryFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-indigo-50/25 to-slate-50">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[800px] h-[550px] rounded-full bg-indigo-500/5 blur-[130px] -translate-y-12" />
          <div className="w-[600px] h-[450px] rounded-full bg-violet-500/5 blur-[110px] translate-x-48" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] leading-[1.06] mb-6">
            Binlerce görüş. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              Tek net cevap.
            </span>
          </h1>

          {/* Subtitle Value Proposition */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed font-normal px-2">
            E-ticaret onaylı alıcı yorumları, forum tartışmaları ve video incelemelerini yapay zeka ile sentezleyerek objektif konsensüs puanı ve satın alma kararı sunuyoruz.
          </p>

          {/* Main Search Component Container */}
          <div className="mb-6 sm:mb-8 w-full max-w-3xl mx-auto px-1 sm:px-0">
            <SearchBar size="large" autoFocus />
          </div>

          {/* Quick Category & Comparison Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Popüler:</span>
            </span>
            <button
              onClick={() => navigate('/ara?q=iPhone+16+Pro')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all hover:border-indigo-300 shadow-2xs font-medium text-xs whitespace-nowrap"
            >
              iPhone 16 Pro
            </button>
            <button
              onClick={() => navigate('/ara?q=Galaxy+S24+Ultra')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all hover:border-indigo-300 shadow-2xs font-medium text-xs whitespace-nowrap"
            >
              Galaxy S24 Ultra
            </button>
            <button
              onClick={() => navigate('/ara?q=MacBook+Air+M3')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all hover:border-indigo-300 shadow-2xs font-medium text-xs whitespace-nowrap"
            >
              MacBook Air M3
            </button>
            <button
              onClick={() => navigate('/ara?q=Roborock+Q+Revo')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all hover:border-indigo-300 shadow-2xs font-medium text-xs whitespace-nowrap hidden sm:inline-block"
            >
              Roborock Q Revo
            </button>
            <button
              onClick={() => navigate('/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra')}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-all flex items-center gap-1.5 font-bold shadow-2xs text-xs whitespace-nowrap"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              iPhone vs S24 Ultra
            </button>
          </div>
        </div>
      </section>

      {/* ERROR STATE */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorState message={error} onRetry={loadData} />
        </div>
      )}

      {/* 2. 4-PILLAR INTERACTIVE DECISION TOOLS (BENTO SUITE) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Akıllı Karar Ekosistemi</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
              Hangi Karar Aracına İhtiyacınız Var?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Yapay zeka destekli modüllerle ihtiyacınıza en uygun modeli saniyeler içinde belirleyin.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 bg-slate-100 px-2.5 py-1 rounded-full">
            <span>Kaydırın</span>
            <ArrowRight className="w-3 h-3 text-slate-500 animate-pulse" />
          </div>
        </div>

        {/* Mobile Swipeable Card Carousel / Desktop 4-Col Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none no-scrollbar pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* Tool 1: Akıllı Ürün Bulucu */}
          <Link
            href="/urun-bulucu"
            className="w-[84vw] xs:w-[290px] sm:w-auto shrink-0 snap-center p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-emerald-950/95 via-slate-900 to-slate-950 text-white border border-emerald-700/50 hover:border-emerald-400 transition-all group flex flex-col justify-between shadow-lg shadow-emerald-950/20 active:scale-[0.98]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform shadow-inner">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono uppercase tracking-wider">
                  AI Sihirbazı
                </span>
              </div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                İhtiyaç Analizi
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] mb-1.5">
                Akıllı Ürün Bulucu
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Bütçenizi ve önceliklerinizi (pil, kamera, hafiflik vb.) belirleyin, size en uygun modeli bulalım.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
              <span>Sihirbazı Başlat</span>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>
          </Link>

          {/* Tool 2: Fırsat & Dip Fiyat Radarı */}
          <Link
            href="/firsat-radari"
            className="w-[84vw] xs:w-[290px] sm:w-auto shrink-0 snap-center p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-rose-950/95 via-slate-900 to-slate-950 text-white border border-rose-700/50 hover:border-rose-400 transition-all group flex flex-col justify-between shadow-lg shadow-rose-950/20 active:scale-[0.98]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform shadow-inner">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-mono uppercase tracking-wider">
                  Canlı Fiyat
                </span>
              </div>
              <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                Dip Fiyat Alarmı
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] mb-1.5">
                Fırsat & Fiyat Radarı
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Son 6 ayın en ucuz fiyatına inen doğrulanmış modelleri ve gerçek indirim fırsatlarını yakalayın.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-rose-800/60 flex items-center justify-between text-xs font-bold text-rose-300 group-hover:text-rose-200">
              <span>Fırsatları İncele</span>
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-rose-300" />
              </div>
            </div>
          </Link>

          {/* Tool 3: Yükseltme Danışmanı */}
          <Link
            href="/yukseltme-danismani"
            className="w-[84vw] xs:w-[290px] sm:w-auto shrink-0 snap-center p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-indigo-950/95 via-slate-900 to-slate-950 text-white border border-indigo-700/50 hover:border-indigo-400 transition-all group flex flex-col justify-between shadow-lg shadow-indigo-950/20 active:scale-[0.98]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform shadow-inner">
                  <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono uppercase tracking-wider">
                  Değişim Kararı
                </span>
              </div>
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Yükseltme Rehberi
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] mb-1.5">
                Yükseltmeye Değer mi?
              </h3>
              <p className="text-xs text-indigo-100/80 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Eski cihazınızla yeni amiral gemisi arasındaki performans farkını ve harcanacak paranın karşılığını görün.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-indigo-800/60 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
              <span>Cihazını Kıyasla</span>
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </div>
            </div>
          </Link>

          {/* Tool 4: Çoklu Karşılaştırma */}
          <Link
            href="/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra"
            className="w-[84vw] xs:w-[290px] sm:w-auto shrink-0 snap-center p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-violet-950/95 via-slate-900 to-slate-950 text-white border border-violet-700/50 hover:border-violet-400 transition-all group flex flex-col justify-between shadow-lg shadow-violet-950/20 active:scale-[0.98]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform shadow-inner">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 font-mono uppercase tracking-wider">
                  2-4 Model
                </span>
              </div>
              <div className="text-[11px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                Kıyaslama Matrisi
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] mb-1.5">
                Çoklu Karşılaştırma
              </h3>
              <p className="text-xs text-violet-100/80 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Modelleri yan yana koyarak kullanıcı memnuniyeti, F/P ve donanım puanlarını karşılaştırın.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-violet-800/60 flex items-center justify-between text-xs font-bold text-violet-300 group-hover:text-violet-200">
              <span>Karşılaştırmayı Aç</span>
              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-violet-300" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE WITH STACKED CATEGORY SLIDERS & GRID MODES */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Gündemdeki Ürünler & Konsensüs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
              Tüketicilerin Ne Dediğini Keşfedin
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              On binlerce doğrulanmış alıcı yorumundan elde edilen net puanlar ve karar özetleri
            </p>
          </div>

          {/* View Mode Toggle: Sliders vs Grid */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setViewMode('SLIDERS')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'SLIDERS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Kategori Slider'ları</span>
            </button>
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Filtreli Izgara</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-10">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-slate-200/70 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'SLIDERS' ? (
          /* =========================================================================
             CATEGORY PRODUCT SLIDERS (Stacked row-by-row horizontal carousels)
             ========================================================================= */
          <div className="space-y-12">
            {data?.categorySections && data.categorySections.length > 0 ? (
              data.categorySections.map((sec) => (
                <CategoryProductSlider
                  key={sec.category.id}
                  category={sec.category}
                  products={sec.products}
                />
              ))
            ) : (
              // Fallback if categorySections not populated
              data?.categories.map((cat) => {
                const catProducts = (data.popularProducts || []).filter(p => p.categoryId === cat.id);
                if (catProducts.length === 0) return null;
                return (
                  <CategoryProductSlider
                    key={cat.id}
                    category={cat}
                    products={catProducts}
                  />
                );
              })
            )}
          </div>
        ) : (
          /* =========================================================================
             GRID VIEW WITH TABS & PILLS
             ========================================================================= */
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
                <button
                  onClick={() => setActiveTab('POPULAR')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'POPULAR'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  En Çok Konuşulanlar
                </button>
                <button
                  onClick={() => setActiveTab('TOP_RATED')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'TOP_RATED'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  En Yüksek Puanlılar (8.5+)
                </button>
                <button
                  onClick={() => setActiveTab('BEST_BUY')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'BEST_BUY'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-300" />
                  "Alınır" Kararlı Modeller
                </button>
              </div>

              {/* Category Pills on Top of Grid */}
              {data && data.categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  <button
                    onClick={() => setSelectedCategoryFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategoryFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Tüm Kategoriler
                  </button>
                  {data.categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium">Bu filtreleme kriterlerine uygun ürün bulunamadı.</p>
                <button
                  onClick={() => setSelectedCategoryFilter('ALL')}
                  className="mt-3 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/ara">
            <Button variant="secondary" size="md" className="font-bold px-8 shadow-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Tüm Kataloğu ve Filtreleri İncele ({data?.stats.totalProducts || '50+'} Model)
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. ACTIVE CATEGORIES */}
      <section className="py-10 sm:py-16 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Katalog Kapsamı</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
                Aktif Kategoriler
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                İncelemek istediğiniz ürün segmentini seçin
              </p>
            </div>
            <Link href="/ara">
              <span className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                <span>Tümü</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3.5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 sm:h-28 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : data && data.categories.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3.5">
              {data.categories.map(category => (
                <Link
                  key={category.id}
                  href={`/ara?category=${category.slug}`}
                  className="p-2.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-indigo-300 text-center transition-all group flex flex-col items-center justify-center min-h-[96px] sm:min-h-[120px] shadow-2xs hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 active:scale-95 active:bg-indigo-50/60"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center mb-1.5 sm:mb-2.5 group-hover:scale-110 group-hover:bg-indigo-100 transition-all border border-indigo-100/90 shadow-2xs">
                    {getCategoryIcon(category.slug)}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 w-full text-center">
                    {category.name}
                  </span>
                  {category.productCount !== undefined && (
                    <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium">
                      {category.productCount} model
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* 5. BRAND INTELLIGENCE & POPULAR BRAND PROFILES */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Marka Zekası & Servis Karnesi</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
                Öne Çıkan Marka Profilleri
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Markaların donanım güvenilirliği, garanti memnuniyeti ve AI tüketici özetleri
              </p>
            </div>
            <Link href="/markalar">
              <span className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0">
                <span>Tümü {data?.brands ? `(${data.brands.length})` : ''}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : data && data.brands && data.brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {data.brands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/marka/${brand.slug}`}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-indigo-50/40 border border-slate-200/90 hover:border-indigo-300 transition-all group flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white font-black text-xs sm:text-sm flex items-center justify-center font-['Space_Grotesk'] group-hover:bg-indigo-600 transition-colors shadow-2xs">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {brand.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-400">
                        {brand.originCountry || 'Küresel'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {brand.productCount || 0} Model
                    </span>
                    {brand.averageScore && (
                      <span className="font-black text-indigo-600 font-['Space_Grotesk'] text-xs">
                        ★ {brand.averageScore}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* 6. METHODOLOGY / HOW IT WORKS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] sm:text-xs font-bold mb-2.5">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Şeffaf & Doğrulanabilir</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
            NeDiyor Konsensüs Sistemi Nasıl Çalışır?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto">
            Sponsorlu içeriklerin ve manipülatif reklamların ötesinde, tarafsız tüketici zekası
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          
          {/* Step 1 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white to-indigo-50/30 border border-slate-200/90 relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 font-black text-base sm:text-lg font-['Space_Grotesk'] shadow-2xs">
                  01
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 uppercase tracking-wider">
                  Veri Havuzu
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-1.5">
                Çok Kaynaklı Veri Toplama
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                E-ticaret platformlarındaki onaylı alıcı yorumları, teknoloji forumları, YouTube kullanıcı tartışmaları ve şikayet portalları taranır.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-indigo-700 font-bold">
              <Database className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">10.000+ Bağımsız Görüş</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white to-violet-50/30 border border-slate-200/90 relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-50 border border-violet-200/80 flex items-center justify-center text-violet-600 font-black text-base sm:text-lg font-['Space_Grotesk'] shadow-2xs">
                  02
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100/70 text-violet-700 uppercase tracking-wider">
                  Yapay Zeka
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-1.5">
                AI Duygu & Konu Sentezi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yapay zeka modellerimiz her yorumu kamera, pil ömrü, malzeme kalitesi, ekran ve kronik sorunlar gibi başlıklara ayırarak duygu skorunu hesaplar.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-violet-700 font-bold">
              <Bot className="w-4 h-4 text-violet-600 shrink-0" />
              <span className="truncate">NLP & Duygu Skorlaması</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200/90 relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 font-black text-base sm:text-lg font-['Space_Grotesk'] shadow-2xs">
                  03
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 uppercase tracking-wider">
                  Sonuç
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-1.5">
                Net Konsensüs & Karar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Saatler süren inceleme okuma zorunluluğunu ortadan kaldırarak 10 üzerinden konsensüs puanı ve "Alınır mı?" kararını tek bakışta sunar.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Saniyeler İçinde Doğru Karar</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
