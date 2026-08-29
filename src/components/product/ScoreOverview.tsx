import React from 'react';
import { ShieldCheck, MessageSquare, ExternalLink, Award, Info, Sparkles, TrendingUp } from 'lucide-react';
import { ProductScore } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';
import { ScoreGauge } from '../ui/ScoreGauge.js';
import { formatScore, formatNumber, calculateConfidence } from '../../lib/scoring.js';

export interface ScoreOverviewProps {
  score: ProductScore | null;
  className?: string;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ score, className = '' }) => {
  if (!score) {
    return (
      <div className={`p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-sm ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <Info className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">Henüz Yeterli Veri Yok</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Bu ürün hakkında doğrulanmış konsensüs puanı oluşturmak için analiz motorumuz kaynakları ve kullanıcı yorumlarını taramaya devam ediyor.
        </p>
      </div>
    );
  }

  const confidence = calculateConfidence(score.confidenceScore);

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden ${className}`}
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
        {/* Main Score Circular Gauge Box */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 w-full lg:w-72 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>NeDiyor Konsensüs Skoru</span>
          </div>

          <ScoreGauge
            score={score.overallScore}
            confidenceScore={score.confidenceScore}
            size="lg"
            showLabel={true}
          />
        </div>

        {/* Sentiment breakdown & detailed consensus metrics */}
        <div className="flex-1 flex flex-col justify-between w-full space-y-5">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-slate-700 mb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900">Kullanıcı Memnuniyet & Duygu Dağılımı</span>
              </div>
              <span className="text-slate-500 font-medium">
                {formatNumber(score.mentionCount)} Doğrulanmış Görüş İncelendi
              </span>
            </div>

            {/* Stacked Sentiment Visual Bar */}
            <div className="w-full h-5 rounded-full bg-slate-100 p-1 border border-slate-200 flex overflow-hidden">
              <div
                style={{ width: `${score.positiveRatio}%` }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-l-full transition-all duration-700 relative group cursor-pointer"
                title={`Olumlu Görüş: %${score.positiveRatio}`}
              />
              <div
                style={{ width: `${score.neutralRatio}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 relative group cursor-pointer"
                title={`Nötr / Kararsız: %${score.neutralRatio}`}
              />
              <div
                style={{ width: `${score.negativeRatio}%` }}
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-r-full transition-all duration-700 relative group cursor-pointer"
                title={`Eleştiri / Şikayet: %${score.negativeRatio}`}
              />
            </div>

            {/* Sentiment Metric Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 transition-colors">
                <div className="text-base sm:text-lg text-emerald-800 font-black font-['Space_Grotesk']">
                  %{score.positiveRatio}
                </div>
                <div className="text-[11px] font-bold text-emerald-900 mt-0.5">Olumlu İnceleme</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Övgü & Tavsiye</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-300 transition-colors">
                <div className="text-base sm:text-lg text-amber-800 font-black font-['Space_Grotesk']">
                  %{score.neutralRatio}
                </div>
                <div className="text-[11px] font-bold text-amber-900 mt-0.5">Nötr / Dengeli</div>
                <div className="text-[10px] text-amber-700 mt-0.5">Şarta Bağlı</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:border-rose-300 transition-colors">
                <div className="text-base sm:text-lg text-rose-800 font-black font-['Space_Grotesk']">
                  %{score.negativeRatio}
                </div>
                <div className="text-[11px] font-bold text-rose-900 mt-0.5">Eleştiri / Şikayet</div>
                <div className="text-[10px] text-rose-700 mt-0.5">Eksiklik Bildirimi</div>
              </div>
            </div>
          </div>

          {/* Source meta bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3.5 border-t border-slate-100 gap-2 font-medium">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <strong className="text-slate-900">{formatNumber(score.mentionCount)}</strong> Kullanıcı İncelemesi
              </span>
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <strong className="text-slate-900">{score.sourceCount}</strong> Bağımsız Platform
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Çift Katmanlı AI Doğrulama</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Son Güncelleme: {new Date(score.lastCalculatedAt).toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
