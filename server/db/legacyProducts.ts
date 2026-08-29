import { ProductDetailData, ProductScore } from '../../src/types/index.js';
import { calculateVerdict, calculateConfidence } from '../../src/lib/scoring.js';
import { getProductChronicAndWarranty, getProductPollStats } from './chronicAndQADatabase.js';

export interface LegacyProductSpec {
  id: string;
  name: string;
  slug: string;
  model: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  description: string;
  releaseYear: number;
  priceRange: string;
  currentPrice: number;
  overallScore: number;
  confidenceScore: number;
  positiveRatio: number;
  mentionCount: number;
  verdict: 'ALINIR' | 'DUSUNULEBILIR' | 'ALTERNATIFLERE_BAK' | 'YETERSIZ_VERI';
  verdictReason: string;
}

export const KNOWN_LEGACY_PRODUCTS: Record<string, LegacyProductSpec> = {
  'apple-iphone-12': {
    id: 'prod-iphone-12',
    name: 'Apple iPhone 12',
    slug: 'apple-iphone-12',
    model: 'iPhone 12 64GB / 128GB',
    brandId: 'brand-apple',
    brandName: 'Apple',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80',
    description: 'A14 Bionic çip, OLED Super Retina XDR ekran ve çift 12MP kamera sistemi.',
    releaseYear: 2020,
    priceRange: '22.000 TL - 26.000 TL',
    currentPrice: 24000,
    overallScore: 7.9,
    confidenceScore: 96,
    positiveRatio: 72,
    mentionCount: 6540,
    verdict: 'DUSUNULEBILIR',
    verdictReason: 'Günlük kullanım için halen yeterli hızda ancak pil sağlığı ve 60Hz ekran yeni amiral gemilerinin gerisinde kalıyor.'
  },
  'apple-iphone-13-pro': {
    id: 'prod-iphone-13-pro',
    name: 'Apple iPhone 13 Pro',
    slug: 'apple-iphone-13-pro',
    model: 'iPhone 13 Pro 128GB',
    brandId: 'brand-apple',
    brandName: 'Apple',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80',
    description: 'A15 Bionic, 120Hz ProMotion ekran, sinematik mod ve 3x optik zoom.',
    releaseYear: 2021,
    priceRange: '36.000 TL - 42.000 TL',
    currentPrice: 39000,
    overallScore: 8.5,
    confidenceScore: 95,
    positiveRatio: 78,
    mentionCount: 5200,
    verdict: 'ALINIR',
    verdictReason: '120Hz ProMotion ve güçlü pil ömrüyle halen oldukça stabil bir performans sergiliyor.'
  },
  'apple-iphone-14-pro': {
    id: 'prod-iphone-14-pro',
    name: 'Apple iPhone 14 Pro',
    slug: 'apple-iphone-14-pro',
    model: 'iPhone 14 Pro 128GB',
    brandId: 'brand-apple',
    brandName: 'Apple',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&auto=format&fit=crop&q=80',
    description: 'Dynamic Island, A16 Bionic, 48MP ana kamera ve Hep Açık Ekran (Always-on Display).',
    releaseYear: 2022,
    priceRange: '49.000 TL - 56.000 TL',
    currentPrice: 53000,
    overallScore: 8.7,
    confidenceScore: 94,
    positiveRatio: 80,
    mentionCount: 4800,
    verdict: 'ALINIR',
    verdictReason: 'Dynamic Island ve 48MP kamera kalitesiyle güncel amiral gemilerine oldukça yakın bir deneyim sunuyor.'
  },
  'samsung-galaxy-s21-ultra': {
    id: 'prod-s21-ultra',
    name: 'Samsung Galaxy S21 Ultra',
    slug: 'samsung-galaxy-s21-ultra',
    model: 'Galaxy S21 Ultra 5G 128GB/256GB',
    brandId: 'brand-samsung',
    brandName: 'Samsung',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    description: '108MP kamera, 100x Space Zoom, Exynos 2100 / Snapdragon 888 ve WQHD+ 120Hz ekran.',
    releaseYear: 2021,
    priceRange: '22.000 TL - 27.000 TL',
    currentPrice: 24500,
    overallScore: 8.0,
    confidenceScore: 94,
    positiveRatio: 74,
    mentionCount: 4100,
    verdict: 'DUSUNULEBILIR',
    verdictReason: 'Kamera ve ekran yetenekleri halen üst seviyede fakat termal yönetim ve pil tüketimi güncel modellere göre zayıf.'
  },
  'samsung-galaxy-s22-ultra': {
    id: 'prod-s22-ultra',
    name: 'Samsung Galaxy S22 Ultra',
    slug: 'samsung-galaxy-s22-ultra',
    model: 'Galaxy S22 Ultra 256GB',
    brandId: 'brand-samsung',
    brandName: 'Samsung',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    description: 'Dahili S Pen yuvası, 108MP Gece Çekimi sensörü ve Snapdragon 8 Gen 1.',
    releaseYear: 2022,
    priceRange: '32.000 TL - 38.000 TL',
    currentPrice: 35000,
    overallScore: 8.3,
    confidenceScore: 93,
    positiveRatio: 76,
    mentionCount: 3900,
    verdict: 'ALINIR',
    verdictReason: 'Entegre S Pen ve şık tasarımıyla güçlü ancak yoğun kullanımda ısınma eğilimi var.'
  },
  'apple-macbook-air-m1': {
    id: 'prod-macbook-air-m1',
    name: 'Apple MacBook Air 13" (M1)',
    slug: 'apple-macbook-air-m1',
    model: 'MacBook Air M1 8GB/256GB',
    brandId: 'brand-apple',
    brandName: 'Apple',
    categoryId: 'cat-laptops',
    categoryName: 'Dizüstü Bilgisayarlar',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description: 'Apple Silicon devrimini başlatan efsanevi fansız M1 çipli hafif dizüstü bilgisayar.',
    releaseYear: 2020,
    priceRange: '26.000 TL - 31.000 TL',
    currentPrice: 28500,
    overallScore: 9.0,
    confidenceScore: 97,
    positiveRatio: 87,
    mentionCount: 7800,
    verdict: 'ALINIR',
    verdictReason: 'Fiyat/performans oranıyla halen dünyanın en popüler dizüstü bilgisayarlarından biri.'
  },
  'apple-macbook-pro-14-m3-pro': {
    id: 'prod-macbook-pro-14-m3-pro',
    name: 'Apple MacBook Pro 14" (M3 Pro)',
    slug: 'apple-macbook-pro-14-m3-pro',
    model: 'MacBook Pro 14-inch M3 Pro 18GB/512GB',
    brandId: 'brand-apple',
    brandName: 'Apple',
    categoryId: 'cat-laptops',
    categoryName: 'Dizüstü Bilgisayarlar',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description: 'Liquid Retina XDR ekran, M3 Pro çip, 120Hz ProMotion ve profesyonel port çeşitliliği.',
    releaseYear: 2024,
    priceRange: '76.000 TL - 89.000 TL',
    currentPrice: 82000,
    overallScore: 9.4,
    confidenceScore: 95,
    positiveRatio: 89,
    mentionCount: 2200,
    verdict: 'ALINIR',
    verdictReason: 'Profesyonel video kurgusu, yazılım ve stüdyo işleri için piyasanın en verimli ve güçlü iş istasyonu.'
  },
  'sony-wh-1000xm4': {
    id: 'prod-sony-wh1000xm4',
    name: 'Sony WH-1000XM4',
    slug: 'sony-wh-1000xm4',
    model: 'WH-1000XM4 Katlanabilir ANC Kulaklık',
    brandId: 'brand-sony',
    brandName: 'Sony',
    categoryId: 'cat-audio',
    categoryName: 'Kulaklık & Ses',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    description: 'Katlanabilir gövde yapısı, QN1 gürültü engelleme işlemcisi ve 30 saat pil ömrü.',
    releaseYear: 2020,
    priceRange: '8.500 TL - 11.000 TL',
    currentPrice: 9500,
    overallScore: 8.9,
    confidenceScore: 96,
    positiveRatio: 83,
    mentionCount: 6400,
    verdict: 'ALINIR',
    verdictReason: 'Katlanabilir yapısı ve yüksek ses kalitesiyle günümüzde bile en çok tercih edilen ANC kulaklıklardan biri.'
  },
  'roborock-s5-max': {
    id: 'prod-roborock-s5-max',
    name: 'Roborock S5 Max',
    slug: 'roborock-s5-max',
    model: 'S5 Max Akıllı Robot Süpürge ve Paspas',
    brandId: 'brand-roborock',
    brandName: 'Roborock',
    categoryId: 'cat-robot-vacuums',
    categoryName: 'Robot Süpürgeler',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: '2000 Pa emiş gücü, elektronik su kontrollü paspas ve LiDAR haritalama.',
    releaseYear: 2020,
    priceRange: '12.000 TL - 15.000 TL',
    currentPrice: 13500,
    overallScore: 8.2,
    confidenceScore: 96,
    positiveRatio: 75,
    mentionCount: 5600,
    verdict: 'ALINIR',
    verdictReason: 'Robot süpürge dünyasının efsanesi, ancak istasyonsuz paspas temizliği günümüz standartlarında manuel efor gerektiriyor.'
  },
  'roborock-q-revo': {
    id: 'prod-roborock-q-revo',
    name: 'Roborock Q Revo',
    slug: 'roborock-q-revo',
    model: 'Q Revo Döner Çift Paspaslı İstasyonlu Robot Süpürge',
    brandId: 'brand-roborock',
    brandName: 'Roborock',
    categoryId: 'cat-robot-vacuums',
    categoryName: 'Robot Süpürgeler',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: '5500 Pa emiş gücü, 200 RPM döner çift paspas, sıcak hava kurutmalı tam otomatik yıkama istasyonu.',
    releaseYear: 2024,
    priceRange: '27.000 TL - 32.000 TL',
    currentPrice: 28999,
    overallScore: 9.2,
    confidenceScore: 93,
    positiveRatio: 86,
    mentionCount: 2400,
    verdict: 'ALINIR',
    verdictReason: 'Fiyat/fayda dengesi en yüksek döner paspaslı ve hepsi-bir-arada istasyonlu robot süpürge.'
  },
  'google-pixel-9-pro': {
    id: 'prod-pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    slug: 'google-pixel-9-pro',
    model: 'Google Pixel 9 Pro 128GB/256GB',
    brandId: 'brand-google',
    brandName: 'Google',
    categoryId: 'cat-phones',
    categoryName: 'Akıllı Telefonlar',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    description: 'Google Tensor G4 çip, Super Actua ekran, Gemini AI entegrasyonu ve üstün HDR fotoğraf işleme.',
    releaseYear: 2024,
    priceRange: '46.000 TL - 54.000 TL',
    currentPrice: 48500,
    overallScore: 9.0,
    confidenceScore: 89,
    positiveRatio: 82,
    mentionCount: 1600,
    verdict: 'ALINIR',
    verdictReason: 'Saf Android deneyimi, 7 yıl güncelleme garantisi ve yapay zeka fotoğrafçılığında sektör referansı.'
  }
};

