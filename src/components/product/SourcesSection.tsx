import React from 'react';
import { ExternalLink, ShieldCheck, MessageSquare, Database, CheckCircle2 } from 'lucide-react';
import { Source } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { formatNumber } from '../../lib/scoring.js';

export interface SourcesSectionProps {
  sources: {
    source: Source;
    mentionCount: number;
    sampleUrl?: string;
  }[];
  className?: string;
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({ sources, className = '' }) => {
  if (sources.length === 0) {
    return null;
  }

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'ECOMMERCE_REVIEWS':
        return 'E-Ticaret Yorumları';
      case 'SOCIAL_COMMUNITY':
        return 'Sosyal Topluluk';
      case 'VIDEO_REVIEWS':
        return 'Video İncelemeleri';
      case 'TECH_FORUM':
        return 'Teknoloji Forumu';
      case 'COMPLAINT_PLATFORM':
        return 'Şikayet Platformu';
      default:
        return 'Kullanıcı İncelemesi';
    }
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Doğrulanmış Veri Kaynakları & Dağılım
            </h3>
            <p className="text-xs text-slate-500">
              Şeffaf, bağımsız ve tarafsız platform verileri
            </p>
          </div>
        </div>
        <Badge variant="indigo" size="sm" dot>
          {sources.length} Bağımsız Kaynak
        </Badge>
      </div>

      <p className="text-xs text-slate-600 mb-6 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        Bu ürünün konsensüs puanı ve duygu analizi; aşağıdaki doğrulanmış platformlardaki kullanıcı geri bildirimleri botlarımız tarafından taranarak, çift katmanlı yapay zeka süzgecinden geçirilerek hesaplanmıştır.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(({ source, mentionCount, sampleUrl }) => (
          <div
            key={source.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {source.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  %{source.reliabilityScore} Güven
                </span>
              </div>
              <div className="text-xs text-indigo-600 font-semibold">
                {getSourceTypeLabel(source.sourceType)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span><strong className="text-slate-800 font-semibold">{formatNumber(mentionCount)}</strong> adet görüş incelendi</span>
              </div>

              {/* YouTube Analysis Timestamps Demo */}
              {source.sourceType === 'VIDEO_REVIEWS' && (
                <div className="mt-3 pt-3 border-t border-slate-100/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    AI Video Timestamp Analizi
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100">04:12</span>
                      <span className="text-slate-600 truncate">Batarya performansı eleştirisi</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">08:45</span>
                      <span className="text-slate-600 truncate">Kamera OIS testi övgüsü</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              {sampleUrl ? (
                <a
                  href={sampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/link"
                >
                  <span>Doğrula & Kaynağa Git</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Doğrulanmış NeDiyor API verisi</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
