import React, { useState } from 'react';
import { 
  Users, 
  MessageSquarePlus, 
  ShieldCheck, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Check, 
  Filter, 
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';
import { CommunityReview } from '../../types/index.js';
import { AddReviewModal } from './AddReviewModal.js';
import { api } from '../../lib/api.js';

interface CommunityReviewsSectionProps {
  productSlug: string;
  productName: string;
  reviews?: CommunityReview[];
}

export const CommunityReviewsSection: React.FC<CommunityReviewsSectionProps> = ({
  productSlug,
  productName,
  reviews: initialReviews = []
}) => {
  const [reviews, setReviews] = useState<CommunityReview[]>(initialReviews);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'long_term' | 'verified' | 'high_rating'>('all');
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  const handleReviewAdded = (newReview: CommunityReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleVoteHelpful = async (reviewId: string) => {
    if (votedReviews[reviewId]) return;

    // Optimistic update
    setVotedReviews(prev => ({ ...prev, [reviewId]: true }));
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );

    try {
      await api.voteReviewHelpful(reviewId);
    } catch (err) {
      console.error('Helpful vote failed:', err);
    }
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const recommendCount = reviews.filter(r => r.recommendation === 'recommend').length;
  const recommendRate = totalReviews > 0 ? Math.round((recommendCount / totalReviews) * 100) : 95;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '9.2';
  const verifiedCount = reviews.filter(r => r.isVerifiedBuyer).length;

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (activeFilter === 'long_term') {
      return r.usageDuration === '6-12m' || r.usageDuration === '>1y';
    }
    if (activeFilter === 'verified') {
      return r.isVerifiedBuyer;
    }
    if (activeFilter === 'high_rating') {
      return r.rating >= 9;
    }
    return true;
  });

  const getDurationLabel = (dur: string) => {
    switch (dur) {
      case '<1m': return '1 aydan az kullandı';
      case '1-6m': return '1 - 6 ay kullandı';
      case '6-12m': return '6 - 12 ay kullandı';
      case '>1y': return '1 yıldan uzun kullandı';
      default: return dur;
    }
  };

  return (
    <div id="community-reviews-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Doğrulanmış Topluluk Deneyimleri
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                {totalReviews} Gerçek İnceleme
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Cihazı bizzat satın alıp aylarca kullanan NeDiyor kullanıcılarının tarafsız geri bildirimleri
            </p>
          </div>
        </div>

        {/* Add Review Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs group"
        >
          <MessageSquarePlus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Deneyimini Paylaş</span>
        </button>
      </div>

      {/* Community Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-11 h-11 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold text-base">
            %{recommendRate}
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Tavsiye Oranı</span>
            <span className="text-sm font-bold text-slate-900">Kullanıcılar Öneriyor</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
          <div className="w-11 h-11 rounded-xl bg-teal-100/70 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-base">
            {avgRating}
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Ortalama Puan</span>
            <span className="text-sm font-bold text-slate-900">10 Üzerinden Memnuniyet</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
          <div className="w-11 h-11 rounded-xl bg-indigo-100/70 border border-indigo-200 text-indigo-700 flex items-center justify-center font-extrabold text-base">
            {verifiedCount}
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Doğrulanmış Alıcı</span>
            <span className="text-sm font-bold text-slate-900">Fatura/Sipariş Onaylı</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Filtrele:
        </span>
        {[
          { id: 'all', label: 'Tümü' },
          { id: 'long_term', label: 'Uzun Süreli Kullanıcılar (6+ Ay)' },
          { id: 'verified', label: 'Sadece Doğrulanmış Alıcılar' },
          { id: 'high_rating', label: '9+ Puan Verenler' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/80">
            <p className="text-sm text-slate-500">Seçilen filtrede henüz kullanıcı yorumu bulunmuyor.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-slate-200/80 transition-colors space-y-3"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{review.authorName}</span>
                      {review.isVerifiedBuyer && (
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                          Doğrulanmış Alıcı
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getDurationLabel(review.usageDuration)}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Recommendation Badge */}
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    review.recommendation === 'recommend'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : review.recommendation === 'neutral'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {review.recommendation === 'recommend' ? '✓ Tavsiye Ediyor' : review.recommendation === 'neutral' ? 'Kararsız' : '✗ Tavsiye Etmiyor'}
                  </span>
                  <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white shadow-2xs">
                    {review.rating}/10
                  </div>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{review.title}</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{review.content}</p>
              </div>

              {/* Pros & Cons Tags */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {review.pros.map((pro, pIdx) => (
                    <span key={pIdx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100/60 text-emerald-800 border border-emerald-200/80">
                      + {pro}
                    </span>
                  ))}
                  {review.cons.map((con, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100/60 text-rose-800 border border-rose-200/80">
                      - {con}
                    </span>
                  ))}
                </div>
              )}

              {/* Helpful vote action */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Bu değerlendirme size yardımcı oldu mu?</span>
                <button
                  type="button"
                  onClick={() => handleVoteHelpful(review.id)}
                  disabled={votedReviews[review.id]}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    votedReviews[review.id]
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 cursor-default'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${votedReviews[review.id] ? 'text-emerald-600 fill-emerald-600' : 'text-slate-500'}`} />
                  <span>Faydalı Buldum ({review.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        productSlug={productSlug}
        productName={productName}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};
