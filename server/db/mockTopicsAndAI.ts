import { 
  ProductTopicScore, 
  AISummary, 
  Mention 
} from '../../src/types/index.js';

export const productTopicScoresCatalog: ProductTopicScore[] = [
  // iPhone 16 Pro
  {
    productId: 'prod-iphone-16-pro',
    topicId: 'top-camera',
    topicName: 'Kamera & Video',
    score: 9.6,
    mentionCount: 1420,
    positiveCount: 1280,
    negativeCount: 60,
    neutralCount: 80,
    sentimentRatio: 90,
    positiveHighlights: ['4K 120fps Dolby Vision video kalitesi rakipsiz', '5x telefoto portre çekimlerinde çok net'],
    negativeHighlights: ['Camera Control butonuna alışmak zaman alıyor']
  },
  {
    productId: 'prod-iphone-16-pro',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    score: 8.8,
    mentionCount: 980,
    positiveCount: 790,
    negativeCount: 90,
    neutralCount: 100,
    sentimentRatio: 81,
    positiveHighlights: ['15 Pro modeline göre gözle görülür +2 saat ekran süresi', 'Isınma sorunu çözülmüş'],
    negativeHighlights: ['Şarj hızı hala 30W civarında, Android rakiplerden yavaş']
  },
  {
    productId: 'prod-iphone-16-pro',
    topicId: 'top-performance',
    topicName: 'Performans & Hız',
    score: 9.8,
    mentionCount: 850,
    positiveCount: 820,
    negativeCount: 10,
    neutralCount: 20,
    sentimentRatio: 96,
    positiveHighlights: ['A18 Pro çip hiçbir oyunda veya 4K kurguda takılmıyor', 'Termal mimari serin tutuyor']
  },
  {
    productId: 'prod-iphone-16-pro',
    topicId: 'top-value',
    topicName: 'Fiyat / Fayda Dengesi',
    score: 6.8,
    mentionCount: 1100,
    positiveCount: 420,
    negativeCount: 450,
    neutralCount: 230,
    sentimentRatio: 38,
    negativeHighlights: ['Türkiye başlangıç fiyatı çok yüksek', '128GB baz hafıza Pro için az kalıyor']
  },

  // Samsung S24 Ultra
  {
    productId: 'prod-s24-ultra',
    topicId: 'top-display',
    topicName: 'Ekran & Parlaklık',
    score: 9.7,
    mentionCount: 1120,
    positiveCount: 1060,
    negativeCount: 20,
    neutralCount: 40,
    sentimentRatio: 95,
    positiveHighlights: ['Gorilla Armor yansıma önleyici kaplama güneşte inanılmaz fark yaratıyor', '2600 nit parlaklık']
  },
  {
    productId: 'prod-s24-ultra',
    topicId: 'top-camera',
    topicName: 'Kamera & Video',
    score: 9.1,
    mentionCount: 1300,
    positiveCount: 1120,
    negativeCount: 90,
    neutralCount: 90,
    sentimentRatio: 86,
    positiveHighlights: ['50MP 5x periskop lens ve 100x zoom başarısı', 'Doğal renk tonları']
  },
  {
    productId: 'prod-s24-ultra',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    score: 9.0,
    mentionCount: 890,
    positiveCount: 780,
    negativeCount: 50,
    neutralCount: 60,
    sentimentRatio: 88,
    positiveHighlights: ['5000 mAh pil ile rahat 1.5 gün kullanım', '45W hızlı şarj desteği']
  },

  // Samsung Galaxy A55 5G
  {
    productId: 'prod-samsung-a55',
    topicId: 'top-value',
    topicName: 'Fiyat / Fayda Dengesi',
    score: 9.4,
    mentionCount: 2100,
    positiveCount: 1920,
    negativeCount: 70,
    neutralCount: 110,
    sentimentRatio: 91,
    positiveHighlights: ['Metal çerçeve ve cam arka kapak amiral gemisi hissi veriyor', '4 yıl işletim sistemi güncelleme sözü']
  },
  {
    productId: 'prod-samsung-a55',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    score: 9.2,
    mentionCount: 1600,
    positiveCount: 1440,
    negativeCount: 60,
    neutralCount: 100,
    sentimentRatio: 90,
    positiveHighlights: ['Ekran süresi 8-9 saati rahat buluyor', 'Gün boyu yoğun kullanımda şarj endişesi yok']
  },

  // Apple MacBook Air M3
  {
    productId: 'prod-macbook-air-m3',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    score: 9.9,
    mentionCount: 820,
    positiveCount: 805,
    negativeCount: 5,
    neutralCount: 10,
    sentimentRatio: 98,
    positiveHighlights: ['Tüm gün şarj adaptörü taşımadan 15-18 saat çalışma süresi']
  },
  {
    productId: 'prod-macbook-air-m3',
    topicId: 'top-performance',
    topicName: 'Performans & Hız',
    score: 9.4,
    mentionCount: 760,
    positiveCount: 710,
    negativeCount: 20,
    neutralCount: 30,
    sentimentRatio: 93,
    positiveHighlights: ['Gündelik ofis, kod yazma ve Photoshop işlerinde anında tepki ve sıfır ısınma']
  },

  // Asus Zephyrus G14
  {
    productId: 'prod-asus-zephyrus-g14',
    topicId: 'top-display',
    topicName: 'Ekran & Parlaklık',
    score: 9.8,
    mentionCount: 620,
    positiveCount: 590,
    negativeCount: 10,
    neutralCount: 20,
    sentimentRatio: 95,
    positiveHighlights: ['3K OLED 120Hz ekranın renk doygunluğu ve siyah derinliği büyüleyici']
  },
  {
    productId: 'prod-asus-zephyrus-g14',
    topicId: 'top-performance',
    topicName: 'Performans & Hız',
    score: 9.3,
    mentionCount: 580,
    positiveCount: 510,
    negativeCount: 30,
    neutralCount: 40,
    sentimentRatio: 88,
    positiveHighlights: ['1.5 kg gövdede Cyberpunk ve render canavarı']
  },

  // Sony WH-1000XM5
  {
    productId: 'prod-sony-wh1000xm5',
    topicId: 'top-sound',
    topicName: 'Ses & Gürültü Engelleme (ANC)',
    score: 9.6,
    mentionCount: 1150,
    positiveCount: 1080,
    negativeCount: 30,
    neutralCount: 40,
    sentimentRatio: 94,
    positiveHighlights: ['Ofis konuşmalarını ve motor seslerini tamamen kesiyor', 'Ses sahnesi ve baslar çok doyurucu']
  },

  // Anker Liberty 4 NC
  {
    productId: 'prod-anker-liberty-4-nc',
    topicId: 'top-sound',
    topicName: 'Ses & Gürültü Engelleme (ANC)',
    score: 9.2,
    mentionCount: 1800,
    positiveCount: 1620,
    negativeCount: 80,
    neutralCount: 100,
    sentimentRatio: 90,
    positiveHighlights: ['Fiyatının 3 katı kulaklıklarla yarışan aktif gürültü engelleme', 'LDAC desteği']
  },
  {
    productId: 'prod-anker-liberty-4-nc',
    topicId: 'top-value',
    topicName: 'Fiyat / Fayda Dengesi',
    score: 9.8,
    mentionCount: 2050,
    positiveCount: 1980,
    negativeCount: 20,
    neutralCount: 50,
    sentimentRatio: 97,
    positiveHighlights: ['3.000 TL altına alınabilecek en donanımlı TWS kulaklık']
  },

  // Dreame L20 Ultra
  {
    productId: 'prod-dreame-l20-ultra',
    topicId: 'top-cleaning',
    topicName: 'Emiş Gücü & Temizlik',
    score: 9.6,
    mentionCount: 840,
    positiveCount: 790,
    negativeCount: 20,
    neutralCount: 30,
    sentimentRatio: 94,
    positiveHighlights: ['Uzanabilen paspas kolu süpürgelik kenarlarını tertemiz yapıyor', '7000 Pa çekim gücü']
  },

  // Roborock Q Revo
  {
    productId: 'prod-roborock-q-revo',
    topicId: 'top-cleaning',
    topicName: 'Emiş Gücü & Temizlik',
    score: 9.3,
    mentionCount: 1200,
    positiveCount: 1090,
    negativeCount: 40,
    neutralCount: 70,
    sentimentRatio: 91,
    positiveHighlights: ['Dönen iki yuvarlak paspas lekeleri çok iyi ovalıyor', 'Sıcak hava ile kurutma kokuyu önlüyor']
  },

  // Huawei Watch GT 4
  {
    productId: 'prod-huawei-watch-gt-4',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    score: 9.9,
    mentionCount: 1900,
    positiveCount: 1870,
    negativeCount: 10,
    neutralCount: 20,
    sentimentRatio: 98,
    positiveHighlights: ['Tam şarjla 10-14 gün kullanım şarj aletini unutturuyor']
  },
  {
    productId: 'prod-huawei-watch-gt-4',
    topicId: 'top-build',
    topicName: 'Malzeme & Ergonomi',
    score: 9.5,
    mentionCount: 1400,
    positiveCount: 1320,
    negativeCount: 30,
    neutralCount: 50,
    sentimentRatio: 94,
    positiveHighlights: ['Klasik İsviçre saati gibi şık sekizgen çelik kasa']
  },

  // Apple Watch Ultra 2
  {
    productId: 'prod-apple-watch-ultra-2',
    topicId: 'top-build',
    topicName: 'Malzeme & Ergonomi',
    score: 9.8,
    mentionCount: 950,
    positiveCount: 910,
    negativeCount: 15,
    neutralCount: 25,
    sentimentRatio: 96,
    positiveHighlights: ['Çizilmeyen safir cam ve havacılık sınıfı titanyum gövde', '3000 nit güneşte parlamayan ekran']
  },

  // TCL 55C755 Mini LED
  {
    productId: 'prod-tcl-55c755',
    topicId: 'top-display',
    topicName: 'Ekran & Parlaklık',
    score: 9.3,
    mentionCount: 920,
    positiveCount: 810,
    negativeCount: 40,
    neutralCount: 70,
    sentimentRatio: 88,
    positiveHighlights: ['500+ karartma bölgesiyle OLED seviyesine yakın kontrast ve yüksek parlaklık']
  },
  {
    productId: 'prod-tcl-55c755',
    topicId: 'top-value',
    topicName: 'Fiyat / Fayda Dengesi',
    score: 9.7,
    mentionCount: 1100,
    positiveCount: 1040,
    negativeCount: 20,
    neutralCount: 40,
    sentimentRatio: 95,
    positiveHighlights: ['Bu fiyata 144Hz VRR ve Mini-LED rakipsiz']
  }
];

