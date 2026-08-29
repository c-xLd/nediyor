import { PriceInfo, CommunityReview } from '../../src/types/index.js';

export function getProductPriceInfo(productId: string): PriceInfo {
  switch (productId) {
    case 'prod-iphone-16-pro':
      return {
        currentPrice: 82999,
        originalPrice: 85999,
        currency: 'TL',
        formattedPrice: '82.999 TL',
        lowestPrice: 81499,
        highestPrice: 89999,
        fpScore: 8.5,
        fpVerdict: 'İyi F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 81499,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Ücretsiz Aynı Gün Kargo (Prime)',
            sellerRating: 4.9
          },
          {
            storeName: 'Hepsiburada',
            price: 82499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Yarın Kapında',
            sellerRating: 4.8
          },
          {
            storeName: 'Trendyol',
            price: 82999,
            currency: 'TL',
            url: 'https://www.trendyol.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.7
          },
          {
            storeName: 'Apple Store TR',
            price: 85999,
            currency: 'TL',
            url: 'https://www.apple.com/tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Resmi Satıcı',
            sellerRating: 5.0
          }
        ],
        history: [
          { date: 'Eyl 24', price: 87999 },
          { date: 'Eki 24', price: 86499 },
          { date: 'Kas 24', price: 84999 },
          { date: 'Ara 24', price: 83999 },
          { date: 'Oca 25', price: 83499 },
          { date: 'Şub 25', price: 81499 }
        ]
      };

    case 'prod-s24-ultra':
      return {
        currentPrice: 69999,
        originalPrice: 74999,
        currency: 'TL',
        formattedPrice: '69.999 TL',
        lowestPrice: 67499,
        highestPrice: 76999,
        fpScore: 9.2,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Hepsiburada',
            price: 67499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Yarın Kapında & Hepsifinans İndirimi',
            sellerRating: 4.9
          },
          {
            storeName: 'Amazon TR',
            price: 68999,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Hızlı Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'Trendyol',
            price: 69499,
            currency: 'TL',
            url: 'https://www.trendyol.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          },
          {
            storeName: 'Samsung TR',
            price: 74999,
            currency: 'TL',
            url: 'https://www.samsung.com/tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Değişim Kampanyası + Kılıf Hediye',
            sellerRating: 5.0
          }
        ],
        history: [
          { date: 'Eyl 24', price: 74999 },
          { date: 'Eki 24', price: 72999 },
          { date: 'Kas 24', price: 70999 },
          { date: 'Ara 24', price: 69499 },
          { date: 'Oca 25', price: 68999 },
          { date: 'Şub 25', price: 67499 }
        ]
      };

    case 'prod-macbook-air-m3':
      return {
        currentPrice: 52999,
        originalPrice: 56999,
        currency: 'TL',
        formattedPrice: '52.999 TL',
        lowestPrice: 50999,
        highestPrice: 57999,
        fpScore: 9.5,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 50999,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Prime ile Aynı Gün Teslim',
            sellerRating: 4.9
          },
          {
            storeName: 'MediaMarkt',
            price: 52499,
            currency: 'TL',
            url: 'https://www.mediamarkt.com.tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Mağazadan Hemen Teslim',
            sellerRating: 4.7
          },
          {
            storeName: 'Hepsiburada',
            price: 52999,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 56999 },
          { date: 'Eki 24', price: 54999 },
          { date: 'Kas 24', price: 53499 },
          { date: 'Ara 24', price: 52999 },
          { date: 'Oca 25', price: 51999 },
          { date: 'Şub 25', price: 50999 }
        ]
      };

    case 'prod-sony-wh1000xm5':
      return {
        currentPrice: 14299,
        originalPrice: 16499,
        currency: 'TL',
        formattedPrice: '14.299 TL',
        lowestPrice: 13699,
        highestPrice: 16999,
        fpScore: 9.0,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 13699,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Prime Ücretsiz Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'D&R',
            price: 14199,
            currency: 'TL',
            url: 'https://www.dr.com.tr',
            isLowest: false,
            inStock: true,
            shippingInfo: '2 Günde Kargo',
            sellerRating: 4.6
          },
          {
            storeName: 'Hepsiburada',
            price: 14299,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Satıcı: Sony Resmi Mağaza',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 15499 },
          { date: 'Eki 24', price: 14999 },
          { date: 'Kas 24', price: 13999 },
          { date: 'Ara 24', price: 14499 },
          { date: 'Oca 25', price: 13999 },
          { date: 'Şub 25', price: 13699 }
        ]
      };

    case 'prod-dyson-v15':
      return {
        currentPrice: 29999,
        originalPrice: 32999,
        currency: 'TL',
        formattedPrice: '29.999 TL',
        lowestPrice: 28499,
        highestPrice: 33999,
        fpScore: 8.3,
        fpVerdict: 'Dengeli F/P',
        offers: [
          {
            storeName: 'Dyson TR Resmi',
            price: 28499,
            currency: 'TL',
            url: 'https://www.dyson.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: '2 Yıl Dyson Garantisi + Ek Başlık',
            sellerRating: 5.0
          },
          {
            storeName: 'MediaMarkt',
            price: 29499,
            currency: 'TL',
            url: 'https://www.mediamarkt.com.tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Aynı Gün Teslim',
            sellerRating: 4.7
          },
          {
            storeName: 'Hepsiburada',
            price: 29999,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 32999 },
          { date: 'Eki 24', price: 31499 },
          { date: 'Kas 24', price: 29999 },
          { date: 'Ara 24', price: 29499 },
          { date: 'Oca 25', price: 28999 },
          { date: 'Şub 25', price: 28499 }
        ]
      };

    case 'prod-roborock-s8-pro':
      return {
        currentPrice: 44999,
        originalPrice: 48999,
        currency: 'TL',
        formattedPrice: '44.999 TL',
        lowestPrice: 42999,
        highestPrice: 49999,
        fpScore: 8.9,
        fpVerdict: 'İyi F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 42999,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Resmi İthalatçı Garantili',
            sellerRating: 4.9
          },
          {
            storeName: 'Hepsiburada',
            price: 44499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Yarın Kapında',
            sellerRating: 4.8
          },
          {
            storeName: 'Trendyol',
            price: 44999,
            currency: 'TL',
            url: 'https://www.trendyol.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.7
          }
        ],
        history: [
          { date: 'Eyl 24', price: 47999 },
          { date: 'Eki 24', price: 46499 },
          { date: 'Kas 24', price: 44999 },
          { date: 'Ara 24', price: 43999 },
          { date: 'Oca 25', price: 43499 },
          { date: 'Şub 25', price: 42999 }
        ]
      };

    case 'prod-airfryer-xxl':
      return {
        currentPrice: 6799,
        originalPrice: 7899,
        currency: 'TL',
        formattedPrice: '6.799 TL',
        lowestPrice: 6399,
        highestPrice: 8299,
        fpScore: 9.7,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Hepsiburada',
            price: 6399,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Hepsiburada Satıcılı & Hızlı Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'Amazon TR',
            price: 6599,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Prime Ücretsiz Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'Trendyol',
            price: 6799,
            currency: 'TL',
            url: 'https://www.trendyol.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Philips Resmi Mağaza',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 7499 },
          { date: 'Eki 24', price: 7199 },
          { date: 'Kas 24', price: 6699 },
          { date: 'Ara 24', price: 6899 },
          { date: 'Oca 25', price: 6599 },
          { date: 'Şub 25', price: 6399 }
        ]
      };

    case 'prod-airpods-pro-2':
      return {
        currentPrice: 10499,
        originalPrice: 11499,
        currency: 'TL',
        formattedPrice: '10.499 TL',
        lowestPrice: 9799,
        highestPrice: 11999,
        fpScore: 9.3,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 9799,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Prime Hızlı Teslimat',
            sellerRating: 4.9
          },
          {
            storeName: 'Hepsiburada',
            price: 10199,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Yarın Kapında',
            sellerRating: 4.8
          },
          {
            storeName: 'Apple Store TR',
            price: 11499,
            currency: 'TL',
            url: 'https://www.apple.com/tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Lazer Baskı',
            sellerRating: 5.0
          }
        ],
        history: [
          { date: 'Eyl 24', price: 11299 },
          { date: 'Eki 24', price: 10799 },
          { date: 'Kas 24', price: 9999 },
          { date: 'Ara 24', price: 10299 },
          { date: 'Oca 25', price: 9999 },
          { date: 'Şub 25', price: 9799 }
        ]
      };

    case 'prod-nothing-phone-2a':
      return {
        currentPrice: 23499,
        originalPrice: 25999,
        currency: 'TL',
        formattedPrice: '23.499 TL',
        lowestPrice: 22499,
        highestPrice: 26499,
        fpScore: 9.6,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Hepsiburada',
            price: 22499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Resmi Distribütör Garantili',
            sellerRating: 4.9
          },
          {
            storeName: 'Trendyol',
            price: 23299,
            currency: 'TL',
            url: 'https://www.trendyol.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.7
          }
        ],
        history: [
          { date: 'Kas 24', price: 25499 },
          { date: 'Ara 24', price: 24299 },
          { date: 'Oca 25', price: 23799 },
          { date: 'Şub 25', price: 22499 }
        ]
      };

    case 'prod-lg-c4-oled':
      return {
        currentPrice: 64999,
        originalPrice: 69999,
        currency: 'TL',
        formattedPrice: '64.999 TL',
        lowestPrice: 61999,
        highestPrice: 72999,
        fpScore: 9.1,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'MediaMarkt',
            price: 61999,
            currency: 'TL',
            url: 'https://www.mediamarkt.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Ücretsiz Kurulum Dahil',
            sellerRating: 4.8
          },
          {
            storeName: 'Vatan Bilgisayar',
            price: 63999,
            currency: 'TL',
            url: 'https://www.vatanbilgisayar.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Hızlı Kargo',
            sellerRating: 4.7
          }
        ],
        history: [
          { date: 'Eyl 24', price: 69999 },
          { date: 'Eki 24', price: 67499 },
          { date: 'Kas 24', price: 64999 },
          { date: 'Ara 24', price: 63999 },
          { date: 'Oca 25', price: 62499 },
          { date: 'Şub 25', price: 61999 }
        ]
      };

    case 'prod-samsung-a55':
      return {
        currentPrice: 18999,
        originalPrice: 20999,
        currency: 'TL',
        formattedPrice: '18.999 TL',
        lowestPrice: 18499,
        highestPrice: 21999,
        fpScore: 9.4,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 18499,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'Hepsiburada',
            price: 18999,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Yarın Kapında',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 20499 },
          { date: 'Kas 24', price: 19499 },
          { date: 'Oca 25', price: 18999 },
          { date: 'Şub 25', price: 18499 }
        ]
      };

    case 'prod-huawei-watch-gt-4':
      return {
        currentPrice: 7299,
        originalPrice: 8499,
        currency: 'TL',
        formattedPrice: '7.299 TL',
        lowestPrice: 6999,
        highestPrice: 8999,
        fpScore: 9.6,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Huawei Online Mağaza',
            price: 7299,
            currency: 'TL',
            url: 'https://consumer.huawei.com/tr',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Hediye Kayış + Kargo Bedava',
            sellerRating: 4.9
          },
          {
            storeName: 'Amazon TR',
            price: 6999,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Prime Hızlı Teslimat',
            sellerRating: 4.9
          }
        ],
        history: [
          { date: 'Eki 24', price: 8199 },
          { date: 'Kas 24', price: 7499 },
          { date: 'Ara 24', price: 7299 },
          { date: 'Şub 25', price: 6999 }
        ]
      };

    case 'prod-anker-liberty-4-nc':
      return {
        currentPrice: 2999,
        originalPrice: 3499,
        currency: 'TL',
        formattedPrice: '2.999 TL',
        lowestPrice: 2799,
        highestPrice: 3599,
        fpScore: 9.7,
        fpVerdict: 'Üstün F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 2799,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Aynı Gün Teslimat',
            sellerRating: 4.9
          },
          {
            storeName: 'Hepsiburada',
            price: 2999,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eyl 24', price: 3299 },
          { date: 'Kas 24', price: 2899 },
          { date: 'Şub 25', price: 2799 }
        ]
      };

    case 'prod-tcl-55c755':
      return {
        currentPrice: 34999,
        originalPrice: 37999,
        currency: 'TL',
        formattedPrice: '34.999 TL',
        lowestPrice: 32999,
        highestPrice: 38999,
        fpScore: 9.3,
        fpVerdict: 'İyi F/P',
        offers: [
          {
            storeName: 'Teknosa',
            price: 34999,
            currency: 'TL',
            url: 'https://www.teknosa.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Ücretsiz Kurulum & Kargo',
            sellerRating: 4.7
          },
          {
            storeName: 'Hepsiburada',
            price: 33499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Yetkili Satıcı',
            sellerRating: 4.8
          }
        ],
        history: [
          { date: 'Eki 24', price: 37999 },
          { date: 'Kas 24', price: 34999 },
          { date: 'Oca 25', price: 33999 },
          { date: 'Şub 25', price: 33499 }
        ]
      };

    case 'prod-apple-watch-ultra-2':
      return {
        currentPrice: 44999,
        originalPrice: 48999,
        currency: 'TL',
        formattedPrice: '44.999 TL',
        lowestPrice: 43499,
        highestPrice: 49999,
        fpScore: 8.5,
        fpVerdict: 'Dengeli F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 43499,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.9
          },
          {
            storeName: 'Troy Apple Premium Reseller',
            price: 44999,
            currency: 'TL',
            url: 'https://www.troyestore.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Resmi Yetkili Satıcı',
            sellerRating: 4.9
          }
        ],
        history: [
          { date: 'Eyl 24', price: 47999 },
          { date: 'Kas 24', price: 45999 },
          { date: 'Şub 25', price: 43499 }
        ]
      };

    default:
      return {
        currentPrice: 19999,
        originalPrice: 21999,
        currency: 'TL',
        formattedPrice: '19.999 TL',
        lowestPrice: 18999,
        highestPrice: 22999,
        fpScore: 8.7,
        fpVerdict: 'İyi F/P',
        offers: [
          {
            storeName: 'Amazon TR',
            price: 18999,
            currency: 'TL',
            url: 'https://www.amazon.com.tr',
            isLowest: true,
            inStock: true,
            shippingInfo: 'Ücretsiz Kargo',
            sellerRating: 4.8
          },
          {
            storeName: 'Hepsiburada',
            price: 19499,
            currency: 'TL',
            url: 'https://www.hepsiburada.com',
            isLowest: false,
            inStock: true,
            shippingInfo: 'Hızlı Teslimat',
            sellerRating: 4.7
          }
        ],
        history: [
          { date: 'Eyl 24', price: 21999 },
          { date: 'Eki 24', price: 20999 },
          { date: 'Kas 24', price: 19999 },
          { date: 'Şub 25', price: 18999 }
        ]
      };
  }
}

