# NeDiyor Mobile App — Design System & UX Specification

> Status: Proposed / Implementation-ready
> Product: NeDiyor
> Tagline: Binlerce görüş. Tek net cevap.

## 1. Product vision

NeDiyor mobile must NOT feel like a smaller website. It should feel like a personal product decision assistant:

1. Search a product.
2. Understand what real people say.
3. See the AI consensus.
4. Understand the important positives and negatives.
5. Check current price and price history.
6. Compare alternatives.
7. Save the product or create an alert.
8. Make a decision.

North-star promise: Ben onlarca siteyi gezmek istemiyorum. NeDiyor bana insanların gerçekten ne dediğini ve bunun satın alma kararına ne anlama geldiğini söylesin.

## 2. Design direction

Visual personality: Editorial + Intelligence + Trust + Premium Utility.

Reference qualities: Apple simplicity, Google information hierarchy, Linear polish, Airbnb card clarity, modern finance data visualization, premium commerce imagery.

Do NOT make the app look like a generic AI chatbot, marketplace, scraping dashboard, crypto dashboard, or SaaS admin panel.

Existing web functionality is rich: AI summary, consensus, sources, mentions, price history, chronic issues, warranty, community reviews, alternatives, comparison, product finder and deal radar. Mobile must reorganize this data around decisions rather than shrink the desktop UI.

## 3. UX principles

### P0 — Decision first
Every important product screen must answer: What is it? What do people think? Why? Who should buy it? Who should avoid it? Is the current price reasonable? What is the biggest risk? What is the best alternative?

### P0 — Value before account creation
Users can search, open products and read the high-level consensus without registration. Ask for authentication only when saving, creating alerts, voting, reviewing or syncing preferences.

### P0 — Progressive disclosure
Order information as: Decision → Evidence → Details → Raw sources.

### P0 — Trust is a feature
Every AI conclusion should expose source count, evidence type, confidence, last updated date and an expandable source trail.

### P0 — Thumb-first
Minimum interactive target: 44 × 44 pt. Prefer bottom sheets, segmented controls, horizontal carousels, swipeable galleries and sticky bottom actions.

## 4. Recommended mobile stack

React Native + Expo + TypeScript.

Recommended supporting technologies: Expo Router, Reanimated, Gesture Handler, NativeWind or a small custom token layer, TanStack Query, Zustand, FlashList, expo-image, expo-notifications, expo-secure-store, expo-haptics and expo-linking.

Reuse the existing NeDiyor backend. Do not duplicate scoring or AI logic in the mobile client.

## 5. Information architecture

Use exactly five primary destinations:

1. Ana Sayfa
2. Keşfet
3. Fırsatlar
4. Kıyasla
5. Takibim

Rename the current mobile 'Arama' destination to 'Keşfet'. Search is a function; Keşfet is a destination containing search, categories, trends, brands and popular questions.

Bottom navigation remains persistent on primary screens and is hidden on onboarding, authentication, full-screen image viewer, focused AI flow and external purchase handoff.

## 6. Home

Goal: answer 'Bugün ne almak / araştırmak istiyorsun?'

Order:
1. Header
2. Large natural-language search
3. Quick decision tools
4. Trending products
5. Real deals
6. Categories
7. Community questions
8. Recently updated consensus

Search examples:
- 50 bin TL altı iyi telefon
- Sessiz robot süpürge
- MacBook Air mi Pro mu?
- iPhone 16 Pro alınır mı?

Quick tools should be horizontal snap cards:
- AI Ürün Bulucu
- Fırsat Radarı
- Yükseltme Danışmanı
- Kıyasla

Do not reproduce the current four-column desktop cards on mobile.

## 7. Product card

Required:
- product image
- brand
- product name
- NeDiyor score
- opinion count
- decision status
- current price when available
- save action

Cards are for discovery, not analysis. Avoid showing ten metrics on a card.

## 8. Product detail — core experience

This is the signature NeDiyor screen.

First viewport:
- product image
- brand and model
- score
- opinion count
- decision hero

Decision hero example:

NE DİYOR?
8.7 / 10
✓ ALINIR
İnsanların genel deneyimi olumlu. Özellikle kamera, performans ve pil öne çıkıyor.
Güven: Yüksek · %91
34 kaynak · 12.4K görüş

