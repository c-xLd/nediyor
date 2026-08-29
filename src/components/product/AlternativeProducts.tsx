import React from 'react';
import { Shuffle, ArrowRight, Scale, Tag, Sparkles } from 'lucide-react';
import { Product, ProductScore } from '../../types/index.js';
import { Link } from '../../lib/router.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { formatScore } from '../../lib/scoring.js';

export interface AlternativeProductsProps {
  currentProductSlug: string;
  alternatives: (Product & { score?: ProductScore | null; reason?: string })[];
  className?: string;
}

export const AlternativeProducts: React.FC<AlternativeProductsProps> = ({
  currentProductSlug,
  alternatives,
  className = ''
}) => {
  if (alternatives.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Alternatif ve Rakip Segment Ürünleri
            </h3>
            <p className="text-xs text-slate-500">
              Aynı bütçe ve donanım sınıfındaki en güçlü rakiplerin konsensüs karşılaştırması
            </p>
          </div>
        </div>
        <Badge variant="indigo" size="sm">
          {alternatives.length} Alternatif
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {alternatives.map(alt => (
          <div
            key={alt.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between group shadow-xs hover:shadow-lg hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                  {alt.brandName}
                </span>
                {alt.score && alt.score.overallScore ? (
                  <Badge
                    variant={alt.score.overallScore >= 8.0 ? 'emerald' : 'amber'}
                    size="sm"
                    className="font-extrabold"
                  >
                    ★ {formatScore(alt.score.overallScore)} / 10
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Puan yok
                  </Badge>
                )}
              </div>

              <Link href={`/urun/${alt.slug}`} className="block aspect-4/3 overflow-hidden rounded-xl bg-slate-50 p-3 mb-3.5 border border-slate-100 relative flex items-center justify-center">
                {alt.imageUrl ? (
                  <img
                    src={alt.imageUrl}
                    alt={alt.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Tag className="w-6 h-6" />
                  </div>
                )}
              </Link>

              <Link href={`/urun/${alt.slug}`} className="block group-hover:text-indigo-600 transition-colors">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-['Space_Grotesk'] line-clamp-1">
                  {alt.name}
                </h4>
              </Link>

              {alt.reason && (
                <p className="text-xs text-slate-700 mt-2 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                  "{alt.reason}"
                </p>
              )}
            </div>

            {/* Actions: View or Compare */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link href={`/karsilastir?p1=${currentProductSlug}&p2=${alt.slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Scale className="w-3.5 h-3.5 text-indigo-600" />}
                  className="text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600"
                >
                  Karşılaştır
                </Button>
              </Link>

              <Link href={`/urun/${alt.slug}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold"
                >
                  İncele
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
