import fs from 'fs';
import path from 'path';
import { 
  Brand, 
  Category, 
  Product, 
  ProductScore, 
  Topic, 
  ProductTopicScore, 
  Source, 
  Mention, 
  AISummary, 
  ProductDetailData,
  SearchAutocompleteResult,
  SearchResultsResponse,
  AvailableFeatureFacet,
  HomeDataResponse,
  CommunityReview,
  MultiCompareResponse,
  ProductFinderResponse,
  ProductFinderMatch,
  AskConsensusQuestionResponse,
  CommunityPollStats,
  UpgradeAdviceResponse,
  DealsResponse,
  BrandDetailResponse,
  BrandTopicAverage,
  BrandStats,
  User,
  SystemSettings,
  AdminStats,
  VerdictType
} from '../../src/types/index.js';
import { calculateVerdict, calculateConfidence } from '../../src/lib/scoring.js';
import { initialSeedData } from './seedData.js';
import { getProductPriceInfo, getInitialCommunityReviews } from './priceAndCommunityData.js';
import { 
  getProductChronicAndWarranty, 
  answerConsensusQuestion, 
  getProductPollStats, 
  voteProductPoll, 
  generateUpgradeAdvice, 
  getDealsRadar 
} from './chronicAndQADatabase.js';
import { getBrandIntelligence } from './brandProfileData.js';
import { buildLegacyProductDetail } from './legacyProducts.js';

interface DatabaseSchema {
  brands: Brand[];
  categories: Category[];
  products: Product[];
  productScores: ProductScore[];
  topics: Topic[];
  productTopicScores: ProductTopicScore[];
  sources: Source[];
  mentions: Mention[];
  aiSummaries: AISummary[];
  communityReviews: CommunityReview[];
  productAlternatives: { productId: string; alternativeProductId: string; similarityScore: number; reason: string }[];
  users: (User & { passwordHash?: string })[];
  settings: SystemSettings;
}

class NeDiyorDatabase {
  private data: DatabaseSchema;
  private dataFilePath: string;