Use four decision states from the current model:
- ALINIR
- DÜŞÜNÜLEBİLİR
- ALTERNATİFLERE BAK
- YETERSİZ VERİ

Never rely on color alone. Every state needs icon + label + accessible text.

## 9. AI summary

Convert the existing AISummary into a highly scannable module:

NeDiyor AI
Kısaca: Bu model performans ve kamera tarafında güçlü. En büyük soru işareti fiyatı.
✓ Öne çıkanlar: Kamera, Performans, Ekran
! Dikkat: Fiyat, Isınma
Kimler için? Yoğun kullanım isteyenler.
Kimler için değil? Fiyat/performans arayanlar.

Primary CTA: Neden böyle?

AI must be direct, concise, evidence-aware and non-hype. Prefer 'Binlerce görüşün ortak noktası şu...' over generic AI boilerplate.

## 10. Evidence and sources

Trust module:

GÜVENİLİRLİK
█████████░ Yüksek
%91 güven
34 kaynak · 12.420 görüş
Son analiz: 2 saat önce
[ Kaynakları gör ]

Source explorer should group evidence by e-commerce reviews, communities, videos, forums and complaint platforms.

Every source item should expose source name, type, mention count and original link when permitted.

Never fabricate reviews, prices, source counts, confidence or quotes.

## 11. Topics

Use compact topic rows:

ÖNE ÇIKANLAR
📷 Kamera 9.2
⚡ Performans 9.0
🔋 Pil 8.5
🖥 Ekran 8.8

Negative evidence must be equally accessible:

DİKKAT EDİLEN KONULAR
⚠ Fiyat
⚠ Isınma
⚠ Ağırlık

## 12. Consensus Q&A

Make this a signature feature rather than a generic chatbot.

Entry: Bu ürün hakkında bir şey sor

Suggested questions:
- Uzun vadede alınır mı?
- Pil nasıl?
- Oyun için uygun mu?
- Öğrenci için mantıklı mı?
- Kamerası gerçekten iyi mi?

Answer format:

SORU: Uzun vadede alınır mı?
KISMEN
Kullanıcıların çoğu performanstan memnun; ancak uzun kullanımda ısınma ve pil konusunda bazı şikayetler var.
Güven: %86
[ Kanıtları göster ]

Every answer exposes conclusion, reasoning, evidence, confidence and source trail.

## 13. Price

Use the existing PriceInfo model.

Show:
- current price
- lowest price
- historical low
- F/P score
- current price attractiveness
- price history
- price alert

Price alert bottom sheet:

FİYAT ALARMI
Mevcut: 54.999 TL
[ 49.999 TL ]
Bunun altına düşünce sana haber verelim.
[ Alarmı kur ]

Do not use fake countdowns or fake scarcity.

## 14. Alternatives

Show alternative products as decision cards with the reason for similarity.

Example:
Product A — 8.6 — Daha ucuz — Kamera biraz daha zayıf
Product B — 8.4 — Daha iyi pil

Do not force a universal winner when the data only supports context-specific differences.

## 15. Comparison

Do not squeeze a desktop table onto a phone.

Step 1: select 2–4 products.
Step 2: horizontal product headers + sticky metric labels.

Metrics:
- NeDiyor score
- F/P
- battery
- camera
- performance
- relevant category features

Include an 'Sadece farkları göster' toggle.

## 16. Deals

Header: Fırsat Radarı — Gerçek indirimleri yakala.

Filter chips:
- Tümü
- Dip Fiyat
- Gerçek İndirim
- Üstün F/P
- Telefon
- Bilgisayar
- Kulaklık

Deal card should show product image, deal type, old price, current price, discount, historical context and external CTA.

Only show expiry information when it is real and sourced.

## 17. Keşfet

Combine:
- natural-language search
- categories
- trending products
- brands
- popular questions

Search autocomplete groups:
Ürünler / Markalar / Kategoriler.

Default results sorting: relevance + NeDiyor score.
Other sorting: relevance, score, opinion count, price, newest, deals.

## 18. Filters

Use a bottom sheet, never a desktop sidebar.

Fields:
- category
- brands
- price range
- minimum score
- decision status
- minimum positive ratio
- minimum mentions
- deals only
- features
- sort

Sticky footer: Sonuçları göster.

## 19. Takibim

Tabs:
- Kaydettiklerim
- Fiyat alarmlarim
- Son baktıklarım
- Karşılaştırmalarım

