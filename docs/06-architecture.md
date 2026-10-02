# Technical Architecture

## Current baseline

The repository currently contains a React/TypeScript frontend, Express server, typed models, API layer, scoring logic and product-specific components.

Do not rewrite the backend solely to introduce mobile.

## Architecture

```
Web / Mobile
     |
     v
API layer
     |
     +--> Product domain
     +--> Search domain
     +--> AI domain
     +--> Price domain
     +--> Community domain
     +--> User domain
     |
     v
Persistence / external data sources
```

## Rules

- Business logic belongs server-side.
- UI components do not calculate authoritative scores.
- API responses must be typed.
- Source provenance travels with derived data.
- External integrations are isolated behind adapters.
- Secrets never reach clients.

## Frontend

Prefer feature-oriented modules:
product, search, compare, deals, finder, upgrade, watchlist, auth.

## Backend

Separate:
- routes
- services
- repositories
- validators
- source adapters
- AI orchestration
- scoring
- cache

## Error boundary

The UI must isolate secondary module failures. A failed price provider must not remove the product decision screen.

## Migration rule

New architecture should be introduced incrementally. Preserve working behavior until replacement is verified.
