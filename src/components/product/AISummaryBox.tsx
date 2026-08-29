import React, { useState } from 'react';
import { Sparkles, Check, X, ThumbsUp, ThumbsDown, Lightbulb, Bot, Copy, CheckCheck, Cpu } from 'lucide-react';
import { AISummary } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';
import { useToast } from '../ui/Toast.js';

export interface AISummaryBoxProps {
  summary: AISummary | null;
  productName?: string;
  className?: string;
}

export const AISummaryBox: React.FC<AISummaryBoxProps> = ({ summary, productName = 'Bu ürün', className = '' }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!summary) {
    return (
      <div className={`rounded-3xl p-8 bg-white border border-slate-200 text-center shadow-sm ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <Bot className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">NeDiyor AI Sentezi</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Bu ürün için henüz AI konsensüs özeti oluşturulmadı. Yeterli kullanıcı yorumu toplandığında otomatik olarak derlenecektir.
        </p>
      </div>
    );
  }

  const handleCopySummary = () => {
    const textToCopy = `NeDiyor AI Konsensüs Özeti (${productName}):\n\n${summary.content}\n\nÖne Çıkan Artılar:\n${summary.pros.map(p => `+ ${p}`).join('\n')}\n\nDikkat Edilmesi Gerekenler:\n${summary.cons.map(c => `- ${c}`).join('\n')}\n\nSon Söz: ${summary.keyTakeaway || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('AI Konsensüs Özeti panoya kopyalandı!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 bg-white border border-indigo-200/80 shadow-xl shadow-indigo-500/5 relative overflow-hidden ${className}`}
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                NeDiyor AI Sentezi
              </h3>
              <Badge variant="indigo" size="sm" dot>
                Konsensüs Özeti
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Binlerce bağımsız kullanıcı yorumu ve uzman incelemesinin yapay zeka konsensüsü
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            title="Özeti Kopyala"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Narrative Overview */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6">
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {summary.content}
        </p>
      </div>

      {/* Pros & Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Pros */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3.5">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>Öne Çıkan Artılar (Pros)</span>
          </div>
          <ul className="space-y-2.5">
            {summary.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <div className="p-1 rounded-lg bg-emerald-200/80 text-emerald-800 mt-0.5 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-3.5">
            <ThumbsDown className="w-4 h-4 text-rose-600" />
            <span>Dikkat Edilmesi Gerekenler (Cons)</span>
          </div>
          <ul className="space-y-2.5">
            {summary.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <div className="p-1 rounded-lg bg-rose-200/80 text-rose-800 mt-0.5 flex-shrink-0">
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ideal For & Key Takeaway */}
      {(summary.idealFor || summary.keyTakeaway) && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs sm:text-sm">
          {summary.idealFor && (
            <div className="flex items-start gap-2.5 text-slate-800">
              <span className="font-bold text-indigo-700 flex-shrink-0">Kimin İçin İdeal:</span>
              <span className="font-medium text-slate-700">{summary.idealFor}</span>
            </div>
          )}
          {summary.keyTakeaway && (
            <div className="flex items-start gap-2.5 text-slate-800 pt-3 border-t border-indigo-100">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 mr-1.5">Konsensüs Sonucu:</span>
                <span className="font-medium text-slate-700">{summary.keyTakeaway}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Model info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Analiz Motoru: {summary.modelVersion || 'NeDiyor Intelligence v1'}</span>
        </div>
        <span className="font-medium">Doğrulanmış NLP Duygu Analizi</span>
      </div>
    </div>
  );
};
