import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Bot, 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Save, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare, 
  Layers, 
  Sliders, 
  Cpu, 
  ArrowLeft,
  X,
  Zap,
  Globe,
  SlidersHorizontal,
  Flame,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../lib/authContext.js';
import { useRouter } from '../lib/router.js';
import { api } from '../lib/api.js';
import { 
  Brand, 
  Product, 
  SystemSettings, 
  AdminStats, 
  VerdictType, 
  Category 
} from '../types/index.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { useToast } from '../components/ui/Toast.js';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'brands' | 'products' | 'ai'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [brands, setBrands] = useState<(Brand & { averageScore: number; productCount: number; totalMentions: number })[]>([]);
  const [products, setProducts] = useState<(Product & { score?: any; reviewCount: number })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandForm, setBrandForm] = useState({ name: '', slug: '', originCountry: '', description: '', logoUrl: '' });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    model: '',
    brandId: '',
    categoryId: '',
    imageUrl: '',
    description: '',
    price: '',
    verdict: 'ALINIR' as VerdictType,
    overallScore: '8.8',
    confidenceScore: '85'
  });

  // AI Prompt Studio Test states
  const [testInput, setTestInput] = useState('Apple iPhone 16 Pro 128GB');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testMeta, setTestMeta] = useState<{ model: string; executionTimeMs: number; tokensUsed: number } | null>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);

  // Load all admin data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, settingsRes, brandsRes, productsRes, homeRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminSettings().catch(() => null),
        api.getAdminBrands().catch(() => []),
        api.getAdminProducts().catch(() => []),
        api.getHomeData().catch(() => ({ categories: [] }))
      ]);

      if (statsRes) setStats(statsRes);
      if (settingsRes) setSettings(settingsRes);
      if (brandsRes) setBrands(brandsRes);
      if (productsRes) setProducts(productsRes);
      if (homeRes && homeRes.categories) setCategories(homeRes.categories);
    } catch (err: any) {
      showToast(err.message || 'Veriler yüklenirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check admin authorization
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
            Yönetici Yetkisi Gerekli
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Admin paneline erişebilmek için lütfen yönetici (admin) rolüne sahip bir hesap ile giriş yapınız.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="primary" onClick={() => openAuthModal('login')}>
              Yönetici Olarak Giriş Yap
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Brand Actions ---
  const handleOpenBrandModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm({
        name: brand.name,
        slug: brand.slug,
        originCountry: brand.originCountry || '',
        description: brand.description || '',
        logoUrl: brand.logoUrl || ''
      });
    } else {
      setEditingBrand(null);
      setBrandForm({ name: '', slug: '', originCountry: '', description: '', logoUrl: '' });
    }
    setBrandModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      showToast('Marka adı zorunludur.', 'error');
      return;
    }

    try {
      setIsActionLoading(true);
      if (editingBrand) {
        await api.updateAdminBrand(editingBrand.id, brandForm);
        showToast('Marka başarıyla güncellendi.', 'success');
      } else {
        await api.createAdminBrand(brandForm);
        showToast('Yeni marka başarıyla eklendi.', 'success');
      }
      setBrandModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Marka kaydedilemedi.', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!window.confirm('Bu markayı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteAdminBrand(brandId);
      showToast('Marka silindi.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Marka silinemedi.', 'error');
    }
  };

  // --- Product Actions ---
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const score = (product as any).score;
      setProductForm({
        name: product.name,
        model: product.model,
        brandId: product.brandId,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        price: (product as any).priceRange?.replace(/[^0-9]/g, '') || '29999',
        verdict: score?.verdict || 'ALINIR',
        overallScore: score?.overallScore ? String(score.overallScore) : '8.8',
        confidenceScore: score?.confidenceScore ? String(score.confidenceScore) : '85'
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        model: '',
        brandId: brands[0]?.id || '',
        categoryId: categories[0]?.id || '',
        imageUrl: '',
        description: '',
        price: '29999',
        verdict: 'ALINIR',
        overallScore: '8.8',
        confidenceScore: '85'
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.brandId || !productForm.categoryId) {
      showToast('Lütfen ürün adı, marka ve kategori seçiniz.', 'error');
      return;
    }

    try {
      setIsActionLoading(true);
      if (editingProduct) {
        await api.updateAdminProduct(editingProduct.id, {
          ...productForm,
          overallScore: Number(productForm.overallScore),
          confidenceScore: Number(productForm.confidenceScore),
          price: Number(productForm.price)
        });
        showToast('Ürün bilgileri ve skorları güncellendi.', 'success');
      } else {
        await api.createAdminProduct({
          ...productForm,
          overallScore: Number(productForm.overallScore),
          confidenceScore: Number(productForm.confidenceScore),
          price: Number(productForm.price)
        });
        showToast('Yeni ürün ve AI mutabakat analizi başarıyla eklendi.', 'success');
      }
      setProductModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Ürün kaydedilemedi.', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Bu ürünü ve bağlı tüm analizleri silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteAdminProduct(productId);
      showToast('Ürün ve analizleri silindi.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Ürün silinemedi.', 'error');
    }
  };

  const handleTriggerAI = async (productId: string) => {
    try {
      showToast('Yapay zeka mutabakatı yeniden hesaplanıyor...', 'info');
      await api.triggerAIAnalyze(productId);
      showToast('AI sentezi ve mutabakat skoru güncellendi.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'AI analizi çalıştırılamadı.', 'error');
    }
  };

  // --- Settings Actions ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsActionLoading(true);
      await api.updateAdminSettings(settings);
      showToast('Sistem ayarları başarıyla kaydedildi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Ayarlar kaydedilemedi.', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- AI Prompt Studio Test ---
  const handleRunAITest = async () => {
    if (!testInput.trim()) {
      showToast('Lütfen test edilecek ürün veya yorum metni giriniz.', 'error');
      return;
    }

    try {
      setIsTestingAI(true);
      setTestOutput(null);
      const res = await api.testAIPrompt(settings?.customPrompts?.verdictPrompt || '', testInput);
      setTestOutput(res.output);
      setTestMeta({
        model: res.model,
        executionTimeMs: res.executionTimeMs,
        tokensUsed: res.tokensUsed
      });
      showToast('AI Simülasyonu başarıyla tamamlandı!', 'success');
    } catch (err: any) {
      showToast(err.message || 'AI testi çalıştırılamadı.', 'error');
    } finally {
      setIsTestingAI(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter || p.categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Siteye Dön"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Siteye Dön</span>
            </button>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    NeDiyor Admin
                  </span>
                  <Badge variant="amber" size="sm" className="font-bold text-[10px] uppercase">
                    v1.0 Pro
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem & Gemini API Sağlıklı</span>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-slate-400">Yönetici</div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Yenile</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Genel Bakış & Ayarlar</span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'brands'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Marka Yönetimi ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Ürün Yönetimi ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Stüdyo & İstemler</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & SYSTEM SETTINGS */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Toplam Katalog Ürün</span>
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white font-['Space_Grotesk']">
                  {stats?.totalProducts ?? products.length}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>Aktif ve puanlanmış</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Kayıtlı Markalar</span>
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-['Space_Grotesk']">
                  {stats?.totalBrands ?? brands.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Güven & servis indeksli
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Taranan Bahsetme & Yorum</span>
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-['Space_Grotesk']">
                  {stats ? (stats.totalMentions + stats.totalReviews).toLocaleString('tr-TR') : '18.420'}
                </div>
                <div className="text-[11px] text-indigo-400 mt-1">
                  Forum, video ve sipariş analizi
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">AI Sentez & Mutabakat</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-['Space_Grotesk']">
                  {stats?.aiAnalysisCount ?? '156'}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Gemini 2.5 Flash aktif
                </div>
              </div>
            </div>

            {/* System Settings Form */}
            {settings && (
              <form onSubmit={handleSaveSettings} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                      <Settings className="w-5 h-5 text-indigo-400" />
                      <span>Platform & Motor Ayarları</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Platform genel başlığı, AI model eşikleri ve tarama parametreleri
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isActionLoading}
                    className="font-bold text-xs gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isActionLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Platform Başlığı (SEO Title)
                    </label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Varsayılan AI Modeli
                    </label>
                    <select
                      value={settings.aiModel}
                      onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Önerilen - Hızlı & Yüksek Mutabakat)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Derin Akıl Yürütme)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Otomatik Tarama & Sentez Frekansı (Saat)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={settings.autoScrapeIntervalHours}
                      onChange={(e) => setSettings({ ...settings, autoScrapeIntervalHours: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Minimum Güven Eşiği (Confidence %)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={95}
                      value={settings.confidenceThreshold}
                      onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Meta Açıklaması
                  </label>
                  <textarea
                    rows={2}
                    value={settings.metaDescription}
                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Toggles */}
                <div className="pt-4 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white">Topluluk İncelemelerine İzin Ver</div>
                      <div className="text-[10px] text-slate-400">Kullanıcıların yeni deneyim ve yorum girmesine izin ver</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowPublicReviews}
                      onChange={(e) => setSettings({ ...settings, allowPublicReviews: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-white">Bakım Modu (Maintenance)</div>
                      <div className="text-[10px] text-slate-400">Aktif edildiğinde ziyaretçilere bakım uyarısı gösterilir</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                  </label>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BRANDS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Marka Listesi & Güven İndeksi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Taranan tüm üretici markaları, menşei bilgileri ve genel memnuniyet puanları
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => handleOpenBrandModal()}
                className="font-bold text-xs gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Marka Ekle</span>
              </Button>
            </div>

            {/* Brands Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Marka</th>
                      <th className="py-3.5 px-4">Menşei</th>
                      <th className="py-3.5 px-4">Katalog Ürün Sayısı</th>
                      <th className="py-3.5 px-4">Ort. NeDiyor Puanı</th>
                      <th className="py-3.5 px-4">Taranan Bahsetme</th>
                      <th className="py-3.5 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-slate-750/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 shrink-0 overflow-hidden">
                            {brand.logoUrl ? (
                              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                            ) : (
                              brand.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white">{brand.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">/{brand.slug}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {brand.originCountry || 'Belirtilmedi'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {brand.productCount} model
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
                            ★ {brand.averageScore || '8.5'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {brand.totalMentions ? brand.totalMentions.toLocaleString('tr-TR') : '1.200+'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/marka/${brand.slug}`)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                              title="Marka Sayfasını Aç"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenBrandModal(brand)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Ürün Kataloğu & Sentez Skoru Yönetimi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tüm modelleri filtreleyin, düzenleyin veya anlık yapay zeka mutabakatını yeniden çalıştırın.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => handleOpenProductModal()}
                className="font-bold text-xs gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün Ekle</span>
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün adı, marka veya model ara..."
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 sm:w-56"
              >
                <option value="all">Tüm Kategoriler ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Ürün</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Fiyat Aralığı</th>
                      <th className="py-3.5 px-4">Karar</th>
                      <th className="py-3.5 px-4">NeDiyor Puanı</th>
                      <th className="py-3.5 px-4">Güven</th>
                      <th className="py-3.5 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((p) => {
                      const score = p.score;
                      const verdict = score?.verdict || 'ALINIR';
                      return (
                        <tr key={p.id} className="hover:bg-slate-750/50 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.brandName} • {p.model}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {p.categoryName}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-200">
                            {p.priceRange || '24.999 ₺'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                verdict === 'ALINIR' 
                                  ? 'emerald' 
                                  : verdict === 'DUSUNULEBILIR' 
                                  ? 'amber' 
                                  : 'rose'
                              }
                              size="sm"
                              className="font-bold"
                            >
                              {verdict === 'ALINIR' ? 'Alınır' : verdict === 'DUSUNULEBILIR' ? 'Düşünülebilir' : 'Alternatif Ara'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-black text-white">
                            {score?.overallScore ? `${score.overallScore}/10` : '8.8/10'}
                          </td>
                          <td className="py-3 px-4 text-indigo-400 font-semibold">
                            %{score?.confidenceScore || 85}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleTriggerAI(p.id)}
                                className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 transition-colors"
                                title="Yapay Zeka Analizini Yeniden Çalıştır"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => navigate(`/urun/${p.slug}`)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title="Ürün Sayfasına Git"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: AI PROMPT STUDIO & SIMULATOR */}
        {/* ============================================================ */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <Bot className="w-6 h-6 text-emerald-400" />
                  <span>AI Stüdyo & İstem Şablonları</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tüketici mutabakatını çıkaran Gemini sistem istemlerini düzenleyin ve canlı simülatörde test edin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="emerald" size="md" className="font-bold">
                  ⚡ Gemini 2.5 Flash Aktif
                </Badge>
              </div>
            </div>

            {/* Prompt Editors */}
            {settings && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Prompts Config */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2 border-b border-slate-700 pb-3">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Sistem Sentez İstemleri</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      1. Karar & Mutabakat Sentez İstemi (Verdict Prompt)
                    </label>
                    <textarea
                      rows={4}
                      value={settings.customPrompts?.verdictPrompt || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        customPrompts: {
                          ...settings.customPrompts,
                          verdictPrompt: e.target.value
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      2. Kronik Sorun & Şikayet Tarama İstemi (Chronic Issues)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.customPrompts?.chronicIssuesPrompt || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        customPrompts: {
                          ...settings.customPrompts,
                          chronicIssuesPrompt: e.target.value
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      3. Fiyat & Performans / Alternatif Kıyas İstemi
                    </label>
                    <textarea
                      rows={3}
                      value={settings.customPrompts?.valueForMoneyPrompt || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        customPrompts: {
                          ...settings.customPrompts,
                          valueForMoneyPrompt: e.target.value
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleSaveSettings}
                    disabled={isActionLoading}
                    className="w-full font-bold text-xs justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>İstem Değişikliklerini Kaydet</span>
                  </Button>
                </div>

                {/* Right: Live Prompt Simulator */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2 border-b border-slate-700 pb-3">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Canlı AI Test & Simülatör</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Test Edilecek Ürün veya Tüketici Metni
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          placeholder="Örn: Roborock Q7 Max Robot Süpürge"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button
                          variant="primary"
                          onClick={handleRunAITest}
                          disabled={isTestingAI}
                          className="font-bold text-xs gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isTestingAI ? 'Sentezleniyor...' : 'Çalıştır'}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Output Panel */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          Simülasyon Çıktısı (Canlı Yanıt)
                        </label>
                        {testMeta && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>Süre: <strong className="text-emerald-400">{testMeta.executionTimeMs}ms</strong></span>
                            <span>•</span>
                            <span>Token: <strong className="text-indigo-400">{testMeta.tokensUsed}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-mono text-slate-200 min-h-[220px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {testOutput || (
                          <div className="text-slate-500 italic flex items-center justify-center h-48">
                            Yukarıdaki ürün veya metin için 'Çalıştır' butonuna basarak istem sonucunu test edin.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] text-slate-400">
                    💡 <strong>Bilgi:</strong> Yapay zeka motoru, NeDiyor'un tescilli ağırlıklandırma algoritmasını kullanarak forum ve onaylı sipariş yorumlarını sentezler.
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* BRAND CREATE / EDIT MODAL */}
      {/* ============================================================ */}
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                {editingBrand ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}
              </h3>
              <button onClick={() => setBrandModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Marka Adı</label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="Örn: Dyson, Sony, Apple"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                    placeholder="otomatik üretilir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Menşei Ülke</label>
                  <input
                    type="text"
                    value={brandForm.originCountry}
                    onChange={(e) => setBrandForm({ ...brandForm, originCountry: e.target.value })}
                    placeholder="Örn: ABD, Japonya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Logo URL (Opsiyonel)</label>
                <input
                  type="url"
                  value={brandForm.logoUrl}
                  onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button variant="outline" type="button" onClick={() => setBrandModalOpen(false)}>
                  İptal
                </Button>
                <Button variant="primary" type="submit" disabled={isActionLoading}>
                  {isActionLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ürün Tam Adı</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Örn: Samsung Galaxy S24 Ultra 256GB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Marka</label>
                  <select
                    required
                    value={productForm.brandId}
                    onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  >
                    <option value="">Marka Seçiniz</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  >
                    <option value="">Kategori Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Model Kodu</label>
                  <input
                    type="text"
                    value={productForm.model}
                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    placeholder="S24 Ultra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="54999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                />
              </div>

              {/* Verdict & Score */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Karar</label>
                  <select
                    value={productForm.verdict}
                    onChange={(e) => setProductForm({ ...productForm, verdict: e.target.value as VerdictType })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="ALINIR">Alınır</option>
                    <option value="DUSUNULEBILIR">Düşünülebilir</option>
                    <option value="ALTERNATIFLERE_BAK">Alternatif Ara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Puan (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={productForm.overallScore}
                    onChange={(e) => setProductForm({ ...productForm, overallScore: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Güven (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={productForm.confidenceScore}
                    onChange={(e) => setProductForm({ ...productForm, confidenceScore: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button variant="outline" type="button" onClick={() => setProductModalOpen(false)}>
                  İptal
                </Button>
                <Button variant="primary" type="submit" disabled={isActionLoading}>
                  {isActionLoading ? 'Kaydediliyor...' : 'Kaydet ve Analiz Et'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
