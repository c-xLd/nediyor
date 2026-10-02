# API Contract

## Principles

- JSON
- typed request/response schemas
- consistent errors
- pagination
- cache metadata
- source freshness
- no secrets
- idempotency for mutation endpoints where useful

## Core endpoints

GET /api/home
GET /api/search
GET /api/products/:slug
GET /api/products/:slug/mentions
GET /api/products/:slug/sources
GET /api/products/:slug/price
GET /api/products/:slug/alternatives
POST /api/products/:slug/questions
GET /api/deals
GET /api/compare
GET /api/watchlist
POST /api/watchlist
POST /api/price-alerts

## Response contract

Successful responses should have stable domain fields and timestamps.

Derived AI data should contain:
- conclusion
- evidence references
- confidence
- generatedAt
- sourceVersion

## Error contract

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "requestId": "..."
  }
}
```

Do not expose stack traces.

## Pagination

Use cursor pagination for large review/mention feeds.

## Validation

Validate all user input server-side even when client validation exists.

## API versioning

Breaking contracts require a versioned route or migration period.
