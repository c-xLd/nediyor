import { 
  ChronicIssuesAndWarrantyData, 
  CommunityPollStats, 
  AskConsensusQuestionResponse,
  UpgradeAdviceResponse,
  DealItem,
  DealsResponse,
  ProductDetailData
} from '../../src/types/index.js';

// 1. CHRONIC ISSUES AND WARRANTY PROFILES
export function getProductChronicAndWarranty(productId: string, productName: string): ChronicIssuesAndWarrantyData {
  switch (productId) {
    case 'prod-iphone-16-pro':
      return {
        chronicIssues: [
          {
            id: 'ci-1',
            title: 'Kamera Denetimi Butonu Alışma Süreci',
            severity: 'low',
            frequencyRate: 18,
            status: 'ongoing',
            statusLabel: 'Kullanım Alışkanlığı',
            description: 'Yeni dokunmatik kamera denetim butonunun kılıf takılıyken bazen istemsiz tetiklenmesi veya çift tıklama hassasiyeti ayarı gerektirmesi.',
            workaroundOrAdvice: 'Ayarlar > Erişilebilirlik > Kamera Denetimi menüsünden basma basıncını "Daha Sert" olarak ayarlamak istemsiz açılmaları önlüyor.'
          },
          {
            id: 'ci-2',
            title: 'İlk Kurulumda Geçici Isınma',
            severity: 'low',
            frequencyRate: 12,
            status: 'resolved_update',
            statusLabel: 'Yazılımla Çözüldü (iOS 18.1+)',
            description: 'iCloud yedeği geri yüklenirken arka planda fotoğraf indeksleme kaynaklı ilk 24-48 saat hissedilen sıcaklık artışı.',
            workaroundOrAdvice: 'İndeksleme tamamlandıktan sonra A18 Pro ve yeni grafit termal katman sayesinde cihaz serin çalışmaktadır.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 92,
          avgRepairDays: '3-5 İş Günü',
          warrantyBadge: '2 Yıl Apple Türkiye Garantili (Zorlu / Akasya / Troy)',
          commonServiceFeedback: 'Apple Store randevusu alındığında ekran ve batarya değişimleri aynı gün içinde tamamlanabiliyor. Garanti içi parça değişimlerinde kullanıcı memnuniyeti yüksek.',
          userRightsScore: 9.4,
          partsAvailability: 'Yuksek',
          doaReplacementEase: 'Kolay'
        },
        reliability: {
          batteryHealthDropAfterYear: 'Yılda ortalama %6-9 kapasite kaybı (80W optimize şarj ile)',
          cosmeticDurability: '5. Nesil Titanyum çerçeve çizilmelere karşı iPhone 15 Pro serisine göre çok daha dayanıklı.',
          hardwareLifespanScore: 9.6,
          riskScore: 1.4,
          riskLevel: 'Düşük Risk',
          riskSummary: 'Donanım arızası veya kronik anakart/ekran arıza oranı binde 2 seviyesinde olup piyasadaki en güvenilir amiral gemilerindendir.'
        }
      };

    case 'prod-s24-ultra':
      return {
        chronicIssues: [
          {
            id: 'ci-s24-1',
            title: 'Yansıma Önleyici Ekranın Oleofobik Kaplaması',
            severity: 'low',
            frequencyRate: 9,
            status: 'ongoing',
            statusLabel: 'Bakım Gerektirir',
            description: 'Corning Gorilla Armor ekran camı yansımayı muhteşem engeller ancak alkollü mendillerle sert silindiğinde kaplamada lekelenme riski olabilir.',
            workaroundOrAdvice: 'Sadece mikrofiber bez ve özel ekran temizleme spreyi kullanılması veya mat yansıma önleyici kaliteli koruyucu tercih edilmesi önerilir.'
          },
          {
            id: 'ci-s24-2',
            title: 'Canlı Renk Profili Tercihi',
            severity: 'low',
            frequencyRate: 15,
            status: 'resolved_update',
            statusLabel: 'Yazılımla Çözüldü (One UI 6.1.1)',
            description: 'Doğal renk kalibrasyonunu soluk bulan kullanıcılar için Samsung canlılık kaydırıcısını yazılım güncellemesiyle ekledi.',
            workaroundOrAdvice: 'Ekran ayarlarından "Gelişmiş Canlılık" ayarını 2. veya 3. kademeye getirebilirsiniz.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 85,
          avgRepairDays: '4-7 İş Günü',
          warrantyBadge: '2 Yıl Samsung Türkiye Garantili (Yetkili Servisler & Kapıda Servis)',
          commonServiceFeedback: 'Samsung Türkiye yetkili servis ağı geniştir. Ekran kırılmalarında Samsung Care+ varsa hızlı onarım sağlanmaktadır.',
          userRightsScore: 8.8,
          partsAvailability: 'Yuksek',
          doaReplacementEase: 'Orta'
        },
        reliability: {
          batteryHealthDropAfterYear: 'Yılda ortalama %7-10 kapasite kaybı (7 yıl güncelleme garantisi mevcut)',
          cosmeticDurability: 'Düz titanyum kasa ve Gorilla Armor cam, düşmelere ve cep içi sürtünmelere karşı oldukça dirençli.',
          hardwareLifespanScore: 9.4,
          riskScore: 1.8,
          riskLevel: 'Düşük Risk',
          riskSummary: 'Snapdragon 8 Gen 3 for Galaxy çipi son derece dengeli termal performans sergiler, donanımsal risk minimum düzeydedir.'
        }
      };

    case 'prod-macbook-pro-m3':
      return {
        chronicIssues: [
          {
            id: 'ci-mbp-1',
            title: '8GB / 18GB Birleşik Bellek Tüketimi',
            severity: 'medium',
            frequencyRate: 14,
            status: 'ongoing',
            statusLabel: 'Konfigürasyon Tercihi',
            description: 'Çok ağır After Effects ve Docker konteyner işlerinde baz bellek modellerinde Swap SSD kullanımının artması.',
            workaroundOrAdvice: 'Profesyonel video kurgusu veya ağır yazılım geliştirme için en az 18GB veya 36GB konfigürasyon tercih edilmelidir.'
          },
          {
            id: 'ci-mbp-2',
            title: 'Uzay Siyahı (Space Black) Yüzey Parmak İzi',
            severity: 'low',
            frequencyRate: 22,
            status: 'partially_fixed',
            statusLabel: 'Geliştirildi',
            description: 'Eloksallı parmak izi önleyici kaplama M2 serisine göre belirgin iyileşse de terli ellerde hafif iz bırakabilmektedir.',
            workaroundOrAdvice: 'Kuru mikrofiber bezle saniyeler içinde temizlenmektedir.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 94,
          avgRepairDays: '3-6 İş Günü',
          warrantyBadge: '2 Yıl Apple Türkiye Garantili + AppleCare+ Destekli',
          commonServiceFeedback: 'Klavye ve ekran arızalarında komple kasa/ekran değişimi yapılmakta, servis kalitesi sektör lideridir.',
          userRightsScore: 9.5,
          partsAvailability: 'Yuksek',
          doaReplacementEase: 'Kolay'
        },
        reliability: {
          batteryHealthDropAfterYear: '1000 şarj döngüsüne kadar %80+ sağlık koruma (Yılda ~%5-7 düşüş)',
          cosmeticDurability: 'CNC işlenmiş alüminyum gövde esnemez, menteşe mekanizması 5+ yıl sorunsuz çalışacak kalibrede.',
          hardwareLifespanScore: 9.8,
          riskScore: 1.1,
          riskLevel: 'Düşük Risk',
          riskSummary: 'Sıfır fan gürültüsüyle günlük işler, buz gibi çalışan kasa ve sağlam anakart mimarisiyle en uzun ömürlü dizüstüdür.'
        }
      };

    case 'prod-sony-wh1000xm5':
      return {
        chronicIssues: [
          {
            id: 'ci-xm5-1',
            title: 'Katlanamayan Kafa Bandı Tasarımı',
            severity: 'medium',
            frequencyRate: 30,
            status: 'ongoing',
            statusLabel: 'Tasarım Özelliği',
            description: 'XM4 modelinde olan içe katlanma mekanizması XM5te kaldırılarak döner menteşe yapısına geçildi, çanta boyutu daha geniş.',
            workaroundOrAdvice: 'Kendi koruma çantası ile taşınması tavsiye edilir, çantaya dik basıldığında menteşe gerilimini önler.'
          },
          {
            id: 'ci-xm5-2',
            title: 'Yaz Sıcağında Kulak Pedi Terletmesi',
            severity: 'low',
            frequencyRate: 25,
            status: 'ongoing',
            statusLabel: 'Sentetik Deri Yapısı',
            description: 'ANC yalıtımı için kullanılan yumuşak sentetik deri pedler 28°C üzeri sıcak havalarda ve yürüyüşlerde terletme yapabilir.',
            workaroundOrAdvice: 'Açık hava yürüyüşlerinde ara sıra hava aldırmak veya havalandırmalı ortamda kullanmak önerilir.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 81,
          avgRepairDays: '7-12 İş Günü',
          warrantyBadge: '2 Yıl Sony Eurasia / Yetkili Servis Garantili',
          commonServiceFeedback: 'Batarya ve sürücü problemlerinde garanti kapsamında değişim yapılır, menteşe kırılmalarında kullanıcı hatası incelemesi titizdir.',
          userRightsScore: 8.0,
          partsAvailability: 'Orta',
          doaReplacementEase: 'Orta'
        },
        reliability: {
          batteryHealthDropAfterYear: 'Haftalık 20 saat kullanımda 2 yıl sonunda %85+ batarya sağlığı',
          cosmeticDurability: 'Geri dönüştürülmüş mat plastik yüzey darbelere karşı esnek ancak açık renk modelde kirlenme gösterebilir.',
          hardwareLifespanScore: 8.9,
          riskScore: 2.5,
          riskLevel: 'Düşük Risk',
          riskSummary: 'ANC ve mikrofon algoritması son derece kararlıdır. Tek dikkat edilmesi gereken nokta kafa bandının aşırı bükülmemesidir.'
        }
      };

    case 'prod-roborock-q-revo':
      return {
        chronicIssues: [
          {
            id: 'ci-revo-1',
            title: 'Yüksek Püsküllü Halılarda Paspas Teması',
            severity: 'low',
            frequencyRate: 15,
            status: 'ongoing',
            statusLabel: 'Kullanım Tavsiyesi',
            description: 'Paspas kaldırma yüksekliği 10mm olduğundan 15mm üzeri ultra kalın Shaggy halılarda paspas kenarı halıya hafif sürtünebilir.',
            workaroundOrAdvice: 'Roborock uygulamasından Shaggy halılar için "Halıdan Kaçın" veya "Önce Süpür Sonra Sil" modu seçilebilir.'
          },
          {
            id: 'ci-revo-2',
            title: 'İstasyon Paspas Yıkama Tepsisi Temizliği',
            severity: 'low',
            frequencyRate: 20,
            status: 'ongoing',
            statusLabel: 'Rutin Bakım',
            description: 'İstasyonun altındaki çıkarılabilir yıkama tepsisinde 2-3 haftada bir çamur tortusu birikebilir.',
            workaroundOrAdvice: 'Tepsi tek parça çıkabilmektedir, 3 haftada bir musluk altında 30 saniye durulamak koku ve tıkanmayı tamamen önler.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 84,
          avgRepairDays: '5-9 İş Günü',
          warrantyBadge: '2 Yıl Roborock Türkiye Resmi Distribütör Garantili',
          commonServiceFeedback: 'Su pompası ve LiDAR sensör bakımları yetkili servislerce hızlı çözülmektedir. Sarf malzemeleri (fırça, filtre) piyasada bol bulunur.',
          userRightsScore: 8.6,
          partsAvailability: 'Yuksek',
          doaReplacementEase: 'Kolay'
        },
        reliability: {
          batteryHealthDropAfterYear: 'Haftada 4 tam ev temizliğinde 3 yıl sonunda %80+ kapasite koruma',
          cosmeticDurability: 'Tamamen kauçuk ana fırça saç dolanmasını %90 engeller, fırça motoru ömrünü 2 katına çıkarır.',
          hardwareLifespanScore: 9.3,
          riskScore: 1.9,
          riskLevel: 'Düşük Risk',
          riskSummary: 'Döner çift paspas sistemi titreşimli modellere göre daha az mekanik zorlanma yaşar ve arıza oranı çok düşüktür.'
        }
      };

    default:
      return {
        chronicIssues: [
          {
            id: `ci-${productId}-1`,
            title: 'Yüksek Yük Altında Fan ve Sıcaklık Dengesi',
            severity: 'low',
            frequencyRate: 8,
            status: 'ongoing',
            statusLabel: 'Normal Çalışma Karakteristiği',
            description: 'Maksimum güç modunda hafif fan sesi duyulabilir, termal kısma eşiği güvenli seviyededir.',
            workaroundOrAdvice: 'Cihazın hava kanallarını kapatmayacak şekilde düz zemin üzerinde kullanılması önerilir.'
          }
        ],
        warranty: {
          serviceSatisfactionScore: 86,
          avgRepairDays: '4-8 İş Günü',
          warrantyBadge: '2 Yıl Resmi Distribütör ve İthalatçı Güvencesi',
          commonServiceFeedback: 'Yetkili servis süreçleri standart Tüketici Hakları mevzuatına uygun şekilde yürütülmektedir.',
          userRightsScore: 8.7,
          partsAvailability: 'Yuksek',
          doaReplacementEase: 'Kolay'
        },
        reliability: {
          batteryHealthDropAfterYear: 'Standart kullanımda yılda ortalama %8-10 kapasite değişimi',
          cosmeticDurability: 'Kasa işçiliği ve malzeme kalitesi sınıf standartlarının üzerindedir.',
          hardwareLifespanScore: 9.0,
          riskScore: 2.0,
          riskLevel: 'Düşük Risk',
          riskSummary: 'Kritik donanımsal anakart veya panel arızası bildirilmemiştir.'
        }
      };
  }
}

// 2. ASK CONSENSUS Q&A ENGINE (Yapay Zeka Destekli Ürün Asistanı)
export function answerConsensusQuestion(product: ProductDetailData, question: string): AskConsensusQuestionResponse {
  const q = question.toLowerCase();

  // HEATING & THERMAL
  if (q.includes('ısın') || q.includes('sicak') || q.includes('fan') || q.includes('terle') || q.includes('ısı')) {
    if (product.categoryId === 'akilli-telefonlar') {
      return {
        question,
        directVerdict: 'EVET',
        directVerdictLabel: 'Normal Kullanımda Isınmıyor, Ağır Oyunda Ilık',
        verdictTone: 'positive',
        summary: `Topluluk ve teknoloji kanallarının 2.400+ test verisine göre ${product.name}, günlük sosyal medya, 4K video kaydı ve gezinmede tamamen serin kalmaktadır. 45 dakika üzeri kesintisiz Genshin Impact / PUBG gibi ağır oyunlarda maksimum 41.5°C sıcaklığa ulaşmakta ve termal kısma (throttling) yapmamaktadır.`,
        keyFindings: [
          'Günlük kullanımda sıcaklık 32-34°C seviyesinde seyreder.',
          'Gelişmiş grafit/buhar odası soğutması ısıyı homojen dağıtır, elde rahatsızlık vermez.',
          'Hızlı şarj sırasında ilk 15 dakika 38°C civarına çıkması normal kabul edilmektedir.'
        ],
        quotes: [
          {
            sourceName: 'DonanımHaber Forum',
            sourceType: 'TECH_FORUM',
            quote: 'Cihazı 3 aydır kullanıyorum, eski modeldeki gibi el yakan bir durum kesinlikle yok. 1 saat kesintisiz 4K HDR video çektim sadece ılıklaştı.',
            sentiment: 'POSITIVE',
            relevance: 'Yüksek Doğruluk'
          },
          {
            sourceName: 'Reddit r/gadgets',
            sourceType: 'SOCIAL_COMMUNITY',
            quote: 'Thermal stability is much better than previous gen. No aggressive frame drop during extended gaming sessions.',
            sentiment: 'POSITIVE',
            relevance: 'Doğrulanmış Test'
          }
        ],
        confidenceScore: 96
      };
    } else if (product.categoryId === 'kulakliklar') {
      return {
        question,
        directVerdict: 'KISMEN',
        directVerdictLabel: 'Yaz Sıcağında ve Sporda Terletme Yapabilir',
        verdictTone: 'warning',
        summary: `${product.name} aktif gürültü engelleme (ANC) performansını maksimize etmek için hava sızdırmaz sentetik deri pedler kullanır. 25°C üzeri açık havada veya tempolu yürüyüşlerde 1 saat sonrasında kulak çevresinde hafif nemlenme yapabilir; klimalı ofis/ev ortamında ise son derece konforludur.`,
        keyFindings: [
          'Ses yalıtımı için sıkı oturan pedler hava akışını sınırlar.',
          'Ofis, uçak ve ev ortamında 5-6 saat kesintisiz kullanımda baskı yapmaz.',
          'Ağır spor salonu kardiyosu için TWS kulak içi modeller daha uygundur.'
        ],
        quotes: [
          {
            sourceName: 'Ekşi Sözlük',
            sourceType: 'SOCIAL_COMMUNITY',
            quote: 'Ofiste sabahtan akşama kadar kulağımda, kafa bandı çok hafif olduğu için hissetmiyorum. Ama temmuz sıcağında dışarıda yürürken pedler terletiyor.',
            sentiment: 'NEUTRAL',
            relevance: 'Gerçek Kullanıcı'
          }
        ],
        confidenceScore: 94
      };
    } else {
      return {
        question,
        directVerdict: 'EVET',
        directVerdictLabel: 'Mükemmel Termal Verimlilik ve Sessiz Çalışma',
        verdictTone: 'positive',
        summary: `${product.name}, yük altındayken bile son derece optimize bir fan eğrisi sunar. Ofis işleri, kodlama ve günlük kullanımda fanlar tamamen kapalı veya sıfır desibel seviyesinde çalışır.`,
        keyFindings: [
          'Günlük işlerde sıfır ses (0 dB).',
          'Uzun render ve ağır yük altında dahi klavye bölgesi 38°C altında kalır.',
          'Güç tüketimi/performans eğrisi sınıfının en iyisidir.'
        ],
        quotes: [
          {
            sourceName: 'YouTube İncelemeleri (Murat Gamsız)',
            sourceType: 'VIDEO_REVIEWS',
            quote: 'Isınma ve fan gürültüsü konusunda piyasanın en huzurlu cihazı. Fan açtığında bile ses frekansı rahatsız etmiyor.',
            sentiment: 'POSITIVE',
            relevance: 'Uzman İncelemesi'
          }
        ],
        confidenceScore: 97
      };
    }
  }

  // BATTERY & CHARGING
  if (q.includes('pil') || q.includes('batarya') || q.includes('sarj') || q.includes('şarj') || q.includes('dayan')) {
    return {
      question,
      directVerdict: 'EVET',
      directVerdictLabel: '1.5 Günü Rahat Çıkarır, Yoğun Kullanımda 1 Tam Gün',
      verdictTone: 'positive',
      summary: `Konsensüs verilerine göre ${product.name}, ortalama 7.5 - 9.5 saat Ekran Açık Süresi (SoT) sunmaktadır. Sabah %100 şarjla evden çıktığınızda yoğun kamera, 5G veri, navigasyon ve sosyal medya kullanımına rağmen gece %25-30 batarya ile günü tamamlamaktadır.`,
      keyFindings: [
        'Karma kullanımda 8+ saat ekran süresi.',
        'Gece bekleme modunda (standby) 8 saatte sadece %2-3 pil tüketimi.',
        'Hızlı şarj ile 30 dakikada yaklaşık %55-65 dolum seviyesine ulaşır.'
      ],
      quotes: [
        {
          sourceName: 'Hepsiburada Doğrulanmış Alıcı',
          sourceType: 'ECOMMERCE_REVIEWS',
          quote: 'Şarjı gerçekten efsane. Sabah 8de %100 alıyorum, iş yerinde sürekli hotspot ve mail açık, eve geldiğimde %40 kalmış oluyor.',
          sentiment: 'POSITIVE',
          relevance: 'Doğrulanmış Alıcı'
        },
        {
          sourceName: 'Reddit r/technews',
          sourceType: 'SOCIAL_COMMUNITY',
          quote: 'Battery life exceeded my expectations. Easily a two-day phone on light to moderate usage.',
          sentiment: 'POSITIVE',
          relevance: 'Global Konsensüs'
        }
      ],
      confidenceScore: 98
    };
  }

  // GAMING / PERFORMANCE / VIDEO EDITING
  if (q.includes('oyun') || q.includes('fps') || q.includes('render') || q.includes('kurgu') || q.includes('performans') || q.includes('kasma') || q.includes('donma')) {
    return {
      question,
      directVerdict: 'EVET',
      directVerdictLabel: 'En Yüksek Ayarlarda Akıcı ve Takılmasız',
      verdictTone: 'positive',
      summary: `${product.name} donanım mimarisi ve grafik işlemcisiyle piyasadaki tüm güncel oyun ve render yüklerini en üst ayarlarda 60-120 FPS sabit akıcılıkla çalıştırır. Isınmaya bağlı ani kare düşüşü (stuttering) gözlenmemiştir.`,
      keyFindings: [
        'Ağır 3D oyunlarda 60-120 FPS kararlı kare hızı.',
        '4K ProRes / H.265 video kurgusu ve renk derecelendirmede anlık önizleme.',
        'Arka planda 15+ uygulama açıkken bellekten yeniden yükleme yapmaz.'
      ],
      quotes: [
        {
          sourceName: 'DonanımHaber Video İnceleme',
          sourceType: 'VIDEO_REVIEWS',
          quote: 'İşlemci gücü o kadar yüksek ki, en zorlayıcı sahnelerde bile kare hızı düz bir çizgi gibi sabit kalıyor.',
          sentiment: 'POSITIVE',
          relevance: 'Benchmark Testi'
        }
      ],
      confidenceScore: 95
    };
  }

  // EYE STRAIN / GLASSES / ERGONOMICS
  if (q.includes('gözlük') || q.includes('göz') || q.includes('ergonomi') || q.includes('ağrı') || q.includes('ağırlık') || q.includes('konfor')) {
    return {
      question,
      directVerdict: 'EVET',
      directVerdictLabel: 'Gözlükle ve Uzun Süreli Kullanımda Son Derece Konforlu',
      verdictTone: 'positive',
      summary: `Topluluk geri bildirimlerine göre ${product.name}, ağırlık dağılımı ve ergonomik kavrama noktaları sayesinde gözlük saplarına ekstra baskı uygulamaz. Ekran panelinde yüksek PWM karartma frekansı ve mavi ışık filtresi göz yorgunluğunu minimize eder.`,
      keyFindings: [
        'Optimum yastıklama ve dengeli kafa/avuç temas yüzeyi.',
        'Flicker-free (titreşimsiz) panel teknolojisi ile gece okumalarında gözü yormaz.',
        'Hafifletilmiş gövde yapısı boyun/bilek stresini azaltır.'
      ],
      quotes: [
        {
          sourceName: 'Amazon TR Yorumları',
          sourceType: 'ECOMMERCE_REVIEWS',
          quote: 'Gözlük kullanan biriyim, kalın kemik çerçeveli gözlüğümle bile 4 saat aralıksız taktım en ufak ağrı sızı yapmadı.',
          sentiment: 'POSITIVE',
          relevance: 'Kullanıcı Deneyimi'
        }
      ],
      confidenceScore: 93
    };
  }

  // DEFAULT / GENERAL QUESTIONS
  return {
    question,
    directVerdict: 'EVET',
    directVerdictLabel: 'Konsensüs Verilerine Göre Kesinlikle Tavsiye Ediliyor',
    verdictTone: 'positive',
    summary: `${product.name} hakkında incelenen 1.800+ kullanıcı deneyimi ve uzman testine göre sorulan kriterde cihaz sınıf standartlarının oldukça üzerinde bir memnuniyet puanına (%${Math.round(product.score?.positiveRatio || 88)}) sahiptir.`,
    keyFindings: [
      `Kullanıcıların %${Math.round(product.score?.positiveRatio || 88)}'i bu özelliğin beklentilerini aştığını belirtmektedir.`,
      'Donanım kalitesi ve yazılım stabilitesi uzun vadeli memnuniyet sunar.',
      'Kronik bir arıza veya kullanım engeli tespit edilmemiştir.'
    ],
    quotes: [
      {
        sourceName: 'NeDiyor Topluluk Konsensüsü',
        sourceType: 'SOCIAL_COMMUNITY',
        quote: `${product.name} genel malzeme kalitesi, güvenilirlik ve kullanıcı deneyimi açısından kategorisinin en çok önerilen modelleri arasındadır.`,
        sentiment: 'POSITIVE',
        relevance: 'Genel Konsensüs'
      }
    ],
    confidenceScore: 91
  };
}

// 3. COMMUNITY POLL ENGINE (Satın Alınır mı? Canlı Nabız)
const communityPollStore: Record<string, { buy: number; wait: number; skip: number }> = {
  'prod-iphone-16-pro': { buy: 1840, wait: 620, skip: 210 },
  'prod-s24-ultra': { buy: 2150, wait: 410, skip: 140 },
  'prod-macbook-pro-m3': { buy: 1420, wait: 310, skip: 85 },
  'prod-sony-wh1000xm5': { buy: 980, wait: 390, skip: 110 },
  'prod-roborock-q-revo': { buy: 1670, wait: 280, skip: 65 },
  'prod-ipad-pro-m4': { buy: 1120, wait: 530, skip: 180 },
  'prod-pixel-9-pro': { buy: 640, wait: 290, skip: 120 }
};

export function getProductPollStats(productId: string): CommunityPollStats {
  const store = communityPollStore[productId] || { buy: 420, wait: 150, skip: 60 };
  const total = store.buy + store.wait + store.skip;
  const buyPct = Math.round((store.buy / total) * 100);
  const waitPct = Math.round((store.wait / total) * 100);
  const skipPct = 100 - buyPct - waitPct;

  let verdict = 'Ezici Çoğunluk "Kesinlikle Alınır" Diyor';
  if (buyPct < 55 && waitPct > 30) {
    verdict = 'Kullanıcılar Kampanya / İndirim Beklenmesini Öneriyor';
  } else if (skipPct > 35) {
    verdict = 'Fiyat / Performans Sebebiyle Alternatiflere Yönelme Var';
  }

  return {
    productId,
    totalVotes: total,
    buyCount: store.buy,
    waitCount: store.wait,
    skipCount: store.skip,
    buyPercentage: buyPct,
    waitPercentage: waitPct,
    skipPercentage: skipPct,
    communityVerdict: verdict,
    topAlternativeSuggested: productId === 'prod-iphone-16-pro' ? 'Samsung Galaxy S24 Ultra' : 'Apple iPhone 16 Pro'
  };
}

export function voteProductPoll(productId: string, choice: 'buy' | 'wait' | 'skip'): CommunityPollStats {
  if (!communityPollStore[productId]) {
    communityPollStore[productId] = { buy: 420, wait: 150, skip: 60 };
  }
  communityPollStore[productId][choice] += 1;
  const stats = getProductPollStats(productId);
  stats.userVotedChoice = choice;
  return stats;
}

// 4. UPGRADE ADVISOR ENGINE ("Yükseltmeye Değer mi?")
export function generateUpgradeAdvice(fromProduct: ProductDetailData, toProduct: ProductDetailData): UpgradeAdviceResponse {
  // Calculate relative age/generation jump
  const fromYear = fromProduct.releaseYear || 2021;
  const toYear = toProduct.releaseYear || 2024;
  const yearDiff = Math.max(1, toYear - fromYear);

  const oldResale = fromProduct.priceInfo ? Math.round(fromProduct.priceInfo.currentPrice * 0.45) : 22000;
  const newPrice = toProduct.priceInfo?.currentPrice || 75000;
  const netCost = Math.max(0, newPrice - oldResale);

  let verdict: 'KESINLIKLE_DEGER' | 'DUSUNULEBILIR' | 'DEGECEK_KADAR_DEGIL' | 'GECILMEMELI' = 'KESINLIKLE_DEGER';
  let verdictTitle = `${yearDiff} Nesillik Devasa Sıçrama: Kesinlikle Yükseltmeye Değer!`;
  let recPct = 88;
  let costRating: 'Çok Karlı' | 'Dengeli' | 'Pahalı Yükseltme' = 'Dengeli';

  if (yearDiff >= 3) {
    verdict = 'KESINLIKLE_DEGER';
    verdictTitle = `${yearDiff} Yıllık Büyük Dönüşüm: Kesinlikle Yükseltmeye Değer!`;
    recPct = 92;
    costRating = 'Çok Karlı';
  } else if (yearDiff === 2) {
    verdict = 'DUSUNULEBILIR';
    verdictTitle = 'Belirgin Farklar Var: Bütçeniz Uygunsa Geçiş Mantıklı';
    recPct = 72;
    costRating = 'Dengeli';
  } else {
    // 1 year difference
    verdict = 'DEGECEK_KADAR_DEGIL';
    verdictTitle = 'Yalnızca Küçük Revizyonlar: Mevcut Cihazınızı Korumanız Önerilir';
    recPct = 34;
    costRating = 'Pahalı Yükseltme';
  }

  const improvements = [
    {
      category: 'Ekran & Akıcılık',
      iconName: 'Sparkles',
      title: 'Ekran Parlaklığı & 120Hz Pro Akıcılık',
      oldValue: `${fromProduct.name}: 800-1200 nit, 60Hz Standart`,
      newValue: `${toProduct.name}: 2000-2600 nit Dış Mekan, 1-120Hz LTPO`,
      improvementScore: yearDiff >= 3 ? 9.5 : 7.5,
      importance: 'critical' as const,
      description: 'Güneş ışığı altında ekran okunabilirliği iki katına çıkar, arayüz ve kaydırma animasyonlarında gözle görülür hız hissi oluşur.'
    },
    {
      category: 'Kamera & Video',
      iconName: 'Camera',
      title: 'Sensör Boyutu, Gece Modu & 5x Optik Zoom',
      oldValue: `${fromProduct.name}: 12MP Klasik Sensör, 2x-3x Dijital Zoom`,
      newValue: `${toProduct.name}: 48MP/200MP Fusion Sensör, 5x Optik Periskop Zoom, 4K 120fps`,
      improvementScore: 9.2,
      importance: 'critical' as const,
      description: 'Düşük ışık fotoğraflarında gren (noise) tamamen kaybolur, uzaktaki nesneler kristal netliğinde çekilir.'
    },
    {
      category: 'Batarya & Isı Yönetimi',
      iconName: 'BatteryCharging',
      title: 'Pil Dayanımı & Verimli Çip Mimarisi',
      oldValue: `${fromProduct.name}: ~5.5 - 6.5 Saat Ekran Süresi`,
      newValue: `${toProduct.name}: ~8.5 - 10 Saat Ekran Süresi (+%45 Artış)`,
      improvementScore: 8.8,
      importance: 'high' as const,
      description: 'Yeni nesil 3nm işlemci sayesinde cihaz gün boyu ılık kalır ve akşam priz arama stresi son bulur.'
    },
    {
      category: 'Bağlantı & Şarj',
      iconName: 'Zap',
      title: 'Modern Bağlantı (USB-C 3.0 / Wi-Fi 7)',
      oldValue: `${fromProduct.name}: Lightning / USB 2.0 (480 Mbps)`,
      newValue: `${toProduct.name}: USB-C 10 Gbps + Wi-Fi 7 + Qi2 Kablosuz`,
      improvementScore: 8.4,
      importance: 'moderate' as const,
      description: 'Tek bir Type-C kablosuyla bilgisayar, tablet ve telefonu şarj edebilme ve devasa dosya aktarım hızı.'
    }
  ];

  const unchangedAspects = [
    'Günlük WhatsApp mesajlaşması, bankacılık ve temel sosyal medya gezintisi hızı neredeyse aynı kalacaktır.',
    'Cihazın temel işletim sistemi arayüzü ve uygulama ekosistemi aşina olduğunuz düzendedir.',
    'Arama kalitesi ve hoparlör maksimum ses yüksekliği benzer düzeydedir.'
  ];

  const targetUsers = [
    {
      userType: 'Fotoğraf, Video & İçerik Üreticileri',
      shouldUpgrade: true,
      reason: 'Yeni kamera sensörü, RAW çekim hızı ve 4K 120fps video yeteneği iş akışını doğrudan profesyonel seviyeye taşır.'
    },
    {
      userType: 'Mobil Oyuncular & Ağır Kullanıcılar',
      shouldUpgrade: true,
      reason: 'Işın izleme (Ray Tracing) ve termal soğutma sayesinde en ağır oyunlarda sıfır takılma yaşanır.'
    },
    {
      userType: 'Sadece Sosyal Medya & Günlük Arama Yapanlar',
      shouldUpgrade: yearDiff >= 3,
      reason: yearDiff >= 3 ? 'Eski cihazın pili yıprandığı ve güvenlik güncellemeleri biteceği için geçiş faydalıdır.' : 'Mevcut cihazınız günlük ihtiyaçları fazlasıyla karşılamaktadır.'
    }
  ];

  return {
    fromProduct,
    toProduct,
    verdict,
    verdictTitle,
    recommendationPercentage: recPct,
    summary: `${fromProduct.name} modelinden ${toProduct.name} modeline geçiş, özellikle ${improvements[0].category.toLowerCase()} ve ${improvements[1].category.toLowerCase()} tarafında çağ atlatacaktır. Konsensüsün %${recPct}'i bu yükseltmeyi tavsiye etmektedir.`,
    estimatedOldDeviceResaleValue: oldResale,
    newDevicePrice: newPrice,
    netUpgradeCost: netCost,
    costValueRating: costRating,
    keyImprovements: improvements,
    unchangedAspects,
    targetUserTypes: targetUsers
  };
}

// 5. DEALS & LOWEST PRICE RADAR ENGINE (F/P Fırsat & Dip Fiyat Radarı)
export function getDealsRadar(allProducts: ProductDetailData[]): DealsResponse {
  const deals: DealItem[] = [
    {
      id: 'deal-1',
      product: allProducts.find(p => p.id === 'prod-s24-ultra') || allProducts[0],
      discountPercentage: 11,
      discountAmount: 7500,
      currentPrice: 67499,
      previousPrice: 74999,
      storeName: 'Hepsiburada',
      storeUrl: 'https://www.hepsiburada.com',
      isAllTimeLowest: true,
      isRealDiscount: true,
      discountTag: 'Dip Fiyat',
      expiresInHours: 18
    },
    {
      id: 'deal-2',
      product: allProducts.find(p => p.id === 'prod-roborock-q-revo') || allProducts[1],
      discountPercentage: 14,
      discountAmount: 4500,
      currentPrice: 28999,
      previousPrice: 33499,
      storeName: 'Amazon TR',
      storeUrl: 'https://www.amazon.com.tr',
      isAllTimeLowest: true,
      isRealDiscount: true,
      discountTag: 'Üstün F/P',
      expiresInHours: 24
    },
    {
      id: 'deal-3',
      product: allProducts.find(p => p.id === 'prod-sony-wh1000xm5') || allProducts[2],
      discountPercentage: 16,
      discountAmount: 2600,
      currentPrice: 13899,
      previousPrice: 16499,
      storeName: 'Trendyol',
      storeUrl: 'https://www.trendyol.com',
      isAllTimeLowest: false,
      isRealDiscount: true,
      discountTag: 'Günün Fırsatı',
      expiresInHours: 12
    },
    {
      id: 'deal-4',
      product: allProducts.find(p => p.id === 'prod-iphone-16-pro') || allProducts[3],
      discountPercentage: 5,
      discountAmount: 4500,
      currentPrice: 81499,
      previousPrice: 85999,
      storeName: 'Amazon TR',
      storeUrl: 'https://www.amazon.com.tr',
      isAllTimeLowest: true,
      isRealDiscount: true,
      discountTag: 'Flaş İndirim',
      expiresInHours: 8
    }
  ];

  // Add any other products that have active offers
  for (const prod of allProducts) {
    if (!deals.some(d => d.product.id === prod.id) && prod.priceInfo && prod.priceInfo.originalPrice && prod.priceInfo.originalPrice > prod.priceInfo.currentPrice) {
      const discountAmount = prod.priceInfo.originalPrice - prod.priceInfo.currentPrice;
      const discountPct = Math.round((discountAmount / prod.priceInfo.originalPrice) * 100);
      if (discountPct >= 4) {
        deals.push({
          id: `deal-${prod.id}`,
          product: prod,
          discountPercentage: discountPct,
          discountAmount: discountAmount,
          currentPrice: prod.priceInfo.currentPrice,
          previousPrice: prod.priceInfo.originalPrice,
          storeName: prod.priceInfo.offers[0]?.storeName || 'Amazon TR',
          storeUrl: prod.priceInfo.offers[0]?.url || 'https://www.amazon.com.tr',
          isAllTimeLowest: prod.priceInfo.currentPrice <= prod.priceInfo.lowestPrice,
          isRealDiscount: true,
          discountTag: discountPct > 12 ? 'Dip Fiyat' : 'Üstün F/P',
          expiresInHours: 36
        });
      }
    }
  }

  const allTimeCount = deals.filter(d => d.isAllTimeLowest).length;
  const realCount = deals.filter(d => d.isRealDiscount).length;

  return {
    totalDeals: deals.length,
    allTimeLowestCount: allTimeCount,
    verifiedRealDiscountCount: realCount,
    deals
  };
}
