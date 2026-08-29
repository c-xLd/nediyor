import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Scale, 
  Menu, 
  X, 
  Flame, 
  ArrowLeftRight, 
  Heart, 
  Layers, 
  ChevronDown,
  Award,
  Smartphone,
  Laptop,
  Headphones,
  Home,
  Watch,
  Tv,
  Bot,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Building2,
  Database,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  LogOut,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useRouter } from '../../lib/router.js';
import { useAuth } from '../../lib/authContext.js';
import { CommandSearchModal } from './CommandSearchModal.js';
import { MobileBottomNav } from './MobileBottomNav.js';

export const Navbar: React.FC = () => {
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Dropdown states
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();

  // Global ⌘K / Ctrl+K & '/' shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is already typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update favorite count from localStorage
  useEffect(() => {
    const updateFavs = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('nediyor_favorites') || '[]');
        setFavoriteCount(favs.length);
      } catch {
        setFavoriteCount(0);
      }
    };
    updateFavs();
    window.addEventListener('storage', updateFavs);
    return () => window.removeEventListener('storage', updateFavs);
  }, [path]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { name: 'Akıllı Telefonlar', slug: 'akilli-telefonlar', icon: <Smartphone className="w-4 h-4 text-indigo-600" />, desc: 'iPhone 16, Galaxy S24, Xiaomi' },
    { name: 'Dizüstü Bilgisayarlar', slug: 'dizustu-bilgisayarlar', icon: <Laptop className="w-4 h-4 text-blue-600" />, desc: 'MacBook Air M3, Gaming, Ultrabook' },
    { name: 'Kulaklık & Ses', slug: 'kulaklik-ve-ses', icon: <Headphones className="w-4 h-4 text-emerald-600" />, desc: 'ANC Kulaklıklar, TWS, Hoparlör' },
    { name: 'Robot Süpürgeler', slug: 'robot-supurgeler', icon: <Home className="w-4 h-4 text-amber-600" />, desc: 'Roborock, Dreame, Mop Özellikli' },
    { name: 'Akıllı Saatler', slug: 'akilli-saatler', icon: <Watch className="w-4 h-4 text-rose-600" />, desc: 'Apple Watch, Galaxy Watch, Garmin' },
    { name: 'Ev & Mutfak', slug: 'ev-ve-mutfak', icon: <Tv className="w-4 h-4 text-purple-600" />, desc: 'Dyson Dikey Süpürge, Airfryer' },
  ];

  const tools = [
    {
      title: 'Akıllı Ürün Bulucu',
      badge: 'AI Danışman',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Bütçenize ve ihtiyaçlarınıza göre en doğru ürünü eşleştirin.',
      href: '/urun-bulucu',
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />
    },
    {
      title: 'Fırsat & Dip Fiyat Radarı',
      badge: 'Canlı Takip',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Fiyat geçmişine göre gerçek dip fiyata inen modelleri listeleyin.',
      href: '/firsat-radari',
      icon: <Flame className="w-4 h-4 text-rose-600" />
    },
    {
      title: 'Yükseltme Danışmanı',
      badge: 'Değer mi?',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'Eski cihazınızdan yeni modele geçmeye değer mi analiz edin.',
      href: '/yukseltme-danismani',
      icon: <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
    },
    {
      title: 'Çoklu Model Karşılaştırma',
      badge: 'Kıyas',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      desc: 'Modelleri kamera, batarya, kronik sorun ve F/P bazında yan yana kıyaslayın.',
      href: '/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra',
      icon: <Scale className="w-4 h-4 text-violet-600" />
    },
    {
      title: 'En İyiler (Liderlik Tablosu)',
      badge: 'Top 10',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Kategori bazında kullanıcı puanı en yüksek ürünler.',
      href: '/siralamalar',
      icon: <Award className="w-4 h-4 text-amber-600" />
    },
    {
      title: 'Veri Kaynakları & Şeffaflık',
      badge: 'Nasıl Çalışır?',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'Forumlar, onaylı siparişler ve YouTube tartışmalarının nasıl tarandığını inceleyin.',
      href: '/veri-kaynaklari',
      icon: <Database className="w-4 h-4 text-indigo-600" />
    }
  ];

  return (
    <>
      <CommandSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk'] leading-none">
                Ne<span className="text-indigo-600">Diyor</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Tüketici Zekası
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            
            {/* 1. Kategoriler Dropdown */}
            <div 
              className="relative" 
              ref={categoriesRef}
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  categoriesOpen || path === '/ara'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Kategoriler</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Teknoloji Kategorileri</span>
                      <Link 
                        href="/ara" 
                        onClick={() => setCategoriesOpen(false)}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Tümü</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="space-y-1">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/ara?category=${c.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {c.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {c.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Karar Araçları Dropdown */}
            <div 
              className="relative" 
              ref={toolsRef}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  toolsOpen || path.startsWith('/urun-bulucu') || path.startsWith('/yukseltme') || path.startsWith('/firsat')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-4 h-4 text-slate-500" />
                <span>Karar Araçları</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-[400px] bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Yapay Zeka Destekli Modüller</span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Tarafsız</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      {tools.map((t, idx) => (
                        <Link
                          key={idx}
                          href={t.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            {t.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {t.title}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold border ${t.badgeColor}`}>
                                {t.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {t.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Links */}
            <Link
              href="/markalar"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                path.startsWith('/marka')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Markalar</span>
            </Link>

            <Link
              href="/firsat-radari"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                path.startsWith('/firsat-radari')
                  ? 'bg-rose-50 text-rose-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Fırsat Radarı</span>
            </Link>

            <Link
              href="/siralamalar"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                path.startsWith('/siralamalar')
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>En İyiler</span>
            </Link>

            <Link
              href="/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                path.startsWith('/karsilastir')
                  ? 'bg-violet-50 text-violet-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-violet-500" />
              <span>Karşılaştır</span>
            </Link>
          </nav>

          {/* Right Area: Search, Favorite & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Icon Button Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group relative shrink-0"
              title="Arama Yap (⌘K veya /)"
              aria-label="Arama Yap"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110 text-slate-600 group-hover:text-indigo-600" />
            </button>

            {/* Favorite / Watchlist Indicator */}
            <Link
              href="/takip-listem"
              title={favoriteCount > 0 ? `${favoriteCount} takip edilen ürün` : 'Takip Listem'}
              className={`p-2 rounded-xl transition-colors relative shrink-0 ${
                favoriteCount > 0 
                  ? 'text-rose-600 hover:bg-rose-50 border border-rose-100/60' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Button Dropdown (Desktop) */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-white transition-all cursor-pointer shadow-2xs"
                  >
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-6 h-6 rounded-lg object-cover border border-slate-200 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                      }}
                    />
                    <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    {isAdmin && (
                      <span className="p-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                        Admin
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1"
                      >
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                              {isAdmin ? 'Yönetici (Admin)' : 'Standart Üye'}
                            </span>
                          </div>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 transition-colors border border-amber-200/60"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Admin Paneli</span>
                          </Link>
                        )}

                        <Link
                          href="/ayarlar"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Profil & Ayarlar</span>
                        </Link>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Çıkış Yap</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden transition-colors shrink-0"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 overflow-hidden shadow-lg"
            >
              {/* Mobile User Profile Section */}
              {user ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{isAdmin ? '👑 Platform Yöneticisi' : '👤 Üye'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl bg-amber-500 text-white"
                        title="Admin Paneli"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href="/ayarlar"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-200 text-slate-700"
                      title="Ayarlar"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="p-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-xs"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
              {/* Quick Search Trigger in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Katalogda hızlı ara veya sor...</span>
                </div>
                <kbd className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </button>
              {/* Direct Mobile Links */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  href="/markalar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs font-bold text-indigo-900"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Markalar</span>
                </Link>
                <Link
                  href="/siralamalar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs font-bold text-amber-900"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>En İyiler</span>
                </Link>
                <Link
                  href="/firsat-radari"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs font-bold text-rose-900"
                >
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Fırsat Radarı</span>
                </Link>
                <Link
                  href="/takip-listem"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-xs font-bold text-pink-900"
                >
                  <Heart className="w-4 h-4 text-pink-600 fill-pink-500/20" />
                  <span>Takip Listem {favoriteCount > 0 ? `(${favoriteCount})` : ''}</span>
                </Link>
              </div>

              {/* Karar Araçları Mobile List */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                  Karar Araçları
                </div>
                {tools.map((t, idx) => (
                  <Link
                    key={idx}
                    href={t.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {t.icon}
                      <span>{t.title}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold border ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Kategoriler Mobile Grid */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2">
                  Kategoriler
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/ara?category=${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      {c.icon}
                      <span className="truncate">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile App Bottom Floating Navigation Bar */}
      <MobileBottomNav 
        onOpenSearch={() => setIsSearchOpen(true)} 
        favoriteCount={favoriteCount} 
      />
    </>
  );
};
