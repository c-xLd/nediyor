import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Globe, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  Filter,
  Flame,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useRouter } from '../lib/router.js';
import { Brand } from '../types/index.js';
import { Button } from '../components/ui/Button.js';

interface EnrichedBrand extends Brand {
  averageScore?: number;
  totalMentions?: number;
  bestProductSlug?: string;
  bestProductName?: string;
}

export const BrandsDirectoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const [brands, setBrands] = useState<EnrichedBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'products' | 'name'>('score');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/brands');
      if (!res.ok) throw new Error('Markalar yüklenemedi.');
      const data = await res.json();
      setBrands(data);
    } catch (err: any) {
      console.error('Error fetching brands:', err);
      setError(err.message || 'Markalar yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Distinct countries for filter
  const countries = useMemo(() => {
    const set = new Set<string>();
    brands.forEach(b => {
      if (b.originCountry) {
        // Clean simple country name (e.g. "ABD (Cupertino...)" -> "ABD")
        const simple = b.originCountry.split('(')[0].trim();
        set.add(simple);
      }
    });
    return Array.from(set);
  }, [brands]);

  // Filtered & Sorted Brands
  const filteredBrands = useMemo(() => {
    return brands
      .filter(b => {
        const matchesSearch = 
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (b.originCountry && b.originCountry.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCountry = 
          selectedCountry === 'all' || 
          (b.originCountry && b.originCountry.includes(selectedCountry));

        return matchesSearch && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return (b.averageScore || 0) - (a.averageScore || 0);
        }
        if (sortBy === 'products') {
          return (b.productCount || 0) - (a.productCount || 0);
        }
        return a.name.localeCompare(b.name, 'tr');
      });
  }, [brands, searchQuery, selectedCountry, sortBy]);

  // Top trusted brand spotlight
  const topBrands = useMemo(() => {
    return [...brands]
      .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
      .slice(0, 4);
  }, [brands]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Marka Tüketici İntelijansı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] tracking-tight text-white leading-tight">
            Teknoloji Markaları & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              Topluluk Güven Profilleri
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Apple'dan Samsung'a, Dyson'dan Roborock'a binlerce gerçek kullanıcı yorumu ve bağımsız test verileriyle oluşturulmuş marka karne ve konsensüs analizlerini inceleyin.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-black font-['Space_Grotesk'] text-white">
                {brands.length || '20+'}
              </div>
              <div className="text-xs text-slate-400 font-medium">İndekslenen Marka</div>
            </div>
            <div>
              <div className="text-2xl font-black font-['Space_Grotesk'] text-indigo-300">
                %89
              </div>
              <div className="text-xs text-slate-400 font-medium">Ortalama Güven Skoru</div>
            </div>
            <div>
              <div className="text-2xl font-black font-['Space_Grotesk'] text-emerald-400">
                120.000+
              </div>
              <div className="text-xs text-slate-400 font-medium">Tüketici Bahsi</div>
            </div>
            <div>
              <div className="text-2xl font-black font-['Space_Grotesk'] text-amber-400">
                7 Kategori
              </div>
              <div className="text-xs text-slate-400 font-medium">Donanım Ekosistemi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Trusted Brands Spotlight */}
      {!loading && topBrands.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                En Yüksek Konsensüs Skoruna Sahip Markalar
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Kullanıcı Memnuniyeti Sıralaması
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topBrands.map((b, idx) => (
              <motion.div
                key={b.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/marka/${b.slug}`)}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-2xs">
                      {b.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{b.averageScore || '9.0'}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {b.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {b.productCount || 0} Model İncelendi
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Profili İncele</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Marka adı veya uzmanlık alanı ara (örn. Apple, Dyson, Robot Süpürge)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Controls: Country Filter & Sort */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">Tüm Ülkeler</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="score">En Yüksek Puan</option>
                <option value="products">En Çok Ürün</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Country Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0 mr-1">Hızlı Filtre:</span>
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
              selectedCountry === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tümü ({brands.length})
          </button>
          {countries.map(c => {
            const count = brands.filter(b => b.originCountry && b.originCountry.includes(c)).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                  selectedCountry === c
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-56 rounded-3xl bg-white border border-slate-200 animate-pulse p-6 space-y-4" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-800">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchBrands}>Yeniden Dene</Button>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aradığınız kriterlere uygun marka bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Arama terimini veya ülke filtresini değiştirerek tekrar deneyebilirsiniz.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCountry('all'); }}>
            Filtreleri Temizle
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{filteredBrands.length} Marka Listeleniyor</span>
            <span>Tüm profiller bağımsız tüketici konsensüsünü yansıtır</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                onClick={() => navigate(`/marka/${b.slug}`)}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Brand Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-xs shrink-0">
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {b.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {b.originCountry || 'Küresel'}
                        </span>
                      </div>
                    </div>

                    {/* Brand Score */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-black text-sm">
                        <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                        <span>{b.averageScore || '8.8'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Güven Skoru
                      </div>
                    </div>
                  </div>

                  {/* Tagline / Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {b.description || `${b.name} teknoloji ürünleri ve kullanıcı değerlendirmeleri.`}
                  </p>

                  {/* Best Product Highlight (if available) */}
                  {b.bestProductName && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 truncate mr-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-500 shrink-0">En Popüler:</span>
                        <span className="font-bold text-slate-900 truncate">{b.bestProductName}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500">
                    <span className="text-slate-900 font-bold">{b.productCount || 0}</span> Ürün İncelendi
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Profili Görüntüle</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Intelligence Methodology Section */}
      <div className="p-8 rounded-3xl bg-slate-100/80 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold font-['Space_Grotesk']">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base">NeDiyor Marka Güven Skoru Nasıl Hesaplanır?</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          NeDiyor, hiçbir markadan sponsorlu reklam kabul etmez. Marka Güven Skoru; o markanın kataloğumuzdaki tüm ürünlerinin gerçek kullanıcı konsensüsü, servis/garanti çözümleri, kronik arıza kayıtları ve uzun vadeli dayanıklılık metriklerinin tarafsız ağırlıklı ortalamasıyla otomatik oluşturulur.
        </p>
      </div>

    </div>
  );
};