Empty state must teach the action:
Henüz takip ettiğin ürün yok. Bir ürünün yanındaki ♡ butonuna dokunarak buraya ekleyebilirsin.

## 20. Notifications

Only actionable notifications:
- tracked product reached target price
- new evidence materially changed consensus
- tracked product reached historical low

Avoid engagement bait such as 'NeDiyor'a geri dön!'.

## 21. Product Finder

Make it a short decision wizard:
1. Category
2. Budget
3. Priorities
4. Result

Result example:
#1 Product
%94 uyum
✓ Pil
✓ Kamera
✓ Bütçe
[ Neden? ] [ İncele ]

## 22. Upgrade Advisor

Use before → after comparison.

Example:
MEVCUT: iPhone 15 Pro
YENİ: iPhone 17 Pro
Kamera +18%
Pil +12%
Performans +24%
Tahmini net maliyet 18.500 TL
Karar: DÜŞÜNÜLEBİLİR

Then answer: Bu fark sana değer mi?

## 23. Community Pulse

Ask:
SEN NE DİYORSUN?
Bu ürün alınır mı?
[ ALINIR ] [ İNDİRİM BEKLERİM ] [ ALTERNATİFE BAKARIM ]

After voting show aggregate results and total votes. Avoid unnecessary personal exposure.

## 24. Authentication

Authentication is secondary.

Support existing providers such as Google, Apple and email where backend support exists.

Auth should be requested only when a protected action requires it. Always allow 'Şimdi değil' during onboarding.

## 25. Onboarding

Maximum three screens:
1. Binlerce görüş.
2. Tek net cevap.
3. Ürünleri karşılaştır, fiyatları takip et, daha bilinçli karar ver.

CTA: Keşfetmeye başla
Skip is always visible.

## 26. Visual tokens

Base:
- Background #F8FAFC
- Surface #FFFFFF
- Surface muted #F1F5F9
- Border #E2E8F0
- Text #0F172A
- Secondary #475569
- Muted #64748B

Brand:
- Primary #4F46E5
- Primary dark #3730A3
- Primary soft #EEF2FF

Semantic:
- Positive #16A34A
- Warning #D97706
- Negative #DC2626
- Info #0284C7

Do not make every component colorful. Indigo is the visual anchor.

## 27. Typography

Recommended: Inter or Plus Jakarta Sans. Optional display face: Space Grotesk.

Scale:
- Display 32/36
- H1 28/34
- H2 22/28
- H3 18/24
- Body large 16/24
- Body 14/21
- Small 13/19
- Caption 11/16

## 28. Shape and elevation

Radius:
- card 20px
- large card 24px
- button 14px
- chip 999px
- input 16px
- bottom sheet 28px top corners

Prefer borders and spacing over heavy shadows.

## 29. Motion

Use 150–220ms micro transitions, spring bottom sheets, subtle press states, skeleton shimmer, score number animation and chart reveal.

Do not use excessive parallax, constant pulsing or decorative animations.

Use light haptics for save, vote, alert creation, comparison add and successful actions.

## 30. Loading and error states

Never show blank screens.

Use skeletons for product image, title, score, decision hero and topic rows.

AI loading should communicate actual stages without fake percentage progress:
NeDiyor analiz ediyor...
Görüşler taranıyor
Konular gruplanıyor
Konsensüs hesaplanıyor

Errors preserve user input and provide retry.

## 31. Offline

Cache recent products, recent searches, saved products, last product details and categories.

When offline say clearly that cached prices may not be current.

Secondary API failures must not block the primary product analysis.

## 32. Deep links

Support product, search, comparison, deals and watchlist deep links.

Example route concepts:
- nediyor://urun/{slug}
- nediyor://ara?q=
- nediyor://karsilastir
- nediyor://firsat-radari
- nediyor://takip-listem

## 33. Share cards

Product share card:
NeDiyor
iPhone 17 Pro
8.7 / 10
✓ ALINIR
12.420 görüş · 34 kaynak
Binlerce görüş. Tek net cevap.

The visual must be recognizable as NeDiyor content.

## 34. Accessibility

Required:
- 44pt minimum touch targets
- VoiceOver / TalkBack labels
- Dynamic Type / large font support
- sufficient contrast
- no color-only meaning
- reduced motion support
- semantic headings
- accessible charts
- screen-reader-friendly sheets

## 35. Performance

