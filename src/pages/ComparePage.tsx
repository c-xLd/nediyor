import React, { useEffect, useState } from 'react';
import { 
  Scale, 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  ArrowLeftRight, 
  CheckCircle2,
  Plus,
  Trash2,
  Zap,
  Battery,
  DollarSign,
  Star,
  ExternalLink,
  ChevronDown,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useRouter, Link } from '../lib/router.js';
import { api } from '../lib/api.js';
import { ProductDetailData, MultiCompareResponse, MultiCompareWinners } from '../types/index.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { formatScore, formatNumber } from '../lib/scoring.js';
import { CompareProductPickerModal } from '../components/product/CompareProductPickerModal.js';

export const ComparePage: React.FC = () => {
  const { query, navigate } = useRouter();
  
  // Extract up to 4 slugs
  const p1Slug = query.p1 || 'apple-iphone-16-pro';
  const p2Slug = query.p2 || 'samsung-galaxy-s24-ultra';
  const p3Slug = query.p3 || '';
  const p4Slug = query.p4 || '';

  const activeSlugs = [p1Slug, p2Slug, p3Slug, p4Slug].filter(Boolean);

  const [comparisonData, setComparisonData] = useState<MultiCompareResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const loadComparison = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getMultiComparison(activeSlugs);
      setComparisonData(res);
      const productNames = res.products.map(p => p.name).join(' vs ');
      document.title = `${productNames} Çoklu Karşılaştırma | NeDiyor`;
    } catch (err: any) {
      console.error('Comparison load error:', err);
      setError(err.message || 'Karşılaştırma verileri alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, [p1Slug, p2Slug, p3Slug, p4Slug]);

  const updateUrlWithSlugs = (slugs: string[]) => {
    const params = new URLSearchParams();
    slugs.forEach((slug, idx) => {
      params.set(`p${idx + 1}`, slug);
    });
    navigate(`/karsilastir?${params.toString()}`);
  };

  const handleAddProduct = (newSlug: string) => {
    if (activeSlugs.length < 4 && !activeSlugs.includes(newSlug)) {
      updateUrlWithSlugs([...activeSlugs, newSlug]);
    }
  };

  const handleRemoveProduct = (slugToRemove: string) => {
    if (activeSlugs.length > 2) {
      const remaining = activeSlugs.filter(s => s !== slugToRemove);
      updateUrlWithSlugs(remaining);
    }
  };

  const handleSwapFirstTwo = () => {
    if (activeSlugs.length >= 2) {
      const swapped = [...activeSlugs];
      const temp = swapped[0];
      swapped[0] = swapped[1];
      swapped[1] = temp;
      updateUrlWithSlugs(swapped);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
          {activeSlugs.length} Ürünün Konsensüs Verileri Karşılaştırılıyor
        </h3>
        <p className="text-sm text-slate-500">
          Tüm ürünlerin gerçek kullanıcı geri bildirimleri, F/P endeksleri ve donanım skorları yan yana getiriliyor...
        </p>
      </div>
    );
  }

  if (error || !comparisonData || comparisonData.products.length < 2) {
    const isCategoryError = error?.toLowerCase().includes('kategori');

    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        {isCategoryError ? (
          <div className="bg-white border border-rose-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Aynı Kategori Kuralı
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
                Yalnızca Aynı Kategorideki Ürünler Karşılaştırılabilir
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                {error}
              </p>
            </div>

            {/* Quick suggested comparisons */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Önerilen Popüler Karşılaştırmalar:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra&p3=google-pixel-9-pro">
                  <Button variant="outline" size="sm" className="text-xs border-slate-200 hover:border-indigo-400">
                    📱 Telefonlar: iPhone 16 Pro vs S24 Ultra vs Pixel 9 Pro
                  </Button>
                </Link>
                <Link href="/karsilastir?p1=apple-macbook-pro-14-m3-pro&p2=dell-xps-14-2024">
                  <Button variant="outline" size="sm" className="text-xs border-slate-200 hover:border-indigo-400">
                    💻 Laptoplar: MacBook Pro vs Dell XPS 14
                  </Button>
                </Link>
                <Link href="/karsilastir?p1=sony-wh-1000xm5&p2=apple-airpods-max">
                  <Button variant="outline" size="sm" className="text-xs border-slate-200 hover:border-indigo-400">
                    🎧 Kulaklıklar: Sony XM5 vs AirPods Max
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/ara">
                <Button variant="primary" size="md" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Tüm Ürün Kataloğuna Göz At
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ErrorState message={error || 'Ürünler karşılaştırılamadı.'} onRetry={loadComparison} />
        )}
      </div>
    );
  }

  const { products, winners } = comparisonData;
  const currentCategoryName = products[0]?.categoryName || 'Elektronik';
  const currentCategoryId = products[0]?.categoryId;

  const gridColsClass = 
    products.length === 2 
      ? 'grid-cols-1 md:grid-cols-2' 
      : products.length === 3 
      ? 'grid-cols-1 md:grid-cols-3' 
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  // Gather unique topic names across all products
  const allTopicNames = Array.from(
    new Set(products.flatMap(p => p.topicScores.map(t => t.topicName)))
  );

  return (
    <div className="min-h-screen py-8 md:py-12 relative bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
              <div className="flex items-center gap-1">
                <Scale className="w-4 h-4" />
                <span>Çoklu Karşılaştırma Sihirbazı</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kategori: {currentCategoryName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-emerald-700 font-semibold lowercase">aynı kategori doğrulandı</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
              {products.map(p => p.name).join(' vs ')}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {products.length < 4 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPickerOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                + Model Ekle ({products.length}/4)
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapFirstTwo}
              leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Yer Değiştir
            </Button>
            <Link href="/ara">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />} className="text-xs">
                Kataloğa Dön
              </Button>
            </Link>
          </div>
        </div>

        {/* 1. WINNERS & LEADERSHIP DASHBOARD BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Karşılaştırma Liderleri & Kazananlar</h2>
              <p className="text-xs text-indigo-200">
                NeDiyor konsensüs algoritması tarafından {products.length} ürün arasında belirlenen şampiyonlar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Champion */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Genel Şampiyon</span>
              </div>
              <div className="font-bold text-white text-base line-clamp-1">
                {products.find(p => p.id === winners.overallWinnerId)?.name}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {winners.overallWinnerReason}
              </p>
            </div>

            {/* Best Value Champion */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>F/P Şampiyonu</span>
              </div>
              <div className="font-bold text-white text-base line-clamp-1">
                {products.find(p => p.id === winners.bestFpId)?.name}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {winners.bestFpReason}
              </p>
            </div>

            {/* Battery Leader */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Battery className="w-4 h-4" />
                <span>Pil & Dayanıklılık</span>
              </div>
              <div className="font-bold text-white text-base line-clamp-1">
                {products.find(p => p.id === winners.bestBatteryId)?.name}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {winners.bestBatteryReason || 'Uzun süreli kullanım ve pil ömründe en yüksek puana sahip.'}
              </p>
            </div>

            {/* Hardware & Display Leader */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Donanım & Ekran</span>
              </div>
              <div className="font-bold text-white text-base line-clamp-1">
                {products.find(p => p.id === winners.bestHardwareId)?.name}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {winners.bestHardwareReason || 'Donanım kalitesi ve ekran teknolojisinde öne çıkıyor.'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. PRODUCT CARDS GRID (STICKY HEADERS) */}
        <div className={`grid ${gridColsClass} gap-6`}>
          {products.map((product) => {
            const isWinner = product.id === winners.overallWinnerId;
            const isFpWinner = product.id === winners.bestFpId;

            return (
              <div
                key={product.id}
                className={`p-6 rounded-3xl bg-white border transition-all relative overflow-hidden shadow-md flex flex-col justify-between ${
                  isWinner
                    ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-xl'
                    : 'border-slate-200'
                }`}
              >
                {/* Remove product button */}
                {products.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.slug)}
                    title="Karşılaştırmadan Çıkar"
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Badges top */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {isWinner && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" /> Şampiyon
                      </span>
                    )}
                    {isFpWinner && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> En İyi F/P
                      </span>
                    )}
                    <Badge variant="indigo" size="sm">
                      {product.brandName}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Photo */}
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Tag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Score & Verdict Tag */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900 font-['Space_Grotesk']">
                        {formatScore(product.score?.overallScore)}
                        <span className="text-xs text-slate-400 font-medium"> / 10</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {formatNumber(product.score?.mentionCount || 0)} gerçek görüş
                      </div>
                    </div>
                    <Badge
                      variant={product.verdictInfo.variant}
                      size="md"
                      className="font-bold text-xs"
                    >
                      {product.verdictInfo.label}
                    </Badge>
                  </div>

                  {/* Price info */}
                  {product.priceInfo && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Piyasa Fiyatı</span>
                        <span className="font-bold text-slate-900 text-sm">{product.priceInfo.formattedPrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">F/P Endeksi</span>
                        <span className="font-bold text-emerald-700">{product.priceInfo.fpScore.toFixed(1)} / 10</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail CTA Link */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link href={`/urun/${product.slug}`} className="block">
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                      Tüm Analiz Raporu <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. DETAILED SCORE MATRIX (SIDE-BY-SIDE) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Kategori ve Donanım Kriteri Skor Karşılaştırması</h3>
              <p className="text-xs text-slate-500">Her bir alt özelliğin 10 üzerinden konsensüs puanları</p>
            </div>
          </div>

          <div className="space-y-4">
            {allTopicNames.map((topicName) => {
              // Find scores for this topic
              const scores = products.map(p => {
                const found = p.topicScores.find(t => t.topicName === topicName);
                return {
                  productId: p.id,
                  productName: p.name,
                  score: found ? found.score : null
                };
              });

              const maxScoreInTopic = Math.max(
                ...scores.map(s => s.score || 0)
              );

              return (
                <div key={topicName} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{topicName}</span>
                    <span className="text-slate-400 font-normal text-[11px]">10 üzerinden</span>
                  </div>

                  <div className={`grid ${gridColsClass} gap-4`}>
                    {scores.map((s, idx) => {
                      const isLeader = s.score !== null && s.score === maxScoreInTopic && maxScoreInTopic > 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="text-slate-600 font-medium truncate flex-1">{s.productName}</span>
                            <span className={`font-bold flex-shrink-0 ${isLeader ? 'text-indigo-600' : 'text-slate-700'}`}>
                              {s.score !== null ? `${s.score.toFixed(1)}` : '-'}
                              {isLeader && <span className="ml-1 text-[10px] text-indigo-600 font-extrabold">★ Lider</span>}
                            </span>
                          </div>
                          {/* Bar */}
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLeader ? 'bg-indigo-600' : 'bg-slate-400'
                              }`}
                              style={{ width: `${s.score ? s.score * 10 : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. AI PROS & CONS SIDE-BY-SIDE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Yapay Zeka Özetli Artılar ve Eksiler</h3>
              <p className="text-xs text-slate-500">Kullanıcı yorumlarının sentezinden çıkarılan güçlü ve zayıf yönler</p>
            </div>
          </div>

          <div className={`grid ${gridColsClass} gap-6`}>
            {products.map((product) => (
              <div key={product.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 border-b border-slate-200 pb-2">
                  {product.name}
                </h4>

                {/* Pros */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Öne Çıkan Artılar</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {product.aiSummary?.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">+</span>
                        <span className="leading-tight">{pro}</span>
                      </li>
                    )) || <li className="text-slate-400">Veri bulunmuyor.</li>}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>Eleştirilen Eksiler</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {product.aiSummary?.cons.map((con, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">-</span>
                        <span className="leading-tight">{con}</span>
                      </li>
                    )) || <li className="text-slate-400">Veri bulunmuyor.</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Picker Modal */}
        <CompareProductPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelectProduct={handleAddProduct}
          alreadySelectedSlugs={activeSlugs}
          targetCategoryId={currentCategoryId}
          targetCategoryName={currentCategoryName}
        />
      </div>
    </div>
  );
};
