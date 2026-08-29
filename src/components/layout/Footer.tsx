import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowRight,
  Heart,
  Scale, 
  Flame, 
  ArrowLeftRight, 
  HeartHandshake, 
  FileCheck, 
  Mail, 
  ArrowUp, 
  Bell, 
  Activity, 
  Award, 
  Check, 
  ExternalLink,
  Laptop,
  Smartphone,
  Headphones,
  Home
} from 'lucide-react';
import { Link } from '../../lib/router.js';
import { Button } from '../ui/Button.js';
import { useToast } from '../ui/Toast.js';

export const Footer: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      showToast('Harika! Haftalık teknoloji bülteni ve dip fiyat radarına kaydınız yapıldı.');
      setEmail('');
      setIsSubscribed(false);
    }, 800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600 mt-20 relative overflow-hidden pb-24 md:pb-12">
      
      {/* Top Value Banner (4 Pillars) */}
      <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-slate-50/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk']">
                  %100 Bağımsız & Tarafsız
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Sponsorlu veya reklam içerikli yorumlar algoritmayla temizlenir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk']">
                  50.000+ Doğrulanmış Yorum
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Forum, YouTube ve e-ticaret onaylı siparişleri anlık taranır.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk']">
                  6 Boyutlu AI Konsensüsü
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Kamera, batarya, donanım, F/P ve kronik arızalar puanlanır.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Space_Grotesk']">
                  Canlı Dip Fiyat Radarı
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Fiyat geçmişi verisiyle sahte indirimleri tespit eder.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Newsletter & Tech Radar Subscription Strip */}
      <div className="border-b border-slate-200/80 bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                  Dip Fiyat & İnceleme Bülteni
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Haftalık 1 Kez
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                Fiyatı Düşen Modelleri ve Yeni Konsensüs Raporlarını Kaçırmayın
              </h3>
              <p className="text-xs text-slate-300">
                Spam yok. Yalnızca yapay zeka tarafından onaylanan gerçek fırsatlar ve tarafsız satın alma rehberleri.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresinizi girin..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubscribed}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 shrink-0 shadow-md shadow-indigo-500/30"
                  leftIcon={isSubscribed ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                >
                  {isSubscribed ? 'Kaydedildi' : 'Ücretsiz Abone Ol'}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group select-none">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] leading-none">
                  Ne<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Diyor</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Yapay Zeka Tüketici Zekası
                </span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm font-normal">
              Binlerce forum başlığını, YouTube incelemesini ve e-ticaret onaylı kullanıcı deneyimini sentezleyerek satın alma kararlarınızı kolaylaştıran bağımsız tüketici konsensüsü platformu.
            </p>

            {/* Transparency Manifesto card */}
            <Link 
              href="/veri-kaynaklari" 
              className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 block space-y-2 text-xs transition-all group"
            >
              <div className="flex items-center justify-between text-slate-900 font-bold">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>Şeffaf Konsensüs Protokolü</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Forumlar, onaylı alıcılar, YouTube tartışmaları ve şikayet kayıtları nasıl taranır? Veri metodolojimizi inceleyin.
              </p>
            </Link>
          </div>

          {/* Decision Tools Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4 font-['Space_Grotesk'] flex items-center gap-1.5">
              <span>Yapay Zeka Araçları</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/veri-kaynaklari" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Database className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-indigo-900">Veri Kaynakları & Metodoloji</span>
                </Link>
              </li>
              <li>
                <Link href="/urun-bulucu" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Akıllı Ürün Bulucu</span>
                </Link>
              </li>
              <li>
                <Link href="/firsat-radari" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Flame className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                  <span>Fırsat & Dip Fiyat Radarı</span>
                </Link>
              </li>
              <li>
                <Link href="/yukseltme-danismani" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span>Yükseltme Danışmanı</span>
                </Link>
              </li>
              <li>
                <Link href="/siralamalar" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Award className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>En İyiler Liderlik Tablosu</span>
                </Link>
              </li>
              <li>
                <Link href="/karsilastir?p1=apple-iphone-16-pro&p2=samsung-galaxy-s24-ultra" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Scale className="w-3.5 h-3.5 text-violet-600 group-hover:scale-110 transition-transform" />
                  <span>Çoklu Karşılaştırıcı</span>
                </Link>
              </li>
              <li>
                <Link href="/takip-listem" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 group-hover:scale-110 transition-transform" />
                  <span>Takip Listem & Alarmlar</span>
                </Link>
              </li>
              <li>
                <Link href="/ara" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-slate-500 font-semibold pt-1">
                  <span>Tüm Kataloğu Listele</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4 font-['Space_Grotesk']">
              Kategoriler
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/ara?category=akilli-telefonlar" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Akıllı Telefonlar</span>
                </Link>
              </li>
              <li>
                <Link href="/ara?category=dizustu-bilgisayarlar" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dizüstü Bilgisayarlar</span>
                </Link>
              </li>
              <li>
                <Link href="/ara?category=kulaklik-ve-ses" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kulaklık & Ses</span>
                </Link>
              </li>
              <li>
                <Link href="/ara?category=robot-supurgeler" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Robot Süpürgeler</span>
                </Link>
              </li>
              <li>
                <Link href="/ara?category=akilli-saatler" className="hover:text-indigo-600 transition-colors">
                  Akıllı Saatler & Bileklikler
                </Link>
              </li>
              <li>
                <Link href="/ara?category=ev-ve-mutfak" className="hover:text-indigo-600 transition-colors">
                  Ev & Mutfak Aletleri
                </Link>
              </li>
            </ul>
          </div>

          {/* Live Data Sources & Metrics Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4 font-['Space_Grotesk']">
              Veri & Algoritma
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              NeDiyor; YouTube videolarını, DonanımHaber/Reddit forumlarını ve onaylı e-ticaret kullanıcı yorumlarını anlık ayrıştırır.
            </p>
            
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">İncelenen Yorum:</span>
                <span className="font-bold text-slate-900 font-mono">120.000+</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Güvenilirlik Oranı:</span>
                <span className="font-bold text-emerald-600 font-mono">%99.4</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Fiyat Tarama:</span>
                <span className="font-bold text-indigo-600 font-mono">Anlık / 7/24</span>
              </div>
            </div>

            {/* Popular Brand Profiles Quick Row */}
            <div className="pt-3">
              <div className="text-[11px] font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                <span>Marka Profilleri:</span>
                <Link href="/markalar" className="text-indigo-600 hover:underline">Tümü →</Link>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <Link href="/marka/apple" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Apple</Link>
                <Link href="/marka/samsung" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Samsung</Link>
                <Link href="/marka/sony" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Sony</Link>
                <Link href="/marka/dyson" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Dyson</Link>
                <Link href="/marka/roborock" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Roborock</Link>
                <Link href="/marka/xiaomi" className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Xiaomi</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Back to Top & Legal */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} NeDiyor Tüketici Zekası Teknolojileri A.Ş.</p>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-400 font-medium hidden sm:inline">Tüm hakları saklıdır.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Aktif & Güncel</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200 cursor-pointer shadow-2xs group"
            >
              <span>Yukarı Çık</span>
              <ArrowUp className="w-3.5 h-3.5 text-indigo-600 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