export const aiSummariesCatalog: AISummary[] = [
  {
    id: 'ai-iphone-16-pro',
    productId: 'prod-iphone-16-pro',
    summaryType: 'overview',
    content: 'iPhone 16 Pro, 3.400\'den fazla kullanıcı görüşü ve inceleme analizine göre sınıfının en dengeli amiral gemisi cihazlarından biridir. Önceki nesilde (15 Pro) şikayet edilen ısınma problemi yeni termal mimari ile giderilmiş, pil ömrü belirgin biçimde uzatılmıştır. 4K 120fps video kaydı ve 5x telefoto lens profesyonel içerik üreticilerini memnun ederken, tek temel şikayet noktası yüksek Türkiye satış fiyatı ve 128GB baz depolama sınırıdır.',
    pros: [
      'Sektörün en iyi 4K 120fps video kaydı ve stüdyo kalitesinde mikrofonlar',
      '15 Pro\'ya göre ısınmayan ve 2 saat daha uzun giden batarya',
      'İnce ekran çerçeveleri ve ergonomik titanyum gövde',
      'A18 Pro çip ile kesintisiz yüksek performans'
    ],
    cons: [
      'Yüksek Türkiye satış fiyatı',
      'Pro modelinde hala 128GB baz hafıza sunulması',
      'Camera Control butonuna alışmanın birkaç gün gerektirmesi'
    ],
    idealFor: 'İçerik üreticileri, video odaklı kullanıcılar ve uzun yıllar değer kaybetmeyen amiral gemisi arayanlar.',
    notIdealFor: 'Sadece temel sosyal medya ve mesajlaşma için telefon arayan bütçe odaklı kullanıcılar.',
    keyTakeaway: 'Kamera ve pil iyileştirmesiyle 13/14 Pro kullanıcıları için çok net bir yükseltme adımı.',
    modelVersion: 'gemini-1.5-pro (NeDiyor Consensus v2.4)',
    createdAt: '2025-02-15T14:30:00Z'
  },
  {
    id: 'ai-s24-ultra',
    productId: 'prod-s24-ultra',
    summaryType: 'overview',
    content: 'Samsung Galaxy S24 Ultra, 2.800\'ün üzerinde kullanıcı incelemesinde özellikle Gorilla Armor yansıma önleyici ekranı ile devrim niteliğinde bulunuyor. Entegre S Pen not almayı ve hassas düzenlemeleri kolaylaştırırken, 7 yıl güncelleme garantisi uzun vadeli güven veriyor. Kasanın 232 gram ağırlığı ve köşeli formu bazı kullanıcılar için tek elle kullanımda zorluk yaratmaktadır.',
    pros: [
      'Yansımayı sıfıra indiren benzersiz parlama önleyici ekran',
      'Entegre S Pen kalemi ve üretkenlik araçları',
      '5000 mAh batarya ile tam gün üzeri rahat kullanım',
      '7 yıl boyunca tam işletim sistemi ve güvenlik güncellemesi desteği'
    ],
    cons: [
      '232 gram ağırlık ve köşeli tasarım elde baskı yapabiliyor',
      'Galaxy AI özelliklerinin bazıları internet bağlantısı gerektiriyor'
    ],
    idealFor: 'Çoklu görev yapan profesyoneller, not tutanlar, büyük ekran ve zoom kamerası sevenler.',
    notIdealFor: 'Kompakt ve hafif telefon tercih eden kullanıcılar.',
    keyTakeaway: 'Android dünyasının en yetenekli ve ekranıyla fark yaratan amiral gemisi.',
    modelVersion: 'gemini-1.5-pro (NeDiyor Consensus v2.4)',
    createdAt: '2025-02-14T09:15:00Z'
  },
  {
    id: 'ai-samsung-a55',
    productId: 'prod-samsung-a55',
    summaryType: 'overview',
    content: 'Samsung Galaxy A55 5G, 5.400\'den fazla doğrulanmış alıcı yorumunda orta segmentin en güvenilir telefonu olarak tanımlanıyor. Metal çerçeve ile artırılan dayanıklılık, 8-9 saatlik ekran süresi ve 4 büyük Android güncellemesi garantisi cihazın F/P lideri olmasını sağlamıştır. Kutudan şarj adaptörünün çıkmaması ve 25W şarj hızının rakiplerden yavaş kalması ana eleştiri noktalarıdır.',
    pros: [
      'Segmentinde nadir görülen kaliteli metal çerçeve ve Gorilla Glass Victus+ cam',
      'Çok iyi optimize edilmiş 5000 mAh batarya ile 1.5 - 2 gün kullanım',
      'Canlı ve parlak 120Hz Super AMOLED ekran',
      '4 yıl Android + 5 yıl güvenlik güncellemesi taahhüdü'
    ],
    cons: [
      'Kutu içeriğinde şarj adaptörü bulunmaması',
      'Ekran çerçevelerinin amiral gemilerine göre biraz kalın olması'
    ],
    idealFor: 'Bütçesini 20.000 TL altında tutarak uzun yıllar stabil ve sağlam telefon kullanmak isteyenler.',
    notIdealFor: 'Ultra hızlı şarj (67W+) veya en üst seviye mobil oyun grafiği isteyenler.',
    keyTakeaway: 'Orta segmentte hata yapma payını sıfıra indiren, güvenli ve uzun ömürlü bir tercih.',
    modelVersion: 'gemini-1.5-pro (NeDiyor Consensus v2.4)',
    createdAt: '2025-02-14T15:30:00Z'
  },
  {
    id: 'ai-huawei-watch-gt-4',
    productId: 'prod-huawei-watch-gt-4',
    summaryType: 'overview',
    content: 'Huawei Watch GT 4, 3.900\'den fazla inceleme ve yorumda lüks saat şıklığı ile 14 günlük pil ömrünü buluşturan en dengeli giyilebilir cihaz olarak öne çıkıyor. Hem iOS hem Android telefonlara tam uyumlu çalışması, TruSeen 5.5+ nabız hassasiyeti ve hoparlörden görüşme kalitesi çok beğenilmektedir. Üçüncü parti uygulama ekosisteminin Apple/Wear OS kadar zengin olmaması tek kısıtıdır.',
    pros: [
      'Gerçek kullanımda 10-14 gün süren benzersiz batarya dayanımı',
      'Sekizgen paslanmaz çelik kasa ile takım elbiseye dahi yakışan şık tasarım',
      'Hem iPhone hem Android cihazlarla sorunsuz Bluetooth bildirim ve çağrı desteği',
      'Gelişmiş uyku ve nabız takip doğruluğu'
    ],
    cons: [
      'iOS tarafında bildirimlere hazır mesajla yanıt verilememesi',
      'NFC ile Türkiye bankaları üzerinden temassız ödeme kısıtı'
    ],
    idealFor: 'Her gün saat şarj etmekten bıkan, klasik ve şık görünümlü saat arayan herkes.',
    notIdealFor: 'Saate bağımsız WhatsApp yüklemek veya LTE e-SIM kullanmak isteyenler.',
    keyTakeaway: 'Tasarım ve pil ömründe piyasanın en tatmin edici akıllı saati.',
    modelVersion: 'gemini-1.5-pro (NeDiyor Consensus v2.4)',
    createdAt: '2025-02-13T16:00:00Z'
  },
  {
    id: 'ai-tcl-55c755',
    productId: 'prod-tcl-55c755',
    summaryType: 'overview',
    content: 'TCL 55C755, 1.800\'den fazla kullanıcı ve teknoloji forumu tartışmasında 35.000 TL bandında Mini-LED teknolojisini sunan en avantajlı televizyon olarak değerlendirilmektedir. 500\'ün üzerindeki yerel karartma bölgesi siyah derinliğini artırırken, 144Hz VRR desteği ve dahili Onkyo subwoofer ses sistemi harici soundbar ihtiyacını azaltmaktadır.',
    pros: [
      '500+ yerel karartma bölgesi ile yüksek kontrast ve derin siyahlar',
      '1300 nit HDR parlaklığı ile aydınlık odalarda net görüntü',
      'PS5 ve PC oyuncuları için 144Hz VRR ve FreeSync Premium Pro',
      'Google TV arayüzü ile hızlı ve zengin uygulama desteği'
    ],
    cons: [
      'Geniş açılardan bakıldığında VA panel karakteristiği gereği hafif renk solması',
      'TCL dahili menü ayarlarının ince kalibrasyon gerektirmesi'
    ],
    idealFor: 'Film severler, yeni nesil konsol oyuncuları ve F/P Mini-LED arayanlar.',
    notIdealFor: 'Çok geniş L koltuklu salonlarda 178 derece yan açılardan TV izleyenler.',
    keyTakeaway: 'OLED fiyatına çıkmadan Mini-LED kontrastı arayanlar için en mantıklı televizyon.',
    modelVersion: 'gemini-1.5-pro (NeDiyor Consensus v2.4)',
    createdAt: '2025-02-14T12:00:00Z'
  }
];

