import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Category, Brand, AvailableFeatureFacet } from '../../types/index.js';

interface ActiveFilterChipsProps {
  category: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minScore?: number;
  verdicts: string[];
  minPositive?: number;
  minMentions?: number;
  discountOnly?: boolean;
  features: string[];
  categoriesList: Category[];
  brandsList: Brand[];
  featuresList: AvailableFeatureFacet[];
  onRemoveFilter: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  category,
  brands,
  minPrice,
  maxPrice,
  minScore,
  verdicts,
  minPositive,
  minMentions,
  discountOnly,
  features,
  categoriesList,
  brandsList,
  featuresList,
  onRemoveFilter,
  onClearAll
}) => {
  const chips: { key: string; label: string; value?: string }[] = [];

  // Category
  if (category && category !== 'all') {
    const catObj = categoriesList.find(c => c.slug === category || c.id === category);
    chips.push({
      key: 'category',
      label: `Kategori: ${catObj ? catObj.name : category}`
    });
  }

  // Brands
  for (const b of brands) {
    const brandObj = brandsList.find(brand => brand.slug === b || brand.id === b);
    chips.push({
      key: 'brand',
      value: b,
      label: `Marka: ${brandObj ? brandObj.name : b}`
    });
  }

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    let priceLabel = 'Fiyat: ';
    if (minPrice !== undefined && maxPrice !== undefined) {
      priceLabel += `${minPrice.toLocaleString('tr-TR')} ₺ - ${maxPrice.toLocaleString('tr-TR')} ₺`;
    } else if (minPrice !== undefined) {
      priceLabel += `${minPrice.toLocaleString('tr-TR')} ₺+`;
    } else if (maxPrice !== undefined) {
      priceLabel += `≤ ${maxPrice.toLocaleString('tr-TR')} ₺`;
    }
    chips.push({
      key: 'price',
      label: priceLabel
    });
  }

  // Min Score
  if (minScore !== undefined && minScore > 0) {
    chips.push({
      key: 'minScore',
      label: `Puan: ≥ ${minScore.toFixed(1)}`
    });
  }

  // Verdicts
  for (const v of verdicts) {
    let vText = v;
    if (v === 'ALINIR') vText = 'Karar: Alınır';
    else if (v === 'DUSUNULEBILIR') vText = 'Karar: Düşünülebilir';
    else if (v === 'ALTERNATIFLERE_BAK' || v === 'ALTERNATIFE_BAK') vText = 'Karar: Alternatif Ara';

    chips.push({
      key: 'verdict',
      value: v,
      label: vText
    });
  }

  // Sentiment
  if (minPositive !== undefined && minPositive > 0) {
    chips.push({
      key: 'minPositive',
      label: `Memnuniyet: ≥ %${minPositive}`
    });
  }

  // Mentions
  if (minMentions !== undefined && minMentions > 0) {
    chips.push({
      key: 'minMentions',
      label: `Yorum: ≥ ${minMentions.toLocaleString('tr-TR')}`
    });
  }

  // Discount
  if (discountOnly) {
    chips.push({
      key: 'discountOnly',
      label: '🔥 Sadece İndirimli / F/P'
    });
  }

  // Features
  for (const f of features) {
    const featObj = featuresList.find(item => item.id === f);
    chips.push({
      key: 'feature',
      value: f,
      label: featObj ? featObj.label : f
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-bold text-slate-400 mr-1">Aktif Filtreler ({chips.length}):</span>
      {chips.map((chip, idx) => (
        <span
          key={`${chip.key}-${chip.value || idx}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-2xs hover:bg-indigo-100 transition-colors"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="w-4 h-4 rounded-full flex items-center justify-center text-indigo-400 hover:text-indigo-800 hover:bg-indigo-200/60 transition-colors"
            title="Filtreyi Kaldır"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors ml-auto sm:ml-2"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Tümünü Temizle</span>
      </button>
    </div>
  );
};
