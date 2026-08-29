import { VerdictType } from '../types/index.js';

export interface VerdictResult {
  status: VerdictType;
  label: string;
  variant: 'positive' | 'warning' | 'negative' | 'neutral';
  description: string;
}

export interface ConfidenceResult {
  level: 'Yüksek' | 'Orta' | 'Düşük';
  score: number;
  color: string;
  bgBadge: string;
  borderBadge: string;
  description: string;
}

/**
 * Deterministic verdict evaluation based on score and consensus
 */
export function calculateVerdict(
  score: number | null | undefined,
  mentionCount: number = 0,
  confidence: number = 0,
  positiveRatio: number = 0
): VerdictResult {
  if (score === null || score === undefined || mentionCount < 5 || confidence < 30) {
    return {
      status: 'YETERSIZ_VERI',
      label: 'Yeterli Veri Yok',
      variant: 'neutral',
      description: 'Bu ürün için henüz güvenilir bir tavsiye oluşturmaya yetecek kadar doğrulanmış kullanıcı görüşü bulunmuyor.'
    };
  }

  if (score >= 8.0 && positiveRatio >= 65) {
    return {
      status: 'ALINIR',
      label: 'Alınır',
      variant: 'positive',
      description: 'Kullanıcı memnuniyeti çok yüksek. Kronik bir arıza veya memnuniyetsizlik bildirilmemiş, beklentileri karşılıyor.'
    };
  }

  if (score >= 6.5) {
    return {
      status: 'DUSUNULEBILIR',
      label: 'Düşünülebilir',
      variant: 'warning',
      description: 'Genel deneyim olumlu ancak kullanıcıların belirttiği kullanım senaryosu veya fiyat kısıtları göz önünde bulundurulmalı.'
    };
  }

  return {
    status: 'ALTERNATIFLERE_BAK',
    label: 'Alternatiflere Bak',
    variant: 'negative',
    description: 'Olumsuz bildirim, donanım/yazılım şikayetleri veya fiyat/fayda dengesizliği yüksek. Benzer alternatifler tercih edilebilir.'
  };
}

/**
 * Centralized confidence level calculation
 */
export function calculateConfidence(confidence: number): ConfidenceResult {
  if (confidence >= 80) {
    return {
      level: 'Yüksek',
      score: confidence,
      color: 'text-emerald-400',
      bgBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      borderBadge: 'border-emerald-500/30',
      description: 'Çok sayıda bağımsız kaynak ve yüksek hacimli kullanıcı deneyimi analiz edildi.'
    };
  }

  if (confidence >= 50) {
    return {
      level: 'Orta',
      score: confidence,
      color: 'text-amber-400',
      bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      borderBadge: 'border-amber-500/30',
      description: 'Belirli kaynaklardan yeterli veri toplandı, analiz güvenilir seviyede.'
    };
  }

  return {
    level: 'Düşük',
    score: confidence,
    color: 'text-rose-400',
    bgBadge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    borderBadge: 'border-rose-500/30',
    description: 'Görüş ve kaynak sayısı sınırlı; veri toplama ve analiz süreci devam ediyor.'
  };
}

/**
 * Score formatter
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '-';
  return score.toFixed(1);
}

/**
 * Number formatter for Turkish locale (e.g. 1.420)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num);
}

/**
 * Human readable verdict label
 */
export function getVerdictText(verdict: VerdictType | string): string {
  switch (verdict) {
    case 'ALINIR':
      return 'Alınır';
    case 'DUSUNULEBILIR':
      return 'Düşünülebilir';
    case 'ALTERNATIFLERE_BAK':
    case 'ALTERNATIFE_BAK':
      return 'Alternatiflere Bak';
    default:
      return 'İnceleniyor';
  }
}

/**
 * Score badge color classes
 */
export function getScoreBadgeColor(score: number): string {
  if (score >= 8.0) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 6.5) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
}

/**
 * Score background fill class
 */
export function getScoreBgClass(score: number): string {
  if (score >= 8.0) return 'bg-emerald-500';
  if (score >= 6.5) return 'bg-amber-500';
  return 'bg-rose-500';
}