export const mentionsCatalog: Mention[] = [
  {
    id: 'men-a55-1',
    productId: 'prod-samsung-a55',
    sourceId: 'src-donanimhaber',
    sourceName: 'DonanımHaber Forum',
    sourceType: 'TECH_FORUM',
    topicId: 'top-value',
    topicName: 'Fiyat / Fayda Dengesi',
    content: 'Metal kasa ve arka cam kalitesi A54\'e göre çağ atlamış. Exynos 1480 hiç ısınmıyor ve pil 2 günü zorluyor. 19 bine daha mantıklısı yok.',
    sentiment: 'POSITIVE',
    url: 'https://forum.donanimhaber.com/samsung-galaxy-a55-kullanici-kulubu--1582910',
    author: 'fiyat_performans_avcisi',
    publishDate: '2024-06-10T14:22:00Z'
  },
  {
    id: 'men-gt4-1',
    productId: 'prod-huawei-watch-gt-4',
    sourceId: 'src-eksisozluk',
    sourceName: 'Ekşi Sözlük',
    sourceType: 'SOCIAL_COMMUNITY',
    topicId: 'top-battery',
    topicName: 'Pil & Şarj Ömrü',
    content: 'Apple Watch\'u her akşam şarja takmaktan gına gelmişti, GT 4 aldım 12 gün oldu hala %25 şarjı var. Tasarımı da bildiğin çelik kol saati gibi.',
    sentiment: 'POSITIVE',
    url: 'https://eksisozluk.com/entry/161940212',
    author: 'kronometre_sever',
    publishDate: '2024-07-15T09:40:00Z'
  },
  {
    id: 'men-tcl-1',
    productId: 'prod-tcl-55c755',
    sourceId: 'src-youtube',
    sourceName: 'YouTube İncelemeleri',
    sourceType: 'VIDEO_REVIEWS',
    topicId: 'top-display',
    topicName: 'Ekran & Parlaklık',
    content: '500 local dimming bölgesi sayesinde altyazılarda parlama neredeyse sıfır. PS5 bağlayıp 120Hz açtığınızda tepki süresi harika.',
    sentiment: 'POSITIVE',
    url: 'https://youtube.com/watch?v=sampletclc755',
    author: 'Teknoloji Rehberi TV',
    publishDate: '2024-08-20T18:10:00Z'
  },
  {
    id: 'men-anker-1',
    productId: 'prod-anker-liberty-4-nc',
    sourceId: 'src-amazon',
    sourceName: 'Amazon TR Doğrulanmış Yorumlar',
    sourceType: 'ECOMMERCE_REVIEWS',
    topicId: 'top-sound',
    topicName: 'Ses & Gürültü Engelleme (ANC)',
    content: 'Metrobüste denedim, motor sesini ve uğultuyu bıçak gibi kesiyor. Uygulamasından özel ekolayzır ayarı yapınca ses kalitesi 10 bin liralık kulaklıklar gibi oluyor.',
    sentiment: 'POSITIVE',
    url: 'https://amazon.com.tr/product-reviews/anker-liberty-4-nc',
    author: 'Mehmet Y.',
    publishDate: '2024-09-12T11:05:00Z'
  }
];