Targets:
- launch to interactive under 2.5s on modern devices
- prioritize product hero image
- lazy-load secondary modules
- virtualize long lists
- cache API data
- optimistic save/vote interactions
- use resized WebP/AVIF images where supported
- avoid unnecessary re-renders

Performance is part of UX, not a later optimization.

## 36. Analytics

Track:
- app_open
- search_started
- search_submitted
- product_viewed
- product_saved
- price_alert_created
- source_opened
- ai_question_asked
- comparison_started
- comparison_product_added
- deal_opened
- deal_external_click
- finder_started
- finder_completed
- upgrade_started
- community_vote
- review_started
- review_submitted
- notification_opened

Primary funnel:
App Open → Search → Product View → Decision Hero Viewed → Evidence Viewed → Save / Compare / Alert / External Click.

Optimize for decision completion, not session length.

## 37. Content trust rules

Never:
- fabricate review counts
- fabricate sources
- invent prices
- invent availability
- invent confidence
- present AI-generated text as a direct user quote
- hide significant negative evidence
- use fake scarcity
- use fake live visitor counters

Always:
- timestamp data
- identify evidence type
- distinguish AI synthesis from original opinion
- expose uncertainty
- show source count
- preserve original source attribution where appropriate

## 38. Screen inventory

P0:
- Home
- Explore
- Deals
- Compare
- Watchlist
- Search
- Search results
- Filters
- Product detail
- Decision hero
- AI summary
- Topic analysis
- Sources
- Reviews
- Mentions
- Price history
- Alternatives
- Community pulse
- Consensus Q&A
- Product finder
- Upgrade advisor
- Login
- Profile
- Preferences
- Notifications

P1:
- Personalized home
- Recently viewed
- AI question history
- advanced alerts
- brand profiles
- category intelligence

P2:
- collaborative comparisons
- shared decision lists
- personalized recommendations
- advanced deal intelligence
- browser/share extension

## 39. Recommended mobile project structure

mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   ├── deals.tsx
│   │   ├── compare.tsx
│   │   └── watchlist.tsx
│   ├── product/[slug].tsx
│   ├── search/index.tsx
│   ├── finder/
│   ├── upgrade/
│   ├── auth/
│   └── settings/
├── components/
│   ├── product/
│   ├── decision/
│   ├── search/
│   ├── deals/
│   ├── compare/
│   ├── ai/
│   ├── navigation/
│   └── ui/
├── lib/
│   ├── api/
│   ├── analytics/
│   ├── auth/
│   └── storage/
├── hooks/
├── store/
├── theme/
└── types/

## 40. API strategy

Prefer mobile-oriented aggregation endpoints:
- GET /api/mobile/home
- GET /api/mobile/search
- GET /api/mobile/products/:slug
- GET /api/mobile/products/:slug/mentions
- GET /api/mobile/products/:slug/sources
- GET /api/mobile/products/:slug/price
- GET /api/mobile/products/:slug/alternatives
- POST /api/mobile/products/:slug/questions
- GET /api/mobile/deals
- GET /api/mobile/compare
- GET /api/mobile/watchlist
- POST /api/mobile/watchlist
- POST /api/mobile/price-alerts

Product detail should ideally have one primary request and progressive secondary loading.

## 41. Caching

Longer cache: product metadata, brand metadata, historical analysis.
Shorter cache: prices, deals, availability, live community counts.
Use stale-while-revalidate where appropriate.

## 42. Final UX test

Before shipping any screen ask:
1. Can a first-time user understand it in 3 seconds?
2. Is the primary action obvious?
3. Can the user understand the decision without reading everything?
4. Can they see why NeDiyor reached the conclusion?
5. Can they access negative evidence?
6. Can they use it one-handed?
7. Does it remain useful on a slow connection?
8. Does large text remain usable?
9. Is account creation truly necessary?
10. Is AI interpretation clearly distinguished from source data?

If any answer is no, the screen is not ready.

## 43. North-star interaction

I want to buy X.
↓
NeDiyor, insanlar X hakkında gerçekten ne diyor?
↓
8.7 / 10 — ALINIR
↓
Why?
↓
These are the strongest positives and risks.
↓
Is the current price good?
↓
Yes / wait / compare.
↓
I know what to do.

NeDiyor is not a review website inside a mobile wrapper.

**It is a mobile decision engine powered by collective consumer evidence and AI synthesis.**