import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Quote,
  Flame,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { ProductDetailData, AskConsensusQuestionResponse } from '../../types/index.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { useToast } from '../ui/Toast.js';

interface ConsensusQAProps {
  product: ProductDetailData;
}

const DEFAULT_QUICK_QUESTIONS: Record<string, string[]> = {
  'akilli-telefonlar': [
    'Isınma veya el yakma sorunu yaşanıyor mu?',
    'Bataryası 1 tam günü yoğun kullanımda rahat çıkarır mı?',
    'Kamera gece çekimi ve hareketli nesnelerde nasıl?',
    'Gözlükle bakarken ekran gözü yoruyor mu (PWM titreşimi)?'
  ],
  'laptoplar': [
    '4K video kurgusu veya ağır render alırken fan sesi rahatsız ediyor mu?',
    'Pil ömrü prize takılı olmadan kaç saat gidiyor?',
    'Klavye tuş hissi ve trackpad ergonomisi nasıl?',
    'Kasa parmak izi tutuyor mu ve menteşesi sağlam mı?'
  ],
  'kulakliklar': [
    'Gözlükle kullanıldığında kulakta veya kafa bandında ağrı yapıyor mu?',
    'Yaz sıcağında kulak pedleri terletme yapıyor mu?',
    'Uçakta veya otobüste ANC gürültü kesme performansı nasıl?',
    'Mikrofonu rüzgarlı havada ve sokakta net ses iletiyor mu?'
  ],
  'robot-supurgeler': [
    'Yüksek ve püsküllü halıların üzerinden rahat geçebiliyor mu?',
    'Evcil hayvan tüyü kauçuk fırçaya dolanıyor mu?',
    'İstasyon paspas yıkama ve kurutma işlemi koku yapıyor mu?',
    'Karanlık odada LiDAR haritalaması sorunsuz mu?'
  ]
};

export const ConsensusQA: React.FC<ConsensusQAProps> = ({ product }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<AskConsensusQuestionResponse | null>(null);
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const { showToast } = useToast();

  const categoryQuestions = DEFAULT_QUICK_QUESTIONS[product.categoryId] || [
    'Isınma veya kronik donanım sorunu var mı?',
    'Pil veya enerji tüketimi uzun vadede nasıl?',
    'Fiyatını gerçekten hak ediyor mu?',
    'Kullanıcı memnuniyeti hangi noktalarda en yüksek?'
  ];

  const handleAsk = async (qText?: string) => {
    const query = (qText || question).trim();
    if (!query) {
      showToast('Lütfen sormak istediğiniz soruyu yazın veya hızlı sorulardan seçin.', 'info');
      return;
    }

    if (qText) {
      setQuestion(qText);
    }

    setIsLoading(true);
    try {
      const res = await api.askConsensus(product.slug, query);
      setAnswer(res);
    } catch (err: any) {
      console.error('Consensus ask error:', err);
      showToast(err.message || 'Soru yanıtlanırken bir hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'EVET':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Net Onay
          </span>
        );
      case 'HAYIR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Olumsuz / Önermiyoruz
          </span>
        );
      case 'KISMEN':
      case 'KULLANIMA_BAGLI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Kısmen / Şartlara Bağlı
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Analiz Edildi
          </span>
        );
    }
  };

  return (
    <div id="konsensuse-sor" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-50/50 via-emerald-50/30 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                Konsensüse Sor
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                Yapay Zeka Danışmanı
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              İncelemeler, Reddit, Ekşi Sözlük ve forumlardaki binlerce yorum taranarak anında objektif yanıtlanır.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kaynak Taramalı Doğruluk</span>
        </div>
      </div>

      {/* Input box */}
      <div className="relative z-10 mb-5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            placeholder={`Örn: Bu ürünle ilgili kafanıza takılan herhangi bir detayı sorun...`}
            className="w-full pl-4 pr-28 sm:pr-32 py-3.5 rounded-2xl border border-slate-300 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
          />
          <div className="absolute right-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAsk()}
              isLoading={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm font-semibold"
              leftIcon={!isLoading ? <Send className="w-3.5 h-3.5" /> : undefined}
            >
              Sor
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Suggested Pills */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Sıkça Sorulan Hızlı Sorular (Tıklayıp Anında Yanıt Alın):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryQuestions.map((qText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(qText)}
              disabled={isLoading}
              className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 font-medium transition-all duration-150 active:scale-98"
            >
              {qText}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Output Section */}
      {answer && (
        <div className="relative z-10 mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-100 shadow-sm animate-fadeIn">
          {/* Answer Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Soru Analizi
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                "{answer.question}"
              </h4>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getVerdictBadge(answer.directVerdict)}
              <div className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                %{answer.confidenceScore} Veri Doyumu
              </div>
            </div>
          </div>

          {/* Verdict Label */}
          <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">Doğrudan Konsensüs Kararı</span>
              <span className="text-sm font-bold text-slate-900">{answer.directVerdictLabel}</span>
            </div>
          </div>

          {/* Summary Text */}
          <div className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {answer.summary}
          </div>

          {/* Key Findings Checklist */}
          {answer.keyFindings && answer.keyFindings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200/60">
              <h5 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Önemli Bulgular & Sahadan Notlar:
              </h5>
              <ul className="space-y-1.5">
                {answer.keyFindings.map((finding, fIdx) => (
                  <li key={fIdx} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real Quotes Section */}
          {answer.quotes && answer.quotes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200/60">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-600" />
                  Gerçek Kullanıcı & İnceleme Kaynaklarından Alıntılar ({answer.quotes.length}):
                </h5>
                {answer.quotes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAllQuotes(!showAllQuotes)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {showAllQuotes ? 'Daha Az Göster' : 'Tümünü Gör'}
                    {showAllQuotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {(showAllQuotes ? answer.quotes : answer.quotes.slice(0, 1)).map((quote, qIdx) => (
                  <div key={qIdx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-slate-800">{quote.sourceName}</span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {quote.relevance}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">
                      "{quote.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