export const productAlternativesCatalog = [
  {
    productId: 'prod-iphone-16-pro',
    alternativeProductId: 'prod-s24-ultra',
    similarityScore: 92,
    reason: 'Android tarafındaki en güçlü amiral gemisi alternatifi, S Pen ve yansıma önleyici ekran avantajı sunar.'
  },
  {
    productId: 'prod-s24-ultra',
    alternativeProductId: 'prod-iphone-16-pro',
    similarityScore: 92,
    reason: 'iOS ekosistemi ve video kaydı tarafındaki en güçlü amiral gemisi alternatifi.'
  },
  {
    productId: 'prod-samsung-a55',
    alternativeProductId: 'prod-poco-x6-pro',
    similarityScore: 88,
    reason: 'Oyun performansı ve daha hızlı şarj arayanlar için aynı bütçede güçlü alternatif.'
  },
  {
    productId: 'prod-macbook-air-m3',
    alternativeProductId: 'prod-huawei-matebook-d16',
    similarityScore: 84,
    reason: 'Windows tarafında geniş ekranlı ve yüksek işlemci güçlü daha uygun fiyatlı alternatif.'
  },
  {
    productId: 'prod-sony-wh1000xm5',
    alternativeProductId: 'prod-bose-qc-ultra',
    similarityScore: 94,
    reason: 'Katlanabilir gövde ve uzun süreli takmada daha hafif kafa konforu arayanlar için en yakın rakip.'
  },
  {
    productId: 'prod-apple-watch-ultra-2',
    alternativeProductId: 'prod-garmin-fenix-7-pro',
    similarityScore: 90,
    reason: 'Ekran yerine haftalar süren pil ömrü ve güneş enerjisi desteği arayan outdoor sporcuları için alternatif.'
  },
  {
    productId: 'prod-apple-watch-series-10',
    alternativeProductId: 'prod-huawei-watch-gt-4',
    similarityScore: 86,
    reason: 'Günlük şarj yerine 14 gün pil ömrü ve klasik saat zarafeti arayanlar için alternatif.'
  },
  {
    productId: 'prod-roborock-s8-pro',
    alternativeProductId: 'prod-dreame-l20-ultra',
    similarityScore: 93,
    reason: 'Dışa uzayan paspas kolu ve daha yüksek çekim gücü sunan üst düzey robot alternatif.'
  },
  {
    productId: 'prod-roborock-s8-pro',
    alternativeProductId: 'prod-roborock-q-revo',
    similarityScore: 89,
    reason: 'Aynı markadan benzer istasyon konforunu çok daha uygun fiyata sunan F/P alternatifi.'
  },
  {
    productId: 'prod-lg-c4-oled',
    alternativeProductId: 'prod-tcl-55c755',
    similarityScore: 85,
    reason: 'OLED yanığı endişesi olmadan yüksek parlaklık ve yarı fiyatına Mini-LED deneyimi.'
  }
];
