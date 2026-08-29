import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Globe, 
  Calendar, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Scale, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  ChevronRight,
  Filter,
  Flame,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useRouter } from '../lib/router.js';
import { BrandDetailResponse, Product, ProductScore } from '../types/index.js';
import { Button } from '../components/ui/Button.js';
import { formatScore, getScoreBadgeColor, getScoreBgClass, getVerdictText } from '../lib/scoring.js';

interface BrandProfilePageProps {
  slug: string;
}

export const BrandProfilePage: React.FC<BrandProfilePageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const [data, setData] = useState<BrandDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab & Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'mentions'>('score');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBrandProfile();
  }, [slug]);

  const fetchBrandProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/brands/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Aradığınız marka sistemimizde bulunamadı.');
        }
        throw new Error('Marka profili yüklenirken bir hata oluştu.');
      }
      const json: BrandDetailResponse = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Error fetching brand profile:', err);
      setError(err.message || 'Marka verisi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    
    return data.products
      .filter(p => {
        if (selectedCategory === 'all') return true;
        return p.categoryId === selectedCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return (b.score?.overallScore || 0) - (a.score?.overallScore || 0);
        }
        if (sortBy === 'price_asc') {
          return (a.priceInfo?.currentPrice || 999999) - (b.priceInfo?.currentPrice || 999999);
        }
        if (sortBy === 'price_desc') {
          return (b.priceInfo?.currentPrice || 0) - (a.priceInfo?.currentPrice || 0);
        }
        if (sortBy === 'mentions') {
          return (b.score?.mentionCount || 0) - (a.score?.mentionCount || 0);
        }
        return 0;
      });
  }, [data, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 rounded-3xl bg-slate-200" />
          <div className="h-80 rounded-3xl bg-slate-200 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            {error || 'Marka Bulunamadı'}
          </h2>
          <p className="text-sm text-slate-600">
            Aradığınız markaya ait profil veya ürün bulunamadı. Tüm markaları incelemek için listemize dönebilirsiniz.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/markalar')}>
              Tüm Markaları Gör
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Ana Sayfa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { brand, stats, aiSummary, topicAverages, competitorBrands } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/markalar" className="hover:text-slate-900 transition-colors">Markalar</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{brand.name}</span>
      </nav>

      {/* Brand Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            {/* Brand Logo / Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg font-['Space_Grotesk'] shrink-0 border-2 border-indigo-200/40">
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Space_Grotesk'] text-white">
                    {brand.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
                    Resmi Tüketici Profili
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {brand.originCountry || 'Küresel'}
                  </span>
                  <span>•</span>
                  <span>{stats.productCount} Model İndekslendi</span>
                </div>
              </div>
            </div>

            {/* Score Highlight Box */}
            <div className="flex items-center sm:flex-col items-end gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0">
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold">
                  Marka Güven Skoru
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white">
                    {stats.averageScore}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold self-end mb-1">/ 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
            {brand.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black font-['Space_Grotesk'] text-emerald-400">
                %{stats.positiveRatioAvg}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Olumlu Konsensüs</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black font-['Space_Grotesk'] text-indigo-300">
                {stats.totalMentions.toLocaleString('tr-TR')}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Toplam Tüketici Bahsi</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black font-['Space_Grotesk'] text-amber-300">
                {stats.warrantyScore} / 10
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Servis & Garanti Karnesi</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-black font-['Space_Grotesk'] text-sky-300">
                %{aiSummary.reliabilityScore}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Donanım Güvenilirlik Endeksi</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: AI Executive Summary & Topic Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Executive Brand Analysis (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            
            {/* Section Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                    AI Marka Konsensüs Analizi
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gerçek kullanıcı deneyimleri & teknik inceleme verileri
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Doğrulanmış Konsensüs</span>
              </span>
            </div>

            {/* General Verdict */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80">
              <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                "{aiSummary.generalVerdict}"
              </p>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>En Güçlü Yönleri</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {aiSummary.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses / Watch-outs */}
              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Dikkat Edilmesi Gerekenler</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {aiSummary.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ecosystem & Highlights */}
            {aiSummary.ecosystemHighlights && aiSummary.ecosystemHighlights.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ekosistem ve Entegrasyon Avantajları:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {aiSummary.ecosystemHighlights.map((eco, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                      <span>{eco}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Service Verdict */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>Türkiye Garanti & Servis Karnesi</span>
                  <span className="px-2 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">
                    {stats.warrantyScore} / 10
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {aiSummary.warrantyAndSupportVerdict}
                </p>
              </div>
            </div>

            {/* Who is it for? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">🎯 Kime Tavsiye Edilir:</span>
                <p className="text-slate-600 leading-relaxed">{aiSummary.bestFor}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">⚠️ Kimler İçin Uygun Değil:</span>
                <p className="text-slate-600 leading-relaxed">{aiSummary.notRecommendedFor}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Topic Matrix & Competitor Brands */}
        <div className="space-y-6">
          
          {/* Topic Performance Bars */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                Marka Konu Performans Karnesi
              </h3>
            </div>

            {topicAverages.length === 0 ? (
              <p className="text-xs text-slate-400">Konu puanı verisi hazırlanıyor...</p>
            ) : (
              <div className="space-y-3.5">
                {topicAverages.map((topic, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{topic.topicName}</span>
                      <div className="flex items-center gap-1 font-black">
                        <span className="text-indigo-600">{topic.score}</span>
                        <span className="text-[10px] text-slate-400">/ 10</span>
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.score * 10}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${
                          topic.score >= 9.0 
                            ? 'bg-emerald-500' 
                            : topic.score >= 8.0 
                            ? 'bg-indigo-500' 
                            : 'bg-amber-500'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{topic.mentionCount.toLocaleString('tr-TR')} Bahis</span>
                      <span className="text-emerald-600 font-semibold">%{topic.positiveRatio} Olumlu</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Competitor Brands Box */}
          {competitorBrands && competitorBrands.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Scale className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                  Benzer ve Rakip Markalar
                </h3>
              </div>

              <div className="space-y-2.5">
                {competitorBrands.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/marka/${comp.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        {comp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {comp.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {comp.productCount || 0} Model İndekslendi
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Brand Product Catalog Section */}
      <div className="space-y-6 pt-4">
        
        {/* Catalog Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
              {brand.name} Ürün Kataloğu
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Konsensüs puanları ve fiyat karşılaştırmalarıyla incelenen {brand.name} modelleri
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="score">NeDiyor Skoru (En Yüksek)</option>
              <option value="price_asc">Fiyat (En Düşük)</option>
              <option value="price_desc">Fiyat (En Yüksek)</option>
              <option value="mentions">En Çok Değerlendirilen</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        {stats.topCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tüm Kategoriler ({data.products.length})
            </button>
            {stats.topCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedCategory === cat.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 space-y-3">
            <p className="text-sm font-bold text-slate-700">Seçilen filtreye uygun ürün bulunamadı.</p>
            <Button variant="outline" size="sm" onClick={() => setSelectedCategory('all')}>
              Tüm Ürünleri Göster
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const score = p.score;
              const verdict = score?.verdict || 'ALINIR';
              
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-48 bg-slate-50 p-6 flex items-center justify-center border-b border-slate-100">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs">
                          {p.categoryName}
                        </span>
                      </div>

                      {/* Verdict Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                          verdict === 'ALINIR' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : verdict === 'DUSUNULEBILIR'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {getVerdictText(verdict)}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Score & Mention Stats */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            {score ? score.overallScore.toFixed(1) : '8.5'}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-900 leading-tight">NeDiyor Puanı</div>
                            <div className="text-[9px] text-emerald-600 font-semibold">%{score?.positiveRatio || 85} Olumlu</div>
                          </div>
                        </div>

                        <div className="text-right text-[10px] text-slate-500">
                          <span className="font-bold text-slate-700">{score?.mentionCount?.toLocaleString('tr-TR') || '1.200'}</span> Yorum
                        </div>
                      </div>

                      {/* Price Info */}
                      {p.priceInfo && (
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-slate-500">En Düşük Fiyat:</span>
                          <span className="font-black text-slate-900 text-sm">
                            {p.priceInfo.formattedPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/urun/${p.slug}`)}
                    >
                      İncelemeyi Oku
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 text-xs"
                      title="Karşılaştırmaya Ekle"
                      onClick={() => navigate(`/karsilastir?p1=${p.slug}`)}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
