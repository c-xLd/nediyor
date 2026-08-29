import { 
  Brand, 
  Category, 
  Product, 
  ProductScore, 
  Topic, 
  ProductTopicScore, 
  Source, 
  Mention, 
  AISummary 
} from '../../src/types/index.js';

export const brandsList: Brand[] = [
  {
    id: 'brand-apple',
    name: 'Apple',
    slug: 'apple',
    originCountry: 'ABD',
    description: 'Akıllı telefon, bilgisayar, tablet ve giyilebilir teknoloji üreticisi.'
  },
  {
    id: 'brand-samsung',
    name: 'Samsung',
    slug: 'samsung',
    originCountry: 'Güney Kore',
    description: 'Ekran, mobil cihaz, tüketici elektroniği ve ev aletleri devi.'
  },
  {
    id: 'brand-sony',
    name: 'Sony',
    slug: 'sony',
    originCountry: 'Japonya',
    description: 'Ses sistemleri, kulaklık, kamera ve oyun konsolları üreticisi.'
  },
  {
    id: 'brand-dyson',
    name: 'Dyson',
    slug: 'dyson',
    originCountry: 'İngiltere',
    description: 'Yenilikçi hava akımı, kablosuz süpürge ve saç bakım teknolojileri.'
  },
  {
    id: 'brand-xiaomi',
    name: 'Xiaomi',
    slug: 'xiaomi',
    originCountry: 'Çin',
    description: 'Fiyat/performans odaklı akıllı telefonlar ve akıllı ev ekosistemi.'
  },
  {
    id: 'brand-roborock',
    name: 'Roborock',
    slug: 'roborock',
    originCountry: 'Çin',
    description: 'Gelişmiş navigasyonlu robot süpürge ve paspas sistemleri.'
  },
  {
    id: 'brand-philips',
    name: 'Philips',
    slug: 'philips',
    originCountry: 'Hollanda',
    description: 'Sağlık, mutfak aletleri ve kişisel bakım ürünleri markası.'
  },
  {
    id: 'brand-asus',
    name: 'Asus',
    slug: 'asus',
    originCountry: 'Tayvan',
    description: 'Oyuncu bilgisayarları, anakartlar ve taşınabilir laptoplar.'
  },
  {
    id: 'brand-bose',
    name: 'Bose',
    slug: 'bose',
    originCountry: 'ABD',
    description: 'Gürültü engelleme ve akustik ses teknolojileri uzmanı.'
  },
  {
    id: 'brand-lg',
    name: 'LG',
    slug: 'lg',
    originCountry: 'Güney Kore',
    description: 'OLED TV, beyaz eşya ve ekran teknolojileri üreticisi.'
  },
  {
    id: 'brand-nothing',
    name: 'Nothing',
    slug: 'nothing',
    originCountry: 'İngiltere',
    description: 'Şeffaf tasarımlı ve yenilikçi akıllı telefon ve kulaklık üreticisi.'
  },
  {
    id: 'brand-huawei',
    name: 'Huawei',
    slug: 'huawei',
    originCountry: 'Çin',
    description: 'Akıllı saat, laptop ve iletişim teknolojileri öncüsü.'
  },
  {
    id: 'brand-lenovo',
    name: 'Lenovo',
    slug: 'lenovo',
    originCountry: 'Çin',
    description: 'ThinkPad iş ve Legion oyuncu bilgisayarları üreticisi.'
  },
  {
    id: 'brand-dell',
    name: 'Dell',
    slug: 'dell',
    originCountry: 'ABD',
    description: 'XPS ve Alienware serisi yüksek performanslı bilgisayarlar.'
  },
  {
    id: 'brand-tcl',
    name: 'TCL',
    slug: 'tcl',
    originCountry: 'Çin',
    description: 'Mini LED ve yüksek yenileme hızlı televizyon teknolojileri.'
  },
  {
    id: 'brand-garmin',
    name: 'Garmin',
    slug: 'garmin',
    originCountry: 'ABD',
    description: 'Profesyonel outdoor ve dayanıklı GPS spor saatleri.'
  },
  {
    id: 'brand-dreame',
    name: 'Dreame',
    slug: 'dreame',
    originCountry: 'Çin',
    description: 'Yüksek emiş güçlü robot süpürge ve ıslak temizleme robotları.'
  },
  {
    id: 'brand-sennheiser',
    name: 'Sennheiser',
    slug: 'sennheiser',
    originCountry: 'Almanya',
    description: 'Odyofil ses deneyimi ve stüdyo referans kulaklıkları.'
  },
  {
    id: 'brand-anker',
    name: 'Anker',
    slug: 'anker',
    originCountry: 'ABD / Çin',
    description: 'Soundcore kulaklık, şarj cihazı ve akıllı ev aksesuarları.'
  },
  {
    id: 'brand-jbl',
    name: 'JBL',
    slug: 'jbl',
    originCountry: 'ABD',
    description: 'Güçlü bas karakterli taşınabilir Bluetooth hoparlör ve kulaklıklar.'
  },
  {
    id: 'brand-tefal',
    name: 'Tefal',
    slug: 'tefal',
    originCountry: 'Fransa',
    description: 'Akıllı elektrikli ızgara, pişirici ve küçük ev aletleri.'
  },
  {
    id: 'brand-delonghi',
    name: 'DeLonghi',
    slug: 'delonghi',
    originCountry: 'İtalya',
    description: 'Çekirdekten fincana tam otomatik İtalyan kahve makineleri.'
  }
];

