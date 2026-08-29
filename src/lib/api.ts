import { 
  HomeDataResponse, 
  SearchAutocompleteResult, 
  SearchResultsResponse, 
  ProductDetailData, 
  Category, 
  Brand,
  Product,
  MultiCompareResponse,
  ProductFinderResponse,
  CommunityReview,
  AskConsensusQuestionResponse,
  CommunityPollStats,
  UpgradeAdviceResponse,
  DealsResponse,
  User,
  AuthResponse,
  SystemSettings,
  AdminStats,
  SocialAuthProvider
} from '../types/index.js';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
  } catch (err: any) {
    throw new ApiError(err?.message || 'Ağ bağlantısı kurulamadı. Lütfen internetinizi kontrol edin.', 0);
  }

  if (!res.ok) {
    let errorMsg = 'Sunucu isteği başarısız oldu. Lütfen tekrar deneyin.';
    try {
      const data = await res.json();
      if (data) {
        if (typeof data.error === 'string') {
          errorMsg = data.error;
        } else if (typeof data.message === 'string') {
          errorMsg = data.message;
        } else if (data.error && typeof data.error === 'object') {
          errorMsg = data.error.message || data.error.msg || JSON.stringify(data.error);
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
      }
    } catch {
      // fallback to generic
    }
    throw new ApiError(errorMsg, res.status);
  }

  return res.json();
}

