# Information Architecture

## Top-level web

- /
- /ara
- /urun/:slug
- /karsilastir
- /firsatlar
- /urun-bulucu
- /yukseltme
- /markalar
- /marka/:slug
- /siralamalar
- /kaynaklar
- /takip-listem
- /ayarlar

## Mobile tabs

1. Ana Sayfa
2. Keşfet
3. Fırsatlar
4. Kıyasla
5. Takibim

## Product hierarchy

Product → Decision → Evidence → Topics → Reviews → Price → Sources → Alternatives → Questions.

## Navigation rules

- Root destinations use bottom tabs on mobile.
- Secondary pages use contextual back navigation.
- Product detail owns product-specific actions.
- Search is a global function; Keşfet is a destination.
- Do not duplicate the same feature under multiple primary tabs.

## Deep links

Use stable slug-based links for products and shareable decision pages.

## URL rules

Lowercase, stable, descriptive, Turkish characters normalized, no tracking parameters in canonical URLs.

## State preservation

Back navigation should preserve:
- search query
- filters
- scroll position when practical
- comparison selection
- unfinished finder flow

## Admin

Admin routes are operational and must not appear in public navigation.