export const categoriesList: Category[] = [
  {
    id: 'cat-phones',
    name: 'Akıllı Telefonlar',
    slug: 'akilli-telefonlar',
    icon: 'Smartphone',
    description: 'Amiral gemisi ve orta segment cep telefonları analizleri.',
    isActive: true
  },
  {
    id: 'cat-laptops',
    name: 'Dizüstü Bilgisayarlar',
    slug: 'dizustu-bilgisayarlar',
    icon: 'Laptop',
    description: 'Ultrabook, iş istasyonu ve oyuncu laptopları.',
    isActive: true
  },
  {
    id: 'cat-audio',
    name: 'Kulaklık & Ses',
    slug: 'kulaklik-ve-ses',
    icon: 'Headphones',
    description: 'Kablosuz kulaklık, ANC kulak üstü modeller ve hoparlörler.',
    isActive: true
  },
  {
    id: 'cat-robot-vacuums',
    name: 'Robot Süpürgeler',
    slug: 'robot-supurgeler',
    icon: 'Bot',
    description: 'Haritalama özellikli ve istasyonlu akıllı robot süpürgeler.',
    isActive: true
  },
  {
    id: 'cat-home-appliances',
    name: 'Ev Aletleri & Süpürgeler',
    slug: 'ev-aletleri',
    icon: 'Sparkles',
    description: 'Şarjlı dikey süpürgeler, hava temizleyiciler ve mutfak aletleri.',
    isActive: true
  },
  {
    id: 'cat-smartwatches',
    name: 'Akıllı Saatler',
    slug: 'akilli-saatler',
    icon: 'Watch',
    description: 'Sağlık takibi, spor ve günlük kullanım akıllı saatleri.',
    isActive: true
  },
  {
    id: 'cat-tvs',
    name: 'Televizyonlar',
    slug: 'televizyonlar',
    icon: 'Tv',
    description: 'OLED, Neo QLED ve 4K akıllı televizyon modelleri.',
    isActive: true
  }
];

export const sourcesList: Source[] = [
  {
    id: 'src-eksisozluk',
    name: 'Ekşi Sözlük',
    domain: 'eksisozluk.com',
    sourceType: 'SOCIAL_COMMUNITY',
    reliabilityScore: 88,
    icon: 'MessageSquare'
  },
  {
    id: 'src-youtube',
    name: 'YouTube İncelemeleri',
    domain: 'youtube.com',
    sourceType: 'VIDEO_REVIEWS',
    reliabilityScore: 92,
    icon: 'Youtube'
  },
  {
    id: 'src-hepsiburada',
    name: 'Hepsiburada Değerlendirmeleri',
    domain: 'hepsiburada.com',
    sourceType: 'ECOMMERCE_REVIEWS',
    reliabilityScore: 90,
    icon: 'ShoppingBag'
  },
  {
    id: 'src-trendyol',
    name: 'Trendyol Yorumları',
    domain: 'trendyol.com',
    sourceType: 'ECOMMERCE_REVIEWS',
    reliabilityScore: 86,
    icon: 'ShoppingBag'
  },
  {
    id: 'src-sikayetvar',
    name: 'Şikayetvar Kronik Bildirimler',
    domain: 'sikayetvar.com',
    sourceType: 'COMPLAINT_PLATFORM',
    reliabilityScore: 94,
    icon: 'AlertTriangle'
  },
  {
    id: 'src-amazon',
    name: 'Amazon TR Doğrulanmış Yorumlar',
    domain: 'amazon.com.tr',
    sourceType: 'ECOMMERCE_REVIEWS',
    reliabilityScore: 95,
    icon: 'CheckCircle'
  },
  {
    id: 'src-donanimhaber',
    name: 'DonanımHaber Forum',
    domain: 'forum.donanimhaber.com',
    sourceType: 'TECH_FORUM',
    reliabilityScore: 89,
    icon: 'Cpu'
  }
];

export const topicsList: Topic[] = [
  { id: 'top-camera', name: 'Kamera & Video', slug: 'kamera', displayOrder: 1 },
  { id: 'top-battery', name: 'Pil & Şarj Ömrü', slug: 'pil-omru', displayOrder: 2 },
  { id: 'top-display', name: 'Ekran & Parlaklık', slug: 'ekran', displayOrder: 3 },
  { id: 'top-performance', name: 'Performans & Hız', slug: 'performans', displayOrder: 4 },
  { id: 'top-build', name: 'Malzeme & Ergonomi', slug: 'malzeme-kalitesi', displayOrder: 5 },
  { id: 'top-sound', name: 'Ses & Gürültü Engelleme (ANC)', slug: 'ses-kalitesi', displayOrder: 6 },
  { id: 'top-cleaning', name: 'Emiş Gücü & Temizlik', slug: 'emis-gucu', displayOrder: 7 },
  { id: 'top-app', name: 'Yazılım & Uygulama Deneyimi', slug: 'yazilim', displayOrder: 8 },
  { id: 'top-value', name: 'Fiyat / Fayda Dengesi', slug: 'fiyat-fayda', displayOrder: 9 },
  { id: 'top-health', name: 'Sağlık & Spor Takibi', slug: 'saglik-spor', displayOrder: 10 }
];
