import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Tag, 
  Share2, 
  Heart, 
  Scale, 
  ChevronRight, 
  AlertCircle,
  Bell,
  Sparkles,
  Bot,
  MessageSquare,
  Award,
  Layers,
  CheckCircle2,
  TrendingDown,
  ArrowUp
} from 'lucide-react';
import { ProductDetailData } from '../types/index.js';
import { api } from '../lib/api.js';
import { Link, useRouter } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { ScoreOverview } from '../components/product/ScoreOverview.js';
import { VerdictBox } from '../components/product/VerdictBox.js';
import { AISummaryBox } from '../components/product/AISummaryBox.js';
import { TopicAnalysis } from '../components/product/TopicAnalysis.js';
import { SourcesSection } from '../components/product/SourcesSection.js';
import { MentionsList } from '../components/product/MentionsList.js';
import { AlternativeProducts } from '../components/product/AlternativeProducts.js';
import { PriceAlertModal } from '../components/product/PriceAlertModal.js';
import { PriceTrackingSection } from '../components/product/PriceTrackingSection.js';
import { CommunityReviewsSection } from '../components/product/CommunityReviewsSection.js';
import { ConsensusQA } from '../components/product/ConsensusQA.js';
import { ChronicIssuesAndWarrantySection } from '../components/product/ChronicIssuesAndWarrantySection.js';
import { CommunityPulsePoll } from '../components/product/CommunityPulsePoll.js';
import { TrendChartSection } from '../components/product/TrendChartSection.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { useToast } from '../components/ui/Toast.js';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('genel-bakis');
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const loadProduct = async () => {
    setIsLoading(true);
    setError(null);
    setIs404(false);

    try {
      const data = await api.getProductBySlug(slug);
      setProduct(data);
      document.title = `${data.name} Yorumları ve Konsensüs Analizi | NeDiyor`;
      
      // Check favorites
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('nediyor_favorites') || '[]');
        setIsFavorite(savedFavorites.includes(slug));
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error('Product load error:', err);
      if (err.status === 404) {
        setIs404(true);
        document.title = 'Ürün Bulunamadı | NeDiyor';
      } else {
        setError(err.message || 'Ürün bilgileri yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  // Handle active section scrolling spy & scroll threshold
  useEffect(() => {
    const sections = ['genel-bakis', 'fiyat-analizi', 'yapay-zeka', 'analiz-ve-sorunlar', 'kullanici-yorumlari', 'alternatifler'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledPastHero(scrollY > 280);

      const scrollPosition = scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top - 40) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Ürün analiz bağlantısı panoya kopyalandı!');
    }
  };

  const handleToggleFavorite = () => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('nediyor_favorites') || '[]');
      let updated: string[] = [];
      if (isFavorite) {
        updated = savedFavorites.filter((s: string) => s !== slug);
        setIsFavorite(false);
        showToast('Ürün favorilerinizden kaldırıldı.');
      } else {
        updated = [...savedFavorites, slug];
        setIsFavorite(true);
        showToast('Ürün takip listesine (favorilere) eklendi!');
      }
      localStorage.setItem('nediyor_favorites', JSON.stringify(updated));
    } catch (e) {
      setIsFavorite(!isFavorite);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'genel-bakis', label: 'Genel Bakış & Karar', shortLabel: 'Genel Bakış', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'fiyat-analizi', label: 'Fiyat & Trendler', shortLabel: 'Fiyat & Trend', icon: <Tag className="w-3.5 h-3.5" /> },
    { id: 'yapay-zeka', label: 'Yapay Zeka Danışmanı', shortLabel: 'AI Danışman', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'analiz-ve-sorunlar', label: 'Detaylar & Sorunlar', shortLabel: 'Kronik Sorunlar', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { id: 'kullanici-yorumlari', label: 'Kaynaklar & Yorumlar', shortLabel: 'Yorumlar', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'alternatifler', label: 'Benzer & Karşılaştır', shortLabel: 'Alternatifler', icon: <Scale className="w-3.5 h-3.5" /> },
  ];

  if (is404) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
            Ürün Bulunamadı (404)
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Aradığınız "<strong>{slug}</strong>" isimli ürün veritabanımızda kayıtlı değil veya kaldırılmış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/ara')}>
              Ürünleri Ara
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="lg:col-span-8 space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
            <div className="h-32 bg-slate-200 rounded-3xl animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 relative bg-slate-50 text-slate-900">
      
      {/* Price Alert Modal */}
      {product.priceInfo && (
        <PriceAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          productName={product.name}
          currentPrice={product.priceInfo.currentPrice}
        />
      )}

      {/* =========================================================================
          SLEEK & MINIMAL STICKY SUB-HEADER MENU (Sayfa Bölümleri)
         ========================================================================= */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-13">
            
            {/* Left: Product Name & Score */}
            <div className="flex items-center gap-2.5 min-w-0 shrink-0">
              {product.imageUrl && (
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 p-0.5 flex items-center justify-center shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900 truncate max-w-[160px] sm:max-w-[200px] hidden sm:inline">
                {product.name}
              </span>
              {product.score && (
                <span className="inline-flex items-center font-['Space_Grotesk'] font-bold text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-700 shrink-0">
                  ★ {product.score.overallScore.toFixed(1)}
                </span>
              )}
            </div>

            {/* Center: Clean Segmented Pill Navigation */}
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 flex-1 justify-start md:justify-center">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-300' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Action Pill Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {product.priceInfo && (
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 font-bold text-xs items-center gap-1.5 transition-colors cursor-pointer"
                  title="Fiyat Alarmı Kur"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Fiyat Alarmı</span>
                </button>
              )}

              <button
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-rose-600'
                }`}
                title={isFavorite ? 'Takip Listesinde' : 'Takip Listesine Ekle'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={scrollToTop}
                title="En Başa Dön"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/ara?category=${product.categoryId}`}
            className="hover:text-slate-900 transition-colors"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        <div id="genel-bakis" className="space-y-10 scroll-mt-28">
              
              {/* 1. PRODUCT HERO HEADER */}
              <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-2xs relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  
                  {/* Image Gallery Column */}
                  <div className="lg:col-span-5">
                    <div className="aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-slate-50/80 border border-slate-200/80 relative group p-4 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Tag className="w-12 h-12" />
                        </div>
                      )}

                      {/* Score floating tag */}
                      {product.score && (
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant={
                              product.score.overallScore >= 8.0
                                ? 'emerald'
                                : product.score.overallScore >= 6.5
                                ? 'amber'
                                : 'rose'
                            }
                            size="md"
                            className="font-black text-xs shadow-md"
                          >
                            ★ {product.score.overallScore.toFixed(1)} / 10
                          </Badge>
                        </div>
                      )}

                      {/* Verified Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Doğrulanmış Konsensüs</span>
                      </div>
                    </div>
                  </div>

                  {/* Info & Meta Column */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* Category & Brand Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/marka/${product.brandId.replace('brand-', '')}`} className="group">
                        <Badge variant="indigo" size="md" className="group-hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer">
                          <span>{product.brandName}</span>
                          <span className="text-[10px] opacity-75">Profili →</span>
                        </Badge>
                      </Link>
                      <Link href={`/ara?category=${product.categoryId}`}>
                        <Badge variant="slate" size="md">
                          {product.categoryName}
                        </Badge>
                      </Link>
                      {product.releaseYear && (
                        <Badge variant="neutral" size="sm">
                          {product.releaseYear} Modeli
                        </Badge>
                      )}
                    </div>

                    {/* Title & Model */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                      {product.name}
                    </h1>

                    <div className="text-xs font-mono text-slate-500">
                      Model Kodu: <span className="text-slate-800 font-semibold">{product.model}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {product.description}
                    </p>

                    {/* Key Highlights Bento Grid (Quick Stats) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Konsensüs</span>
                        <span className="text-sm sm:text-base font-black text-slate-900 font-['Space_Grotesk']">
                          {product.score?.overallScore.toFixed(1) || 'N/A'} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Memnuniyet</span>
                        <span className="text-sm sm:text-base font-black text-emerald-600 font-['Space_Grotesk']">
                          %{product.score?.positiveRatio || 85}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">F/P Durumu</span>
                        <span className="text-xs sm:text-sm font-bold text-indigo-700 truncate block">
                          {product.priceInfo?.fpVerdict || 'İyi F/P'}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">En Uygun</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                          {product.priceInfo?.formattedPrice || product.priceRange || 'Görüntüle'}
                        </span>
                      </div>
                    </div>

                    {/* Actions Button Row */}
                    <div className="pt-3 flex flex-wrap items-center gap-2.5">
                      <Button
                        variant={isFavorite ? 'primary' : 'secondary'}
                        size="md"
                        onClick={handleToggleFavorite}
                        className={isFavorite ? 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white' : ''}
                        leftIcon={<Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : 'text-slate-500'}`} />}
                      >
                        {isFavorite ? 'Takipte' : 'Favorilere Ekle'}
                      </Button>

                      {product.priceInfo && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => setIsAlertModalOpen(true)}
                          leftIcon={<Bell className="w-4 h-4 text-indigo-600" />}
                        >
                          Fiyat Alarmı
                        </Button>
                      )}

                      <Link href={`/yukseltme-danismani?to=${product.slug}`}>
                        <Button
                          variant="outline"
                          size="md"
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold"
                          leftIcon={<Bot className="w-4 h-4 text-indigo-600" />}
                        >
                          Yükseltmeye Değer mi?
                        </Button>
                      </Link>

                      {product.alternatives && product.alternatives.length > 0 && (
                        <Link href={`/karsilastir?p1=${product.slug}&p2=${product.alternatives[0].slug}`}>
                          <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<Scale className="w-4 h-4 text-slate-500" />}
                          >
                            Karşılaştır
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleShare}
                        leftIcon={<Share2 className="w-4 h-4 text-slate-500" />}
                      >
                        Paylaş
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. SCORE OVERVIEW (Animated Gauge & Metric Bars) */}
              <section>
                <ScoreOverview score={product.score} />
              </section>

              {/* 3. ALINIR MI? (VERDICT BOX) */}
              <section>
                <VerdictBox verdictInfo={product.verdictInfo} productName={product.name} />
              </section>
            </div>

            {/* 3.5 FIYAT / PERFORMANS & PIYASA FIYAT TAKIBI & TREND GRAFİĞİ */}
            <div id="fiyat-analizi" className="space-y-10 scroll-mt-28">
              {product.priceInfo && (
                <>
                  <section>
                    <PriceTrackingSection
                      productName={product.name}
                      priceInfo={product.priceInfo}
                    />
                  </section>
                  
                  {/* PRICE & SENTIMENT TREND CHART */}
                  {product.priceInfo.history && product.priceInfo.history.length > 0 && (
                    <section>
                      <TrendChartSection
                        productName={product.name}
                        history={product.priceInfo.history}
                      />
                    </section>
                  )}
                </>
              )}
            </div>

            {/* 4. YAPAY ZEKA KONSENSUS OMRU & SORU-CEVAP */}
            <div id="yapay-zeka" className="space-y-10 scroll-mt-28">
              {/* AI Summary Box */}
              <section>
                <AISummaryBox summary={product.aiSummary} productName={product.name} />
              </section>

              {/* Consensus QA Chat Widget */}
              <section>
                <ConsensusQA product={product} />
              </section>
            </div>

            {/* 5. TOPIC BREAKDOWN & CHRONIC ISSUES */}
            <div id="analiz-ve-sorunlar" className="space-y-10 scroll-mt-28">
              {/* Topic Analysis */}
              <section>
                <TopicAnalysis
                  topicScores={product.topicScores}
                  mostPraised={product.mostPraisedTopics}
                  mostCriticized={product.mostCriticizedTopics}
                />
              </section>

              {/* Chronic Issues & Warranty Grade */}
              {product.chronicAndWarranty && (
                <section>
                  <ChronicIssuesAndWarrantySection product={product} />
                </section>
              )}
            </div>

            {/* 6. KAYNAKLAR, KULLANICI GORUSLERI & ANKET */}
            <div id="kullanici-yorumlari" className="space-y-10 scroll-mt-28">
              {/* Verified Sources List */}
              <section>
                <SourcesSection sources={product.sources} />
              </section>

              {/* Authentic User Reviews Mentions */}
              <section>
                <MentionsList mentions={product.mentions} />
              </section>

              {/* Community Pulse Poll */}
              <section>
                <CommunityPulsePoll product={product} />
              </section>

              {/* Community Reviews & Experiences */}
              <section>
                <CommunityReviewsSection
                  productSlug={product.slug}
                  productName={product.name}
                  reviews={product.communityReviews}
                />
              </section>
            </div>

            {/* 7. ALTERNATIFLER & KARŞILAŞTIRMA */}
            <div id="alternatifler" className="space-y-10 scroll-mt-28">
              <section>
                <AlternativeProducts
                  currentProductSlug={product.slug}
                  alternatives={product.alternatives}
                />
              </section>
            </div>

      </div>
    </div>
  );
};