export function getInitialCommunityReviews(productId: string): CommunityReview[] {
  switch (productId) {
    case 'prod-iphone-16-pro':
      return [
        {
          id: 'rev-ip16-1',
          productId: 'prod-iphone-16-pro',
          authorName: 'Emre K. (Yazılım Mühendisi)',
          isVerifiedBuyer: true,
          usageDuration: '1-6m',
          recommendation: 'recommend',
          rating: 9,
          title: 'iPhone 13 Pro\'dan geçiş yaptım, kamera ve pil sıçrama yapmış',
          content: 'Günlük yoğun Slack, kamera ve navigasyon kullanımında bile akşam eve %35 şarjla dönüyorum. Camera Control butonuna ilk 1 hafta alışamadım ama yatay modda zoom yaparken çok pratik. Titanyum hafifliği elde hissedilir fark yaratıyor.',
          pros: ['Uzun pil dayanımı', '5x telefoto netliği', 'Titanyum kasa hafifliği'],
          cons: ['Kamera kontrol butonu kılıfla bazen sert kalıyor', 'Fiyat seviyesi çok yüksek'],
          helpfulCount: 48,
          createdAt: '2025-01-18T14:20:00Z'
        },
        {
          id: 'rev-ip16-2',
          productId: 'prod-iphone-16-pro',
          authorName: 'Burcu S.',
          isVerifiedBuyer: true,
          usageDuration: '1-6m',
          recommendation: 'recommend',
          rating: 9,
          title: 'İçerik üreticileri için rakipsiz video performansı',
          content: '4K 120fps video ve stüdyo kalitesinde mikrofon kayıtları sayesinde dış çekimlerde harici ekipman taşımayı bıraktım. Isınma konusunda endişelerim vardı, 15 Pro serisindeki aşırı ısınma bu modelde tamamen çözülmüş.',
          pros: ['4K 120fps video kaydı', 'Sıfır ısınma sorunu', 'Güneş altında 2000 nit parlaklık'],
          cons: ['Kutudan şarj adaptörü çıkmıyor'],
          helpfulCount: 32,
          createdAt: '2025-02-02T10:15:00Z'
        }
      ];

    case 'prod-s24-ultra':
      return [
        {
          id: 'rev-s24-1',
          productId: 'prod-s24-ultra',
          authorName: 'Serdar T.',
          isVerifiedBuyer: true,
          usageDuration: '6-12m',
          recommendation: 'recommend',
          rating: 9,
          title: '7 aydır kullanıyorum: Yansıma önleyici ekranı başka hiçbir telefonda yok',
          content: 'Güneşin altında ekran sanki mat bir kağıt gibi, gözü hiç yormuyor. Galaxy AI çeviri ve daire içine alarak arama özelliği iş hayatımda her gün kullandığım bir araca dönüştü. S Pen not almak için harika.',
          pros: ['Yansıma yapmayan Gorilla Armor cam', '100x zoom ve gece modu', '7 yıl güncelleme garantisi'],
          cons: ['Cihaz gerçekten büyük ve köşeleri cebe batabiliyor'],
          helpfulCount: 56,
          createdAt: '2024-11-20T16:00:00Z'
        },
        {
          id: 'rev-s24-2',
          productId: 'prod-s24-ultra',
          authorName: 'Deniz Y.',
          isVerifiedBuyer: true,
          usageDuration: '>1y',
          recommendation: 'recommend',
          rating: 10,
          title: '1 yıldır ana telefonum, performansında zerre düşüş olmadı',
          content: 'Bataryası hala ilk günkü gibi 1.5 günü çıkarıyor. One UI 6.1 ve yapay zeka entegrasyonu telefonun kullanım zevkini artırdı.',
          pros: ['S Pen entegrasyonu', 'Üstün pil performansı', 'Hızlı arayüz'],
          cons: ['Hızlı şarj 45W ile sınırlı'],
          helpfulCount: 41,
          createdAt: '2025-01-05T09:40:00Z'
        }
      ];

    case 'prod-macbook-air-m3':
      return [
        {
          id: 'rev-mba-1',
          productId: 'prod-macbook-air-m3',
          authorName: 'Kaan A. (Tasarımcı & Danışman)',
          isVerifiedBuyer: true,
          usageDuration: '6-12m',
          recommendation: 'recommend',
          rating: 10,
          title: 'Şarj aletini evde unutsanız bile panik yapmayacağınız tek laptop',
          content: 'Figma, VS Code ve 30 Chrome sekmesi açıkken bile sessiz ve buz gibi çalışıyor. 14 saat kesintisiz çalışabildim. 16GB RAM konfigürasyonunu kesinlikle tavsiye ederim.',
          pros: ['16+ saat gerçek pil ömrü', 'Sıfır fan sesi', 'Kusursuz touchpad'],
          cons: ['Yalnızca 2 adet Type-C portu var'],
          helpfulCount: 64,
          createdAt: '2024-12-10T12:00:00Z'
        }
      ];

    case 'prod-sony-wh1000xm5':
      return [
        {
          id: 'rev-xm5-1',
          productId: 'prod-sony-wh1000xm5',
          authorName: 'Mert O.',
          isVerifiedBuyer: true,
          usageDuration: '>1y',
          recommendation: 'recommend',
          rating: 9,
          title: 'Ofiste ve uçakta hayat kurtarıcı',
          content: 'Açık ofisteki uğultuyu ve uçaktaki motor sesini tamamen siliyor. Kulak yastıkları yumuşacık, gözlükle takarken bile baş ağrısı yapmıyor. Tek eksiği katlanamaması.',
          pros: ['Dünyanın en iyi ANC performansı', '30 saat pil', 'Çoklu cihaz bağlantısı'],
          cons: ['Menteşeleri içe doğru katlanmıyor, taşıma kutusu büyük'],
          helpfulCount: 39,
          createdAt: '2024-10-15T18:30:00Z'
        }
      ];

    case 'prod-dyson-v15':
      return [
        {
          id: 'rev-v15-1',
          productId: 'prod-dyson-v15',
          authorName: 'Aylin Ç.',
          isVerifiedBuyer: true,
          usageDuration: '>1y',
          recommendation: 'recommend',
          rating: 9,
          title: 'Lazer başlığı temizlik standartlarımızı değiştirdi',
          content: 'Evde 2 kedimiz var. Lazer başlık parkede göremediğimiz tüm tüyleri yeşil ışıkla gösteriyor. Emiş gücü kablolu süpürgelerden daha kuvvetli. Ağırlığı tek elle uzun kullanımda biraz yorabiliyor.',
          pros: ['Lazer toz tespit başlığı', 'İnanılmaz emiş gücü', 'Kolay hazne boşaltma'],
          cons: ['Tetiğe basılı tutarak süpürmek gerekiyor', 'Biraz ağır'],
          helpfulCount: 72,
          createdAt: '2024-11-04T11:20:00Z'
        }
      ];

    case 'prod-airfryer-xxl':
      return [
        {
          id: 'rev-af-1',
          productId: 'prod-airfryer-xxl',
          authorName: 'Hatice D.',
          isVerifiedBuyer: true,
          usageDuration: '6-12m',
          recommendation: 'recommend',
          rating: 10,
          title: 'Fırını açmayı neredeyse bıraktık',
          content: '7.2 litrelik haznesi sayesinde bütün tavuk veya 4 kişilik köfte patatesi tek seferde pişiriyor. NutriU uygulamasıyla telefondan pişirme durumunu takip edebilmek büyük konfor. Parçaları bulaşık makinesinde kolayca yıkanıyor.',
          pros: ['Devasa 7.2L hazne', 'Çıtır ve yağsız pişirme', 'Wi-Fi bağlantılı akıllı kontrol'],
          cons: ['Tezgahta biraz fazla yer kaplıyor'],
          helpfulCount: 88,
          createdAt: '2024-12-28T19:40:00Z'
        }
      ];

    default:
      return [
        {
          id: `rev-${productId}-1`,
          productId,
          authorName: 'Doğrulanmış Kullanıcı',
          isVerifiedBuyer: true,
          usageDuration: '1-6m',
          recommendation: 'recommend',
          rating: 9,
          title: 'Beklentilerimi fazlasıyla karşıladı',
          content: 'Ürünü 4 aydır aktif olarak kullanıyorum. Malzeme kalitesi, performansı ve günlük hayattaki stabilitesi konsensüs puanını sonuna kadar hak ediyor.',
          pros: ['Yüksek performans', 'Kaliteli malzeme', 'Kolay kullanım'],
          cons: ['Fiyat dönemsel olarak dalgalanıyor'],
          helpfulCount: 15,
          createdAt: '2025-01-10T12:00:00Z'
        }
      ];
  }
}
