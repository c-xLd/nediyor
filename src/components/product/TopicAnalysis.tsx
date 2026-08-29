import React, { useState } from 'react';
import { Layers, ThumbsUp, ThumbsDown, CheckCircle, AlertTriangle, ChevronRight, BarChart2 } from 'lucide-react';
import { ProductTopicScore } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';
import { formatScore, formatNumber } from '../../lib/scoring.js';

export interface TopicAnalysisProps {
  topicScores: ProductTopicScore[];
  mostPraised: ProductTopicScore[];
  mostCriticized: ProductTopicScore[];
  className?: string;
}

export const TopicAnalysis: React.FC<TopicAnalysisProps> = ({
  topicScores,
  mostPraised,
  mostCriticized,
  className = ''
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  if (topicScores.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-emerald-700';
    if (score >= 6.5) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8.0) return 'bg-gradient-to-r from-emerald-600 to-emerald-500';
    if (score >= 6.5) return 'bg-gradient-to-r from-amber-500 to-amber-400';
    return 'bg-gradient-to-r from-rose-500 to-rose-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Praised & Criticized Fast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Most Praised */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4 pb-2 border-b border-slate-100">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>En Çok Övülen Başlıklar</span>
          </div>
          <div className="space-y-3">
            {mostPraised.map(topic => (
              <div
                key={topic.topicId}
                className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">
                    {topic.topicName}
                  </span>
                  <Badge variant="emerald" size="sm" className="font-extrabold">
                    ★ {formatScore(topic.score)} / 10
                  </Badge>
                </div>
                {topic.positiveHighlights && topic.positiveHighlights.length > 0 && (
                  <p className="text-xs text-slate-700 leading-relaxed italic mt-1 font-medium">
                    "{topic.positiveHighlights[0]}"
                  </p>
                )}
                <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{formatNumber(topic.mentionCount)} değerlendirme</span>
                  <span className="text-emerald-700 font-bold">%{topic.sentimentRatio} memnuniyet</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Criticized */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-4 pb-2 border-b border-slate-100">
            <ThumbsDown className="w-4 h-4 text-rose-600" />
            <span>En Çok Eleştirilen Başlıklar</span>
          </div>
          {mostCriticized.length > 0 ? (
            <div className="space-y-3">
              {mostCriticized.map(topic => (
                <div
                  key={topic.topicId}
                  className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 hover:border-rose-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">
                      {topic.topicName}
                    </span>
                    <Badge variant={topic.score >= 6.5 ? 'amber' : 'rose'} size="sm" className="font-extrabold">
                      ★ {formatScore(topic.score)} / 10
                    </Badge>
                  </div>
                  {topic.negativeHighlights && topic.negativeHighlights.length > 0 ? (
                    <p className="text-xs text-slate-700 leading-relaxed italic mt-1 font-medium">
                      "{topic.negativeHighlights[0]}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">Kullanıcılar bu alanda bazı iyileştirme gereksinimleri belirtiyor.</p>
                  )}
                  <div className="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatNumber(topic.negativeCount)} olumsuz bildirim</span>
                    <span className="text-rose-700 font-bold">%{100 - topic.sentimentRatio} eleştiri</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              Bu ürün hakkında belirgin bir kronik eleştiri veya şikayet kaydı bulunmuyor.
            </div>
          )}
        </div>
      </div>

      {/* 2. Full Topic Scores Breakdown */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                Konu Bazlı Detaylı Puan Matrisi
              </h3>
              <p className="text-xs text-slate-500">
                Her bir donanım ve kullanım başlığına tıklayarak detaylı konsensüs verilerini inceleyin
              </p>
            </div>
          </div>
          <Badge variant="indigo" size="sm">
            {topicScores.length} Kategori
          </Badge>
        </div>

        <div className="space-y-3.5">
          {topicScores.map(topic => {
            const isSelected = selectedTopicId === topic.topicId;
            return (
              <div
                key={topic.topicId}
                onClick={() => setSelectedTopicId(isSelected ? null : topic.topicId)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/40 border-indigo-300 shadow-md'
                    : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm sm:text-base font-bold text-slate-900 font-['Space_Grotesk']">
                      {topic.topicName}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {formatNumber(topic.mentionCount)} görüş
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-base sm:text-lg font-black font-['Space_Grotesk'] ${getScoreColor(topic.score)}`}>
                      {formatScore(topic.score)}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">/10</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-indigo-600' : ''}`} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 p-0.5 overflow-hidden">
                  <div
                    style={{ width: `${(topic.score / 10) * 100}%` }}
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBg(topic.score)}`}
                  />
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                        <div className="font-bold text-emerald-700">{topic.positiveCount}</div>
                        <div className="font-medium">Olumlu İfade</div>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                        <div className="font-bold text-amber-700">{topic.neutralCount}</div>
                        <div className="font-medium">Nötr Görüş</div>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-200">
                        <div className="font-bold text-rose-700">{topic.negativeCount}</div>
                        <div className="font-medium">Eleştiri / Şikayet</div>
                      </div>
                    </div>

                    {topic.positiveHighlights && topic.positiveHighlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}

                    {topic.negativeHighlights && topic.negativeHighlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs font-medium">
                        <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