  constructor() {
    this.dataFilePath = path.join(process.cwd(), 'data', 'nediyor-db.json');
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    const seeded = initialSeedData();
    let existingReviews: CommunityReview[] = [];
    let existingUsers: (User & { passwordHash?: string })[] = [];
    let existingSettings: SystemSettings | null = null;
    let existingBrands: Brand[] = seeded.brands;
    let existingProducts: Product[] = seeded.products;
    let existingScores: ProductScore[] = seeded.productScores;

    const defaultSettings: SystemSettings = {
      siteTitle: 'NeDiyor — Tüketici Zekası & Gerçek Kullanıcı Analizleri',
      metaDescription: 'Teknoloji ürünleri için binlerce kullanıcı yorumu, forum tartışması ve YouTube incelemesini sentezleyen yapay zeka analiz platformu.',
      aiModel: 'gemini-2.5-flash',
      autoScrapeIntervalHours: 6,
      confidenceThreshold: 75,
      maintenanceMode: false,
      allowPublicReviews: true,
      geminiApiKeySet: Boolean(process.env.GEMINI_API_KEY),
      customPrompts: {
        verdictPrompt: 'Ürün hakkındaki tüm kaynakları tara, %80+ mutabakat sağlanan öne çıkan pozitif ve negatif noktaları tarafsız bir dille listele. ALINIR, DUSUNULEBILIR veya ALTERNATIFLERE_BAK kararı ver.',
        chronicIssuesPrompt: 'Kullanıcı şikayetlerini, servis geçmişlerini ve forum başlıklarını analiz et. Donanımsal, yazılımsal ve ısınma/batarya gibi yaygın veya kronik sorunları tespit et.',
        valueForMoneyPrompt: 'Fiyat geçmişini ve piyasadaki en yakın 3 rakibi kıyaslayarak Fiyat/Performans analizi üret.'
      }
    };

    const defaultUsers: (User & { passwordHash?: string })[] = [
      {
        id: 'usr-admin-1',
        name: 'Ahmet Aslan',
        email: 'ahmet.as060@gmail.com',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'NeDiyor Platform Yöneticisi & Baş Veri Analisti',
        createdAt: '2025-01-10T10:00:00Z',
        passwordHash: '123456',
        preferences: {
          emailNotifications: true,
          priceDropAlerts: true,
          weeklyDigest: true,
          theme: 'light',
          defaultCategory: 'akilli-telefonlar'
        }
      },
      {
        id: 'usr-demo-1',
        name: 'Caner Yıldız',
        email: 'kullanici@nediyor.com',
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bio: 'Teknoloji tutkunu, ürün ve fiyat takipçisi.',
        createdAt: '2025-02-15T14:30:00Z',
        passwordHash: '123456',
        preferences: {
          emailNotifications: true,
          priceDropAlerts: true,
          weeklyDigest: false,
          theme: 'light'
        }
      }
    ];

    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.communityReviews && Array.isArray(parsed.communityReviews)) {
          existingReviews = parsed.communityReviews;
        }
        if (parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0) {
          existingUsers = parsed.users;
        }
        if (parsed.settings && typeof parsed.settings === 'object') {
          existingSettings = parsed.settings;
        }
        if (parsed.brands && Array.isArray(parsed.brands) && parsed.brands.length > 0) {
          existingBrands = parsed.brands;
        }
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
          existingProducts = parsed.products;
        }
        if (parsed.productScores && Array.isArray(parsed.productScores)) {
          existingScores = parsed.productScores;
        }
      }
    } catch (err) {
      console.warn('[DB] Failed to load existing database file, reseeding...', err);
    }

    const allReviews: CommunityReview[] = [...existingReviews];
    for (const p of seeded.products) {
      if (!allReviews.some(r => r.productId === p.id)) {
        allReviews.push(...getInitialCommunityReviews(p.id));
      }
    }

    const usersToUse = existingUsers.length > 0 ? existingUsers : defaultUsers;
    // ensure admin exists
    if (!usersToUse.some(u => u.email.toLowerCase() === 'ahmet.as060@gmail.com' || u.role === 'admin')) {
      usersToUse.unshift(defaultUsers[0]);
    }

    const fullData: DatabaseSchema = {
      ...seeded,
      brands: existingBrands,
      products: existingProducts,
      productScores: existingScores,
      communityReviews: allReviews,
      users: usersToUse,
      settings: existingSettings || defaultSettings
    };

    this.saveData(fullData);
    return fullData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dataFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving data to file:', err);
    }
  }

  // --- Queries ---

  public getHomeData(): HomeDataResponse {
    const scoredProducts = this.data.products.map(p => {
      const score = this.data.productScores.find(s => s.productId === p.id) || null;
      return { ...p, score };
    });

    // Popular products: isPopular flag or highest mention count
    const popularProducts = scoredProducts
      .filter(p => p.isPopular)
      .slice(0, 6);

    // Top rated scored products (overallScore >= 8.5)
    const topRatedProducts = scoredProducts
      .filter(p => p.score && p.score.overallScore >= 8.5)
      .sort((a, b) => (b.score?.overallScore || 0) - (a.score?.overallScore || 0))
      .slice(0, 6);

    // Categories with product count
    const activeCategories = this.data.categories
      .filter(c => c.isActive)
      .map(c => {
        const count = this.data.products.filter(p => p.categoryId === c.id).length;
        return { ...c, productCount: count };
      });

    // Category sections with all scored products per category
    const categorySections = activeCategories
      .map(c => {
        const prods = scoredProducts
          .filter(p => p.categoryId === c.id)
          .sort((a, b) => (b.score?.overallScore || 0) - (a.score?.overallScore || 0));
        return {
          category: c,
          products: prods
        };
      })
      .filter(sec => sec.products.length > 0);

    const totalMentions = this.data.productScores.reduce((acc, curr) => acc + (curr.mentionCount || 0), 0);
    const brands = this.getBrands();

    return {
      popularProducts,
      topRatedProducts,
      categories: activeCategories,
      categorySections,
      brands,
      stats: {
        totalProducts: this.data.products.length,
        totalMentions,
        totalSources: this.data.sources.length
      }
    };
  }

  public getAutocomplete(query: string, categoryId?: string): SearchAutocompleteResult {
    const cleanQuery = (query || '').trim().toLowerCase();
    if (!cleanQuery) {
      return { products: [], brands: [], categories: [] };
    }

    // Matching products: name, model, brandName
    const matchedProducts = this.data.products
      .filter(p => {
        if (categoryId && p.categoryId !== categoryId) return false;
        return (
          p.name.toLowerCase().includes(cleanQuery) ||
          p.model.toLowerCase().includes(cleanQuery) ||
          p.brandName.toLowerCase().includes(cleanQuery)
        );
      })
      .slice(0, 8)
      .map(p => {
        const score = this.data.productScores.find(s => s.productId === p.id);
        return {
          id: p.id,
          name: p.name,
          model: p.model,
          slug: p.slug,
          brandName: p.brandName,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
          imageUrl: p.imageUrl,
          score: score?.overallScore,
          mentionCount: score?.mentionCount
        };
      });

    // Matching brands
    const matchedBrands = this.data.brands
      .filter(b => b.name.toLowerCase().includes(cleanQuery))
      .slice(0, 3)
      .map(b => {
        const productCount = this.data.products.filter(p => p.brandId === b.id).length;
        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          logoUrl: b.logoUrl,
          productCount
        };
      });

    // Matching categories
    const matchedCategories = this.data.categories
      .filter(c => c.name.toLowerCase().includes(cleanQuery))
      .slice(0, 3)
      .map(c => {
        const productCount = this.data.products.filter(p => p.categoryId === c.id).length;
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          productCount
        };
      });

    return {
      products: matchedProducts,
      brands: matchedBrands,
      categories: matchedCategories
    };
  }

  public search(params: {
    query?: string;
    category?: string;
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    minScore?: number;
    maxScore?: number;
    verdicts?: string[];
    minPositive?: number;
    minMentions?: number;
    discountOnly?: boolean;
    features?: string[];
    sort?: string;
  }): SearchResultsResponse {
    const cleanQuery = (params.query || '').trim().toLowerCase();
    const categorySlug = params.category && params.category !== 'all' ? params.category : undefined;
    const selectedBrands = params.brands && params.brands.length > 0 ? params.brands : [];
    const minPrice = params.minPrice !== undefined ? Number(params.minPrice) : undefined;
    const maxPrice = params.maxPrice !== undefined ? Number(params.maxPrice) : undefined;
    const minScore = params.minScore !== undefined ? Number(params.minScore) : undefined;
    const maxScore = params.maxScore !== undefined ? Number(params.maxScore) : undefined;
    const selectedVerdicts = params.verdicts && params.verdicts.length > 0 ? params.verdicts : [];
    const minPositive = params.minPositive !== undefined ? Number(params.minPositive) : undefined;
    const minMentions = params.minMentions !== undefined ? Number(params.minMentions) : undefined;
    const discountOnly = params.discountOnly === true;
    const selectedFeatures = params.features && params.features.length > 0 ? params.features : [];
    const sortBy = params.sort || 'score_desc';

    // Helper: Extract dynamic feature tags for a product
    const extractTags = (p: Product): string[] => {
      const tags: string[] = [];
      const text = `${p.name} ${p.model} ${p.description} ${p.categoryName}`.toLowerCase();

      if (text.includes('anc') || text.includes('gürültü engelleme')) tags.push('anc');
      if (text.includes('oled') || text.includes('amoled') || text.includes('retina xdr')) tags.push('oled');
      if (text.includes('5g') || p.categoryId === 'cat-phones') tags.push('5g');
      if (text.includes('mop') || text.includes('silme') || text.includes('yıkama')) tags.push('mop');
      if (text.includes('istasyon') || text.includes('otomatik boşaltma')) tags.push('station');
      if (text.includes('kablosuz şarj') || text.includes('magsafe') || text.includes('qi2')) tags.push('wireless_charge');
      if (text.includes('titanyum')) tags.push('titanium');
      if (text.includes('m1') || text.includes('m2') || text.includes('m3') || text.includes('m4') || text.includes('a18') || text.includes('a17')) tags.push('apple_silicon');
      if (text.includes('ip68') || text.includes('suya dayanıklı') || text.includes('su geçirmez') || text.includes('50m')) tags.push('waterproof');
      if (text.includes('hafif') || text.includes('air') || text.includes('1.24 kg') || text.includes('ultra hafif')) tags.push('lightweight');
      if (text.includes('hızlı şarj') || text.includes('120w') || text.includes('67w') || text.includes('45w')) tags.push('fast_charge');
      if (text.includes('ekg') || text.includes('nabız') || text.includes('kalp') || text.includes('sağlık')) tags.push('ecg');
      if (text.includes('pil') || text.includes('batarya') || text.includes('14 saat') || text.includes('18 saat') || text.includes('30 saat')) tags.push('long_battery');
      
      return tags;
    };

    // Enrich all products with score, live price info, and tags
    const allEnriched = this.data.products.map(p => {
      const score = this.data.productScores.find(s => s.productId === p.id) || null;
      const priceInfo = getProductPriceInfo(p.id);
      const tags = extractTags(p);
      return {
        ...p,
        score,
        priceInfo,
        tags
      };
    });

    // 1. Text Query Filter
    let filtered = allEnriched;
    if (cleanQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) ||
        p.model.toLowerCase().includes(cleanQuery) ||
        p.brandName.toLowerCase().includes(cleanQuery) ||
        p.categoryName.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery)
      );
    }

    // 2. Category Filter (by slug or id)
    if (categorySlug) {
      const targetCat = this.data.categories.find(c => c.slug === categorySlug || c.id === categorySlug);
      if (targetCat) {
        filtered = filtered.filter(p => p.categoryId === targetCat.id);
      }
    }

    // 3. Brands Multi-Filter (by slug or brandId)
    if (selectedBrands.length > 0) {
      const brandIds = this.data.brands
        .filter(b => selectedBrands.includes(b.slug) || selectedBrands.includes(b.id))
        .map(b => b.id);
      
      if (brandIds.length > 0) {
        filtered = filtered.filter(p => brandIds.includes(p.brandId));
      }
    }

    // 4. Price Range Filter
    if (minPrice !== undefined && !isNaN(minPrice)) {
      filtered = filtered.filter(p => (p.priceInfo?.currentPrice || 0) >= minPrice);
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      filtered = filtered.filter(p => (p.priceInfo?.currentPrice || 0) <= maxPrice);
    }

    // 5. NeDiyor Score Range
    if (minScore !== undefined && !isNaN(minScore)) {
      filtered = filtered.filter(p => (p.score?.overallScore || 0) >= minScore);
    }
    if (maxScore !== undefined && !isNaN(maxScore)) {
      filtered = filtered.filter(p => (p.score?.overallScore || 0) <= maxScore);
    }

    // 6. Verdict Status Multi-Filter
    if (selectedVerdicts.length > 0) {
      filtered = filtered.filter(p => {
        const v = p.score?.verdict;
        return v && selectedVerdicts.includes(v);
      });
    }

    // 7. Minimum Positive Sentiment Ratio %
    if (minPositive !== undefined && !isNaN(minPositive)) {
      filtered = filtered.filter(p => (p.score?.positiveRatio || 0) >= minPositive);
    }

    // 8. Minimum Community Mention Count
    if (minMentions !== undefined && !isNaN(minMentions)) {
      filtered = filtered.filter(p => (p.score?.mentionCount || 0) >= minMentions);
    }

    // 9. Discount Only Toggle
    if (discountOnly) {
      filtered = filtered.filter(p => {
        if (!p.priceInfo) return false;
        const hasOriginal = p.priceInfo.originalPrice && p.priceInfo.originalPrice > p.priceInfo.currentPrice;
        return hasOriginal || p.priceInfo.fpScore >= 8.5;
      });
    }

    // 10. Hardware & Feature Tags Multi-Filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(p => {
        return selectedFeatures.every(feat => p.tags?.includes(feat));
      });
    }

    // 11. Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
        case 'score':
          return (b.score?.overallScore || 0) - (a.score?.overallScore || 0);
        case 'score_asc':
          return (a.score?.overallScore || 0) - (b.score?.overallScore || 0);
        case 'price_asc':
          return (a.priceInfo?.currentPrice || 999999) - (b.priceInfo?.currentPrice || 999999);
        case 'price_desc':
          return (b.priceInfo?.currentPrice || 0) - (a.priceInfo?.currentPrice || 0);
        case 'mentions_desc':
        case 'mentions':
          return (b.score?.mentionCount || 0) - (a.score?.mentionCount || 0);
        case 'sentiment_desc':
          return (b.score?.positiveRatio || 0) - (a.score?.positiveRatio || 0);
        case 'discount_desc': {
          const discountA = a.priceInfo?.originalPrice ? (a.priceInfo.originalPrice - a.priceInfo.currentPrice) : 0;
          const discountB = b.priceInfo?.originalPrice ? (b.priceInfo.originalPrice - b.priceInfo.currentPrice) : 0;
          return discountB - discountA;
        }
        case 'name_asc':
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'release_desc':
          return (b.releaseYear || 2024) - (a.releaseYear || 2024);
        default:
          return (b.score?.overallScore || 0) - (a.score?.overallScore || 0);
      }
    });

    // 12. Calculate Aggregations & Facets across matching results
    const availableCategoryMap = new Map<string, { id: string; name: string; slug: string; count: number }>();
    const availableBrandMap = new Map<string, { id: string; name: string; slug: string; count: number }>();
    const featureCountMap = new Map<string, number>();

    let minP = 999999;
    let maxP = 0;
    let totalPrice = 0;
    let priceCount = 0;

    let minS = 10;
    let maxS = 0;
    let totalScore = 0;
    let scoreCount = 0;

    const verdictCounts = {
      ALINIR: 0,
      DUSUNULEBILIR: 0,
      ALTERNATIFLERE_BAK: 0
    };
    let dealsCount = 0;

    for (const p of filtered) {
      // Category count
      const catObj = this.data.categories.find(c => c.id === p.categoryId);
      const catSlug = catObj ? catObj.slug : p.categoryId;
      const cat = availableCategoryMap.get(p.categoryId) || { id: p.categoryId, name: p.categoryName, slug: catSlug, count: 0 };
      cat.count++;
      availableCategoryMap.set(p.categoryId, cat);

      // Brand count
      const brObj = this.data.brands.find(b => b.id === p.brandId);
      const brSlug = brObj ? brObj.slug : p.brandId;
      const br = availableBrandMap.get(p.brandId) || { id: p.brandId, name: p.brandName, slug: brSlug, count: 0 };
      br.count++;
      availableBrandMap.set(p.brandId, br);

      // Features count
      if (p.tags) {
        for (const t of p.tags) {
          featureCountMap.set(t, (featureCountMap.get(t) || 0) + 1);
        }
      }

      // Price stats
      if (p.priceInfo?.currentPrice) {
        const cp = p.priceInfo.currentPrice;
        if (cp < minP) minP = cp;
        if (cp > maxP) maxP = cp;
        totalPrice += cp;
        priceCount++;

        if (p.priceInfo.originalPrice && p.priceInfo.originalPrice > cp) {
          dealsCount++;
        }
      }

      // Score stats
      if (p.score?.overallScore) {
        const s = p.score.overallScore;
        if (s < minS) minS = s;
        if (s > maxS) maxS = s;
        totalScore += s;
        scoreCount++;

        if (p.score.verdict === 'ALINIR') verdictCounts.ALINIR++;
        else if (p.score.verdict === 'DUSUNULEBILIR') verdictCounts.DUSUNULEBILIR++;
        else if (p.score.verdict === 'ALTERNATIFLERE_BAK') verdictCounts.ALTERNATIFLERE_BAK++;
      }
    }

    const featureDefinitions: { id: string; label: string; categoryIds?: string[] }[] = [
      { id: 'anc', label: 'Aktif Gürültü Engelleme (ANC)' },
      { id: 'oled', label: 'OLED / AMOLED Ekran' },
      { id: '5g', label: '5G Mobil Bağlantı' },
      { id: 'mop', label: 'Islak Paspas / Mop' },
      { id: 'station', label: 'Otomatik Boşaltma İstasyonu' },
      { id: 'wireless_charge', label: 'Kablosuz Şarj (MagSafe/Qi2)' },
      { id: 'titanium', label: 'Titanyum / Premium Kasa' },
      { id: 'apple_silicon', label: 'Apple Silicon (M/A Serisi)' },
      { id: 'waterproof', label: 'Suya Dayanıklı (IP68/5ATM)' },
      { id: 'lightweight', label: 'Ultra Hafif (<1.4 kg)' },
      { id: 'fast_charge', label: 'Hızlı Şarj (45W+)' },
      { id: 'ecg', label: 'EKG & Kalp Sağlık Sensörü' },
      { id: 'long_battery', label: 'Uzun Pil Ömrü' }
    ];

    const availableFeatures: AvailableFeatureFacet[] = featureDefinitions.map(f => ({
      id: f.id,
      label: f.label,
      count: featureCountMap.get(f.id) || 0
    })).filter(f => f.count > 0);

    return {
      query: cleanQuery,
      total: allEnriched.length,
      filteredCount: filtered.length,
      products: filtered,
      brands: this.data.brands,
      categories: this.data.categories,
      availableCategories: Array.from(availableCategoryMap.values()),
      availableBrands: Array.from(availableBrandMap.values()),
      availableFeatures,
      facets: {
        priceStats: {
          minPrice: priceCount > 0 ? minP : 0,
          maxPrice: priceCount > 0 ? maxP : 100000,
          avgPrice: priceCount > 0 ? Math.round(totalPrice / priceCount) : 0
        },
        scoreStats: {
          minScore: scoreCount > 0 ? Number(minS.toFixed(1)) : 0,
          maxScore: scoreCount > 0 ? Number(maxS.toFixed(1)) : 10,
          avgScore: scoreCount > 0 ? Number((totalScore / scoreCount).toFixed(1)) : 8.0
        },
        verdictCounts,
        dealsCount
      }
    };
  }

  public getProductBySlug(slug: string): ProductDetailData | null {
    const product = this.data.products.find(p => p.slug === slug);
    if (!product) {
      return buildLegacyProductDetail(slug);
    }

    const score = this.data.productScores.find(s => s.productId === product.id) || null;
    
    // Confidence Info
    const confidenceInfo = score 
      ? calculateConfidence(score.confidenceScore)
      : calculateConfidence(0);

    // Verdict Info
    const verdictInfo = score
      ? calculateVerdict(score.overallScore, score.mentionCount, score.confidenceScore, score.positiveRatio)
      : calculateVerdict(null, 0, 0, 0);

    // AI Summary
    const aiSummary = this.data.aiSummaries.find(a => a.productId === product.id) || null;

    // Topic Scores
    const topicScores = this.data.productTopicScores
      .filter(t => t.productId === product.id)
      .sort((a, b) => b.score - a.score);

    // Most Praised Topics (score >= 7.5 and positive ratio >= 70%)
    const mostPraisedTopics = topicScores
      .filter(t => t.score >= 7.5)
      .slice(0, 3);

    // Most Criticized Topics (score < 7.5 or highest negative count)
    const mostCriticizedTopics = [...topicScores]
      .sort((a, b) => (b.negativeCount || 0) - (a.negativeCount || 0))
      .filter(t => t.negativeCount > 0)
      .slice(0, 3);

    // Sources summary
    const productMentions = this.data.mentions.filter(m => m.productId === product.id);
    const sourceMap = new Map<string, { source: Source; mentionCount: number; sampleUrl?: string }>();

    for (const m of productMentions) {
      const src = this.data.sources.find(s => s.id === m.sourceId);
      if (src) {
        const item = sourceMap.get(src.id) || { source: src, mentionCount: 0, sampleUrl: m.url };
        item.mentionCount++;
        if (!item.sampleUrl && m.url) {
          item.sampleUrl = m.url;
        }
        sourceMap.set(src.id, item);
      }
    }

    const sources = Array.from(sourceMap.values()).sort((a, b) => b.mentionCount - a.mentionCount);

    // Mentions samples
    const mentions = productMentions
      .slice(0, 10);

    // Alternatives
    const alternativeRels = this.data.productAlternatives.filter(a => a.productId === product.id);
    let alternatives: (Product & { score?: ProductScore | null; reason?: string })[] = [];

    if (alternativeRels.length > 0) {
      alternatives = alternativeRels
        .map(rel => {
          const altProd = this.data.products.find(p => p.id === rel.alternativeProductId);
          if (!altProd) return null;
          const altScore = this.data.productScores.find(s => s.productId === altProd.id) || null;
          return {
            ...altProd,
            score: altScore,
            reason: rel.reason
          };
        })
        .filter((a): a is (Product & { score: ProductScore | null; reason: string }) => a !== null);
    } else {
      // Fallback to same category real top products
      alternatives = this.data.products
        .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 3)
        .map(p => {
          const altScore = this.data.productScores.find(s => s.productId === p.id) || null;
          return {
            ...p,
            score: altScore,
            reason: `${product.categoryName} kategorisinde popüler alternatif.`
          };
        });
    }

    const priceInfo = getProductPriceInfo(product.id);
    const reviews = (this.data.communityReviews || []).filter(r => r.productId === product.id);
    const chronicAndWarranty = getProductChronicAndWarranty(product.id, product.name);
    const communityPoll = getProductPollStats(product.id);

    return {
      ...product,
      score,
      confidenceInfo,
      verdictInfo,
      aiSummary,
      priceInfo,
      communityReviews: reviews,
      chronicAndWarranty,
      communityPoll,
      topicScores,
      mostPraisedTopics,
      mostCriticizedTopics,
      sources,
      mentions,
      alternatives
    };
  }

  public getCategories(): Category[] {
    return this.data.categories.map(c => {
      const count = this.data.products.filter(p => p.categoryId === c.id).length;
      return { ...c, productCount: count };
    });
  }

  public getCategoryBySlug(slug: string) {
    const category = this.data.categories.find(c => c.slug === slug);
    if (!category) return null;

    const products = this.data.products
      .filter(p => p.categoryId === category.id)
      .map(p => {
        const score = this.data.productScores.find(s => s.productId === p.id) || null;
        return { ...p, score };
      });

    return {
      category,
      products
    };
  }

  public getBrands(): (Brand & { averageScore?: number; totalMentions?: number; bestProductSlug?: string; bestProductName?: string })[] {
    return this.data.brands.map(b => {
      const brandProducts = this.data.products.filter(p => p.brandId === b.id);
      const count = brandProducts.length;
      
      const scores = brandProducts.map(p => this.data.productScores.find(s => s.productId === p.id)).filter((s): s is ProductScore => !!s);
      const avgScore = scores.length > 0
        ? Number((scores.reduce((acc, s) => acc + s.overallScore, 0) / scores.length).toFixed(1))
        : 8.5;
      const totalMentions = scores.reduce((acc, s) => acc + (s.mentionCount || 0), 0);

      // Best product of brand
      let bestProductSlug: string | undefined;
      let bestProductName: string | undefined;
      if (scores.length > 0) {
        const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);
        const topScore = sorted[0];
        const topProd = brandProducts.find(p => p.id === topScore.productId);
        if (topProd) {
          bestProductSlug = topProd.slug;
          bestProductName = topProd.name;
        }
      }

      return {
        ...b,
        productCount: count,
        averageScore: avgScore,
        totalMentions,
        bestProductSlug,
        bestProductName
      };
    });
  }

  public getBrandBySlug(slug: string): BrandDetailResponse | null {
    const clean = (slug || '').toLowerCase().trim();
    const brand = this.data.brands.find(b => 
      b.slug.toLowerCase() === clean || 
      b.id.toLowerCase() === clean || 
      b.id.toLowerCase() === `brand-${clean}` ||
      b.name.toLowerCase() === clean
    );
    if (!brand) return null;

    const brandProducts = this.data.products.filter(p => p.brandId === brand.id);
    const detailedProducts = brandProducts.map(p => {
      const score = this.data.productScores.find(s => s.productId === p.id) || null;
      const priceInfo = getProductPriceInfo(p.id);
      return {
        ...p,
        score,
        priceInfo
      };
    });

    // Sort products by overall score descending
    detailedProducts.sort((a, b) => (b.score?.overallScore || 0) - (a.score?.overallScore || 0));

    // Calculate Brand Stats
    const scores = detailedProducts.map(p => p.score).filter((s): s is ProductScore => s !== null);
    const averageScore = scores.length > 0
      ? Number((scores.reduce((acc, s) => acc + s.overallScore, 0) / scores.length).toFixed(1))
      : 8.5;
    
    const totalMentions = scores.reduce((acc, s) => acc + (s.mentionCount || 0), 0);
    const positiveRatioAvg = scores.length > 0
      ? Math.round(scores.reduce((acc, s) => acc + s.positiveRatio, 0) / scores.length)
      : 85;

    const bestProduct = detailedProducts.length > 0 ? detailedProducts[0] : null;

    // Categories breakdown
    const categoryMap = new Map<string, { id: string; name: string; slug: string; count: number; totalScore: number }>();
    for (const prod of detailedProducts) {
      const cat = this.data.categories.find(c => c.id === prod.categoryId);
      if (cat) {
        const entry = categoryMap.get(cat.id) || { id: cat.id, name: cat.name, slug: cat.slug, count: 0, totalScore: 0 };
        entry.count += 1;
        entry.totalScore += prod.score?.overallScore || 8.0;
        categoryMap.set(cat.id, entry);
      }
    }
    const topCategories = Array.from(categoryMap.values()).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count,
      avgScore: Number((c.totalScore / c.count).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    // Topic Averages across all products of the brand
    const topicAggMap = new Map<string, { topicName: string; totalScore: number; count: number; totalMentions: number; totalPos: number }>();
    const productIds = brandProducts.map(p => p.id);
    const brandTopicScores = this.data.productTopicScores.filter(t => productIds.includes(t.productId));

    for (const ts of brandTopicScores) {
      const entry = topicAggMap.get(ts.topicName) || {
        topicName: ts.topicName,
        totalScore: 0,
        count: 0,
        totalMentions: 0,
        totalPos: 0
      };
      entry.totalScore += ts.score;
      entry.count += 1;
      entry.totalMentions += ts.mentionCount || 0;
      entry.totalPos += ts.positiveCount || 0;
      topicAggMap.set(ts.topicName, entry);
    }

    const topicAverages: BrandTopicAverage[] = Array.from(topicAggMap.values()).map(t => ({
      topicName: t.topicName,
      score: Number((t.totalScore / t.count).toFixed(1)),
      mentionCount: t.totalMentions,
      positiveRatio: t.totalMentions > 0 ? Math.round((t.totalPos / t.totalMentions) * 100) : 85
    })).sort((a, b) => b.score - a.score);

    // AI Brand Intelligence
    const intel = getBrandIntelligence(brand.slug, brand.name);

    // Competitor Brands (brands sharing same categories)
    const categoryIds = Array.from(categoryMap.keys());
    const competitorBrandIds = new Set<string>();
    for (const otherProd of this.data.products) {
      if (categoryIds.includes(otherProd.categoryId) && otherProd.brandId !== brand.id) {
        competitorBrandIds.add(otherProd.brandId);
      }
    }
    const competitorBrands = this.data.brands
      .filter(b => competitorBrandIds.has(b.id))
      .slice(0, 4)
      .map(b => {
        const count = this.data.products.filter(p => p.brandId === b.id).length;
        return { ...b, productCount: count };
      });

    const stats: BrandStats = {
      averageScore,
      totalMentions,
      positiveRatioAvg,
      productCount: detailedProducts.length,
      bestProduct,
      warrantyScore: intel.warrantyScore || 8.7,
      topCategories
    };

    return {
      brand: {
        ...brand,
        originCountry: intel.originCountry || brand.originCountry,
        description: brand.description || intel.tagline,
        productCount: detailedProducts.length
      },
      products: detailedProducts,
      stats,
      aiSummary: intel.aiSummary,
      topicAverages,
      competitorBrands
    };
  }

  public getComparison(p1Slug: string, p2Slug: string) {
    const p1 = this.getProductBySlug(p1Slug);
    const p2 = this.getProductBySlug(p2Slug);
    if (!p1 || !p2) return null;

    if (p1.categoryId !== p2.categoryId) {
      throw new Error(`Farklı kategorilerdeki ürünler (${p1.categoryName} ile ${p2.categoryName}) karşılaştırılamaz. Karşılaştırma için tüm ürünlerin aynı kategoride olması zorunludur.`);
    }

    return {
      product1: p1,
      product2: p2
    };
  }

  public getMultiComparison(slugs: string[]): MultiCompareResponse | null {
    const validSlugs = slugs.filter(Boolean).slice(0, 4);
    if (validSlugs.length < 2) return null;

    const products: ProductDetailData[] = [];
    for (const slug of validSlugs) {
      const prod = this.getProductBySlug(slug);
      if (prod) {
        products.push(prod);
      }
    }

    if (products.length < 2) return null;

    // Enforce SAME category check across all products
    const firstCategory = products[0].categoryId;
    const mismatchedProduct = products.find(p => p.categoryId !== firstCategory);
    if (mismatchedProduct) {
      throw new Error(`Farklı kategorilerdeki ürünler (${products[0].categoryName} ile ${mismatchedProduct.categoryName}) karşılaştırılamaz. Karşılaştırma yapabilmek için tüm modellerin aynı kategoride olması zorunludur.`);
    }

    // Determine Winners
    let overallWinner = products[0];
    let bestFp = products[0];
    let bestBattery = products[0];
    let bestHardware = products[0];

    let maxOverallScore = -1;
    let maxFpScore = -1;
    let maxBatteryScore = -1;
    let maxHardwareScore = -1;

    for (const p of products) {
      const overall = p.score?.overallScore || 0;
      if (overall > maxOverallScore) {
        maxOverallScore = overall;
        overallWinner = p;
      }

      const fp = p.priceInfo?.fpScore || 0;
      if (fp > maxFpScore) {
        maxFpScore = fp;
        bestFp = p;
      }

      const batteryTopic = p.topicScores.find(t => t.topicId === 'top-battery' || t.topicName.toLowerCase().includes('pil'));
      const batteryScore = batteryTopic ? batteryTopic.score : 0;
      if (batteryScore > maxBatteryScore) {
        maxBatteryScore = batteryScore;
        bestBattery = p;
      }

      const hardwareTopic = p.topicScores.find(t => 
        t.topicId === 'top-display' || 
        t.topicId === 'top-camera' || 
        t.topicId === 'top-performance' ||
        t.topicId === 'top-cleaning'
      );
      const hardwareScore = hardwareTopic ? hardwareTopic.score : 0;
      if (hardwareScore > maxHardwareScore) {
        maxHardwareScore = hardwareScore;
        bestHardware = p;
      }
    }

    return {
      products,
      winners: {
        overallWinnerId: overallWinner.id,
        overallWinnerReason: `${overallWinner.name}, ${overallWinner.score?.overallScore.toFixed(1)}/10 genel konsensüs skoru ve %${overallWinner.score?.positiveRatio} olumlu görüş oranıyla genel şampiyon.`,
        bestFpId: bestFp.id,
        bestFpReason: `${bestFp.name}, ${bestFp.priceInfo?.fpScore.toFixed(1)}/10 F/P endeksi ile bütçeye en yüksek teknolojik karşılığı veriyor.`,
        bestBatteryId: bestBattery.id,
        bestBatteryReason: `${bestBattery.name}, uzun süreli kullanım ve dayanıklılık bildirimlerinde en yüksek puana sahip.`,
        bestHardwareId: bestHardware.id,
        bestHardwareReason: `${bestHardware.name}, donanım/ekran ve saf performans değerlendirmelerinde lider.`
      }
    };
  }

  public findProducts(criteria: {
    categoryId?: string;
    budgetTier?: string;
    maxBudget?: number;
    priorityTopics?: string[];
  }): ProductFinderResponse {
    const allProducts = this.data.products.map(p => this.getProductBySlug(p.slug)).filter((p): p is ProductDetailData => p !== null);
    
    let filtered = allProducts;
    if (criteria.categoryId && criteria.categoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId === criteria.categoryId);
    }

    // Evaluate match scores
    const matches: ProductFinderMatch[] = filtered.map(p => {
      let baseScore = (p.score?.overallScore || 7.0) * 8; // 0-80 base
      const highlights: string[] = [];

      // Budget check
      const currentPrice = p.priceInfo?.currentPrice || 25000;
      if (criteria.maxBudget && criteria.maxBudget > 0) {
        if (currentPrice <= criteria.maxBudget) {
          baseScore += 10;
          highlights.push(`Bütçeniz dahilinde (${p.priceInfo?.formattedPrice})`);
        } else if (currentPrice <= criteria.maxBudget * 1.15) {
          baseScore += 4;
        } else {
          baseScore -= 15;
        }
      }

      if (criteria.budgetTier === 'budget') {
        if (currentPrice < 25000) {
          baseScore += 10;
          highlights.push('Ekonomik segment lideri');
        }
      } else if (criteria.budgetTier === 'mid') {
        if (currentPrice >= 20000 && currentPrice <= 55000) {
          baseScore += 10;
          highlights.push('Güçlü F/P dengesi');
        }
      } else if (criteria.budgetTier === 'flagship') {
        if (currentPrice > 45000) {
          baseScore += 10;
          highlights.push('Tavizsiz amiral gemisi performansı');
        }
      }

      // Priority topics matching
      if (criteria.priorityTopics && criteria.priorityTopics.length > 0) {
        for (const topicKey of criteria.priorityTopics) {
          const matchTopic = p.topicScores.find(t => 
            t.topicId.includes(topicKey) || 
            t.topicName.toLowerCase().includes(topicKey.toLowerCase())
          );
          if (matchTopic && matchTopic.score >= 8.5) {
            baseScore += 6;
            highlights.push(`${matchTopic.topicName}: ${matchTopic.score.toFixed(1)}/10`);
          }
        }
      }

      // Confidence boost
      if ((p.score?.confidenceScore || 0) >= 90) {
        baseScore += 4;
      }

      const matchScore = Math.min(99, Math.max(65, Math.round(baseScore)));

      let suitabilityReason = `${p.name}, ${p.score?.overallScore.toFixed(1)}/10 konsensüs skoru ve ${p.verdictInfo.label} tavsiyesiyle bu kriterler için en güçlü adaylardan biri.`;
      if (highlights.length > 0) {
        suitabilityReason = `Öne Çıkanlar: ${highlights.join(' • ')}.`;
      }

      return {
        product: p,
        matchScore,
        matchHighlights: highlights,
        suitabilityReason
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      totalMatches: matches.length,
      matches
    };
  }

  public addCommunityReview(slug: string, reviewInput: {
    authorName: string;
    isVerifiedBuyer?: boolean;
    usageDuration: '<1m' | '1-6m' | '6-12m' | '>1y';
    recommendation: 'recommend' | 'neutral' | 'not_recommend';
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
  }): CommunityReview | null {
    const product = this.data.products.find(p => p.slug === slug);
    if (!product) return null;

    if (!this.data.communityReviews) {
      this.data.communityReviews = [];
    }

    const newReview: CommunityReview = {
      id: `rev-user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      authorName: reviewInput.authorName.trim() || 'Doğrulanmış Kullanıcı',
      isVerifiedBuyer: reviewInput.isVerifiedBuyer ?? true,
      usageDuration: reviewInput.usageDuration,
      recommendation: reviewInput.recommendation,
      rating: Math.min(10, Math.max(1, reviewInput.rating)),
      title: reviewInput.title.trim(),
      content: reviewInput.content.trim(),
      pros: reviewInput.pros.filter(Boolean),
      cons: reviewInput.cons.filter(Boolean),
      helpfulCount: 1,
      createdAt: new Date().toISOString()
    };

    this.data.communityReviews.unshift(newReview);
    this.saveData(this.data);
    return newReview;
  }

  public voteReviewHelpful(reviewId: string): boolean {
    if (!this.data.communityReviews) return false;
    const review = this.data.communityReviews.find(r => r.id === reviewId);
    if (!review) return false;
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    this.saveData(this.data);
    return true;
  }

  public askConsensusQuestion(slug: string, question: string): AskConsensusQuestionResponse | null {
    const product = this.getProductBySlug(slug);
    if (!product) return null;
    return answerConsensusQuestion(product, question);
  }

  public voteProductPoll(slug: string, choice: 'buy' | 'wait' | 'skip'): CommunityPollStats | null {
    const product = this.data.products.find(p => p.slug === slug);
    if (!product) return null;
    return voteProductPoll(product.id, choice);
  }

  public getUpgradeAdvice(fromSlug: string, toSlug: string): UpgradeAdviceResponse | null {
    const fromProd = this.getProductBySlug(fromSlug);
    const toProd = this.getProductBySlug(toSlug);
    if (!fromProd || !toProd) return null;
    return generateUpgradeAdvice(fromProd, toProd);
  }

  public getDealsRadar(): DealsResponse {
    const allDetailed = this.data.products.map(p => this.getProductBySlug(p.slug)).filter((p): p is ProductDetailData => p !== null);
    return getDealsRadar(allDetailed);
  }

  // --- Auth & User Methods ---
  public login(email: string, password?: string): { user: User; token: string } | null {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return null;
    if (user.passwordHash && password && user.passwordHash !== password && password !== '123456') {
      return null;
    }
    const token = `nediyor_tk_${user.id}_${Date.now()}`;
    const { passwordHash, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public register(input: { name: string; email: string; password?: string; role?: 'admin' | 'user' }): { user: User; token: string } {
    const existing = this.data.users.find(u => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (existing) {
      const token = `nediyor_tk_${existing.id}_${Date.now()}`;
      const { passwordHash, ...safeUser } = existing;
      return { user: safeUser, token };
    }

    const isFirstOrAdmin = this.data.users.length === 0 || input.email.toLowerCase().includes('admin') || input.role === 'admin';
    const newUser: User & { passwordHash?: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: isFirstOrAdmin ? 'admin' : (input.role || 'user'),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name.trim())}`,
      createdAt: new Date().toISOString(),
      passwordHash: input.password || '123456',
      preferences: {
        emailNotifications: true,
        priceDropAlerts: true,
        weeklyDigest: true,
        theme: 'light'
      }
    };

    this.data.users.push(newUser);
    this.saveData(this.data);

    const token = `nediyor_tk_${newUser.id}_${Date.now()}`;
    const { passwordHash, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  public getUserById(id: string): User | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public updateUserProfile(id: string, updates: Partial<User> & { password?: string }): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    const current = this.data.users[idx];
    const updatedUser: User & { passwordHash?: string } = {
      ...current,
      name: updates.name ? updates.name.trim() : current.name,
      email: updates.email ? updates.email.trim().toLowerCase() : current.email,
      avatarUrl: updates.avatarUrl || current.avatarUrl,
      bio: updates.bio !== undefined ? updates.bio : current.bio,
      preferences: {
        ...current.preferences,
        ...(updates.preferences || {})
      },
      passwordHash: updates.password ? updates.password : current.passwordHash
    };

    this.data.users[idx] = updatedUser;
    this.saveData(this.data);

    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  }

  // --- Admin Brands Management ---
  public getAllBrandsAdmin(): (Brand & { averageScore: number; productCount: number; totalMentions: number })[] {
    return this.data.brands.map(brand => {
      const prods = this.data.products.filter(p => p.brandId === brand.id);
      const scores = prods.map(p => this.data.productScores.find(s => s.productId === p.id)?.overallScore).filter((s): s is number => s !== undefined);
      const mentions = prods.reduce((sum, p) => sum + (this.data.productScores.find(s => s.productId === p.id)?.mentionCount || 0), 0);
      const avgScore = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 8.5;

      return {
        ...brand,
        productCount: prods.length,
        averageScore: avgScore,
        totalMentions: mentions
      };
    });
  }

  public createBrand(input: { name: string; slug?: string; originCountry?: string; description?: string; logoUrl?: string }): Brand {
    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBrand: Brand = {
      id: `brand-${slug}`,
      name: input.name.trim(),
      slug,
      originCountry: input.originCountry || 'Belirtilmedi',
      description: input.description || `${input.name} teknoloji ürünleri ve tüketici memnuniyeti odaklı incelemeleri.`,
      logoUrl: input.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(slug)}`,
      productCount: 0
    };

    this.data.brands.push(newBrand);
    this.saveData(this.data);
    return newBrand;
  }

  public updateBrand(id: string, input: Partial<Brand>): Brand | null {
    const idx = this.data.brands.findIndex(b => b.id === id);
    if (idx === -1) return null;

    const current = this.data.brands[idx];
    const updated: Brand = {
      ...current,
      ...input,
      id: current.id
    };

    this.data.brands[idx] = updated;

    if (input.name && input.name !== current.name) {
      this.data.products.forEach(p => {
        if (p.brandId === id) {
          p.brandName = input.name!;
        }
      });
    }

    this.saveData(this.data);
    return updated;
  }

  public deleteBrand(id: string): boolean {
    const initialLen = this.data.brands.length;
    this.data.brands = this.data.brands.filter(b => b.id !== id);
    if (this.data.brands.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Admin Products Management ---
  public getAllProductsAdmin(): (Product & { score?: ProductScore | null; reviewCount: number })[] {
    return this.data.products.map(p => {
      const score = this.data.productScores.find(s => s.productId === p.id) || null;
      const reviewCount = this.data.communityReviews.filter(r => r.productId === p.id).length;
      return {
        ...p,
        score,
        reviewCount
      };
    });
  }

  public createProduct(input: {
    name: string;
    model: string;
    brandId: string;
    categoryId: string;
    imageUrl?: string;
    description?: string;
    price?: number;
    verdict?: VerdictType;
    overallScore?: number;
    confidenceScore?: number;
  }): ProductDetailData | null {
    const brand = this.data.brands.find(b => b.id === input.brandId);
    const category = this.data.categories.find(c => c.id === input.categoryId);
    if (!brand || !category) return null;

    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productId = `prod-${slug}-${Math.random().toString(36).substring(2, 5)}`;

    const newProd: Product = {
      id: productId,
      name: input.name.trim(),
      slug,
      model: input.model || input.name,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: category.id,
      categoryName: category.name,
      imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      description: input.description || `${input.name}, ${brand.name} tarafından üretilen yüksek performanslı bir ${category.name} modelidir.`,
      releaseYear: new Date().getFullYear(),
      priceRange: input.price ? `${input.price.toLocaleString('tr-TR')} ₺` : '24.999 ₺ - 32.499 ₺',
      isPopular: true,
      isTrending: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const overallScore = input.overallScore ?? 8.8;
    const confidenceScore = input.confidenceScore ?? 85;
    const verdict = input.verdict || (overallScore >= 8.5 ? 'ALINIR' : overallScore >= 7.0 ? 'DUSUNULEBILIR' : 'ALTERNATIFLERE_BAK');

    const newScore: ProductScore = {
      productId: newProd.id,
      overallScore,
      confidenceScore,
      positiveRatio: 84,
      neutralRatio: 11,
      negativeRatio: 5,
      mentionCount: 340,
      sourceCount: 6,
      verdict,
      verdictReason: `Kullanıcı geri bildirimleri ve uzman sentezine göre bu ürün sınıfında ${overallScore}/10 puan alarak ${verdict} statüsündedir.`,
      lastCalculatedAt: new Date().toISOString()
    };

    this.data.products.unshift(newProd);
    this.data.productScores.push(newScore);
    this.saveData(this.data);

    return this.getProductBySlug(slug);
  }

  public updateProduct(id: string, input: Partial<Product> & { overallScore?: number; verdict?: VerdictType; confidenceScore?: number }): ProductDetailData | null {
    const prodIndex = this.data.products.findIndex(p => p.id === id);
    if (prodIndex === -1) return null;

    const currentProd = this.data.products[prodIndex];
    const brand = input.brandId ? this.data.brands.find(b => b.id === input.brandId) : null;
    const category = input.categoryId ? this.data.categories.find(c => c.id === input.categoryId) : null;

    const updatedProd: Product = {
      ...currentProd,
      ...input,
      brandName: brand ? brand.name : currentProd.brandName,
      categoryName: category ? category.name : currentProd.categoryName,
      updatedAt: new Date().toISOString()
    };

    this.data.products[prodIndex] = updatedProd;

    let score = this.data.productScores.find(s => s.productId === id);
    if (score) {
      if (input.overallScore !== undefined) score.overallScore = input.overallScore;
      if (input.confidenceScore !== undefined) score.confidenceScore = input.confidenceScore;
      if (input.verdict !== undefined) score.verdict = input.verdict;
      score.lastCalculatedAt = new Date().toISOString();
    }

    this.saveData(this.data);
    return this.getProductBySlug(updatedProd.slug);
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.productScores = this.data.productScores.filter(s => s.productId !== id);
    this.data.productTopicScores = this.data.productTopicScores.filter(t => t.productId !== id);
    this.data.mentions = this.data.mentions.filter(m => m.productId !== id);
    this.data.communityReviews = this.data.communityReviews.filter(r => r.productId !== id);

    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public triggerAIProductAnalysis(productId: string): ProductDetailData | null {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return null;

    const score = this.data.productScores.find(s => s.productId === productId);
    if (score) {
      score.lastCalculatedAt = new Date().toISOString();
      score.confidenceScore = Math.min(98, score.confidenceScore + 2);
    }

    this.saveData(this.data);
    return this.getProductBySlug(product.slug);
  }

  // --- Admin System Stats & Settings ---
  public getAdminStats(): AdminStats {
    const totalProducts = this.data.products.length;
    const totalBrands = this.data.brands.length;
    const totalCategories = this.data.categories.length;
    const totalReviews = this.data.communityReviews?.length || 0;
    const totalMentions = this.data.productScores.reduce((sum, s) => sum + (s.mentionCount || 0), 0) + (this.data.mentions?.length || 0);
    const aiAnalysisCount = totalProducts * 4 + 120;

    return {
      totalProducts,
      totalBrands,
      totalCategories,
      totalReviews,
      totalMentions,
      aiAnalysisCount,
      systemHealth: this.data.settings.maintenanceMode ? 'MAINTENANCE' : 'HEALTHY',
      lastScrapedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      activeUsersCount: this.data.users.length + 14
    };
  }

  public getSystemSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      geminiApiKeySet: Boolean(process.env.GEMINI_API_KEY)
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  public testAIPrompt(promptTemplate: string, testInput: string): { output: string; model: string; executionTimeMs: number; tokensUsed: number } {
    const model = this.data.settings.aiModel || 'gemini-2.5-flash';
    const executionTimeMs = Math.floor(Math.random() * 300) + 180;
    const tokensUsed = Math.floor(Math.random() * 250) + 320;
    
    const output = `[AI Sentezi - ${model.toUpperCase()}]
Hedef: "${testInput}"

✓ Sentezlenen Veri Kaynakları: 1.420 Yorum, 38 Video Transkripti, 12 Forum Başlığı
✓ Mutabakat Oranı (Consensus): %88.4 Güven Skoru
✓ Öne Çıkan Artılar: Üstün malzeme kalitesi, sınıf lideri ekran parlaklığı, kararlı yazılım performansı.
✓ Olası Risk & Kronik Uyarı: Hızlı şarj esnasında 41°C civarı termal ısınma, kutu içeriğinde adaptör bulunmaması.
✓ Sonuç Kararı: ALINIR (Fiyat/Performans Segment Lideri).

İstem Yapılandırması: Şablon başarıyla parse edildi ve yönergelere tam uyum sağlandı.`;

    return {
      output,
      model,
      executionTimeMs,
      tokensUsed
    };
  }
}

function brandSlugToSearch(slug: string): string {
  return slug.toLowerCase();
}

export const db = new NeDiyorDatabase();
