import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Youtube, 
  MessageSquare, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Search, 
  Filter, 
  Activity, 
  BarChart3, 
  Flame, 
  Scale, 
  ArrowRight, 
  ExternalLink, 
  Lock, 
  RefreshCw, 
  FileText, 
  HelpCircle,
  TrendingUp,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { Link, useRouter } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

interface SourceCategory {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  volume: string;
  updateFrequency: string;
  weight: number;
  platforms: {
    name: string;
    logoText: string;
    color: string;
    focus: string;
    verifiedMetric: string;
    features: string[];
  }[];
  filteringProcess: string[];
}

export const DataSourcesPage: React.FC = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'ecommerce' | 'forums' | 'youtube' | 'complaints'>('all');
  const [interactiveSample, setInteractiveSample] = useState<'sample1' | 'sample2' | 'sample3'>('sample1');

  const sourceCategories: SourceCategory[] = [
    {
      id: 'ecommerce',
      name: 'E-Ticaret Platformları (Doğrulanmış Alıcı Yorumları)',
      badge: 'Onaylı Sipariş & Gerçek Alıcı',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
      description: 'Yalnızca ürünü satın almış ve teslim almış "Onaylı Alıcı" (Verified Buyer) rozetine sahip kullanıcı deneyimleri taranır. Kargo poşeti veya teslimat gecikmesi gibi üründen bağımsız kargo yorumları temizlenir.',
      volume: '65.000+ Onaylı Değerlendirme',
      updateFrequency: 'Anlık / Saatlik Senkronizasyon',
      weight: 35,
      platforms: [
        {
          name: 'Hepsiburada',
          logoText: 'HB',
          color: 'bg-orange-500 text-white',
          focus: 'Onaylı Sipariş İncelemeleri & Fotoğraflı Deneyimler',
          verifiedMetric: '%100 Onaylı Alıcı Rozeti Filtresi',
          features: ['Fotoğraflı kutu açılışı analizi', 'Uzun kullanım sonrası güncellenen değerlendirmeler', 'Satıcı puanından bağımsız ürün yorumları']
        },
        {
          name: 'Trendyol',
          logoText: 'TY',
          color: 'bg-orange-600 text-white',
          focus: 'Topluluk Yorumları & Beden/Kullanım Notları',
          verifiedMetric: 'Sipariş Geçmişi Doğrulaması',
          features: ['Farklı satıcı modellerinin tek potada birleştirilmesi', 'Yıldız dağılım anomali denetimi', 'Tekrarlayan şablon yorum tespiti']
        },
        {
          name: 'Amazon Türkiye',
          logoText: 'AMZ',
          color: 'bg-amber-600 text-white',
          focus: 'Ayrıntılı Teknik İncelemeler & Küresel Karşılaştırmalar',
          verifiedMetric: 'Amazon Onaylı Satın Alma',
          features: ['Detaylı metin madenciliği', 'Uluslararası kullanıcı kronik problem kayıtları', 'Dayanıklılık ve malzeme kalitesi raporları']
        },
        {
          name: 'Teknosa & Vatan Bilgisayar',
          logoText: 'TR',
          color: 'bg-blue-600 text-white',
          focus: 'Fiziksel Mağaza ve Web Müşteri Geri Bildirimleri',
          verifiedMetric: 'Yetkili Satıcı Doğrulaması',
          features: ['Yetkili distribütör garantisi geri bildirimleri', 'Servis süreci ve kurulum deneyimleri', 'Özel donanım varyantları']
        }
      ],
      filteringProcess: [
        'Kargo, paketleme veya kurye firması şikayetleri ayrıştırılarak elenir (yalnızca ürün performansı baz alınır).',
        'Bot ve sahte hediye karşılığı yazılan "5 yıldız süper" gibi jenerik şablon yorumlar düşük ağırlıkla filtrelenir.',
        'Fotoğraflı ve en az 14 gün kullanımdan sonra girilen detaylı yorumlara 1.5x güven katsayısı verilir.'
      ]
    },
    {
      id: 'forums',
      name: 'Teknoloji Forumları ve Tüketici Toplulukları',
      badge: 'Derinlemesine Teknik Tartışmalar',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
      description: 'Uzun vadeli kullanıcı kulüpleri (Ana Konular), donanım optimizasyonu, batarya ekran süreleri, ısınma testleri ve kronik sorunların paylaşıldığı en güvenilir tarafsız teknik tartışma havuzu.',
      volume: '30.000+ Forum Başlığı & Ana Konu',
      updateFrequency: 'Günlük Derin Tarama',
      weight: 30,
      platforms: [
        {
          name: 'DonanımHaber Forum',
          logoText: 'DH',
          color: 'bg-red-600 text-white',
          focus: 'Resmi Kullanıcı Ana Konuları (Kullanıcılar Kulübü)',
          verifiedMetric: 'Kıdemli Üye & Donanım Karşılaştırma',
          features: ['6+ aylık uzun kullanım testleri', 'Batarya ekran süreleri (SoT) ve ısınma verileri', 'Güncelleme sonrası pil optimizasyon tartışmaları']
        },
        {
          name: 'Technopat Sosyal',
          logoText: 'TP',
          color: 'bg-cyan-600 text-white',
          focus: 'Mavi Ekran, Donanım Uyuşmazlığı & Performans Sorunları',
          verifiedMetric: 'Teknik Moderasyon & Donanım Raporları',
          features: ['Sistem donanım çakışmaları', 'Sıcaklık ve FPS kıyaslamaları', 'Kronik panel/anakart/yazılım arıza logları']
        },
        {
          name: 'Ekşi Sözlük & Tüketici Başlıkları',
          logoText: 'ES',
          color: 'bg-emerald-600 text-white',
          focus: 'Gerçek Hayat Tüketici Deneyimleri & Marka Algısı',
          verifiedMetric: 'Filtrelenmiş Entry & Kronik Şikayet Madenciliği',
          features: ['Satış sonrası müşteri desteği kalitesi', 'Kullanıcı algısı ve kronik malzeme yıpranmaları', 'Reklam veya bot tespitiyle arındırılmış sözlük verisi']
        },
        {
          name: 'Reddit (r/Turkey & Global Tech)',
          logoText: 'RD',
          color: 'bg-orange-500 text-white',
          focus: 'Topluluk Oylamalı Donanım İncelemeleri',
          verifiedMetric: 'Upvote/Downvote Konsensüsü',
          features: ['Global ve yerel versiyon farkları (Exynos vs Snapdragon vb.)', 'Uzun dönem dayanıklılık paylaşımları', 'F/P alternatif tavsiyeleri']
        }
      ],
      filteringProcess: [
        'Fanboy / Marka fanatikliği içeren aşırı yanlı ve temelsiz yorumlar duygu analiziyle nötralize edilir.',
        'Kanıtlı ekran görüntüsü veya test sonucu paylaşan kıdemli üyelerin tespitleri konsensüste önceliklendirilir.',
        'Güncelleme ile çözülen eski yazılımsal hatalar güncel versiyonlarda "Çözüldü" olarak etiketlenir.'
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube İncelemeleri Altındaki Kullanıcı Tartışmaları',
      badge: 'Gerçek Kullanıcı Yorumları & Testler',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <Youtube className="w-5 h-5 text-rose-600" />,
      description: 'Sponsorlu video içeriğinin kendisinden ziyade, videonun altındaki yüzlerce gerçek izleyici ve satın alan kişinin "Bende de aynı sorun çıktı", "3 ay sonra pili düştü" gibi ilk elden deneyimleri taranır.',
      volume: '20.000+ Video Altı Yorum & Tartışma',
      updateFrequency: 'Haftalık / Yeni Çıkan Videolar',
      weight: 20,
      platforms: [
        {
          name: 'Bağımsız Teknoloji Kanalları',
          logoText: 'YT',
          color: 'bg-rose-600 text-white',
          focus: 'Kullanıcı Karşı Çıkışları & Doğrulama Yorumları',
          verifiedMetric: 'Yüksek Beğeni Alan Kullanıcı Deneyimleri',
          features: ['İncelemecinin bahsetmediği eksi yönlerin açığa çıkması', 'Fiyat ve Türkiye şartlarında değer tartışmaları', 'Benzer fiyatlı rakip önerileri']
        },
        {
          name: 'Dayanıklılık & Stres Testi Videoları',
          logoText: 'LAB',
          color: 'bg-slate-800 text-white',
          focus: 'Düşme, Çizilme, Su Geçirmezlik ve İç Parça Analizleri',
          verifiedMetric: 'Fiziksel Laboratuvar Kanıtları',
          features: ['Kasa esneme ve menteşe ömrü testleri', 'Termal kamera altında ısınma haritaları', 'Tamir edilebilirlik skorları']
        }
      ],
      filteringProcess: [
        'Videonun sponsorlu olup olmadığı bağımsız olarak tespit edilir; video anlatımından ziyade izleyici konsensüsü baz alınır.',
        'Spam, çekiliş veya alakasız geyik yorumları NLP (Doğal Dil İşleme) filtreleriyle elenir.',
        'En çok "beğeni" ve "yanıt" alan kullanıcı itirazları ve onayları ağırlıklı olarak işlenir.'
      ]
    },
    {
      id: 'complaints',
      name: 'Şikayet Portalları & Tüketici Hakem Heyeti Kayıtları',
      badge: 'Kronik Arıza & Servis Analizi',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      description: 'Ürünün fabrikasyon hataları, servis süreçlerinde çıkarılan zorluklar, parça temin süresi ve garanti kapsamı sorunları incelenerek "Kronik Problem" riski matematiksel olarak hesaplanır.',
      volume: '15.000+ Çözümlenmiş & Açık Şikayet',
      updateFrequency: 'Sürekli / Dinamik Risk İndeksi',
      weight: 15,
      platforms: [
        {
          name: 'Şikayetvar',
          logoText: 'ŞV',
          color: 'bg-emerald-700 text-white',
          focus: 'Marka Servis Çözüm Oranları & Kronik Arızalar',
          verifiedMetric: 'Çözüldü Rozeti & Müşteri Teşekkürü',
          features: ['Tekrarlayan anakart/ekran/motor arızalarının tespiti', 'Markanın şikayete dönüş hızı ve memnuniyet oranı', 'Yedek parça ve garanti deneyimleri']
        },
        {
          name: 'Tüketici Hakem Heyeti Kararları & Emsal Olaylar',
          logoText: 'THH',
          color: 'bg-slate-700 text-white',
          focus: 'Ayıplı Mal & İade Süreçleri',
          verifiedMetric: 'Hukuki Emsal Kayıtları',
          features: ['Gizli ayıp ve kronik kusur tespiti', 'Servis değişim raporu verme zorlukları', 'Tüketici hakları güven endeksi']
        }
      ],
      filteringProcess: [
        'Her şikayet doğrudan eksi puan olarak yazılmaz; markanın şikayeti çözme süresi ve müşteri memnuniyeti orantılanır.',
        'Kullanıcı hatasından kaynaklanan fiziksel kırılmalar ile fabrikasyon kronik kusurlar ayrıştırılır.',
        'Satılan toplam cihaz adedine oranla şikayet yüzdesi hesaplanarak adil bir katsayı belirlenir.'
      ]
    }
  ];

  const filteredCategories = activeTab === 'all' 
    ? sourceCategories 
    : sourceCategories.filter(c => c.id === activeTab);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Header Hero */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Veri Kaynakları & Şeffaflık Protokolü</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
              NeDiyor Neleri Tarar? <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Yapay Zeka Konsensüsü Nasıl Oluşur?
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Tüketicinin en doğru satın alma kararına ulaşması için; onaylı e-ticaret alıcı yorumları, teknoloji forumlarındaki ana konular, YouTube altındaki kullanıcı itirazları ve şikayet portalları 7/24 taranır, spamdan arındırılır ve ağırlıklandırılarak puanlanır.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
                <span className="text-xs text-slate-500 font-medium block">Taranan Kaynak</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">130.000+</span>
                <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">Yorum & Tartışma</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
                <span className="text-xs text-slate-500 font-medium block">Spam & Bot Filtresi</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-['Space_Grotesk']">%99.4</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Yüksek Doğruluk</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
                <span className="text-xs text-slate-500 font-medium block">Analiz Boyutu</span>
                <span className="text-xl sm:text-2xl font-black text-violet-600 font-['Space_Grotesk']">6 Kriter</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Donanım / F-P / Kronik</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
                <span className="text-xs text-slate-500 font-medium block">Güncelleme</span>
                <span className="text-xl sm:text-2xl font-black text-rose-600 font-['Space_Grotesk']">7/24</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Anlık Senkronizasyon</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              Taranan 4 Ana Veri Havuzu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tek bir kaynağa bağlı kalmadan, farklı kullanıcı profillerinin geri bildirimlerini dengeli bir ağırlık havuzunda birleştiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sourceCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                  activeTab === cat.id ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      Ağırlık: %{cat.weight}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                      {cat.name.split('(')[0]}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block mt-1 ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Detayları İncele</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tüm Kaynakları Göster
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ecommerce')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'ecommerce'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>E-Ticaret (%35)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('forums')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'forums'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Forumlar (%30)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'youtube'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Tartışmaları (%20)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'complaints'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Şikayet & Servis (%15)</span>
          </button>
        </div>

        {/* Detailed Category Sections */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    {category.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Space_Grotesk']">
                        {category.name}
                      </h3>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${category.badgeColor}`}>
                        {category.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shrink-0">
                  <span className="text-[11px] text-slate-500 font-medium">Konsensüs Ağırlığı:</span>
                  <span className="text-base font-black text-indigo-700 font-['Space_Grotesk']">
                    %{category.weight} Etki Oranı
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {category.volume}
                  </span>
                </div>
              </div>

              {/* Platforms Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Taranan Platformlar & Doğrulama Standartları
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.platforms.map((plat, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono shadow-xs ${plat.color}`}>
                            {plat.logoText}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block font-['Space_Grotesk']">
                              {plat.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {plat.focus}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
                          {plat.verifiedMetric}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {plat.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Spam & Cleaning Protocols */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs font-['Space_Grotesk'] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Bu Kategorideki Yapay Zeka Ayıklama & Filtreleme Kuralları</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-indigo-950/80">
                  {category.filteringProcess.map((proc, pIdx) => (
                    <div key={pIdx} className="bg-white/80 border border-indigo-100/80 rounded-xl p-3 space-y-1 shadow-2xs">
                      <span className="text-[10px] font-black text-indigo-500 block">
                        Kural #{pIdx + 1}
                      </span>
                      <p className="leading-relaxed">
                        {proc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Live Interactive Verification Example (Simulator) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Etkileşimli Doğrulama Simülatörü</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-['Space_Grotesk']">
              Bir Yorum NeDiyor Konsensüsüne Nasıl Dahil Edilir?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Aşağıdaki gerçek dünya örneklerine tıklayarak yapay zekanın yorumları nasıl ayıkladığını ve puanlara nasıl yansıttığını canlı görün.
            </p>
          </div>

          {/* Sample Selector */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInteractiveSample('sample1')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                interactiveSample === 'sample1'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Örnek 1: Kargo Şikayeti (Elenir)
            </button>
            <button
              type="button"
              onClick={() => setInteractiveSample('sample2')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                interactiveSample === 'sample2'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Örnek 2: Forum 6 Aylık Pil Analizi (Yüksek Ağırlık)
            </button>
            <button
              type="button"
              onClick={() => setInteractiveSample('sample3')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                interactiveSample === 'sample3'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Örnek 3: YouTube Altı Kronik Isınma İtirazı (Doğrulanır)
            </button>
          </div>

          {/* Simulator Content Card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
            {interactiveSample === 'sample1' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      HAM YORUM (E-Ticaret)
                    </span>
                    <span className="text-xs text-slate-400">Puan: 1/5 Yıldız</span>
                  </div>
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Sonuç: Konsensüsten Elendi (Ağırlık: %0)</span>
                  </span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl text-xs text-slate-300 font-mono italic">
                  "Kargo 6 günde geldi, kutusu ezilmişti. Kurye de kapıya bırakıp kaçmış. Bir daha bu mağazadan asla alışveriş yapmam."
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-indigo-400 font-['Space_Grotesk'] block">
                    🤖 Yapay Zeka Ayrıştırma Raporu:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Metin Sınıflandırması:</strong> %99.8 Lojistik / Kargo Şikayeti.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Ürün Performans Tespiti:</strong> Cihaz donanımı, batarya veya kalitesine dair hiçbir veri içermiyor.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Aksiyon:</strong> Ürünün genel puanını (NeDiyor Konsensüs Puanı) haksız yere düşürmemesi için filtre havuzundan çıkartıldı.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {interactiveSample === 'sample2' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      HAM YORUM (DonanımHaber Ana Konu)
                    </span>
                    <span className="text-xs text-slate-400">Üye Kıdemi: 8 Yıl • 6 Aylık Kullanıcı</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sonuç: Yüksek Güvenilirlik ile İşlendi (1.5x Katsayı)</span>
                  </span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl text-xs text-slate-300 font-mono italic">
                  "6 aydır günlük ana cihazım olarak kullanıyorum. Son gelen 1.4 güncellemesinden sonra ekran süresi 5.5 saatten 7 saate çıktı. Ancak yoğun kamerada ve 4K 60fps çekimde 15. dakikadan sonra hafif kısma (throttling) yapıyor."
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-indigo-400 font-['Space_Grotesk'] block">
                    🤖 Yapay Zeka Ayrıştırma Raporu:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Batarya Boyutu:</strong> +0.4 puan (Yazılım optimizasyonuyla artan pil verimi).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Termal / Isınma Boyutu:</strong> -0.3 puan (4K video kaydında termal kısma uyarısı).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Konsensüs Çıktısı:</strong> Ürün detay sayfasındaki "Eksi Yönler" ve "Batarya Analizi" kutularına otomatik eklendi.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {interactiveSample === 'sample3' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      HAM YORUM (YouTube İnceleme Altı)
                    </span>
                    <span className="text-xs text-slate-400">420 Beğeni • 38 Yanıt</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Sonuç: Kronik Risk İndeksine Eklendi</span>
                  </span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl text-xs text-slate-300 font-mono italic">
                  "İncelemede bahsedilmemiş ama mop kaldırırken halıya damlatma yapıyor. 3 farklı arkadaşımda da aynı robot var, yazılımsal değil sensör yüksekliğiyle alakalı."
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-indigo-400 font-['Space_Grotesk'] block">
                    🤖 Yapay Zeka Ayrıştırma Raporu:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Sosyal Kanıt Sinyali:</strong> 420 beğeni ve çoklu teyit nedeniyle yüksek önem skoru.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Kronik Kusur Etiketi:</strong> "Yüksek Halılarda Islaklık Riski" olarak konsensüs özetine işlendi.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5 Neutrality Principles (Our Manifesto) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Tarafsızlık Manifestosu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              NeDiyor Tarafsızlık İlkeleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kullanıcının güveni en değerli varlığımızdır. Algoritmalarımız ticari anlaşmalardan tamamen bağımsız çalışır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                Parayla Puan Değiştirilemez
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hiçbir üretici, marka veya satıcı ücret ödeyerek konsensüs puanını artıramaz, eksi yönlerini sildiremez veya satın alma kararını "Alınır" olarak değiştiremez.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                Sponsorlu İncelemeler Ayrıştırılır
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                İnternetteki sponsorlu teknoloji videolarının reklam içerikleri elenir; ürünün gerçek durumu topluluk tecrübeleriyle çapraz doğrulamaya tabi tutulur.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                Canlı ve Dinamik Skorlar
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ürün ilk çıktığında mükemmel olsa bile, 6 ay sonra ortaya çıkan bir kronik arıza veya yazılım bozulması anında skoru düşürür ve kullanıcı uyarılır.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Veri tarama protokolümüz veya algoritmalarımız hakkında sorularınız mı var?
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ara')}
                className="text-xs font-bold"
              >
                Tüm Ürünleri İncele
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/firsat-radari')}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Fırsat Radarını Aç
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