export function buildLegacyProductDetail(slug: string): ProductDetailData | null {
  const spec = KNOWN_LEGACY_PRODUCTS[slug];
  if (!spec) {
    // Generate a smart synthetic profile from slug
    const cleanName = slug
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    const isPhone = slug.includes('phone') || slug.includes('galaxy') || slug.includes('pixel') || slug.includes('xiaomi');
    const isLaptop = slug.includes('macbook') || slug.includes('laptop') || slug.includes('xps') || slug.includes('zenbook');
    const isAudio = slug.includes('wh-') || slug.includes('airpods') || slug.includes('bose') || slug.includes('kulaklik');
    const isVacuum = slug.includes('roborock') || slug.includes('dyson') || slug.includes('supurge');

    const categoryId = isPhone ? 'cat-phones' : isLaptop ? 'cat-laptops' : isAudio ? 'cat-audio' : isVacuum ? 'cat-robot-vacuums' : 'cat-phones';
    const categoryName = isPhone ? 'Akıllı Telefonlar' : isLaptop ? 'Dizüstü Bilgisayarlar' : isAudio ? 'Kulaklık & Ses' : isVacuum ? 'Robot Süpürgeler' : 'Akıllı Telefonlar';

    const fallbackScore: ProductScore = {
      productId: `prod-${slug}`,
      overallScore: 8.2,
      confidenceScore: 90,
      positiveRatio: 76,
      neutralRatio: 16,
      negativeRatio: 8,
      mentionCount: 2200,
      sourceCount: 6,
      verdict: 'ALINIR',
      verdictReason: `${cleanName} modeli hakkında toplanan kullanıcı verilerine göre dengeli bir performans sunmaktadır.`,
      lastCalculatedAt: new Date().toISOString()
    };

    return {
      id: `prod-${slug}`,
      name: cleanName,
      slug: slug,
      model: `${cleanName} Standart Versiyon`,
      brandId: 'brand-other',
      brandName: cleanName.split(' ')[0] || 'Genel',
      categoryId,
      categoryName,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      description: `${cleanName} teknik özellikleri ve kullanıcı deneyimleri konsensüs analizi.`,
      releaseYear: 2021,
      priceRange: '20.000 TL - 40.000 TL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: fallbackScore,
      confidenceInfo: calculateConfidence(fallbackScore.confidenceScore),
      verdictInfo: calculateVerdict(fallbackScore.overallScore, fallbackScore.mentionCount, fallbackScore.confidenceScore, fallbackScore.positiveRatio),
      aiSummary: null,
      priceInfo: {
        currentPrice: 28000,
        currency: 'TL',
        formattedPrice: '28.000 TL',
        lowestPrice: 26000,
        highestPrice: 32000,
        fpScore: 8.2,
        fpVerdict: 'Dengeli F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 28000,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            inStock: true,
            isLowest: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: '2024-10-01', price: 29500 },
          { date: '2024-11-01', price: 28900 },
          { date: '2024-12-01', price: 28000 }
        ]
      },
      communityReviews: [],
      chronicAndWarranty: getProductChronicAndWarranty(`prod-${slug}`, cleanName),
      communityPoll: getProductPollStats(`prod-${slug}`),
      topicScores: [
        {
          productId: `prod-${slug}`,
          topicId: 'top-performance',
          topicName: 'Performans & Hız',
          score: 8.4,
          mentionCount: 820,
          positiveCount: 680,
          negativeCount: 60,
          neutralCount: 80,
          sentimentRatio: 82,
          positiveHighlights: ['Günlük görevlerde ve uygulamalarda akıcı'],
          negativeHighlights: []
        },
        {
          productId: `prod-${slug}`,
          topicId: 'top-battery',
          topicName: 'Pil & Şarj',
          score: 7.8,
          mentionCount: 640,
          positiveCount: 450,
          negativeCount: 90,
          neutralCount: 100,
          sentimentRatio: 70,
          positiveHighlights: ['Standart bir günü tamamlayabiliyor'],
          negativeHighlights: ['Eski nesil batarya ömrü zamanla düşüş gösterebilir']
        }
      ],
      mostPraisedTopics: [],
      mostCriticizedTopics: [],
      sources: [],
      mentions: [],
      alternatives: []
    };
  }

  const scoreObj: ProductScore = {
    productId: spec.id,
    overallScore: spec.overallScore,
    confidenceScore: spec.confidenceScore,
    positiveRatio: spec.positiveRatio,
    neutralRatio: 14,
    negativeRatio: Math.max(0, 100 - spec.positiveRatio - 14),
    mentionCount: spec.mentionCount,
    sourceCount: 6,
    verdict: spec.verdict,
    verdictReason: spec.verdictReason,
    lastCalculatedAt: new Date().toISOString()
  };

  return {
    id: spec.id,
    name: spec.name,
    slug: spec.slug,
    model: spec.model,
    brandId: spec.brandId,
    brandName: spec.brandName,
    categoryId: spec.categoryId,
    categoryName: spec.categoryName,
    imageUrl: spec.imageUrl,
    description: spec.description,
    releaseYear: spec.releaseYear,
    priceRange: spec.priceRange,
    createdAt: `${spec.releaseYear}-09-15T10:00:00Z`,
    updatedAt: new Date().toISOString(),
    score: scoreObj,
    confidenceInfo: calculateConfidence(spec.confidenceScore),
    verdictInfo: calculateVerdict(spec.overallScore, spec.mentionCount, spec.confidenceScore, spec.positiveRatio),
    aiSummary: null,
    priceInfo: {
      currentPrice: spec.currentPrice,
      currency: 'TL',
      formattedPrice: `${spec.currentPrice.toLocaleString('tr-TR')} TL`,
      lowestPrice: Math.round(spec.currentPrice * 0.92),
      highestPrice: Math.round(spec.currentPrice * 1.15),
      fpScore: 8.4,
      fpVerdict: 'İyi F/P',
      offers: [
        {
          storeName: 'Amazon TR',
          price: spec.currentPrice,
          currency: 'TL',
          url: 'https://www.amazon.com.tr',
          inStock: true,
          isLowest: true,
          shippingInfo: 'Ücretsiz Kargo',
          sellerRating: 4.9
        }
      ],
      history: [
        { date: '2024-10-01', price: Math.round(spec.currentPrice * 1.05) },
        { date: '2024-11-01', price: Math.round(spec.currentPrice * 1.02) },
        { date: '2024-12-01', price: spec.currentPrice }
      ]
    },
    communityReviews: [],
    chronicAndWarranty: getProductChronicAndWarranty(spec.id, spec.name),
    communityPoll: getProductPollStats(spec.id),
    topicScores: [
      {
        productId: spec.id,
        topicId: 'top-performance',
        topicName: 'Performans & Hız',
        score: spec.overallScore,
        mentionCount: Math.round(spec.mentionCount * 0.4),
        positiveCount: Math.round(spec.mentionCount * 0.32),
        negativeCount: Math.round(spec.mentionCount * 0.04),
        neutralCount: Math.round(spec.mentionCount * 0.04),
        sentimentRatio: spec.positiveRatio,
        positiveHighlights: [`${spec.name} donanım ve yazılım uyumu tatmin edici.`],
        negativeHighlights: []
      }
    ],
    mostPraisedTopics: [],
    mostCriticizedTopics: [],
    sources: [],
    mentions: [],
    alternatives: []
  };
}
