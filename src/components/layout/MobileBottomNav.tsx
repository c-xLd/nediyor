import React from 'react';
import { 
  Home, 
  Search, 
  Scale, 
  Flame, 
  Sparkles, 
  Heart,
  Layers,
  SlidersHorizontal,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Link, useRouter } from '../../lib/router.js';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  favoriteCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSearch,
  favoriteCount = 0
}) => {
  const { path } = useRouter();

  const isHome = path === '/';
  const isSearch = path.startsWith('/ara');
  const isRadar = path.startsWith('/firsat-radari');
  const isCompare = path.startsWith('/karsilastir');
  const isFinder = path.startsWith('/urun-bulucu') || path.startsWith('/yukseltme-danismani');
  const isFavorites = path.startsWith('/takip-listem') || path.startsWith('/favoriler');

  return (
    <nav 
      aria-label="Mobil Alt Navigasyon"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-between max-w-lg mx-auto relative px-1">
        
        {/* 1. Anasayfa */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 active:scale-95 group relative ${
            isHome 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHome && (
            <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-indigo-600 transition-all" />
          )}
          <div className={`p-1.5 rounded-xl transition-all ${isHome ? 'bg-indigo-50 text-indigo-600 scale-105' : 'group-hover:bg-slate-100'}`}>
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Anasayfa</span>
        </Link>

        {/* 2. Hızlı Arama & Keşif (Arama Modalı Tetikleyici) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 active:scale-95 group relative ${
            isSearch 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isSearch && (
            <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-indigo-600 transition-all" />
          )}
          <div className={`p-1.5 rounded-xl transition-all ${isSearch ? 'bg-indigo-50 text-indigo-600 scale-105' : 'group-hover:bg-slate-100'}`}>
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Arama</span>
        </button>

        {/* 3. Fırsat Radarı (Merkezi Öne Çıkan Floating Buton) */}
        <Link
          href="/firsat-radari"
          className="flex-1 flex flex-col items-center justify-center -mt-4 group active:scale-95 transition-transform"
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${
            isRadar 
              ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white ring-4 ring-rose-100 shadow-rose-500/35 scale-105' 
              : 'bg-slate-900 hover:bg-rose-600 text-white shadow-slate-900/20'
          }`}>
            <Flame className={`w-5 h-5 ${isRadar ? 'fill-current animate-pulse' : 'text-amber-400'}`} />
          </div>
          <span className={`text-[10px] mt-1 tracking-tight font-bold ${
            isRadar ? 'text-rose-600' : 'text-slate-700'
          }`}>
            Fırsatlar
          </span>
        </Link>

        {/* 4. Kıyasla (Karşılaştırıcı) */}
        <Link
          href="/karsilastir"
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 active:scale-95 group relative ${
            isCompare 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isCompare && (
            <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-indigo-600 transition-all" />
          )}
          <div className={`p-1.5 rounded-xl transition-all ${isCompare ? 'bg-indigo-50 text-indigo-600 scale-105' : 'group-hover:bg-slate-100'}`}>
            <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Kıyasla</span>
        </Link>

        {/* 5. Takip Listem & Alarmlar (veya AI Asistan) */}
        <Link
          href="/takip-listem"
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 active:scale-95 group relative ${
            isFavorites 
              ? 'text-rose-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isFavorites && (
            <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-rose-600 transition-all" />
          )}
          <div className={`p-1.5 rounded-xl transition-all relative ${
            isFavorites ? 'bg-rose-50 text-rose-600 scale-105' : 'group-hover:bg-slate-100'
          }`}>
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favoriteCount > 0 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favoriteCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Takibim</span>
        </Link>

      </div>
    </nav>
  );
};
