# Mobile Application Specification

## Goal

The mobile app is not a web wrapper. It is the fastest path from product question to evidence-backed decision.

## Stack

Recommended:
- React Native
- Expo
- TypeScript
- Expo Router
- Reanimated
- Gesture Handler
- TanStack Query
- Zustand
- FlashList
- expo-image
- expo-notifications
- expo-secure-store
- expo-haptics

## Navigation

Five tabs:
Home, Keşfet, Fırsatlar, Kıyasla, Takibim.

## Mobile-first patterns

Use:
- bottom sheets
- sticky actions
- horizontal rails
- full-screen search
- progressive disclosure
- skeleton loading
- optimistic saves

Avoid:
- desktop sidebars
- dense tables
- tiny controls
- modal stacking

## Offline

Cache recent products, categories, recent searches and watchlist state. Cached prices must be marked as potentially stale.

## Notifications

Only send actionable changes:
- target price reached
- major consensus change
- meaningful deal event

## Deep links

Product, search, deals, compare and watchlist links must open the correct native route.

## Performance targets

- fast interactive launch
- prioritized product hero
- virtualized lists
- lazy secondary modules
- resized images
- minimal JS work

## Mobile QA

Test:
- small iOS
- large iOS
- compact Android
- large Android
- large text
- dark mode
- slow network
- offline
