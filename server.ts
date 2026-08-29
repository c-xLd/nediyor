import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/database.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'NeDiyor API', version: '1.0.0' });
  });

  // Home page data
  app.get('/api/home', (req, res) => {
    try {
      const data = db.getHomeData();
      res.json(data);
    } catch (err: any) {
      console.error('[API] /api/home error:', err);
      res.status(500).json({ error: 'Ana sayfa verileri alınırken bir hata oluştu.' });
    }
  });

  // Search Autocomplete
  app.get('/api/search/autocomplete', (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      const categoryId = (req.query.categoryId as string) || undefined;
      const results = db.getAutocomplete(query, categoryId);
      res.json(results);
    } catch (err: any) {
      console.error('[API] /api/search/autocomplete error:', err);
      res.status(500).json({ error: 'Arama önerileri alınamadı.' });
    }
  });

  // Full Search & Advanced Filtering
  app.get('/api/search', (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      const category = (req.query.category as string) || undefined;
      
      // Parse brands (support comma-separated or multiple params)
      let brands: string[] = [];
      if (req.query.brands) {
        brands = (req.query.brands as string).split(',').map(b => b.trim()).filter(Boolean);
      } else if (req.query.brand && req.query.brand !== 'all') {
        brands = [(req.query.brand as string).trim()];
      }

      // Parse verdicts
      let verdicts: string[] = [];
      if (req.query.verdicts) {
        verdicts = (req.query.verdicts as string).split(',').map(v => v.trim()).filter(Boolean);
      } else if (req.query.verdict) {
        verdicts = [(req.query.verdict as string).trim()];
      }

      // Parse features
      let features: string[] = [];
      if (req.query.features) {
        features = (req.query.features as string).split(',').map(f => f.trim()).filter(Boolean);
      }

      const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
      const minScore = req.query.minScore ? Number(req.query.minScore) : undefined;
      const maxScore = req.query.maxScore ? Number(req.query.maxScore) : undefined;
      const minPositive = req.query.minPositive ? Number(req.query.minPositive) : undefined;
      const minMentions = req.query.minMentions ? Number(req.query.minMentions) : undefined;
      const discountOnly = req.query.discountOnly === 'true' || req.query.discountOnly === '1';
      const sort = (req.query.sort as string) || 'score_desc';

      const results = db.search({
        query,
        category,
        brands,
        minPrice,
        maxPrice,
        minScore,
        maxScore,
        verdicts,
        minPositive,
        minMentions,
        discountOnly,
        features,
        sort
      });

      res.json(results);
    } catch (err: any) {
      console.error('[API] /api/search error:', err);
      res.status(500).json({ error: 'Arama yapılırken bir hata oluştu.' });
    }
  });

  // Product Detail by Slug
  app.get('/api/products/:slug', (req, res) => {
    try {
      const { slug } = req.params;
      const product = db.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ error: 'Aradığınız ürün sistemimizde bulunamadı.' });
      }
      res.json(product);
    } catch (err: any) {
      console.error('[API] /api/products/:slug error:', err);
      res.status(500).json({ error: 'Ürün detayları yüklenemedi.' });
    }
  });

  // Categories list
  app.get('/api/categories', (req, res) => {
    try {
      const categories = db.getCategories();
      res.json(categories);
    } catch (err: any) {
      console.error('[API] /api/categories error:', err);
      res.status(500).json({ error: 'Kategoriler yüklenemedi.' });
    }
  });

  // Category detail with products
  app.get('/api/categories/:slug', (req, res) => {
    try {
      const { slug } = req.params;
      const result = db.getCategoryBySlug(slug);
      if (!result) {
        return res.status(404).json({ error: 'Kategori bulunamadı.' });
      }
      res.json(result);
    } catch (err: any) {
      console.error('[API] /api/categories/:slug error:', err);
      res.status(500).json({ error: 'Kategori detayları alınamadı.' });
    }
  });

  // Brands list
  app.get('/api/brands', (req, res) => {
    try {
      const brands = db.getBrands();
      res.json(brands);
    } catch (err: any) {
      console.error('[API] /api/brands error:', err);
      res.status(500).json({ error: 'Markalar yüklenemedi.' });
    }
  });

  // Brand detail with products
  app.get('/api/brands/:slug', (req, res) => {
    try {
      const { slug } = req.params;
      const result = db.getBrandBySlug(slug);
      if (!result) {
        return res.status(404).json({ error: 'Marka bulunamadı.' });
      }
      res.json(result);
    } catch (err: any) {
      console.error('[API] /api/brands/:slug error:', err);
      res.status(500).json({ error: 'Marka detayları alınamadı.' });
    }
  });

  // Compare products (supports 2, 3, or 4 products)
  app.get('/api/compare', (req, res) => {
    try {
      const p1 = req.query.p1 as string;
      const p2 = req.query.p2 as string;
      const p3 = req.query.p3 as string;
      const p4 = req.query.p4 as string;
      const rawProducts = req.query.products as string;

      const slugs: string[] = [];
      if (rawProducts) {
        slugs.push(...rawProducts.split(',').map(s => s.trim()));
      } else {
        if (p1) slugs.push(p1);
        if (p2) slugs.push(p2);
        if (p3) slugs.push(p3);
        if (p4) slugs.push(p4);
      }

      if (slugs.length < 2) {
        return res.status(400).json({ error: 'Karşılaştırma için en az iki ürün belirtilmelidir.' });
      }

      const multiComparison = db.getMultiComparison(slugs);
      if (!multiComparison || multiComparison.products.length < 2) {
        return res.status(404).json({ error: 'Karşılaştırılacak ürünler bulunamadı.' });
      }

      // Backward compatible shape plus full multi-compare data
      res.json({
        ...multiComparison,
        product1: multiComparison.products[0],
        product2: multiComparison.products[1]
      });
    } catch (err: any) {
      console.error('[API] /api/compare error:', err);
      res.status(400).json({ error: err.message || 'Karşılaştırma yapılırken hata oluştu.' });
    }
  });

  // Smart Product Finder API
  app.get('/api/finder', (req, res) => {
    try {
      const categoryId = (req.query.categoryId as string) || (req.query.category as string);
      const budgetTier = req.query.budgetTier as string;
      const maxBudget = req.query.maxBudget ? Number(req.query.maxBudget) : undefined;
      const priorityTopics = req.query.priorityTopics ? (req.query.priorityTopics as string).split(',') : undefined;

      const result = db.findProducts({
        categoryId,
        budgetTier,
        maxBudget,
        priorityTopics
      });
      res.json(result);
    } catch (err: any) {
      console.error('[API] /api/finder error:', err);
      res.status(500).json({ error: 'Ürün bulucu çalıştırılırken bir hata oluştu.' });
    }
  });

  // Post verified community review
  app.post('/api/products/:slug/reviews', (req, res) => {
    try {
      const { slug } = req.params;
      const { authorName, usageDuration, recommendation, rating, title, content, pros, cons, isVerifiedBuyer } = req.body;

      if (!title || !content || !rating || !usageDuration || !recommendation) {
        return res.status(400).json({ error: 'Lütfen tüm zorunlu alanları (puan, başlık, deneyim, kullanım süresi) doldurunuz.' });
      }

      const newReview = db.addCommunityReview(slug, {
        authorName: authorName || 'Doğrulanmış Kullanıcı',
        isVerifiedBuyer: isVerifiedBuyer ?? true,
        usageDuration,
        recommendation,
        rating: Number(rating),
        title,
        content,
        pros: Array.isArray(pros) ? pros : [],
        cons: Array.isArray(cons) ? cons : []
      });

      if (!newReview) {
        return res.status(404).json({ error: 'Ürün bulunamadı.' });
      }

      res.status(201).json(newReview);
    } catch (err: any) {
      console.error('[API] /api/products/:slug/reviews error:', err);
      res.status(500).json({ error: 'İnceleme kaydedilirken bir hata oluştu.' });
    }
  });

  // Upvote review helpfulness
  app.post('/api/reviews/:id/helpful', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.voteReviewHelpful(id);
      if (!success) {
        return res.status(404).json({ error: 'İnceleme bulunamadı.' });
      }
      res.json({ success: true });
    } catch (err: any) {
      console.error('[API] /api/reviews/:id/helpful error:', err);
      res.status(500).json({ error: 'Oy kaydedilemedi.' });
    }
  });

  // Ask Consensus (AI Assistant Q&A for Product)
  app.post('/api/products/:slug/ask', (req, res) => {
    try {
      const { slug } = req.params;
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Lütfen ürün hakkında sormak istediğiniz soruyu belirtiniz.' });
      }

      const answer = db.askConsensusQuestion(slug, question.trim());
      if (!answer) {
        return res.status(404).json({ error: 'Ürün bulunamadı.' });
      }

      res.json(answer);
    } catch (err: any) {
      console.error('[API] /api/products/:slug/ask error:', err);
      res.status(500).json({ error: 'Soru yanıtlanırken bir hata oluştu.' });
    }
  });

  // Product Community Buy Poll (Get and Vote)
  app.post('/api/products/:slug/poll', (req, res) => {
    try {
      const { slug } = req.params;
      const { choice } = req.body;
      if (!choice || !['buy', 'wait', 'skip'].includes(choice)) {
        return res.status(400).json({ error: 'Geçersiz oy seçimi.' });
      }

      const result = db.voteProductPoll(slug, choice as 'buy' | 'wait' | 'skip');
      if (!result) {
        return res.status(404).json({ error: 'Ürün bulunamadı.' });
      }

      res.json(result);
    } catch (err: any) {
      console.error('[API] /api/products/:slug/poll error:', err);
      res.status(500).json({ error: 'Oy kaydedilemedi.' });
    }
  });

  // Upgrade Advisor ("Yükseltmeye Değer mi?")
  app.get('/api/upgrade-advice', (req, res) => {
    try {
      const fromSlug = req.query.from as string;
      const toSlug = req.query.to as string;

      if (!fromSlug || !toSlug) {
        return res.status(400).json({ error: 'Lütfen mevcut (eski) ve hedef (yeni) ürünleri belirtiniz.' });
      }

      const advice = db.getUpgradeAdvice(fromSlug, toSlug);
      if (!advice) {
        return res.status(404).json({ error: 'Karşılaştırılacak ürünler bulunamadı.' });
      }

      res.json(advice);
    } catch (err: any) {
      console.error('[API] /api/upgrade-advice error:', err);
      res.status(500).json({ error: 'Yükseltme tavsiyesi hesaplanırken hata oluştu.' });
    }
  });

  // Deals and Lowest Price Radar
  app.get('/api/deals', (req, res) => {
    try {
      const deals = db.getDealsRadar();
      res.json(deals);
    } catch (err: any) {
      console.error('[API] /api/deals error:', err);
      res.status(500).json({ error: 'Fırsat radarı verileri alınamadı.' });
    }
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NeDiyor] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
