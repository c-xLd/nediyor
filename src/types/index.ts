export type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export type VerdictType = 'ALINIR' | 'DUSUNULEBILIR' | 'ALTERNATIFLERE_BAK' | 'YETERSIZ_VERI';

export type SourceType = 
  | 'ECOMMERCE_REVIEWS' 
  | 'SOCIAL_COMMUNITY' 
  | 'VIDEO_REVIEWS' 
  | 'TECH_FORUM' 
  | 'COMPLAINT_PLATFORM';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  originCountry?: string;
  description?: string;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
}

export interface Product {
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
  releaseYear?: number;
  priceRange?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductScore {
  productId: string;
  overallScore: number; // 0.0 - 10.0
  confidenceScore: number; // 0 - 100
  positiveRatio: number; // 0 - 100 %
  neutralRatio: number; // 0 - 100 %
  negativeRatio: number; // 0 - 100 %
  mentionCount: number;
  sourceCount: number;
  verdict: VerdictType;
  verdictReason: string;
  lastCalculatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  icon?: string;
  displayOrder?: number;
}

export interface ProductTopicScore {
  productId: string;
  topicId: string;
  topicName: string;
  score: number; // 0.0 - 10.0
  mentionCount: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  sentimentRatio: number; // positive percentage 0 - 100
  positiveHighlights?: string[];
  negativeHighlights?: string[];
}

export interface Source {
  id: string;
  name: string;
  domain: string;
  sourceType: SourceType;
  reliabilityScore: number; // 0 - 100
  icon?: string;
}

export interface Mention {
  id: string;
  productId: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  topicId?: string;
  topicName?: string;
  content: string;
  sentiment: SentimentType;
  url?: string;
  author?: string;
  publishDate: string;
}

export interface PriceOffer {
  storeName: string;
  price: number;
  currency: string;
  url: string;
  isLowest?: boolean;
  inStock: boolean;
  shippingInfo?: string;
  sellerRating?: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PriceInfo {
  currentPrice: number;
  originalPrice?: number;
  currency: string;
  formattedPrice: string;
  lowestPrice: number;
  highestPrice: number;
  fpScore: number; // 0.0 - 10.0
  fpVerdict: 'Üstün F/P' | 'İyi F/P' | 'Dengeli F/P' | 'Pahalı / Düşük F/P';
  offers: PriceOffer[];
  history: PriceHistoryPoint[];
}

export interface CommunityReview {
  id: string;
  productId: string;
  authorName: string;
  isVerifiedBuyer: boolean;
  usageDuration: '<1m' | '1-6m' | '6-12m' | '>1y';
  recommendation: 'recommend' | 'neutral' | 'not_recommend';
  rating: number; // 1 - 10
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  helpfulCount: number;
  userVotedHelpful?: boolean;
  createdAt: string;
}

export interface ChronicIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high'; // low: hafif, medium: dikkat, high: kritik
  frequencyRate: number; // örn %6
  status: 'resolved_update' | 'ongoing' | 'partially_fixed';
  statusLabel: string;
  description: string;
  workaroundOrAdvice: string;
}

export interface WarrantyExperience {
  serviceSatisfactionScore: number; // 0 - 100
  avgRepairDays: string; // "4-7 İş Günü"
  warrantyBadge: string; // "2 Yıl Resmi Distribütör Garantili"
  commonServiceFeedback: string;
  userRightsScore: number; // 0 - 10
  partsAvailability: 'Yuksek' | 'Orta' | 'Kisitli';
  doaReplacementEase: 'Kolay' | 'Orta' | 'Zor';
}

export interface LongTermReliability {
  batteryHealthDropAfterYear: string; // "Yaklaşık %8-12 düşüş"
  cosmeticDurability: string; // "Titanyum çerçeve çizilmelere dayanıklı"
  hardwareLifespanScore: number; // 1 - 10
  riskScore: number; // 0.0 - 10.0 (Düşük risk = iyi)
  riskLevel: 'Düşük Risk' | 'Orta Risk' | 'Dikkat Edilmeli';
  riskSummary: string;
}

export interface ChronicIssuesAndWarrantyData {
  chronicIssues: ChronicIssue[];
  warranty: WarrantyExperience;
  reliability: LongTermReliability;
}

export interface ConsensusAnswerQuote {
  sourceName: string;
  sourceType: SourceType;
  quote: string;
  sentiment: SentimentType;
  relevance: string;
}

export interface AskConsensusQuestionResponse {
  question: string;
  directVerdict: 'EVET' | 'HAYIR' | 'KISMEN' | 'KULLANIMA_BAGLI';
  directVerdictLabel: string;
  verdictTone: 'positive' | 'warning' | 'negative' | 'neutral';
  summary: string;
  keyFindings: string[];
  quotes: ConsensusAnswerQuote[];
  confidenceScore: number; // 0 - 100
}

export interface CommunityPollStats {
  productId: string;
  totalVotes: number;
  buyCount: number; // Kesinlikle Alınır
  waitCount: number; // İndirim Beklenmeli
  skipCount: number; // Alınmaz / Alternatife Bak
  buyPercentage: number;
  waitPercentage: number;
  skipPercentage: number;
  communityVerdict: string;
  topAlternativeSuggested?: string;
  userVotedChoice?: 'buy' | 'wait' | 'skip';
}

export interface UpgradeDifferenceItem {
  category: string;
  iconName: string;
  title: string;
  oldValue: string;
  newValue: string;
  improvementScore: number; // 1 - 10
  importance: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
}

export interface UpgradeAdviceResponse {
  fromProduct: ProductDetailData;
  toProduct: ProductDetailData;
  verdict: 'KESINLIKLE_DEGER' | 'DUSUNULEBILIR' | 'DEGECEK_KADAR_DEGIL' | 'GECILMEMELI';
  verdictTitle: string;
  recommendationPercentage: number; // 0 - 100 %
  summary: string;
  estimatedOldDeviceResaleValue: number; // TL
  newDevicePrice: number; // TL
  netUpgradeCost: number; // TL
  costValueRating: 'Çok Karlı' | 'Dengeli' | 'Pahalı Yükseltme';
  keyImprovements: UpgradeDifferenceItem[];
  unchangedAspects: string[];
  targetUserTypes: {
    userType: string;
    shouldUpgrade: boolean;
    reason: string;
  }[];
}

export interface DealItem {
  id: string;
  product: ProductDetailData;
  discountPercentage: number; // örn: 14%
  discountAmount: number; // TL
  currentPrice: number;
  previousPrice: number;
  storeName: string;
  storeUrl: string;
  isAllTimeLowest: boolean;
  isRealDiscount: boolean; // Doğrulanmış gerçek indirim (fiyat şişirme yok)
  discountTag: 'Günün Fırsatı' | 'Dip Fiyat' | 'Üstün F/P' | 'Flaş İndirim';
  expiresInHours?: number;
}

export interface DealsResponse {
  totalDeals: number;
  allTimeLowestCount: number;
  verifiedRealDiscountCount: number;
  deals: DealItem[];
}

export interface AISummary {
  id: string;
  productId: string;
  summaryType: 'overview' | 'detailed';
  content: string;
  pros: string[];
  cons: string[];
  idealFor?: string;
  notIdealFor?: string;
  keyTakeaway: string;
  modelVersion: string;
  createdAt: string;
}

export interface ProductAlternativeItem {
  productId: string;
  alternativeProductId: string;
  similarityScore: number;
  reason: string;
  alternativeProduct: Product & { score?: ProductScore | null };
}

export interface ProductDetailData extends Product {
  score: ProductScore | null;
  confidenceInfo: {
    level: 'Yüksek' | 'Orta' | 'Düşük';
    score: number;
    color: string;
    description: string;
  };
  verdictInfo: {
    status: VerdictType;
    label: string;
    variant: 'positive' | 'warning' | 'negative' | 'neutral';
    description: string;
  };
  aiSummary: AISummary | null;
  priceInfo?: PriceInfo;
  communityReviews?: CommunityReview[];
  chronicAndWarranty?: ChronicIssuesAndWarrantyData;
  communityPoll?: CommunityPollStats;
  topicScores: ProductTopicScore[];
  mostPraisedTopics: ProductTopicScore[];
  mostCriticizedTopics: ProductTopicScore[];
  sources: {
    source: Source;
    mentionCount: number;
    sampleUrl?: string;
  }[];
  mentions: Mention[];
  alternatives: (Product & { score?: ProductScore | null; reason?: string })[];
}

export interface MultiCompareWinners {
  overallWinnerId: string;
  overallWinnerReason: string;
  bestFpId: string;
  bestFpReason: string;
  bestBatteryId?: string;
  bestBatteryReason?: string;
  bestHardwareId?: string;
  bestHardwareReason?: string;
}

export interface MultiCompareResponse {
  products: ProductDetailData[];
  winners: MultiCompareWinners;
}

export interface ProductFinderMatch {
  product: ProductDetailData;
  matchScore: number; // 0 - 100
  matchHighlights: string[];
  suitabilityReason: string;
}

export interface ProductFinderResponse {
  totalMatches: number;
  matches: ProductFinderMatch[];
}

export interface SearchAutocompleteResult {
  products: {
    id: string;
    name: string;
    model: string;
    slug: string;
    brandName: string;
    categoryId: string;
    categoryName: string;
    imageUrl: string;
    score?: number;
    mentionCount?: number;
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
}

export interface AvailableFeatureFacet {
  id: string;
  label: string;
  count: number;
  categoryIds?: string[];
}

export interface SearchFacetStats {
  priceStats: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
  scoreStats: {
    minScore: number;
    maxScore: number;
    avgScore: number;
  };
  verdictCounts: {
    ALINIR: number;
    DUSUNULEBILIR: number;
    ALTERNATIFLERE_BAK: number;
  };
  dealsCount: number;
}

export interface SearchResultsResponse {
  query: string;
  total: number;
  filteredCount: number;
  products: (Product & { 
    score?: ProductScore | null; 
    priceInfo?: PriceInfo;
    tags?: string[];
  })[];
  brands: Brand[];
  categories: Category[];
  availableCategories: { id: string; name: string; slug: string; count: number }[];
  availableBrands: { id: string; name: string; slug: string; count: number }[];
  availableFeatures: AvailableFeatureFacet[];
  facets: SearchFacetStats;
}

export interface AdvancedFilterState {
  q: string;
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
  sort: string;
}

export interface CategorySectionData {
  category: Category;
  products: (Product & { score?: ProductScore | null })[];
}

export interface BrandTopicAverage {
  topicName: string;
  score: number;
  mentionCount: number;
  positiveRatio: number;
}

export interface BrandAISummaryData {
  generalVerdict: string;
  strengths: string[];
  weaknesses: string[];
  ecosystemHighlights: string[];
  warrantyAndSupportVerdict: string;
  bestFor: string;
  notRecommendedFor: string;
  reliabilityScore: number; // 0 - 100
}

export interface BrandStats {
  averageScore: number;
  totalMentions: number;
  positiveRatioAvg: number;
  productCount: number;
  bestProduct?: (Product & { score?: ProductScore | null }) | null;
  warrantyScore: number;
  topCategories: { id: string; name: string; slug: string; count: number; avgScore: number }[];
}

export interface BrandDetailResponse {
  brand: Brand;
  products: (Product & { score?: ProductScore | null; priceInfo?: PriceInfo | null })[];
  stats: BrandStats;
  aiSummary: BrandAISummaryData;
  topicAverages: BrandTopicAverage[];
  competitorBrands: Brand[];
}

export interface HomeDataResponse {
  popularProducts: (Product & { score?: ProductScore | null })[];
  topRatedProducts: (Product & { score?: ProductScore | null })[];
  categories: Category[];
  categorySections?: CategorySectionData[];
  brands?: (Brand & { averageScore?: number; totalMentions?: number; bestProductSlug?: string; bestProductName?: string })[];
  stats: {
    totalProducts: number;
    totalMentions: number;
    totalSources: number;
  };
}

export type UserRole = 'admin' | 'user';

export interface UserPreferences {
  emailNotifications: boolean;
  priceDropAlerts: boolean;
  weeklyDigest: boolean;
  defaultCategory?: string;
  theme?: 'light' | 'system';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SystemSettings {
  siteTitle: string;
  metaDescription: string;
  aiModel: string;
  autoScrapeIntervalHours: number;
  confidenceThreshold: number;
  maintenanceMode: boolean;
  allowPublicReviews: boolean;
  geminiApiKeySet: boolean;
  customPrompts: {
    verdictPrompt: string;
    chronicIssuesPrompt: string;
    valueForMoneyPrompt: string;
  };
}

export interface AdminStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  totalReviews: number;
  totalMentions: number;
  aiAnalysisCount: number;
  systemHealth: 'HEALTHY' | 'WARNING' | 'MAINTENANCE';
  lastScrapedAt: string;
  activeUsersCount: number;
}