export const api = {
  async getHomeData(): Promise<HomeDataResponse> {
    return request<HomeDataResponse>('/api/home');
  },

  async getAutocomplete(query: string, categoryId?: string): Promise<SearchAutocompleteResult> {
    if (!query.trim()) {
      return { products: [], brands: [], categories: [] };
    }
    const params = new URLSearchParams({ q: query });
    if (categoryId) params.set('categoryId', categoryId);
    return request<SearchAutocompleteResult>(`/api/search/autocomplete?${params.toString()}`);
  },

  async search(params: {
    q?: string;
    category?: string;
    brand?: string;
    brands?: string[] | string;
    minPrice?: number;
    maxPrice?: number;
    minScore?: number;
    maxScore?: number;
    verdicts?: string[] | string;
    verdict?: string;
    minPositive?: number;
    minMentions?: number;
    discountOnly?: boolean;
    features?: string[] | string;
    sort?: string;
  }): Promise<SearchResultsResponse> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.category && params.category !== 'all') searchParams.set('category', params.category);
    
    // Multiple brands
    if (params.brands) {
      if (Array.isArray(params.brands) && params.brands.length > 0) {
        searchParams.set('brands', params.brands.join(','));
      } else if (typeof params.brands === 'string' && params.brands) {
        searchParams.set('brands', params.brands);
      }
    } else if (params.brand && params.brand !== 'all') {
      searchParams.set('brand', params.brand);
    }

    // Min / Max Price
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      searchParams.set('minPrice', params.minPrice.toString());
    }
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      searchParams.set('maxPrice', params.maxPrice.toString());
    }

    // Scores
    if (params.minScore !== undefined && !isNaN(params.minScore)) {
      searchParams.set('minScore', params.minScore.toString());
    }
    if (params.maxScore !== undefined && !isNaN(params.maxScore)) {
      searchParams.set('maxScore', params.maxScore.toString());
    }

    // Verdicts
    if (params.verdicts) {
      if (Array.isArray(params.verdicts) && params.verdicts.length > 0) {
        searchParams.set('verdicts', params.verdicts.join(','));
      } else if (typeof params.verdicts === 'string') {
        searchParams.set('verdicts', params.verdicts);
      }
    } else if (params.verdict && params.verdict !== 'all') {
      searchParams.set('verdict', params.verdict);
    }

    // Sentiment & Mentions
    if (params.minPositive !== undefined && !isNaN(params.minPositive)) {
      searchParams.set('minPositive', params.minPositive.toString());
    }
    if (params.minMentions !== undefined && !isNaN(params.minMentions)) {
      searchParams.set('minMentions', params.minMentions.toString());
    }

    // Discounts
    if (params.discountOnly) {
      searchParams.set('discountOnly', 'true');
    }

    // Hardware Features
    if (params.features) {
      if (Array.isArray(params.features) && params.features.length > 0) {
        searchParams.set('features', params.features.join(','));
      } else if (typeof params.features === 'string') {
        searchParams.set('features', params.features);
      }
    }

    // Sorting
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }

    return request<SearchResultsResponse>(`/api/search?${searchParams.toString()}`);
  },

  async getProductBySlug(slug: string): Promise<ProductDetailData> {
    return request<ProductDetailData>(`/api/products/${encodeURIComponent(slug)}`);
  },

  async getCategories(): Promise<Category[]> {
    return request<Category[]>('/api/categories');
  },

  async getCategoryBySlug(slug: string): Promise<{ category: Category; products: any[] }> {
    return request<{ category: Category; products: any[] }>(`/api/categories/${encodeURIComponent(slug)}`);
  },

  async getBrands(): Promise<Brand[]> {
    return request<Brand[]>('/api/brands');
  },

  async getBrandBySlug(slug: string): Promise<{ brand: Brand; products: any[] }> {
    return request<{ brand: Brand; products: any[] }>(`/api/brands/${encodeURIComponent(slug)}`);
  },

  async getComparison(p1: string, p2: string): Promise<{ product1: ProductDetailData; product2: ProductDetailData }> {
    return request<{ product1: ProductDetailData; product2: ProductDetailData }>(
      `/api/compare?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`
    );
  },

  async getMultiComparison(slugs: string[]): Promise<MultiCompareResponse> {
    const params = new URLSearchParams();
    slugs.forEach((slug, idx) => {
      params.set(`p${idx + 1}`, slug);
    });
    return request<MultiCompareResponse>(`/api/compare?${params.toString()}`);
  },

  async findProducts(params: {
    categoryId?: string;
    budgetTier?: string;
    maxBudget?: number;
    priorityTopics?: string[];
  }): Promise<ProductFinderResponse> {
    const searchParams = new URLSearchParams();
    if (params.categoryId && params.categoryId !== 'all') searchParams.set('categoryId', params.categoryId);
    if (params.budgetTier) searchParams.set('budgetTier', params.budgetTier);
    if (params.maxBudget) searchParams.set('maxBudget', params.maxBudget.toString());
    if (params.priorityTopics && params.priorityTopics.length > 0) {
      searchParams.set('priorityTopics', params.priorityTopics.join(','));
    }

    return request<ProductFinderResponse>(`/api/finder?${searchParams.toString()}`);
  },

  async submitCommunityReview(slug: string, review: {
    authorName: string;
    isVerifiedBuyer?: boolean;
    usageDuration: '<1m' | '1-6m' | '6-12m' | '>1y';
    recommendation: 'recommend' | 'neutral' | 'not_recommend';
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
  }): Promise<CommunityReview> {
    return request<CommunityReview>(`/api/products/${encodeURIComponent(slug)}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review)
    });
  },

  async voteReviewHelpful(reviewId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/reviews/${encodeURIComponent(reviewId)}/helpful`, {
      method: 'POST'
    });
  },

  async askConsensus(slug: string, question: string): Promise<AskConsensusQuestionResponse> {
    return request<AskConsensusQuestionResponse>(`/api/products/${encodeURIComponent(slug)}/ask`, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  },

  async votePoll(slug: string, choice: 'buy' | 'wait' | 'skip'): Promise<CommunityPollStats> {
    return request<CommunityPollStats>(`/api/products/${encodeURIComponent(slug)}/poll`, {
      method: 'POST',
      body: JSON.stringify({ choice })
    });
  },

  async getUpgradeAdvice(fromSlug: string, toSlug: string): Promise<UpgradeAdviceResponse> {
    return request<UpgradeAdviceResponse>(
      `/api/upgrade-advice?from=${encodeURIComponent(fromSlug)}&to=${encodeURIComponent(toSlug)}`
    );
  },

  async getDeals(): Promise<DealsResponse> {
    return request<DealsResponse>('/api/deals');
  },

  // Auth Methods
  async login(email: string, password?: string): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(name: string, email: string, password?: string, role?: 'admin' | 'user'): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
  },

  async socialLogin(data: {
    provider: SocialAuthProvider;
    name?: string;
    email?: string;
    avatarUrl?: string;
    providerId?: string;
  }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/social-login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async toggleSocialProvider(userId: string, provider: SocialAuthProvider, action: 'connect' | 'disconnect'): Promise<{ user: User; message: string }> {
    return request<{ user: User; message: string }>('/api/auth/social-toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, provider, action })
    });
  },

  async getCurrentUser(token?: string, userId?: string): Promise<{ user: User }> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request<{ user: User }>(`/api/auth/me${params}`, { headers });
  },

  async updateProfile(userData: Partial<User> & { id: string; password?: string }): Promise<{ user: User; message: string }> {
    return request<{ user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Admin Methods
  async getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/api/admin/stats');
  },

  async getAdminSettings(): Promise<SystemSettings> {
    return request<SystemSettings>('/api/admin/settings');
  },

  async updateAdminSettings(settings: Partial<SystemSettings>): Promise<{ settings: SystemSettings; message: string }> {
    return request<{ settings: SystemSettings; message: string }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  async getAdminBrands(): Promise<(Brand & { averageScore: number; productCount: number; totalMentions: number })[]> {
    return request<(Brand & { averageScore: number; productCount: number; totalMentions: number })[]>('/api/admin/brands');
  },

  async createAdminBrand(brandData: { name: string; slug?: string; originCountry?: string; description?: string; logoUrl?: string }): Promise<{ brand: Brand; message: string }> {
    return request<{ brand: Brand; message: string }>('/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify(brandData)
    });
  },

  async updateAdminBrand(id: string, brandData: Partial<Brand>): Promise<{ brand: Brand; message: string }> {
    return request<{ brand: Brand; message: string }>(`/api/admin/brands/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(brandData)
    });
  },

  async deleteAdminBrand(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/brands/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  async getAdminProducts(): Promise<(Product & { score?: any; reviewCount: number })[]> {
    return request<(Product & { score?: any; reviewCount: number })[]>('/api/admin/products');
  },

  async createAdminProduct(productData: any): Promise<{ product: ProductDetailData; message: string }> {
    return request<{ product: ProductDetailData; message: string }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateAdminProduct(id: string, productData: any): Promise<{ product: ProductDetailData; message: string }> {
    return request<{ product: ProductDetailData; message: string }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteAdminProduct(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  async triggerAIAnalyze(id: string): Promise<{ product: ProductDetailData; message: string }> {
    return request<{ product: ProductDetailData; message: string }>(`/api/admin/products/${encodeURIComponent(id)}/analyze`, {
      method: 'POST'
    });
  },

  async testAIPrompt(promptTemplate: string, testInput: string): Promise<{ output: string; model: string; executionTimeMs: number; tokensUsed: number }> {
    return request<{ output: string; model: string; executionTimeMs: number; tokensUsed: number }>('/api/admin/ai/test-prompt', {
      method: 'POST',
      body: JSON.stringify({ promptTemplate, testInput })
    });
  }
};

