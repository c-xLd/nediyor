import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MinusCircle, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Send,
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { CommunityReview } from '../../types/index.js';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
  productName: string;
  onReviewAdded: (newReview: CommunityReview) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  productSlug,
  productName,
  onReviewAdded
}) => {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(9);
  const [recommendation, setRecommendation] = useState<'recommend' | 'neutral' | 'not_recommend'>('recommend');
  const [usageDuration, setUsageDuration] = useState<'<1m' | '1-6m' | '6-12m' | '>1y'>('1-6m');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAddPro = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (proInput.trim() && !pros.includes(proInput.trim())) {
      setPros([...pros, proInput.trim()]);
      setProInput('');
    }
  };

  const handleAddCon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (conInput.trim() && !cons.includes(conInput.trim())) {
      setCons([...cons, conInput.trim()]);
      setConInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Lütfen başlık ve deneyim detaylarınızı eksiksiz doldurunuz.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const newReview = await api.submitCommunityReview(productSlug, {
        authorName: authorName.trim() || 'Doğrulanmış Kullanıcı',
        isVerifiedBuyer,
        usageDuration,
        recommendation,
        rating,
        title: title.trim(),
        content: content.trim(),
        pros,
        cons
      });

      onReviewAdded(newReview);
      onClose();
    } catch (err: any) {
      console.error('Review submit failed:', err);
      setErrorMessage(err.message || 'Yorum kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50/40 via-teal-50/20 to-transparent">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                NeDiyor Topluluğu
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Kullanıcı Deneyimini Paylaş</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{productName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Rating (1 - 10) */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Genel Puanınız: <span className="text-emerald-700 font-bold text-sm">{rating} / 10</span>
            </label>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setRating(score)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${
                    rating === score
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                      : score <= rating
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation & Usage Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommendation */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Tavsiye Durumu
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRecommendation('recommend')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    recommendation === 'recommend'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>Öneririm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecommendation('neutral')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    recommendation === 'neutral'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <MinusCircle className="w-4 h-4 text-amber-600" />
                  <span>Kararsızım</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecommendation('not_recommend')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    recommendation === 'not_recommend'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>Önermem</span>
                </button>
              </div>
            </div>

            {/* Usage Duration */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Kullanım Süresi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '<1m', label: '< 1 Ay' },
                  { id: '1-6m', label: '1 - 6 Ay' },
                  { id: '6-12m', label: '6 - 12 Ay' },
                  { id: '>1y', label: '> 1 Yıl' }
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setUsageDuration(dur.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      usageDuration === dur.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              İsminiz / Takma Adınız
            </label>
            <input
              type="text"
              placeholder="Örn: Ahmet Y. (Endüstriyel Tasarımcı)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Deneyiminizi Özetleyen Başlık *
            </label>
            <input
              type="text"
              placeholder="Örn: 6 aydır günlük ana cihazım, pil performansı çok başarılı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Detaylı Kullanıcı Görüşünüz *
            </label>
            <textarea
              rows={3}
              placeholder="Hangi amaçla kullanıyorsunuz? Isınma, pil, ergonomi veya karşılaştığınız kronik bir problem oldu mu?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
              required
            />
          </div>

          {/* Pros & Cons Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div>
              <label className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1.5">
                Öne Çıkan Artılar (Opsiyonel)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Örn: Hızlı şarj, Parlak ekran"
                  value={proInput}
                  onChange={(e) => setProInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPro(e)}
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddPro()}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {pros.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {pros.map((p, idx) => (
                    <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span>+ {p}</span>
                      <button type="button" onClick={() => setPros(pros.filter((_, i) => i !== idx))} className="hover:text-rose-600 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cons */}
            <div>
              <label className="text-xs font-semibold text-rose-800 uppercase tracking-wider block mb-1.5">
                Karşılaştığınız Eksiler (Opsiyonel)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Örn: Ağır kasa, Isınma"
                  value={conInput}
                  onChange={(e) => setConInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCon(e)}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddCon()}
                  className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {cons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cons.map((c, idx) => (
                    <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                      <span>- {c}</span>
                      <button type="button" onClick={() => setCons(cons.filter((_, i) => i !== idx))} className="hover:text-rose-600 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verified Badge Checkbox */}
          <div className="flex items-center space-x-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <input
              type="checkbox"
              id="verified-buyer-check"
              checked={isVerifiedBuyer}
              onChange={(e) => setIsVerifiedBuyer(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="verified-buyer-check" className="text-xs text-emerald-950 font-medium cursor-pointer select-none">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Doğrulanmış Gerçek Kullanıcı / Alıcı Rozeti Ekle
              </span>
              <span className="text-emerald-700 block text-[11px]">
                Görüşünüz platform konsensüs algoritmasında öncelikli ağırlığa sahip olacaktır.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Kaydediliyor...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Deneyimi Yayınla & Topluluğa Katkı Sağla</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
