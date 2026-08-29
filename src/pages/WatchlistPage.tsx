import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  Scale, 
  Bell, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Share2, 
  Layers, 
  AlertTriangle,
  Flame,
  Star,
  Check,
  Plus
} from 'lucide-react';
import { useRouter, Link } from '../lib/router.js';
import { api } from '../lib/api.js';
import { Product, ProductScore, PriceInfo } from '../types/index.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { Button } from '../components/ui/Button.js';
import { useToast } from '../components/ui/Toast.js';
import { EmptyState } from '../components/ui/EmptyState.js';
import { ProductCardSkeleton } from '../components/ui/Skeleton.js';

export const WatchlistPage: React.FC = () => {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [products, setProducts] = useState<(Product & { score?: ProductScore | null; priceInfo?: PriceInfo })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Load favorite IDs from localStorage
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('nediyor_favorites');
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          setFavoriteIds(ids);
          return ids;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setFavoriteIds([]);
    return [];
  };

  const fetchFavoriteProducts = async (ids: string[]) => {
    setIsLoading(true);
    try {
      if (ids.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      // Fetch all products or search to get full data with scores & prices
      const searchRes = await api.search({});
      const matched = searchRes.products.filter(p => ids.includes(p.id));
      setProducts(matched);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Takip Listem & Fiyat Alarmları | NeDiyor';
    const ids = loadFavorites();
    fetchFavoriteProducts(ids);

    const handleStorageChange = () => {
      const updatedIds = loadFavorites();
      fetchFavoriteProducts(updatedIds);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRemoveFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = favoriteIds.filter(id => id !== productId);
    localStorage.setItem('nediyor_favorites', JSON.stringify(updated));
    setFavoriteIds(updated);
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedForCompare(prev => prev.filter(id => id !== productId));
    window.dispatchEvent(new Event('storage'));
    showToast('Ürün takip listesinden kaldırıldı.', 'info');
  };

  const handleClearAll = () => {
    if (confirm('Tüm takip listenizi temizlemek istediğinize emin misiniz?')) {
      localStorage.setItem('nediyor_favorites', JSON.stringify([]));
      setFavoriteIds([]);
      setProducts([]);
      setSelectedForCompare([]);
      window.dispatchEvent(new Event('storage'));
      showToast('Takip listesi temizlendi.', 'info');
    }
  };

  const handleToggleCompare = (productId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast('En fazla 4 ürünü aynı anda karşılaştırabilirsiniz.', 'warning');
          return prev;
        }
        return [...prev, productId];
      }
    });
  };

  const handleCompareSelected = () => {
    if (selectedForCompare.length < 2) {
      showToast('Lütfen karşılaştırmak için en az 2 ürün seçin.', 'info');
      return;
    }
    const selectedItems = products.filter(p => selectedForCompare.includes(p.id));
    const params = new URLSearchParams();
    selectedItems.forEach((p, idx) => {
      params.set(`p${idx + 1}`, p.slug);
    });
    navigate(`/karsilastir?${params.toString()}`);
  };

  const handleShareList = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NeDiyor Takip Listem',
        text: `NeDiyor üzerinde takip ettiğim ${products.length} ürün ve konsensüs skorları.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Liste bağlantısı panoya kopyalandı.', 'success');
    }
  };

  // Categories present in favorites
  const categories = Array.from(new Set(products.map(p => p.categoryName || 'Diğer')));

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.categoryName === activeCategory);

  // Price drop count
  const dealsCount = products.filter(p => p.priceInfo && p.priceInfo.originalPrice && p.priceInfo.originalPrice > p.priceInfo.currentPrice).length;

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Kişisel Takip Paneli & Fiyat Radarı</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
              Takip Ettiğim Ürünler
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Favoriye aldığınız ürünlerin yapay zeka konsensüs skorları, fiyat hareketleri, indirim fırsatları ve kronik arıza uyarıları tek ekranda güncel tutulur.
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareList}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Paylaş
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                className="text-xs font-bold text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                Tümünü Sil
              </Button>

              {selectedForCompare.length >= 2 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCompareSelected}
                  leftIcon={<Scale className="w-3.5 h-3.5" />}
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  Seçilenleri Karşılaştır ({selectedForCompare.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats Row if has items */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Kayıtlı Ürün</span>
                <span className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                  {products.length} Adet
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">İndirimde Olan</span>
                <span className="text-lg font-black text-emerald-600 font-['Space_Grotesk']">
                  {dealsCount} Fırsat
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Ort. Konsensüs</span>
                <span className="text-lg font-black text-indigo-700 font-['Space_Grotesk']">
                  {(products.reduce((acc, p) => acc + (p.score?.overallScore || 0), 0) / (products.length || 1)).toFixed(1)} / 10
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Fiyat Alarmları</span>
                <span className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                  Aktif (Canlı)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Category Pill Filters */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tümü ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat} ({products.filter(p => p.categoryName === cat).length})
              </button>
            ))}
          </div>
        )}

        {/* Products Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    product={product}
                    isSelectedForCompare={selectedForCompare.includes(product.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                  {/* Additional quick remove on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveFavorite(product.id, e)}
                    className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md text-xs font-bold"
                    title="Takip Listesinden Kaldır"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Compare CTA Footer if items selected */}
            {selectedForCompare.length > 0 && (
              <div className="bg-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Scale className="w-4 h-4 text-indigo-300" />
                  <span>{selectedForCompare.length} ürün karşılaştırma için seçildi.</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCompareSelected}
                  disabled={selectedForCompare.length < 2}
                  className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs"
                >
                  {selectedForCompare.length >= 2 ? 'Kıyaslamayı Başlat' : 'En az 2 ürün seçin'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                Takip Listeniz Henüz Boş
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Kararsız kaldığınız veya fiyatının düşmesini beklediğiniz ürünlerin üzerindeki <strong>kalp butonuna</strong> tıklayarak listenize ekleyebilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/ara')}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Popüler Ürünleri Keşfet
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/firsat-radari')}
                leftIcon={<Flame className="w-4 h-4 text-rose-600" />}
                className="text-xs font-bold"
              >
                Günün Fırsatlarına Göz At
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
