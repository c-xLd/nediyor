import React, { useState } from 'react';
import { 
  Vote, 
  ThumbsUp, 
  Clock, 
  ThumbsDown, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { ProductDetailData, CommunityPollStats } from '../../types/index.js';
import { Button } from '../ui/Button.js';
import { useToast } from '../ui/Toast.js';
import { Link } from '../../lib/router.js';

interface CommunityPulsePollProps {
  product: ProductDetailData;
}

export const CommunityPulsePoll: React.FC<CommunityPulsePollProps> = ({ product }) => {
  const initialPoll = product.communityPoll || {
    productId: product.id,
    totalVotes: 1240,
    buyCount: 840,
    waitCount: 280,
    skipCount: 120,
    buyPercentage: 68,
    waitPercentage: 22,
    skipPercentage: 10,
    communityVerdict: 'Topluluk "Kesinlikle Alınır" Diyor'
  };

  const storageKey = `nediyor_poll_vote_${product.id}`;
  const savedVote = typeof window !== 'undefined' ? localStorage.getItem(storageKey) as ('buy' | 'wait' | 'skip' | null) : null;

  const [poll, setPoll] = useState<CommunityPollStats>({
    ...initialPoll,
    userVotedChoice: (savedVote || undefined)
  });
  const [hasVoted, setHasVoted] = useState<boolean>(!!savedVote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleVote = async (choice: 'buy' | 'wait' | 'skip') => {
    if (hasVoted) {
      showToast('Bu ürün için zaten oy kullandınız.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await api.votePoll(product.slug, choice);
      setPoll(updated);
      setHasVoted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, choice);
      }
      showToast('Oyunuz kaydedildi, teşekkürler!', 'success');
    } catch (err: any) {
      console.error('Vote error:', err);
      // Optimistic fallback if network error
      const updatedBuy = choice === 'buy' ? poll.buyCount + 1 : poll.buyCount;
      const updatedWait = choice === 'wait' ? poll.waitCount + 1 : poll.waitCount;
      const updatedSkip = choice === 'skip' ? poll.skipCount + 1 : poll.skipCount;
      const total = updatedBuy + updatedWait + updatedSkip;
      setPoll({
        ...poll,
        totalVotes: total,
        buyCount: updatedBuy,
        waitCount: updatedWait,
        skipCount: updatedSkip,
        buyPercentage: Math.round((updatedBuy / total) * 100),
        waitPercentage: Math.round((updatedWait / total) * 100),
        skipPercentage: Math.round((updatedSkip / total) * 100),
        userVotedChoice: choice
      });
      setHasVoted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, choice);
      }
      showToast('Oyunuz yerel olarak kaydedildi.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPriceFormatted = product.priceInfo?.formattedPrice || 'Mevcut Fiyatıyla';

  return (
    <div id="topluluk-oylamasi" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                Satın Alınır mı? Canlı Topluluk Nabzı
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800">
                Canlı Oylama
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toplam <span className="font-bold text-slate-700">{poll.totalVotes.toLocaleString('tr-TR')}</span> doğrulanmış kullanıcı oyunun dağılımı.
            </p>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>{poll.communityVerdict}</span>
        </div>
      </div>

      {/* Question Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-500 block">Soru:</span>
          <span className="text-sm font-bold text-slate-900">
            "{currentPriceFormatted} fiyatıyla bu ürünü satın alır mısınız?"
          </span>
        </div>
        {hasVoted && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Oyunuz Kaydedildi</span>
          </div>
        )}
      </div>

      {/* Voting Buttons / Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Choice 1: Buy */}
        <button
          type="button"
          onClick={() => handleVote('buy')}
          disabled={hasVoted || isSubmitting}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            poll.userVotedChoice === 'buy'
              ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-emerald-700 font-['Space_Grotesk']">
              %{poll.buyPercentage}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900 block">Kesinlikle Alınır</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Fiyatını fazlasıyla hak ediyor</span>
        </button>

        {/* Choice 2: Wait */}
        <button
          type="button"
          onClick={() => handleVote('wait')}
          disabled={hasVoted || isSubmitting}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            poll.userVotedChoice === 'wait'
              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-amber-700 font-['Space_Grotesk']">
              %{poll.waitPercentage}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900 block">İndirim Beklenmeli</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Biraz pahalı, kampanya beklenmeli</span>
        </button>

        {/* Choice 3: Skip */}
        <button
          type="button"
          onClick={() => handleVote('skip')}
          disabled={hasVoted || isSubmitting}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            poll.userVotedChoice === 'skip'
              ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
              : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ThumbsDown className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-rose-700 font-['Space_Grotesk']">
              %{poll.skipPercentage}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900 block">Bu Fiyata Alınmaz</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Alternatif modellere bakılmalı</span>
        </button>
      </div>

      {/* Progress Bar Distribution */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
          <div 
            style={{ width: `${poll.buyPercentage}%` }} 
            className="h-full bg-emerald-500 transition-all duration-500" 
            title={`Alınır: %${poll.buyPercentage}`} 
          />
          <div 
            style={{ width: `${poll.waitPercentage}%` }} 
            className="h-full bg-amber-400 transition-all duration-500" 
            title={`Bekle: %${poll.waitPercentage}`} 
          />
          <div 
            style={{ width: `${poll.skipPercentage}%` }} 
            className="h-full bg-rose-500 transition-all duration-500" 
            title={`Alınmaz: %${poll.skipPercentage}`} 
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Kesinlikle Alınır (%{poll.buyPercentage})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            İndirim Bekle (%{poll.waitPercentage})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Alternatife Bak (%{poll.skipPercentage})
          </span>
        </div>
      </div>
    </div>
  );
};
