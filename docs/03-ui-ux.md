# UI/UX Specification

The complete screen-by-screen specification lives in the root design.md and is mirrored here as the implementation reference for product teams.

## Universal screen contract

Every screen defines:
- purpose
- primary action
- hierarchy
- loading
- empty
- error
- offline
- success
- accessibility
- analytics

## Core screens

### Home
Search first. Quick decision tools second. Discovery and deals follow.

### Search
Full-screen search, autocomplete, natural-language queries, filters and relevance.

### Product
Product identity → decision hero → confidence → AI summary → positives → negatives → topics → price → sources → alternatives.

### Compare
2–4 products, horizontally scrollable headers, sticky metrics, difference mode.

### Deals
Evidence-backed discounts only. No fake urgency.

### Watchlist
Saved products, alerts and recently viewed.

### Product Finder
Short guided decision flow with explicit tradeoffs.

### Upgrade Advisor
Current product → target product → user priority → measurable differences → conditional guidance.

## Interaction rules

- Minimum touch target: 44×44 pt.
- Primary CTA height: 48–52 px.
- Bottom sheets for filters/actions.
- Full-screen flows for search, AI question, finder and image viewer.
- Essential actions cannot be gesture-only.
- Respect reduced motion.

## Trust UI

AI synthesis and original evidence must be visually distinct.

Every important conclusion should expose:
source count, evidence type, confidence and freshness.

## Anti-patterns

Do not use:
- desktop tables squeezed into mobile
- excessive cards
- fake countdowns
- fake review counts
- fake live counters
- generic AI chat as the home screen
- dark patterns
