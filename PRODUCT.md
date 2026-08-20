# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular + TypeScript (fixed by CONSTITUTION.md). No backend/API for v1 — the app reads pre-populated JSON data files directly, kept behind a data-access service layer so a real API can be swapped in later without touching consuming components.

## Users

First-time EV buyers in Denmark. They are early in their research process, juggling YouTube reviews, forum posts, and word-of-mouth, and want a single place to compare pricing, specs, and real-world risk before committing to a purchase.

## Product Purpose

A curated EV research and comparison tool for the Danish market. It lets a buyer enter a budget and desired range and get recommended cars within a tolerance window (not a strict cutoff), filter by features and country of manufacture, compare cars side-by-side with full feature breakdowns, dynamically add/remove features in a comparison to see the resulting price delta across brands, review risk indicators (recalls, battery degradation, resale value), see accurate car images, and jump out to external reviews/forums for deeper research. Success means a buyer can go from "what fits my budget" to a shortlist with real risk and cost context, without hunting across scattered sources.

## Positioning

No single existing source puts Danish EV pricing, specs, and long-term risk indicators (recalls, battery degradation, resale value) side by side with a live, feature-driven price comparison across brands. Competitors are either raw spec databases, YouTube/forum opinion, or dealer sites — none combine tolerance-based recommendation, cross-brand feature-price comparison, and risk indicators in one place scoped to the Danish market.

## Operating Context

- Data is populated offline (researched and written into JSON files ahead of time); the running app never scrapes or fetches live data at runtime.
- Database/data-file updates happen on demand, at whatever cadence is decided later — not a fixed automated schedule.
- Reviews are curated external links (forums/review sites) identified during data population, not authored in-app.

## Capabilities and Constraints

- Budget/range-based recommendations use tolerance windows (e.g. ±50 km, ±50,000 DKK) rather than strict cutoffs.
- Filtering by country of manufacture (Japanese, German, Korean, Chinese, etc.).
- Side-by-side comparison with live feature add/remove and resulting cross-brand price delta; feature categories include security, head-up display, adaptive cruise control, sunroof, sound system, etc. (exact list finalized during data population).
- Risk indicators per car: recall history, battery degradation, resale value.
- Pricing shown as standard market price plus a separate breakdown of additional accessory/service costs.
- No in-app computed rating/score for v1 — ratings stay external, app only links out.
- Warranty & service info is shown per car (vehicle warranty years/km, battery warranty years/km, free service years) — built, not out of scope.
- Exterior color customization is available on the car detail view (per-color price delta, selectable swatches) — built, not out of scope.
- Out of scope for v1: future-potential score, service-extension purchasing (buying an extension, as opposed to showing the included warranty), test-drive booking integration, in-app user-submitted reviews, any runtime scraping.
- Scoped to the Danish market for v1; other markets may be considered later.

## Brand Commitments

Name: **Volt Index**. Tagline: "Electric cars, compared honestly." Locked visual identity (2026-08-20 redesign):
- Palette: warm graphite ink (`#17130F`) as the primary dark, paper white/off-white surfaces, and voltage gold (`#F5B700`) as the sole brand accent — deliberately not the green most EV products default to. Green, amber, and red are reserved as status-only colors (battery health, resale rating, recalls), never used for brand/interactive elements.
- Type: Bricolage Grotesque (display/headlines), Inter Tight (UI/body), JetBrains Mono (all numeric data — prices, ranges, percentages — set tabular).
- Signature motif: a semicircle SVG "charge gauge" (gold arc on a track) standing in for every plain progress bar — range windows, battery-retention percentage — echoing an EV instrument cluster. Logo mark is a bolt icon in a dark circular badge beside the wordmark.
- Voice: direct, plain-spoken, no filler ("Electric cars, compared honestly" — not "Your journey to the perfect EV starts here").

## Evidence on Hand

Car data started as placeholder/fake (see commit "Add browse/filter EV screen with fake data") but has since been through a dedicated verification pass (docs/diary/2026-08-20-data-verification-pass.md and two follow-ups): WLTP range windows, DKK base pricing, and warranty terms were cross-checked against manufacturer and Danish-market sources for the cars then in the dataset. Honda e was removed as discontinued; Mercedes EQA was later removed after being formally retired and replaced by the electric GLA; BYD Atto 3 was updated to the Atto 3 EVO facelift (range, pricing, features, warranty, image). Car images were spot-checked by EXIF date and visually verified for a small risk-selected sample (BYD Atto 3, Polestar 2, Tesla Model 3) after finding stale pre-facelift photos — a full pass across the remaining images has not been done. `colors.json` paint pricing was only sanity-checked at a tier level (~3,500–9,500 DKK for premium colors), not confirmed per brand. Treat current data as **researched, not exhaustively audited** — it is real Danish-market-grounded data, not placeholder, but should not be presented as independently fact-checked line-by-line. See `docs/diary/` for the full record of what was and wasn't verified.

## Product Principles

- Tolerance over strict cutoffs: near-misses on budget/range are surfaced, not hidden, because a rigid filter can exclude the best-fit car for an arbitrary reason.
- Total cost transparency: standard price and add-on costs are always shown separately, never blended into one number.
- Risk is core content, not an afterthought: recall history, battery degradation, and resale value sit alongside specs, not buried in a separate section.
- Curate, don't fabricate: the app links to external reviews/ratings rather than inventing its own score, and offline-populated data must be real by launch, not placeholder.
- Comparison is interactive, not static: buyers can reshape a comparison (add/remove features) and immediately see the cross-brand price consequence.

## Accessibility & Inclusion

No specific requirement established beyond general good accessibility practice.
