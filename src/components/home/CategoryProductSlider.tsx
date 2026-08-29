import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Layers, Smartphone, Laptop, Headphones, Watch, Camera, Tv } from 'lucide-react';
import { Product, ProductScore, Category } from '../../types/index.js';
import { ProductCard } from '../product/ProductCard.js';
import { Link } from '../../lib/router.js';

interface CategoryProductSliderProps {
  category: Category;
  products: (Product & { score?: ProductScore | null })[];
}

export const CategoryProductSlider: React.FC<CategoryProductSliderProps> = ({
  category,
  products
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('telefon')) return <Smartphone className="w-4 h-4 text-indigo-600" />;
    if (slug.includes('bilgisayar') || slug.includes('laptop')) return <Laptop className="w-4 h-4 text-violet-600" />;
    if (slug.includes('kulaklik') || slug.includes('ses')) return <Headphones className="w-4 h-4 text-emerald-600" />;
    if (slug.includes('saat')) return <Watch className="w-4 h-4 text-amber-600" />;
    if (slug.includes('kamera') || slug.includes('fotograf')) return <Camera className="w-4 h-4 text-rose-600" />;
    if (slug.includes('televizyon') || slug.includes('tv')) return <Tv className="w-4 h-4 text-sky-600" />;
    return <Layers className="w-4 h-4 text-indigo-600" />;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Category Header with Title, Count and Slider Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            {getCategoryIcon(category.slug)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] truncate">
                {category.name}
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70 hidden sm:inline-block">
                {products.length} Model
              </span>
            </div>
          </div>
        </div>

        {/* Action: Link to category & Slider Navigation Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/ara?category=${category.slug}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
              title="Önceki Ürünler"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
              title="Sonraki Ürünler"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[270px] sm:min-w-[290px] md:min-w-[310px] max-w-[310px] shrink-0 snap-start flex flex-col"
          >
            <ProductCard product={product} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
