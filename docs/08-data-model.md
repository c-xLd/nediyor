# Data Model

## Core entities

### Product
Identity, brand, category, identifiers, images, metadata, status.

### Brand
Identity, slug, logo, profile, category relationships.

### Source
Provider, type, URL, crawl timestamp, license/provenance metadata.

### Mention
Source reference, product reference, text/summary, topic, sentiment, date, verification state.

### Topic
Name, category, score, evidence counts.

### ProductScore
Overall score, confidence, evidence volume, calculation version.

### AIAnalysis
Conclusion, summary, strengths, weaknesses, audience, evidence references, model/version, generatedAt.

### PriceSnapshot
Product, merchant, price, currency, availability, timestamp.

### Deal
Product, merchant, current price, previous price, deal classification, evidence, validity.

### Review
User/source, product, rating, recommendation, content, pros, cons, usage period, moderation state.

### User
Auth identity, preferences, consent, createdAt, status.

### WatchlistItem
User, product, createdAt.

### PriceAlert
User, product, target price, state, notification settings.

### CommunityVote
User, product, option, createdAt.

## Data integrity

- Products require stable IDs.
- Slugs must be unique.
- Prices require timestamps and currency.
- Source-derived content must retain provenance.
- AI outputs cannot become authoritative source content.

## Mock data

Mock catalog files may exist for development. They must never silently power production screens.

## Versioning

Scoring and AI schemas are versioned so historical results remain explainable.
