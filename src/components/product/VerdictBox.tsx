import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, UserCheck, AlertOctagon, Share2, Sparkles, Check } from 'lucide-react';
import { VerdictType } from '../../types/index.js';
import { useToast } from '../ui/Toast.js';

export interface VerdictBoxProps {
  verdictInfo: {
    status: VerdictType;
    label: string;
    variant: 'positive' | 'warning' | 'negative' | 'neutral';
    description: string;
  };
  productName: string;
  pros?: string[];
  cons?: string[];
  className?: string;
}

export const VerdictBox: React.FC<VerdictBoxProps> = ({
  verdictInfo,
  productName,
  pros = [],
  cons = [],
  className = ''
}) => {
  const { showToast } = useToast();

  const getStyles = () => {
    switch (verdictInfo.variant) {
      case 'positive':
        return {
          bg: 'bg-emerald-50/60 border-emerald-300 shadow-emerald-500/5',
          glow: 'from-emerald-500 via-emerald-400 to-teal-500',
          badgeBg: 'bg-emerald-600 text-white font-black',
          iconBg: 'bg-emerald-100 border-emerald-300 text-emerald-700',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600" />,
          titleColor: 'text-emerald-900'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/60 border-amber-300 shadow-amber-500/5',
          glow: 'from-amber-500 via-amber-400 to-yellow-500',
          badgeBg: 'bg-amber-500 text-white font-black',
          iconBg: 'bg-amber-100 border-amber-300 text-amber-700',
          icon: <AlertTriangle className="w-7 h-7 text-amber-600" />,
          titleColor: 'text-amber-900'
        };
      case 'negative':
        return {
          bg: 'bg-rose-50/60 border-rose-300 shadow-rose-500/5',
          glow: 'from-rose-500 via-rose-400 to-red-500',
          badgeBg: 'bg-rose-600 text-white font-black',
          iconBg: 'bg-rose-100 border-rose-300 text-rose-700',
          icon: <XCircle className="w-7 h-7 text-rose-600" />,
          titleColor: 'text-rose-900'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-300',
          glow: 'from-slate-400 via-slate-300 to-slate-500',
          badgeBg: 'bg-slate-700 text-white font-bold',
          iconBg: 'bg-slate-100 border-slate-300 text-slate-600',
          icon: <HelpCircle className="w-7 h-7 text-slate-600" />,
          titleColor: 'text-slate-900'
        };
    }
  };

  const style = getStyles();

  const handleCopyVerdict = () => {
    const textToCopy = `NeDiyor Kararı: ${productName} — ${verdictInfo.label}\n\n${verdictInfo.description}\n\nDetaylar: https://nediyor.com`;
    navigator.clipboard.writeText(textToCopy);
    showToast('NeDiyor Kararı panoya kopyalandı!');
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border ${style.bg} shadow-lg relative overflow-hidden transition-all bg-white ${className}`}
    >
      {/* Top accent glow line */}
      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${style.glow}`} />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${style.iconBg} shadow-2xs`}>
            {style.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                NeDiyor Konsensüs Kararı
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
              {productName} Alınır mı?
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyVerdict}
            title="Kararı Paylaş / Kopyala"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Paylaş</span>
          </button>
          <span className={`text-sm tracking-wide px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm ${style.badgeBg}`}>
            <Sparkles className="w-4 h-4" />
            {verdictInfo.label}
          </span>
        </div>
      </div>

      {/* Main explanation paragraph */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {verdictInfo.description}
        </p>
      </div>

      {/* Decision matrix columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kimler İçin İdeal */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Kimler İçin İdeal?</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Maksimum performans, premium malzeme kalitesi ve uzun ömür arayan kullanıcılar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Gelişmiş kamera, ekran ve ekosistem entegrasyonuna öncelik verenler.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Kimler Dikkat Etmeli */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2.5">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>Kimler Dikkat Etmeli?</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                <span>Sıkı bir bütçe kısıtına sahip olan ve fiyat/performans alternatiflerini değerlendirmek isteyenler.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                <span>Bir önceki nesil cihaza sahip olup küçük yükseltmeler için yüksek maliyet ödemek istemeyenler.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
