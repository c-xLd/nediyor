import React, { useState, useMemo } from 'react';
import { MessageSquare, Quote, ThumbsUp, ThumbsDown, Minus, Search, Sparkles, Filter } from 'lucide-react';
import { Mention, SentimentType } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';

export interface MentionsListProps {
  mentions: Mention[];
  className?: string;
}

export const MentionsList: React.FC<MentionsListProps> = ({ mentions, className = '' }) => {
  const [filterSentiment, setFilterSentiment] = useState<SentimentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (mentions.length === 0) {
    return null;
  }

  const filteredMentions = useMemo(() => {
    return mentions.filter(m => {
      const matchSentiment = filterSentiment === 'ALL' || m.sentiment === filterSentiment;
      const matchSearch =
        !searchQuery.trim() ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.sourceName && m.sourceName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.topicName && m.topicName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSentiment && matchSearch;
    });
  }, [mentions, filterSentiment, searchQuery]);

  const getSentimentBadge = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'POSITIVE':
        return (
          <Badge variant="emerald" size="sm" className="font-bold">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Olumlu
          </Badge>
        );
      case 'NEGATIVE':
        return (
          <Badge variant="rose" size="sm" className="font-bold">
            <ThumbsDown className="w-3 h-3 mr-1" />
            Eleştiri
          </Badge>
        );
      default:
        return (
          <Badge variant="amber" size="sm" className="font-bold">
            <Minus className="w-3 h-3 mr-1" />
            Nötr
          </Badge>
        );
    }
  };

  const positiveCount = mentions.filter(m => m.sentiment === 'POSITIVE').length;
  const negativeCount = mentions.filter(m => m.sentiment === 'NEGATIVE').length;
  const neutralCount = mentions.filter(m => m.sentiment === 'NEUTRAL').length;

  return (
    <div className={`rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm ${className}`}>
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Doğrulanmış Kullanıcı Deneyimleri & Alıntılar
            </h3>
            <p className="text-xs text-slate-500">
              Forumlar, e-ticaret ve sosyal topluluklardan derlenen gerçek kullanıcı geri bildirimleri
            </p>
          </div>
        </div>

        {/* Filter controls container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Quote search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Yorumlarda ara..."
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setFilterSentiment('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterSentiment === 'ALL' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({mentions.length})
            </button>
            <button
              onClick={() => setFilterSentiment('POSITIVE')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                filterSentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Olumlu ({positiveCount})
            </button>
            <button
              onClick={() => setFilterSentiment('NEGATIVE')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                filterSentiment === 'NEGATIVE' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eleştiri ({negativeCount})
            </button>
          </div>
        </div>
      </div>

      {/* Mentions Cards */}
      <div className="space-y-3.5">
        {filteredMentions.length > 0 ? (
          filteredMentions.map(mention => (
            <div
              key={mention.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200">
                    {mention.sourceName}
                  </span>
                  {mention.topicName && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {mention.topicName}
                    </span>
                  )}
                </div>
                <div>{getSentimentBadge(mention.sentiment)}</div>
              </div>

              <div className="relative pl-3 border-l-2 border-indigo-500">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  "{mention.content}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 font-medium">
                <span className="font-mono">{mention.author ? `@${mention.author}` : 'Doğrulanmış Kullanıcı'}</span>
                <span>{new Date(mention.publishDate).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            Arama kriterine uygun kullanıcı yorumu bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
