import React, { useEffect } from 'react';
import { Trophy, TrendingUp, Star, Battery, Camera, Cpu, ArrowRight, ShieldCheck, Gamepad2, Briefcase } from 'lucide-react';
import { Link } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

const TIER_LISTS = [
  {
    id: 'kamera-telefonlari',
    title: 'En İyi Kameralı Telefonlar',
    description: 'DxOMark skorları ve +15.000 kullanıcı yorumuna göre belirlenen fotoğraf ve video şampiyonları.',
    icon: <Camera className="w-6 h-6" />,
    color: 'emerald',
    items: [
      { rank: 1, name: 'Samsung Galaxy S24 Ultra', score: 9.6, badge: 'Lider' },
      { rank: 2, name: 'Apple iPhone 15 Pro Max', score: 9.5 },
      { rank: 3, name: 'Google Pixel 8 Pro', score: 9.4 },
    ]
  },
  {
    id: 'oyun-telefonlari',
    title: 'Oyun Performansı Şampiyonları',
    description: 'Soğutma başarısı, FPS değerleri ve uzun süreli yük altındaki kararlılığa göre sıralanmıştır.',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: 'rose',
    items: [
      { rank: 1, name: 'Asus ROG Phone 8 Pro', score: 9.8, badge: 'Rakipsiz' },
      { rank: 2, name: 'Samsung Galaxy S24 Ultra', score: 9.3 },
      { rank: 3, name: 'Apple iPhone 15 Pro Max', score: 9.2 },
    ]
  },
  {
    id: 'batarya-canavarlari',
    title: 'En Uzun Pil Ömrüne Sahip Cihazlar',
    description: 'Gerçek kullanım senaryoları ve ekran açık kalma (SOT) testleri ortalamasına göre hesaplandı.',
    icon: <Battery className="w-6 h-6" />,
    color: 'indigo',
    items: [
      { rank: 1, name: 'Apple iPhone 15 Plus', score: 9.7, badge: 'Batarya Kralı' },
      { rank: 2, name: 'Asus ROG Phone 8 Pro', score: 9.5 },
      { rank: 3, name: 'Samsung Galaxy S24 Ultra', score: 9.2 },
    ]
  },
  {
    id: 'fiyat-performans',
    title: 'Fiyat / Performans Kralları',
    description: 'Cihazın donanım kalitesinin ve genel memnuniyetin güncel piyasa fiyatına (₺) olan oranı.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'amber',
    items: [
      { rank: 1, name: 'POCO F5 Pro', score: 9.5, badge: 'F/P Şampiyonu' },
      { rank: 2, name: 'Samsung Galaxy S23 FE', score: 9.1 },
      { rank: 3, name: 'Apple iPhone 13', score: 8.8 },
    ]
  },
];

export const RankingsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Liderlik Tabloları & En İyiler (Tier Lists) | NeDiyor';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[600px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] -translate-y-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-4">
            <Trophy className="w-4 h-4" />
            <span>Her Ay Güncellenir</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] mb-4">
            Dinamik Liderlik Tabloları (Tier Lists)
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            Binlerce kullanıcı yorumu, yapay zeka duygu analizi ve bağımsız test verileriyle hazırlanan, kategorisinin en iyi cihazları.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TIER_LISTS.map((list) => (
            <div key={list.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className={`p-6 border-b border-slate-100 bg-gradient-to-br from-${list.color}-50/50 to-transparent`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-${list.color}-100 border border-${list.color}-200 flex items-center justify-center text-${list.color}-600 shadow-sm`}>
                    {list.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">{list.title}</h2>
                    <p className="text-xs text-slate-500 mt-1">{list.description}</p>
                  </div>
                </div>
              </div>

              {/* Ranking List */}
              <div className="p-4 sm:p-6 space-y-3">
                {list.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        item.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                        item.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                        'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}>
                        #{item.rank}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                              item.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">{item.score}</div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Puan</div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <Link href="/ara">
                    <Button variant="secondary" className="w-full text-xs font-bold text-slate-600" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Tüm Listeyi Gör (10+ Cihaz)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Promo */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left flex-1">
            <h3 className="text-xl font-bold font-['Space_Grotesk'] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Sponsorlu Sıralama Yoktur
            </h3>
            <p className="text-sm text-slate-400">
              NeDiyor liderlik tabloları tamamen yapay zeka tarafından 50.000+ kullanıcı incelemesi ve bağımsız lab testleri sentezlenerek algoritmik olarak oluşturulur.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
